import { describe, expect, it } from "vitest";
import { fabrics } from "@/content/fabrics";
import { faqs } from "@/content/faq";
import { formatWhatsAppNumber, whatsappUrl } from "@/lib/whatsapp";
import { categoryMetaDescription, categoryMetaTitle, fabricMetaDescription, fabricMetaTitle } from "@/lib/seo";
import { formatAvailability, formatPriceSummary, formatWidth } from "@/lib/format";
import { faqPageJsonLd, productJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { slugify } from "@/lib/slug";
import type { Fabric } from "@/types/fabric";

const twill = fabrics.find((f) => f.code === "AS-201")!;

describe("WhatsApp links (FR-06)", () => {
  it("pre-fills a message naming the fabric", () => {
    const url = new URL(whatsappUrl({ code: "AS-201", label: "Cotton Twill 180 GSM" }, "+92 300 000-0000"));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/923000000000");
    expect(url.searchParams.get("text")).toContain("AS-201 Cotton Twill 180 GSM");
  });

  it("uses a general greeting when no fabric is given", () => {
    expect(new URL(whatsappUrl()).searchParams.get("text")).toMatch(/ask about your fabrics/);
  });
});

describe("metadata (FR-15)", () => {
  it("gives every fabric a unique title and description within search limits", () => {
    const titles = fabrics.map(fabricMetaTitle);
    const descriptions = fabrics.map(fabricMetaDescription);
    expect(new Set(titles).size).toBe(fabrics.length);
    expect(new Set(descriptions).size).toBe(fabrics.length);
    for (const d of descriptions) expect(d.length).toBeLessThanOrEqual(160);
  });

  it("puts GSM, width, composition and MOQ in the description", () => {
    expect(fabricMetaDescription(twill)).toMatch(/180 GSM.*58".*100% Cotton.*MOQ 100 m per colour/);
  });

  it("lets an owner override win", () => {
    const custom: Fabric = { ...twill, seo: { title: "Custom", description: "Custom description" } };
    expect(fabricMetaTitle(custom)).toBe("Custom");
    expect(fabricMetaDescription(custom)).toBe("Custom description");
  });

  it("titles category pages for fabric types and for uses (FR-15)", () => {
    expect(categoryMetaTitle({ kind: "type", value: "cotton" })).toMatch(/^Cotton fabrics in Pakistan/);
    expect(categoryMetaTitle({ kind: "use", value: "home-textile" })).toMatch(/^Fabrics for home textile in Pakistan/);
    expect(categoryMetaDescription({ kind: "use", value: "shirts" }, 3)).toMatch(/^3 fabrics for shirts with full specs/);
  });

  it("formats the WhatsApp number for display", () => {
    expect(formatWhatsAppNumber("923001234567")).toBe("+92 300 1234567");
    expect(formatWhatsAppNumber("+44 20 7946 0000")).toBe("+442079460000");
  });
});

describe("formatting", () => {
  it("shows width in inches and cm, availability, and price", () => {
    expect(formatWidth(twill)).toBe('58" / 147 cm');
    expect(formatAvailability({ type: "made-to-order", dispatchDays: 1 })).toBe("Made to order · dispatch in 1 day");
    expect(formatPriceSummary({ type: "quote" })).toBe("Request a quote");
    expect(
      formatPriceSummary({ type: "slabs", slabs: [{ minMeters: 100, pricePerMeter: 900 }, { minMeters: 500, pricePerMeter: 820 }] }),
    ).toMatch(/Rs 820 – Rs 900 per meter/);
  });

  it("makes clean slugs (FR-14)", () => {
    expect(slugify("65% Polyester 35% Cotton")).toBe("65-polyester-35-cotton");
    expect(slugify("  Café Satin! ")).toBe("cafe-satin");
  });
});

describe("structured data (FR-20)", () => {
  it("describes a fabric as a Product with GSM, width and MOQ", () => {
    const data = productJsonLd(twill) as Record<string, unknown>;
    expect(data["@type"]).toBe("Product");
    expect(data.sku).toBe("AS-201");
    expect(JSON.stringify(data.additionalProperty)).toContain('"name":"GSM","value":180');
    expect(data.offers).toBeUndefined();
  });

  it("adds an AggregateOffer in PKR when price slabs exist", () => {
    const priced: Fabric = {
      ...twill,
      price: { type: "slabs", slabs: [{ minMeters: 100, pricePerMeter: 950 }, { minMeters: 500, pricePerMeter: 880 }] },
    };
    expect(productJsonLd(priced).offers).toMatchObject({ priceCurrency: "PKR", lowPrice: 880, highPrice: 950 });
  });

  it("lists every FAQ as a Question with an accepted answer", () => {
    const data = faqPageJsonLd(faqs) as { mainEntity: unknown[] };
    expect(data.mainEntity).toHaveLength(faqs.length);
  });

  it("escapes '<' so content cannot close the script tag", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});
