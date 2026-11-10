# Al Safwa Fabrics: Website

The website for Al Safwa Fabrics, a fabric supplier in Pakistan (MOQ 100 m per colour). One Next.js + Node.js codebase, built in three phases from the approved PRD.

| Phase | Scope | Status |
|---|---|---|
| 1 | Public website frontend | Engineering-tested (iteration 2); **waiting for owner tests and approval** |
| 2 | Backend & admin module | Not started |
| 3 | Security, performance & launch | Not started |

## Where things are

| Path | Contents |
|---|---|
| `docs/prd/PRD.md` | The PRD, which is the scope of record |
| `docs/plan/IMPLEMENTATION_PLAN.md` | Development Lifecycle Rule, phase plan, open questions, change log |
| `docs/plan/IMPLEMENTATION_CHECKLIST.md` | **Tracker for everything**: status and owner approval of every PRD item and launch task |
| `docs/brand/` | Logo master file and brand & UI guidelines (colours, fonts, components) |
| `docs/seo/` | SEO and AI-search rules, mapped to code |
| `docs/testing/TEST_STRATEGY.md` | How testing works and how to run it |
| `docs/reports/phase-N/` | Pre-implementation, post-implementation and test reports per phase |
| `docs/reports/templates/` | Report templates for future changes |
| `web/` | The application (see the structure in the implementation plan §3) |

## Run it

Requires Node.js 20.9 or newer.

```bash
cd web
npm install
npx playwright install chromium   # once, for browser tests
npm run dev                       # development: http://localhost:3000
npm run build && npm start        # production build
npm run test:all                  # lint, type-check, unit, build, browser tests
```

Environment variables (all optional until launch):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Real domain for canonical URLs, sitemap, structured data, `llms.txt`, PDF and QR codes |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Turns on Google Analytics 4 (FR-23) |
| `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` | Search Console / Bing Webmaster verification tags (FR-23) |
| `CLIENT_IP_HEADER` | Header used for rate limiting; `cf-connecting-ip` in production behind Cloudflare |

`NEXT_PUBLIC_SITE_URL` (for example `https://www.example.com`) sets the canonical domain used in the sitemap, robots, structured data and `llms.txt`. Defaults to `http://localhost:3000`.

## Before going live

- Phase 2 must be complete (form submissions are not stored or emailed in Phase 1).
- Replace the placeholder business details in `web/src/config/site.ts` (moves to the admin in Phase 2).
- Review all content marked `STARTER CONTENT` or `confirm` in `web/src/content/`.
