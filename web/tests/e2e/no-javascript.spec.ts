// NFR-05: every page is server-rendered HTML and readable without JavaScript.
import { expect, test } from "@playwright/test";
import { PUBLIC_ROUTES } from "./routes";

test.use({ javaScriptEnabled: false });

for (const path of PUBLIC_ROUTES) {
  test(`${path} is readable without JavaScript`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByTestId("footer-nap")).toBeVisible();
    await expect(page.locator('[data-testid="whatsapp-float"]:visible')).toBeVisible();
  });
}

test("catalogue filters work without JavaScript (plain GET form)", async ({ page }) => {
  await page.goto("/fabrics?type=cotton&gsm=light");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fabric catalogue");
  await expect(page.locator("#results-heading")).toHaveText("1 fabric match your filters");
  await expect(page.getByRole("link", { name: "Cotton Plain 120 GSM" })).toBeVisible();
});

test("category pages get their own heading without JavaScript", async ({ page }) => {
  await page.goto("/fabrics?type=cotton");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cotton fabrics");
  await expect(page.locator("#results-heading")).toHaveText("4 fabrics match your filters");
});

test("fabric specs are in the HTML without JavaScript", async ({ page }) => {
  await page.goto("/fabrics/poly-cotton-twill-210-gsm");
  await expect(page.getByTestId("key-facts")).toContainText("210 GSM");
  await expect(page.getByTestId("key-facts")).toContainText("65% Polyester 35% Cotton");
});
