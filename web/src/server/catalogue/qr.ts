// FR-12: QR codes that open a page of the site. Used by /fabrics/<slug>/qr.svg and the
// PDF catalogue. The same absolute URL is used everywhere (FR-14 clean URLs).
import QRCode from "qrcode";
import { absoluteUrl } from "@/config/site";

const BRAND_MAROON = "#51010c";

export function fabricUrl(slug: string): string {
  return absoluteUrl(`/fabrics/${slug}`);
}

export function qrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: { dark: BRAND_MAROON, light: "#ffffff" },
  });
}

export function qrPngDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 360,
    color: { dark: BRAND_MAROON, light: "#ffffff" },
  });
}
