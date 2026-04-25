# Tasarım Sistemi — EPİAŞ Hesaplayıcı

---

## 1. Design Tokens

Tek dosya: `design-system.css`. Tüm token'lar `:root` içinde. Kategoriler aşağıda.

### 1a. Renk

**Accent**

| Token | Değer | Kural |
|-------|-------|-------|
| `--accent` | `#007aff` | Tek dekoratif renk. Primary buton, aktif tab, focus ring, link. |
| `--accent-hover` | `#0071e3` | Accent'in hover state'i. Buton hover. |
| `--accent-active` | `#0062cc` | Accent'in pressed/active state'i. |
| `--accent-subtle` | `#eff6ff` | Accent'in çok açık tonu. Result card bg, badge-info bg. |
| `--accent-on` | `#ffffff` | Accent üzerine yazılan text rengi. Solid primary buton içi. |

**Text**

| Token | Değer | Kural |
|-------|-------|-------|
| `--text-primary` | `#111827` | Ana metin. Başlık, gövde, label. |
| `--text-secondary` | `#374151` | İkincil metin. Alt başlık, açıklama. |
| `--text-muted` | `#6b7280` | Soluk metin. Helper text, placeholder, zaman damgası. |
| `--text-on-accent` | `#ffffff` | Renkli arka plan üstü (accent, success, danger). |

**Background**

| Token | Değer | Kural |
|-------|-------|-------|
| `--bg-page` | `#f9fafb` | Sayfa arka planı. Body background. |
| `--bg-card` | `#ffffff` | Kart arka planı. Card, panel, modal. |
| `--bg-subtle` | `#f3f4f6` | Hafif gri. Card header, disabled input, table header. |
| `--bg-hover` | `#f9fafb` | Row hover, dropdown item hover. |

**Border**

| Token | Değer | Kural |
|-------|-------|-------|
| `--border-subtle` | `#f0f0f0` | Çok ince ayırıcı. Tablo satır arası, içsel separator. |
| `--border-default` | `#e5e7eb` | Standart kenarlık. Card, input, dropdown. |
| `--border-strong` | `#d1d5db` | Vurgulu kenarlık. Focus ring alternatifi, section divider. |

**Functional**

| Token | Değer | Kural |
|-------|-------|-------|
| `--success` | `#16a34a` | Başarı rengi. Sadece anlamlı durum: "İş Günü" badge, success alert. |
| `--success-subtle` | `#f0fdf4` | Success badge/alert arka planı. |
| `--warning` | `#ca8a04` | Uyarı rengi. Eşleşmeyen tedarikçi uyarısı, dosya hataları. |
| `--warning-subtle` | `#fefce8` | Warning alert arka planı. |
| `--danger` | `#dc2626` | Hata rengi. is-invalid input, error alert, validation panel. |
| `--danger-subtle` | `#fef2f2` | Danger alert/validation arka planı. |

---

### 1b. Spacing (4px base)

| Token | Değer | Örnek kullanım |
|-------|-------|----------------|
| `--space-1` | `4px` | Icon padding, tiny gap |
| `--space-2` | `8px` | Input helper margin, badge padding |
| `--space-3` | `12px` | Button padding dikey, list item padding |
| `--space-4` | `16px` | Card body padding, card-to-card boşluk |
| `--space-5` | `20px` | Section-içi bloklar arası |
| `--space-6` | `24px` | Card body padding geniş, step arası |
| `--space-8` | `32px` | Majör section arası dikey boşluk |
| `--space-10` | `40px` | Sayfa header alt boşluğu |
| `--space-12` | `48px` | Büyük section break |

---

### 1c. Border Radius

| Token | Değer | Kullanım |
|-------|-------|---------|
| `--radius-sm` | `4px` | Badge, input-group-text, küçük tag |
| `--radius-md` | `8px` | Buton, input, card, alert, dropdown |
| `--radius-lg` | `12px` | Modal, büyük panel, stat-card |
| `--radius-full` | `9999px` | Pill badge, radio-group kapsayıcı |

---

### 1d. Font Sizes

