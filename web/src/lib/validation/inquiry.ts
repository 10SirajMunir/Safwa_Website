// One schema validates inquiries in the browser (instant feedback) and on the server
// (the only check that counts). FR-07 quote, FR-08 sample, FR-09 contact.
import { z } from "zod";

// Our Content-Security-Policy forbids eval; without this Zod probes `new Function`
// in the browser and triggers a CSP violation (NFR-06).
z.config({ jitless: true });

export const MAX_INQUIRY_BYTES = 8 * 1024;
export const MIN_ORDER_METERS = 100;

// Strip control characters (keeps normal text, newlines and tabs).
const clean = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const text = (label: string, min: number, max: number) =>
  z
    .string({ error: `Please enter your ${label}.` })
    .transform(clean)
    .pipe(
      z
        .string()
        .min(1, { error: `Please enter your ${label}.` })
        .min(min, { error: `${label[0].toUpperCase()}${label.slice(1)} is too short.` })
        .max(max, { error: `Please keep this under ${max} characters.` }),
    );

const optionalText = (max: number) =>
  z
    .string()
    .transform(clean)
    .pipe(z.string().max(max, { error: `Please keep this under ${max} characters.` }))
    .optional();

const phone = z
  .string({ error: "Please enter your phone or WhatsApp number." })
  .transform(clean)
  .pipe(
    z
      .string()
      .min(1, { error: "Please enter your phone or WhatsApp number." })
      .regex(/^\+?[0-9][0-9 ()-]{6,18}[0-9]$/, { error: "Please enter a valid phone number, e.g. 0300 1234567." }),
  );

// Hidden field that people never see; bots tend to fill it (NFR-06 spam protection).
const honeypot = z.string().max(200).optional();

const shared = {
  name: text("name", 2, 80),
  business: optionalText(120),
  city: text("city", 2, 60),
  phone,
  company_website: honeypot,
};

const fabricFields = {
  fabric: text("fabric", 1, 120),
  colours: text("colours", 1, 300),
};

export const quoteInquirySchema = z.strictObject({
  type: z.literal("quote"),
  ...shared,
  ...fabricFields,
  meters: z.coerce
    .number({ error: "Please enter the meters you need." })
    .int({ error: "Please enter whole meters." })
    .min(MIN_ORDER_METERS, { error: `Minimum order is ${MIN_ORDER_METERS} meters per colour.` })
    .max(1_000_000, { error: "Please contact us directly for this quantity." }),
});

export const sampleInquirySchema = z.strictObject({
  type: z.literal("sample"),
  ...shared,
  ...fabricFields,
});

export const contactInquirySchema = z.strictObject({
  type: z.literal("contact"),
  ...shared,
  message: text("message", 5, 2000),
});

export const inquirySchema = z.discriminatedUnion("type", [
  quoteInquirySchema,
  sampleInquirySchema,
  contactInquirySchema,
]);

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;
export type InquiryType = Inquiry["type"];
export type InquiryFieldErrors = Partial<Record<string, string>>;

/** First error message per field, keyed by field name, for showing under each input. */
export function fieldErrors(error: z.ZodError): InquiryFieldErrors {
  const result: InquiryFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "form";
    result[key] ??= issue.message;
  }
  return result;
}
