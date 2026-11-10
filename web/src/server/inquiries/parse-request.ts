// Turns an incoming HTTP request into a validated inquiry, or a precise error.
// Defensive by design: JSON only, size-capped while streaming, strict schema
// (unknown fields rejected), control characters stripped.
import { fieldErrors, inquirySchema, MAX_INQUIRY_BYTES, type Inquiry } from "@/lib/validation/inquiry";

export type ParseResult =
  | { ok: true; inquiry: Inquiry; isSpam: boolean }
  | { ok: false; status: 400 | 413 | 415 | 422; error: string; fields?: Record<string, string | undefined> };

class BodyTooLargeError extends Error {}

async function readBodyWithLimit(request: Request, limit: number): Promise<string> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > limit) throw new BodyTooLargeError();
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > limit) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export async function parseInquiryRequest(request: Request): Promise<ParseResult> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return { ok: false, status: 415, error: "Content-Type must be application/json." };
  }

  let raw: string;
  try {
    raw = await readBodyWithLimit(request, MAX_INQUIRY_BYTES);
  } catch (error) {
    if (error instanceof BodyTooLargeError) return { ok: false, status: 413, error: "Request is too large." };
    throw error;
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, status: 400, error: "Request body is not valid JSON." };
  }

  const parsed = inquirySchema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, status: 422, error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) };
  }

  return { ok: true, inquiry: parsed.data, isSpam: Boolean(parsed.data.company_website) };
}
