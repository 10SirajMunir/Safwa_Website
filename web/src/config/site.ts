// Single source of business details (FR-19, AD-08). Footer, contact page, JSON-LD,
// llms.txt and the WhatsApp button all read from here. Phase 2 moves these values
// into the admin "Site settings" screen.
//
// PLACEHOLDER VALUES: address, phone, WhatsApp, email and social links are waiting
// for the owner (Open Question OQ-03). They must be replaced before launch.

export const siteConfig = {
  name: "Al Safwa Fabrics",
  shortName: "Al Safwa",
  description:
    "Fabric supplier in Pakistan. Cotton and poly-cotton fabrics by GSM, width and colour, with a low MOQ of 100 meters per colour.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_PK",
  moqMeters: 100,
  address: {
    street: "Address to be confirmed",
    city: "City to be confirmed",
    region: "",
    postalCode: "",
    country: "Pakistan",
    countryCode: "PK",
  },
  phone: "+92 300 0000000",
  whatsappNumber: "923000000000",
  email: "sales@example.com",
  social: {
    facebook: "",
    instagram: "",
  },
  paymentMethods: ["Cash on delivery", "Easypaisa", "JazzCash", "Bank transfer"],
} as const;

export type SiteConfig = typeof siteConfig;

export function formatAddress(config: SiteConfig = siteConfig): string {
  const { street, city, region, postalCode, country } = config.address;
  return [street, city, region, postalCode, country].filter(Boolean).join(", ");
}

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
