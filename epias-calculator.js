// Türkiye resmi tatilleri ve bayram arifesi günleri (2025-2028)
const turkeyHolidays = {
    // 2025 yılı
    '2025-01-01': 'Yılbaşı',
    '2025-03-30': 'Ramazan Bayramı (1. Gün)',
    '2025-03-31': 'Ramazan Bayramı (2. Gün)',
    '2025-04-01': 'Ramazan Bayramı (3. Gün)',
    '2025-04-23': 'Ulusal Egemenlik ve Çocuk Bayramı',
    '2025-05-01': 'Emek ve Dayanışma Günü',
    '2025-05-19': 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı',
    '2025-06-06': 'Kurban Bayramı (1. Gün)',
    '2025-06-07': 'Kurban Bayramı (2. Gün)',
    '2025-06-08': 'Kurban Bayramı (3. Gün)',
    '2025-06-09': 'Kurban Bayramı (4. Gün)',
    '2025-07-15': 'Demokrasi ve Millî Birlik Günü',
    '2025-08-30': 'Zafer Bayramı',
    '2025-10-29': 'Cumhuriyet Bayramı',
    
    // Bayram arifesi günleri (2025)
    '2025-03-29': 'Ramazan Bayramı Arifesi',
    '2025-06-05': 'Kurban Bayramı Arifesi',
    
    // 2026 yılı
    '2026-01-01': 'Yılbaşı',
    '2026-03-20': 'Ramazan Bayramı (1. Gün)',
    '2026-03-21': 'Ramazan Bayramı (2. Gün)',
    '2026-03-22': 'Ramazan Bayramı (3. Gün)',
    '2026-04-23': 'Ulusal Egemenlik ve Çocuk Bayramı',
    '2026-05-01': 'Emek ve Dayanışma Günü',
    '2026-05-19': 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı',
    '2026-05-27': 'Kurban Bayramı (1. Gün)',
    '2026-05-28': 'Kurban Bayramı (2. Gün)',
    '2026-05-29': 'Kurban Bayramı (3. Gün)',
    '2026-05-30': 'Kurban Bayramı (4. Gün)',
    '2026-07-15': 'Demokrasi ve Millî Birlik Günü',
    '2026-08-30': 'Zafer Bayramı',
    '2026-10-29': 'Cumhuriyet Bayramı',
    
    // Bayram arifesi günleri (2026)
    '2026-03-19': 'Ramazan Bayramı Arifesi',
    '2026-05-26': 'Kurban Bayramı Arifesi',
    
    // 2027 yılı
    '2027-01-01': 'Yılbaşı',
    '2027-03-08': 'Ramazan Bayramı Arifesi',
    '2027-03-09': 'Ramazan Bayramı (1. Gün)',
    '2027-03-10': 'Ramazan Bayramı (2. Gün)',
    '2027-03-11': 'Ramazan Bayramı (3. Gün)',
    '2027-04-23': 'Ulusal Egemenlik ve Çocuk Bayramı',
    '2027-05-01': 'Emek ve Dayanışma Günü',
    '2027-05-15': 'Kurban Bayramı Arifesi',
    '2027-05-16': 'Kurban Bayramı (1. Gün)',
    '2027-05-17': 'Kurban Bayramı (2. Gün)',
    '2027-05-18': 'Kurban Bayramı (3. Gün)',
    '2027-05-19': 'Kurban Bayramı (4. Gün) / Atatürk\'ü Anma, Gençlik ve Spor Bayramı',
    '2027-07-15': 'Demokrasi ve Millî Birlik Günü',
    '2027-08-30': 'Zafer Bayramı',
    '2027-10-28': 'Cumhuriyet Bayramı Arifesi',
    '2027-10-29': 'Cumhuriyet Bayramı',
    '2027-12-31': 'Yılbaşı Gecesi',
    
    // Bayram arifesi günleri (2027)
    '2027-03-08': 'Ramazan Bayramı Arifesi',
    '2027-05-15': 'Kurban Bayramı Arifesi',
    
    // 2028 yılı
    '2028-01-01': 'Yılbaşı',
    '2028-02-26': 'Ramazan Bayramı Arifesi',
    '2028-02-27': 'Ramazan Bayramı (1. Gün)',
    '2028-02-28': 'Ramazan Bayramı (2. Gün)',
    '2028-02-29': 'Ramazan Bayramı (3. Gün)',
    '2028-04-23': 'Ulusal Egemenlik ve Çocuk Bayramı',
    '2028-05-01': 'Emek ve Dayanışma Günü',
    '2028-05-04': 'Kurban Bayramı Arifesi',
    '2028-05-05': 'Kurban Bayramı (1. Gün)',
    '2028-05-06': 'Kurban Bayramı (2. Gün)',
    '2028-05-07': 'Kurban Bayramı (3. Gün)',
    '2028-05-08': 'Kurban Bayramı (4. Gün)',
    '2028-05-19': 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı',
    '2028-07-15': 'Demokrasi ve Millî Birlik Günü',
    '2028-08-30': 'Zafer Bayramı',
    '2028-10-28': 'Cumhuriyet Bayramı Arifesi',
    '2028-10-29': 'Cumhuriyet Bayramı',
    '2028-12-31': 'Yılbaşı Gecesi'
};

