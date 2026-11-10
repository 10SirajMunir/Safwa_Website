// Guards the catalogue data against mistakes the owner (or Phase 2 import) could make.
import { describe, expect, it } from "vitest";
import { fabrics } from "@/content/fabrics";
import { articles } from "@/content/articles";

describe("fabric data (PRD §6)", () => {
  it("has unique codes and slugs", () => {
    expect(new Set(fabrics.map((f) => f.code)).size).toBe(fabrics.length);
    expect(new Set(fabrics.map((f) => f.slug)).size).toBe(fabrics.length);
  });

  it("uses clean slugs that end with the GSM (FR-14)", () => {
    for (const f of fabrics) expect(f.slug).toMatch(new RegExp(`^[a-z0-9]+(-[a-z0-9]+)*-${f.gsm}-gsm$`));
  });

  it("keeps the MOQ at 100 meters per colour", () => {
    for (const f of fabrics) expect(f.moq).toBe(100);
  });

  it("gives every colour a name, a unique code and a valid hex", () => {
    const codes = fabrics.flatMap((f) => f.colours.map((c) => c.code));
    expect(new Set(codes).size).toBe(codes.length);
    for (const f of fabrics) {
      expect(f.colours.length).toBeGreaterThan(0);
      for (const c of f.colours) expect(c.hex).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it("keeps width in inches and cm consistent (±1 cm)", () => {
    for (const f of fabrics) expect(Math.abs(f.widthInches * 2.54 - f.widthCm)).toBeLessThanOrEqual(1);
  });

  it("links only to guides that exist (FR-05)", () => {
    const slugs = new Set(articles.map((a) => a.slug));
    for (const f of fabrics) for (const g of f.relatedGuides) expect(slugs).toContain(g);
  });
});

describe("guide data (FR-18)", () => {
  it("links only to fabrics that exist", () => {
    const slugs = new Set(fabrics.map((f) => f.slug));
    for (const a of articles) for (const s of a.relatedFabrics) expect(slugs).toContain(s);
  });

  it("keeps descriptions within the meta description limit", () => {
    for (const a of articles) expect(a.description.length).toBeLessThanOrEqual(160);
  });
});
