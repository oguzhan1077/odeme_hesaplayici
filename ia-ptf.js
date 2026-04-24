// ==========================================
// İA-PTF Hesaplama Modülü
// ==========================================

const iaPtfState = {
    rows: [],
    supplierConfig: {}, // { supplierName: { enabled, pricingType, agreementRate, fixedPrice, fixedCurrency } }
    ptfMap: new Map(),  // UTCHourKey -> { priceTRY, priceUsd, priceEur }
    results: { detail: [], summary: [] },
    selectedMonth: null // { year, month } — month 1-indexed
};

function defaultSupplierConfig() {
    return { enabled: true, pricingType: 'ptf_indexed', agreementRate: 0, fixedPrice: null, fixedCurrency: null };
}

const MONTH_NAMES_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

const REQUIRED_COLUMNS = [
    'Tarih',
    'Versiyon',
    'Bölge',
    'Alıcı Organizasyon',
    'Satıcı Organizasyon',
    'İA ID',
    'İA Miktar (MWh)'
];

const DETAIL_DISPLAY_LIMIT = 1000;

// -------- Format Helpers --------

function fmtTL(n) {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function fmtMWh(n) {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(n);
}

// -------- Date Helpers --------

function parseExcelDate(value) {
    if (value instanceof Date) return value;

    if (typeof value === 'number') {
        // Excel serial date: days since 1900-01-01 (with Lotus 1900 leap year bug)
        return new Date((value - 25569) * 86400 * 1000);
    }

    if (typeof value === 'string') {
        // DD.MM.YYYY HH:mm
        const m1 = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2})/);
        if (m1) {
            const [, d, mo, y, h, mi] = m1;
            return new Date(`${y}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}T${h.padStart(2,'0')}:${mi}:00+03:00`);
        }

        // M/D/YY veya M/D/YYYY HH:mm (Excel kısa tarih formatı)
        const m2 = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/);
        if (m2) {
            const [, mo, d, y, h = '0', mi = '00'] = m2;
            const fullYear = y.length === 2 ? (parseInt(y) >= 50 ? '19' + y : '20' + y) : y;
            return new Date(`${fullYear}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}T${h.padStart(2,'0')}:${mi.padStart(2,'0')}:00+03:00`);
        }
    }

    return null;
}

// Unique key for hour-level matching (UTC)
function toUTCHourKey(date) {
    const y = date.getUTCFullYear();
    const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    const h = String(date.getUTCHours()).padStart(2, '0');
    return `${y}-${mo}-${d}T${h}`;
}

// -------- Month Helpers --------

function getUniqueMonths(rows) {
    const seen = new Set();
    const months = [];
    rows.forEach(r => {
        const y = r.tarih.getFullYear();
        const m = r.tarih.getMonth() + 1;
        const key = `${y}-${m}`;
        if (!seen.has(key)) {
            seen.add(key);
            months.push({ year: y, month: m });
        }
    });
    return months.sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
}

function getSuppliersForMonth(rows, year, month) {
    return [...new Set(
        rows
            .filter(r => r.tarih.getFullYear() === year && r.tarih.getMonth() + 1 === month)
            .map(r => r.satici)
    )].sort();
}

function renderMonthSelector(months) {
    const container = document.getElementById('ia-month-selector');
    if (!container) return;
    container.innerHTML = '';

    months.forEach((m, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn me-2 mb-2';
        btn.dataset.year = m.year;
        btn.dataset.month = m.month;
        btn.textContent = `${MONTH_NAMES_TR[m.month - 1]} ${m.year}`;

        btn.addEventListener('click', () => {
            container.querySelectorAll('button').forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-outline-secondary');
            });
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('btn-primary');
            onMonthSelected(m.year, m.month);
        });

        if (i === 0) {
            btn.classList.add('btn-primary');
        } else {
            btn.classList.add('btn-outline-secondary');
        }

        container.appendChild(btn);
    });

    if (months.length > 0) {
        onMonthSelected(months[0].year, months[0].month);
    }
}

function onMonthSelected(year, month) {
    iaPtfState.selectedMonth = { year, month };
    hideEl('ia-results-section');

    const suppliers = getSuppliersForMonth(iaPtfState.rows, year, month);
    suppliers.forEach(s => {
        if (!(s in iaPtfState.supplierConfig)) iaPtfState.supplierConfig[s] = defaultSupplierConfig();
    });

    renderSupplierRates(suppliers);
    showEl('ia-suppliers-section');
    showEl('ia-calculate-section');
}

