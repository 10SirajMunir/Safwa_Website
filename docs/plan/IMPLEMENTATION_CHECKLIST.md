# Implementation Checklist

The single tracker for **everything** in the Al Safwa Fabrics system: every PRD requirement, page, admin feature, payment rule, non-functional target, and the engineering, operations and owner tasks needed to launch.

| | |
|---|---|
| Source of scope | `docs/prd/PRD.md` |
| Process | `docs/plan/IMPLEMENTATION_PLAN.md` §0, Development Lifecycle Rule |
| Last updated | 2026-10-27 (after Phase 1 gap review, iteration 2) |

**Development Lifecycle Rule:** `PLAN → IMPLEMENT → ENGINEERING TESTS → UPDATE CHECKLIST → REPORT → STOP → USER TESTS → USER APPROVES → NEXT PHASE`.
> Progression between phases requires explicit user review and approval. Never advance automatically.

### How to read this checklist

| Column | Meaning |
|---|---|
| **Engineering** | ⬜ Not started · 🔄 In progress · ✅ Done and engineering-tested · 🟡 Partly done (reason in Notes) · ⛔ Blocked (open question) · ➖ Not applicable this phase |
| **Owner** | ⏳ Waiting for owner test · ✔️ **Approved by owner** · ✖️ Changes requested · ➖ Nothing to approve yet. *Only the owner can mark ✔️.* |
| **Evidence** | Where it is built and which automated test proves it |

---

## 0. Phase gates

| Phase | Engineering | Owner approval | Date approved | Notes |
|---|---|---|---|---|
| 1 · Public website frontend | ✅ Engineering-tested (iteration 2) | ⏳ **Waiting: owner to test and approve** | — | STOP point. No Phase 2 work until approved in writing. |
| 2 · Backend & admin | ⬜ | ➖ | — | Starts only after Phase 1 approval |
| 3 · Security, performance & launch | ⬜ | ➖ | — | Starts only after Phase 2 approval |

---

## 1. Pages (PRD §2)

| ID | Item | Phase | Engineering | Owner | Evidence / notes |
|---|---|---|---|---|---|
| P-01 | Home `/`: clear message, top categories, MOQ highlight, WhatsApp | 1 | ✅ | ⏳ | `app/(site)/page.tsx` · e2e `buyer-journeys`, `pages` |
| P-02 | Fabric Catalogue `/fabrics` with filters | 1 | ✅ | ⏳ | `app/(site)/fabrics/page.tsx` · e2e filters, no-JS |
| P-03 | Category pages: by fabric type `/fabrics?type=…` and by use `/fabrics?use=…` | 1 | ✅ | ⏳ | Iteration 2 added use pages · e2e `phase1-gaps` G2 |
| P-04 | Fabric detail `/fabrics/[slug]` | 1 | ✅ | ⏳ | e2e specs, quote, sample, WhatsApp |
| P-05 | How to Order `/how-to-order` | 1 | ✅ | ⏳ | e2e six steps + MOQ + payment methods |
| P-06 | About `/about` | 1 | 🟡 | ⏳ | Layout done; story, experience, capacity, stock/warehouse photos need owner content (OQ-04) |
| P-07 | Blog / Fabric Guide `/blog` + `/blog/[slug]` | 1 | ✅ | ⏳ | 3 starter guides need owner review |
| P-08 | FAQ `/faq` | 1 | 🟡 | ⏳ | Delivery and sample answers need owner confirmation (OQ-04) |
| P-09 | Contact `/contact`: phone, WhatsApp, email, address, map, form | 1 | 🟡 | ⏳ | Built (WhatsApp number added in iteration 2); real details needed (OQ-03) |
| P-10 | Page not found (404) with header, footer, WhatsApp | 1 | ✅ | ⏳ | Real 404 status · e2e `pages`, `phase1-gaps` G1 |
| P-11 | Admin panel `/admin` (noindex) | 2 | ⬜ | ➖ | `robots.txt` already blocks `/admin` |
| P-12 | Order payment page (Order ID, method, TID, receipt) | 2 | ⛔ | ➖ | PRD gives no URL/entry point: **OQ-02** (recommendation: quote-first payment link) |

## 2. Functional requirements (PRD §3)

