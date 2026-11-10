# Pre-Implementation Report: Phase 1 Gap Review (iteration 2)

| | |
|---|---|
| Date | 2026-10-27 |
| Phase | 1 (not yet approved by the owner, so gaps are closed inside Phase 1) |
| Trigger | Owner request: re-read the whole PRD, find anything missing that belongs to Phase 1, and implement it |
| Lifecycle step | **PLAN** (`PLAN → IMPLEMENT → ENGINEERING TESTS → UPDATE CHECKLIST → REPORT → STOP → USER TESTS → USER APPROVES → NEXT PHASE`) |

## 1. Method

Every line of `docs/prd/PRD.md` (§1–§9) was compared with the running code and the Phase 1 scope rule: *everything a buyer, a search engine or an AI crawler sees on the public site, plus anything that can be built from the single data source without the database or admin*. Items that need the database, admin, file uploads, email, payment storage or the live domain stay in Phase 2/3.

## 2. Audit result: gaps found

| Gap | PRD source | What is missing | Why it is Phase 1 |
|---|---|---|---|
| **G1** | FR-06 "WhatsApp button on **every** page" | The site-wide 404 page (unknown URLs like `/abc`) has no WhatsApp button | Public page |
| **G2** | FR-15 "Unique title, meta description and H1 for every fabric page and **category**"; AD-04 "fabric types and **recommended uses** … drive the catalogue filters" | Fabric *types* have category pages (`/fabrics?type=cotton`), but *uses* (`/fabrics?use=shirts`, linked from Home) show the generic "Fabric catalogue" title and H1, point the canonical to `/fabrics`, and are missing from the sitemap | SEO for public pages |
| **G3** | PRD §2 Contact: "Phone, **WhatsApp**, email, address, Google Map, inquiry form" | The contact page has a WhatsApp *button* but does not show the WhatsApp *number* as text | Public page content |
| **G4** | PRD §6 field "**Weave / knit** & finish" | The spec table labels the field "Weave" | Field naming must match the PRD |
| **G5** | FR-11 "Downloadable PDF catalogue"; NFR-08 "one source of fabric data feeds website, **PDF catalogue**…"; §8 `@react-pdf/renderer` | No PDF catalogue | Buyer-facing download; built from the same data layer, no database needed. The admin "Regenerate" button (AD-09) and regenerate-on-publish (§9) stay in Phase 2. |
| **G6** | FR-12 "QR code for each fabric linking to its page"; §8 `qrcode` | No QR codes | Generated from the slug; shown in the PDF catalogue and at `/fabrics/<slug>/qr.svg`. The admin download button (AD-09) stays in Phase 2. |
| **G7** | NFR-06 "forms **rate-limited** and spam-protected" | `/api/inquiries` has a honeypot but no rate limit (recorded as an open item in the Phase 1 test report) | The endpoint exists now. Turnstile needs Cloudflare keys, so it stays in Phase 2. |
| **G8** | FR-23 "Google Analytics, Search Console and Bing Webmaster Tools connected **from day one**" | No analytics or verification code | Code can be ready now and switched on by setting IDs (environment variables). Creating the accounts and verifying the domain stays in Phase 3. |

## 3. Reviewed and correctly left for later

| PRD item | Phase | Reason |
|---|---|---|
| FR-13 product feed (WhatsApp/Meta) | 2 | Meta and WhatsApp catalogue feeds **require a price and an image per item**. Prices are "Request quote" (OQ-06) and photos do not exist yet (OQ-04). A feed now would be rejected. |
| FR-10, FR-24, AD-01 – AD-10 | 2 | Need the database, login, uploads and email |
| PAY-01 – PAY-08 | 2 | Need orders storage + admin; flow decision OQ-02 pending |
| Turnstile (NFR-06) | 2 | Needs Cloudflare site keys |
| IndexNow, revalidate on publish (§9, AD-10) | 2 | Triggered by admin publishing |
| Canonical host, SSL, GA/GSC/Bing accounts, backups | 3 | Need the live domain and server |
| About "experience, capacity, photos of stock/warehouse"; real fabric photos/video (FR-03) | Owner content | Cannot be invented (OQ-04) |

## 4. Design

| Gap | Design |
|---|---|
| G1 | Global 404 renders the same floating WhatsApp button |
| G2 | A catalogue URL filtered by **only** a type **or only** a use is a category page: own H1 ("Fabrics for shirts"), title, description, self-canonical, breadcrumb, sitemap entry. Any other filter combination keeps the canonical on `/fabrics`. |
| G3 | Contact details list: address, phone, **WhatsApp number**, email. The number comes from the single setting (FR-19). |
| G4 | Label "Weave / knit" |
| G5 | `/al-safwa-fabrics-catalogue.pdf`: A4, brand cover (logo on maroon), "How to order" page (MOQ, steps, payment methods), **one page per fabric** with every §6 field, colour swatches with codes, and the fabric's QR code + link, then a contact page with NAP. Brand fonts are embedded (Cormorant Garamond + Source Sans 3, OFL licence). The PDF is generated at build time from the same data layer, so it is a static file served from cache. Download links on the catalogue page and in the footer, and listed in `llms.txt`. |
| G6 | `/fabrics/<slug>/qr.svg`: SVG QR (error correction M) encoding the fabric's absolute URL, in brand maroon; 404 for unknown slugs. The same QR is printed in the PDF. |
| G7 | Per-client fixed window: **10 submissions per 10 minutes**, answered with `429` + `Retry-After` and a friendly message that points to WhatsApp. The client IP comes from a configurable trusted header (`CLIENT_IP_HEADER`, default `x-forwarded-for`; Phase 3 sets `cf-connecting-ip` and locks the origin to Cloudflare, so the header cannot be spoofed). Memory is bounded. |
| G8 | GA4 loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set; Search Console and Bing verification meta tags only when `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` are set. The CSP opens the Google Analytics origins only when GA is on. With nothing set (today), the site sends nothing to third parties. |

## 5. Dependencies to add

| Package | PRD reference | Why |
|---|---|---|
| `@react-pdf/renderer` | §8 "PDF & QR" | PDF catalogue (FR-11) |
| `qrcode` (+ `@types/qrcode`) | §8 "PDF & QR" | QR codes (FR-12) |
| `@fontsource/cormorant-garamond`, `@fontsource/source-sans-3` | NFR-04 (brand fonts) | Font files embedded in the PDF |

## 6. Test plan

| Gap | Tests |
|---|---|
| G1 | E2E: WhatsApp button visible on an unknown URL |
| G2 | Unit: category detection; E2E: `/fabrics?use=shirts` has its own H1, title, canonical and breadcrumb; sitemap contains use pages |
| G3 | E2E: contact shows the WhatsApp number |
| G4 | E2E: spec label "Weave / knit" |
| G5 | E2E: PDF returns `application/pdf`, valid `%PDF` header, one page per fabric + cover + order + contact pages, contains fabric codes; download link present on catalogue page and footer |
| G6 | E2E: QR SVG for a known slug; 404 for unknown. Unit: QR decodes to the fabric URL. |
| G7 | Unit: limiter windows, reset, memory bound, IP extraction. E2E security: 11th request from the same client gets 429 + Retry-After; another client is unaffected. |
| G8 | Unit: CSP with and without analytics; E2E: no third-party analytics request or tag when IDs are unset |

All existing tests (lint, type-check, 57 unit, 180 browser) must still pass.

## 7. Exit criteria

All 8 gaps implemented and tested → checklist updated → post-implementation report → **STOP** for owner testing and approval. No Phase 2 work starts without written approval.
