// NFR-06 (gap G7): one client cannot flood the inquiry endpoint.
import { expect, test } from "@playwright/test";
import { uniqueClientIp } from "../support/client-ip";

const ENDPOINT = "/api/inquiries";
const valid = { type: "contact", name: "Sara Ali", city: "Karachi", phone: "0321 7654321", message: "Hello there" };

test("the 11th submission in 10 minutes is refused with 429 and Retry-After; other clients are unaffected", async ({
  playwright,
  baseURL,
}) => {
  const attacker = await playwright.request.newContext({ baseURL, extraHTTPHeaders: { "x-forwarded-for": uniqueClientIp() } });
  for (let i = 0; i < 10; i++) expect((await attacker.post(ENDPOINT, { data: valid })).status()).toBe(202);

  const blocked = await attacker.post(ENDPOINT, { data: valid });
  expect(blocked.status()).toBe(429);
  expect(Number(blocked.headers()["retry-after"])).toBeGreaterThan(0);
  expect((await blocked.json()).error).toMatch(/WhatsApp/);

  // Invalid requests count too, so a flood of junk is also capped.
  expect((await attacker.post(ENDPOINT, { data: { junk: true } })).status()).toBe(429);

  const buyer = await playwright.request.newContext({ baseURL, extraHTTPHeaders: { "x-forwarded-for": uniqueClientIp() } });
  expect((await buyer.post(ENDPOINT, { data: valid })).status()).toBe(202);

  await attacker.dispose();
  await buyer.dispose();
});
