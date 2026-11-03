# NAVE Design System & Editorial Brand Guide

## 1. Brand Essence & Visual Language

**NAVE** is a high-end luxury fashion atelier celebrating timeless capsule wardrobes, rich tactile fabrics, and effortless autumnal silhouettes. The visual language blends classic editorial typography with warm earthy tones, evoking the quiet luxury of brownstone avenues, cashmere wool, and tailored outerwear.

---

## 2. Color Palette & Design Tokens

All CSS variables are declared on the `:root` pseudo-class in [`style.css`](style.css) to provide predictable cascading and consistent thematic styling.

| Token Name         | Hex Value | Semantic Role                         | WCAG Contrast           |
| :----------------- | :-------- | :------------------------------------ | :---------------------- |
| `--bg-cream`       | `#FAF7F2` | Primary Canvas & Document Background  | Warm parchment base     |
| `--bg-sand`        | `#F4EFEA` | Secondary Surface / Card Background   | Subtle separation       |
| `--bg-surface`     | `#FFFFFF` | Elevated Elements & Modal Surfaces    | Pure contrast           |
| `--bg-wine`        | `#4E1522` | Brand Accent, CTA Buttons, Newsletter | High contrast on cream  |
| `--bg-wine-hover`  | `#3C0F1A` | Interactive Hover & Focus Fill        | Enhanced depth          |
| `--bg-dark-footer` | `#1A0E12` | Grounded Footer & Header Accent       | Deep grounding contrast |
| `--text-dark`      | `#211B1D` | Primary Body Copy & Item Titles       | AA compliant (> 10:1)   |
| `--text-secondary` | `#63575A` | Secondary Metadata, Subtitles         | Legible mid-tone        |
| `--text-muted`     | `#8F8386` | Footnotes, Disabled States, Tags      | Accessible secondary    |
| `--accent-camel`   | `#B37D4E` | Warm Leather / Camel Highlight        | Rich warm tone          |
| `--accent-olive`   | `#4D533C` | Seasonal Editorial Secondary          | Earthy seasonal accent  |
| `--border-light`   | `#EFE9E2` | Hairline Editorial Dividers           | Delicate border         |

---

## 3. Typography Hierarchy

The typographic system pairs an expressive Italian-style serif with a crisp, geometric neo-grotesque sans-serif.

### Typefaces

- **Editorial Serif:** `'Cormorant Garamond', Garamond, Georgia, serif`
  - Used for the primary brand mark, hero headline, section titles, and editorial pull-quotes.
  - Weights: `400` (Regular), `500` (Medium), `600` (Semi-Bold), `700` (Bold), with selective italic emphasis.
- **Systematic Sans-Serif:** `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`
  - Used for body copy, category filters, navigation links, pricing values, and UI controls.
  - Weights: `400` (Regular), `500` (Medium), `600` (Semi-Bold), `700` (Bold).

### Type Scale (Fluid & Rem-Based)

- **Hero Title (`h1`):** `clamp(2.75rem, 6vw, 4.25rem)` / line-height `1.08`
- **Section Heading (`h2`):** `clamp(1.75rem, 3.5vw, 2.5rem)` / line-height `1.15`
- **Sub-heading / Feature Title (`h3`):** `1.15rem – 1.35rem` / letter-spacing `0.04em`
- **Body Regular:** `0.95rem (15.2px)` / line-height `1.6`
- **Micro-copy & Uppercase Labels:** `0.72rem – 0.82rem` / letter-spacing `0.12em` – `0.16em`

---

## 4. Spacing Scale & Elevation

A strict 4px/8px modular spacing scale guarantees rhythmic alignment across all components.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

### Elevation & Shadows

- **Subtle Surface:** `box-shadow: 0 2px 10px rgba(33, 27, 29, 0.04)`
- **Interactive Card Hover:** `box-shadow: 0 8px 24px rgba(33, 27, 29, 0.08)`
- **Drawer / Modal Overlay:** `box-shadow: -8px 0 32px rgba(26, 14, 18, 0.18)`

---

## 5. Component & Button Variants

### Primary Editorial Button (`.apparel-add-btn`, `.hero-cta-btn`)

- **Background:** Deep Wine Burgundy (`#4E1522`)
- **Text:** Crisp White (`#FFFFFF`), uppercase, letter-spacing `0.14em`, weight `600`
- **Hover:** Darkens to `#3C0F1A` with subtle scale transition (`translateY(-1px)`)
- **Active / Success Flash:** Transitions smoothly to forest green tone (`#2D5A3F`) with feedback "Added ✓".

### Category Filter Pills (`.cat-filter-btn`)

- **Default State:** Transparent background, subtle border (`#EFE9E2`), uppercase sans-serif.
- **Active State:** Solid Wine Burgundy background (`#4E1522`), white text, bold font-weight.

### Circular Category Selectors (`.category-circle-item`)

- Rounded photographic circle thumbnails with micro-labels.
- On hover/active: Delicate ring border in Camel Toffee (`#B37D4E`).

### Micro-Action Wishlist Heart (`.wishlist-heart-btn`)

- Floating circular icon positioned at the top-right of product images.
- Always visible (ensuring ease of touch), with smooth heart fill and pulse animation upon activation.

---

## 6. Mobile-First Layout Rules (360px Baseline)

All layouts are constructed mobile-first:

1. **Zero Horizontal Scroll:** Tested rigorously down to `360px` screen width. All containers use `max-width: 100%`, `overflow-x: hidden` on the root body, and responsive CSS grid auto-fit configurations.
2. **Media Queries:** Strict `min-width` progression (`640px`, `768px`, `1024px`, `1240px`). Never use descending desktop-first `max-width` overrides.
3. **Touch Target Size:** Interactive elements (buttons, quantity toggles, search inputs) maintain a minimum clickable area of `44px x 44px`.
4. **Touch-Friendly Drawer:** Cart slide-over accommodates narrow screens with 100% viewport width below `480px` and fixed `420px` width on wider viewports.

---

## 7. Accessibility (A11y) & Semantic Structure

- **Heading Hierarchy:** Strictly one single `<h1>` on the page (`Autumn Essentials`), logically followed by `<h2>` for major sections and `<h3>` for cards/footer columns.
- **Accessible Inputs:** Every `<input>` and `<select>` is paired with a corresponding `<label for="...">`. Non-visual labels use `.visually-hidden` rather than `display: none` to remain fully accessible to screen readers.
- **Dynamic Content:** The product catalog grid uses `aria-live="polite"` so screen readers are informed when filter or search results change without interrupting current speech.
- **Modal Semantics:** The wardrobe bag drawer utilizes `aria-hidden="true|false"`, background scroll locking (`overflow: hidden`), and `Escape` key capture.
