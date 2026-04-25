# Changelog

All notable changes to this project are documented here.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [v2.1] — 2026-04-25

### Added
- Unified `design-system.css` with CSS custom property tokens (color, spacing, typography, radius, shadow, z-index)
- Apple HIG + Stripe-inspired flat aesthetic — light theme only
- `.radio-group` segmented control component (replaces `btn-check + btn-outline-success`)
- `.validation-panel` global component (generalized from former `.ia-validation-panel`)
- `.supplier-card` single-row flex layout with fixed-width controls block (300px)

### Changed
- Bootstrap dark theme (`data-bs-theme="dark"`) removed — light theme only
- All gradients replaced with flat colors using `--accent` (`#007aff`)
- Detail table removed from İA-PTF UI (still present in Excel export)
- Summary table simplified to 5 columns; MWh display changed from 4 to 2 decimal places
- Supplier card: 160px type select + 132px value group for consistent right-edge alignment across PTF/Sabit modes
- `ia-ptf.css` content absorbed into `design-system.css`; file deleted

### Removed
- `ia-ptf.css` (372 lines; all styles migrated to `design-system.css`)
- `.ia-*` prefix from all CSS classes
- 433-line inline `<style>` block from `index.html`
- Dark theme variables (`--dark-bg`, `--primary-gradient`, etc.)
- 15 unused CSS classes: `.btn-check`, `.btn-outline-success`, `.btn-sm`, `.btn-lg`, `.btn-danger`, `.btn-danger-action`, `.btn-ghost`, `.btn-icon`, `.dropdown-divider`, `.stats-number`, `.nav-pills`, `.table-scroll`, `.empty-state`, `.empty-state-icon`, `.modal-overlay/dialog/header/body/footer`

---

## [v2.0] — IA-PTF v2: supplier selection + pricing types

### Added
- Tedarikçi enable/disable checkbox per supplier
- Bulk select toggle (Tümünü Seç / Hiçbirini Seçme)
- Fiyatlandırma tipi: PTF endeksli + Sabit fiyat (TL/MWh)
- Validation panel + per-input error highlighting

### Removed
- USD/EUR fixed-price support (scope reduction)

---

## [v1.2] — Security hardening

### Changed
- SheetJS 0.18.5 → 0.20.3, vendored locally
- CORS origin validation, OPTIONS preflight fix
- `Math.min` spread → reduce (stack overflow guard for large datasets)
- Excel export sanitization (formula injection guard)

---

## [v1.1] — IA-PTF module v1

### Added
- Sekme 3: İA-PTF hesaplama modülü
- Excel parse, EPİAŞ PTF integration via Netlify Function
- Tedarikçi anlaşma oranı yönetimi

---

## [v1.0] — Initial release

### Added
- Sekme 1: Ödeme takvimi hesaplayıcı
- Sekme 2: Faiz hesaplama
- Excel / CSV / PDF export
