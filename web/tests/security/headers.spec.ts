// NFR-06: browser-level protections on every response.
import { expect, test } from "@playwright/test";

const PATHS = [
  "/",
  "/fabrics/cotton-twill-180-gsm",
  "/contact",
  "/api/inquiries",
  "/sitemap.xml",
  "/al-safwa-fabrics-catalogue.pdf",
  "/fabrics/cotton-twill-180-gsm/qr.svg",
];

for (const path of PATHS) {
  test(`${path} sends security headers`, async ({ request }) => {
    const response = await request.get(path);
    const headers = response.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    const csp = headers["content-security-policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).not.toContain("unsafe-eval");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
}

test("production responses ask browsers to use HTTPS only (HSTS)", async ({ request }) => {
  const response = await request.get("/");
  expect(response.headers()["strict-transport-security"]).toMatch(/max-age=\d{8,}/);
});

test("no source maps or env files are served", async ({ request }) => {
  for (const path of ["/.env", "/.env.local", "/next.config.ts", "/package.json", "/.git/config"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
  }
});

// The CSP must hold without breaking the site: no page may trigger a violation
// (blocked eval, inline handler, third-party script, or a frame other than Google Maps).
for (const path of ["/", "/fabrics", "/fabrics/cotton-twill-180-gsm", "/contact", "/faq", "/blog/cotton-vs-poly-cotton"]) {
  test(`${path} runs without Content-Security-Policy violations`, async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __csp: string[] };
      w.__csp = [];
      document.addEventListener("securitypolicyviolation", (e) => w.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
    });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)).toEqual([]);
  });
}
