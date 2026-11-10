# Al Safwa Fabrics — Website PRD

Oct 25, 2026 · Altan Haider

> This is a faithful Markdown copy of the approved PRD (PDF, 11 pages). It is the single source of truth for scope.
> Nothing outside this document is built unless the owner approves it in writing (see `docs/plan/IMPLEMENTATION_PLAN.md` → Change control).

## 1. Purpose & Scope

The website is Al Safwa Fabrics' 24/7 salesperson: it must look premium but stay very simple, so any buyer understands the fabric, the MOQ and how to order within seconds, especially on mobile.

**Website goals (from the client requirement)**

- Every fabric has its own page with complete details, to build trust, cut repeated WhatsApp questions, and give Google and AI engines exact facts.
- When a buyer in Pakistan searches for a fabric, supplier or GSM, Al Safwa Fabrics appears on the first page of Google.
- AI assistants (ChatGPT, Gemini, Perplexity, Copilot) recommend Al Safwa for queries like "best fabric supplier in Pakistan with low MOQ".
- The same catalogue information appears consistently on the website, WhatsApp Business catalogue and Facebook/Instagram shop.

**Primary audience:** fabric buyers in Pakistan, mostly browsing on phone. MOQ is 100 meters per colour.

## 2. Pages

| Page | URL | Purpose (client requirement) |
|---|---|---|
| Home | `/` | Clear message, top fabric categories, MOQ highlight (100 m per colour), WhatsApp button |
| Fabric Catalogue | `/fabrics` | All fabrics with filters: fabric type, GSM, composition, width, colour, use |
| Fabric detail (one per fabric) | `/fabrics/cotton-twill-180-gsm` | Full specs, photos, colours, MOQ, "Request Quote" and "Order Sample" |
| How to Order / MOQ | `/how-to-order` | Simple steps: choose fabric > colours > quantity > quote > payment > dispatch |
| About Us | `/about` | Story, experience, capacity, quality checks, photos of stock/warehouse |
| Blog / Fabric Guide | `/blog/[slug]` | SEO articles: GSM guide, fabric comparisons, uses |
| FAQ | `/faq` | MOQ, delivery, payment, samples, colour matching (also helps AI search) |
| Contact | `/contact` | Phone, WhatsApp, email, address, Google Map, inquiry form |
| Admin panel (added) | `/admin` | Owner-only admin module (section 4); not public, `noindex` |

## 3. Functional Requirements & Features

| ID | Feature / requirement | Source |
|---|---|---|
| **Catalogue** | | |
| FR-01 | Catalogue lists all fabrics with filters: fabric type, GSM, composition, width, colour, use | Sec 3 |
| FR-02 | One detail page per fabric showing all catalogue fields (section 6 of this PRD) | Sec 3, 4 |
| FR-03 | Fabric photos: flat, drape, texture close-up and every colour; 4–6 photos + short drape/texture video | Sec 3, 4 |
| FR-04 | Specs (GSM, composition, width, MOQ) shown as real text on the page, not only inside images | Sec 6 |
| FR-05 | Internal links between related fabrics and guides | Sec 5 |
| **Inquiry & ordering** | | |
| FR-06 | Floating WhatsApp button on every page with a pre-filled message including the fabric name | Sec 3 |
| FR-07 | Request-a-quote form: name, business, city, fabric, colours, meters | Sec 3 |
| FR-08 | "Order Sample" button on each fabric page | Sec 3 |
| FR-09 | Contact page inquiry form + Google Map | Sec 3 |
| FR-10 | Form submissions are saved and sales is notified by email | Added |
| FR-11 | Downloadable PDF catalogue | Sec 3 |
| FR-12 | QR code for each fabric linking to its page | Sec 3 |
| FR-13 | Catalogue data exportable to WhatsApp Business catalogue and Facebook/Instagram shop (product feed) | Sec 4 |
| **SEO** | | |
| FR-14 | Clean URLs, e.g. `/fabrics/cotton-twill-180-gsm` | Sec 5 |
| FR-15 | Unique title, meta description and H1 for every fabric page and category, editable by staff | Sec 5 |
| FR-16 | Auto-generated XML sitemap and robots.txt | Sec 5 |
| FR-17 | Image compression and descriptive image names / alt text, e.g. `navy-cotton-twill-180gsm.jpg` | Sec 5 |
| FR-18 | Blog / Fabric Guide with categories, supporting 2–4 articles per month | Sec 3, 5 |
| FR-19 | Same business Name, Address, Phone (NAP) on every page (footer + contact), from one setting | Sec 5 |
| **AI search (GEO)** | | |
| FR-20 | Structured data (JSON-LD): Organization, LocalBusiness, Product and FAQ schema | Sec 6 |
| FR-21 | FAQ page with direct Q&A, e.g. "What is your MOQ?", "Do you deliver across Pakistan?" | Sec 3, 6 |
| FR-22 | `llms.txt` file summarising the business and key pages (optional) | Sec 6 |
| **Analytics & admin** | | |
| FR-23 | Google Analytics, Search Console and Bing Webmaster Tools connected from day one | Sec 3, 5, 6 |
| FR-24 | Owner-only admin module to manage all site content and inquiries without a developer (section 4) | Added |