| Token | Değer | Kullanım |
|-------|-------|---------|
| `--text-xs` | `11px` | Tablo thead label, meta bilgi |
| `--text-sm` | `13px` | Helper text, badge, secondary buton, tablo satır |
| `--text-base` | `14px` | Gövde metni, form label, primary buton |
| `--text-md` | `15px` | Alt başlık, card-header başlık |
| `--text-lg` | `16px` | Bölüm başlığı, section title |
| `--text-xl` | `20px` | Önemli sayı (stat card) |
| `--text-2xl` | `24px` | Faiz sonucu büyük sayı |
| `--text-3xl` | `30px` | Ödeme tarihi vurgulu sayı (Sekme 1 result) |

---

### 1e. Font Weights

| Token | Değer | Kullanım |
|-------|-------|---------|
| `--font-normal` | `400` | Gövde, helper text |
| `--font-medium` | `500` | Buton, tab, label, tablo satır |
| `--font-semibold` | `600` | Başlık, stat sayısı, tablo thead, card-header |

---

### 1f. Shadows

| Token | Değer | Kullanım |
|-------|-------|---------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Kart üzerine çok hafif derinlik gerekirse (çoğu yerde kullanılmaz, border yeter) |
| `--shadow-sm` | `0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.06)` | Modal, dropdown menü |

**Kural:** Varsayılan card'lar `border` kullanır, shadow kullanmaz. Shadow sadece yüzen element'lerde (dropdown, modal).

---

### 1g. Transitions

| Token | Değer | Kullanım |
|-------|-------|---------|
| `--transition-fast` | `150ms ease` | Buton hover/active, input focus, badge color |

---

### 1h. Z-index Ladder

| Token | Değer | Kullanım |
|-------|-------|---------|
| `--z-base` | `0` | Normal akış |
| `--z-dropdown` | `10` | Dropdown menü, tooltip |
| `--z-sticky` | `20` | Sticky tablo thead |
| `--z-modal` | `30` | Modal overlay + dialog |

---

## 2. Component Stilleri

### Butonlar

**Temel kural:** Hiyerarşi renk ile değil, dolgu/kenarlık/ağırlık ile kurulur. Bir sayfada tek bir `.btn-primary` olmalı. Sekme 1'deki "Hesapla", "Takvim Oluştur", "İndir" üçü de aynı anda primary değil — bkz. aşağıdaki tablo.

| Class | Görünüm | Bootstrap karşılığı | Ne zaman |
|-------|---------|-------------------|---------|
| `.btn-primary` | `--accent` dolu, `--accent-on` text | `.btn-primary`, `.btn-success`, `.btn-danger` (mevcut) | Tek ana aksiyon. "Hesapla", "Takvim Oluştur", "PTF Çek", "Faiz Hesapla" |
| `.btn-secondary` | `--bg-card` arka plan, `--border-default` border, `--text-primary` text | `.btn-outline-*` ailesinin hepsi | İkincil aksiyon. "Excel İndir", "CSV İndir", dropdown toggle |
| `.btn-ghost` | Transparan, border yok, `--text-secondary` text | `btn-link` gibi ama block değil | Tertiary. "Tümünü Seç", "Hiçbirini Seçme", dismiss bağlantıları |
| `.btn-icon` | `.btn-ghost` variant, kare, minimum footprint | — | Icon-only. Validation panel kapat "✕" |
| `.btn-danger-action` | `--danger` dolu veya `--danger-subtle` bg + `--danger` border | — | Sadece yıkıcı aksiyon. Şu an projede böyle bir aksiyon yok. Gelecek için tanımlanır. |

**Boyut varyantları:** `.btn-sm` (sekme içi kompakt), default (standart), `.btn-lg` (modal primary gibi büyük bağlamlar için).

---

### Cards

| Class | Görünüm | Kural |
|-------|---------|-------|
| `.card` | `--bg-card`, `--border-default` border, `--radius-md`, shadow yok | Temel kap. Form grupları, tablo kapsayıcıları. |
| `.card-header` | `--bg-subtle` bg, `--border-default` border-bottom, padding `--space-3 --space-5` | Kart başlığı. Şu anki gradient card-header'ların yerine. |
| `.card-body` | padding `--space-5` | Standart içerik alanı. |
| `.card-footer` | `--bg-subtle` bg, `--border-default` border-top | Opsiyonel. |
| `.stat-card` | `--bg-card`, `--border-default`, `--radius-lg`, ortalanmış, sayı + label + opsiyonel icon | KPI gösterimi. Sayı: `--text-xl`/`--text-2xl` + `--font-semibold` + `--accent`. Label: `--text-xs` + `--font-medium` + `--text-muted`. Gradient text kesinlikle yok. |
| `.result-card` | `--accent-subtle` bg, `--accent` 3px sol border, `--radius-md` | Hesaplama sonucu vurgusu. Gradient yerine subtle tinted background kullanılır. |

