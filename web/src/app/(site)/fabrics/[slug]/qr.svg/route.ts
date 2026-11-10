// FR-12: QR code for each fabric, linking to its page. Prerendered for every fabric.
import { getAllFabrics, getFabricBySlug } from "@/server/catalog/repository";
import { fabricUrl, qrSvg } from "@/server/catalogue/qr";

export async function generateStaticParams() {
  const fabrics = await getAllFabrics();
  return fabrics.map((fabric) => ({ slug: fabric.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/fabrics/[slug]/qr.svg">) {
  const { slug } = await params;
  const fabric = await getFabricBySlug(slug);
  if (!fabric) return new Response("Not found", { status: 404 });

  return new Response(await qrSvg(fabricUrl(fabric.slug)), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `inline; filename="${fabric.slug}-qr.svg"`,
    },
  });
}
