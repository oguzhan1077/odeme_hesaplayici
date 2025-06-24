# EPİAŞ Ödeme Günü Hesaplayıcısı

Modern, kullanıcı dostu EPİAŞ (Enerji Piyasaları İşletme A.Ş.) ödeme günü hesaplama aracı. T+2 iş günü kuralına göre ödeme tarihi hesaplar.

## 🚀 Özellikler

- **T+2 İş Günü Hesaplama**: Türkiye resmi tatillerini ve hafta sonlarını göz önünde bulundurarak ödeme tarihi hesaplar
- **Türkiye Tatil Takvimi**: 2025-2027 yılları için güncel resmi tatiller ve bayram arifesi günleri
- **Modern UI**: Bootstrap 5 ile responsive ve kullanıcı dostu arayüz
- **Hızlı ve Güvenilir**: Tamamen frontend tabanlı, sunucu gerektirmez

## 📋 Desteklenen Tatiller

### Resmi Tatiller
- Yılbaşı (1 Ocak)
- Ulusal Egemenlik ve Çocuk Bayramı (23 Nisan)
- Emek ve Dayanışma Günü (1 Mayıs)
- Atatürk'ü Anma, Gençlik ve Spor Bayramı (19 Mayıs)
- Zafer Bayramı (30 Ağustos)
- Cumhuriyet Bayramı (29 Ekim)

### Dini Bayramlar
- Ramazan Bayramı (3 gün) + Arife
- Kurban Bayramı (4 gün) + Arife

## 🛠️ Teknolojiler

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome 6
- **Deployment**: Netlify

## 📦 Kurulum ve Çalıştırma

### Yerel Geliştirme
```bash
# Repo'yu klonlayın
git clone [repository-url]
cd epias-calculator

# Basit HTTP sunucusu ile çalıştırın
python -m http.server 8000
# veya
npx serve .

# Tarayıcıda açın: http://localhost:8000
```

### Netlify ile Deploy

1. **Manuel Deploy**:
   - [Netlify](https://netlify.com) hesabınıza giriş yapın
   - "New site from Git" seçeneğini tıklayın
   - Repository'yi bağlayın
   - Otomatik deploy başlayacaktır

2. **Drag & Drop Deploy**:
   - Tüm dosyaları seçip Netlify dashboard'una sürükleyip bırakın
   - Deploy otomatik olarak başlayacaktır

3. **Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

## 📁 Proje Yapısı

```
epias-calculator/
├── index.html          # Ana HTML dosyası
├── epias-calculator.js  # JavaScript mantığı
├── netlify.toml        # Netlify konfigürasyonu
├── README.md           # Dokümantasyon
└── odeme_gunu.py      # Orijinal Python kodu (referans)
```

## 🔧 Konfigürasyon

### Tatil Günlerini Güncelleme
`epias-calculator.js` dosyasındaki `turkeyHolidays` objesini düzenleyerek yeni tatil günleri ekleyebilirsiniz:

```javascript
const turkeyHolidays = {
    '2025-01-01': 'Yılbaşı',
    '2025-03-30': 'Ramazan Bayramı (1. Gün)',
    // Yeni tatilleri buraya ekleyin...
};
```

## 🎯 Kullanım

1. İşlem tarihini seçin
2. "Ödeme Gününü Hesapla" butonuna tıklayın
3. T+2 iş günü sonrasındaki ödeme tarihi görüntülenecektir

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

⚡ **EPİAŞ Ödeme Günü Hesaplayıcısı** - Türkiye enerji piyasaları için güvenilir ödeme tarihi hesaplama aracı 