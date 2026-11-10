// FR-01: catalogue filters (fabric type, GSM, composition, width, colour, use).
// Filters arrive as URL query parameters so they work with a plain GET form and
// without JavaScript (NFR-05). Only values that exist in the catalogue are accepted.
import type { CatalogueCategory, Fabric, FabricType, FabricUse } from "@/types/fabric";
import { fabricTypeLabels, useLabels } from "@/lib/labels";
import { slugify } from "@/lib/slug";

export const FILTER_KEYS = ["type", "gsm", "composition", "width", "colour", "use"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export type CatalogFilters = Partial<Record<FilterKey, string>>;
export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export interface FilterOption {
  value: string;
  label: string;
}
export type FilterOptions = Record<FilterKey, FilterOption[]>;

export const GSM_BANDS = [
  { value: "light", label: "Light · up to 140 GSM", min: 0, max: 140 },
  { value: "medium", label: "Medium · 141–200 GSM", min: 141, max: 200 },
  { value: "heavy", label: "Heavy · over 200 GSM", min: 201, max: Number.POSITIVE_INFINITY },
] as const;

export const FILTER_LABELS: Record<FilterKey, string> = {
  type: "Fabric type",
  gsm: "Weight (GSM)",
  composition: "Composition",
  width: "Width",
  colour: "Colour",
  use: "Use",
};

function uniqueOptions(options: FilterOption[]): FilterOption[] {
  const seen = new Map<string, FilterOption>();
  for (const option of options) if (!seen.has(option.value)) seen.set(option.value, option);
  return [...seen.values()];
}

/** Options shown in each filter, built from the fabrics that actually exist. */
export function getFilterOptions(fabrics: Fabric[]): FilterOptions {
  const byLabel = (a: FilterOption, b: FilterOption) => a.label.localeCompare(b.label);
  return {
    type: uniqueOptions(fabrics.map((f) => ({ value: f.type, label: fabricTypeLabels[f.type] }))).sort(byLabel),
    gsm: GSM_BANDS.filter((band) => fabrics.some((f) => f.gsm >= band.min && f.gsm <= band.max)).map(
      ({ value, label }) => ({ value, label }),
    ),
    composition: uniqueOptions(
      fabrics.map((f) => ({ value: slugify(f.composition), label: f.composition })),
    ).sort(byLabel),
    width: uniqueOptions(
      fabrics.map((f) => ({ value: String(f.widthInches), label: `${f.widthInches}" / ${f.widthCm} cm` })),
    ).sort((a, b) => Number(a.value) - Number(b.value)),
    colour: uniqueOptions(
      fabrics.flatMap((f) => f.colours.map((c) => ({ value: slugify(c.name), label: c.name }))),
    ).sort(byLabel),
    use: uniqueOptions(
      fabrics.flatMap((f) => f.uses.map((u) => ({ value: u, label: useLabels[u] }))),
    ).sort(byLabel),
  };
}

/** Reads filters from search params, ignoring anything that is not a known option. */
export function parseFilters(params: SearchParamsRecord, options: FilterOptions): CatalogFilters {
  const filters: CatalogFilters = {};
  for (const key of FILTER_KEYS) {
    const raw = params[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value && options[key].some((option) => option.value === value)) filters[key] = value;
  }
  return filters;
}

function matches(fabric: Fabric, key: FilterKey, value: string): boolean {
  switch (key) {
    case "type":
      return fabric.type === (value as FabricType);
    case "gsm": {
      const band = GSM_BANDS.find((b) => b.value === value);
      return band !== undefined && fabric.gsm >= band.min && fabric.gsm <= band.max;
    }
    case "composition":
      return slugify(fabric.composition) === value;
    case "width":
      return String(fabric.widthInches) === value;
    case "colour":
      return fabric.colours.some((c) => slugify(c.name) === value);
    case "use":
      return fabric.uses.includes(value as FabricUse);
  }
}

export function applyFilters(fabrics: Fabric[], filters: CatalogFilters): Fabric[] {
  const active = Object.entries(filters) as [FilterKey, string][];
  return fabrics.filter((fabric) => active.every(([key, value]) => matches(fabric, key, value)));
}

export function activeFilterCount(filters: CatalogFilters): number {
  return Object.keys(filters).length;
}

/** Filtered by exactly one fabric type or one use → a category page with its own H1, title and canonical. */
export function categoryOf(filters: CatalogFilters): CatalogueCategory | undefined {
  if (activeFilterCount(filters) !== 1) return undefined;
  if (filters.type) return { kind: "type", value: filters.type as FabricType };
  if (filters.use) return { kind: "use", value: filters.use as FabricUse };
  return undefined;
}

export function filtersToQuery(filters: CatalogFilters): string {
  const query = new URLSearchParams();
  for (const key of FILTER_KEYS) if (filters[key]) query.set(key, filters[key]);
  const result = query.toString();
  return result ? `?${result}` : "";
}
