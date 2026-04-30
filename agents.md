# KDK — WordPress → Astro + Tailwind Dönüşüm Planı

**Proje:** KDK Asansör (`www.kdkasansor.com`)  
**Kaynak:** `KDK/Legacy/Content/` (WordPress HTML dump)  
**Tema Referansı:** `KDK/Legacy/Theme/` (Porto theme demo dosyaları)  
**Hedef:** `KDK/src/` — %100 Astro + Tailwind v4 projesi  
**Astro Sürüm:** 6.1.9 | **Tailwind Sürüm:** 4.2.4  
**Node gereksinimi:** >=22.12.0

---

## 1. Analiz: Kaynak Site Yapısı

### 1.1 Teknoloji Yığını (Kaldırılacak)
| Bileşen | Kaynak Kullanım | Tailwind Karşılığı |
|---|---|---|
| Bootstrap 5 | Porto temasından gelir, grid/flex/utility | Tailwind utility classları |
| Elementor | Sayfa düzenleyici, widget tabanlı HTML | Astro component sistemi |
| Porto Theme CSS | `theme.css`, `plugins.css`, `shortcodes.css` | `src/styles/global.css` |
| Slider Revolution | Hero slider JS kütüphanesi | CSS animasyonlu Astro hero |
| Contact Form 7 | PHP form işleme | Netlify Forms / API route |
| jQuery | DOM manipülasyonu | Vanilla JS / Astro transitions |
| Font Awesome 5 | İkon kütüphanesi | Heroicons / SVG inline |
| Owl Carousel | Testimonial slider | CSS scroll snap veya basit JS slider |

### 1.2 Renk Paleti (CSS Variables)
```css
--primary: #0052cc       /* Ana mavi */
--primary-hover: #0061f0 /* Hover mavi */
--dark: #2a2a2a          /* Koyu başlıklar */
--dark-2: #212529        /* Body metin */
--gray: #aaa             /* İkincil metin */
--light-bg: #f5f5f5      /* Açık arkaplan bölümleri */
--border: rgba(0,0,0,0.1) /* Ayraçlar */
```

### 1.3 Tipografi
- **Başlık:** Poppins (300–700) — Google Fonts
- **Body:** Overpass (300–900) — Google Fonts
- **Vurgu:** PT Serif (400–700) — Google Fonts
- **Fallback:** Open Sans (form elemanları)

### 1.4 Özel CSS Animasyonlar (Korunacak)
```
bgPositionBottomToTop  — Hero arka plan yavaş kaydırma (13s, linear)
customLineProgressAnim — Divider genişleme animasyonu (1s)
fadeIn / fadeInUp / fadeInDown — Elementor scroll animasyonları (Tailwind + IntersectionObserver ile)
```

---

## 2. Site Haritası (Tüm Sayfalar)

### Ana Sayfalar
| URL | Astro Dosyası | Başlık |
|---|---|---|
| `/` | `src/pages/index.astro` | Anasayfa |
| `/hakkimizda/` | `src/pages/hakkimizda/index.astro` | Hakkımızda |
| `/hizmetlerimiz/` | `src/pages/hizmetlerimiz/index.astro` | Hizmetlerimiz |
| `/iletisim/` | `src/pages/iletisim/index.astro` | İletişim |

### Asansör Tipleri
| URL | Astro Dosyası |
|---|---|
| `/asansor-tipleri/` | `src/pages/asansor-tipleri/index.astro` |
| `/asansor-tipleri/makine-daireli-asansorler/` | `src/pages/asansor-tipleri/makine-daireli-asansorler.astro` |
| `/asansor-tipleri/makine-dairesiz-mrl-asansor/` | `src/pages/asansor-tipleri/makine-dairesiz-mrl-asansor.astro` |
| `/asansor-tipleri/hidrolik-asansor/` | `src/pages/asansor-tipleri/hidrolik-asansor.astro` |

