# CR-02: Full logo in the header, and a clear way back to Home

| | |
|---|---|
| Requested by | Owner, 2026-10-27 |
| Type | Change request: defect fix (logo) + usability addition (Home navigation) |
| Status | Approved by the owner's request; implemented |

---

## Part A: Pre-implementation

### 1. Requirements

| # | Request | PRD link |
|---|---|---|
| A1 | The logo must be fully visible in the navbar; check the rest of the site for the same problem | NFR-04 (consistent brand from the logo) |
| A2 | A buyer who opens Fabrics (or any inner page) must have an obvious way back to the Home page | NFR-03 (easy to use) |

### 2. Findings (investigation before coding)

| Place | Logo shown | Problem |
|---|---|---|
| Header (every page) | Swan mark `al-safwa-swan-mark.png` | **Cut off.** In the original logo the swan's tail dips below the top of the letter "S". The rectangular crop therefore cut the tail and kept slivers of the "S" and "a" along the bottom edge. |
| Browser tab icon, home-screen icon (`favicon.ico`, `icon.png`, `apple-icon.png`) | Built from the same crop | **Same cut**, and `icon.png` is also the logo in structured data (Organization / LocalBusiness) |
| Footer | Full lock-up (swan + "Safwa" + tagline) | Complete, no change needed |
| Link preview image (`opengraph-image.jpg`) | Full lock-up | Complete, no change needed |

Navigation today: the logo links to Home, but nothing on screen says so, and the menu has no "Home" item. Fabric and guide pages have only a "← All fabrics" / "← Fabric guide" link.

### 3. Design

- **A1:** Re-extract the swan from the master logo by **shape** (keep only the swan's strokes, drop the letters) instead of by rectangle, so the whole swan is kept with nothing else. Regenerate the header mark and all icons from it. Show the mark slightly larger in the header (≈ 52 px tall) so the detail stays clear on phones.
- **A2:**
  1. Add **Home** as the first item in the main menu (desktop bar, phone menu and footer list, which all read one list).
  2. Replace the single back link on fabric and guide pages with a **breadcrumb trail**: `Home › Fabrics › Cotton Twill 180 GSM` and `Home › Fabric guide › <article>`. Every level is one tap.

### 4. Tests to add

- E2E: from a fabric page, the breadcrumb leads to Home and to Fabrics; the menu has Home on phone and desktop.
- E2E: the header logo image is not clipped (fully inside its box, natural aspect ratio kept).
- Existing accessibility, no-JS and layout tests must still pass.

### 5. Out of scope

Cart / checkout / payments. See the answer to the owner in the post section (§B4); this is not implemented.

---

## Part B: Post-implementation

Date: 2026-10-27

### B1. What changed

| Item | Change | Files |
|---|---|---|
| A1 Logo | Swan re-extracted from the master logo by shape, keeping its four strokes and dropping the "S" and "f" letters. The tail tip is no longer cut and no letter slivers remain. Header mark shown at 52 px tall (was 41 px). Favicon, `icon.png` (also the structured-data logo) and `apple-icon.png` regenerated from the complete swan. Footer and link-preview logos were already complete and are unchanged. | `web/public/brand/al-safwa-swan-mark.png`, `web/src/app/icon.png`, `apple-icon.png`, `favicon.ico`, `components/layout/site-header.tsx` |
| A2 Home | **Home** is the first item in the main menu (desktop, phone menu, footer). The current page is marked. | `config/navigation.ts`, `components/layout/nav-links.tsx` |
| A2 Way back | New breadcrumb trail on every inner page: `Home › Fabrics`, `Home › Fabrics › Cotton fabrics`, `Home › Fabrics › Cotton Twill 180 GSM`, `Home › Fabric guide › <article>`, `Home › FAQ`, and so on. It replaces the single "← All fabrics" / "← Fabric guide" links. | `components/layout/breadcrumbs.tsx`, `components/ui/page-header.tsx`, all inner pages |

### B2. Test results

| Check | Result |
|---|---|
| Lint, type-check | ✅ clean |
| Unit + component | ✅ 57 / 57 |
| Browser tests (phone 360 px + desktop) | ✅ **180 passed**, 2 skipped on purpose (was 156; +24 new navigation tests) |
| New: logo integrity | Reads the logo's pixels in the browser and fails if any part of the drawing touches the image edge (the cut-off defect), or if the logo is stretched |
| New: breadcrumbs | All 9 inner pages show the right trail, mark the current page, and "Home" returns to `/` |
| New: menu | Home is the first menu item on phone and desktop, the current page is marked, and Home works |

One existing test needed adjusting: "How to order lists six steps" counted every list item on the page, which now includes the breadcrumb. It is narrowed to the steps list.

### B3. PRD impact

No new pages, data or features beyond the owner's request. Breadcrumbs and the Home link support NFR-03 ("easy to use"). The logo fix supports NFR-04 (brand consistency).

### B4. Owner question: "Why is there no Add to cart? Is PRD §5 (Payments) missing?"

**Not implemented, by design. Explanation only.**

1. **The PRD does not ask for a cart.** PRD §2 lists the pages and none of them is a cart or checkout. The ordering flow it defines is *choose fabric → colours → quantity → **quote** → payment → dispatch*. A buyer asks for a quote first, and payment comes after the quote. The fabric page's required buttons are "Request Quote" and "Order Sample" (FR-07, FR-08), and those are built.
2. **The catalogue has no fixed prices to put in a cart.** PRD §6 allows "price slabs (PKR) **or** a Request-quote flag", and with an MOQ of 100 m per colour, the price depends on the quantity. A cart needs a known price per item.
3. **Payments (§5) are not missing. They are scheduled for Phase 2**, because every payment requirement needs the backend, which does not exist yet:
   - a unique Order ID (PAY-01)
   - the owner switching methods on and off (PAY-02)
   - storing transaction IDs and receipt uploads (PAY-04)
   - blocking a reused transaction ID (PAY-05)
   - emails to the owner (PAY-06)
   - owner confirmation before dispatch (PAY-08)

   All of that needs the database, file storage, email and the admin "Orders" screen. A payment page built in Phase 1 would collect transaction IDs and receipts with nowhere to store or check them.
4. **One decision is needed first (OQ-02).** §5 mentions "checkout" and a "payment page", but §2 gives them no URL and does not say how the buyer reaches them. The two possible flows:
   - **(a) Quote-first (matches PRD §2):** the buyer requests a quote, the owner turns it into an order in the admin, and the buyer receives a payment link (e.g. `/order/SF-1042`). That page shows the Order ID, the amount and the method choice (COD / Easypaisa / JazzCash / bank), then takes the TID and receipt. No cart.
   - **(b) Cart + checkout:** the buyer adds fabrics and colours to a cart and pays directly. This needs fixed prices for every fabric and new pages that are not in the PRD, so the owner would have to approve a PRD change.

   **Recommendation: (a).** It follows the PRD's own flow, it works with "Request quote" pricing, and it covers PAY-01 to PAY-08 completely.
