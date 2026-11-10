import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { analyticsConfig } from "@/config/analytics";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { cormorant, sourceSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – Fabric supplier in Pakistan, MOQ 100 m per colour`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // FR-23: Search Console and Bing Webmaster verification, only when the owner's codes are set.
  verification: {
    google: analyticsConfig.googleSiteVerification,
    other: analyticsConfig.bingSiteVerification ? { "msvalidate.01": analyticsConfig.bingSiteVerification } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#51010c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        {children}
        {analyticsConfig.gaMeasurementId && <GoogleAnalytics measurementId={analyticsConfig.gaMeasurementId} />}
      </body>
    </html>
  );
}
