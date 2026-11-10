# Test Strategy

How the Al Safwa Fabrics website is tested in every phase. Results for each phase go in `docs/reports/phase-N/03_TEST_REPORT.md`.

## 1. How to run the tests

All commands run from `web/`.

| Command | What it does | Needs |
|---|---|---|
| `npm test` | Unit + component tests (Vitest, ~2 s) | nothing |
| `npm run build` then `npm run test:e2e` | Browser tests against the **production build** (Playwright) | a build; Playwright starts `next start` on port 3100 by itself |
| `npm run test:all` | Lint → type-check → unit → build → browser tests. **Run this before every hand-over** (the ENGINEERING TESTS step of the lifecycle rule). | — |
| `npx playwright show-report test-results/e2e-report` | Opens the HTML report of the last browser run, with traces for failures | — |

First time on a new machine: `npm install` and `npx playwright install chromium`.

## 2. Test layers

| Layer | Folder | Tool | Point of view | What it proves |
|---|---|---|---|---|
| Unit | `tests/unit/*.test.ts` | Vitest | Developer | Filters, validation, WhatsApp links, SEO text, JSON-LD, request parsing, content integrity |
| Component | `tests/unit/*.test.tsx` | Vitest + Testing Library | Buyer (simulated) | The inquiry form: errors, focus, MOQ rule, quote/sample switch, success and failure states |
| End to end | `tests/e2e/` | Playwright, **360 px phone** and **1366 px desktop** | Buyer | Every page and journey in a real browser on the production build |
| No JavaScript | `tests/e2e/no-javascript.spec.ts` | Playwright with JS off | Old phones, crawlers | NFR-05: pages and filters work without JavaScript |
| Accessibility | `tests/e2e/accessibility.spec.ts` | axe-core (WCAG 2.2 A/AA) | Buyers of every age and ability | No serious or critical violations; errors announced; skip link |
| SEO / GEO | `tests/e2e/seo.spec.ts` | Playwright | Google, Bing, AI assistants | Sitemap, robots, llms.txt, JSON-LD, canonicals, titles, alt text |
| Security | `tests/security/` | Playwright request API | **Attacker** | API abuse, injection, oversize bodies, mass assignment, prototype pollution, headers, CSP, leaked files |
| Performance | Lighthouse 12 (mobile) | Lighthouse CLI | Buyer on a mid-range phone, slow 4G | NFR-01 / NFR-05 scores (recorded in the test report) |

## 3. Requirement coverage

Each PRD requirement in scope has at least one automated test; the test names include the PRD ID (e.g. `(FR-07)`). Requirement → test map:

| PRD ID | Test |
|---|---|
| FR-01 | `buyer-journeys` filters; `no-javascript` filters; `unit/filters` |
| FR-02, FR-04 | `buyer-journeys` "specs as real text"; `no-javascript` specs |
| FR-05 | `buyer-journeys` guides ↔ fabrics; `unit/content-integrity` |
| FR-06 | `pages` (visible on every page); `buyer-journeys` (fabric name in message); `unit/seo-and-links` |
| FR-07, FR-08, FR-09 | `buyer-journeys` quote / sample / contact; `unit/inquiry-form`; `unit/validation` |
| FR-11 | `phase1-gaps` G5 (PDF type, header, page count, links) |
| FR-12 | `unit/qr`; `phase1-gaps` G6 |
| FR-14 | `unit/content-integrity` slugs; `unit/seo-and-links` |
| FR-15 | `pages` unique titles; `seo` category title + canonical; `unit/seo-and-links` |
| FR-16 | `seo` sitemap + robots |
| FR-17 | `seo` alt text |
| FR-19 | `pages` NAP on every page; `buyer-journeys` contact NAP |
| FR-20 | `seo` Organization / LocalBusiness / Product / FAQPage; `unit/seo-and-links` |
| FR-21 | `buyer-journeys` FAQ; `seo` FAQ schema matches page |
| FR-22 | `seo` llms.txt |
| FR-23 | `unit/security-config` (analytics switches, CSP); `phase1-gaps` G8 (no third-party requests when off) |
| NFR-02 | every E2E test runs at 360 px; `pages` no sideways scroll |
| NFR-03 | `buyer-journeys` 1 tap and 2 taps from Home |
| NFR-05 | `no-javascript` |
| NFR-06 | `tests/security/*` (incl. `rate-limit.spec`); `unit/parse-request`; `unit/security-config` |

## 4. Security testing plan across phases

| Phase | Target | Method |
|---|---|---|
| 1 (done) | Public pages + `POST /api/inquiries` | Automated attack tests (`tests/security`), mutation check that the CSP test catches a real violation, `npm audit` |
| 2 | Admin login, admin API, uploads, orders & payments | OWASP Top 10 round 1: brute-force & rate limit, session fixation/timeout, auth bypass on every admin route, IDOR on orders/inquiries, SQL/NoSQL injection via Prisma inputs, stored XSS through admin fields, CSRF on server actions, file-upload abuse (type spoofing, oversize, SVG script, path traversal), reused transaction ID (PAY-05), price/amount tampering. Every finding gets an automated regression test. |
| 3 | Production Docker stack behind Cloudflare | OWASP Top 10 round 2 on the live-like stack: TLS/HSTS, header check, exposed ports, Docker image scan, backup restore drill, dependency audit |

Rule: a security bug is fixed only together with a test that fails before the fix and passes after it.