### Asansör Modelleri
| URL | Astro Dosyası |
|---|---|
| `/modeller/` | `src/pages/modeller/index.astro` |
| `/modeller/insan-yolcu-asansoru/` | `src/pages/modeller/insan-yolcu-asansoru.astro` |
| `/modeller/yuk-asansoru/` | `src/pages/modeller/yuk-asansoru.astro` |
| `/modeller/monsarj-yemek-asansoru/` | `src/pages/modeller/monsarj-yemek-asansoru.astro` |
| `/modeller/sedye-asansorleri/` | `src/pages/modeller/sedye-asansorleri.astro` |
| `/modeller/panoramik-asansor/` | `src/pages/modeller/panoramik-asansor.astro` |
| `/modeller/arac-asansoru/` | `src/pages/modeller/arac-asansoru.astro` |
| `/modeller/engelli-platformlari/` | `src/pages/modeller/engelli-platformlari.astro` |

### Servisler
| URL | Astro Dosyası |
|---|---|
| `/servisler/` | `src/pages/servisler/index.astro` |
| `/servisler/montaj-hizmetleri/` | `src/pages/servisler/montaj-hizmetleri.astro` |
| `/servisler/bakim-onarim-hizmetleri/` | `src/pages/servisler/bakim-onarim-hizmetleri.astro` |
| `/servisler/revizyon-hizmetleri/` | `src/pages/servisler/revizyon-hizmetleri.astro` |

**Toplam:** 20 sayfa

---

## 3. Dosya Yapısı (Hedef)

```
KDK/
├── astro.config.mjs          ← mevcut (Tailwind vite plugin)
├── package.json              ← mevcut
├── tsconfig.json             ← mevcut
├── agents.md                 ← bu dosya
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── images/               ← Legacy/Content/wp-content/uploads/ içeriği buraya
│   │   ├── logo/
│   │   │   ├── kdk-logo.webp      (header/footer logo)
│   │   │   ├── favicon.png
│   │   │   └── apple-touch-icon.png
│   │   ├── hero/
│   │   │   └── pexels-cottonbro-studio-8453040-scaled-1.webp
│   │   ├── about/
│   │   └── services/
│   └── robots.txt
└── src/
    ├── styles/
    │   └── global.css        ← Tailwind base + özel CSS değişkenleri
    ├── components/
    │   ├── Header.astro      ← sticky header, mega menu, mobile drawer
    │   ├── Footer.astro      ← 5 sütunlu footer
    │   ├── MobileMenu.astro  ← hamburger drawer
    │   ├── PageHero.astro    ← iç sayfa hero (breadcrumb + başlık)
    │   ├── HeroSection.astro ← anasayfa hero (bg animasyon + metin)
    │   ├── ServiceCard.astro ← hover icon box kartı
    │   ├── ContactForm.astro ← iletişim formu
    │   ├── ScrollAnimate.astro ← IntersectionObserver wrapper
    │   └── SectionHeading.astro ← başlık + divider bileşeni
    └── pages/
        └── [yukarıdaki tablo]
```

---

## 4. Bileşen Teknik Şartnamesi

### 4.1 `src/layouts/BaseLayout.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}
const { title, description, ogImage } = Astro.props;
const siteTitle = "KDK Asansör";
---
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title ? `${title} – ${siteTitle}` : siteTitle}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {ogImage && <meta property="og:image" content={ogImage} />}
  <!-- Preconnect Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Overpass:wght@300;400;500;600;700;800;900&family=PT+Serif:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/png" href="/images/logo/favicon.png" />
