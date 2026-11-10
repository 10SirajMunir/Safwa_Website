// NFR-06: fixed-window rate limiting for public form submissions.
// In-memory is enough for PRD §8's single-server deployment; memory is bounded.

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  /** Upper bound on tracked clients, so a flood of fake addresses cannot exhaust memory. */
  maxKeys?: number;
  now?: () => number;
}

export function createRateLimiter({ limit, windowMs, maxKeys = 10_000, now = Date.now }: RateLimiterOptions) {
  const windows = new Map<string, { count: number; resetAt: number }>();

  function makeRoom(time: number) {
    for (const [key, entry] of windows) if (entry.resetAt <= time) windows.delete(key);
    // Still full: drop the oldest windows (Map keeps insertion order).
    for (const key of windows.keys()) {
      if (windows.size < maxKeys) break;
      windows.delete(key);
    }
  }

  return function check(key: string): RateLimitResult {
    const time = now();
    let entry = windows.get(key);
    if (!entry || entry.resetAt <= time) {
      if (!entry && windows.size >= maxKeys) makeRoom(time);
      entry = { count: 0, resetAt: time + windowMs };
      windows.set(key, entry);
    }
    entry.count += 1;
    const allowed = entry.count <= limit;
    return {
      allowed,
      remaining: Math.max(0, limit - entry.count),
      retryAfterSeconds: allowed ? 0 : Math.ceil((entry.resetAt - time) / 1000),
    };
  };
}

/**
 * The client's IP from a header set by the trusted proxy in front of the app.
 * Production (PRD §8: Cloudflare) sets CLIENT_IP_HEADER=cf-connecting-ip and only accepts
 * traffic from Cloudflare, so the value cannot be forged.
 */
export function clientIp(request: Request, headerName = process.env.CLIENT_IP_HEADER ?? "x-forwarded-for"): string {
  const value = request.headers.get(headerName);
  return value?.split(",")[0]?.trim() || "unknown";
}
