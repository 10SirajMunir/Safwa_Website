// Attacker's view of POST /api/inquiries (the only Phase-1 backend endpoint).
// Each test is an attempt to break it; all must fail safely.
import { expect, test as base, type APIRequestContext } from "@playwright/test";
import { uniqueClientIp } from "../support/client-ip";

// Each attack test runs as its own client so the rate limiter does not mask the result.
const test = base.extend<{ api: APIRequestContext }>({
  api: async ({ playwright, baseURL }, provide) => {
    const api = await playwright.request.newContext({ baseURL, extraHTTPHeaders: { "x-forwarded-for": uniqueClientIp() } });
    await provide(api);
    await api.dispose();
  },
});

const ENDPOINT = "/api/inquiries";
const valid = { type: "contact", name: "Sara Ali", city: "Karachi", phone: "0321 7654321", message: "Hello there" };

test("only POST is allowed", async ({ api }) => {
  for (const method of ["GET", "PUT", "DELETE", "PATCH"] as const) {
    const response = await api.fetch(ENDPOINT, { method });
    expect(response.status(), method).toBe(405);
  }
});

test("rejects form-encoded and text bodies (CSRF-style simple requests)", async ({ api }) => {
  const form = await api.post(ENDPOINT, { form: { type: "contact", name: "x" } });
  expect(form.status()).toBe(415);
  const text = await api.post(ENDPOINT, { data: JSON.stringify(valid), headers: { "content-type": "text/plain" } });
  expect(text.status()).toBe(415);
});

test("rejects malformed JSON without leaking a stack trace", async ({ api }) => {
  const response = await api.post(ENDPOINT, { data: Buffer.from('{"type":'), headers: { "content-type": "application/json" } });
  expect(response.status()).toBe(400);
  const body = await response.text();
  expect(body).not.toMatch(/at \w+ \(|node_modules|SyntaxError/);
});

test("rejects oversized bodies (413)", async ({ api }) => {
  const response = await api.post(ENDPOINT, { data: { ...valid, message: "A".repeat(50_000) } });
  expect(response.status()).toBe(413);
});

test("rejects extra fields (mass assignment) and unknown inquiry types", async ({ api }) => {
  expect((await api.post(ENDPOINT, { data: { ...valid, status: "closed" } })).status()).toBe(422);
  expect((await api.post(ENDPOINT, { data: { ...valid, type: "order", amount: 1 } })).status()).toBe(422);
});

test("rejects prototype-pollution keys", async ({ api }) => {
  const raw = JSON.stringify(valid).replace(/}$/, ',"__proto__":{"isAdmin":true}}');
  const response = await api.post(ENDPOINT, { data: Buffer.from(raw), headers: { "content-type": "application/json" } });
  expect(response.status()).toBe(422);
});

test("rejects wrong types instead of coercing them", async ({ api }) => {
  for (const name of [123, ["a", "b"], { $ne: "" }, null]) {
    const response = await api.post(ENDPOINT, { data: { ...valid, name } });
    expect(response.status(), JSON.stringify(name)).toBe(422);
  }
});

test("injection payloads are not reflected back", async ({ api }) => {
  const payloads = ["<script>alert(1)</script>", "' OR 1=1 --", "${7*7}", "{{7*7}}", "../../etc/passwd"];
  for (const payload of payloads) {
    const response = await api.post(ENDPOINT, { data: { ...valid, phone: payload } });
    expect(response.status()).toBe(422);
    expect(await response.text()).not.toContain(payload);
  }
});

test("enforces the MOQ server-side even if the browser check is bypassed", async ({ api }) => {
  const response = await api.post(ENDPOINT, {
    data: { type: "quote", name: "Ali", city: "Lahore", phone: "03001234567", fabric: "AS-201", colours: "Navy", meters: 1 },
  });
  expect(response.status()).toBe(422);
  expect((await response.json()).fields.meters).toMatch(/100 meters/);
});

test("bots filling the hidden field get the same answer as people", async ({ api }) => {
  const response = await api.post(ENDPOINT, { data: { ...valid, company_website: "http://spam.example" } });
  expect(response.status()).toBe(202);
  expect(await response.json()).toEqual({ ok: true });
});

test("responses are never cached", async ({ api }) => {
  const response = await api.post(ENDPOINT, { data: valid });
  expect(response.headers()["cache-control"]).toBe("no-store");
});
