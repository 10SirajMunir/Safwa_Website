# SEO & AI-Search (GEO) Guidelines

Every rule here traces to the PRD (sections 1, 3, 5, 6, 7). The "Where in code" column points to the implementation so the rule can be checked.

## 1. Goals (PRD §1)

1. Rank on page one of Google in Pakistan for fabric, supplier and GSM searches.
2. Be recommended by AI assistants (ChatGPT, Gemini, Perplexity, Copilot) for queries such as "best fabric supplier in Pakistan with low MOQ".
3. Keep catalogue facts identical on the website, WhatsApp Business catalogue and Facebook/Instagram shop (NFR-08).

## 2. Rules

| ID | Rule | Where in code | Phase |
|---|---|---|---|
| FR-14 | Clean, lowercase, hyphenated URLs: `/fabrics/cotton-twill-180-gsm`. Slug = fabric name + GSM. | `src/lib/slug.ts`, `src/app/(site)/fabrics/[slug]` | 1 |
| FR-15 | Each fabric and category page has a unique `<title>`, meta description and one `<h1>`. Auto-filled from fabric fields; editable by the owner in admin. | `src/lib/seo.ts`, `generateMetadata` in each page | 1 (auto) / 2 (editable) |
| FR-16 | `/sitemap.xml` lists every public page, fabric and article; `/robots.txt` allows all public pages, blocks `/admin` and `/api`, links the sitemap. | `src/app/sitemap.ts`, `src/app/robots.ts` | 1 |
| FR-17 | Images are compressed and served as WebP/AVIF by `next/image`; file names and `alt` text describe colour + fabric + GSM. | `src/components/fabric/*`, `next.config.ts` | 1 / 2 (upload pipeline) |
| FR-04 | GSM, composition, width and MOQ are always real HTML text, never only in images. | `src/components/fabric/spec-table.tsx` | 1 |
| FR-05 | Every fabric links to related fabrics and guides; every guide links to the fabrics it mentions. | `src/server/catalog/related.ts` | 1 |
| FR-18 | Blog / Fabric Guide with categories; built to publish 2–4 articles a month. | `src/app/(site)/blog` | 1 (pages) / 2 (editor) |
| FR-19 | Business Name, Address, Phone are identical everywhere and come from one setting. | `src/config/site.ts` → admin settings in Phase 2 | 1 |
| FR-20 | JSON-LD: `Organization` + `LocalBusiness` (site-wide), `Product` (each fabric), `FAQPage` (FAQ page). | `src/lib/structured-data.ts`, `src/components/seo/json-ld.tsx` | 1 |
| FR-21 | FAQ answers are direct and complete in the first sentence ("Our MOQ is 100 meters per colour."). | `src/content/faq.ts` | 1 |
| FR-22 | `/llms.txt` summarises the business, MOQ, payment methods and key pages in plain Markdown for AI crawlers. | `src/app/llms.txt/route.ts` | 1 |
| NFR-05 | Every page is server-rendered HTML and readable with JavaScript turned off. Lighthouse SEO = 100. | Server Components by default; E2E test `no-javascript.spec.ts` | 1 |
| NFR-07 | Sitemap and robots valid; structured data passes Google Rich Results Test. | E2E `seo.spec.ts`; manual Rich Results Test before launch | 1 / 3 |
| FR-23 | GA4, Google Search Console and Bing Webmaster Tools connected from launch day. | Phase 3 (needs owner's accounts + live domain) | 3 |
| §9 | On publish, revalidate affected pages and sitemap; notify Bing via IndexNow. | Phase 2 | 2 |
| §8 | One canonical host (`www.<domain>.com`); the other host 301-redirects to it. | Cloudflare + `metadataBase` | 3 |

## 3. Writing a fabric page (checklist)

- Title pattern: `{Fabric name} {GSM} GSM – {Composition} | Al Safwa Fabrics` (≤ 60 characters where possible).
- Description pattern: `{Fabric} {GSM} GSM, {width}" wide, {composition}. MOQ {moq} m per colour. {n} colours, {availability}. Request a quote on WhatsApp.` (≤ 160 characters).
- One H1 = the fabric name + GSM.
- All section 6 fields filled; at least 4 photos with descriptive names; every colour has a swatch with its colour code.
- Link to at least one related guide.

## 4. Writing a guide article (checklist)

- Answers one buyer question in the first paragraph (AI assistants quote the opening).
- Uses real numbers (GSM, widths, MOQ) as text.
- Links to the fabrics it discusses.
- Has a category: **GSM guides**, **Fabric comparisons** or **Fabric uses** (PRD §2: "GSM guide, fabric comparisons, uses").
