// FR-11: downloadable PDF catalogue, built from the same data layer as the website
// (NFR-08). Brand cover, how to order, one page per fabric with every PRD §6 field and
// its QR code (FR-12), and contact details (FR-19).
import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Document, Font, Image, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { absoluteUrl, formatAddress, siteConfig } from "@/config/site";
import { orderSteps } from "@/content/order-steps";
import { getAllFabrics } from "@/server/catalog/repository";
import { fabricUrl, qrPngDataUrl } from "@/server/catalogue/qr";
import { finishLabels, fabricTypeLabels, useLabels, weaveLabels } from "@/lib/labels";
import {
  formatAvailability,
  formatMoq,
  formatPkr,
  formatPriceSummary,
  formatSlabRange,
  formatWidth,
} from "@/lib/format";
import { formatWhatsAppNumber } from "@/lib/whatsapp";
import type { Fabric } from "@/types/fabric";

const fontFile = (pkg: string, file: string) => path.join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file);

Font.register({
  family: "Cormorant",
  fonts: [{ src: fontFile("cormorant-garamond", "cormorant-garamond-latin-600-normal.woff"), fontWeight: 600 }],
});
Font.register({
  family: "SourceSans",
  fonts: [
    { src: fontFile("source-sans-3", "source-sans-3-latin-400-normal.woff"), fontWeight: 400 },
    { src: fontFile("source-sans-3", "source-sans-3-latin-600-normal.woff"), fontWeight: 600 },
  ],
});
// Keep long words (fabric names, URLs) whole instead of hyphenating them.
Font.registerHyphenationCallback((word) => [word]);

const colour = {
  maroon: "#51010c",
  maroonDeep: "#3a0008",
  gold: "#e2be76",
  goldText: "#7f5c1c",
  ivory: "#faf6ef",
  sand: "#f2eadd",
  line: "#e3d7c4",
  ink: "#231416",
  muted: "#5e4b4e",
};

const s = StyleSheet.create({
  page: { fontFamily: "SourceSans", fontSize: 10, color: colour.ink, backgroundColor: colour.ivory, padding: 40, paddingBottom: 60 },
  cover: { backgroundColor: colour.maroon, padding: 0, alignItems: "center", justifyContent: "center" },
  coverLogo: { width: 220 },
  coverTitle: { fontFamily: "Cormorant", fontWeight: 600, fontSize: 36, color: colour.ivory, marginTop: 28 },
  coverSub: { fontSize: 12, color: colour.gold, marginTop: 8, letterSpacing: 1 },
  coverFoot: { position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", fontSize: 10, color: colour.gold },
  eyebrow: { fontSize: 8, fontWeight: 600, letterSpacing: 1.5, color: colour.goldText, textTransform: "uppercase" },
  h1: { fontFamily: "Cormorant", fontWeight: 600, fontSize: 28, color: colour.maroon, marginTop: 4 },
  h2: { fontFamily: "Cormorant", fontWeight: 600, fontSize: 16, color: colour.maroon, marginBottom: 6 },
  summary: { fontSize: 10.5, color: colour.muted, marginTop: 6, lineHeight: 1.45 },
  rule: { height: 1, backgroundColor: colour.gold, marginVertical: 14 },
  columns: { flexDirection: "row", gap: 24 },
  column: { flex: 1 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colour.line, paddingVertical: 4.5 },
  label: { width: "42%", color: colour.muted },
  value: { flex: 1, fontWeight: 600 },
  swatches: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  swatch: { width: 84 },
  swatchChip: { height: 44, borderWidth: 1, borderColor: colour.line },
  swatchName: { fontWeight: 600, marginTop: 3, fontSize: 9 },
  swatchCode: { color: colour.muted, fontSize: 8 },
  qrBox: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 16, padding: 10, backgroundColor: colour.sand },
  qr: { width: 76, height: 76 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: colour.muted,
    borderTopWidth: 1,
    borderTopColor: colour.line,
    paddingTop: 6,
  },
  step: { flexDirection: "row", marginBottom: 10 },
  stepNo: { width: 26, fontWeight: 600, fontSize: 16, color: colour.goldText },
  stepTitle: { fontWeight: 600, fontSize: 11 },
  moqPanel: { backgroundColor: colour.maroon, color: colour.ivory, padding: 16, marginTop: 6 },
  moqBig: { fontWeight: 600, fontSize: 28, color: colour.gold },
  // Cormorant's default figures are old-style ("18o"); numbers are set in Source Sans.
  figure: { fontFamily: "SourceSans", fontWeight: 600 },
});