| ID | Requirement | Phase | Engineering | Owner | Evidence / notes |
|---|---|---|---|---|---|
| FR-01 | Catalogue filters: type, GSM, composition, width, colour, use | 1 | ✅ | ⏳ | `server/catalog/filters.ts` · unit `filters` · e2e + no-JS |
| FR-02 | One detail page per fabric with all §6 fields | 1 | ✅ | ⏳ | e2e "specs as real text" |
| FR-03 | Photos (flat, drape, texture, every colour), 4–6 + video | 1 → 2 | 🟡 | ⏳ | Gallery supports all; woven-texture stand-ins until the owner's photo shoot; uploads in Phase 2 (AD-02) |
| FR-04 | Specs as real text | 1 | ✅ | ⏳ | e2e + no-JS |
| FR-05 | Internal links fabrics ↔ guides | 1 | ✅ | ⏳ | e2e "guides link to fabrics" |
| FR-06 | Floating WhatsApp on every page, fabric name in message | 1 | ✅ | ⏳ | e2e `pages`, `phase1-gaps` G1, `buyer-journeys` |
| FR-07 | Request-a-quote form | 1 | ✅ | ⏳ | UI + validation + API · saving is FR-10 |
| FR-08 | "Order Sample" button | 1 | ✅ | ⏳ | e2e sample mode |
| FR-09 | Contact form + Google Map | 1 | ✅ | ⏳ | e2e contact |
| FR-10 | Submissions saved + sales emailed | 2 | ⬜ | ➖ | Needs PostgreSQL + Resend/Brevo. **Site must not go live before this.** |
| FR-11 | Downloadable PDF catalogue | 1 | ✅ | ⏳ | `/al-safwa-fabrics-catalogue.pdf` (iteration 2) · e2e G5. Regenerate button is AD-09 (Phase 2). |
| FR-12 | QR code per fabric linking to its page | 1 | ✅ | ⏳ | `/fabrics/<slug>/qr.svg` + printed in PDF (iteration 2) · unit `qr`, e2e G6. Admin download is AD-09 (Phase 2). |
| FR-13 | Product feed for WhatsApp Business / Facebook / Instagram | 2 | ⛔ | ➖ | Meta/WhatsApp feeds require a **price and an image** per item: **OQ-06** (prices) + **OQ-04** (photos) |
| FR-14 | Clean URLs | 1 | ✅ | ⏳ | unit `content-integrity` |
| FR-15 | Unique title, description, H1 per fabric and category | 1 | ✅ | ⏳ | Auto-filled; types + uses (iteration 2) · e2e `seo`, G2 |
| FR-15b | …editable by staff | 2 | ⬜ | ➖ | AD-03 |
| FR-16 | XML sitemap + robots.txt | 1 | ✅ | ⏳ | e2e `seo` (23 URLs) |
| FR-17 | Image compression, descriptive names / alt | 1 → 2 | 🟡 | ⏳ | AVIF/WebP via `next/image`, alt everywhere; upload naming pipeline in Phase 2 |
| FR-18 | Blog with categories (2–4 articles/month) | 1 → 2 | 🟡 | ⏳ | Pages + 3 categories done; publishing editor AD-05 (Phase 2) |
| FR-19 | Same NAP everywhere from one setting | 1 | ✅ | ⏳ | `config/site.ts` · e2e NAP on every page. Values are placeholders (OQ-03) |
| FR-20 | JSON-LD Organization, LocalBusiness, Product, FAQ | 1 | ✅ | ⏳ | e2e `seo` |
| FR-21 | Direct-answer FAQ | 1 | ✅ | ⏳ | e2e FAQ |
| FR-22 | `llms.txt` | 1 | ✅ | ⏳ | e2e `seo` |
| FR-23 | GA4, Search Console, Bing Webmaster from day one | 1 → 3 | 🟡 | ⏳ | **Code ready** (iteration 2): switched on by `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`. Accounts + IDs at launch (Phase 3). |
| FR-24 | Owner-only admin module | 2 | ⬜ | ➖ | |

## 3. Admin module (PRD §4)

| ID | Feature | Phase | Engineering | Owner |
|---|---|---|---|---|
| AD-01 | Secure owner login: hashed password, session timeout, login rate limit, optional 2FA | 2 | ⬜ | ➖ |
| AD-02 | Fabrics CRUD + colours/swatches + photo/video upload (WebP) | 2 | ⬜ | ➖ |
| AD-03 | SEO fields + editable slug with automatic 301 | 2 | ⬜ | ➖ |
| AD-04 | Categories and uses manager | 2 | ⬜ | ➖ |
| AD-05 | Blog editor (rich text, cover, related fabrics) | 2 | ⬜ | ➖ |
| AD-06 | FAQ manager (add, edit, reorder) | 2 | ⬜ | ➖ |
| AD-07 | Inquiries list, status New/Contacted/Closed, CSV export | 2 | ⬜ | ➖ |
| AD-08 | Site settings (NAP, WhatsApp, email, social) | 2 | ⬜ | ➖ |
| AD-09 | Catalogue tools: regenerate PDF, download QR, export feed | 2 | ⬜ | ➖ |
| AD-10 | Publish = live (revalidate pages + sitemap in seconds) | 2 | ⬜ | ➖ |
| AD-11 | Orders screen (filter, view receipt, confirm/reject, dispatch) | 2 | ⛔ | ➖ |
| AD-12 | Payment settings screen (wallets, QR, bank, COD, fee, advance) | 2 | ⛔ | ➖ |

