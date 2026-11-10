// FR-20: JSON-LD for Organization, LocalBusiness, Product and FAQPage.
import { absoluteUrl, formatAddress, siteConfig } from "@/config/site";
import type { Fabric } from "@/types/fabric";
import type { FaqItem } from "@/types/content";
import { fabricDisplayName, formatWidth } from "@/lib/format";
import { fabricMetaDescription } from "@/lib/seo";

type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = absoluteUrl("/#organization");
const LOGO_URL = absoluteUrl("/icon.png");

function sameAs(): string[] {
  return Object.values(siteConfig.social).filter((url) => url.length > 0);
}

function postalAddress(): JsonLd {
  const { street, city, region, postalCode, countryCode } = siteConfig.address;
  return {
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: city,
    ...(region ? { addressRegion: region } : {}),
    ...(postalCode ? { postalCode } : {}),
    addressCountry: countryCode,
  };
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: LOGO_URL,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: postalAddress(),
    ...(sameAs().length > 0 && { sameAs: sameAs() }),
  };
}

export function localBusinessJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#localbusiness"),
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: LOGO_URL,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: postalAddress(),
    areaServed: { "@type": "Country", name: siteConfig.address.country },
    parentOrganization: { "@id": ORGANIZATION_ID },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress())}`,
  };
}

export function productJsonLd(fabric: Fabric): JsonLd {
  const url = absoluteUrl(`/fabrics/${fabric.slug}`);
  const images = fabric.media.filter((m) => m.kind !== "video").map((m) => absoluteUrl(m.src));
  const prices = fabric.price.type === "slabs" ? fabric.price.slabs.map((s) => s.pricePerMeter) : [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: fabricDisplayName(fabric),
    sku: fabric.code,
    url,
    description: fabricMetaDescription(fabric),
    ...(images.length > 0 && { image: images }),
    brand: { "@type": "Brand", name: siteConfig.name },
    material: fabric.composition,
    color: fabric.colours.map((c) => c.name).join(", "),
    additionalProperty: [
      { "@type": "PropertyValue", name: "GSM", value: fabric.gsm, unitText: "g/m²" },
      { "@type": "PropertyValue", name: "Width", value: formatWidth(fabric) },
      { "@type": "PropertyValue", name: "MOQ", value: fabric.moq, unitText: "meters per colour" },
    ],
    ...(prices.length > 0 && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "PKR",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        availability:
          fabric.availability.type === "ready-stock" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        seller: { "@id": ORGANIZATION_ID },
      },
    }),
  };
}

export function faqPageJsonLd(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Serialise for a <script type="application/ld+json"> tag; escaping "<" prevents breaking out of the tag. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
