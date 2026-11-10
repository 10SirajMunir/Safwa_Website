// Domain types for a fabric. Each field maps to a row in PRD §6 "Fabric Catalogue Fields".

export type Weave = "twill" | "plain" | "satin";
export type Finish = "peach" | "mercerised";
export type FabricUse = "shirts" | "uniforms" | "kurtas" | "trousers" | "home-textile";
export type FabricType = "cotton" | "poly-cotton";

/** A catalogue category page: the catalogue filtered by one fabric type or one use (FR-15, AD-04). */
export type CatalogueCategory = { kind: "type"; value: FabricType } | { kind: "use"; value: FabricUse };

export interface FabricColour {
  name: string;
  /** Colour code printed on the swatch card, e.g. "AS-201-NV". */
  code: string;
  /** Display colour for the swatch until a swatch photo is uploaded. */
  hex: string;
  swatchImage?: string;
}

export interface FabricProperties {
  stretch: string;
  shrinkage: string;
  colourFastness: string;
  feel: string;
}

export type Availability =
  | { type: "ready-stock"; dispatchDays: number }
  | { type: "made-to-order"; dispatchDays: number };

export interface PriceSlab {
  /** Lower bound of the quantity slab in meters (inclusive). */
  minMeters: number;
  /** Upper bound in meters (inclusive); undefined = and above. */
  maxMeters?: number;
  /** Price in PKR per meter. */
  pricePerMeter: number;
}

export type Price = { type: "quote" } | { type: "slabs"; slabs: PriceSlab[] };

export type MediaKind = "flat" | "drape" | "texture" | "colour" | "video";

export interface FabricMedia {
  kind: MediaKind;
  src: string;
  alt: string;
  /** For kind "colour": the colour code shown in the photo. */
  colourCode?: string;
}

export interface Fabric {
  code: string;
  slug: string;
  name: string;
  type: FabricType;
  composition: string;
  gsm: number;
  widthInches: number;
  widthCm: number;
  weave: Weave;
  finish?: Finish;
  colours: FabricColour[];
  moq: number;
  uses: FabricUse[];
  properties: FabricProperties;
  /** Care instructions; one entry per line of guidance. */
  care: string[];
  availability: Availability;
  price: Price;
  media: FabricMedia[];
  summary: string;
  featured: boolean;
  seo?: { title?: string; description?: string };
  relatedGuides: string[];
}
