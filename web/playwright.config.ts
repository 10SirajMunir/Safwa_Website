import { defineConfig, devices } from "@playwright/test";
import { uniqueClientIp } from "./tests/support/client-ip";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;

// Runs against the production build (`npm run build` first), which is what buyers get.
export default defineConfig({
  testDir: "tests",
  testMatch: ["e2e/**/*.spec.ts", "security/**/*.spec.ts"],
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "test-results/e2e-report", open: "never" }]],
  outputDir: "test-results/artifacts",
  // A fresh client address per run keeps repeated runs under the API rate limit (NFR-06).
  use: { baseURL, trace: "retain-on-failure", extraHTTPHeaders: { "x-forwarded-for": uniqueClientIp() } },
  projects: [
    {
      // NFR-02: designed at 360 px first.
      name: "mobile-360",
      testMatch: "e2e/**/*.spec.ts",
      use: { ...devices["Pixel 7"], viewport: { width: 360, height: 780 } },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 900 } },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