const whatsapp = formatWhatsAppNumber(siteConfig.whatsappNumber);

function Footer() {
  return (
    <View style={s.footer} fixed>
      <Text>
        {siteConfig.name} · {siteConfig.phone} · WhatsApp {whatsapp} · {siteConfig.email}
      </Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row} wrap={false}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

function FabricPage({ fabric, qr }: { fabric: Fabric; qr: string }) {
  const url = fabricUrl(fabric.slug);
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.eyebrow}>
        {fabric.code} · {fabricTypeLabels[fabric.type]}
      </Text>
      <Text style={s.h1}>
        {fabric.name} <Text style={[s.figure, { fontSize: 23 }]}>{fabric.gsm} GSM</Text>
      </Text>
      <Text style={s.summary}>{fabric.summary}</Text>
      <View style={s.rule} />

      <View style={s.columns}>
        <View style={s.column}>
          <Text style={s.h2}>Specifications</Text>
          <Spec label="Fabric code" value={fabric.code} />
          <Spec label="Composition" value={fabric.composition} />
          <Spec label="Weight" value={`${fabric.gsm} GSM`} />
          <Spec label="Width" value={formatWidth(fabric)} />
          <Spec label="Weave / knit" value={weaveLabels[fabric.weave]} />
          <Spec label="Finish" value={fabric.finish ? finishLabels[fabric.finish] : "Standard"} />
          <Spec label="MOQ" value={formatMoq(fabric.moq)} />
          <Spec label="Recommended uses" value={fabric.uses.map((u) => useLabels[u]).join(", ")} />
          <Spec label="Availability" value={formatAvailability(fabric.availability)} />
          <Spec label="Price" value={formatPriceSummary(fabric.price)} />
          {fabric.price.type === "slabs" &&
            fabric.price.slabs.map((slab) => (
              <Spec
                key={slab.minMeters}
                label={`  ${formatSlabRange(slab.minMeters, slab.maxMeters)}`}
                value={`${formatPkr(slab.pricePerMeter)} per meter`}
              />
            ))}
        </View>
        <View style={s.column}>
          <Text style={s.h2}>Properties</Text>
          <Spec label="Stretch" value={fabric.properties.stretch} />
          <Spec label="Shrinkage" value={fabric.properties.shrinkage} />
          <Spec label="Colour fastness" value={fabric.properties.colourFastness} />
          <Spec label="Feel" value={fabric.properties.feel} />
          <Text style={[s.h2, { marginTop: 14 }]}>Care instructions</Text>
          {fabric.care.map((line) => (
            <Text key={line} style={{ marginBottom: 3 }}>
              • {line}
            </Text>
          ))}
        </View>
      </View>

      <Text style={[s.h2, { marginTop: 18 }]}>
        Available colours <Text style={[s.figure, { fontSize: 10, color: colour.muted }]}>· MOQ {fabric.moq} m for each colour</Text>
      </Text>
      <View style={s.swatches}>
        {fabric.colours.map((c) => (
          <View key={c.code} style={s.swatch} wrap={false}>
            <View style={[s.swatchChip, { backgroundColor: c.hex }]} />
            <Text style={s.swatchName}>{c.name}</Text>
            <Text style={s.swatchCode}>{c.code}</Text>
          </View>
        ))}
      </View>

      <View style={s.qrBox} wrap={false}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt; the URL is printed beside it */}
        <Image style={s.qr} src={qr} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 600, fontSize: 11 }}>Scan for photos, colours and a quote</Text>
          <Text style={{ color: colour.muted, marginTop: 3 }}>{url}</Text>
          <Text style={{ color: colour.muted, marginTop: 3 }}>Or WhatsApp {whatsapp} and quote {fabric.code}.</Text>
        </View>
      </View>
      <Footer />
    </Page>
  );
}

