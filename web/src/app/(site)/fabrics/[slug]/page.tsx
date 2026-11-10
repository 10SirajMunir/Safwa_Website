import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllFabrics,
  getFabricBySlug,
  getGuidesForFabric,
  getRelatedFabrics,
} from "@/server/catalog/repository";
import { fabricMetaDescription, fabricMetaTitle } from "@/lib/seo";
import { fabricDisplayName, formatAvailability, formatPriceSummary, formatWidth } from "@/lib/format";
import { fabricTypeLabels, guideCategoryLabels } from "@/lib/labels";
import { productJsonLd } from "@/lib/structured-data";
import { whatsappUrl } from "@/lib/whatsapp";
import { buttonClasses, ExternalButton } from "@/components/ui/button-link";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { FabricGallery } from "@/components/fabric/fabric-gallery";
import { ColourList } from "@/components/fabric/colour-list";
import { PriceSlabs, PropertiesTable, SpecTable } from "@/components/fabric/spec-table";
import { FabricCard } from "@/components/fabric/fabric-card";
import { InquiryForm, type FabricChoice } from "@/components/forms/inquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

// Fabric pages are fully rendered on the server (prerendered at build for every known
// fabric) so specs are in the HTML for buyers without JavaScript and for crawlers.
// An unknown slug waits for the full render, so it gets a real 404 status, not a shell.
export const instant = false;
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const fabrics = await getAllFabrics();
  return fabrics.map((fabric) => ({ slug: fabric.slug }));
}

export async function generateMetadata({ params }: PageProps<"/fabrics/[slug]">): Promise<Metadata> {
  const fabric = await getFabricBySlug((await params).slug);
  if (!fabric) return {};
  const title = fabricMetaTitle(fabric);
  const description = fabricMetaDescription(fabric);
  return {
    title,
    description,
    alternates: { canonical: `/fabrics/${fabric.slug}` },
    openGraph: { title, description, url: `/fabrics/${fabric.slug}`, type: "website" },
  };
}