// -------- Magic Bytes Check --------

function checkMagicBytes(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const b = new Uint8Array(e.target.result);
            resolve(b[0] === 0x50 && b[1] === 0x4B && b[2] === 0x03 && b[3] === 0x04);
        };
        reader.readAsArrayBuffer(file.slice(0, 4));
    });
}

// -------- Excel Parse & Validate --------

function parseAndValidateExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const wb = XLSX.read(e.target.result, {
                    cellFormula: false,
                    cellHTML: false,
                    cellStyles: false,
                    sheetRows: 50001,
                    cellDates: true
                });

                const sheet = wb.Sheets[wb.SheetNames[0]];
                const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: true });

                if (rawRows.length === 0) {
                    return reject('Excel dosyası boş.');
                }

                const headers = Object.keys(rawRows[0]);
                const missing = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
                if (missing.length > 0) {
                    return reject(`Eksik kolonlar: ${missing.join(', ')}`);
                }

                const validRows = [];
                const errors = [];

                rawRows.forEach((row, i) => {
                    const rowNum = i + 2;
                    const rawMiktar = row['İA Miktar (MWh)'];
                    const miktar = parseFloat(typeof rawMiktar === 'string' ? rawMiktar.replace(',', '.') : rawMiktar);
                    const tarih = parseExcelDate(row['Tarih']);

                    if (!tarih || isNaN(tarih.getTime())) {
                        errors.push(`Satır ${rowNum}: Tarih okunamadı (değer: "${row['Tarih']}")`);
                        return;
                    }
                    if (isNaN(miktar)) {
                        errors.push(`Satır ${rowNum}: İA Miktar sayısal değil.`);
                        return;
                    }
                    if (miktar < 0) {
                        errors.push(`Satır ${rowNum}: İA Miktar negatif olamaz.`);
                        return;
                    }
                    if (miktar > 10000) {
                        errors.push(`Satır ${rowNum}: İA Miktar 10.000 MWh'ı aşıyor (değer: ${miktar}).`);
                        return;
                    }

                    validRows.push({
                        tarih,
                        satici: String(row['Satıcı Organizasyon'] || '').trim(),
                        alici: String(row['Alıcı Organizasyon'] || '').trim(),
                        iaId: String(row['İA ID'] || '').trim(),
                        miktar
                    });
                });

                if (errors.length > 0) {
                    const shown = errors.slice(0, 10).join('\n');
                    const extra = errors.length > 10 ? `\n...ve ${errors.length - 10} hata daha.` : '';
                    return reject(shown + extra);
                }

                resolve(validRows);
            } catch (err) {
                reject('Excel dosyası okunamadı: ' + err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}

// -------- Calculation --------

function calculateResults(rows, ptfMap, supplierConfig) {
    const detail = [];
    let unmatched = 0;

    rows.forEach(row => {
        const config = supplierConfig[row.satici] ?? defaultSupplierConfig();

        if (!config.enabled) {
            detail.push({ ...row, ptf: null, agreementRate: null, birimFiyat: null, tutar: null, matched: false, excluded: true });
            return;
        }

        const key = toUTCHourKey(row.tarih);
        const ptfEntry = ptfMap.get(key);

        if (ptfEntry === undefined) {
            unmatched++;
            detail.push({ ...row, ptf: null, agreementRate: null, birimFiyat: null, tutar: null, matched: false, excluded: false });
            return;
        }

        const priceTRY = ptfEntry.priceTRY;
        const birimFiyat = priceTRY * (1 + config.agreementRate);
        const tutar = birimFiyat * row.miktar;
        detail.push({ ...row, ptf: priceTRY, agreementRate: config.agreementRate, birimFiyat, tutar, matched: true, excluded: false });
    });

    // Tedarikçi bazında özet — sadece matched satırlar
    const summaryMap = new Map();
    detail.filter(r => r.matched).forEach(r => {
        if (!summaryMap.has(r.satici)) {
            summaryMap.set(r.satici, { satici: r.satici, totalMWh: 0, totalTL: 0, weightedPtf: 0, agreementRate: r.agreementRate });
        }
        const s = summaryMap.get(r.satici);
        s.totalMWh += r.miktar;
        s.totalTL += r.tutar;
        s.weightedPtf += r.ptf * r.miktar;
    });

    const summary = [...summaryMap.values()].map(s => ({
        satici: s.satici,
        totalMWh: s.totalMWh,
        avgPtf: s.totalMWh > 0 ? s.weightedPtf / s.totalMWh : 0,
        agreementRate: s.agreementRate,
        totalTL: s.totalTL
    }));

    return { detail, summary, unmatched };
}

// -------- UI Helpers --------

function showEl(id) {
    document.getElementById(id)?.classList.remove('d-none');
}

function hideEl(id) {
    document.getElementById(id)?.classList.add('d-none');
}

function setError(containerId, message) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!message) {
        el.classList.add('d-none');
        return;
    }
    el.classList.remove('d-none');
    const textEl = el.querySelector('.ia-error-text');
    if (textEl) textEl.textContent = message;
}

