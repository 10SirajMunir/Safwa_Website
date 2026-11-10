# Al Safwa Fabrics — Brand & UI Guidelines

Source: PRD NFR-04 ("consistent brand colours — maroon + gold from logo — and fonts on every page"), NFR-02 (mobile-first, 360 px), NFR-03 (easy to use), and the supplied logo (`logo-original.jpg`).

The code implementation of everything below lives in `web/src/app/globals.css` (design tokens) and `web/src/app/fonts.ts` (fonts). Change the tokens there, never hard-code colours in components.

## 1. Logo

| File | Use |
|---|---|
| `docs/brand/logo-original.jpg` | Master file as supplied (1254 × 1254, gold on maroon). Do not edit. |
| `web/public/brand/al-safwa-swan-mark.png` | Swan mark, transparent background. Header, footer, small placements on maroon. |
| `web/public/brand/al-safwa-fabrics-logo-gold.png` | Full lock-up (swan + "Safwa" + tagline), transparent. Use on maroon only. |
| `web/src/app/icon.png`, `apple-icon.png`, `favicon.ico` | Browser and home-screen icons (swan on maroon). |
| `web/src/app/opengraph-image.jpg` | Link preview image for WhatsApp, Facebook and search (1200 × 630). |

Rules:

- The gold logo is only placed on maroon (`--color-maroon-800` / `#51010C`) or very dark surfaces. Never on ivory: the gold has too little contrast there.
- Keep clear space around the mark equal to the swan's head height.
- Do not recolour, stretch, add shadows or outlines.
- The written business name is **Al Safwa Fabrics** (PRD). The logo tagline reads "Premium Abaya Fabrics" — see Open Question OQ-01 in the implementation plan.

## 2. Colour palette

Sampled from the logo, then extended with neutral tones for readable pages. Contrast ratios are measured against WCAG 2.2 (AA needs 4.5:1 for body text, 3:1 for large text and UI shapes).

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `maroon-900` | `#3A0008` | Deepest surface (footer base, pressed states) | — |
| `maroon-800` | `#51010C` | **Brand maroon** (logo background). Header, footer, primary buttons | Ivory on it: 14.3:1 |
| `maroon-700` | `#6E0F1C` | Button hover, links on light backgrounds | On ivory: 11.2:1 |
| `gold-300` | `#F1DDA8` | Gold highlight text on maroon | — |
| `gold-400` | `#E2BE76` | **Brand gold**. Accents, rules, gold text on maroon | On maroon: 8.7:1 |
| `gold-700` | `#7F5C1C` | Gold-coloured *text* on light backgrounds (eyebrows, labels) | On ivory: ≈5.5:1 |
| `ivory` | `#FAF6EF` | Page background | — |
| `sand` | `#F2EADD` | Alternate section background, cards | — |
| `line` | `#E3D7C4` | Borders, dividers | — |
| `ink` | `#231416` | Body text | On ivory: 16.5:1 |
| `muted` | `#5E4B4E` | Secondary text | On ivory: 7.5:1 |
| `whatsapp` | `#107A40` | WhatsApp button only (darker than WhatsApp's own green so white text passes contrast) | White on it: 5.4:1 |

Usage ratio on a page: about 70 % ivory/sand, 20 % ink text, 10 % maroon, with gold used sparingly as a thin accent (rules, ornaments, small labels). Gold is the jewellery, not the dress.

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Display & headings | **Cormorant Garamond** (500, 600) | High-contrast serif close to the logo's "Safwa" lettering; gives the premium feel. Used only at 24 px and above. |
| Body, UI, specs, forms | **Source Sans 3** (400, 600) | Very legible at small sizes, clear numerals for GSM / width / prices, good for older readers. |

Sizes (mobile → desktop): body 17 px → 18 px, line-height 1.6. H1 36 → 56 px. Minimum text size anywhere is 14 px (fine print only). Numbers in spec tables use tabular figures.

Fonts are self-hosted at build time through `next/font` (no runtime request to Google), which protects performance (NFR-01) and privacy.

## 4. Layout & components

- **Mobile first.** Every screen is designed at 360 px wide first, then widened (NFR-02). Single column on phones, content max width 1200 px on desktop.
- **Tap targets** are at least 48 × 48 px. Buttons have text labels, not icons alone.
- **Header:** maroon bar, swan mark + "Al Safwa Fabrics", menu. On phones, a "Menu" button opens the full navigation.
- **Floating WhatsApp button:** bottom-right on every page, always visible, labelled "WhatsApp" (NFR-02, FR-06).
- **MOQ is always visible** where a buyer decides: home hero, catalogue cards, fabric page header and the How to Order page.
- **Spec tables** use real text (FR-04): label left, value right, tabular numbers.
- **Ornament:** the logo's thin gold rule with a centre diamond is the only decorative motif. No gradients, glows, blobs, glassmorphism or stock "feature icon" grids.
- **Photography direction (for the owner's shoot, FR-03):** natural daylight, neutral background, per fabric: flat lay, drape, texture close-up, one photo per colour; plus a 10–15 s drape video. File names describe the content, e.g. `navy-cotton-twill-180gsm-drape.jpg` (FR-17).

## 5. Voice & copy

- Plain words a busy buyer understands in seconds. Short sentences. Numbers first: "100 m per colour", "180 GSM", "58 in / 147 cm".
- Confident, warm, never salesy. No "elevate", "unleash", "world-class", or exclamation marks.
- Always tell the buyer the next step ("Ask for a quote", "Order a sample", "Message us on WhatsApp").
