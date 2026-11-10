# Test Report: Phase 1, Public Website Frontend

| | |
|---|---|
| Date | 2026-10-26 |
| Build tested | Production build (`next build` + `next start`), Next.js 16.4.3 |
| Browsers | Chromium 156: Pixel 7 at 360 × 780 px, and Desktop Chrome at 1366 × 900 px |
| Strategy | `docs/testing/TEST_STRATEGY.md` |

## 1. Final results

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | ✅ 0 errors, 0 warnings |
| Type-check | `npm run typecheck` | ✅ 0 errors |
| Unit + component | `npm test` | ✅ **57 / 57 passed** (6 files) |
| Production build | `npm run build` | ✅ 28 routes; all pages static except the filtered catalogue and the API |
| Browser tests (E2E, no-JS, accessibility, SEO, security) | `npm run test:e2e` | ✅ **156 passed, 0 failed**, 2 skipped on purpose (phone-menu test runs on phone only; skip-link keyboard test on desktop only) |
| Dependency audit | `npm audit --omit=dev` | ✅ 0 vulnerabilities |

## 2. Lighthouse (mobile, slow-4G simulation, local machine)

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 100 | 2.1 s | 0 | 30 ms |
| `/fabrics` | 99 | 100 | 100 | 100 | 2.3 s | 0 | 30 ms |
| `/fabrics/cotton-twill-180-gsm` | 99 | 100 | 100 | 100 | 2.3 s | 0 | 30 ms |
| `/how-to-order` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 30 ms |
| `/about` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 30 ms |
| `/blog` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 30 ms |
| `/blog/what-is-gsm-fabric-weight-guide` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 30 ms |
| `/faq` | 99 | 100 | 100 | 100 | 2.0 s | 0 | 30 ms |
| `/contact` | 94–98 | 100 | 100 | 100 | 2.2–2.7 s | 0 | 90–150 ms |

PRD targets: Performance ≥ 90 ✅ on every page. SEO = 100 ✅ on every page. CLS < 0.1 ✅. LCP < 2.5 s ✅ on 8 of 9 pages; `/contact` varies between 2.2 and 2.7 s across local runs, because Google Maps loads about 450 KB of third-party script. The official NFR-01 measurement is taken on the live Cloudflare stack in Phase 3. Local runs vary by about ±0.5 s.

## 3. Defects found by testing, and fixed

Every defect below was found by a test or by the design review, fixed, and is now guarded by an automated test.

| # | Found by | Defect | Severity | Fix | Guarded by |
|---|---|---|---|---|---|
| 1 | Manual check (curl) | Unknown fabric/guide URLs returned **200** instead of 404 ("soft 404", bad for SEO) because the app shell streamed before `notFound()` | High | `ensureStatic = "navigation"` on dynamic pages, so unknown slugs wait for the full render | `pages.spec` "real 404" |
| 2 | Design review at 360 px | Fabric page **scrolled sideways on phones**: the photo row widened its grid column | High | `min-w-0` on the gallery | `pages.spec` "no sideways scrolling" (all pages) |
| 3 | E2E (strict locator) | Floating WhatsApp button was **in the HTML twice**: a Suspense fallback plus a hidden streamed copy. Without JavaScript, the fabric-named version never showed. | Medium | Server-rendered button; the fabric page adds a fabric-named one and CSS `:has()` hides the general one | `pages.spec`, `no-javascript.spec`, `buyer-journeys` FR-06 |
| 4 | axe | WhatsApp green with white text was **4.4:1**, below WCAG AA 4.5:1 | Medium | Colour changed to `#107A40` (5.4:1); brand guide updated | `accessibility.spec` |
| 5 | axe | Logo link's spoken name did not match its visible text | Low | Removed the override; the visible "Al Safwa Fabrics" is the name | `accessibility.spec` |
| 6 | axe | Scrollable comparison table in guides not reachable by keyboard | Medium | Table wrapper is a labelled, focusable region | `accessibility.spec` |
| 7 | E2E | **"Order sample" did not switch the form to sample mode**: `next/link` changes the hash without firing `hashchange` | High | In-page buttons are native anchors | `buyer-journeys` FR-08 |
| 8 | Component test | Empty name field said "Name is too short" instead of "Please enter your name" | Low | Separate "required" and "too short" rules | `unit/inquiry-form`, `unit/validation` |
| 9 | Lighthouse + DevTools | **CSP violation** on pages with a form: Zod probes `eval` | Medium | `z.config({ jitless: true })` | `security/headers.spec` "no CSP violations"; mutation-checked (removing the fix makes 2 tests fail) |
| 10 | Lighthouse | Contact page LCP hurt by the Google Map loading early on phones | Low | Map moved below the form | Lighthouse (manual) |
| 11 | Design review | On phones, the open filter panel pushed results a full screen down when arriving from a category | Medium | Panel starts closed; the active-filter badge and chips stay visible | Manual review |
| 12 | Design review | Display font's old-style numerals made "100" look like "IOO" | Low | Lining numerals for headings | Manual review |
| 13 | Design review | Hero swatch fan overflowed the screen at 360 px | Low | Hidden below 640 px (MOQ is already in the heading) | `pages.spec` no sideways scroll |
| 14 | Owner (external browser) | **Styles and fonts did not load** when the site was opened by IP address (e.g. a phone on Wi-Fi): the CSP directive `upgrade-insecure-requests` rewrote CSS and font URLs to `https://`, which a plain-http server cannot serve | High | Directive removed. HTTPS is enforced by Cloudflare "Always Use HTTPS" + HSTS in Phase 3. | Manual check on localhost, 127.0.0.1 and LAN IP; add a LAN-host E2E run in Phase 3 |

