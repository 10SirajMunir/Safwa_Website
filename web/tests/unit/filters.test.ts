import { describe, expect, it } from "vitest";
import { fabrics } from "@/content/fabrics";
import {
  activeFilterCount,
  applyFilters,
  categoryOf,
  filtersToQuery,
  getFilterOptions,
  parseFilters,
} from "@/server/catalog/filters";

const options = getFilterOptions(fabrics);

describe("catalogue filters (FR-01)", () => {
  it("offers all six PRD filters, built from real catalogue values", () => {
    expect(Object.keys(options)).toEqual(["type", "gsm", "composition", "width", "colour", "use"]);
    expect(options.type.map((o) => o.value).sort()).toEqual(["cotton", "poly-cotton"]);
    expect(options.composition.map((o) => o.label)).toContain("65% Polyester 35% Cotton");
    expect(options.width).toEqual([{ value: "58", label: '58" / 147 cm' }]);
    expect(options.colour.map((o) => o.value)).toContain("navy");
  });

  it("only shows GSM bands that contain at least one fabric", () => {
    const light = getFilterOptions(fabrics.filter((f) => f.gsm <= 140));
    expect(light.gsm.map((o) => o.value)).toEqual(["light"]);
  });

  it("ignores unknown values and arrays from the URL", () => {
    const filters = parseFilters(
      { type: "silk", gsm: ["heavy", "light"], colour: "<script>", use: "uniforms", other: "x" },
      options,
    );
    expect(filters).toEqual({ gsm: "heavy", use: "uniforms" });
  });

  it("combines filters with AND", () => {
    const result = applyFilters(fabrics, { type: "cotton", gsm: "heavy" });
    expect(result.map((f) => f.slug)).toEqual(["heavy-cotton-twill-240-gsm"]);
  });

  it("filters by GSM band boundaries", () => {
    expect(applyFilters(fabrics, { gsm: "light" }).every((f) => f.gsm <= 140)).toBe(true);
    expect(applyFilters(fabrics, { gsm: "medium" }).every((f) => f.gsm > 140 && f.gsm <= 200)).toBe(true);
  });

  it("filters by colour name and by composition slug", () => {
    expect(applyFilters(fabrics, { colour: "olive" }).map((f) => f.code)).toEqual(["AS-201"]);
    expect(applyFilters(fabrics, { composition: "65-polyester-35-cotton" })).toHaveLength(2);
  });

  it("returns everything with no filters, nothing for an impossible combination", () => {
    expect(applyFilters(fabrics, {})).toHaveLength(fabrics.length);
    expect(applyFilters(fabrics, { type: "poly-cotton", colour: "olive" })).toHaveLength(0);
  });

  it("builds clean query strings in a fixed order", () => {
    expect(filtersToQuery({ use: "shirts", type: "cotton" })).toBe("?type=cotton&use=shirts");
    expect(filtersToQuery({})).toBe("");
    expect(activeFilterCount({ type: "cotton", use: "shirts" })).toBe(2);
  });

  it("treats exactly one type or one use as a category page (FR-15)", () => {
    expect(categoryOf({ type: "cotton" })).toEqual({ kind: "type", value: "cotton" });
    expect(categoryOf({ use: "shirts" })).toEqual({ kind: "use", value: "shirts" });
    expect(categoryOf({ gsm: "light" })).toBeUndefined();
    expect(categoryOf({ type: "cotton", use: "shirts" })).toBeUndefined();
    expect(categoryOf({})).toBeUndefined();
  });
});
