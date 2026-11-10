// The site from a buyer's point of view (PRD §1: "understand the fabric, the MOQ and
// how to order within seconds, especially on mobile").
import { expect, test } from "@playwright/test";

test("Home shows the MOQ straight away", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("100 meters per colour");
  await expect(page.getByText("100 m", { exact: false }).first()).toBeVisible();
});

test("a fabric is one tap from Home (NFR-03: max 2 taps)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Cotton Twill 180 GSM" }).first().click();
  await expect(page).toHaveURL(/\/fabrics\/cotton-twill-180-gsm$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cotton Twill 180 GSM");
});

test("a fabric is two taps from Home through a category (NFR-03)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Poly-cotton/ }).first().click();
  await expect(page).toHaveURL(/\/fabrics\?type=poly-cotton/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Poly-cotton fabrics");
  await page.getByRole("link", { name: "Poly-Cotton Twill 210 GSM" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Poly-Cotton Twill 210 GSM");
});

test("fabric page shows specs as real text (FR-02, FR-04)", async ({ page }) => {
  await page.goto("/fabrics/cotton-twill-180-gsm");
  const facts = page.getByTestId("key-facts");
  await expect(facts).toContainText("180 GSM");
  await expect(facts).toContainText('58" / 147 cm');
  await expect(facts).toContainText("100% Cotton");
  await expect(facts).toContainText("100 m per colour");
  for (const label of ["Fabric code", "Weave", "Finish", "Recommended uses", "Availability", "Price", "Stretch", "Shrinkage", "Colour fastness", "Feel"]) {
    await expect(page.locator("dt", { hasText: label }).first()).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "Care instructions" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Available colours" }).getByText("AS-201-NV")).toBeVisible();
});

test("floating WhatsApp message names the fabric on a fabric page (FR-06)", async ({ page }) => {
  await page.goto("/fabrics/cotton-twill-180-gsm");
  const href = await page.locator('[data-testid="whatsapp-float"]:visible').getAttribute("href");
  const text = new URL(href!).searchParams.get("text");
  expect(text).toContain("AS-201 Cotton Twill 180 GSM");

  await page.goto("/faq");
  const generic = new URL((await page.locator('[data-testid="whatsapp-float"]:visible').getAttribute("href"))!).searchParams.get("text");
  expect(generic).not.toContain("AS-201");
});

test("catalogue filters narrow the list and can be cleared (FR-01)", async ({ page, isMobile }) => {
  await page.goto("/fabrics");
  await expect(page.locator("#results-heading")).toHaveText("6 fabrics");

  const scope = isMobile ? "filter-mobile" : "filter-desktop";
  if (isMobile) await page.getByText("Filter fabrics").first().click();
  await page.locator(`#${scope}-gsm`).selectOption("heavy");
  await page.locator(`#${scope}-use`).selectOption("trousers");
  await page.locator(`#${scope}-use`).locator("xpath=ancestor::form").getByRole("button", { name: "Show fabrics" }).click();

  await expect(page).toHaveURL(/gsm=heavy/);
  await expect(page.locator("#results-heading")).toHaveText("2 fabrics match your filters");
  await page.getByRole("link", { name: /Remove filter Use/ }).click();
  await expect(page).toHaveURL(/\/fabrics\?gsm=heavy$/);
  await page.getByRole("link", { name: "Clear filters" }).first().click();
  await expect(page.locator("#results-heading")).toHaveText("6 fabrics");
});

test("an impossible filter combination shows a helpful empty state", async ({ page }) => {
  await page.goto("/fabrics?type=poly-cotton&colour=olive");
  await expect(page.getByText("No fabrics match these filters.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Clear filters" }).first()).toBeVisible();
});

test("Order Sample switches the form to a sample request (FR-08)", async ({ page }) => {
  await page.goto("/fabrics/cotton-twill-180-gsm");
  await page.getByRole("link", { name: "Order sample" }).click();
  await expect(page.getByRole("radio", { name: "A sample" })).toBeChecked();
  await expect(page.getByLabel("Meters per colour")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Request sample" })).toBeVisible();
});

test("a buyer can request a quote end to end (FR-07)", async ({ page }) => {
  await page.goto("/fabrics/cotton-twill-180-gsm");
  await page.getByRole("link", { name: "Request quote" }).first().click();

  // Submitting empty shows errors, not a request.
  await page.getByRole("button", { name: "Request quote" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();

  await page.getByLabel("Your name").fill("Ahmed Khan");
  await page.getByLabel("Phone or WhatsApp").fill("0300 1234567");
  await page.getByLabel("City").fill("Lahore");
  await page.getByRole("checkbox", { name: /Navy/ }).check();
  await page.getByLabel("Meters per colour").fill("40");
  await page.getByRole("button", { name: "Request quote" }).click();
  await expect(page.getByText("Minimum order is 100 meters per colour.")).toBeVisible();

  await page.getByLabel("Meters per colour").fill("300");
  const responsePromise = page.waitForResponse("**/api/inquiries");
  await page.getByRole("button", { name: "Request quote" }).click();
  expect((await responsePromise).status()).toBe(202);
  await expect(page.getByRole("status")).toContainText("Thank you, Ahmed Khan.");
});

test("contact page has NAP, map and a working form (FR-09)", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByTestId("contact-nap")).toContainText("+92 300 0000000");
  await expect(page.locator('iframe[title^="Map showing"]')).toHaveAttribute("src", /google\.com\/maps/);

  await page.getByLabel("Your name").fill("Sara Ali");
  await page.getByLabel("Phone or WhatsApp").fill("+92 321 7654321");
  await page.getByLabel("City").fill("Karachi");
  await page.getByLabel("Your message").fill("Do you stock cotton satin in black?");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("Thank you, Sara Ali.");
});

test("How to order lists the six PRD steps and the MOQ", async ({ page }) => {
  await page.goto("/how-to-order");
  await expect(page.locator("ol").filter({ hasText: "Choose your fabric" }).locator("> li")).toHaveCount(6);
  await expect(page.getByTestId("moq-panel")).toContainText("100 m");
  for (const method of ["Cash on delivery", "Easypaisa", "JazzCash", "Bank transfer"]) {
    await expect(page.getByText(method, { exact: true })).toBeVisible();
  }
});

test("FAQ answers the MOQ question directly (FR-21)", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.getByText("Our minimum order quantity (MOQ) is 100 meters per colour.")).toBeVisible();
  await page.getByText("How can I pay?").click();
  await expect(page.getByText(/cash on delivery, Easypaisa, JazzCash or bank transfer/)).toBeVisible();
});

test("guides link to fabrics and fabrics link to guides (FR-05)", async ({ page }) => {
  await page.goto("/blog/what-is-gsm-fabric-weight-guide");
  await page.getByRole("link", { name: "Cotton Plain 120 GSM" }).click();
  await expect(page).toHaveURL(/cotton-plain-120-gsm/);
  await expect(page.getByRole("link", { name: /What is GSM/ })).toBeVisible();
});

test.describe("phone menu", () => {
  test.skip(({ isMobile }) => !isMobile, "phone only");

  test("opens, navigates and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Menu", { exact: true }).click();
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "FAQ" }).click();
    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "FAQ" })).toBeHidden();
  });
});
