import type { Availability, Fabric, Price } from "@/types/fabric";

const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export function formatWidth(fabric: Pick<Fabric, "widthInches" | "widthCm">): string {
  return `${fabric.widthInches}" / ${fabric.widthCm} cm`;
}

export function formatMoq(moq: number): string {
  return `${moq} m per colour`;
}

export function formatAvailability(availability: Availability): string {
  const days = `${availability.dispatchDays} ${availability.dispatchDays === 1 ? "day" : "days"}`;
  return availability.type === "ready-stock"
    ? `Ready stock · dispatch in ${days}`
    : `Made to order · dispatch in ${days}`;
}

export function formatPkr(amount: number): string {
  return `Rs ${pkr.format(amount)}`;
}

export function formatPriceSummary(price: Price): string {
  if (price.type === "quote") return "Request a quote";
  const values = price.slabs.map((slab) => slab.pricePerMeter);
  const low = Math.min(...values);
  const high = Math.max(...values);
  return low === high
    ? `${formatPkr(low)} per meter`
    : `${formatPkr(low)} – ${formatPkr(high)} per meter`;
}

export function formatSlabRange(minMeters: number, maxMeters?: number): string {
  return maxMeters === undefined ? `${minMeters} m and above` : `${minMeters}–${maxMeters} m`;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "Cotton Twill 180 GSM" — the display name used in headings, links and messages. */
export function fabricDisplayName(fabric: Pick<Fabric, "name" | "gsm">): string {
  return `${fabric.name} ${fabric.gsm} GSM`;
}