---

### Tablolar

| Element | Görünüm | Kural |
|---------|---------|-------|
| `.table` | border-collapse, %100 genişlik, `--text-base` | Bootstrap `.table-dark` kaldırılır, temel `.table` override edilir. |
| `thead th` | `--bg-subtle` bg, `--border-default` alt çizgi, `--text-xs`, `--font-medium`, `--text-muted`, uppercase, letter-spacing | Stripe tarzı düşük kontrast thead. |
| `tbody td` | `--border-subtle` alt çizgi, `--text-base`, `--text-primary` | Satır arası çizgi çok ince — satırlar "yüzer" hissinde değil. |
| `tbody tr:hover` | `--bg-hover` | Çok subtle, transition `--transition-fast`. `transform: translateY()` yok. |
| `tfoot td` | `--border-default` üst çizgi (2px), `--font-semibold` | Toplam satırı. |
| `.num` utility | `text-align: right`, `font-variant-numeric: tabular-nums` | Tüm sayısal sütunlarda. |
| `.dim` utility | `--text-muted` renk | Eşleşmeyen/pasif satırlar. |

---

### Form Elements

| Class | Görünüm | Bootstrap karşılığı | Notlar |
|-------|---------|-------------------|-------|
| `.form-control`, `.form-select` | `--bg-card`, `--border-default`, `--radius-md`, `--text-base`, padding `--space-2 --space-3` | Override. | Focus: `--accent` border, box-shadow yok. Disabled: `--bg-subtle`. |
| `.form-control.is-invalid` | `--danger` border | Override. | JS'in `is-invalid` class'ı eklediği yer — override bunu destekler, yapısal değişiklik yok. |
| `.form-check-input` (checkbox) | `accent-color: var(--accent)` | Override. | Native checkbox, sadece renk override. |
| `.form-check-input` (radio) | `accent-color: var(--accent)` | Override. | Native radio, sadece renk override. |
| `.radio-group` | Yeni component. İki buton yan yana, ortak border, `--radius-md`, active → `--accent` dolu | Şu anki `btn-check + btn-outline-success` yerine | Faiz sekmesindeki Yıllık/Aylık toggle için. Dışarısı: `--border-default` tek çizgi çerçeve. İçerideki separator: `--border-default`. Aktif segment: `--accent` bg + `--accent-on` text. Pasif: `--bg-card` + `--text-secondary`. |
| `.input-group` (blok) | label → input → helper text dikey stack | `.mb-3` + `label` + `.form-control` | Label: `--text-sm` `--font-medium` `--text-primary`, margin-bottom `--space-1`. Helper: `--text-xs` `--text-muted`, margin-top `--space-1`. |
| `.input-group-text` | `--bg-subtle`, `--border-default`, `--radius-md` | Bootstrap `.input-group-text` override | % sembolü gibi eklentiler için. |

---

### Badge'ler

| Class | Görünüm | Kullanım |
|-------|---------|---------|
| `.badge` | `--bg-subtle` bg, `--text-secondary` text, `--border-default` border, `--radius-full`, `--text-xs`, `--font-medium` | Nötr durum. Dosya bilgisi badge'i. |
| `.badge-success` | `--success-subtle` bg, `--success` text | "İş Günü" |
| `.badge-warning` | `--warning-subtle` bg, `--warning` text | — |
| `.badge-danger` | `--danger-subtle` bg, `--danger` text | "Tatil" |
| `.badge-info` | `--accent-subtle` bg, `--accent` text | "Hafta Sonu" — neutral/informational |

**Semantic öneri:**
- "İş Günü" → `.badge-success` (pozitif durum)
- "Hafta Sonu" → `.badge` (nötr — değer yargısı yok, sadece bilgi)
- "Tatil" → `.badge-danger` (mevcut kırmızı logic doğru — tatil = ödeme yapılamaz)

---

### Alerts