function setWarning(containerId, message) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!message) {
        el.classList.add('d-none');
        return;
    }
    el.classList.remove('d-none');
    const textEl = el.querySelector('.ia-warn-text');
    if (textEl) textEl.textContent = message;
}

function setLoading(show, message = 'İşleniyor...') {
    const el = document.getElementById('ia-loading');
    if (!el) return;
    el.classList.toggle('d-none', !show);
    const textEl = el.querySelector('.ia-loading-text');
    if (textEl) textEl.textContent = message;
}

// -------- Render --------

function renderSupplierRates(suppliers) {
    const container = document.getElementById('ia-supplier-rates');
    if (!container) return;
    container.innerHTML = '';

    suppliers.forEach(supplier => {
        const row = document.createElement('div');
        row.className = 'row align-items-center mb-2';

        const labelCol = document.createElement('div');
        labelCol.className = 'col-md-7';
        const label = document.createElement('span');
        label.className = 'fw-semibold';
        label.style.wordBreak = 'break-word';
        label.textContent = supplier;
        labelCol.appendChild(label);

        const inputCol = document.createElement('div');
        inputCol.className = 'col-md-5';

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group input-group-sm';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-control';
        input.step = '0.01';
        input.min = '-100';
        input.max = '100';
        const currentRate = (iaPtfState.supplierConfig[supplier]?.agreementRate ?? 0) * 100;
        input.value = Number(currentRate.toFixed(4));
        input.setAttribute('aria-label', `${supplier} anlaşma oranı`);
        input.addEventListener('input', () => {
            const val = parseFloat(input.value);
            iaPtfState.supplierConfig[supplier].agreementRate = isNaN(val) ? 0 : val / 100;
        });

        const suffix = document.createElement('span');
        suffix.className = 'input-group-text';
        suffix.textContent = '%';

        inputGroup.appendChild(input);
        inputGroup.appendChild(suffix);
        inputCol.appendChild(inputGroup);

        row.appendChild(labelCol);
        row.appendChild(inputCol);
        container.appendChild(row);
    });
}

