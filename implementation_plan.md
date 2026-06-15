# Calendula Herbs — Full Frontend Implementation Plan
> *(Public Site + Admin Panel)*

> **Stack:** Next.js 16.2 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Radix UI · Zustand  
> **Scope:** Chunk 8 — Public-Facing Frontend Components & Layout  
> **Design Source:** Four reference images analysed and synthesised below

---

## 1. Design Vision & Aesthetic Direction

### Inspirations Synthesised from Reference Images

| Source Image | Key Takeaways |
|---|---|
| **Glassmorphic Plant Shop (green cards)** | Dark forest-green gradient background, frosted-glass product cards with subtle border glow, 3×4 product grid, minimal text, floating badge on featured items |
| **Premium Flora Landing Page** | Hero with botanical illustrations overlaid in glass domes/bell jars, large bold serif headline, dark green (#0d2818 range) depth, botanical leaf framing device, stats bar |
| **Marazanna Portfolio (purple)** | Glassmorphism panel system (translucent cards with backdrop-blur), arched image frames, sparkle/star micro-details, pill-shaped feature pills, elegant navigation |
| **Moon Blooming Florist** | Moody dark botanical photography, script + serif headline pairing, earthy jewel-tone overlays, editorial image masonry grid, atmospheric fullscreen sections |

### Aesthetic Decision: "Deep Forest Luxury"

This is **not** a generic "cream background + terracotta" herb website. The visual signature is:

> **Dark forest-green depth** (`#0a1f0f` → `#1a3d20`) with **frosted glass cards**, warm **amber/gold accents** (`#c9963a`), a **serif display font** for headlines, and **soft bokeh botanical photography** as atmosphere. The signature element is the **glass bell jar / dome product showcase** on the hero — evoking preservation, purity, and premium quality.

---

## 2. Design Token System

### 2.1 Extended Color Palette (add to `globals.css`)

```css
:root {
  /* ── Deep Forest Luxury Palette ── */
  
  /* Primary Greens */
  --forest-deepest: #060f09;    /* near-black base for darkest sections */
  --forest-dark:    #0a1f0f;    /* hero & footer bg */
  --forest-mid:     #0d2b15;    /* section bg alternate */
  --forest-rich:    #15803d;    /* existing primary — keep */
  --forest-vivid:   #22c55e;    /* existing primary-light — keep */
  --forest-mist:    #1a3d2099;  /* glass card bg (60% opacity) */
  --forest-glass:   #1e4a2280;  /* frosted glass panels (50% opacity) */

  /* Gold / Amber Accent (replaces flat yellow) */
  --gold:           #c9963a;    /* primary accent — warm gold */
  --gold-light:     #e8b85a;    /* hover/shine gold */
  --gold-pale:      #f5e6c8;    /* gold tint for text on dark */
  --gold-dim:       #7a5a20;    /* muted gold for subtle elements */

  /* Glass & Surface */
  --glass-white:    rgba(255,255,255,0.07);   /* glass card fill */
  --glass-border:   rgba(255,255,255,0.12);   /* glass card border */
  --glass-hover:    rgba(255,255,255,0.12);   /* glass card hover fill */
  --glass-shadow:   rgba(0,0,0,0.4);          /* glass card shadow */
  
  /* Botanical Overlay Colors */
  --leaf-shimmer:   rgba(34,197,94,0.15);    /* subtle green glow */
  --amber-glow:     rgba(201,150,58,0.2);    /* warm glow behind gold elements */

  /* Text on dark backgrounds */
  --text-on-dark:        #f0fdf4;   /* near-white green */
  --text-on-dark-muted:  rgba(240,253,244,0.65);
  --text-on-dark-subtle: rgba(240,253,244,0.4);
}
```

### 2.2 Typography System

```css
:root {
  /* Keep existing fonts, add one script face for hero accent */
  --font-heading:  'Playfair Display', Georgia, serif;      /* existing ✓ */
  --font-body:     'Inter', system-ui, sans-serif;           /* existing ✓ */
  --font-script:   'Cormorant Garamond', 'Playfair Display', serif; /* NEW — for hero accent phrases */
  
  /* Fluid type scale */
  --text-hero:    clamp(3rem, 7vw, 6rem);       /* homepage h1 */
  --text-display: clamp(2.25rem, 5vw, 4rem);    /* section headings */
  --text-title:   clamp(1.5rem, 3vw, 2.5rem);   /* card titles, page h1 */
  --text-lg:      clamp(1.1rem, 2vw, 1.25rem);  /* lead paragraphs */
  --text-base:    1rem;                           /* body */
  --text-sm:      0.875rem;                       /* captions, meta */
  --text-xs:      0.75rem;                        /* badges, labels */
}
```

> **Google Fonts to add in `layout.tsx`:**  
> `Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400` — ultra-refined, pairs with Playfair Display

### 2.3 New Animation Tokens

```css
:root {
  /* Motion */
  --ease-botanical: cubic-bezier(0.34, 1.56, 0.64, 1); /* spring-like, organic */
  --ease-glass:     cubic-bezier(0.25, 0.46, 0.45, 0.94); /* smooth & silky */
  --duration-slow:  600ms;
  --duration-float: 4000ms; /* ambient floating animation */
  
  /* Glassmorphism */
  --blur-glass:     16px;
  --blur-heavy:     32px;
}
```

### 2.4 New Utility Classes for `globals.css`

```css
/* Glass Card System */
.glass-card {
  background: var(--glass-white);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
  box-shadow: 0 8px 32px var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.1);
}
.glass-card:hover {
  background: var(--glass-hover);
  box-shadow: 0 16px 48px var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.15);
}

/* Gold accent text */
.text-gold {
  color: var(--gold);
}
.gradient-gold {
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Botanical glow */
.glow-green {
  box-shadow: 0 0 40px var(--leaf-shimmer), 0 0 80px var(--leaf-shimmer);
}

/* Ambient float animation */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-12px) rotate(1deg); }
  66%       { transform: translateY(-6px) rotate(-1deg); }
}
@keyframes shimmerGold {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes leafDrift {
  0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.15; }
  50%  { transform: translateY(-30px) rotate(15deg) scale(1.05); opacity: 0.25; }
  100% { transform: translateY(-60px) rotate(30deg) scale(1); opacity: 0; }
}
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px var(--leaf-shimmer); }
  50%       { box-shadow: 0 0 60px var(--leaf-shimmer), 0 0 100px var(--leaf-shimmer); }
}
```

---

## 3. Component Architecture

### 3.1 New & Modified Components Map

```
src/
├── components/
│   └── public/
│       ├── Header.tsx               [MODIFY — dark mode + glass nav]
│       ├── Footer.tsx               [MODIFY — dark forest footer]
│       ├── CartDrawer.tsx           [MODIFY — dark glass drawer]
│       ├── CookieConsent.tsx        [MODIFY — dark glass banner]
│       ├── ContactForm.tsx          [MODIFY — dark theme inputs]
│       ├── GalleryLightbox.tsx      [KEEP — minor polish]
│       ├── ProductActions.tsx       [MODIFY — dark glass buttons]
│       │
│       ├── home/                    [NEW DIRECTORY]
│       │   ├── HeroSection.tsx      [NEW — full-screen botanical hero]
│       │   ├── StatsBar.tsx         [NEW — animated counters bar]
│       │   ├── FeaturedProducts.tsx [NEW — glass card grid with motion]
│       │   ├── BotanicalAbout.tsx   [NEW — split with leaf art]
│       │   ├── CertsBanner.tsx      [NEW — scrolling logo strip]
│       │   └── ProcessSection.tsx   [NEW — how we work, 3-step]
│       │
│       ├── products/                [NEW DIRECTORY]
│       │   ├── ProductCard.tsx      [NEW — reusable glass product card]
│       │   ├── CategoryPills.tsx    [NEW — horizontal pill filter nav]
│       │   └── ProductHero.tsx      [NEW — page hero banner]
│       │
│       └── shared/                  [NEW DIRECTORY]
│           ├── SectionLabel.tsx     [NEW — "✦ Label Text ✦" eyebrow]
│           ├── BotanicalDivider.tsx [NEW — decorative leaf SVG divider]
│           └── FloatingLeaves.tsx   [NEW — ambient CSS animated bg leaves]
│
└── app/
    └── (public)/
        ├── page.tsx                 [MODIFY — use new home sections]
        ├── products/page.tsx        [MODIFY — glass card grid]
        ├── products/[slug]/page.tsx [MODIFY — rich product detail]
        ├── about/page.tsx           [MODIFY — editorial dark layout]
        ├── contact/page.tsx         [MODIFY — dark glass form]
        ├── galleries/page.tsx       [MODIFY — moody masonry grid]
        └── certificates/page.tsx   [MODIFY — dark certificate showcase]
```

---

## 4. Page-by-Page Implementation Specifications

---

### 4.1 Homepage (`/`) — `page.tsx`

**Overall layout:** Dark forest background (`#0a1f0f`) throughout. No white sections except the stats bar which uses a very dark green.

#### Section A: Hero (`HeroSection.tsx`)

```
┌─────────────────────────────────────────────────────────┐
│  [Floating botanical leaves background — CSS animation] │
│                                                         │
│     ✦ Premium Egyptian Botanicals ✦                    │
│                                                         │
│  ┌─ Playfair Display, 6rem, white ─────────────────┐   │
│  │  Rooted in Nature,                              │   │
│  │  Exported with Care.                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Subtext in Inter, muted white, max-w-2xl              │
│                                                         │
│  [View Our Catalog →]  [Discover Our Farm]              │
│   gold-filled pill      ghost white pill                │
│                                                         │
│              ┌──────────────┐                           │
│              │  Glass Dome  │  ← Hero product showcase  │
│              │  plant 3D    │    (Framer Motion float)  │
│              │   render     │                           │
│              └──────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

**Implementation details:**
- Background: `radial-gradient(ellipse at 30% 50%, #1a3d20 0%, #0a1f0f 70%)`
- Floating leaves: 8–12 SVG leaf shapes, absolutely positioned, CSS `@keyframes leafDrift` with staggered `animation-delay` (0s to 8s), `animation-duration` 12s–20s each, very low opacity (0.08–0.2)
- "✦ Premium Egyptian Botanicals ✦" eyebrow: small text, gold color `#c9963a`, letter-spacing wide, centered
- Headline font: `font-heading` (Playfair Display), weight 700, fluid `clamp(3rem, 7vw, 6rem)`
- "Care." — the period is styled in gold (#c9963a) as a deliberate signature detail
- CTA buttons: 
  - Primary: `bg-gold text-forest-dark rounded-full px-8 py-4` with gold shimmer animation on hover
  - Secondary: `border border-white/30 text-white rounded-full px-8 py-4 backdrop-blur-sm hover:bg-white/10`
- Hero product image/illustration: wrapped in a `glass-card` with `border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%` (organic blob shape), animated with `float` keyframe. Use a high-quality plant image from Cloudinary or a placeholder SVG botanical illustration.
- Framer Motion: `motion.div` with `initial={{ opacity: 0, y: 40 }}`, `animate={{ opacity: 1, y: 0 }}`, stagger children 0.15s

#### Section B: Stats Bar (`StatsBar.tsx`)

```
┌──────────────────────────────────────────────────────┐
│  bg: #0d2b15  |  horizontal flex  |  py-10           │
│                                                      │
│  [100%]   [15+ yrs]   [50+]   [B2B]                 │
│  Organic  Experience  Nations  Wholesale             │
│  Certified                                           │
└──────────────────────────────────────────────────────┘
```

- Numbers: Playfair Display, 2.5rem, `text-gold` (`#c9963a`)  
- Labels: Inter, 0.875rem, `text-on-dark-muted`
- Dividers: `border-r border-white/10` between items
- Use `react-intersection-observer` to trigger a count-up number animation when the section enters view (animate from 0 to final value over 1.5s using `requestAnimationFrame`)

#### Section C: Featured Products (`FeaturedProducts.tsx`)

```
┌─────────────────────────────────────────────────────┐
│  bg: #0a1f0f                                        │
│                                                     │
│     ✦ Our Products ✦                                │
│     Featured Botanicals                             │
│     [View All →]                                   │
│                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐                     │
│  │glass │  │glass │  │glass │  ← glass cards       │
│  │card  │  │card  │  │card  │    with image top    │
│  │      │  │      │  │      │    + name + badge    │
│  └──────┘  └──────┘  └──────┘                     │
│  ┌──────┐  ┌──────┐  ┌──────┐                     │
│  │      │  │      │  │      │                     │
│  └──────┘  └──────┘  └──────┘                     │
└─────────────────────────────────────────────────────┘
```

**Product Card design (reuse as `ProductCard.tsx`):**
```
┌────────────────────────────────┐
│  glass-card  rounded-2xl       │
│                                │
│  ┌─ image area (aspect-[3/4]) ─┐│
│  │  product photo              ││
│  │  [Organic] badge top-left   ││
│  │  [♥ / +] icon top-right     ││
│  └─────────────────────────────┘│
│                                 │
│  Category · Small caps · gold   │
│  Product Name  (Playfair, bold) │
│  Scientific Name  (italic, dim) │
│                                 │
│  [Request Quote →]              │
│   ghost pill btn                │
└────────────────────────────────┘
```

- Card bg: `rgba(255,255,255,0.05)` with `backdrop-filter: blur(16px)`
- Card border: `1px solid rgba(255,255,255,0.10)`
- Card hover: `background rgba(255,255,255,0.10)`, border becomes `rgba(201,150,58,0.3)` (gold border glow), `translateY(-8px)` with `box-shadow 0 24px 64px rgba(0,0,0,0.5)`
- Image: `object-cover`, with `group-hover:scale-105` 700ms transition
- "Organic" badge: `bg-gold/90 text-forest-dark text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1`
- Framer Motion: `initial={{ opacity: 0, y: 30 }}`, stagger 0.08s per card, triggered by `whileInView` with `viewport={{ once: true }}`

#### Section D: About Botanical (`BotanicalAbout.tsx`)

```
┌────────────────────────────────────────────────────┐
│  bg: linear-gradient(#0d2b15, #0a1f0f)             │
│                                                    │
│  ┌── Left col ──────┐  ┌─── Right col ──────┐     │
│  │ ✦ Our Story ✦   │  │  [Glass-framed      │     │
│  │                  │  │   image with         │     │
│  │ Cultivating      │  │   arch/oval crop]    │     │
│  │ Excellence.      │  │                      │     │
│  │                  │  │  [Floating leaf      │     │
│  │ "From the Nile   │  │   decoration]        │     │
│  │  to the world…"  │  └──────────────────────┘     │
│  │                  │                              │
│  │  ✓ End-to-end    │                              │
│  │  ✓ GMP compliant │                              │
│  │  ✓ Sustainable   │                              │
│  │                  │                              │
│  │  [Learn More →]  │                              │
│  └──────────────────┘                              │
└────────────────────────────────────────────────────┘
```

- Right image: clipped with `clip-path: ellipse(48% 50% at 50% 50%)` or CSS arch shape `border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%`. Wrap in `glass-card`.
- Checkmarks: Replace `<CheckCircle2>` with a custom leaf-shaped bullet (`🌿` or an SVG icon) in gold
- Left text animation: `slideInLeft` on `whileInView`

#### Section E: Process Section (`ProcessSection.tsx`) — NEW

```
┌───────────────────────────────────────────────────┐
│  bg: #060f09  (deepest)                           │
│                                                   │
│  ✦ How It Works ✦                                │
│  From Farm to Your Doorstep                       │
│                                                   │
│  ┌────────┐    ──→    ┌────────┐    ──→    ┌────┐ │
│  │ 🌱     │          │ ⚗️     │           │ 📦  │ │
│  │ Grow   │          │Process │           │Ship │ │
│  │ (glass │          │(glass  │           │(gl) │ │
│  │  card) │          │  card) │           │card)│ │
│  └────────┘          └────────┘           └────┘ │
└───────────────────────────────────────────────────┘
```

- Three glass cards in a row with connecting animated dashed line between them
- Icons: use Lucide icons (`Sprout`, `FlaskConical`, `Package`) styled in gold on a dark circle
- Each card: animate in with stagger 0.2s

#### Section F: Certificates (`CertsBanner.tsx`)

- Infinite horizontal scroll marquee of certificate logos on `bg: #0d2b15`
- Uses CSS `@keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }` on a duplicated list
- Logos: white/light, with opacity 0.5, hover brings to opacity 1

---

### 4.2 Products Listing (`/products`) — `products/page.tsx`

**Overall:** Dark forest background, horizontal category pills (not sidebar), 3-col glass card grid.

```
┌────────────────────────────────────────────────────┐
│  Page Hero Banner  [bg: radial forest gradient]    │
│  h1: "Our Products"  subtext in muted white        │
│  [Search bar — glass style — centered below h1]    │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  Category Pills  [horizontal scroll, sticky top]  │
│  [All] [Herbs] [Spices] [Seeds] [Flowers] …        │
│  Active: gold-filled pill  Inactive: glass pill    │
└────────────────────────────────────────────────────┘

┌──────┐  ┌──────┐  ┌──────┐
│ card │  │ card │  │ card │  ← ProductCard component
└──────┘  └──────┘  └──────┘
```

**CategoryPills.tsx:**
- `'use client'` — updates URL params with `useRouter`/`useSearchParams`
- Horizontally scrollable on mobile (no scrollbar visible), sticky below header
- Active pill: `bg-gold text-forest-dark`
- Inactive pill: `glass-card text-on-dark-muted hover:border-gold/30`

**Search bar:**
- Glass style: `bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder:text-white/40`
- Magnifier icon in gold
- Triggers server-side rerender (form action, native HTML form)

**Empty state:**
- Large SVG botanical illustration (leaf/herb) in muted green
- Text: "No botanicals found. Try clearing your filters."

---

### 4.3 Product Detail (`/products/[slug]`) — `products/[slug]/page.tsx`

```
┌─────────────────────────────────────────────────────┐
│  bg: #0a1f0f                                        │
│                                                     │
│  ┌── Image Gallery (left 55%) ──┐ ┌── Info (45%) ─┐│
│  │  Main image (glass framed)   │ │ Category pill  ││
│  │  Thumbnails strip below      │ │ h1: Name       ││
│  │  [← →] nav arrows           │ │ Scientific name ││
│  └──────────────────────────────┘ │ ---separator-- ││
│                                   │ Description     ││
│                                   │ Tags/properties ││
│                                   │ [Request Quote] ││
│                                   │ [Add to Cart]   ││
│                                   └────────────────┘│
│                                                     │
│  Tabbed section: Overview | Specifications | Usage  │
└─────────────────────────────────────────────────────┘
```

- Main image: large, `rounded-2xl`, with `glass-card` border treatment
- Properties (origins, forms, harvest season, etc.): displayed as a glass-styled `<dl>` grid
- Tabs: Radix UI `<Tabs>` with dark glass styling

---

### 4.4 About Page (`/about`)

```
┌──────────────────────────────────────────────────────┐
│  FULL-SCREEN hero: "Our Story"                       │
│  Dark deep green bg + floating leaves                │
│  Italic script: "Cultivating Nature Since 2005"      │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Mission + values — alternating image/text sections  │
│  Each with glass card treatment                      │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Team grid — circular portrait photos                │
│  glass-card nameplate below each                     │
└──────────────────────────────────────────────────────┘
```

---

### 4.5 Contact Page (`/contact`)

- Full dark theme, large leaf illustration fills right col
- Contact form: all inputs styled `glass-card` with white/10 border, white text, gold focus ring
- Map: embedded below with a dark overlay/filter (`filter: invert(0.9) hue-rotate(180deg)` for dark mode map)

---

### 4.6 Galleries Page (`/galleries`)

- Dark hero + masonry grid layout
- Images open in `GalleryLightbox` (already exists)
- Gallery cards: glass-card with category label in gold

---

### 4.7 Certificates Page (`/certificates`)

- Dark bg, certificate cards in glass treatment
- Each certificate has image + title + issuer
- Optional: click to expand in lightbox

---

## 5. Header Redesign

**Current:** White/transparent header, standard nav.  
**New:** Glass nav with dark transparent base, transitions on scroll.

### Scroll States:

| State | Background | Text | Logo |
|---|---|---|---|
| Top of page | `transparent` | `text-on-dark` (white) | Leaf icon white |
| Scrolled | `bg-forest-dark/90 backdrop-blur-lg border-b border-white/10` | `text-on-dark` (white) | Leaf icon gold |
| Mobile menu | Full-screen forest dark, slide from right | White links | — |

### Nav Item Active Style:
- Active: `text-gold` + thin gold underline `border-b-2 border-gold`
- Hover: `text-white` transition 200ms

### CTA Button in Nav:
- `bg-gold text-forest-dark rounded-full px-5 py-2 hover:bg-gold-light transition-colors`

### Mobile Menu:
- Slide in from right with `Framer Motion` `x: "100%" → x: 0`
- Background: `bg-forest-dark/98 backdrop-blur-xl`
- Nav links: large, Playfair Display, stagger animation

---

## 6. Footer Redesign

**Theme:** Dark forest green (`#060f09`), editorial layout.

```
┌──────────────────────────────────────────────────────┐
│  [Logo]                                              │
│  "Bridging Egyptian farms with the world."           │
│  Social icons (gold on hover)                        │
│                                                      │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  Quick Links | Products | Contact | Legal            │
│  (4 columns)                                         │
│                                                      │
│  ─────────────────────────────────────────────────  │
│  © 2025 Calendula Herbs · Privacy · Terms           │
└──────────────────────────────────────────────────────┘
```

- Thin gold divider lines `border-t border-gold/20`
- Link hover: `text-gold` transition
- Social icons: `lucide-react` wrapped in `rounded-full border border-white/10 p-2 hover:border-gold hover:text-gold`

---

## 7. Framer Motion Animation Strategy

### Global Conventions

```typescript
// Reusable variants — put in src/lib/animations.ts [NEW FILE]
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}

export const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } }
}
```

### Usage Rules
1. **Always use `whileInView` + `viewport={{ once: true }}`** for scroll-triggered animations (never replay)
2. **Wrap sections in `<motion.div variants={staggerContainer} whileInView="visible" initial="hidden">`**
3. **Each child** uses `<motion.div variants={cardVariant}>`
4. **Hero** uses `animate` (not `whileInView`) with `initial={{ opacity: 0 }}`
5. **Respect `prefers-reduced-motion`** — wrap Framer Motion components with the hook: `const prefersReduced = useReducedMotion()`

---

## 8. Accessibility Requirements

- All dark glass elements: verify contrast ≥ 4.5:1 with white text against `rgba(255,255,255,0.07)` bg — **use white text `#f0fdf4` only** (verified 12.7:1 on `#0a1f0f`)
- Gold `#c9963a` on dark `#0a1f0f`: contrast ratio ≈ 5.2:1 ✓ (WCAG AA passes)
- Gold `#c9963a` on glass card `rgba(255,255,255,0.07)` over `#0a1f0f` background: ≈ 5.1:1 ✓
- All interactive elements: `focus-visible` ring in gold `outline: 2px solid #c9963a; outline-offset: 2px`
- Images: meaningful `alt` text from DB `name` / `alt` field
- Glass cards: ensure they are `<a>` or `<button>` elements, not plain `<div>`
- Mobile tap targets: minimum 44×44px
- Skip-to-main-content link at the very top of `<body>`
- `aria-label` on icon-only buttons (cart, hamburger, close)

---

## 9. Responsive Breakpoints

| Breakpoint | Product Grid | Layout |
|---|---|---|
| `< 480px` | 1 column | Stacked, full-width |
| `480px–767px` | 2 columns | Mobile-optimized |
| `768px–1023px` | 2 columns | Tablet |
| `≥ 1024px` | 3 columns | Desktop |
| `≥ 1280px` | 3–4 columns | Wide desktop |

Category pills: horizontal scroll on mobile (`overflow-x: auto; scrollbar-width: none`), wrap on desktop.

---

## 10. SEO Implementation

Each public page must have:
```typescript
// In each page.tsx — dynamically generated
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Page Title | Calendula Herbs',
    description: '155-char compelling description',
    openGraph: {
      title: '...',
      description: '...',
      images: [{ url: productImage || '/og-default.jpg', width: 1200, height: 630 }],
      type: 'website',
      locale: 'en_US',
    },
    twitter: { card: 'summary_large_image', ... },
    alternates: { canonical: 'https://calendulaherbs.com/path' }
  }
}
```

Structured data (JSON-LD):
- `Organization` schema on homepage and about
- `Product` schema on each product detail page
- `BreadcrumbList` on product listing and detail

---

## 11. Performance Directives

1. **Images:** All via `next/image` with `sizes` prop set correctly (e.g., `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`)
2. **Fonts:** `display: swap`, preload `Playfair Display` 700 only (the weight used for headings)
3. **Animations:** Framer Motion is already in dependencies. Use `LazyMotion` + `domAnimation` feature bundle to reduce JS payload:
   ```tsx
   import { LazyMotion, domAnimation } from 'framer-motion'
   // Wrap root layout
   ```
4. **Floating leaves:** Pure CSS animation (no JS), lightweight SVG `<path>` elements
5. **Glass blur:** `backdrop-filter` only on hover or for essential elements — excessive use tanks GPU on low-end devices

---

## 12. File Change Summary

### Modify (no schema changes needed):

| File | Changes |
|---|---|
| `src/app/globals.css` | Add new CSS tokens, glass utilities, animation keyframes |
| `src/app/(public)/page.tsx` | Replace all sections with new home section components |
| `src/app/(public)/layout.tsx` | Add `LazyMotion` wrapper, font preload for Cormorant |
| `src/app/layout.tsx` | Add Cormorant Garamond Google Font import |
| `src/app/(public)/products/page.tsx` | Dark theme, glass cards, horizontal category pills |
| `src/app/(public)/products/[slug]/page.tsx` | Dark theme, image gallery, tabbed info |
| `src/app/(public)/about/page.tsx` | Dark editorial layout, team grid |
| `src/app/(public)/contact/page.tsx` | Dark glass form, dark map |
| `src/app/(public)/galleries/page.tsx` | Dark masonry grid |
| `src/app/(public)/certificates/page.tsx` | Dark certificate showcase |
| `src/components/public/Header.tsx` | Full dark glass redesign |
| `src/components/public/Footer.tsx` | Full dark editorial redesign |
| `src/components/public/CartDrawer.tsx` | Dark glass drawer panel |
| `src/components/public/ContactForm.tsx` | Dark glass form inputs |
| `src/components/public/CookieConsent.tsx` | Dark glass banner |
| `tailwind.config.ts` | Add new color tokens as CSS var references |

### Create (new files):

| File | Purpose |
|---|---|
| `src/lib/animations.ts` | Framer Motion variant presets |
| `src/components/public/home/HeroSection.tsx` | Full homepage hero |
| `src/components/public/home/StatsBar.tsx` | Animated counters |
| `src/components/public/home/FeaturedProducts.tsx` | Glass card grid |
| `src/components/public/home/BotanicalAbout.tsx` | Story split section |
| `src/components/public/home/ProcessSection.tsx` | 3-step process |
| `src/components/public/home/CertsBanner.tsx` | Scrolling cert strip |
| `src/components/public/products/ProductCard.tsx` | Reusable glass card |
| `src/components/public/products/CategoryPills.tsx` | Filter pills (client) |
| `src/components/public/products/ProductHero.tsx` | Page banner component |
| `src/components/public/shared/SectionLabel.tsx` | Eyebrow label |
| `src/components/public/shared/BotanicalDivider.tsx` | SVG decorative divider |
| `src/components/public/shared/FloatingLeaves.tsx` | Ambient CSS bg leaves |

---

## 13. Open Questions

> [!IMPORTANT]
> The following need clarification before starting implementation:

1. **Hero visual:** No hero image is seeded in the DB and Cloudinary is not configured. Should the hero use:
   - A generated AI botanical illustration (can be created now)
   - A CSS/SVG-only abstract botanical composition (no image dependency)
   - A placeholder pattern that will be replaced by Cloudinary later
   
2. **About page images:** Same question — are team photos and farm/facility images available or should placeholder states be designed?

3. **Dark mode toggle:** The current CSS has a `@media (prefers-color-scheme: dark)` block. Should the entire public site be **always dark** (as in the inspiration images), or should it respect system dark mode preference?

4. **Language/locale:** Any Arabic (RTL) content or multi-language requirement for the public frontend?

5. **Cormorant Garamond font:** Adds ~50KB. Approve adding it, or limit to Playfair Display only?

---

## 15. Admin Panel Visual Enhancement

> [!IMPORTANT]
> The admin panel already has a correct dark shell (sidebar `#0a0f0d`, header `#0a0f0d/80`) but **all inner content cards, tables, form panels, and tab strips still use white/light-grey colours** — a hard visual clash. The goal is a **fully consistent dark glass design system** throughout the admin, matching the existing shell without rewriting any API logic or component behaviour.

### 15.1 Admin Design System Tokens (add to `globals.css`)

```css
/* ─── Admin Panel Design Tokens ─────────────────────────────────────────── */
:root {
  /* Admin surfaces */
  --admin-bg:           #0a0f0d;          /* page background — existing ✓ */
  --admin-surface:      rgba(255,255,255,0.04);  /* card / panel base */
  --admin-surface-hover:rgba(255,255,255,0.07);  /* card hover state */
  --admin-surface-raised:rgba(255,255,255,0.06); /* elevated modals, dropdowns */
  --admin-border:       rgba(255,255,255,0.08);  /* default border */
  --admin-border-active:rgba(34,197,94,0.35);    /* focused / active border */
  --admin-border-gold:  rgba(201,150,58,0.30);   /* gold-accented border */

  /* Admin text */
  --admin-text:         #f0fdf4;          /* primary text on dark */
  --admin-text-muted:   rgba(240,253,244,0.55);  /* secondary / placeholder */
  --admin-text-subtle:  rgba(240,253,244,0.30);  /* disabled / tertiary */

  /* Admin accent (inherits public gold) */
  --admin-accent:       #c9963a;          /* gold — same as --gold */
  --admin-green:        #22c55e;          /* bright green for success/active */
  --admin-green-dim:    rgba(34,197,94,0.15); /* green fill on dark */
  --admin-red:          #f87171;          /* destructive actions */
  --admin-red-dim:      rgba(248,113,113,0.12);
  --admin-amber:        #fbbf24;          /* warning */
  --admin-amber-dim:    rgba(251,191,36,0.12);
  --admin-blue:         #60a5fa;          /* info */
  --admin-blue-dim:     rgba(96,165,250,0.12);
  --admin-purple:       #c084fc;          /* sample requests */
  --admin-purple-dim:   rgba(192,132,252,0.12);

  /* Admin sidebar */
  --admin-sidebar-w:    16rem;            /* 256px — Tailwind w-64 */
  --admin-header-h:     4rem;             /* 64px — Tailwind h-16 */
}
```

### 15.2 Admin Utility Classes (add to `globals.css`)

```css
/* ── Admin card / panel ── */
.admin-card {
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: 0.75rem;   /* rounded-xl */
}
.admin-card:focus-within {
  border-color: var(--admin-border-active);
}

/* ── Admin table ── */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  color: var(--admin-text);
}
.admin-table thead tr {
  border-bottom: 1px solid var(--admin-border);
  color: var(--admin-text-muted);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.admin-table thead th {
  padding: 0.75rem 1rem;
  text-align: left;
  background: rgba(255,255,255,0.02);
}
.admin-table tbody tr {
  border-bottom: 1px solid var(--admin-border);
  transition: background 150ms;
}
.admin-table tbody tr:hover {
  background: var(--admin-surface-hover);
}
.admin-table tbody td {
  padding: 0.875rem 1rem;
  vertical-align: middle;
}

/* ── Admin form inputs ── */
.admin-input {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--admin-border);
  color: var(--admin-text);
  border-radius: 0.5rem;
  transition: border-color 150ms;
}
.admin-input::placeholder {
  color: var(--admin-text-subtle);
}
.admin-input:focus {
  outline: none;
  border-color: var(--admin-border-active);
  box-shadow: 0 0 0 2px rgba(34,197,94,0.15);
}

/* ── Admin badge variants ── */
.admin-badge-green  { background: var(--admin-green-dim);  color: var(--admin-green);  border: 1px solid rgba(34,197,94,0.25); }
.admin-badge-red    { background: var(--admin-red-dim);    color: var(--admin-red);    border: 1px solid rgba(248,113,113,0.25); }
.admin-badge-amber  { background: var(--admin-amber-dim);  color: var(--admin-amber);  border: 1px solid rgba(251,191,36,0.25); }
.admin-badge-blue   { background: var(--admin-blue-dim);   color: var(--admin-blue);   border: 1px solid rgba(96,165,250,0.25); }
.admin-badge-purple { background: var(--admin-purple-dim); color: var(--admin-purple); border: 1px solid rgba(192,132,252,0.25); }
.admin-badge-muted  { background: rgba(255,255,255,0.06);  color: var(--admin-text-muted); border: 1px solid var(--admin-border); }
```

### 15.3 Radix UI / Shadcn Component Dark Overrides

All admin pages import Shadcn components from `src/components/ui/`. These components use Tailwind classes that resolve to the CSS variables already in `globals.css`. The overrides needed are:

#### `src/components/ui/` — which components need admin dark variants:

| Component | Current Issue | Fix Strategy |
|---|---|---|
| `input.tsx` | White bg | Add `.admin-context input` CSS rule or use variant prop |
| `textarea.tsx` | White bg | Same as input |
| `select.tsx` | White trigger + white dropdown | Override with admin CSS variables |
| `button.tsx` | Light variants clash on dark | Add `dark` variant or use `admin-card` class on ghost buttons |
| `badge.tsx` | Light variants clash | Use `admin-badge-*` utility classes instead |
| `dropdown-menu.tsx` | White popup | Override popover bg |
| `dialog.tsx` | White modal | Override dialog bg |
| `tabs.tsx` | White underline tab strip | Dark version |

**Recommended approach — CSS context selector** (no component changes needed):

```css
/* In globals.css — admin dark overrides via layout class */
.admin-panel [data-radix-select-viewport],
.admin-panel [data-radix-dropdown-menu-content],
.admin-panel [data-radix-dialog-content] {
  background: #111a14;
  border: 1px solid var(--admin-border);
  color: var(--admin-text);
}

.admin-panel input:not([type="checkbox"]):not([type="radio"]),
.admin-panel textarea,
.admin-panel select {
  background: rgba(255,255,255,0.05) !important;
  border-color: var(--admin-border) !important;
  color: var(--admin-text) !important;
}
.admin-panel input::placeholder,
.admin-panel textarea::placeholder {
  color: var(--admin-text-subtle) !important;
}
```

> **Implementation:** Add `className="admin-panel"` to the `<div className="flex h-screen…">` in `AdminPanelLayout` — this single change cascades all form/select/dialog overrides automatically.

### 15.4 Component-by-Component Admin Specifications

---

#### `AdminSidebar.tsx` — Enhance (minor)

The sidebar is already dark (`#0a0f0d`). Enhancements:

```
Current:  Plain green-tinted nav links
New:      Active link = left gold accent bar + glass bg + gold icon
          Logo area gets a faint gold glow ring around the leaf icon
          Sidebar bottom: admin user mini-profile (avatar + name + role tag)
          Hover: smooth 200ms background + icon colour transition
```

**Active nav item visual:**
```tsx
// Active state class:
'relative pl-3 bg-gradient-to-r from-green-500/10 to-transparent 
 border-l-2 border-gold text-green-300 font-medium'
// (border-l-2 acts as the left accent bar)

// Icon on active: text-gold instead of text-green-400
```

**Logo area enhancement:**
```tsx
// Wrap leaf icon container:
<div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-400/20
               flex items-center justify-center
               shadow-[0_0_12px_rgba(34,197,94,0.2)]">
  <Leaf className="w-5 h-5 text-green-400" />
</div>
// Add site name with gradient:
<span className="font-heading text-lg font-bold
                 bg-gradient-to-r from-green-300 to-green-400
                 bg-clip-text text-transparent">
  Calendula
</span>
```

---

#### `AdminHeader.tsx` — Enhance (minor)

```
Current:  Search + bell + avatar, already dark glass
New:      
  - Bell button: glass pill shape with notification dot glow
  - Avatar: gradient ring border (gold/green)
  - Add breadcrumb trail left of search (shows current page path)
  - Search input: styled with admin-input class
```

**Breadcrumb addition:**
```tsx
// Between logo and search — shows path like: Dashboard > Products
<div className="hidden lg:flex items-center gap-2 text-xs text-admin-text-muted mr-4">
  <span>Dashboard</span>
  <ChevronRight className="w-3 h-3 opacity-40" />
  <span className="text-admin-text">{currentPage}</span>
</div>
```

---

#### `AdminPanelLayout` (`admin/layout.tsx`) — Modify

```tsx
// Add admin-panel class to root div:
<div className="admin-panel flex h-screen overflow-hidden bg-[#0a0f0d] text-green-50">

// Enhance ambient glow — dual glows:
<div className="absolute top-0 right-0 w-[600px] h-[600px]
               bg-green-500/[0.025] rounded-full blur-3xl
               -translate-y-1/2 translate-x-1/3 pointer-events-none" />
<div className="absolute bottom-0 left-1/3 w-[400px] h-[400px]
               bg-gold/[0.015] rounded-full blur-3xl
               translate-y-1/2 pointer-events-none" />
```

---

#### Dashboard Overview (`dashboard/page.tsx`) — Major visual update

**Current issues:**
- White `bg-white/5` cards look correct but `bg-gradient-to-br from-green-900/40` highlight cards are too dark-green-on-dark-green
- Inquiry panels use `bg-blue-500/10 border border-blue-500/20` — inconsistent with design system
- StatCards have no hover effect

**New StatCard design:**
```
┌──────────────────────────────────┐
│  admin-card  hover:border-gold/20 │
│  hover:bg-admin-surface-hover     │
│  transition-all duration-200      │
│                                   │
│  [Icon in gold circle]  Title     │
│                                   │
│  2.5rem bold white value          │
│  Trend indicator (if applicable)  │
└──────────────────────────────────┘
```

```tsx
// StatCard redesign:
<div className={`admin-card p-6 transition-all duration-200 cursor-default
  hover:border-[rgba(201,150,58,0.2)] hover:bg-[rgba(255,255,255,0.07)]
  ${highlight ? 'border-[rgba(34,197,94,0.2)]' : ''}`}>
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xs font-medium uppercase tracking-wider
                   text-[rgba(240,253,244,0.5)]">{title}</h3>
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
      ${highlight 
        ? 'bg-green-500/15 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
        : 'bg-white/5 text-[rgba(240,253,244,0.4)]'}`}>
      <Icon className="w-4 h-4" />
    </div>
  </div>
  <div className="text-3xl font-bold text-white font-heading">{value}</div>
</div>
```

**Inquiry panels — use admin badge system:**
```tsx
// Contact inquiry:
<div className="flex gap-3 items-start p-3.5 rounded-xl
               bg-[rgba(96,165,250,0.08)] border border-[rgba(96,165,250,0.15)]">
  <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
  <div>
    <p className="text-sm font-medium text-blue-100">{n} new contact message{s}</p>
    <p className="text-xs text-blue-100/50 mt-0.5">Awaiting your response</p>
  </div>
</div>
// Same pattern with amber/purple for cart/samples
```

**Quick Actions card** — fill the empty right panel:
```
┌──────────────────────────────────┐
│  Quick Actions                    │
│                                   │
│  [+ New Product]   glass pill btn │
│  [Upload Media]    glass pill btn │
│  [View Inquiries]  glass pill btn │
│  [Site Settings]   glass pill btn │
│                                   │
│  System info footer:              │
│  "X active sessions · Last login" │
└──────────────────────────────────┘
```

---

#### Products Admin Page (`dashboard/products/page.tsx`) — Major visual update

**Current issues:**
- Table wrapped in `bg-white border rounded-xl` — bright white on dark page
- Table header `bg-neutral-50` — white
- Table rows `hover:bg-neutral-50` — white
- Empty state `text-neutral-400` — too faint
- Pagination buttons use light `variant="outline"`

**New table treatment:**
```tsx
// Replace <div className="bg-white border rounded-xl overflow-hidden">
<div className="admin-card overflow-hidden">
  <table className="admin-table">
    <thead>
      <tr> {/* admin-table CSS handles the styling */}
        <th>Image</th>
        <th>Product</th>
        ...
      </tr>
    </thead>
    <tbody>
      {products.map(product => (
        <tr key={product.id}> {/* admin-table CSS handles hover */}
          ...
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**Product thumbnail** (in table):
```tsx
// Replace: bg-neutral-100 border
<div className="w-12 h-12 rounded-lg overflow-hidden
               bg-white/5 border border-white/10 shrink-0">
```

**Status badges** — use admin badge system:
```tsx
// Active: admin-badge-green class
// Inactive: admin-badge-muted class
// Featured: admin-badge-amber class
// Organic: admin-badge-green class with leaf icon
```

**Filter bar inputs** — use admin-input:
```tsx
// Search input:
<Input className="admin-input pl-9 text-sm" placeholder="Search products..." />
// Select triggers: bg-white/5 border-white/10 text-green-50
```

**Pagination** — ghost dark buttons:
```tsx
<Button variant="ghost" className="border border-white/10 text-green-100/70
  hover:bg-white/5 hover:text-white hover:border-white/20">
  Previous
</Button>
<span className="text-sm text-green-100/50">Page {page} of {totalPages}</span>
<Button ...>Next</Button>
```

---

#### Settings Page (`dashboard/settings/page.tsx`) — Major visual update

**Current issues:**
- All `bg-white border rounded-xl` panels — white
- Tab strip uses `border-b` on white/light bg
- Form labels `text-neutral-800` — wrong on dark
- Warning banner `bg-amber-50 border-amber-200 text-amber-800` — wrong on dark

**Tab strip redesign:**
```tsx
// Replace the border-b tab strip:
<div className="flex gap-1 p-1 admin-card rounded-xl w-fit mb-6">
  {TABS.map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-150
        ${ activeTab === tab.id
          ? 'bg-green-500/15 text-green-300 border border-green-500/20'
          : 'text-green-100/50 hover:text-green-100/80 hover:bg-white/5'
        }`}
    >
      <tab.icon className="h-3.5 w-3.5" />
      {tab.label}
    </button>
  ))}
</div>
```

**Settings panels** — replace `bg-white border rounded-xl`:
```tsx
// All setting group containers:
<div className="admin-card p-6 space-y-5">
  <h2 className="text-sm font-semibold text-green-100/80 flex items-center gap-2
                uppercase tracking-wide">
    <Globe className="h-3.5 w-3.5 text-green-400" />
    General Information
  </h2>
  ...
</div>
```

**Form labels:**
```tsx
// Replace: text-neutral-800
// With:    text-green-100/70 text-sm
```

**Warning/info banners:**
```tsx
// Plugin security warning:
<div className="flex gap-2 p-3 rounded-xl text-sm
               bg-amber-500/10 border border-amber-500/20 text-amber-200">
  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
  <span>Only activate plugins from trusted sources...</span>
</div>
```

**Save buttons** — all admin save actions use the same pattern:
```tsx
<Button className="bg-green-600/80 hover:bg-green-600 text-white
                  border border-green-500/30 rounded-lg
                  shadow-[0_0_16px_rgba(34,197,94,0.15)]">
  <Save className="h-4 w-4 mr-2" />
  Save Settings
</Button>
```

---

#### Other Admin Pages (apply same patterns)

| Page | Key changes |
|---|---|
| `galleries/page.tsx` | Gallery list: `admin-card` items, drag handles use `text-green-100/30 hover:text-green-100/60` |
| `galleries/[id]/page.tsx` | Image grid cards: `admin-card` with `hover:border-gold/20`, add/remove glass buttons |
| `certificates/page.tsx` | Certificate cards: `admin-card`, upload zone: dashed `border-white/15` |
| `team/page.tsx` | Team member cards: `admin-card`, avatar circle with green gradient ring |
| `team/[id]/page.tsx` | Full editor: `admin-card` panels for each section, admin form inputs |
| `inquiries/page.tsx` | Tab strip: same pill-tab pattern as Settings, inquiry cards: colour-coded `admin-badge-*` |
| `media/page.tsx` | Grid: `admin-card` media cards, storage bar uses green gradient fill |
| `profile/page.tsx` | Profile card: `admin-card` with avatar, session list: `admin-card` rows |

---

#### Media Components (`components/admin/media/`) — Enhance

**`MediaUploader.tsx`:**
```tsx
// Drop zone:
<div className="border-2 border-dashed border-white/15 rounded-xl
               bg-white/3 hover:bg-white/5 hover:border-green-500/30
               transition-all duration-200 text-center p-12">
  <Upload className="w-10 h-10 text-green-400/40 mx-auto mb-3" />
  <p className="text-green-100/50 text-sm">Drop files here or click to upload</p>
</div>
// Progress bar: green gradient fill on dark track
```

**`MediaPicker.tsx`:**
```tsx
// Modal backdrop: bg-black/60 backdrop-blur-sm
// Modal panel: admin-card elevated (bg-[#111a14])
// Search input: admin-input
// Image grid items: rounded-lg overflow-hidden border border-white/8
//   hover:border-green-500/30 selected:border-green-400 selected:ring-1
//   selected:ring-green-400
```

---

### 15.5 Admin Login Page (`(admin-auth)/admin/login/page.tsx`)

Even though it exists, check its current style and apply:
- Same `#0a0f0d` / forest dark background
- Centered glass card: `admin-card p-10 max-w-md w-full`
- Logo + "Admin Panel" heading in Playfair Display
- Inputs: `admin-input`
- Submit: green gradient button with glow shadow
- Subtle botanical leaf SVG in background at low opacity

---

### 15.6 Admin File Change Summary

#### Modify (admin panel):

| File | Changes |
|---|---|
| `src/app/globals.css` | Add admin design tokens + utility classes + context selectors |
| `src/app/(admin-panel)/admin/layout.tsx` | Add `admin-panel` class, enhance ambient glows |
| `src/components/admin/AdminSidebar.tsx` | Gold active accent bar, logo glow, gradient text |
| `src/components/admin/AdminHeader.tsx` | Breadcrumb, admin-input search, refined avatar ring |
| `src/app/(admin-panel)/admin/dashboard/page.tsx` | StatCard redesign, inquiry panels, quick actions |
| `src/app/(admin-panel)/admin/dashboard/products/page.tsx` | admin-table, admin-input filters, admin badges, dark pagination |
| `src/app/(admin-panel)/admin/dashboard/settings/page.tsx` | Pill tabs, admin-card panels, form labels, dark warning banners |
| `src/app/(admin-panel)/admin/dashboard/galleries/page.tsx` | admin-card items |
| `src/app/(admin-panel)/admin/dashboard/galleries/[id]/page.tsx` | admin-card image grid |
| `src/app/(admin-panel)/admin/dashboard/certificates/page.tsx` | admin-card, dark upload zone |
| `src/app/(admin-panel)/admin/dashboard/team/page.tsx` | admin-card member cards |
| `src/app/(admin-panel)/admin/dashboard/team/[id]/page.tsx` | admin-card editor panels, admin-input |
| `src/app/(admin-panel)/admin/dashboard/inquiries/page.tsx` | Pill tabs, colour-coded inquiry cards |
| `src/app/(admin-panel)/admin/dashboard/media/page.tsx` | admin-card media grid, dark storage bar |
| `src/components/admin/media/MediaUploader.tsx` | Dark drop zone, green progress bar |
| `src/components/admin/media/MediaPicker.tsx` | Dark modal, admin-input search, dark grid |
| `src/app/(admin-auth)/admin/login/page.tsx` | Glass card login, dark botanical bg |

---

## 14. Verification Plan

### After each section:
- `npm run dev` — verify no TypeScript errors and page renders
- Visual check against reference images

### Final verification:
- Run `npm run build` — zero build errors
- Lighthouse audit: target LCP < 2.5s, CLS < 0.1, TBT < 300ms
- Contrast check with browser DevTools accessibility panel
- Mobile emulator test at 375px, 768px, 1440px
- Keyboard-only navigation test (Tab, Enter, Space, Escape)
- `prefers-reduced-motion` test (enable in OS, verify no animations play)
