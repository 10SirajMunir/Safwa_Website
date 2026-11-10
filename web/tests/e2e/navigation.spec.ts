// CR-02: the full logo is visible, and a buyer can always get back to Home.
import { expect, test } from "@playwright/test";

const INNER_PAGES = [
  { path: "/fabrics", trail: ["Home", "Fabrics"] },
  { path: "/fabrics?type=cotton", trail: ["Home", "Fabrics", "Cotton fabrics"] },
  { path: "/fabrics/cotton-twill-180-gsm", trail: ["Home", "Fabrics", "Cotton Twill 180 GSM"] },
  { path: "/how-to-order", trail: ["Home", "How to order"] },
  { path: "/about", trail: ["Home", "About"] },
  { path: "/blog", trail: ["Home", "Fabric guide"] },
  { path: "/blog/cotton-vs-poly-cotton", trail: ["Home", "Fabric guide", "Cotton vs poly-cotton: which fabric suits your order?"] },
  { path: "/faq", trail: ["Home", "FAQ"] },
  { path: "/contact", trail: ["Home", "Contact"] },
];

for (const { path, trail } of INNER_PAGES) {
  test(`${path} shows a breadcrumb trail back to Home`, async ({ page }) => {
    await page.goto(path);
    const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(crumbs.getByRole("listitem")).toHaveText(trail.map((t) => new RegExp(t.replace(/[?]/g, "\\?"))));
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText(trail.at(-1)!);
    await crumbs.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
}

test("from a fabric, the breadcrumb goes back to the catalogue", async ({ page }) => {
  await page.goto("/fabrics/cotton-twill-180-gsm");
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Fabrics" }).click();
  await expect(page).toHaveURL(/\/fabrics$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fabric catalogue");
});

test("the main menu starts with Home and marks the current page", async ({ page, isMobile }) => {
  await page.goto("/fabrics");
  if (isMobile) await page.getByText("Menu", { exact: true }).click();
  const menu = page.getByRole("navigation", { name: "Main" });
  await expect(menu.getByRole("link").first()).toHaveText("Home");
  await expect(menu.getByRole("link", { name: "Fabrics" })).toHaveAttribute("aria-current", "page");
  await menu.getByRole("link", { name: "Home" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("the header logo shows the whole swan, undistorted", async ({ page }) => {
  await page.goto("/");
  const logo = page.locator("header img").first();
  await expect(logo).toBeVisible();

  const result = await logo.evaluate(async (img: HTMLImageElement) => {
    // Load the original file at full size and check its outer pixel border is empty:
    // a cut-off drawing has opaque pixels touching the edge.
    const full = new Image();
    full.src = "/brand/al-safwa-swan-mark.png";
    await full.decode();
    const canvas = document.createElement("canvas");
    canvas.width = full.naturalWidth;
    canvas.height = full.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(full, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let edgeOpaque = 0;
    for (let x = 0; x < width; x++) {
      for (const y of [0, 1, height - 2, height - 1]) if (data[(y * width + x) * 4 + 3] > 10) edgeOpaque++;
    }
    for (let y = 0; y < height; y++) {
      for (const x of [0, 1, width - 2, width - 1]) if (data[(y * width + x) * 4 + 3] > 10) edgeOpaque++;
    }
    const shownRatio = img.clientWidth / img.clientHeight;
    const fileRatio = full.naturalWidth / full.naturalHeight;
    return { edgeOpaque, ratioError: Math.abs(shownRatio - fileRatio) };
  });

  expect(result.edgeOpaque).toBe(0);
  expect(result.ratioError).toBeLessThan(0.05);
});