| Class | Görünüm | Bootstrap karşılığı |
|-------|---------|-------------------|
| `.alert` | Padding `--space-4`, `--radius-md`, 3px sol border, soft bg | Temel. |
| `.alert-info` | `--accent-subtle` bg, `--accent` sol border | `.alert-info` override |
| `.alert-success` | `--success-subtle` bg, `--success` sol border | `.alert-success` override |
| `.alert-warning` | `--warning-subtle` bg, `--warning` sol border | `.alert-warning` override |
| `.alert-danger` | `--danger-subtle` bg, `--danger` sol border | `.alert-danger` override |

Dismiss butonu: `.btn-icon` (X), sağ üstte, `--text-muted` renk.

**Gradient alert-info'ların (Faiz sekmesinde 2 adet) dönüşümü:** Gradient kaldırılır, `.alert-info` stiline dönüşür. Bilgilendirme metni doğrudan `--text-primary` renkte görünür — gradient şu an salt dekorasyondu.

---

### Tabs (Ana Navigasyon)

**Öneri: Underline tab stili.**

**Gerekçe:** Projedeki üç sekme farklı modlar değil, farklı bölümler. Segmented control (pill) 2–4 arasında sıkı seçim için uygun — örneğin Yıllık/Aylık toggle. Üç büyük bölüm navigasyonu için Stripe ve Linear'ın kullandığı underline tab daha profesyonel ve daha az oyuncu hissettiriyor. Ek olarak: `data-bs-toggle="pill"` Bootstrap'in pill tab JS'idir, underline tab'e geçildiğinde bu class'ı `"tab"` olarak değiştirmek gerekir — ama Bootstrap'in JS tab mekanizması `data-bs-toggle="tab"` ile de çalışır, sadece görsel fark.

**Not:** `data-bs-toggle="pill"` → `data-bs-toggle="tab"` değişimi HTML'de yapılacak, JS davranışı aynı kalır.

| Class | Görünüm | Kural |
|-------|---------|-------|
| `.tabs` (`.nav`) | Flex, `--border-default` alt çizgi, gap yok | Tab bar kapsayıcısı. |
| `.tab` (`.nav-link`) | Padding `--space-3 --space-4`, `--text-sm` `--font-medium`, `--text-muted`, arka plan yok, border yok | Pasif sekme. |
| `.tab:hover` | `--text-secondary` | Subtle hover — arka plan değişikliği yok. |
| `.tab.active` | `--text-primary`, 2px alt border `--accent` | Aktif sekme. Border sadece alt kenarda, kart içine değil dışa taşar. |

**Yıllık/Aylık toggle:** `.radio-group` (segmented control) — küçük ölçek, iki seçenek → segmented burada doğru seçim.

---

### Dropdown

| Element | Görünüm |
|---------|---------|
| `.dropdown-menu` | `--bg-card`, `--border-default` border, `--radius-md`, `--shadow-sm`, min-width 160px |
| `.dropdown-item` | padding `--space-2 --space-4`, `--text-sm`, `--text-primary`, hover → `--bg-hover` |
| `.dropdown-divider` | `--border-subtle` |

Bootstrap dropdown JS korunur, sadece görsel override.

---

### Spinner

`.spinner-border` override: `--accent` renk, `border-width: 2px`, boyut `1.25rem`. `.spinner-border-sm` variant zaten Bootstrap'te var, kullanılmaya devam edilir.

---

### Empty State

`.empty-state` — şu an projede kullanılmıyor ama tanımlanır:

Yapı: merkez hizalı, icon (`--text-muted`, 2rem), h3 (`--text-lg` `--font-semibold` `--text-primary`), p (`--text-sm` `--text-muted`), opsiyonel `.btn-primary`.

---

### Validation Panel

Mevcut `.ia-validation-panel` genelleştirilerek `.validation-panel` olur. Her sekmede kullanılabilir.

| Element | Görünüm |
|---------|---------|
| `.validation-panel` | `--danger-subtle` bg, `--danger` 3px sol border, `--radius-md`, padding `--space-4` |
| `.validation-panel-title` | `--font-semibold`, `--danger`, flex + space-between (dismiss butonu ile) |
| `.validation-panel ul` | `--text-sm`, `--text-primary`, padding-left |
| `.validation-panel .dismiss` | `.btn-icon`, `--danger` renk |

