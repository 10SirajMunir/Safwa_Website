# Pre-Implementation Report: Phase 1, Public Website Frontend

| | |
|---|---|
| Date | 2026-10-26 |
| Phase | 1 of 3 |
| Author | Altan Haider (with Claude Code) |
| PRD | `docs/prd/PRD.md` |

## 1. Requirements in scope

| ID | "Done" means |
|---|---|
| Pages §2 | Home, `/fabrics`, `/fabrics/[slug]`, `/how-to-order`, `/about`, `/blog` + `/blog/[slug]`, `/faq`, `/contact` render as server HTML |
| FR-01 | Catalogue filters for fabric type, GSM, composition, width, colour and use. Combine filters, clear them, work without JavaScript (GET form). |
| FR-02 | Fabric page shows every PRD §6 field |
| FR-03 | Gallery with the photo types (flat, drape, texture close-up, per colour) and a video slot. Real media arrive with the owner's shoot / Phase 2 uploads. |
| FR-04 | GSM, composition, width, MOQ as HTML text |
| FR-05 | Related fabrics + related guides on fabric pages; related fabrics on articles |
| FR-06 | Floating WhatsApp button on every page; message includes fabric name on fabric pages |
| FR-07 | Quote form fields: name, business, city, fabric, colours, meters, with validation |
| FR-08 | "Order Sample" button on each fabric page |
| FR-09 | Contact form + Google Map embed |
| FR-14 | Clean slugs |
| FR-15 | Unique title / description / H1 per fabric and per catalogue type (auto-filled) |
| FR-16 | `sitemap.xml`, `robots.txt` |
| FR-17 | `next/image` with AVIF/WebP; descriptive `alt` |
| FR-18 | Blog index with categories; article pages |
| FR-19 | NAP from one config, shown in footer + contact |
| FR-20 | JSON-LD Organization, LocalBusiness, Product, FAQPage |
| FR-21 | Direct-answer FAQ |
| FR-22 | `/llms.txt` |
| NFR-02, 03, 04, 05 | 360 px first; ≤ 2 taps to a fabric; brand palette + fonts; readable without JS |

## 2. Out of scope & open questions

Out of scope for Phase 1 (per plan): admin (`/admin`, AD-01 to AD-10), database, saving + emailing inquiries (FR-10), PDF / QR / feed (FR-11 to FR-13), orders & payments (PAY-*), Turnstile and rate limiting, analytics (FR-23), hosting.

Open questions OQ-01 to OQ-05 are listed in the implementation plan §5. Until answered:

- Business details are **clearly marked placeholders** in `web/src/config/site.ts`.
- The starter catalogue uses **only the PRD's own examples** (Cotton Twill AS-201, 180 GSM, 58"/147 cm, 100% cotton and 65/35 poly-cotton, twill/plain/satin, peach/mercerised, shirts/uniforms/kurtas/trousers/home textile). Prices are shown as "Request quote" (a PRD option), so no prices are invented.
- FAQ and About copy state only facts given in the PRD (MOQ, payment methods). Anything else is marked for owner confirmation.

## 3. Design

**Visual direction.** Editorial and calm, like a good fabric-house sample book: ivory pages, maroon header/footer, gold used as thin rules and small labels only, large serif headings, generous spacing, real spec tables. No gradients, blob shapes, glass effects or icon-card grids. Full rules in `docs/brand/BRAND_GUIDELINES.md`.

**Key screens (mobile first, 360 px):**

| Screen | Structure |
|---|---|
| Home | Maroon hero with one sentence on what we sell + MOQ "100 m per colour" + two buttons (Browse fabrics, WhatsApp). Fabric types as large tappable rows. Featured fabrics. How to order in 6 steps (short). FAQ preview. |
| Catalogue | Heading + count. "Filter" panel (collapsible on phone, sidebar on desktop) as a GET form. Fabric cards: swatch texture, name, code, GSM, width, composition, MOQ. |
| Fabric detail | Name + code, key specs chip row (GSM, width, composition, MOQ), "Request quote" + "Order sample" buttons high on the page. Gallery. Colours with codes. Full spec table. Properties, care, lead time, price. Inquiry form. Related fabrics + guides. |
| How to order | Six numbered steps from PRD §2, MOQ panel, payment methods named in PRD §5. |
| FAQ | Questions as `<details>` (work without JS). |
| Contact | NAP block, WhatsApp/phone/email buttons, map, inquiry form. |

**Data shapes.** `web/src/types/` mirrors PRD §6 one-to-one (code, slug, composition, gsm, widthInches/widthCm, weave, finish, colours[{name, code, hex}], moq, uses[], properties{stretch, shrinkage, colourFastness, feel}, care, availability{type, dispatchDays}, price{slabs[] | quote}, media[], seo{title, description}). Phase 2's Prisma schema will use the same fields so pages do not change.

**Backend in Phase 1.** `POST /api/inquiries`: accepts JSON only, size-limited, validated with the same Zod schema the form uses. Returns 422 with field errors or 202 Accepted. Persistence + email arrive in Phase 2.

## 4. Approach & dependencies

| Dependency | Why |
|---|---|
| Next.js 16.4, React 19, TypeScript, Tailwind CSS 4 | PRD §8 (from scaffold) |
| `zod` | One validation schema shared by form and API (security + consistency) |
| Vitest, Testing Library, jsdom | Unit and component tests |
| Playwright, `@axe-core/playwright` | End-to-end tests from the buyer's view, mobile + desktop, accessibility |

Decisions:
- Cache Components (Next 16 default) stays on. Pages are prerendered; the catalogue's filter results read `searchParams` inside `<Suspense>`.
- Fonts self-hosted through `next/font` (Cormorant Garamond + Source Sans 3).
- Security headers (CSP, frame, referrer, permissions, content-type) set in `next.config.ts`.

## 5. Test plan

| Layer | Tool | Covers |
|---|---|---|
| Unit | Vitest | Slugs, filters, WhatsApp link builder, validation schema, SEO builders, JSON-LD |
| Component | Vitest + Testing Library | Inquiry form validation and submit states, fabric card |
| E2E (buyer view) | Playwright: Pixel-like 360 px + desktop Chrome | Every page loads with one H1 and unique title; ≤ 2 taps Home → fabric; filters; fabric specs as text; WhatsApp link has fabric name; quote + sample + contact forms; FAQ; 404 |
| No-JavaScript | Playwright with JS disabled | Pages and filters still work (NFR-05) |
| Accessibility | axe-core | No serious/critical violations on every page |
| SEO | Playwright request tests | sitemap, robots, llms.txt, JSON-LD parses, canonical tags |
| Security (frontend + API) | Playwright request tests | Security headers; API rejects wrong method, wrong content type, oversized body, malformed JSON, invalid fields, script injection in fields, unknown fields |

## 6. Risks

See plan §6. Phase-specific: real photos missing (texture swatches used), placeholder NAP (one file, flagged), form not saving (not deployed in Phase 1).

## 7. Exit criteria

- [ ] All pages built and reviewed at 360 px and desktop
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` pass
- [ ] `npm run test` (unit) and `npm run test:e2e` pass
- [ ] Post-implementation report and test report written, tracker updated
