# Al Safwa Fabrics Website: Implementation & Phase Plan

| | |
|---|---|
| Source of scope | `docs/prd/PRD.md` (PRD dated Oct 25, 2026). **Nothing outside it is built without written owner approval.** |
| Plan owner | Altan Haider |
| Last updated | 2026-10-26 |
| Current phase | **Phase 1: Public website frontend.** Gap-review iteration 2 is engineering-tested; **waiting for owner testing and approval.** |
| Progress tracker | `docs/plan/IMPLEMENTATION_CHECKLIST.md` (every item, its status and approval) |

---

## 0. Development Lifecycle Rule

**Development Lifecycle Rule:** `PLAN → IMPLEMENT → ENGINEERING TESTS → UPDATE CHECKLIST → REPORT → STOP → USER TESTS → USER APPROVES → NEXT PHASE`.
> Progression between phases requires explicit user review and approval. Never advance automatically.

| Step | Who | What it means here | Output |
|---|---|---|---|
| PLAN | Engineering | Read the PRD, list the requirements in scope, design, test plan, risks | Pre-implementation report |
| IMPLEMENT | Engineering | Build only what the plan lists | Code |
| ENGINEERING TESTS | Engineering (senior tester role) | `npm run test:all` (lint, type-check, unit, build, browser tests on phone + desktop, accessibility, no-JS, SEO, security attacks) + Lighthouse | Test results |
| UPDATE CHECKLIST | Engineering | Mark every item in `IMPLEMENTATION_CHECKLIST.md` with its real status and evidence | Checklist |
| REPORT | Engineering | Post-implementation report + test report | Reports |
| **STOP** | — | Engineering stops. No further work, and nothing from the next phase starts. | — |
| USER TESTS | Owner | Owner tests the site on a phone and a computer, using the checklist's "How to test" notes | Owner feedback |
| USER APPROVES | Owner | Owner approves in writing (in chat), or lists changes. Changes go back to PLAN. | Approval recorded in the checklist (§0) and change log |
| NEXT PHASE | Engineering | Only after written approval | — |

Rules:
- A status in the checklist moves **Not started → In progress → Engineering-tested → User-approved**. Only the owner can set *User-approved*.
- A phase is closed only when every one of its checklist items is *User-approved* or explicitly *Deferred* by the owner.
- Gaps found inside a phase that is not yet approved are fixed inside that phase (iteration), with their own pre/post report.

---

## 1. How every piece of work is done (SDLC per change)

Each phase, and every later improvement, goes through the same six steps. Nothing moves to the next step until the current one is done.

| # | SDLC step | What happens | Output (stored in the repo) |
|---|---|---|---|
| 1 | **Requirements** | Pick the PRD IDs (FR / AD / PAY / NFR) being delivered. Note gaps as Open Questions; never fill gaps by guessing. | Pre-implementation report §1–2 |
| 2 | **Design** | UI design, data shapes, file locations, test plan, risks. | Pre-implementation report §3–6 |
| 3 | **Implementation** | Code in small, reviewable pieces. No placeholder logic, dead code or unused dependencies. | Source code |
| 4 | **Testing** | Unit, component, end-to-end, accessibility, no-JavaScript, security tests. Results are recorded, including failures. | `docs/testing/` + test report |
| 5 | **Review & release** | Lint, type-check, production build, owner review. | Post-implementation report |
| 6 | **Maintenance** | Defects and change requests are logged and go back to step 1. | Change log (§7) |

Report templates: `docs/reports/templates/`. Each phase gets its own folder: `docs/reports/phase-N/`.

### Change control

A request that is not in the PRD is logged in §7 as a Change Request (CR) with status *Proposed*. It is built only after the owner marks it *Approved*. The one exception: a small addition without which a PRD feature cannot work at all (e.g. CR-01) may be built, but it is logged as a CR, flagged in the post-implementation report, and removed if the owner rejects it.

---

## 2. Phases at a glance

| Phase | Name | Goal | Status |
|---|---|---|---|
| 1 | Public website frontend | All public pages final in design and behaviour, SEO/GEO foundations, PDF catalogue + QR codes, form rate limiting, analytics-ready, test suite | **Engineering-tested; STOP: awaiting owner tests and approval** |
| 2 | Backend & admin module | Database, owner admin, inquiries saved and emailed, PDF/QR/feed, orders and manual payments | Not started |
| 3 | Security, performance & launch | Penetration testing and fixes, Lighthouse targets on the live stack, VPS + Cloudflare, analytics, backups, go-live | Not started |