---

### Result Display (Özel)

**Sekme 1 — Hızlı Hesaplama sonucu:**

Şu an: `result-card` class'ı, `background: var(--secondary-gradient)` (mavi gradient).  
Yeni: `.result-card` → `--accent-subtle` arka plan, `--accent` 3px sol border, `--radius-md`. İçeride: "Ödeme Tarihi" label (`--text-sm` `--text-muted`), tarih (`--text-3xl` `--font-semibold` `--text-primary`), detay (`--text-sm` `--text-muted`).

**Sekme 2 — Faiz sonucu:**

Şu an: `--primary-gradient` ile büyük mor kart, glassmorphism `.details-card`.  
Yeni: `.card` + `--bg-subtle` arka plan (hafif ayırt ediciliği korunur). İçeride 3 sütun metric: label (`--text-xs` uppercase `--text-muted`), sayı (`--text-2xl` `--font-semibold` `--text-primary`). Detay bölümü: `--border-subtle` üst çizgi, düz satırlar. Glassmorphism kalkıyor.

**Sonuç ikonları (2.5rem Font Awesome ikonları):**

Önerim: Küçültülmüş biçimiyle korunur. Boyut `1.25rem` → `--text-xl`, renk `--accent`. 2.5rem çok büyük ve gradient üstünde "kayboluyordu" — light bg'de daha sade duracak. Tamamen kaldırılırsa başlıkla label ayrımı zayıflar; küçük icon sayısal veriye bağlam veriyor (takvim, yüzde, grafik).

---

## 3. Layout

| Karar | Değer | Gerekçe |
|-------|-------|---------|
| Sayfa arka planı | `#f9fafb` (`--bg-page`) | Pure white'ta kart kenarlıkları yeterince ayrışıyor ama çok steril hissettiriyor. `#f9fafb` (Tailwind gray-50, Apple Finder arka planı) barely-there derinlik sağlar. |
| Container max-width | Mevcut `col-lg-10` korunur | Bootstrap'in container + col-lg-10 kombinasyonu yeterli. Fazladan max-width eklemeye gerek yok. |
| Section spacing | `--space-8` (32px) dikey | Sekmeler arası major section'lar için. |
| Card spacing | `--space-4` (16px) dikey | Aynı sekme içindeki kartlar arası. |
| Mobile breakpoint | Bootstrap `md` (768px) | Grid tek kolona geçiş. Tablo → horizontal scroll. Mevcut `col-md-*` yapısı korunur. |
| Page header | Gradient arka plan tamamen kalkar. `--bg-card` veya `--bg-page` üzerinde `--text-primary` başlık. | Şu an header `.main-container`'ın gradient background'u üzerinde duruyor. Bu gradient da gidecek. |
| Font stack | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Mevcut `'Segoe UI', Tahoma, Geneva, Verdana` yerine. |

---

## 4. Bootstrap Override Stratejisi

**Ön not — Kritik öncelik:** `<html data-bs-theme="dark">` attribute'u **ilk adımda** kaldırılacak. Bu tek değişiklik Bootstrap'in dark-mode CSS değişken setini (`--bs-body-bg: #212529` vb.) devre dışı bırakır. Bu olmadan sonraki override'ların büyük çoğunluğu dark-mode'la savaşmak zorunda kalır.

**Strateji:** `design-system.css` Bootstrap'ten sonra yüklenir. Renk token'ları için Bootstrap'in kendi `--bs-*` değişkenlerini `:root`'ta ezeriz (specificity sorunu yok). Yapısal değişiklikler için aynı selector (veya `body` prefix ile +1 specificity). `!important` sadece zorunlu durumlarda.