## 4. Admin Module (Owner)

Version 1 has one admin user, the owner, and a custom admin module at `/admin` instead of a full multi-user CMS. Everything the public site shows is managed from here.

| ID | Admin feature |
|---|---|
| AD-01 | Secure login for one owner account: hashed password, session timeout, login rate limit, optional 2FA |
| AD-02 | Fabrics: add, edit, hide or delete a fabric with all fields in section 6; add colours with swatch images; upload photos and video (auto-compressed to WebP) |
| AD-03 | SEO fields per fabric, category and blog post: title, meta description, URL slug (auto-filled, editable); changing a slug creates a 301 redirect automatically |
| AD-04 | Categories and uses: manage fabric types and recommended uses that drive the catalogue filters |
| AD-05 | Blog / Fabric Guide: write, edit and publish posts with a rich text editor, cover image and related fabrics |
| AD-06 | FAQ: add, edit and reorder questions; feeds the FAQ page and FAQ schema |
| AD-07 | Inquiries: list of quote, sample and contact submissions (date, buyer, business, city, fabric, colours, meters) with status New / Contacted / Closed and CSV export |
| AD-08 | Site settings: business name, address, phone, WhatsApp number, email, social links; one place feeds NAP, schema and the WhatsApp button |
| AD-09 | Catalogue tools: regenerate the PDF catalogue, download a QR code per fabric, export a product feed for WhatsApp Business / Facebook / Instagram |
| AD-10 | Publish = live: saving refreshes the affected pages and sitemap within seconds |

Staff accounts, roles, drafts and version history are out of scope for v1; the module is built so they can be added later.

## 5. Payments

Version 1 uses the payment methods Pakistani buyers already trust: cash on delivery, manual Easypaisa / JazzCash, and manual bank transfer. No payment gateway is needed; the owner confirms each payment in the admin module.

| Method | How it works on the site | Owner action |
|---|---|---|
| Cash on delivery (COD) | Default option for retail-style orders. Buyer selects COD at checkout; nothing is paid online. Owner can set a small COD fee and/or require a partial advance on large orders, because returned or refused parcels are a real loss. | Confirms the order (e.g. by call), marks it Paid when cash is received |
| Easypaisa / JazzCash (manual) | Payment page shows the owner's wallet number and QR code, the amount and the Order ID. Buyer sends money in their own app, then enters the transaction ID (TID) and optionally uploads a screenshot. A WhatsApp button lets the buyer send the receipt there instead. | Checks the wallet app for the TID and amount, clicks Confirm |
| Bank transfer (manual) | Payment page shows bank name, account title, account number / IBAN (Raast ID optional), the amount and the Order ID. Buyer transfers via their banking app, then enters the reference number and uploads the receipt. | Checks the bank app, clicks Confirm |

**Order statuses:** Awaiting payment → Payment submitted → Paid → Dispatched → Delivered, plus Cancelled. COD orders go Confirmed → Dispatched → Paid on delivery.

| ID | Requirement |
|---|---|
| PAY-01 | Every order gets a unique Order ID (e.g. SF-1042), shown on the payment page and in the buyer's confirmation |
| PAY-02 | Buyer chooses COD, Easypaisa, JazzCash or Bank transfer; the owner can switch each method on or off |
| PAY-03 | Payment page shows the correct account details, QR code, amount and Order ID for the chosen method |
| PAY-04 | Buyer can submit a transaction / reference ID and upload a receipt image (JPG/PNG/PDF) |
| PAY-05 | The same transaction ID cannot be used on two orders (blocks reused screenshots) |
| PAY-06 | Owner gets an email for every new order and every submitted payment |
| PAY-07 | Optional COD fee (fixed PKR) and optional advance percentage for orders above a set amount, both set by the owner |
| PAY-08 | Orders are dispatched only after the owner confirms payment (or confirms the COD order) |
| PAY-09 | An automatic gateway (e.g. PayFast or Safepay) can be added later without changing the order flow — out of scope for v1 |

**Admin additions:** an **Orders** screen (list, filter by status, view receipt, Confirm / Reject payment, mark Dispatched) and a **Payment settings** screen (wallet numbers, QR images, bank details, COD on/off, COD fee, advance rule).

## 6. Fabric Catalogue Fields

| Field | Example / note (client) | Stored as |
|---|---|---|
| Fabric name & code | AS-201 Cotton Twill | text, unique code + URL slug |
| Composition | 100% Cotton / 65% Poly 35% Cotton | text |
| GSM (weight) | 180 GSM | number |
| Width | 58" / 147 cm | number (inches + cm) |
| Weave / knit & finish | Twill, plain, satin; peach, mercerised | select lists |
| Available colours | Swatch image for each colour with colour code | list: name, code, swatch image |
| MOQ | 100 meters per colour | number, default 100 |
| Recommended uses | Shirts, uniforms, kurtas, trousers, home textile | multi-select (also a catalogue filter) |
| Properties | Stretch, shrinkage, colour fastness, feel | text fields |
| Care instructions | Washing / ironing guidance | rich text |
| Lead time & availability | Ready stock or made-to-order; dispatch time | select + days |
| Price | Price range or "Request quote" (by quantity slab) | price slabs (PKR) or quote flag |
| Media | 4–6 photos + short video of drape/texture | uploads |
| SEO (added) | Title, meta description | text, auto-filled from the fields above |

