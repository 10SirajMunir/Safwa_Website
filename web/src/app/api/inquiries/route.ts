// POST /api/inquiries: quote, sample and contact form submissions (FR-07, FR-08, FR-09).
// Phase 1 rate-limits, validates and accepts. Phase 2 adds: save to PostgreSQL + email
// sales (FR-10) and the Turnstile check (NFR-06).
import { parseInquiryRequest } from "@/server/inquiries/parse-request";
import { clientIp, createRateLimiter } from "@/server/security/rate-limit";

const noStore = { "Cache-Control": "no-store" };

// NFR-06: 10 submissions per client per 10 minutes covers a buyer sending a quote, a
// sample request and a message, with room for corrections.
const limiter = createRateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 });

export async function POST(request: Request) {
  const rate = limiter(clientIp(request));
  if (!rate.allowed) {
    return Response.json(
      { error: "Too many requests. Please wait a few minutes, or message us on WhatsApp." },
      { status: 429, headers: { ...noStore, "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  const result = await parseInquiryRequest(request);

  if (!result.ok) {
    return Response.json({ error: result.error, fields: result.fields }, { status: result.status, headers: noStore });
  }

  // Spam (hidden field filled) gets the same response as a real submission so bots learn nothing.
  return Response.json({ ok: true }, { status: 202, headers: noStore });
}
