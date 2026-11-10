import { describe, expect, it } from "vitest";
import { fieldErrors, inquirySchema } from "@/lib/validation/inquiry";

const quote = {
  type: "quote",
  name: "Ahmed Khan",
  city: "Lahore",
  phone: "0300 1234567",
  fabric: "AS-201 Cotton Twill 180 GSM",
  colours: "Navy (AS-201-NV)",
  meters: "150",
};

describe("inquiry validation (FR-07, FR-08, FR-09)", () => {
  it("accepts a complete quote and converts meters to a number", () => {
    const result = inquirySchema.parse(quote);
    expect(result).toMatchObject({ type: "quote", meters: 150 });
  });

  it("enforces the MOQ of 100 meters per colour", () => {
    const result = inquirySchema.safeParse({ ...quote, meters: "99" });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).meters).toMatch(/100 meters/);
  });

  it("rejects fractional and non-numeric meters", () => {
    expect(inquirySchema.safeParse({ ...quote, meters: "120.5" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...quote, meters: "lots" }).success).toBe(false);
  });

  it("accepts a sample request without meters", () => {
    const sample = { ...quote, type: "sample" } as Record<string, string>;
    delete sample.meters;
    expect(inquirySchema.safeParse(sample).success).toBe(true);
  });

  it("requires a message on the contact form", () => {
    const contact = { type: "contact", name: "Sara", city: "Karachi", phone: "+92 321 7654321" };
    expect(inquirySchema.safeParse(contact).success).toBe(false);
    expect(inquirySchema.safeParse({ ...contact, message: "Do you stock satin?" }).success).toBe(true);
  });

  it("rejects unknown fields (mass-assignment protection)", () => {
    const result = inquirySchema.safeParse({ ...quote, status: "closed", isAdmin: true });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown inquiry type", () => {
    expect(inquirySchema.safeParse({ ...quote, type: "order" }).success).toBe(false);
  });

  it.each(["abc", "12", "0300-12345678901234567", "<script>alert(1)</script>"])("rejects bad phone %s", (phone) => {
    expect(inquirySchema.safeParse({ ...quote, phone }).success).toBe(false);
  });

  it("trims whitespace and strips control characters", () => {
    const result = inquirySchema.parse({ ...quote, name: "  Ahmed\u0000 Khan\u0007 " });
    expect(result.name).toBe("Ahmed Khan");
  });

  it("caps field lengths", () => {
    expect(inquirySchema.safeParse({ ...quote, name: "a".repeat(81) }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...quote, colours: "a".repeat(301) }).success).toBe(false);
  });

  it("reports one readable message per field", () => {
    const result = inquirySchema.safeParse({ type: "quote" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(errors.name).toBe("Please enter your name.");
      expect(errors.phone).toBe("Please enter your phone or WhatsApp number.");
    }
  });
});