## 7. Non-Functional Requirements

| ID | Requirement | Measurable target | Source |
|---|---|---|---|
| NFR-01 | Fast loading | Mobile Lighthouse Performance ≥ 90; LCP < 2.5 s, CLS < 0.1, INP < 200 ms | Sec 3, 5 |
| NFR-02 | Mobile-first | Designed at 360 px width first; WhatsApp button always visible | Sec 3 |
| NFR-03 | Easy to use | Buyer finds fabric specs, MOQ and how to order within seconds; max 2 taps from Home to a fabric | Sec 3 |
| NFR-04 | Premium look | Consistent brand colours (maroon + gold from logo) and fonts on every page | Sec 3 |
| NFR-05 | SEO-ready | Lighthouse SEO = 100; every page server-rendered HTML, readable without JavaScript | Sec 5, 6 |
| NFR-06 | Secure | SSL (https) on all pages; admin login protected; forms rate-limited and spam-protected | Sec 3, 5 |
| NFR-07 | Crawlable by Google and Bing | Valid sitemap, robots.txt, schema passes Google Rich Results Test | Sec 5, 6 |
| NFR-08 | Consistent data | One source of fabric data feeds website, PDF catalogue, QR codes and WhatsApp/Meta catalogue | Sec 4 |
| NFR-09 | Maintainable | Owner can update content without code; daily database backup | Added |

## 8. Tech Stack

Next.js for the frontend and Node.js for the backend, in one codebase. The backend is the Next.js Node.js runtime itself (API routes and server actions) plus a custom owner-only admin module, so there is no separate server to deploy.

| Layer | Technology | Covers |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript, HTML, CSS (Tailwind CSS) | Static/server-rendered pages for SEO; `generateMetadata` for titles/meta (FR-15); `next/image` for compression (FR-17) |
| Backend | Node.js — Next.js API routes + server actions; Auth.js (credentials) for the owner login | Admin module, fabric/blog/FAQ data, image uploads, inquiry storage (FR-10, FR-24, AD-01–AD-10) |
| Database | PostgreSQL | Fabrics, colours, blog, FAQ, inquiries, settings; accessed with Prisma ORM |
| Media storage | Cloudflare R2 (S3-compatible) | Fabric photos and videos (FR-03) |
| SEO tooling | Next.js `sitemap.ts`, `robots.ts`, JSON-LD components | FR-16, FR-20, FR-22 |
| PDF & QR | `@react-pdf/renderer`, `qrcode` (Node libraries) | FR-11, FR-12 |
| Email | Resend or Brevo | Inquiry notifications (FR-10) |
| CDN & SSL | Cloudflare (free plan) + Turnstile spam check | NFR-01, NFR-06 |
| Hosting | VPS (Hetzner / DigitalOcean) with Docker | Fits the USD 25/month hosting budget |
| Analytics | Google Analytics 4, Search Console, Bing Webmaster Tools | FR-23 |

**Domain:** the owner has already bought the brand-name .com domain on GoDaddy; it stays registered there. Change its nameservers in GoDaddy to Cloudflare; DNS, SSL and caching are then managed in Cloudflare, with an A record pointing to the VPS. Use one canonical host (e.g. `www.<domain>.com`) and 301-redirect the other.

**Later option:** if the owner needs staff accounts, roles, drafts or version history, the admin can move to a Node.js CMS such as Payload without changing the public site.

## 9. Architecture

One Next.js codebase serves the public pages and the Node.js admin/API behind Cloudflare.

```
Buyers (mobile)          Search and AI crawlers        Owner (admin)
        \                        |                        /
         -------------- Cloudflare (CDN, SSL, DNS, Turnstile) --------------
                          |                              |
   VPS · Docker · one Next.js + Node.js codebase
   [Next.js site (public): SSG + ISR pages, sitemap, robots, llms.txt, JSON-LD, quote form API]
   [Admin module (/admin): owner login, fabrics, blog, FAQ, inquiries; on publish: revalidate + IndexNow]
                          |                 |                  |
                    PostgreSQL        Cloudflare R2        Email alert
```

1. Buyers and search/AI crawlers get pre-rendered pages from the Cloudflare cache, which keeps the site fast and fully crawlable.
2. The owner edits fabrics, blogs and FAQs in `/admin`. On publish, the backend refreshes those pages, the sitemap and the PDF catalogue, and notifies Bing (IndexNow).
3. Quote, sample and contact forms post to a Next.js API route. It saves the inquiry in PostgreSQL and emails sales.
