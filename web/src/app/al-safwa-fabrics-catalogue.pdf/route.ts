// FR-11: the downloadable PDF catalogue. Rendering a PDF is CPU-heavy, so it is cached
// (never rendered per request, which would also let anyone load the server by
// downloading repeatedly). Phase 2 refreshes it when the owner publishes (AD-09, AD-10).
import { cacheLife } from "next/cache";
import { renderCataloguePdf } from "@/server/catalogue/catalogue-pdf";

async function cataloguePdf(): Promise<Uint8Array<ArrayBuffer>> {
  "use cache";
  cacheLife("days");
  return new Uint8Array(await renderCataloguePdf());
}

export async function GET() {
  return new Response(await cataloguePdf(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Al-Safwa-Fabrics-Catalogue.pdf"',
    },
  });
}