Defects in the **test suite itself**, also fixed: two attack tests sent JSON-encoded strings instead of raw bytes, so they could not prove what they claimed (now use `Buffer`); one no-JS test expected the wrong heading for a two-filter URL.

## 4. Security testing (attacker's view)

Target: everything public in Phase 1, meaning the pages and `POST /api/inquiries`.

| Attack | Expected | Result |
|---|---|---|
| GET / PUT / DELETE / PATCH on the API | 405 | ✅ |
| Form-encoded or `text/plain` body (CSRF-style "simple" request) | 415 | ✅ |
| Malformed JSON | 400, no stack trace | ✅ |
| 50 KB body; streamed body with no Content-Length; lying Content-Length | 413 before reading it all | ✅ |
| Extra fields (`status`, `isAdmin`): mass assignment | 422 | ✅ |
| `__proto__` key: prototype pollution | 422 | ✅ |
| Wrong types (`123`, arrays, `{ $ne: "" }`, `null`) | 422 | ✅ |
| XSS, SQL, template and path payloads | 422; payload never echoed back | ✅ |
| MOQ bypass (meters = 1, browser check skipped) | 422 | ✅ |
| Honeypot filled by a bot | Same 202 as a real user (bot learns nothing) | ✅ |
| Caching of API responses | `Cache-Control: no-store` | ✅ |
| Security headers on pages, API and sitemap | CSP, nosniff, DENY framing, referrer, permissions, HSTS; no `X-Powered-By` | ✅ |
| CSP violations on any page | None | ✅ |
| Reading `/.env`, `/.env.local`, `/package.json`, `/next.config.ts`, `/.git/config` | 404 | ✅ |
| JSON-LD script-tag breakout (`</script>`) | Escaped | ✅ (unit) |

**Open security items** (accepted for Phase 1, scheduled):

| Item | Risk now | Fixed in |
|---|---|---|
| No rate limiting or Turnstile on `/api/inquiries` | Low in Phase 1: nothing is stored or emailed, so flooding has no effect. Becomes High once Phase 2 stores and emails. | Phase 2 (before persistence ships) |
| CSP allows inline scripts (`'unsafe-inline'`) | Low. Statically prerendered pages cannot carry per-request nonces, and the site renders no user-supplied HTML. Re-assessed when admin rich text arrives (AD-05). | Re-assess in Phase 2 |
| HTTPS / TLS | Not applicable locally | Phase 3 (Cloudflare) |

## 5. Not tested in Phase 1

Admin, database, email, uploads, orders and payments (Phase 2); real-device testing on low-end Android and iPhone, and Lighthouse on the live domain (Phase 3).

---

## 6. Iteration 2 (gap review, 2026-10-27)

| Check | Result |
|---|---|
| Lint, type-check | ✅ |
| Unit + component | ✅ **70 / 70** |
| Production build | ✅ 35 routes |
| Browser tests | ✅ **201 passed**, 0 failed, 2 skipped on purpose |
| Dependency audit | ✅ 0 vulnerabilities |
| Lighthouse (mobile, local) | `/` 99·100·100·100 · `/fabrics?use=shirts` 99·100·100·100 · `/contact` 96·100·100·100 |

New security tests: rate limit (11th submission → 429 with Retry-After, junk counted, other clients unaffected), security headers on the PDF and QR responses. The open item "No rate limiting" from §4 is **closed**; Turnstile remains for Phase 2. Details: `05_GAP_REVIEW_POST_IMPLEMENTATION.md`.
