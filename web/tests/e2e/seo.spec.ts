// FR-14 – FR-22 and NFR-07: what search engines and AI assistants receive.
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "parallel" });

async function jsonLd(page: import("@playwright/test").Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((text) => {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [data];
  });
}

test("sitemap lists every page, category, fabric and guide (FR-16)", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const path of ["/fabrics", "/how-to-order", "/faq", "/contact", "/about", "/blog", "/fabrics/cotton-twill-180-gsm", "/fabrics?type=cotton", "/fabrics?use=shirts", "/blog/cotton-vs-poly-cotton"]) {
    expect(xml).toContain(`${path}</loc>`);
  }
  // 7 pages + 2 fabric types + 5 uses + 6 fabrics + 3 guides
  expect((xml.match(/<url>/g) ?? []).length).toBe(7 + 2 + 5 + 6 + 3);
});

test("robots.txt allows the site, blocks admin and API, links the sitemap (FR-16)", async ({ request }) => {
  const text = await (await request.get("/robots.txt")).text();
  expect(text).toMatch(/Allow: \//);
  expect(text).toMatch(/Disallow: \/admin/);
  expect(text).toMatch(/Disallow: \/api\//);
  expect(text).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
});

test("llms.txt summarises the business for AI assistants (FR-22)", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.headers()["content-type"]).toContain("text/markdown");
  const text = await response.text();
  expect(text).toMatch(/^# Al Safwa Fabrics/);
  expect(text).toContain("MOQ): 100 meters per colour");
  expect(text).toContain("AS-201 Cotton Twill 180 GSM");
});

test("site-wide Organization and LocalBusiness schema (FR-20)", async ({ page }) => {
  await page.goto("/");
  const types = (await jsonLd(page)).map((d) => d["@type"]);
  expect(types).toEqual(expect.arrayContaining(["Organization", "LocalBusiness"]));
});

test("fabric page has Product schema with GSM and MOQ (FR-20)", async ({ page }) => {
  await page.goto("/fabrics/cotton-twill-180-gsm");
  const product = (await jsonLd(page)).find((d) => d["@type"] === "Product");
  expect(product).toMatchObject({ sku: "AS-201", name: "Cotton Twill 180 GSM", material: "100% Cotton" });
  expect(JSON.stringify(product.additionalProperty)).toContain("MOQ");
});

test("FAQ page has FAQPage schema matching the visible questions (FR-20, FR-21)", async ({ page }) => {
  await page.goto("/faq");
  const faq = (await jsonLd(page)).find((d) => d["@type"] === "FAQPage");
  const visible = await page.locator("details summary h2").allTextContents();
  expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(visible);
});

test("category page gets its own title, H1 and canonical (FR-15)", async ({ page }) => {
  await page.goto("/fabrics?type=cotton");
  await expect(page).toHaveTitle(/^Cotton fabrics in Pakistan/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/fabrics\?type=cotton$/);
});

test("filter combinations point search engines at the main catalogue", async ({ page }) => {
  await page.goto("/fabrics?type=cotton&use=shirts");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/fabrics$/);
});

test("images have alt text (FR-17)", async ({ page }) => {
  for (const path of ["/", "/fabrics/cotton-twill-180-gsm"]) {
    await page.goto(path);
    const missing = await page.locator("img:not([alt])").count();
    expect(missing, path).toBe(0);
  }
});

test("link previews have an Open Graph image", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
});
