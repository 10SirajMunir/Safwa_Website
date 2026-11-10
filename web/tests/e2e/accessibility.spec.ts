// Usable by any buyer regardless of age or ability: WCAG 2.2 A/AA checks with axe-core.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PUBLIC_ROUTES } from "./routes";

for (const path of PUBLIC_ROUTES) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      // The Google Maps iframe is third-party content we cannot change.
      .exclude('iframe[title^="Map showing"]')
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

test("form errors are announced and linked to their fields", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  const name = page.getByLabel("Your name");
  await expect(name).toHaveAttribute("aria-invalid", "true");
  const describedBy = await name.getAttribute("aria-describedby");
  await expect(page.locator(`#${describedBy!.replace(/:/g, "\\:")}`)).toHaveText("Please enter your name.");
});

test("keyboard users can skip to the content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard check on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
});