### Phase 1: Public website frontend
- **In scope:** Home, Catalogue (with all six filters), Fabric detail, How to Order, About, Blog index + article, FAQ, Contact. Header, footer with NAP, floating WhatsApp button with fabric-aware message. Quote / sample / contact forms with validation, posting to `/api/inquiries`. Metadata, sitemap, robots, JSON-LD, `llms.txt`. Design system from the logo. Test suite.
- **Data source in Phase 1:** typed content files in `web/src/content/`, read only through the `web/src/server/` data layer. Phase 2 swaps the data layer to PostgreSQL. Pages do not change.
- **Added in iteration 2 (gap review, 2026-10-27):** use-category pages, PDF catalogue (FR-11) and QR codes (FR-12) generated from the single data layer, rate limiting on the inquiry API (NFR-06), analytics/verification code switched on by environment variables (FR-23), WhatsApp on the global 404, WhatsApp number on Contact, "Weave / knit" label. See `docs/reports/phase-1/04_GAP_REVIEW_PRE_IMPLEMENTATION.md`.
- **Known Phase-1 limit:** `/api/inquiries` validates submissions, but saving them and emailing sales (FR-10) is Phase 2. **The site must not go live before Phase 2.**
- **Exit criteria:** all Phase-1 rows in §4 are Done or Partial with a reason; lint, type-check and build pass; all automated tests pass; owner has reviewed the pages on a phone.

### Phase 2: Backend & admin module
- PostgreSQL + Prisma schema for fabrics, colours, media, categories, uses, blog, FAQ, inquiries, settings, orders, payments, redirects.
- Auth.js credentials login for one owner (AD-01) and the admin screens AD-02 to AD-10, plus Orders and Payment settings.
- Inquiries saved and emailed (FR-10), Turnstile + rate limiting on public forms (NFR-06).
- R2 media uploads with WebP compression (FR-03, FR-17, AD-02).
- Admin catalogue tools: regenerate the PDF, download a QR per fabric, product feed for WhatsApp/Meta (AD-09, FR-13; the feed needs prices and photos, OQ-04/OQ-06). The PDF and QR generators themselves are built in Phase 1.
- On publish: revalidate pages and sitemap, IndexNow (AD-10, §9). Slug change → 301 (AD-03).
- Orders & manual payments PAY-01 to PAY-08 (needs answer to OQ-02).
- **Testing at end of Phase 2:** API and admin security test round 1 (OWASP Top 10: auth bypass, IDOR, injection, XSS, CSRF, file-upload abuse, reused TID, rate limits). Findings fixed and re-tested before Phase 3.

### Phase 3: Security, performance & launch
- Security test round 2 against the production-like Docker stack behind Cloudflare; fix and re-test.
- Lighthouse on the live stack: Performance ≥ 90, SEO = 100, LCP < 2.5 s, CLS < 0.1, INP < 200 ms (NFR-01, NFR-05).
- Docker on a Hetzner/DigitalOcean VPS, Cloudflare DNS/SSL/cache, canonical `www` host with 301 (§8).
- Create GA4, Search Console and Bing Webmaster accounts, set their IDs as environment variables (the code is built in Phase 1), submit the sitemap (FR-23). Rich Results Test (NFR-07).
- Set `CLIENT_IP_HEADER=cf-connecting-ip` and allow only Cloudflare IPs to reach the server, so the rate limiter cannot be bypassed (NFR-06).
- Daily database backup (NFR-09). Owner acceptance test. Go-live.

---

## 3. Project structure

The PRD (§8) requires **one Next.js codebase** for frontend and backend. Inside it, the frontend and the backend are kept in separate folders, the way Next.js projects are normally organised:

```
Safwa_Website/
├── docs/                      Project documents (PRD, brand, SEO, plan, testing, reports)
└── web/                       The one Next.js + Node.js application
    ├── public/brand/          Logo files
    ├── src/
    │   ├── app/               ROUTES (Next.js App Router)
    │   │   ├── (site)/        Public pages: /, /fabrics, /fabrics/[slug], /how-to-order, /about, /blog, /faq, /contact
    │   │   ├── api/           BACKEND HTTP endpoints (e.g. /api/inquiries)
    │   │   ├── sitemap.ts, robots.ts, llms.txt/   SEO files
    │   │   └── layout.tsx, globals.css, fonts.ts  Root layout + design tokens
    │   ├── components/        FRONTEND UI
    │   │   ├── layout/        Header, footer, WhatsApp button, mobile menu
    │   │   ├── ui/            Buttons, section headings, ornaments
    │   │   ├── fabric/        Fabric cards, swatches, spec table, gallery, filters
    │   │   ├── forms/         Inquiry form
    │   │   └── seo/           JSON-LD output
    │   ├── server/            BACKEND logic (server-only): data access, inquiry service
    │   │   ├── catalog/       Fabric queries, filtering, related items
    │   │   ├── content/       Blog and FAQ queries
    │   │   ├── inquiries/     Inquiry request parsing and validation
    │   │   ├── catalogue/     PDF catalogue and QR codes (FR-11, FR-12)
    │   │   └── security/      Rate limiting (NFR-06)
    │   ├── content/           Phase-1 content source (replaced by PostgreSQL in Phase 2)
    │   ├── config/            Site settings (NAP, WhatsApp number, navigation), security headers, analytics switches
    │   ├── lib/               Shared helpers (validation schemas, SEO builders, WhatsApp links)
    │   └── types/             TypeScript domain types (match PRD §6 fields)
    └── tests/
        ├── unit/              Vitest unit + component tests
        ├── e2e/               Playwright end-to-end tests (mobile 360 px + desktop)
        ├── support/           Shared test helpers
        └── security/          Security tests (headers, API abuse)
```

