// FR-15: unique, auto-filled title and meta description for every fabric and category.
// An owner override in `fabric.seo` (editable in admin from Phase 2, AD-03) wins.
import type { CatalogueCategory, Fabric } from "@/types/fabric";
import { fabricTypeLabels, useLabels } from "@/lib/labels";
import { fabricDisplayName, formatAvailability, formatMoq } from "@/lib/format";

const DESCRIPTION_LIMIT = 160;

function clamp(text: string, limit = DESCRIPTION_LIMIT): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function fabricMetaTitle(fabric: Fabric): string {
  return fabric.seo?.title ?? `${fabricDisplayName(fabric)} – ${fabric.composition}`;
}

export function fabricMetaDescription(fabric: Fabric): string {
  if (fabric.seo?.description) return fabric.seo.description;
  const colours = `${fabric.colours.length} ${fabric.colours.length === 1 ? "colour" : "colours"}`;
  return clamp(
    `${fabricDisplayName(fabric)}, ${fabric.widthInches}" wide, ${fabric.composition}. MOQ ${formatMoq(fabric.moq)}. ${colours}, ${formatAvailability(fabric.availability).toLowerCase()}. Request a quote on WhatsApp.`,
  );
}

/** "Cotton fabrics" for a type, "Fabrics for shirts" for a use. */
export function categoryHeading(category: CatalogueCategory): string {
  return category.kind === "type"
    ? `${fabricTypeLabels[category.value]} fabrics`
    : `Fabrics for ${useLabels[category.value].toLowerCase()}`;
}

export function categoryMetaTitle(category: CatalogueCategory): string {
  return `${categoryHeading(category)} in Pakistan – by GSM, width and colour`;
}

export function categoryMetaDescription(category: CatalogueCategory, count: number): string {
  const what =
    category.kind === "type"
      ? `${fabricTypeLabels[category.value].toLowerCase()} fabrics`
      : `fabrics for ${useLabels[category.value].toLowerCase()}`;
  return clamp(
    `${count} ${what} with full specs: GSM, width, composition and colour codes. MOQ 100 m per colour. Ask for a quote on WhatsApp.`,
  );
}
