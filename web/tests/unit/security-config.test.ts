// NFR-06 rate limiting and headers; FR-23 analytics switches.
import { afterEach, describe, expect, it, vi } from "vitest";
import { clientIp, createRateLimiter } from "@/server/security/rate-limit";
import { buildContentSecurityPolicy, buildSecurityHeaders } from "@/config/security";

describe("rate limiter", () => {
  it("allows the limit, then blocks with the time left until the window resets", () => {
    let now = 0;
    const check = createRateLimiter({ limit: 3, windowMs: 60_000, now: () => now });
    expect([check("a"), check("a"), check("a")].every((r) => r.allowed)).toBe(true);
    now = 15_000;
    expect(check("a")).toEqual({ allowed: false, remaining: 0, retryAfterSeconds: 45 });
    expect(check("b").allowed).toBe(true);
  });

  it("starts a fresh window after it expires", () => {
    let now = 0;
    const check = createRateLimiter({ limit: 1, windowMs: 1000, now: () => now });
    check("a");
    expect(check("a").allowed).toBe(false);
    now = 1000;
    expect(check("a")).toMatchObject({ allowed: true, remaining: 0 });
  });

  it("never tracks more clients than maxKeys (memory bound)", () => {
    const check = createRateLimiter({ limit: 1, windowMs: 60_000, maxKeys: 3, now: () => 0 });
    for (const ip of ["1", "2", "3", "4", "5"]) check(ip);
    // The oldest client was evicted, so it gets a new window; the newest is still limited.
    expect(check("1").allowed).toBe(true);
    expect(check("5").allowed).toBe(false);
  });
});

describe("clientIp", () => {
  const req = (headers: Record<string, string>) => new Request("http://x", { headers });

  it("takes the first address from the trusted header", () => {
    expect(clientIp(req({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }))).toBe("203.0.113.9");
    expect(clientIp(req({ "cf-connecting-ip": "198.51.100.7" }), "cf-connecting-ip")).toBe("198.51.100.7");
  });

  it("ignores untrusted headers and falls back to a shared bucket", () => {
    expect(clientIp(req({ "x-forwarded-for": "1.1.1.1" }), "cf-connecting-ip")).toBe("unknown");
  });
});

describe("security headers", () => {
  it("keeps third parties out unless analytics is switched on", () => {
    const off = buildContentSecurityPolicy({ isProduction: true, analytics: false });
    expect(off).not.toContain("google-analytics");
    expect(off).not.toContain("googletagmanager");
    expect(off).not.toContain("unsafe-eval");
    expect(off).not.toContain("upgrade-insecure-requests");

    const on = buildContentSecurityPolicy({ isProduction: true, analytics: true });
    expect(on).toMatch(/script-src [^;]*https:\/\/www\.googletagmanager\.com/);
    expect(on).toMatch(/connect-src [^;]*google-analytics\.com/);
  });

  it("sends HSTS only in production", () => {
    const keys = (isProduction: boolean) => buildSecurityHeaders({ isProduction, analytics: false }).map((h) => h.key);
    expect(keys(true)).toContain("Strict-Transport-Security");
    expect(keys(false)).not.toContain("Strict-Transport-Security");
  });
});

describe("analytics config (FR-23)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("is off when no IDs are set", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "");
    const { analyticsConfig } = await import("@/config/analytics");
    expect(analyticsConfig.gaMeasurementId).toBeUndefined();
  });

  it("accepts real IDs and rejects anything that could inject code", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-AB12CD34EF");
    vi.stubEnv("GOOGLE_SITE_VERIFICATION", "abc123DEF456_ghi-789");
    vi.stubEnv("BING_SITE_VERIFICATION", '"><script>alert(1)</script>');
    const { analyticsConfig } = await import("@/config/analytics");
    expect(analyticsConfig.gaMeasurementId).toBe("G-AB12CD34EF");
    expect(analyticsConfig.googleSiteVerification).toBe("abc123DEF456_ghi-789");
    expect(analyticsConfig.bingSiteVerification).toBeUndefined();
  });
});