export default async function FabricPage({ params }: PageProps<"/fabrics/[slug]">) {
  const fabric = await getFabricBySlug((await params).slug);
  if (!fabric) notFound();

  const [related, guides, allFabrics] = await Promise.all([
    getRelatedFabrics(fabric),
    getGuidesForFabric(fabric),
    getAllFabrics(),
  ]);
  const name = fabricDisplayName(fabric);
  const choices: FabricChoice[] = allFabrics.map((f) => ({
    slug: f.slug,
    code: f.code,
    label: fabricDisplayName(f),
    colours: f.colours.map(({ name: colourName, code }) => ({ name: colourName, code })),
  }));

  const keyFacts = [
    { label: "Weight", value: `${fabric.gsm} GSM` },
    { label: "Width", value: formatWidth(fabric) },
    { label: "Composition", value: fabric.composition },
    { label: "MOQ", value: `${fabric.moq} m per colour` },
  ];

  return (
    <>
      <div className="container-page pt-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Fabrics", href: "/fabrics" },
            { label: name },
          ]}
        />
      </div>

      <article>
        {/* Overview: everything needed to decide, above the fold on a phone. */}
        <div className="container-page grid gap-8 pb-14 pt-4 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <FabricGallery fabric={fabric} />

          <div>
            <p className="eyebrow text-gold-700">
              {fabric.code} · {fabricTypeLabels[fabric.type]}
            </p>
            <h1 className="mt-2 text-[2.6rem] text-maroon-800 sm:text-[3.25rem]">{name}</h1>
            <p className="mt-3 text-[1.125rem] text-muted">{fabric.summary}</p>

            <dl className="mt-6 grid grid-cols-2 border-l border-t border-line" data-testid="key-facts">
              {keyFacts.map((fact) => (
                <div key={fact.label} className="border-b border-r border-line px-4 py-3.5">
                  <dt className="text-[0.875rem] text-muted">{fact.label}</dt>
                  <dd className="tabular mt-0.5 text-[1.125rem] font-semibold leading-snug text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-[0.975rem] text-ink">
              <span className="font-semibold">{formatAvailability(fabric.availability)}</span>
              <span className="text-muted"> · Price: {formatPriceSummary(fabric.price)}</span>
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {/* Native anchors: in-page jumps must fire "hashchange" so the form picks quote or sample. */}
              <a href="#request-quote" className={buttonClasses("primary")}>
                Request quote
              </a>
              <a href="#order-sample" className={buttonClasses("outline")}>
                Order sample
              </a>
              <ExternalButton
                href={whatsappUrl({ code: fabric.code, label: name })}
                variant="whatsapp"
                className="sm:col-span-2"
              >
                <WhatsAppIcon /> Ask about this fabric on WhatsApp
              </ExternalButton>
            </div>
          </div>
        </div>

        <section className="border-y border-line bg-sand/60 py-14" aria-labelledby="colours-heading">
          <div className="container-page">
            <SectionHeading id="colours-heading" eyebrow={`${fabric.colours.length} colours`} title="Available colours">
              Quote the colour code when you order. MOQ is {fabric.moq} meters for each colour.
            </SectionHeading>
            <div className="mt-8">
              <ColourList fabric={fabric} />
            </div>
          </div>
        </section>

        <section className="container-page grid gap-12 py-14 lg:grid-cols-2" aria-label="Specifications">
          <div>
            <h2 className="text-[2rem] text-maroon-800">Specifications</h2>
            <div className="mt-5">
              <SpecTable fabric={fabric} />
            </div>
            {fabric.price.type === "slabs" && (
              <div className="mt-8">
                <h3 className="font-sans text-[1.0625rem] font-semibold">Price by quantity</h3>
                <div className="mt-3">
                  <PriceSlabs fabric={fabric} />
                </div>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-[2rem] text-maroon-800">Properties</h2>
            <div className="mt-5">
              <PropertiesTable fabric={fabric} />
            </div>
            <h2 className="mt-10 text-[2rem] text-maroon-800">Care instructions</h2>
            <ul className="mt-4 space-y-2">
              {fabric.care.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold-500" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Quote / sample form (FR-07, FR-08). Both buttons above land here. */}
        <section id="request-quote" className="scroll-mt-24 bg-white/70 py-14" aria-labelledby="inquiry-heading">
          <span id="order-sample" className="block scroll-mt-24" aria-hidden="true" />
          <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <SectionHeading id="inquiry-heading" eyebrow={fabric.code} title="Request a quote or a sample">
              <p>Tell us your colours and quantity. We reply with prices, or arrange your sample.</p>
              <p className="mt-3">
                Prefer to talk?{" "}
                <a
                  href={whatsappUrl({ code: fabric.code, label: name })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-whatsapp-dark underline underline-offset-4"
                >
                  Message us on WhatsApp
                </a>
                .
              </p>
            </SectionHeading>
            <InquiryForm variant="fabric" fabrics={choices} defaultFabric={fabric.slug} />
          </div>
        </section>
      </article>

      {/* Internal links (FR-05) */}
      {(guides.length > 0 || related.length > 0) && (
        <section className="container-page py-14" aria-label="Related">
          {guides.length > 0 && (
            <div>
              <h2 className="text-[2rem] text-maroon-800">Helpful guides</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {guides.map((guide) => (
                  <li key={guide.slug}>
                    <Link href={`/blog/${guide.slug}`} className="group flex h-full items-start justify-between gap-4 border border-line p-5 hover:border-gold-500">
                      <span>
                        <span className="eyebrow text-[0.75rem] text-gold-700">{guideCategoryLabels[guide.category]}</span>
                        <span className="mt-1 block font-display text-[1.5rem] leading-snug text-maroon-800">{guide.title}</span>
                      </span>
                      <ArrowRightIcon className="mt-2 shrink-0 text-gold-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="text-[2rem] text-maroon-800">Similar fabrics</h2>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <FabricCard fabric={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <WhatsAppButton fabric={{ code: fabric.code, label: name }} />
      <JsonLd data={productJsonLd(fabric)} />
    </>
  );
}