function CatalogueDocument({ fabrics, qrs, contactQr, logo }: { fabrics: Fabric[]; qrs: string[]; contactQr: string; logo: Buffer }) {
  return (
    <Document title={`${siteConfig.name} – Fabric catalogue`} author={siteConfig.name} subject="Fabric catalogue" language="en">
      <Page size="A4" style={[s.page, s.cover]}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- decorative logo on the cover */}
        <Image style={s.coverLogo} src={{ data: logo, format: "png" }} />
        <Text style={s.coverTitle}>Fabric catalogue</Text>
        <Text style={s.coverSub}>
          {fabrics.length} fabrics · MOQ {siteConfig.moqMeters} m per colour
        </Text>
        <Text style={s.coverFoot}>
          {siteConfig.url.replace(/^https?:\/\//, "")} · WhatsApp {whatsapp}
        </Text>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Ordering made simple</Text>
        <Text style={s.h1}>How to order</Text>
        <View style={s.rule} />
        <View style={s.columns}>
          <View style={[s.column, { flex: 1.4 }]}>
            {orderSteps.map((step, index) => (
              <View key={step.title} style={s.step} wrap={false}>
                <Text style={s.stepNo}>{index + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.stepTitle}>{step.title}</Text>
                  <Text style={{ color: colour.muted, marginTop: 2 }}>{step.text}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={s.column}>
            <View style={s.moqPanel}>
              <Text style={[s.eyebrow, { color: colour.gold }]}>Minimum order (MOQ)</Text>
              <Text style={s.moqBig}>{siteConfig.moqMeters} m</Text>
              <Text>per colour</Text>
            </View>
            <Text style={[s.h2, { marginTop: 16 }]}>Ways to pay</Text>
            {siteConfig.paymentMethods.map((method) => (
              <Text key={method} style={{ marginBottom: 3 }}>
                • {method}
              </Text>
            ))}
          </View>
        </View>
        <Footer />
      </Page>

      {fabrics.map((fabric, index) => (
        <FabricPage key={fabric.slug} fabric={fabric} qr={qrs[index]} />
      ))}

      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>We are here to help</Text>
        <Text style={s.h1}>Contact us</Text>
        <View style={s.rule} />
        <Spec label="Business" value={siteConfig.name} />
        <Spec label="Address" value={formatAddress()} />
        <Spec label="Phone" value={siteConfig.phone} />
        <Spec label="WhatsApp" value={whatsapp} />
        <Spec label="Email" value={siteConfig.email} />
        <Spec label="Website" value={siteConfig.url} />
        <View style={s.qrBox} wrap={false}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- the URL is printed beside it */}
          <Image style={s.qr} src={contactQr} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 600, fontSize: 11 }}>Scan to see the full catalogue online</Text>
            <Text style={{ color: colour.muted, marginTop: 3 }}>{absoluteUrl("/fabrics")}</Text>
          </View>
        </View>
        <Footer />
      </Page>
    </Document>
  );
}

export async function renderCataloguePdf(): Promise<Buffer> {
  const fabrics = await getAllFabrics();
  const [qrs, contactQr] = await Promise.all([
    Promise.all(fabrics.map((fabric) => qrPngDataUrl(fabricUrl(fabric.slug)))),
    qrPngDataUrl(absoluteUrl("/fabrics")),
  ]);
  const logo = readFileSync(path.join(process.cwd(), "public", "brand", "al-safwa-fabrics-logo-gold.png"));
  return renderToBuffer(<CatalogueDocument fabrics={fabrics} qrs={qrs} contactQr={contactQr} logo={logo} />);
}
