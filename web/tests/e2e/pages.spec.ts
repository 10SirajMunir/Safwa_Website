import { expect, test } from "@playwright/test";
import { PUBLIC_ROUTES } from "./routes";

test.describe("every public page", () => {
  for (const path of PUBLIC_ROUTES) {
    test(`${path} loads with one H1, title, description, canonical, NAP and WhatsApp`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Al Safwa Fabrics/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\//);

      // FR-19: the same NAP on every page (footer).
      const nap = page.getByTestId("footer-nap");
      await expect(nap).toContainText("Al Safwa Fabrics");
      await expect(nap).toContainText("+92 300 0000000");

      // FR-06 / NFR-02: WhatsApp button visible on every page.
      await expect(page.locator('[data-testid="whatsapp-float"]:visible')).toBeVisible();
    });

    test(`${path} has no sideways scrolling`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("titles are unique across pages (FR-15)", async ({ page }) => {
    const titles = new Set<string>();
    for (const path of PUBLIC_ROUTES) {
      await page.goto(path);
      titles.add(await page.title());
    }
    expect(titles.size).toBe(PUBLIC_ROUTES.length);
  });

  test("unknown fabric and guide URLs return a real 404", async ({ page }) => {
    for (const path of ["/fabrics/does-not-exist", "/blog/does-not-exist", "/no-such-page"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("We could not find that page");
    }
  });
});
