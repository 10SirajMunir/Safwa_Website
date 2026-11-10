# Post-Implementation Report: Phase 1 Gap Review (iteration 2)

| | |
|---|---|
| Date | 2026-10-27 |
| Pre-implementation report | `04_GAP_REVIEW_PRE_IMPLEMENTATION.md` |
| Lifecycle step | **REPORT → STOP.** Waiting for **USER TESTS → USER APPROVES**. |
| Tracker | `docs/plan/IMPLEMENTATION_CHECKLIST.md` (updated) |

## 1. Summary

A full re-read of the PRD found eight Phase-1 gaps. All eight are implemented and engineering-tested. The site now has a downloadable PDF catalogue and a QR code per fabric (both generated from the same data as the website), category pages for every *use* as well as every fabric type, rate limiting on the inquiry form, and analytics/verification code that switches on when the owner's IDs are set. Smaller PRD-alignment fixes: WhatsApp on the global 404, the WhatsApp number on Contact, and the "Weave / knit" label.

## 2. Gap status

| Gap | PRD | Status | What was built | Evidence |
|---|---|---|---|---|
| G1 | FR-06 | ✅ | Floating WhatsApp button on the site-wide 404 page | `app/not-found.tsx` · e2e `phase1-gaps` G1 |
| G2 | FR-15, AD-04 | ✅ | `/fabrics?use=…` pages: own H1 ("Fabrics for shirts"), title, description, self-canonical, breadcrumb; 5 use URLs added to the sitemap (23 URLs in total) | `server/catalog/filters.ts` `categoryOf`, `lib/seo.ts` · unit + e2e G2, `seo` |
| G3 | PRD §2 Contact | ✅ | Contact shows "WhatsApp +92 …" from the single setting; also in `llms.txt` and the PDF | `lib/whatsapp.ts` `formatWhatsAppNumber` · unit + e2e G3 |
| G4 | PRD §6 | ✅ | Spec label "Weave / knit" (website and PDF) | e2e G4 |
| G5 | FR-11, NFR-08 | ✅ | `/al-safwa-fabrics-catalogue.pdf`, 9 A4 pages: brand cover, how to order, one page per fabric (every §6 field, colour swatches with codes, QR + link), contact. Brand fonts embedded. Rendered once and served from cache (not per request). Download links on the catalogue page and in the footer. | `server/catalogue/catalogue-pdf.tsx`, `app/al-safwa-fabrics-catalogue.pdf/route.ts` · e2e G5 |
| G6 | FR-12 | ✅ | `/fabrics/<slug>/qr.svg` (brand maroon, error correction M), prerendered for each fabric, 404 for unknown slugs; the same QR is printed in the PDF | `server/catalogue/qr.ts` · unit `qr`, e2e G6 |
| G7 | NFR-06 | ✅ | 10 submissions per client per 10 minutes, then `429` + `Retry-After` and a message pointing to WhatsApp. Junk requests count too. Memory bounded to 10,000 clients. Client IP header configurable for Cloudflare. | `server/security/rate-limit.ts` · unit `security-config`, security e2e `rate-limit` |
| G8 | FR-23 | ✅ (code) | GA4 loads only with `NEXT_PUBLIC_GA_MEASUREMENT_ID`; Search Console and Bing meta only with their codes. IDs are format-checked so they cannot inject code. The CSP opens Google Analytics origins only when GA is on. Today: no third-party requests at all. | `config/analytics.ts`, `config/security.ts`, `components/analytics/` · unit + e2e G8 |

## 3. Deliberately not built (and why)

| Item | Reason | When |
|---|---|---|
| FR-13 product feed | WhatsApp/Meta catalogues reject items without a **price** and an **image**. Prices are quote-only (OQ-06) and photos do not exist yet (OQ-04). | Phase 2, after OQ-04 and OQ-06 are answered |
| Turnstile | Needs Cloudflare site keys | Phase 2 |
| Admin buttons to regenerate the PDF / download QR (AD-09) | Admin is Phase 2; the generators they will call are ready | Phase 2 |
| Payments / cart | Explained in CR-02 §B4; blocked on OQ-02 | Phase 2 |

## 4. Engineering test results

| Check | Result |
|---|---|
| Lint | ✅ 0 problems |
| Type-check | ✅ |
| Unit + component | ✅ **70 / 70** (was 57; +13: categories, WhatsApp number format, rate limiter incl. memory bound, IP extraction, CSP with/without analytics, HSTS, analytics ID validation, QR) |
| Production build | ✅ 35 routes; PDF and QR codes are static |
| Browser tests (phone 360 px + desktop): E2E, no-JS, accessibility, SEO, security | ✅ **201 passed**, 0 failed, 2 skipped on purpose (was 180; +21) |
| Lighthouse (mobile, local) | `/` 99/100/100/100 · `/fabrics?use=shirts` 99/100/100/100 · `/contact` 96/100/100/100 (LCP 2.6 s, Google Map; unchanged) |
| PDF visual check | All 9 pages rendered and reviewed |

### Defects found and fixed during this iteration

| # | Found by | Defect | Fix |
|---|---|---|---|
| 1 | Build output review | The PDF route was **dynamic**: every download would re-render the PDF, a CPU-heavy job that could be abused to load the server | Generation cached (`use cache`); the route is now static |
| 2 | PDF visual review | Cormorant's old-style numerals printed "180" like "18o" in PDF headings (PDF renderer has no font-feature support) | Numbers in PDF headings set in Source Sans |
| 3 | Test design | The new rate limiter would have throttled the test suite itself, making results unreliable | Each attack test runs as its own client address; a dedicated test proves the limit |
| 4 | Lint | ESLint's React-hooks rule misread Playwright's fixture callback as a hook | Callback renamed |

## 5. Security notes

- The rate limiter trusts the client-IP header named by `CLIENT_IP_HEADER`. Locally this is `x-forwarded-for`, which a client can set itself. **In production (Phase 3) it must be `cf-connecting-ip` with the server reachable only through Cloudflare.** This is recorded as checklist item EN-16.
- The PDF and QR codes use `NEXT_PUBLIC_SITE_URL`. Until the domain is set (OQ-05, EN-17), their links point to `localhost`.
- No new third-party requests. `npm audit --omit=dev`: **0 vulnerabilities** (including the new PDF and QR libraries).

## 6. Owner testing guide (USER TESTS step)

Open http://localhost:8080 (or http://192.168.8.15:8080 on your phone) and check:

1. **Catalogue → "Download PDF catalogue"**: the PDF opens with a cover, how-to-order page, one page per fabric and a contact page. Scan a QR code with your phone camera; it opens that fabric (on the same Wi-Fi it needs the real domain, so this works fully after launch).
2. **Home → "Uniforms"** (under "Or by what you are making"): the page heading says "Fabrics for uniforms".
3. **Contact**: the WhatsApp number is listed.
4. **Any wrong address** (e.g. `/abc`): the WhatsApp button is there.
5. **A fabric page**: "Weave / knit" in the specifications.
6. Then reply **"Phase 1 approved"**, or list the changes you want. Nothing in Phase 2 starts before that.