## 4. Payments (PRD §5)

| ID | Requirement | Phase | Engineering | Owner | Notes |
|---|---|---|---|---|---|
| PAY-01 | Unique Order ID (e.g. SF-1042) | 2 | ⛔ | ➖ | All PAY items wait for **OQ-02** (flow) |
| PAY-02 | COD / Easypaisa / JazzCash / Bank, each switchable | 2 | ⛔ | ➖ | |
| PAY-03 | Payment page shows account details, QR, amount, Order ID | 2 | ⛔ | ➖ | |
| PAY-04 | Submit TID / reference + receipt upload (JPG/PNG/PDF) | 2 | ⛔ | ➖ | |
| PAY-05 | Same TID cannot be reused | 2 | ⛔ | ➖ | |
| PAY-06 | Owner email for every order and payment | 2 | ⛔ | ➖ | |
| PAY-07 | Optional COD fee + advance % above a set amount | 2 | ⛔ | ➖ | |
| PAY-08 | Dispatch only after confirmation | 2 | ⛔ | ➖ | |
| PAY-09 | Automatic gateway | — | ➖ | ➖ | Out of scope for v1 (PRD) |
| PAY-10 | Order statuses (Awaiting payment → … → Delivered, Cancelled; COD path) | 2 | ⛔ | ➖ | |

## 5. Fabric catalogue fields (PRD §6)

| Field | Engineering | Owner | Notes |
|---|---|---|---|
| Name & code, slug | ✅ | ⏳ | |
| Composition | ✅ | ⏳ | |
| GSM | ✅ | ⏳ | |
| Width (inches + cm) | ✅ | ⏳ | |
| Weave / knit & finish | ✅ | ⏳ | Label aligned with PRD in iteration 2 |
| Colours: name, code, swatch | ✅ | ⏳ | Swatch photos come with the shoot |
| MOQ (default 100) | ✅ | ⏳ | |
| Recommended uses (multi, also a filter) | ✅ | ⏳ | |
| Properties (stretch, shrinkage, fastness, feel) | ✅ | ⏳ | |
| Care instructions | ✅ | ⏳ | |
| Lead time & availability | ✅ | ⏳ | |
| Price slabs (PKR) or quote flag | ✅ | ⏳ | All starter fabrics are "Request quote" (OQ-06) |
| Media (4–6 photos + video) | 🟡 | ⏳ | See FR-03 |
| SEO title / description (auto) | ✅ | ⏳ | |
| **Real catalogue data** | ⛔ | ➖ | Starter data from PRD examples only; owner's real list needed (OQ-01, OQ-04) |

## 6. Non-functional requirements (PRD §7)

| ID | Target | Phase | Engineering | Owner | Evidence / notes |
|---|---|---|---|---|---|
| NFR-01 | Mobile Lighthouse ≥ 90; LCP < 2.5 s; CLS < 0.1; INP < 200 ms | 1 → 3 | 🟡 | ⏳ | Local: Performance 96–99 everywhere, CLS 0; LCP < 2.5 s except `/contact` (2.2–2.7 s, Google Map). Official run on the live stack in Phase 3. |
| NFR-02 | 360 px first; WhatsApp always visible | 1 | ✅ | ⏳ | Every e2e test runs at 360 px; no sideways scroll |
| NFR-03 | Max 2 taps Home → fabric | 1 | ✅ | ⏳ | e2e 1-tap and 2-tap paths; Home menu + breadcrumbs (CR-02) |
| NFR-04 | Brand colours + fonts on every page | 1 | ✅ | ⏳ | `globals.css`, brand guide; PDF uses the same fonts |
| NFR-05 | Lighthouse SEO = 100; readable without JS | 1 | ✅ | ⏳ | SEO 100 on all pages; no-JS e2e |
| NFR-06 | HTTPS; admin protected; forms rate-limited + spam-protected | 1 → 3 | 🟡 | ⏳ | Done: headers, CSP, validation, honeypot, **rate limit (iteration 2)**. Phase 2: Turnstile, admin auth. Phase 3: HTTPS + Cloudflare-only origin. |
| NFR-07 | Valid sitemap/robots; schema passes Rich Results Test | 1 → 3 | 🟡 | ⏳ | Built + tested; Rich Results Test needs the live URL |
| NFR-08 | One data source feeds website, PDF, QR, WhatsApp/Meta | 1 → 2 | 🟡 | ⏳ | Website, PDF, QR from one data layer ✅; feed in Phase 2 (FR-13) |
| NFR-09 | Owner edits without code; daily DB backup | 2 → 3 | ⬜ | ➖ | |

