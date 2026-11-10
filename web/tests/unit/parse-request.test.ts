// Backend input handling for POST /api/inquiries, tested without a server.
import { describe, expect, it } from "vitest";
import { parseInquiryRequest } from "@/server/inquiries/parse-request";
import { POST } from "@/app/api/inquiries/route";

const valid = {
  type: "contact",
  name: "Sara Ali",
  city: "Karachi",
  phone: "0321 7654321",
  message: "Do you have satin in black?",
};

const request = (body: BodyInit | null, headers: Record<string, string> = { "content-type": "application/json" }) =>
  new Request("http://localhost/api/inquiries", { method: "POST", body, headers });

describe("parseInquiryRequest", () => {
  it("accepts valid JSON", async () => {
    const result = await parseInquiryRequest(request(JSON.stringify(valid)));
    expect(result).toMatchObject({ ok: true, isSpam: false });
  });

  it("returns 415 for non-JSON content types", async () => {
    const result = await parseInquiryRequest(request("name=x", { "content-type": "application/x-www-form-urlencoded" }));
    expect(result).toMatchObject({ ok: false, status: 415 });
  });

  it("returns 400 for malformed JSON", async () => {
    expect(await parseInquiryRequest(request("{not json"))).toMatchObject({ ok: false, status: 400 });
  });

  it("returns 413 when the body is too large, even without Content-Length", async () => {
    const big = JSON.stringify({ ...valid, message: "x".repeat(20_000) });
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(big));
        controller.close();
      },
    });
    const req = new Request("http://localhost/api/inquiries", {
      method: "POST",
      body: stream,
      headers: { "content-type": "application/json" },
      duplex: "half",
    } as RequestInit);
    expect(await parseInquiryRequest(req)).toMatchObject({ ok: false, status: 413 });
  });

  it("returns 413 from a large declared Content-Length without reading the body", async () => {
    const req = request(JSON.stringify(valid), { "content-type": "application/json", "content-length": "999999" });
    expect(await parseInquiryRequest(req)).toMatchObject({ ok: false, status: 413 });
  });

  it("returns 422 with per-field errors", async () => {
    const result = await parseInquiryRequest(request(JSON.stringify({ ...valid, phone: "x" })));
    expect(result).toMatchObject({ ok: false, status: 422 });
    if (!result.ok) expect(result.fields?.phone).toBeDefined();
  });

  it("flags the honeypot as spam", async () => {
    const result = await parseInquiryRequest(request(JSON.stringify({ ...valid, company_website: "http://spam" })));
    expect(result).toMatchObject({ ok: true, isSpam: true });
  });
});

describe("POST /api/inquiries", () => {
  it("answers 202 and is never cached", async () => {
    const response = await POST(request(JSON.stringify(valid)));
    expect(response.status).toBe(202);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("does not echo submitted values back in errors", async () => {
    const payload = { ...valid, name: "<img src=x onerror=alert(1)>", phone: "bad" };
    const response = await POST(request(JSON.stringify(payload)));
    expect(response.status).toBe(422);
    expect(await response.text()).not.toContain("onerror");
  });
});
