import { serializeJsonLd } from "@/lib/structured-data";

/** Renders structured data (FR-20) as a script tag search engines and AI crawlers read. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