Phase 2 adds `web/prisma/`, `web/src/server/db/`, `web/src/server/auth/` and `web/src/app/admin/`.

---

## 4. Requirements traceability & tracker

Tracked in **`docs/plan/IMPLEMENTATION_CHECKLIST.md`**: every PRD page, FR, AD, PAY, §6 field and NFR, plus the engineering/operations tasks and owner inputs. Each item shows its phase, engineering status, owner approval and evidence (code + test). The checklist is updated at the **UPDATE CHECKLIST** step of every iteration and is the only status tracker, so it cannot drift from a second copy.

Phase 1 scope after the gap review (iteration 2, 2026-10-27) adds FR-11 (PDF catalogue) and FR-12 (QR codes) generated from the single data layer, use-category pages (FR-15), rate limiting (NFR-06) and analytics-ready code (FR-23). The admin tools for them (AD-09) remain in Phase 2.

---

## 5. Open questions (need the owner's answer; nothing is guessed)

| ID | Question | Blocks | Status |
|---|---|---|---|
| OQ-01 | The logo tagline says **"Premium Abaya Fabrics"**, but the PRD's examples are cotton twill / poly-cotton for shirts, uniforms, kurtas. Which product range should the starter catalogue and copy reflect? | Final catalogue content | Open |
| OQ-02 | (Owner asked about "Add to cart" on 2026-10-27; recommendation (a) quote-first payment link, see CR-02 §B4.) PRD §5 describes a checkout and payment page, but §2 lists no URL for them, and §2's order flow goes through a quote first. Do buyers check out on the website (cart + checkout), or does the owner create an order after the quote and send the buyer a payment link? | PAY-01 to PAY-08 | Open |
| OQ-03 | Real business details: registered name, full address, phone, WhatsApp number, email, social links, map location. | FR-09, FR-19, FR-20 | Open (placeholders in `web/src/config/site.ts`) |
| OQ-04 | Real content: actual fabric list with all §6 fields, photos/video, About story, experience, capacity, delivery times/areas, sample terms. | FR-02, FR-03, About, FAQ | Open (clearly marked starter content) |
| OQ-05 | Domain name (for canonical URLs, sitemap and `llms.txt`). | Phase 3, absolute URLs | Open (`NEXT_PUBLIC_SITE_URL` env var) |
| OQ-06 | Google shows Product rich results (price in search) only when a price is published. Should fabrics show price slabs, or stay "Request quote"? Both are supported. | Rich results for fabrics (NFR-07) | Open |

---

## 6. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Real photos arrive late | Fabric pages look less premium | Woven-texture swatches in brand style until photos exist; photo brief in brand guide |
| Placeholder business details go live | Wrong NAP harms SEO and trust | Placeholders live in one file; Phase-3 launch checklist blocks go-live until replaced |
| Forms not saved in Phase 1 | Lost inquiries if deployed early | Phase 1 is not deployed; post report states this clearly |
| Next.js 16 Cache Components is new | Unexpected caching behaviour | Followed the bundled Next.js 16.4 docs; production build verified |

---

## 7. Change log & change requests

| Date | Type | Item | Status |
|---|---|---|---|
| 2026-10-26 | Phase | Phase 1 pre-implementation report | Done |
| 2026-10-26 | Phase | Phase 1 implementation + tests (57 unit, 156 browser, all passing) | Done (awaiting owner review) |
| 2026-10-26 | Phase | Phase 1 post-implementation report + test report | Done |
| 2026-10-27 | Defect | Production CSP `upgrade-insecure-requests` broke styles on plain-http hosts (LAN/IP); directive removed, HTTPS enforced by Cloudflare + HSTS in Phase 3 | Fixed |
| 2026-10-27 | Process | Development Lifecycle Rule + `IMPLEMENTATION_CHECKLIST.md` added (owner request) | Done |
| 2026-10-27 | Iteration | Phase 1 gap review: G1–G8 (`docs/reports/phase-1/04_…`, `05_…`); 70 unit + 201 browser tests | **Engineering-tested; STOP: waiting for owner** |
| 2026-10-27 | CR-02 | Full swan logo in header and icons; Home menu item; breadcrumbs on all inner pages (`docs/reports/changes/CR-02_LOGO_AND_HOME_NAVIGATION.md`) | **Done (owner requested)**: 57 unit + 180 browser tests passing |
| 2026-10-26 | CR-01 | Phone / WhatsApp number field on all forms (not in FR-07's list; needed so sales can reply) | **Proposed: built, awaiting owner approval** |