| Bootstrap class | Override yaklaşımı | `!important` gerekli mi |
|-----------------|-------------------|------------------------|
| `.btn-primary` | `:root` içinde `--bs-btn-bg`, `--bs-btn-border-color` vb. BS custom property'lerini ezdikten sonra `.btn-primary` re-stil (bg, border-radius, padding, transition) | Hayır — sonra yüklenen CSS yeterli |
| `.btn-success` | Projede kalmayacak. HTML'den class kaldırılır, yerine `.btn-primary` veya `.btn-secondary` gelir | — |
| `.btn-danger` | Projede kalmayacak (Takvim Oluştur → `.btn-primary`). `.btn-danger-action` sadece yeni semantic için | — |
| `.btn-outline-success` | Kaldırılacak. `.radio-group` component'i ile replace | — |
| `.card` | Override: bg `--bg-card`, border `--border-default`, border-radius `--radius-md`, box-shadow `none` | Hayır |
| `.card-header` | Override: bg `--bg-subtle`, border-bottom `--border-default`, color `--text-primary` | Hayır |
| `.alert-info` | Tam override: gradient kaldır, `--accent-subtle` bg, `--accent` sol border | Evet — Bootstrap'in `.alert-info` renk variable'ları (`--bs-alert-color` vb.) overrideı için `--bs-alert-*` property ezimi + belki `!important` |
| `.alert-warning` / `.alert-danger` | Aynı yaklaşım | Evet (aynı sebep) |
| `.table-dark` | HTML'den kaldırılır, class projede kalmaz | — |
| `.table-hover tbody tr:hover` | Override: background `--bg-hover`, transform `none` | Hayır |
| `.table thead th` | Override: bg `--bg-subtle`, border, typography | Hayır |
| `.nav-pills .nav-link` | `data-bs-toggle="pill"` → `"tab"` + `.nav-pills` → `.nav-tabs` veya custom class. `.nav-link` underline style'a override | Muhtemelen evet — Bootstrap nav-pills active state'in `--bs-nav-pills-link-active-bg` var'ı var |
| `.nav-pills .nav-link.active` | Override: bg `transparent`, border-bottom `2px solid --accent`, color `--text-primary` | Evet — Bootstrap'in solid bg atamasını kırmak için |
| `.dropdown-menu` | Override: bg `--bg-card`, border `--border-default`, shadow `--shadow-sm`, border-radius `--radius-md` | Hayır |
| `.dropdown-item:hover` | Override: bg `--bg-hover`, color `--text-primary`, transform `none` | Hayır |
| `.spinner-border` | Override: color `--accent`, border-width `2px` | Evet — Bootstrap spinner rengini `border-color` ile set ediyor, `.text-primary` class'ı üzerine geliyor |
| `.form-control`, `.form-select` | Override: bg `--bg-card`, border `--border-default`, border-radius `--radius-md`, padding, font-size | Evet (focus state için — Bootstrap'in `.form-control:focus` specificity) |
| `.form-control.is-invalid` | Override: border-color `--danger`, background-image `none` | Evet — Bootstrap validation image ekleniyor |
| `.badge` | Override: font-size, padding, border-radius `--radius-full` | Hayır |
| `.btn-check:checked + .btn-outline-success` | Kaldırılacak. `.radio-group` ile replace | — |

---

## 5. Özel Sorular — Öneriler

### Tab stili: underline mi, segmented mi?

**Underline.** Gerekçe yukarıda Component bölümünde açıklandı. Ek: uEnerji bir üretim aracı — kullanıcı günde onlarca kez sekme değiştirir. Underline daha az "klik" hissettiriyor, daha az interaktif/oyuncu. Segmented control sadece 2-seçenekli toggle için (Yıllık/Aylık — orası zaten segmented).

### Page background: `#ffffff` mi, `#f9fafb` mi?

**`#f9fafb`.** Saf beyaz üzerine beyaz kart koyunca görsel ayrışma için ya shadow ya kalın border gerekirdi. `#f9fafb` (%96.4 beyaz) insan gözünün zar zor algıladığı bir derinlik katmanı ekler, tek ince border yeterli olur. Stripe, Linear, Notion — hepsi off-white kullanır.

### "Takvim Oluştur" butonu rengi

**Hem kararın hem de benim önerim aynı: `.btn-primary`.** "Takvim Oluştur" Dönem Analizi bölümünün tek ana aksiyonu. Kırmızı yapmak "sil/yıkıcı aksiyon" çağrışımı yaratıyordu; dikkat çekmek için primary yeterli.

### Sonuç kartlarındaki ikonlar

**Korunur, küçültülür.** `1.25rem` boyut, `--accent` renk, inline style kaldırılır. Tamamen kaldırılırsa üç metrik birbirinden sadece başlıkla ayrışır — icon bağlam veriyor (takvim = süre, yüzde = oran, grafik = tutar).

---