</head>
<body class="font-overpass text-dark-2 overflow-x-hidden">
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</body>
</html>
```

### 4.2 `src/components/Header.astro`

**Gereksinimler (Legacy'den:**
- Fixed (sticky) header — scroll sonrası görünür
- Logo: `/images/logo/kdk-logo.webp` — home linki
- Ana Menü (desktop): `ul.main-menu` — underline hover animasyon
- Mega Menu dropdown: "Hizmetlerimiz" altında 3 grup (Asansör Tipleri, Modeller, Servisler)
- Arama butonu (ikonlu, açılır overlay)
- Mobil hamburger toggle (`fa-bars` → SVG ile)
- Divider (ince separator) desktop'ta menü ile arama arasında

**Tailwind Dönüşüm Notları:**
```
Porto class          → Tailwind karşılığı
header-builder       → fixed top-0 left-0 right-0 z-50 bg-white shadow-sm
elementor-col-100    → w-full
header-right         → justify-end
menu-hover-underline → after:absolute after:bottom-0 after:w-0 hover:after:w-full after:h-px after:bg-primary transition
has-sub              → group (grup hover için)
sub-menu             → group-hover:block hidden absolute (dropdown)
```

**Mega Menu Yapısı:**
```
Hizmetlerimiz
├── Asansör Tipleri
│   ├── Makine Daireli Asansörler
│   ├── Makine Dairesiz (MRL) Asansör
│   └── Hidrolik Asansör
├── Asansör Modelleri
│   ├── İnsan (Yolcu) Asansörü
│   ├── Yük Asansörü
│   ├── Monşarj (Yemek) Asansörü
│   ├── Sedye Asansörleri
│   ├── Panoramik Asansör
│   ├── Araç Asansörü
│   └── Engelli Platformları
├── Servisler
│   ├── Montaj Hizmetleri
│   ├── Bakım & Onarım Hizmetleri
│   └── Revizyon Hizmetleri
└── Yürüyen Merdiven ve Bant Sistemleri
```

**Mobil Menü (Drawer):**
- Sağdan açılan overlay drawer (`translate-x-full` → `translate-x-0` transition)
- Accordion alt menüler (CSS details/summary veya Alpine.js-free vanilla JS)
- Kapatma butonu (×)
- Arkaplan overlay (tıklanabilir)

### 4.3 `src/components/Footer.astro`

**5 Sütunlu Grid (lg:grid-cols-5, sm:grid-cols-2, grid-cols-1):**

| Sütun | İçerik |
|---|---|
| 1 | **Adres** — Yeni Mah. Cengiz Topel Cad. No:54/B, Aliağa / İZMİR |
| 2 | **Telefon** — 0232 616 69 10, 0532 205 24 78, 0534 643 22 25 |
| 3 | **Servisler** — Montaj, Bakım & Onarım, Revizyon linkleri |
| 4 | **Asansör Tipleri** — Makine Daireli, MRL, Hidrolik linkleri |
| 5 | **Yararlı Linkler** — Hakkımızda, İletişim |

**Alt Bar:**
- Yatay ayraç (opacity-10)
- Ortada footer logo (`/images/logo/kdk-logo.webp`, max-w-[300px])
- Copyright: "KDK Asansör Ali Şentürk. © 2024. All Rights Reserved"

**Arkaplan:** Koyu (`bg-[#212529]` veya `bg-zinc-800`), metin beyaz (`text-white`)

### 4.4 `src/components/HeroSection.astro` (Ana Sayfa)

**Kaynak:** `index.html` satır 382-407

**Yapı:**
- Tam ekran section (`min-h-screen` veya sabit yükseklik)
- Arkaplan görseli: CSS background-position animasyonu (aşağıdan yukarıya, 13s linear)
- Koyu overlay (`bg-black/60`)
- Ortada metin bloğu (ortalanmış, fade animasyonlu):
  - **Küçük başlık:** "KDK Asansör" (`text-white text-lg tracking-widest`)
  - **Ana başlık:** "Asansör sistemlerinde profesyonel çözümler" (`text-4xl lg:text-6xl font-bold text-white`)

**CSS Animasyon (global.css):**
```css
@keyframes bgPositionBottomToTop {
  from { background-position: bottom; }
  to   { background-position: top; }
}
.hero-bg-anim {
  animation: bgPositionBottomToTop 13s linear 1500ms forwards;
}
```

### 4.5 `src/components/ServiceCard.astro`

**Kaynak:** Anasayfadaki "Sunduğumuz Hizmetler" icon box kartları

**Props:**
```ts
interface Props {
  icon: string;      // SVG string veya icon adı
  title: string;
  description: string;
  href?: string;
}
```

**Tailwind Hover Animasyon (Porto `custom-icon-box` dönüşümü):**
```
- Kart: group relative overflow-hidden p-6 border border-gray-100 rounded
- Üst çizgi: after:absolute after:top-0 after:left-1/2 after:h-[5px] after:w-0 
             group-hover:after:w-full after:bg-primary after:-translate-x-1/2 after:transition-all
- İkon + başlık: transition-transform group-hover:-translate-y-5
- Açıklama: absolute bottom-4 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all
```

### 4.6 `src/components/ContactForm.astro`

**Kaynak:** `iletisim/index.html` — Contact Form 7

**Alanlar:**
- Ad Soyad (text)
- E-posta (email)
- Telefon (tel)
- Konu (text)
- Mesaj (textarea, min-h-[140px])
- Gönder butonu

**Stil (Porto'dan dönüştürme):**
```css
/* Kaynak: .custom-contact-form-style */
input, textarea {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(0,0,0,0.4);
}
input:focus, textarea:focus {
  outline: none;
  border-bottom-color: var(--primary);
}
```

**Tailwind karşılığı:**
```
input class="w-full bg-transparent border-0 border-b border-black/40
             focus:border-primary focus:ring-0 py-3 px-0 placeholder-gray-400"
```

**Form Gönderimi:** Netlify Forms (`netlify` attribute) veya `src/pages/api/contact.ts` endpoint.

### 4.7 `src/components/ScrollAnimate.astro`

Elementor'daki `fadeInUp`, `fadeInDown`, `fadeIn` animasyonlarını tetiklemek için:

```astro
---
interface Props {
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft';
  delay?: number;  // ms
}
const { animation = 'fadeInUp', delay = 0 } = Astro.props;
---
<div
  data-animate={animation}
  data-delay={delay}
  class="opacity-0"
  style={`--delay:${delay}ms`}
>
  <slot />
</div>
<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        const target = el.target as HTMLElement;
        setTimeout(() => {
          target.classList.add('animated', target.dataset.animate!);
          target.style.opacity = '1';
        }, parseInt(target.dataset.delay || '0'));
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
</script>
```

**global.css'e eklenecek keyframes:**
```css
@keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
@keyframes fadeInUp  { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeInDown { from { opacity:0; transform:translateY(-30px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeInLeft { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
.animated { animation-duration:0.6s; animation-fill-mode:both; }
.animated.fadeIn     { animation-name:fadeIn; }
.animated.fadeInUp   { animation-name:fadeInUp; }
.animated.fadeInDown { animation-name:fadeInDown; }
.animated.fadeInLeft { animation-name:fadeInLeft; }
```

---

## 5. Sayfa Detayları

### 5.1 Ana Sayfa (`/`) — Bölümler

**Bölüm 1: Hero**
- Tam ekran, arkaplan görseli + animasyon
- "KDK Asansör" + "Asansör sistemlerinde profesyonel çözümler"

**Bölüm 2: Şirket Tanıtım (2 Kolon)**
- Sol (1/2): 
  - "TEKİN AS ASANSÖR" başlık + animasyonlu divider (60px, primary renkli)
  - `"Kaliteli Asansör Kabin Üretimi" ve "Her Zaman Müşteri Memnuniyeti" politikalarını...`
  - ISO 9001 ve CE sertifikaları açıklaması
  - CTA buton: "İletişime Geçin" → `/iletisim/`
  - Telefon ikonlu link: "Bizi şimdi arayın / 0232 616 69 10"
- Sağ (1/2): `pexels-cottonbro-studio-8453040-scaled-1.webp`
- Arkaplan sol üstte: `arch-plan-1.jpg` (konumsal, yarı saydam)

**Bölüm 3: Sunduğumuz Hizmetler**
- Başlık: "DENEYİMLİ KADROMUZLA" + "Sunduğumuz Hizmetler"
- Altyazı: "Uzman teknik elemanlarımız..."
- ServiceCard grid (3 sütun, lg üzeri)

**Bölüm 4: Sayaçlar/İstatistikler**
- Yıl/Müşteri/Proje rakam sayaçları (CountUp animasyonu)

**Bölüm 5: Referans Logoları / Markalar**
- Marka logo grid (custom-brands-wrapper)

**Bölüm 6: Testimonials**
- Alıntı kartları (slider veya grid)

**Bölüm 7: İletişim CTA**
- Koyu arka plan, "Bizimle İletişime Geçin" + buton

### 5.2 Hakkımızda (`/hakkimizda/`)

**Bölüm 1: PageHero**
- Başlık: "Hakkımızda" + Breadcrumb (Anasayfa > Hakkımızda)

**Bölüm 2: "TEKİN AS ASANSÖR SİZİN İÇİN VARIZ"**
- İki sütun: metin sol, görsel sağ
- İçerik: müşteri gereksinimleri, tasarımdan imalata zinciri, ISO/CE sertifikaları

**Bölüm 3: Sayaçlar**
- Yıl, müşteri, proje istatistikleri

**Bölüm 4: Misyon/Vizyon**
- İkon kartları (2-3 kolon)

### 5.3 Hizmetlerimiz (`/hizmetlerimiz/`)

**Bölüm 1: PageHero**

**Bölüm 2: Hizmet Kartları Grid**
- Asansör Tipleri → link
- Asansör Modelleri → link
- Servisler → link
- Yürüyen Merdiven ve Bant Sistemleri

### 5.4 Alt Servis Sayfaları

Her alt sayfa ortak yapı:
```
1. PageHero (başlık + breadcrumb)
2. İçerik (2 sütun — metin + görsel)
3. Özellikler listesi (check-list)
4. İletişim CTA bölümü
```

**Asansör Tipleri:**
- `makine-daireli-asansorler` — Makine daireli sistemlerin teknik açıklaması
- `makine-dairesiz-mrl-asansor` — MRL teknoloji avantajları
- `hidrolik-asansor` — Hidrolik sistem özellikleri

**Asansör Modelleri:**
- `insan-yolcu-asansoru` — Yolcu asansörü özellikleri, yük kapasitesi
- `yuk-asansoru` — Yük kapasiteleri, uygulama alanları
- `monsarj-yemek-asansoru` — Küçük yük / mutfak asansörü
- `sedye-asansorleri` — Hastane/sedye tipi
- `panoramik-asansor` — Cam kabin, görsel ağırlıklı
- `arac-asansoru` — Otopark/araç lift
- `engelli-platformlari` — Engelli erişim platformları

**Servisler:**
- `montaj-hizmetleri` — Montaj süreci, garanti
- `bakim-onarim-hizmetleri` — Periyodik bakım, 7/24 servis
- `revizyon-hizmetleri` — Modernizasyon / revizyon

### 5.5 İletişim (`/iletisim/`)

**Bölüm 1: PageHero**
- "İLETİŞİM" + "Kaliteli Hizmetin Adresi — KDK Asansör"

**Bölüm 2: İletişim Bilgileri (3 Kolon)**
- **Telefon:** 0232 616 69 10 (sabit), 0532 205 24 78, 0534 643 22 25
- **E-posta:** [mevcut içerikten çıkart]
- **Adres:** Yeni Mah. Cengiz Topel Cad. No:54/B, Aliağa / İZMİR

**Bölüm 3: Form + Harita (2 Kolon)**
- Sol: `ContactForm.astro`
- Sağ: Google Maps embed (Aliağa/İzmir)

---

## 6. `src/styles/global.css` Yapısı

```css
@import "tailwindcss";

/* ── Özel CSS Değişkenleri ── */
:root {
  --primary:       #0052cc;
  --primary-hover: #0061f0;
  --dark:          #2a2a2a;
  --dark-2:        #212529;
  --gray:          #aaa;
}

/* ── Tailwind Tema Genişlemeleri (v4 syntax) ── */
@theme {
  --color-primary:       var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-dark:          var(--dark);
  --color-dark-2:        var(--dark-2);
  --font-poppins:        'Poppins', sans-serif;
  --font-overpass:       'Overpass', sans-serif;
}

/* ── Scroll Animasyonları ── */
@keyframes fadeIn     { from { opacity:0; } to { opacity:1; } }
@keyframes fadeInUp   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeInDown { from { opacity:0; transform:translateY(-30px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeInLeft { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }

.animated { animation-duration: 0.6s; animation-fill-mode: both; }
.animated.fadeIn     { animation-name: fadeIn; }
.animated.fadeInUp   { animation-name: fadeInUp; }
.animated.fadeInDown { animation-name: fadeInDown; }
.animated.fadeInLeft { animation-name: fadeInLeft; }

/* ── Hero Arkaplan Animasyonu ── */
@keyframes bgPositionBottomToTop {
  from { background-position: bottom; }
  to   { background-position: top; }
}
.hero-bg-anim {
  animation: bgPositionBottomToTop 13s linear 1500ms forwards;
}

/* ── Divider Animasyonu ── */
@keyframes customLineProgressAnim {
  from { width: 0; }
  to   { width: 60px; }
}
.divider-anim { animation: customLineProgressAnim 1s ease forwards; }

/* ── Form Stilleri ── */
.form-underline {
  @apply w-full bg-transparent border-0 border-b border-black/40
         py-3 px-0 placeholder-gray-500
         focus:outline-none focus:border-primary focus:ring-0
         transition-colors;
}

/* ── Buton Stilleri ── */
.btn-primary-custom {
  @apply inline-flex items-center px-6 py-3 bg-primary text-white
         rounded font-medium hover:bg-primary-hover
         transition-all duration-200;
}
.btn-outline-custom {
  @apply inline-flex items-center px-6 py-3 border border-dark text-dark
         rounded hover:bg-dark hover:text-white
         transition-all duration-200;
}
```

---

## 7. Görsel Varlık Transferi

**Kaynak dizin:** `KDK/Legacy/Content/wp-content/uploads/`  
**Hedef dizin:** `KDK/public/images/`

### Kritik Görseller
| Kaynak Dosya | Hedef | Kullanım |
|---|---|---|
| `src/assets/images/logo/kdk-logo.webp` | `src/assets/images/logo/kdk-logo.webp` | Header ve footer logo |
| `uploads/2024/08/pexels-cottonbro-studio-8453040-scaled-1.webp` | `public/images/hero/main.webp` | Ana sayfa hero |
| `uploads/2022/05/arch-plan-1.jpg` | `public/images/hero/arch-plan.jpg` | Hero dekoratif |
| `themes/porto/images/logo/favicon.png` | `public/images/logo/favicon.png` | Favicon |
| `themes/porto/images/logo/apple-touch-icon.png` | `public/images/logo/apple-touch-icon.png` | Apple touch |

**Not:** Tüm `wp-content/uploads/` içeriğini `public/images/` altına kopyala, ardından `src/` dosyalarında referansları güncelle.

---

## 8. Bootstrap → Tailwind Dönüşüm Eşleme Tablosu

| Bootstrap Sınıfı | Tailwind Karşılığı |
|---|---|
| `container` | `container mx-auto px-4` |
| `container-fluid` | `w-full px-[6.4vw]` (sayfaya özel) |
| `row` | `flex flex-wrap -mx-4` |
| `col-lg-6` | `lg:w-1/2 px-4` |
| `col-lg-4` | `lg:w-1/3 px-4` |
| `col-lg-3` | `lg:w-1/4 px-4` |
| `col-lg-2` (footer 20%) | `lg:w-1/5 px-4` |
| `mb-4` | `mb-4` (aynı, Tailwind default 4 = 1rem) |
| `pt-md-4` | `md:pt-4` |
| `p-t-xxl` | `py-24` (xxl ≈ 6rem) |
| `text-white` | `text-white` |
| `d-none` | `hidden` |
| `d-flex` | `flex` |
| `align-items-center` | `items-center` |
| `justify-content-center` | `justify-center` |
| `overflow-hidden` | `overflow-hidden` |
| `position-relative` | `relative` |
| `position-absolute` | `absolute` |
| `w-auto` | `w-auto` |
| `me-sm-2` | `sm:mr-2` |
| `ms-md-4` | `md:ml-4` |
| `ps-lg-5` | `lg:pl-5` (1.25rem) veya `lg:pl-[3rem]` |

---

## 9. Geliştirme İyileştirmeleri (Legacy'de olmayan)

### 9.1 SEO İyileştirmeleri
- Her sayfa için `<title>`, `<meta description>`, OG tags (Layout.astro props)
- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`)
- Yapısal veri (Schema.org `LocalBusiness`, `ElevatorService`)
- `robots.txt` ve `sitemap.xml` (Astro sitemap entegrasyonu)
- hreflang (tek dil — `lang="tr"`)

### 9.2 Performans İyileştirmeleri
- `<Image>` komponenti (Astro yerleşik optimizasyon)
- WebP formatında görseller
- Lazy loading (Astro + `loading="lazy"`)
- Font preload (`preconnect` + `display=swap`)
- CSS inlining (kritik CSS)
- Mobil öncelikli responsive tasarım

### 9.3 Erişilebilirlik
- Skip-to-content linki
- ARIA labels (hamburger menü, arama)
- Focus yönetimi (mobile drawer)
- Kontrast oranı kontrolü

### 9.4 UX İyileştirmeleri
- Smooth scroll (`scroll-behavior: smooth`)
- Back-to-top butonu
- WhatsApp iletişim butonu (floating, sağ alt)
- Hizmet sayfalarında breadcrumb navigation
- 404 sayfası (`src/pages/404.astro`)

---

## 10. Astro Konfigürasyon Güncellemesi

### `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.kdkasansor.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
```

### Ek paket
```bash
npm install @astrojs/sitemap
```

---

## 11. Uygulama Sırası (Faz Planı)

### Faz 1 — Altyapı (1-2 gün)
- [ ] `src/layouts/BaseLayout.astro` oluştur
- [ ] `src/styles/global.css` düzenle (CSS değişkenleri + @theme + animasyonlar)
- [ ] Görsel varlıkları `public/images/` altına kopyala
- [ ] `astro.config.mjs` güncelle (sitemap)
- [ ] Header.astro (desktop + mobile menü)
- [ ] Footer.astro

### Faz 2 — Ana Sayfa (1-2 gün)
- [ ] HeroSection.astro (bg animasyonu dahil)
- [ ] "Şirket Tanıtım" 2 kolon bölümü
- [ ] ServiceCard.astro komponenti
- [ ] "Sunduğumuz Hizmetler" grid bölümü
- [ ] Sayaçlar bölümü (CountUp IntersectionObserver)
- [ ] Marka logoları bölümü
- [ ] Testimonials bölümü
- [ ] CTA bölümü
- [ ] `src/pages/index.astro`

### Faz 3 — Hakkımızda ve İletişim (1 gün)
- [ ] PageHero.astro komponenti
- [ ] SectionHeading.astro komponenti
- [ ] `src/pages/hakkimizda/index.astro`
- [ ] ContactForm.astro
- [ ] `src/pages/iletisim/index.astro` (form + harita)

### Faz 4 — Hizmet Sayfaları (2-3 gün)
- [ ] `src/pages/hizmetlerimiz/index.astro`
- [ ] 3 asansör tipi sayfası
- [ ] 7 model sayfası
- [ ] 3 servis sayfası
- [ ] `src/pages/servisler/index.astro`

### Faz 5 — Kalite ve Doğrulama (1 gün)
- [ ] Tüm linklerin doğruluğu
- [ ] Mobil responsive test (375px, 768px, 1024px, 1440px)
- [ ] Lighthouse audit (Performance, SEO, A11y)
- [ ] `404.astro` sayfası
- [ ] `sitemap.xml` üretimi kontrolü
- [ ] `robots.txt`

---

## 12. Önemli Teknik Notlar

### CSS Özel Durumlar
1. Porto'nun `custom-page-wrapper` sınıfı `padding: 0 6.4vw` kullanıyor. Tailwind ile `px-[6.4vw]` veya custom padding utility'si.
2. Footer link renkleri beyaz, hover'da `text-gray-300` olacak.
3. Hero section'daki `body { overflow: hidden }` kuralı — bu global stil değil, sadece hero'nun içindeyken geçerliydi. Astro'da uygulama.
4. `.intro-slides` yüksekliği desktop'ta 800px, tablet'te 600px — `h-[800px] md:h-[600px]`.
5. Mega menünün `popup > inner` yapısı — Tailwind'de `group-hover:block` + `absolute` + shadow ile.

### JavaScript Davranışlar
1. **Sticky header:** `IntersectionObserver` ile bir sentinel div gözlemlenerek header'a `shadow` eklenir.
2. **Mobile drawer:** `data-open` attribute toggle, `translateX` transition.
3. **CountUp:** `IntersectionObserver` + `requestAnimationFrame` ile sayaç animasyonu.
4. **ScrollAnimate:** Yukarıdaki `ScrollAnimate.astro` bileşeni.
5. **WhatsApp butonu:** `href="https://wa.me/905322052478"` floating button.

### Form Gönderimi
WordPress'te Contact Form 7 + PHP. Astro'da iki seçenek:
- **Netlify Forms:** `<form netlify>` — en kolay
- **Resend / Email.js:** JavaScript ile e-posta gönderimi

### Türkçe Karakter Desteği
- `lang="tr"` HTML attribute (mevcut)
- Font'ların latin-ext subset'i yüklü (`&subset=latin-ext`)
- URL'lerde Türkçe karakter yok (slug'lar ASCII: `hakkimizda`, `asansor-tipleri` vs.)

---

## 13. İçerik Kaynağı (Sayfa İçerikleri)

Her sayfa için içeriği şu HTML dosyalarından al:

| Sayfa | Kaynak Dosya |
|---|---|
| Ana Sayfa | `Legacy/Content/index.html` |
| Hakkımızda | `Legacy/Content/hakkimizda/index.html` |
| Hizmetlerimiz | `Legacy/Content/hizmetlerimiz/index.html` |
| İletişim | `Legacy/Content/iletisim/index.html` |
| Asansör Tipleri | `Legacy/Content/asansor-tipleri/index.html` |
| Makine Daireli | `Legacy/Content/asansor-tipleri/makine-daireli-asansorler/index.html` |
| MRL Asansör | `Legacy/Content/asansor-tipleri/makine-dairesiz-mrl-asansor/index.html` |
| Hidrolik Asansör | `Legacy/Content/asansor-tipleri/hidrolik-asansor/index.html` |
| Modeller | `Legacy/Content/modeller/index.html` |
| İnsan Asansörü | `Legacy/Content/modeller/insan-yolcu-asansoru/index.html` |
| Yük Asansörü | `Legacy/Content/modeller/yuk-asansoru/index.html` |
| Monşarj | `Legacy/Content/modeller/monsarj-yemek-asansoru/index.html` |
| Sedye | `Legacy/Content/modeller/sedye-asansorleri/index.html` |
| Panoramik | `Legacy/Content/modeller/panoramik-asansor/index.html` |
| Araç Asansörü | `Legacy/Content/modeller/arac-asansoru/index.html` |
| Engelli Platformları | `Legacy/Content/modeller/engelli-platformlari/index.html` |
| Servisler | `Legacy/Content/servisler/index.html` |
| Montaj | `Legacy/Content/servisler/montaj-hizmetleri/index.html` |
| Bakım & Onarım | `Legacy/Content/servisler/bakim-onarim-hizmetleri/index.html` |
| Revizyon | `Legacy/Content/servisler/revizyon-hizmetleri/index.html` |

**İçerik Çıkarma Kuralı:** HTML dosyalarındaki Elementor div'lerini yoksay, yalnızca `<p>`, `<h2>`, `<h3>`, `<ul>`, `<img>` içeriklerini al.

---

## 14. Kontact Bilgileri (Sabit Veri)

```ts
// src/data/contact.ts
export const contact = {
  company: "KDK Asansör Ali Şentürk",
  address: {
    street: "Yeni Mah. Cengiz Topel Cad. No:54/B",
    district: "Aliağa",
    city: "İZMİR",
  },
  phone: {
    main: "+902326166910",
    display: "0232 616 69 10",
    mobile1: "+905322052478",
    mobile1Display: "0532 205 24 78",
    mobile2: "+905346432225",
    mobile2Display: "0534 643 22 25",
  },
  social: {
    // Kaynak dosyalardan çıkar
  }
};
```

---

## 15. Doğrulama Kontrol Listesi

Tüm çalışma tamamlandıktan sonra şunları doğrula:

- [ ] Her sayfa `<title>` ve `<meta description>` içeriyor
- [ ] Tüm görseller `public/images/` altında ve referanslar doğru
- [ ] Header navigasyon linkleri çalışıyor (desktop + mobile)
- [ ] Mega menü hover açılıyor (desktop)
- [ ] Mobil drawer açılıp kapanıyor
- [ ] İletişim formu gönderiliyor
- [ ] Google Maps iframe yükleniyor
- [ ] Telefon linkleri (`tel:`) tıklanabiliyor
- [ ] Tüm sayfalarda footer görünüyor
- [ ] ScrollAnimate bileşeni tetikleniyor (scroll'da fade-in)
- [ ] Hero bg animasyonu çalışıyor
- [ ] Responsive: 375px, 768px, 1024px, 1440px breakpoint'ler
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse SEO > 95
- [ ] Lighthouse Accessibility > 90
- [ ] `npm run build` hatasız tamamlanıyor
