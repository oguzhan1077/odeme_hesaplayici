// ==========================================
// İA-PTF Hesaplama Modülü
// ==========================================

const iaPtfState = {
    rows: [],
    supplierConfig: {}, // { supplierName: { enabled, pricingType, agreementRate, fixedPrice } }
    ptfMap: new Map(),  // UTCHourKey -> { priceTRY }
    results: { detail: [], summary: [] },
    selectedMonth: null // { year, month } — month 1-indexed
};

function defaultSupplierConfig() {
    return { enabled: true, pricingType: 'ptf_indexed', agreementRate: 0, fixedPrice: null };
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
    clearValidationErrors();

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
            detail.push({
                ...row,
                status: 'excluded', pricingType: config.pricingType,
                unitPrice: null, tl: null, agreementRate: null, fixedPrice: null, ptf: null
            });
            return;
        }

        const key = toUTCHourKey(row.tarih);
        const ptfEntry = ptfMap.get(key);

        if (ptfEntry === undefined) {
            unmatched++;
            detail.push({
                ...row,
                status: 'unmatched', pricingType: config.pricingType,
                unitPrice: null, tl: null, agreementRate: null, fixedPrice: null, ptf: null
            });
            return;
        }

        const priceTRY = ptfEntry.priceTRY;

        if (config.pricingType === 'ptf_indexed') {
            const rate = config.agreementRate;
            if (rate === null || rate === undefined || isNaN(rate)) {
                // Validation should catch this before calculation; defensive fallback
                detail.push({
                    ...row,
                    status: 'config_error', pricingType: 'ptf_indexed',
                    unitPrice: null, tl: null, agreementRate: null, fixedPrice: null, ptf: priceTRY
                });
                return;
            }
            const unitPrice = priceTRY * (1 + rate);
            const tl = unitPrice * row.miktar;
            detail.push({
                ...row,
                status: 'ok', pricingType: 'ptf_indexed',
                unitPrice, tl, agreementRate: rate, fixedPrice: null, ptf: priceTRY
            });

        } else { // fixed
            const fp = config.fixedPrice;
            if (fp === null || fp === undefined || isNaN(fp)) {
                // Validation should catch this before calculation; defensive fallback
                detail.push({
                    ...row,
                    status: 'config_error', pricingType: 'fixed',
                    unitPrice: null, tl: null, agreementRate: null, fixedPrice: null, ptf: priceTRY
                });
                return;
            }
            const unitPrice = fp;
            const tl = unitPrice * row.miktar;
            detail.push({
                ...row,
                status: 'ok', pricingType: 'fixed',
                unitPrice, tl, agreementRate: null, fixedPrice: fp, ptf: priceTRY
            });
        }
    });

    // Tedarikçi bazında özet — sadece 'ok' satırlar
    const summaryMap = new Map();
    detail.filter(r => r.status === 'ok').forEach(r => {
        if (!summaryMap.has(r.satici)) {
            summaryMap.set(r.satici, {
                satici: r.satici, pricingType: r.pricingType,
                totalMWh: 0, totalTL: 0,
                weightedUnitPrice: 0, weightedPtf: 0,
                agreementRate: r.agreementRate, fixedPrice: r.fixedPrice
            });
        }
        const s = summaryMap.get(r.satici);
        s.totalMWh       += r.miktar;
        s.totalTL        += r.tl;
        s.weightedUnitPrice += r.unitPrice * r.miktar;
        s.weightedPtf    += r.ptf * r.miktar;
    });

    const summary = [...summaryMap.values()].map(s => ({
        satici: s.satici, pricingType: s.pricingType,
        totalMWh: s.totalMWh, totalTL: s.totalTL,
        avgUnitPrice: s.totalMWh > 0 ? s.weightedUnitPrice / s.totalMWh : 0,
        agreementRate: s.agreementRate, fixedPrice: s.fixedPrice
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

    if (suppliers.length === 0) return;

    // ---- Header: bulk-select buttons + counter ----
    const header = document.createElement('div');
    header.className = 'd-flex align-items-center gap-2 mb-3 flex-wrap';

    const selectAllBtn = document.createElement('button');
    selectAllBtn.type = 'button';
    selectAllBtn.className = 'ia-btn-secondary';
    selectAllBtn.textContent = 'Tümünü Seç';

    const selectNoneBtn = document.createElement('button');
    selectNoneBtn.type = 'button';
    selectNoneBtn.className = 'ia-btn-secondary';
    selectNoneBtn.textContent = 'Hiçbirini Seçme';

    const counter = document.createElement('span');
    counter.className = 'text-muted small ms-auto';

    header.appendChild(selectAllBtn);
    header.appendChild(selectNoneBtn);
    header.appendChild(counter);
    container.appendChild(header);

    // rowMeta keeps DOM refs needed for bulk enable/disable
    const rowMeta = {};

    function updateCounter() {
        const sel = suppliers.filter(s => iaPtfState.supplierConfig[s]?.enabled !== false).length;
        counter.textContent = `${sel} / ${suppliers.length} seçili`;
    }

    function syncRowEnabled(supplier, enabled) {
        const meta = rowMeta[supplier];
        if (!meta) return;
        meta.checkbox.checked = enabled;
        meta.card.classList.toggle('is-disabled', !enabled);
        meta.inputs.forEach(el => { el.disabled = !enabled; });
    }

    // ---- Per-supplier cards ----
    suppliers.forEach(supplier => {
        const cfg = iaPtfState.supplierConfig[supplier];

        const card = document.createElement('div');
        card.className = 'ia-supplier-card';
        card.dataset.supplier = supplier;

        // -- Checkbox + name --
        const nameRow = document.createElement('div');
        nameRow.className = 'd-flex align-items-center mb-2';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-2 flex-shrink-0';
        checkbox.checked = cfg.enabled;
        checkbox.setAttribute('aria-label', `${supplier} dahil et`);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'fw-semibold';
        nameSpan.style.wordBreak = 'break-word';
        nameSpan.textContent = supplier;

        nameRow.appendChild(checkbox);
        nameRow.appendChild(nameSpan);
        card.appendChild(nameRow);

        // -- Controls block (indented under checkbox) --
        const controls = document.createElement('div');
        controls.className = 'ps-4';

        // Pricing type row
        const typeRow = document.createElement('div');
        typeRow.className = 'row g-2 align-items-center mb-2';

        const typeLabelCol = document.createElement('div');
        typeLabelCol.className = 'col-auto';
        const typeLabel = document.createElement('label');
        typeLabel.className = 'form-label mb-0 small text-muted';
        typeLabel.textContent = 'Fiyatlandırma:';
        typeLabelCol.appendChild(typeLabel);

        const typeSelectCol = document.createElement('div');
        typeSelectCol.className = 'col-auto';
        const typeSelect = document.createElement('select');
        typeSelect.className = 'form-select form-select-sm';
        typeSelect.setAttribute('aria-label', `${supplier} fiyatlandırma tipi`);
        [['ptf_indexed', 'PTF Endeksli'], ['fixed', 'Sabit Fiyat']].forEach(([val, label]) => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = label;
            if (val === cfg.pricingType) opt.selected = true;
            typeSelect.appendChild(opt);
        });
        typeSelectCol.appendChild(typeSelect);
        typeRow.appendChild(typeLabelCol);
        typeRow.appendChild(typeSelectCol);
        controls.appendChild(typeRow);

        // PTF-indexed sub-inputs
        const ptfGroup = document.createElement('div');
        ptfGroup.className = 'row g-2 align-items-center';
        if (cfg.pricingType !== 'ptf_indexed') ptfGroup.classList.add('d-none');

        const ptfLabelCol = document.createElement('div');
        ptfLabelCol.className = 'col-auto';
        const ptfLabel = document.createElement('label');
        ptfLabel.className = 'form-label mb-0 small text-muted';
        ptfLabel.textContent = 'Anlaşma Oranı (%):';
        ptfLabelCol.appendChild(ptfLabel);

        const ptfInputCol = document.createElement('div');
        ptfInputCol.className = 'col-auto';
        const ptfInputGroup = document.createElement('div');
        ptfInputGroup.className = 'input-group input-group-sm';
        const ptfInput = document.createElement('input');
        ptfInput.type = 'number';
        ptfInput.className = 'form-control';
        ptfInput.style.width = '90px';
        ptfInput.step = '0.01';
        ptfInput.min = '-100';
        ptfInput.max = '100';
        ptfInput.value = Number((cfg.agreementRate * 100).toFixed(4));
        ptfInput.dataset.inputType = 'ptf_rate';
        ptfInput.setAttribute('aria-label', `${supplier} anlaşma oranı`);
        const ptfSuffix = document.createElement('span');
        ptfSuffix.className = 'input-group-text';
        ptfSuffix.textContent = '%';
        ptfInputGroup.appendChild(ptfInput);
        ptfInputGroup.appendChild(ptfSuffix);
        ptfInputCol.appendChild(ptfInputGroup);
        ptfGroup.appendChild(ptfLabelCol);
        ptfGroup.appendChild(ptfInputCol);
        controls.appendChild(ptfGroup);

        // Fixed-price sub-inputs
        const fixedGroup = document.createElement('div');
        fixedGroup.className = 'row g-2 align-items-center';
        if (cfg.pricingType !== 'fixed') fixedGroup.classList.add('d-none');

        const fixedLabelCol = document.createElement('div');
        fixedLabelCol.className = 'col-auto';
        const fixedLabel = document.createElement('label');
        fixedLabel.className = 'form-label mb-0 small text-muted';
        fixedLabel.textContent = 'Sabit Fiyat (TL/MWh):';
        fixedLabelCol.appendChild(fixedLabel);

        const fixedPriceCol = document.createElement('div');
        fixedPriceCol.className = 'col-auto';
        const fixedPriceInput = document.createElement('input');
        fixedPriceInput.type = 'number';
        fixedPriceInput.className = 'form-control form-control-sm';
        fixedPriceInput.style.width = '110px';
        fixedPriceInput.min = '0';
        fixedPriceInput.max = '100000';
        fixedPriceInput.step = '0.01';
        if (cfg.fixedPrice !== null) fixedPriceInput.value = cfg.fixedPrice;
        fixedPriceInput.dataset.inputType = 'fixed_price';
        fixedPriceInput.setAttribute('aria-label', `${supplier} sabit fiyat TL/MWh`);
        fixedPriceCol.appendChild(fixedPriceInput);

        fixedGroup.appendChild(fixedLabelCol);
        fixedGroup.appendChild(fixedPriceCol);
        controls.appendChild(fixedGroup);

        card.appendChild(controls);
        container.appendChild(card);

        // Collect all interactive inputs (for bulk disable/enable)
        const allInputs = [typeSelect, ptfInput, fixedPriceInput];
        rowMeta[supplier] = { checkbox, card, inputs: allInputs };

        // Apply initial disabled state
        if (!cfg.enabled) {
            card.classList.add('is-disabled');
            allInputs.forEach(el => { el.disabled = true; });
        }

        // ---- Event listeners ----

        checkbox.addEventListener('change', () => {
            iaPtfState.supplierConfig[supplier].enabled = checkbox.checked;
            syncRowEnabled(supplier, checkbox.checked);
            updateCounter();
        });

        typeSelect.addEventListener('change', () => {
            const type = typeSelect.value;
            iaPtfState.supplierConfig[supplier].pricingType = type;
            if (type === 'ptf_indexed') {
                ptfGroup.classList.remove('d-none');
                fixedGroup.classList.add('d-none');
            } else {
                ptfGroup.classList.add('d-none');
                fixedGroup.classList.remove('d-none');
            }
            // Values for the hidden mode are preserved in state — no clearing
        });

        ptfInput.addEventListener('input', () => {
            const val = parseFloat(ptfInput.value);
            iaPtfState.supplierConfig[supplier].agreementRate = isNaN(val) ? 0 : val / 100;
            ptfInput.classList.remove('is-invalid');
        });

        fixedPriceInput.addEventListener('input', () => {
            const val = parseFloat(fixedPriceInput.value);
            iaPtfState.supplierConfig[supplier].fixedPrice = isNaN(val) ? null : val;
            fixedPriceInput.classList.remove('is-invalid');
        });
    });

    // ---- Bulk-select handlers ----
    selectAllBtn.addEventListener('click', () => {
        suppliers.forEach(s => {
            iaPtfState.supplierConfig[s].enabled = true;
            syncRowEnabled(s, true);
        });
        updateCounter();
    });

    selectNoneBtn.addEventListener('click', () => {
        suppliers.forEach(s => {
            iaPtfState.supplierConfig[s].enabled = false;
            syncRowEnabled(s, false);
        });
        updateCounter();
    });

    updateCounter();
}

const STATUS_LABEL = {
    ok:           'Hesaplandı',
    excluded:     'Hariç Tutuldu',
    unmatched:    'Eşleşmedi',
    config_error: 'Yapılandırma Hatası'
};

function fmtDetailPricing(row) {
    if (row.pricingType === 'ptf_indexed') {
        if (row.agreementRate !== null) {
            const sign = row.agreementRate >= 0 ? '+' : '';
            return `PTF ${sign}${(row.agreementRate * 100).toFixed(2)}`;
        }
        return 'PTF Endeksli';
    }
    if (row.pricingType === 'fixed') {
        return row.fixedPrice !== null ? `Sabit ${row.fixedPrice} TL/MWh` : 'Sabit Fiyat';
    }
    return '—';
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
        if (row.status !== 'ok') tr.classList.add('is-dim');

        const tarihStr = row.tarih.toLocaleString('tr-TR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        const isOk = row.status === 'ok';

        [
            { text: tarihStr },
            { text: row.satici },
            { text: fmtDetailPricing(row) },
            { text: fmtMWh(row.miktar),                             cls: 'num' },
            { text: isOk ? fmtTL(row.unitPrice) : '—', cls: isOk ? 'num' : 'num dim' },
            { text: isOk ? fmtTL(row.tl)        : '—', cls: isOk ? 'num' : 'num dim' },
            { text: STATUS_LABEL[row.status] ?? row.status }
        ].forEach(({ text, cls }) => {
            const td = document.createElement('td');
            td.textContent = text;
            if (cls) td.className = cls;
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
    const tfoot = document.getElementById('ia-summary-tfoot');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (tfoot) tfoot.innerHTML = '';

    let grandTotalMWh = 0, grandTotalTL = 0;

    summary.forEach(row => {
        const tr = document.createElement('tr');

        const typeLabel = row.pricingType === 'ptf_indexed' ? 'PTF Endeksli' : 'Sabit Fiyat';
        const paramStr = row.pricingType === 'ptf_indexed'
            ? `%${(row.agreementRate * 100).toFixed(2)}`
            : `${row.fixedPrice} TL/MWh`;

        [
            { text: row.satici },
            { text: typeLabel },
            { text: paramStr },
            { text: fmtMWh(row.totalMWh),    cls: 'num' },
            { text: fmtTL(row.avgUnitPrice),  cls: 'num' },
            { text: fmtTL(row.totalTL),       cls: 'num' }
        ].forEach(({ text, cls }) => {
            const td = document.createElement('td');
            td.textContent = text;
            if (cls) td.className = cls;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
        grandTotalMWh += row.totalMWh;
        grandTotalTL  += row.totalTL;
    });

    if (summary.length > 1 && tfoot) {
        const trGrand = document.createElement('tr');
        const grandAvg = grandTotalMWh > 0 ? grandTotalTL / grandTotalMWh : 0;
        [
            { text: 'TOPLAM' },
            { text: '' },
            { text: '' },
            { text: fmtMWh(grandTotalMWh), cls: 'num' },
            { text: fmtTL(grandAvg),       cls: 'num' },
            { text: fmtTL(grandTotalTL),   cls: 'num' }
        ].forEach(({ text, cls }) => {
            const td = document.createElement('td');
            td.textContent = text;
            if (cls) td.className = cls;
            trGrand.appendChild(td);
        });
        tfoot.appendChild(trGrand);
    }
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
        ['Tarih', 'Satıcı Organizasyon', 'Fiyatlandırma', 'İA Miktar (MWh)', 'Birim Fiyat (TL/MWh)', 'Tutar (TL)', 'Durum'],
        ...detail.map(r => {
            const isOk = r.status === 'ok';
            return [
                r.tarih.toLocaleString('tr-TR'),
                sanitizeForExcel(r.satici),
                sanitizeForExcel(fmtDetailPricing(r)),
                r.miktar,
                isOk ? r.unitPrice : null,
                isOk ? r.tl        : null,
                sanitizeForExcel(STATUS_LABEL[r.status] ?? r.status)
            ];
        })
    ];

    const grandTotalMWh = summary.reduce((s, r) => s + r.totalMWh, 0);
    const grandTotalTL  = summary.reduce((s, r) => s + r.totalTL,  0);
    const grandAvg      = grandTotalMWh > 0 ? grandTotalTL / grandTotalMWh : 0;

    const summaryData = [
        ['Satıcı Organizasyon', 'Fiyatlandırma Tipi', 'Parametre', 'Toplam MWh', 'Ağırlıklı Ort. Birim Fiyat (TL/MWh)', 'Toplam TL'],
        ...summary.map(r => {
            const typeLabel = r.pricingType === 'ptf_indexed' ? 'PTF Endeksli' : 'Sabit Fiyat';
            const paramStr  = r.pricingType === 'ptf_indexed'
                ? `%${(r.agreementRate * 100).toFixed(2)}`
                : `${r.fixedPrice} TL/MWh`;
            return [
                sanitizeForExcel(r.satici),
                sanitizeForExcel(typeLabel),
                sanitizeForExcel(paramStr),
                r.totalMWh,
                r.avgUnitPrice,
                r.totalTL
            ];
        }),
        ...(summary.length > 1 ? [['TOPLAM', '', '', grandTotalMWh, grandAvg, grandTotalTL]] : [])
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

// -------- Validation --------

function validateSupplierConfig(suppliers, supplierConfig) {
    const errors = [];
    const enabled = suppliers.filter(s => (supplierConfig[s] ?? defaultSupplierConfig()).enabled);

    if (enabled.length === 0) {
        errors.push({ supplier: null, inputType: null, message: 'En az bir tedarikçi seçilmelidir.' });
        return errors;
    }

    enabled.forEach(s => {
        const cfg = supplierConfig[s] ?? defaultSupplierConfig();
        if (cfg.pricingType === 'ptf_indexed') {
            const r = cfg.agreementRate;
            if (r === null || r === undefined || isNaN(r) || r < -1 || r > 1) {
                errors.push({ supplier: s, inputType: 'ptf_rate',
                    message: `"${s}" için anlaşma oranı −100 ile 100 arasında olmalıdır.` });
            }
        } else {
            const fp = cfg.fixedPrice;
            if (fp === null || fp === undefined || isNaN(fp)) {
                errors.push({ supplier: s, inputType: 'fixed_price',
                    message: `"${s}" için sabit fiyat girilmelidir.` });
            } else if (fp <= 0 || fp > 100000) {
                errors.push({ supplier: s, inputType: 'fixed_price',
                    message: `"${s}" için sabit fiyat 0'dan büyük ve 100.000'den küçük olmalıdır.` });
            }
        }
    });

    return errors;
}

function showValidationErrors(errors) {
    const panel = document.getElementById('ia-validation-errors');
    const list = document.getElementById('ia-validation-error-list');
    if (!panel || !list) return;

    list.innerHTML = '';
    errors.forEach(e => {
        const li = document.createElement('li');
        li.textContent = e.message;
        list.appendChild(li);
    });
    panel.classList.remove('d-none');

    let firstCard = null;
    errors.forEach(e => {
        if (!e.supplier) return;
        const card = document.querySelector(`[data-supplier="${CSS.escape(e.supplier)}"]`);
        if (!card) return;
        card.classList.add('is-invalid');
        if (e.inputType) {
            const input = card.querySelector(`[data-input-type="${e.inputType}"]`);
            if (input) input.classList.add('is-invalid');
        }
        if (!firstCard) firstCard = card;
    });

    if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearValidationErrors() {
    const panel = document.getElementById('ia-validation-errors');
    if (panel) panel.classList.add('d-none');
    document.querySelectorAll('#ia-supplier-rates [data-supplier]').forEach(card => {
        card.classList.remove('is-invalid');
        card.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    });
}

async function handleIaCalculate() {
    setError('ia-calc-error', null);
    clearValidationErrors();

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

    // Validate supplier config — tüm hataları bir arada göster
    const monthSuppliers = getSuppliersForMonth(iaPtfState.rows, year, month);
    const validationErrors = validateSupplierConfig(monthSuppliers, iaPtfState.supplierConfig);
    if (validationErrors.length > 0) {
        showValidationErrors(validationErrors);
        return;
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

        iaPtfState.ptfMap = new Map(prices.map(p => [toUTCHourKey(new Date(p.date)), { priceTRY: p.price }]));

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
    document.getElementById('ia-validation-dismiss')?.addEventListener('click', clearValidationErrors);
}

document.addEventListener('DOMContentLoaded', initIaPtf);