function renderDetailTable(detail) {
    const tbody = document.getElementById('ia-detail-tbody');
    const limitNote = document.getElementById('ia-detail-limit-note');
    if (!tbody) return;
    tbody.innerHTML = '';

    const displayed = detail.slice(0, DETAIL_DISPLAY_LIMIT);
    const truncated = detail.length > DETAIL_DISPLAY_LIMIT;

    displayed.forEach(row => {
        const tr = document.createElement('tr');
        if (!row.matched) tr.style.opacity = '0.6';

        const tarihStr = row.tarih.toLocaleString('tr-TR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        [
            tarihStr,
            row.satici,
            fmtMWh(row.miktar),
            row.matched ? fmtTL(row.ptf) : '—',
            row.matched ? `%${(row.agreementRate * 100).toFixed(2)}` : '—',
            row.matched ? fmtTL(row.birimFiyat) : '—',
            row.matched ? fmtTL(row.tutar) : 'Eşleşmedi'
        ].forEach((text, i) => {
            const td = document.createElement('td');
            td.textContent = text;
            if (i >= 2) td.style.fontVariantNumeric = 'tabular-nums';
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    if (limitNote) {
        if (truncated) {
            limitNote.textContent = `İlk ${DETAIL_DISPLAY_LIMIT} satır gösteriliyor (toplam ${detail.length}). Tamamı Excel'e aktarılır.`;
            limitNote.classList.remove('d-none');
        } else {
            limitNote.classList.add('d-none');
        }
    }
}

function renderSummaryTable(summary) {
    const tbody = document.getElementById('ia-summary-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    summary.forEach(row => {
        const tr = document.createElement('tr');

        [
            row.satici,
            fmtMWh(row.totalMWh),
            fmtTL(row.avgPtf),
            `%${(row.agreementRate * 100).toFixed(2)}`,
            fmtTL(row.totalTL)
        ].forEach((text, i) => {
            const td = document.createElement('td');
            td.textContent = text;
            if (i >= 1) td.style.fontVariantNumeric = 'tabular-nums';
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// -------- Excel Export --------

// Excel/LibreOffice'in =, +, -, @, tab, CR ile başlayan hücreleri
// formül olarak yorumlamasını önlemek için öne ' ekler.
function sanitizeForExcel(value) {
    if (typeof value !== 'string') return value;
    if (/^[=+\-@\t\r]/.test(value)) return "'" + value;
    return value;
}

function downloadIaPtfExcel() {
    const { detail, summary } = iaPtfState.results;
    if (!detail.length) return;

    const wb = XLSX.utils.book_new();

    const detailData = [
        ['Tarih', 'Satıcı Organizasyon', 'İA Miktar (MWh)', 'PTF (TL/MWh)', 'Anlaşma %', 'Birim Fiyat (TL/MWh)', 'Tutar (TL)', 'Durum'],
        ...detail.map(r => [
            r.tarih.toLocaleString('tr-TR'),
            sanitizeForExcel(r.satici),
            r.miktar,
            r.matched ? r.ptf : null,
            r.matched ? r.agreementRate * 100 : null,
            r.matched ? r.birimFiyat : null,
            r.matched ? r.tutar : null,
            r.matched ? 'Eşleşti' : 'Eşleşmedi'
        ])
    ];

    const summaryData = [
        ['Satıcı Organizasyon', 'Toplam MWh', 'Ağırlıklı Ort. PTF (TL/MWh)', 'Anlaşma %', 'Toplam TL'],
        ...summary.map(r => [sanitizeForExcel(r.satici), r.totalMWh, r.avgPtf, r.agreementRate * 100, r.totalTL])
    ];

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(detailData), 'Detay');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'Özet');

    const dateStr = new Date().toLocaleDateString('tr-TR').replace(/\./g, '-');
    XLSX.writeFile(wb, `ia_ptf_${dateStr}.xlsx`);
}

// -------- Event Handlers --------

async function handleIaFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Reset state
    setError('ia-file-error', null);
    hideEl('ia-file-info');
    hideEl('ia-month-section');
    hideEl('ia-suppliers-section');
    hideEl('ia-calculate-section');
    hideEl('ia-results-section');
    iaPtfState.rows = [];
    iaPtfState.supplierConfig = {};
    iaPtfState.selectedMonth = null;

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
        setError('ia-file-error', 'Sadece .xlsx dosyaları kabul edilir. (.xlsm, .xlsb ve .xls reddedilir)');
        event.target.value = '';
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        setError('ia-file-error', `Dosya boyutu ${(file.size / 1024 / 1024).toFixed(1)} MB — maksimum 10 MB.`);
        event.target.value = '';
        return;
    }

    const validMagic = await checkMagicBytes(file);
    if (!validMagic) {
        setError('ia-file-error', 'Dosya geçerli bir .xlsx formatında değil (magic bytes doğrulaması başarısız).');
        event.target.value = '';
        return;
    }

    setLoading(true, 'Excel okunuyor ve doğrulanıyor...');

    try {
        const rows = await parseAndValidateExcel(file);
        iaPtfState.rows = rows;

        const months = getUniqueMonths(rows);

        const infoEl = document.getElementById('ia-file-info');
        if (infoEl) {
            const badge = infoEl.querySelector('.badge');
            if (badge) badge.textContent = `${rows.length.toLocaleString('tr-TR')} satır, ${months.length} ay yüklendi.`;
            showEl('ia-file-info');
        }

        renderMonthSelector(months);
        showEl('ia-month-section');
        // Tedarikçiler ve hesapla butonu onMonthSelected içinde gösterilir
    } catch (errMsg) {
        setError('ia-file-error', errMsg);
        event.target.value = '';
    } finally {
        setLoading(false);
    }
}

async function handleIaCalculate() {
    setError('ia-calc-error', null);

    const username = (document.getElementById('ia-username')?.value || '').trim();
    const password = document.getElementById('ia-password')?.value || '';

    if (!username || !password) {
        setError('ia-calc-error', 'EPİAŞ kullanıcı adı ve şifre girilmelidir.');
        return;
    }

    if (!iaPtfState.rows.length) {
        setError('ia-calc-error', 'Önce bir Excel dosyası yükleyin.');
        return;
    }

    if (!iaPtfState.selectedMonth) {
        setError('ia-calc-error', 'Lütfen hesaplanacak ayı seçin.');
        return;
    }

    // Seçili aya ait satırları filtrele
    const { year, month } = iaPtfState.selectedMonth;
    const filteredRows = iaPtfState.rows.filter(r =>
        r.tarih.getFullYear() === year && r.tarih.getMonth() + 1 === month
    );

    if (filteredRows.length === 0) {
        setError('ia-calc-error', 'Seçilen ay için veri bulunamadı.');
        return;
    }

    // Validate rates — sadece bu aydaki tedarikçiler
    const monthSuppliers = getSuppliersForMonth(iaPtfState.rows, year, month);
    for (const supplier of monthSuppliers) {
        const cfg = iaPtfState.supplierConfig[supplier] ?? defaultSupplierConfig();
        const agreementRate = cfg.agreementRate;
        if (isNaN(agreementRate) || agreementRate < -1 || agreementRate > 1) {
            setError('ia-calc-error', `"${supplier}" için anlaşma oranı -100 ile 100 arasında olmalıdır.`);
            return;
        }
    }

    // Date range — seçili ayın min/max tarihi
    const timestamps = filteredRows.map(r => r.tarih.getTime());
    const minDate = new Date(timestamps.reduce((a, b) => a < b ? a : b));
    const maxDate = new Date(timestamps.reduce((a, b) => a > b ? a : b));
    const diffDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);

    if (diffDays > 90) {
        setError('ia-calc-error', `Seçilen ay 90 günü aşıyor (${Math.round(diffDays)} gün).`);
        return;
    }

    hideEl('ia-results-section');
    setLoading(true, 'EPİAŞ PTF verisi çekiliyor...');

    try {
        const prices = await fetch('/api/ptf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password,
                startDate: minDate.toISOString(),
                endDate: maxDate.toISOString()
            })
        }).then(async res => {
            const text = await res.text();
            let data = {};
            try { data = JSON.parse(text); } catch { /* boş veya HTML yanıt */ }
            if (!res.ok) throw new Error(data.error || `Sunucu hatası (${res.status})`);
            return data.prices;
        });

        iaPtfState.ptfMap = new Map(prices.map(p => [toUTCHourKey(new Date(p.date)), { priceTRY: p.price, priceUsd: p.priceUsd ?? null, priceEur: p.priceEur ?? null }]));

        setLoading(true, 'Hesaplanıyor...');

        const { detail, summary, unmatched } = calculateResults(
            filteredRows,
            iaPtfState.ptfMap,
            iaPtfState.supplierConfig
        );

        iaPtfState.results = { detail, summary };

        renderSummaryTable(summary);
        renderDetailTable(detail);
        showEl('ia-results-section');

        if (unmatched > 0) {
            setWarning('ia-unmatched-warning',
                `${unmatched} satır için PTF eşleşmesi bulunamadı — bu satırlar hesaba dahil edilmedi.`
            );
        } else {
            setWarning('ia-unmatched-warning', null);
        }

        document.getElementById('ia-results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
        setError('ia-calc-error', err.message);
    } finally {
        setLoading(false);
    }
}

// -------- Init --------

function initIaPtf() {
    document.getElementById('ia-file-input')?.addEventListener('change', handleIaFileUpload);
    document.getElementById('ia-calculate-btn')?.addEventListener('click', handleIaCalculate);
    document.getElementById('ia-download-btn')?.addEventListener('click', downloadIaPtfExcel);
}

document.addEventListener('DOMContentLoaded', initIaPtf);
