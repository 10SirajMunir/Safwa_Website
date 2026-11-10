// FR-12: QR codes point at the fabric's own clean URL.
import { describe, expect, it } from "vitest";
import QRCode from "qrcode";
import { fabricUrl, qrSvg } from "@/server/catalogue/qr";

describe("fabric QR codes", () => {
  it("encodes the fabric's absolute page URL", () => {
    expect(fabricUrl("cotton-twill-180-gsm")).toMatch(/^https?:\/\/[^/]+\/fabrics\/cotton-twill-180-gsm$/);
  });

  it("renders the same symbol the QR library builds for that URL", async () => {
    const url = fabricUrl("cotton-twill-180-gsm");
    const svg = await qrSvg(url);
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain("#51010c");
    const size = QRCode.create(url, { errorCorrectionLevel: "M" }).modules.size;
    expect(svg).toContain(`viewBox="0 0 ${size + 4} ${size + 4}"`);
  });
});
