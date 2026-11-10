// NFR-06: security headers on every response. Imported by next.config.ts.
// Inline scripts/styles are allowed because statically prerendered pages cannot carry a
// per-request nonce. Google Maps is the only third-party frame (FR-09). Google Analytics
// origins are added only when analytics is switched on (FR-23).

const ANALYTICS_SCRIPT = "https://www.googletagmanager.com";
const ANALYTICS_CONNECT = "https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com";
const ANALYTICS_IMG = "https://*.google-analytics.com https://www.googletagmanager.com";

interface SecurityOptions {
  isProduction: boolean;
  analytics: boolean;
}

export function buildContentSecurityPolicy({ isProduction, analytics }: SecurityOptions): string {
  const withAnalytics = (base: string, extra: string) => (analytics ? `${base} ${extra}` : base);
  return [
    "default-src 'self'",
    withAnalytics(`script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`, ANALYTICS_SCRIPT),
    "style-src 'self' 'unsafe-inline'",
    withAnalytics("img-src 'self' data: blob:", ANALYTICS_IMG),
    "font-src 'self'",
    withAnalytics("connect-src 'self'", ANALYTICS_CONNECT),
    "frame-src https://www.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    // No "upgrade-insecure-requests": it rewrites assets to https:// and breaks the site on
    // plain-http hosts (LAN testing). HTTPS is enforced by Cloudflare + HSTS in Phase 3.
  ].join("; ");
}

export function buildSecurityHeaders(options: SecurityOptions) {
  return [
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy(options) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ...(options.isProduction
      ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
      : []),
  ];
}