// Tarih formatını YYYY-MM-DD şeklinde döndüren yardımcı fonksiyon
function formatDateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Verilen tarihin tatil olup olmadığını kontrol eden fonksiyon
function isHoliday(date) {
    const dateString = formatDateToString(date);
    return turkeyHolidays.hasOwnProperty(dateString);
}

// Verilen tarihin hafta sonu olup olmadığını kontrol eden fonksiyon
function isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0: Pazar, 6: Cumartesi
}

// Verilen tarihin iş günü olup olmadığını kontrol eden fonksiyon
function isBusinessDay(date) {
    return !isWeekend(date) && !isHoliday(date);
}

// T+2 iş günü hesaplama fonksiyonu
function addBusinessDays(startDate, businessDays) {
    let currentDate = new Date(startDate);
    let addedDays = 0;
    
    while (addedDays < businessDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        
        if (isBusinessDay(currentDate)) {
            addedDays++;
        }
    }
    
    return currentDate;
}

// EPİAŞ ödeme tarihi hesaplama fonksiyonu
function calculateEpiasPaymentDate(tradeDate) {
    return addBusinessDays(tradeDate, 2);
}

// Tarihi Türkçe formatta görüntüleme
function formatDateToTurkish(date) {
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Hızlı ödeme tarihi hesaplama
function calculateQuickPayment() {
    const quickDateInput = document.getElementById('quickDate');
    const resultDiv = document.getElementById('quickResult');
    
    if (!quickDateInput.value) {
        alert('Lütfen bir işlem tarihi seçin.');
        return;
    }
    
    const tradeDate = new Date(quickDateInput.value);
    const paymentDate = calculateEpiasPaymentDate(tradeDate);
    
    // Sonuçları göster
    document.getElementById('quickPaymentDate').textContent = formatDateToTurkish(paymentDate);
    
    const dayName = paymentDate.toLocaleDateString('tr-TR', { weekday: 'long' });
    const isWeekendOrHoliday = isWeekend(paymentDate) || isHoliday(paymentDate);
    const status = isWeekendOrHoliday ? 
        (isWeekend(paymentDate) ? 'Hafta Sonu' : 'Tatil') : 
        'İş Günü';
    
    document.getElementById('quickPaymentDetails').innerHTML = 
        `${dayName} - ${status} <br><small>İşlem: ${formatDateToTurkish(tradeDate)} → Ödeme: ${formatDateToTurkish(paymentDate)}</small>`;
    
    resultDiv.classList.remove('d-none');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Ana takvim oluşturma fonksiyonu
function generatePaymentCalendar() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const loadingDiv = document.getElementById('loading');
    const tableContainer = document.getElementById('tableContainer');
    const statsDiv = document.getElementById('statsContainer');
    
    const selectedYear = parseInt(yearSelect.value);
    const selectedMonth = monthSelect.value;
    
    // Loading göster
    loadingDiv.classList.add('show');
    tableContainer.classList.add('d-none');
    statsDiv.classList.add('d-none');
    
    // Kısa bir gecikme ile UX deneyimini iyileştir
    setTimeout(() => {
        const paymentData = generatePaymentData(selectedYear, selectedMonth);
        displayPaymentTable(paymentData);
        updateStats(paymentData);
        
        // Loading gizle, sonuçları göster
        loadingDiv.classList.remove('show');
        tableContainer.classList.remove('d-none');
        statsDiv.classList.remove('d-none');
        
        // Tabloya kaydır
        tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 800);
}

// Ödeme verilerini oluştur
function generatePaymentData(year, month) {
    const paymentData = [];
    let startDate, endDate;
    
    if (month === 'all') {
        startDate = new Date(year, 0, 1); // Yılın ilk günü
        endDate = new Date(year, 11, 31); // Yılın son günü
    } else {
        const monthNum = parseInt(month) - 1;
        startDate = new Date(year, monthNum, 1); // Ayın ilk günü
        endDate = new Date(year, monthNum + 1, 0); // Ayın son günü
    }
    
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        const tradeDate = new Date(currentDate);
        const paymentDate = calculateEpiasPaymentDate(tradeDate);
        
        paymentData.push({
            tradeDate: new Date(tradeDate),
            paymentDate: new Date(paymentDate)
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return paymentData;
}

// Tabloyu görüntüle (Modern Tasarım)
function displayPaymentTable(paymentData) {
    const tableBody = document.getElementById('paymentTableBody');
    tableBody.innerHTML = '';
    
    paymentData.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        // Tarih formatları - Uzun gün isimleri
        const tradeDateFormatted = row.tradeDate.toLocaleDateString('tr-TR');
        const tradeDayName = row.tradeDate.toLocaleDateString('tr-TR', { weekday: 'long' });
        
        const paymentDateFormatted = row.paymentDate.toLocaleDateString('tr-TR');
        const paymentDayName = row.paymentDate.toLocaleDateString('tr-TR', { weekday: 'long' });
        
        // İşlem tarihi için detaylı durum bilgisi
        let detailedStatus = '';
        let statusClass = '';
        const tradeDateString = formatDateToString(row.tradeDate);
        
        if (isHoliday(row.tradeDate)) {
            detailedStatus = `Tatil`;
            statusClass = 'badge-holiday';
        } else if (isWeekend(row.tradeDate)) {
            detailedStatus = `Hafta Sonu`;
            statusClass = 'badge-weekend';
        } else {
            detailedStatus = `İş Günü`;
            statusClass = 'badge-business';
        }
        
        tr.innerHTML = `
            <td class="text-center">
                <div class="date-cell">${tradeDateFormatted}</div>
            </td>
            <td class="text-center">
                <small class="text-muted">${tradeDayName}</small>
            </td>
            <td class="text-center">
                <div class="date-cell">${paymentDateFormatted}</div>
            </td>
            <td class="text-center">
                <small class="text-muted">${paymentDayName}</small>
            </td>
            <td class="text-center">
                <span class="badge status-modern ${statusClass}" title="${detailedStatus}">
                    ${detailedStatus}
                </span>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
}

// İstatistikleri güncelle
function updateStats(paymentData) {
    let businessDays = 0;
    let weekendDays = 0;
    let holidayDays = 0;
    
    paymentData.forEach(row => {
        if (isHoliday(row.tradeDate)) {
            holidayDays++;
        } else if (isWeekend(row.tradeDate)) {
            weekendDays++;
        } else {
            businessDays++;
        }
    });
    
    document.getElementById('totalDays').textContent = paymentData.length;
    document.getElementById('businessDays').textContent = businessDays;
    document.getElementById('weekendDays').textContent = weekendDays;
    document.getElementById('holidayDays').textContent = holidayDays;
}

// CSV indirme fonksiyonu
function downloadCSV() {
    const tableContainer = document.getElementById('tableContainer');
    
    if (tableContainer.classList.contains('d-none')) {
        alert('İndirilecek veri bulunamadı. Önce takvim oluşturun.');
        return;
    }
    
    let csvContent = '\uFEFF'; // UTF-8 BOM for Turkish characters
    csvContent += 'İşlem Tarihi,İşlem Günü,Ödeme Tarihi,Ödeme Günü,Durum\n';
    
    // Mevcut ödeme verilerini kullan
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const selectedYear = parseInt(yearSelect.value);
    const selectedMonth = monthSelect.value;
    
    const paymentData = generatePaymentData(selectedYear, selectedMonth);
    
    paymentData.forEach(row => {
        const tradeDate = formatDateToTurkish(row.tradeDate);
        const tradeDayName = row.tradeDate.toLocaleDateString('tr-TR', { weekday: 'long' });
        const paymentDate = formatDateToTurkish(row.paymentDate);
        const paymentDayName = row.paymentDate.toLocaleDateString('tr-TR', { weekday: 'long' });
        
        // Durum bilgisi
        let status = '';
        if (isHoliday(row.tradeDate)) {
            status = 'Tatil';
        } else if (isWeekend(row.tradeDate)) {
            status = 'Hafta Sonu';
        } else {
            status = 'İş Günü';
        }
        
        csvContent += `"${tradeDate}","${tradeDayName}","${paymentDate}","${paymentDayName}","${status}"\n`;
    });
    
    // Dosya adını oluştur
    let fileName = `epias_odeme_takvimi_${selectedYear}`;
    if (selectedMonth !== 'all') {
        const monthNames = ['', 'ocak', 'subat', 'mart', 'nisan', 'mayis', 'haziran', 
                           'temmuz', 'agustos', 'eylul', 'ekim', 'kasim', 'aralik'];
        fileName += `_${monthNames[parseInt(selectedMonth)]}`;
    }
    fileName += '.csv';
    
    // Dosyayı indir
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

// Excel (.xlsx) indirme fonksiyonu
function downloadExcel() {
    const tableContainer = document.getElementById('tableContainer');
    
    if (tableContainer.classList.contains('d-none')) {
        alert('İndirilecek veri bulunamadı. Önce takvim oluşturun.');
        return;
    }
    
    // Mevcut ödeme verilerini kullan
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const selectedYear = parseInt(yearSelect.value);
    const selectedMonth = monthSelect.value;
    
    const paymentData = generatePaymentData(selectedYear, selectedMonth);
    const excelData = [];
    
    // Header ekle
    excelData.push(['İşlem Tarihi', 'İşlem Günü', 'Ödeme Tarihi', 'Ödeme Günü', 'Durum']);
    
    // Veri satırlarını ekle
    paymentData.forEach(row => {
        const tradeDate = formatDateToTurkish(row.tradeDate);
        const tradeDayName = row.tradeDate.toLocaleDateString('tr-TR', { weekday: 'long' });
        const paymentDate = formatDateToTurkish(row.paymentDate);
        const paymentDayName = row.paymentDate.toLocaleDateString('tr-TR', { weekday: 'long' });
        
        // Durum bilgisi
        let status = '';
        if (isHoliday(row.tradeDate)) {
            status = 'Tatil';
        } else if (isWeekend(row.tradeDate)) {
            status = 'Hafta Sonu';
        } else {
            status = 'İş Günü';
        }
        
        excelData.push([tradeDate, tradeDayName, paymentDate, paymentDayName, status]);
    });
    
    // Excel dosyası oluştur
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Sütun genişliklerini ayarla
    ws['!cols'] = [
        { width: 12 }, // İşlem Tarihi
        { width: 15 }, // İşlem Günü
        { width: 12 }, // Ödeme Tarihi
        { width: 15 }, // Ödeme Günü
        { width: 15 }  // Durum
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ödeme Takvimi');
    
    // Dosya adını oluştur
    const fileName = generateFileName('xlsx');
    
    // Excel dosyasını indir
    XLSX.writeFile(wb, fileName);
}

// PDF indirme fonksiyonu
function downloadPDF() {
    const tableContainer = document.getElementById('tableContainer');
    
    if (tableContainer.classList.contains('d-none')) {
        alert('İndirilecek veri bulunamadı. Önce takvim oluşturun.');
        return;
    }
    
    // PDF oluştur
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Türkçe font desteği için
    doc.setLanguage('tr');
    
    // Başlık
    doc.setFontSize(16);
    doc.text('EPİAŞ Ödeme Günü Takvimi', 105, 20, { align: 'center' });
    
    // Tarih bilgisi
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const selectedYear = yearSelect.value;
    const selectedMonth = monthSelect.value;
    
    let periodText = selectedYear;
    if (selectedMonth !== 'all') {
        const monthNames = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                           'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        periodText += ` - ${monthNames[parseInt(selectedMonth)]}`;
    }
    
    doc.setFontSize(12);
    doc.text(`Dönem: ${periodText}`, 105, 30, { align: 'center' });
    doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 105, 37, { align: 'center' });
    
    // Mevcut ödeme verilerini kullan
    const paymentData = generatePaymentData(selectedYear, selectedMonth);
    const tableData = [];
    
    paymentData.forEach(row => {
        const tradeDate = formatDateToTurkish(row.tradeDate);
        const tradeDayName = row.tradeDate.toLocaleDateString('tr-TR', { weekday: 'long' });
        const paymentDate = formatDateToTurkish(row.paymentDate);
        const paymentDayName = row.paymentDate.toLocaleDateString('tr-TR', { weekday: 'long' });
        
        // Durum bilgisi
        let status = '';
        if (isHoliday(row.tradeDate)) {
            status = 'Tatil';
        } else if (isWeekend(row.tradeDate)) {
            status = 'Hafta Sonu';
        } else {
            status = 'İş Günü';
        }
        
        tableData.push([
            `${tradeDate}\n(${tradeDayName})`,
            `${paymentDate}\n(${paymentDayName})`,
            status
        ]);
    });
    
    // Tabloyu PDF'e ekle
    doc.autoTable({
        head: [['İşlem Tarihi', 'Ödeme Tarihi', 'Durum']],
        body: tableData,
        startY: 45,
        styles: {
            fontSize: 8,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [102, 126, 234],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 40 },
            2: { cellWidth: 35, halign: 'center' }
        }
    });
    
    // Dosya adını oluştur ve indir
    const fileName = generateFileName('pdf');
    doc.save(fileName);
}

// Dosya adı oluşturucu fonksiyon
function generateFileName(extension) {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const selectedYear = yearSelect.value;
    const selectedMonth = monthSelect.value;
    
    let fileName = `epias_odeme_takvimi_${selectedYear}`;
    if (selectedMonth !== 'all') {
        const monthNames = ['', 'ocak', 'subat', 'mart', 'nisan', 'mayis', 'haziran', 
                           'temmuz', 'agustos', 'eylul', 'ekim', 'kasim', 'aralik'];
        fileName += `_${monthNames[parseInt(selectedMonth)]}`;
    }
    fileName += `.${extension}`;
    
    return fileName;
}

// Tatil listesini yükleyen fonksiyon
function loadHolidayList() {
    const holidayListElement = document.getElementById('holidayList');
    
    // Tatilleri tarihe göre sırala
    const sortedHolidays = Object.entries(turkeyHolidays)
        .sort(([a], [b]) => new Date(a) - new Date(b));
    
    let currentYear = null;
    let holidayHTML = '';
    
    sortedHolidays.forEach(([date, name]) => {
        const holidayDate = new Date(date);
        const year = holidayDate.getFullYear();
        
        // Yıl değiştiğinde başlık ekle
        if (currentYear !== year) {
            if (currentYear !== null) {
                holidayHTML += '<hr>';
            }
            holidayHTML += `<h6 class="text-primary mb-3 mt-2">${year}</h6>`;
            currentYear = year;
        }
        
        const formattedDate = holidayDate.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long'
        });
        
        holidayHTML += `
            <div class="holiday-item">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold">${name}</span>
                    <small class="text-muted">${formattedDate}</small>
                </div>
            </div>
        `;
    });
    
    holidayListElement.innerHTML = holidayHTML;
}

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Bugünün tarihini varsayılan olarak ayarla
    const today = new Date();
    const todayString = formatDateToString(today);
    document.getElementById('quickDate').value = todayString;
    
    // Mevcut ay ve yılı varsayılan olarak seç
    setCurrentMonthAndYear();
    
    // Tatil listesini yükle
    loadHolidayList();
    
    // Faiz türü değişikliği dinleyicisini başlat
    setupInterestTypeListener();
    
    // Enter tuşu ile hızlı hesaplama yapabilme
    document.getElementById('quickDate').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calculateQuickPayment();
        }
    });
    
    // Yıl/ay değişikliklerinde otomatik güncelleme (isteğe bağlı)
    document.getElementById('yearSelect').addEventListener('change', function() {
        // Eğer daha önce tablo oluşturulmuşsa otomatik güncelle
        const tableContainer = document.getElementById('tableContainer');
        if (!tableContainer.classList.contains('d-none')) {
            generatePaymentCalendar();
        }
    });
    
    document.getElementById('monthSelect').addEventListener('change', function() {
        // Eğer daha önce tablo oluşturulmuşsa otomatik güncelle
        const tableContainer = document.getElementById('tableContainer');
        if (!tableContainer.classList.contains('d-none')) {
            generatePaymentCalendar();
        }
    });
    
    // Faiz hesaplama için otomatik hesaplama dinleyicileri
    setupInterestAutoCalculation();
    
    // İlk yüklemede bir demo göster (isteğe bağlı)
    // generatePaymentCalendar();
});

// Eksik tatil günleri için yedek fonksiyon (dinamik hesaplama)
function calculateReligiousHolidays(year) {
    // Bu fonksiyon gelecekte dini bayramların dinamik hesaplanması için kullanılabilir
    // Şu an için sabit tarihleri kullanıyoruz
    return {};
}

// Mevcut ay ve yılı varsayılan olarak seçme fonksiyonu
function setCurrentMonthAndYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // JavaScript'te ay 0'dan başlar
    
    // Ödeme takvimi sekmesi için
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    
    // Yıl seçimi - eğer mevcut yıl seçeneklerde varsa seç
    if (yearSelect) {
        const yearOption = yearSelect.querySelector(`option[value="${currentYear}"]`);
        if (yearOption) {
            yearSelect.value = currentYear;
        }
    }
    
    // Ay seçimi
    if (monthSelect) {
        monthSelect.value = currentMonth;
    }
    
    // Faiz hesaplama sekmesi için
    const interestYearSelect = document.getElementById('interestYearSelect');
    const interestMonthSelect = document.getElementById('interestMonthSelect');
    
    // Yıl seçimi - eğer mevcut yıl seçeneklerde varsa seç
    if (interestYearSelect) {
        const interestYearOption = interestYearSelect.querySelector(`option[value="${currentYear}"]`);
        if (interestYearOption) {
            interestYearSelect.value = currentYear;
        }
    }
    
    // Ay seçimi
    if (interestMonthSelect) {
        interestMonthSelect.value = currentMonth;
    }
}

// Faiz hesaplama fonksiyonu
function calculateInterest() {
    const yearSelect = document.getElementById('interestYearSelect');
    const monthSelect = document.getElementById('interestMonthSelect');
    const paymentDateInput = document.getElementById('paymentDate');
    const interestRateInput = document.getElementById('interestRate');
    const resultDiv = document.getElementById('interestResult');
    
    // Kontrol: Gerekli alanlar doldurulmuş mu?
    if (!paymentDateInput.value || !interestRateInput.value) {
        alert('Lütfen gerçek ödeme tarihi ve faiz oranını girin.');
        return;
    }
    
    const actualPaymentDate = new Date(paymentDateInput.value);
    const inputRate = parseFloat(interestRateInput.value);
    const selectedYear = parseInt(yearSelect.value);
    const selectedMonth = monthSelect.value;
    
    // Faiz türünü belirle
    const interestType = document.querySelector('input[name="interestType"]:checked').value;
    
    // Seçilen dönem için ödeme verilerini al
    const paymentData = generatePaymentData(selectedYear, selectedMonth);
    
    // Vade gün farklarını hesapla
    const dayDifferences = [];
    paymentData.forEach(row => {
        const scheduledPaymentDate = row.paymentDate;
        const dayDiff = Math.floor((actualPaymentDate - scheduledPaymentDate) / (1000 * 60 * 60 * 24));
        dayDifferences.push(dayDiff);
    });
    
    // Ortalama vade gün sayısını hesapla
    const averageDays = dayDifferences.reduce((sum, days) => sum + days, 0) / dayDifferences.length;
    
    // Faiz oranını yıllık olarak hesapla
    let annualRate;
    let conversionInfo = '';
    
    if (interestType === 'monthly') {
        // Aylık faizden yıllık faize dönüştür
        // Formül: (Aylık Faiz × 360 / Vade Gün Sayısı) 
        annualRate = (inputRate * 360 / Math.abs(averageDays));
        conversionInfo = `Aylık %${inputRate} → Yıllık %${annualRate.toFixed(2)}`;
        
        // Dönüştürme sonucunu göster
        showConversionResult(conversionInfo);
    } else {
        // Zaten yıllık faiz
        annualRate = inputRate;
        // Dönüştürme alanını gizle
        document.getElementById('conversionResult').classList.add('d-none');
    }
    
    // Faiz hesaplamaları
    const dailyRate = (annualRate / 360); // Günlük faiz oranı
    const monthlyRate = (annualRate / 12); // Aylık faiz oranı (basit)
    const totalInterest = (annualRate / 100 / 360) * Math.abs(averageDays); // Vade faizi
    
    // Sonuçları göster
    displayInterestResults(averageDays, dailyRate, monthlyRate, totalInterest, selectedYear, selectedMonth, annualRate, paymentData.length, interestType, inputRate);
    
    resultDiv.classList.remove('d-none');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Dönüştürme sonucunu göster
function showConversionResult(conversionText) {
    const conversionDiv = document.getElementById('conversionResult');
    const conversionTextSpan = document.getElementById('conversionText');
    
    conversionTextSpan.textContent = conversionText;
    conversionDiv.classList.remove('d-none');
}

// Faiz türü değişikliği dinleyicisi
function setupInterestTypeListener() {
    const interestTypeRadios = document.querySelectorAll('input[name="interestType"]');
    const rateLabel = document.getElementById('rateLabel');
    const rateHint = document.getElementById('rateHint');
    const conversionDiv = document.getElementById('conversionResult');
    
    interestTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'monthly') {
                rateLabel.textContent = 'Aylık Faiz Oranı (%)';
                rateHint.textContent = 'Aylık faiz oranını % olarak girin';
            } else {
                rateLabel.textContent = 'Yıllık Faiz Oranı (%)';
                rateHint.textContent = 'Yıllık faiz oranını % olarak girin';
                conversionDiv.classList.add('d-none'); // Yıllık seçilince dönüştürme gizle
            }
        });
    });
}

// Faiz hesaplama için otomatik hesaplama dinleyicileri
function setupInterestAutoCalculation() {
    const yearSelect = document.getElementById('interestYearSelect');
    const monthSelect = document.getElementById('interestMonthSelect');
    const paymentDateInput = document.getElementById('paymentDate');
    const interestRateInput = document.getElementById('interestRate');
    const autoGenerateCheckbox = document.getElementById('autoGenerate');
    
    // Otomatik hesaplama fonksiyonu
    function autoCalculateIfEnabled() {
        if (autoGenerateCheckbox.checked && 
            paymentDateInput.value && 
            interestRateInput.value) {
            calculateInterest();
        }
    }
    
    // Event listener'ları ekle
    yearSelect.addEventListener('change', autoCalculateIfEnabled);
    monthSelect.addEventListener('change', autoCalculateIfEnabled);
    paymentDateInput.addEventListener('change', autoCalculateIfEnabled);
    interestRateInput.addEventListener('input', debounce(autoCalculateIfEnabled, 1000));
    
    // Faiz türü değiştiğinde de otomatik hesapla
    const interestTypeRadios = document.querySelectorAll('input[name="interestType"]');
    interestTypeRadios.forEach(radio => {
        radio.addEventListener('change', autoCalculateIfEnabled);
    });
}

// Debounce fonksiyonu (çok sık hesaplama yapmamak için)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Faiz sonuçlarını görüntüleme fonksiyonu
function displayInterestResults(averageDays, dailyRate, monthlyRate, totalInterest, year, month, annualRate, totalDays, interestType, inputRate) {
    // Ana sonuçları güncelle
    document.getElementById('averageDays').textContent = `${Math.abs(averageDays).toFixed(1)} gün`;
    document.getElementById('annualRateDisplay').textContent = `${annualRate.toFixed(2)}%`;
    document.getElementById('totalInterest').textContent = `${(totalInterest * 100).toFixed(4)}%`;
    
    // Dönem bilgisi
    let periodText = year;
    if (month !== 'all') {
        const monthNames = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                           'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        periodText += ` ${monthNames[parseInt(month)]}`;
    }
    
    // Durum analizi
    const isEarly = averageDays < 0;
    const statusText = isEarly ? 'Erken Ödeme' : 'Geç Ödeme';
    const statusIcon = isEarly ? '📈' : '📉';
    const statusColor = isEarly ? 'text-success' : 'text-warning';
    
    // Faiz türü açıklaması
    let conversionText = '';
    if (interestType === 'monthly') {
        conversionText = `Aylık %${inputRate} oranından hesaplandı`;
    } else {
        conversionText = `Yıllık %${annualRate.toFixed(2)} oranından hesaplandı`;
    }
    
    // Detay alanlarını güncelle
    document.getElementById('periodInfo').textContent = `${periodText} dönemi - ${totalDays} gün analiz`;
    document.getElementById('calculationInfo').textContent = conversionText;
    document.getElementById('statusInfo').innerHTML = `${statusIcon} ${statusText} - Ortalama ${Math.abs(averageDays).toFixed(1)} gün ${isEarly ? 'erkenci' : 'gecikme'}`;
} 