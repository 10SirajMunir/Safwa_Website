# Al Safwa Fabrics: web application

The Next.js (App Router) + Node.js application. Project documentation lives in `../docs/`; start with `../README.md` and `../docs/plan/IMPLEMENTATION_PLAN.md`.

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` · `npm run typecheck` | Static checks |
| `npm test` | Unit + component tests (Vitest) |
| `npm run test:e2e` | Browser tests on the production build (Playwright; run `npm run build` first) |
| `npm run test:all` | Everything above, in order |

Code layout: `src/app` routes (public pages in `(site)/`, backend endpoints in `api/`), `src/components` UI, `src/server` server-only data access and request handling, `src/content` Phase-1 content (replaced by PostgreSQL in Phase 2), `src/config` site settings, `src/lib` shared helpers, `src/types` domain types, `tests/` unit, e2e and security tests.