## 7. Engineering, testing and operations

| ID | Item | Phase | Engineering | Owner | Notes |
|---|---|---|---|---|---|
| EN-01 | Project structure (one Next.js codebase, frontend/backend folders) | 1 | ✅ | ⏳ | Plan §3 |
| EN-02 | Design system from the logo (tokens, fonts, components) | 1 | ✅ | ⏳ | `docs/brand/` |
| EN-03 | Logo assets (full swan mark, icons, OG image) | 1 | ✅ | ⏳ | CR-02 fixed the cut-off swan |
| EN-04 | Security headers + CSP (+ analytics origins only when on) | 1 | ✅ | ⏳ | unit `security-config`, e2e headers + CSP violations |
| EN-05 | Unit + component tests | 1 | ✅ | — | 70 tests |
| EN-06 | Browser tests: phone + desktop, no-JS, accessibility, SEO | 1 | ✅ | — | 201 passing |
| EN-07 | Security attack tests (API abuse, rate limit, leaks) | 1 | ✅ | — | `tests/security/` |
| EN-08 | Lighthouse audit | 1 | ✅ | — | Test report |
| EN-09 | PostgreSQL + Prisma schema, migrations | 2 | ⬜ | ➖ | |
| EN-10 | Cloudflare R2 media storage | 2 | ⬜ | ➖ | |
| EN-11 | Email (Resend or Brevo) | 2 | ⬜ | ➖ | |
| EN-12 | Cloudflare Turnstile on forms | 2 | ⬜ | ➖ | |
| EN-13 | IndexNow on publish | 2 | ⬜ | ➖ | |
| EN-14 | Security test round 1 (OWASP Top 10, admin + payments) | 2 | ⬜ | ➖ | |
| EN-15 | Docker image + VPS (Hetzner/DigitalOcean) | 3 | ⬜ | ➖ | Include `@fontsource` font files in the image (PDF) |
| EN-16 | Cloudflare DNS, SSL, cache; canonical `www` + 301; origin locked to Cloudflare; `CLIENT_IP_HEADER=cf-connecting-ip` | 3 | ⬜ | ➖ | |
| EN-17 | `NEXT_PUBLIC_SITE_URL` set to the real domain at build (sitemap, schema, llms.txt, **PDF QR codes**) | 3 | ⬜ | ➖ | Today they point to localhost |
| EN-18 | Daily database backup + restore drill | 3 | ⬜ | ➖ | NFR-09 |
| EN-19 | Security test round 2 on the production stack | 3 | ⬜ | ➖ | |
| EN-20 | Lighthouse + Rich Results Test on the live domain | 3 | ⬜ | ➖ | NFR-01, NFR-07 |
| EN-21 | Real-device testing (low-end Android, iPhone) | 3 | ⬜ | ➖ | |
| EN-22 | Go-live | 3 | ⬜ | ➖ | Owner approval required |

## 8. Owner inputs needed (open questions)

| ID | Needed from owner | Blocks | Status |
|---|---|---|---|
| OQ-01 | Product range: "Premium Abaya Fabrics" (logo) vs cotton/poly-cotton (PRD) | Real catalogue | Open |
| OQ-02 | Payment flow: (a) quote-first payment link (recommended) or (b) cart + checkout | PAY-01–10, P-12, AD-11/12 | Open |
| OQ-03 | Real NAP: business name, address, phone, WhatsApp, email, social, map location | FR-09, FR-19, FR-20 | Open |
| OQ-04 | Real content: fabric list with all §6 fields, photos/video, About story, delivery and sample terms | FR-02, FR-03, About, FAQ | Open |
| OQ-05 | Domain name | EN-16, EN-17 | Open |
| OQ-06 | Show prices (slabs) or "Request quote" only | FR-13, Product rich results | Open |
| CR-01 | Approve the Phone/WhatsApp field on forms | FR-07 | Waiting for approval |
| CR-02 | Logo + Home navigation | NFR-03, NFR-04 | Done; waiting for owner test |
| GA/GSC/Bing IDs | Analytics and verification codes | FR-23 | Phase 3 |

## 9. History

| Date | Event |
|---|---|
| 2026-10-26 | Phase 1 built and engineering-tested (57 unit, 156 browser tests) |
| 2026-10-27 | CSP fix for plain-http hosts; CR-02 logo + navigation (180 browser tests) |
| 2026-10-27 | Phase 1 gap review, iteration 2: G1–G8 implemented (70 unit, 201 browser tests). **STOP: waiting for owner tests and approval.** |
