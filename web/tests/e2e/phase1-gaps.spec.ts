// Phase 1 gap review (iteration 2): docs/reports/phase-1/04_GAP_REVIEW_PRE_IMPLEMENTATION.md
import { expect, test } from "@playwright/test";

test("G1 · the site-wide 404 page has the WhatsApp button (FR-06)", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator('[data-testid="whatsapp-float"]:visible')).toBeVisible();
});

test("G2 · a use is a category page with its own H1, title, canonical and breadcrumb (FR-15)", async ({ page }) => {
  await page.goto("/fabrics?use=shirts");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fabrics for shirts");
  await expect(page).toHaveTitle(/^Fabrics for shirts in Pakistan/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /fabrics for shirts/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/fabrics\?use=shirts$/);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Fabrics for shirts");
});

test("G2 · Home's 'what you are making' links land on use category pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Uniforms", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fabrics for uniforms");
});

test("G3 · contact page shows the WhatsApp number (PRD §2 Contact)", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByTestId("contact-nap")).toContainText("WhatsApp +92 300 0000000");
});

test("G4 · the spec label matches PRD §6 'Weave / knit'", async ({ page }) => {
  await page.goto("/fabrics/cotton-twill-180-gsm");
  await expect(page.locator("dt", { hasText: "Weave / knit" })).toBeVisible();
});

test("G5 · the PDF catalogue downloads: cover, how-to-order, one page per fabric, contact (FR-11)", async ({ request }) => {
  const response = await request.get("/al-safwa-fabrics-catalogue.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("application/pdf");
  const body = await response.body();
  expect(body.subarray(0, 5).toString()).toBe("%PDF-");
  const pages = body.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) ?? [];
  expect(pages).toHaveLength(6 + 3);
});

test("G5 · the PDF is linked from the catalogue page and the footer", async ({ page }) => {
  await page.goto("/fabrics");
  await expect(page.getByRole("link", { name: "Download PDF catalogue" })).toHaveAttribute(
    "href",
    "/al-safwa-fabrics-catalogue.pdf",
  );
  await expect(page.locator("footer").getByRole("link", { name: "Download the PDF catalogue" })).toBeVisible();
});

test("G6 · every fabric has a QR code; unknown fabrics do not (FR-12)", async ({ request }) => {
  const ok = await request.get("/fabrics/cotton-twill-180-gsm/qr.svg");
  expect(ok.status()).toBe(200);
  expect(ok.headers()["content-type"]).toBe("image/svg+xml");
  expect((await ok.text()).startsWith("<svg")).toBe(true);
  expect((await request.get("/fabrics/no-such-fabric/qr.svg")).status()).toBe(404);
});

test("G8 · with no analytics IDs set, nothing is sent to third parties (FR-23)", async ({ page }) => {
  const thirdParty: string[] = [];
  page.on("request", (req) => {
    const host = new URL(req.url()).hostname;
    if (!["localhost", "127.0.0.1"].includes(host)) thirdParty.push(host);
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(thirdParty).toEqual([]);
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  await expect(page.locator('meta[name="google-site-verification"]')).toHaveCount(0);
});
