import Link from "next/link";
import type { Metadata } from "next";
import { getAllFabrics } from "@/server/catalog/repository";
import {
  activeFilterCount,
  applyFilters,
  categoryOf,
  FILTER_KEYS,
  FILTER_LABELS,
  filtersToQuery,
  getFilterOptions,
  parseFilters,
} from "@/server/catalog/filters";
import { categoryHeading, categoryMetaDescription, categoryMetaTitle } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/page-header";
import { ExternalButton, ButtonLink, buttonClasses } from "@/components/ui/button-link";
import { ChevronDownIcon, CloseIcon, WhatsAppIcon } from "@/components/ui/icons";
import { FabricCard } from "@/components/fabric/fabric-card";
import { FilterForm } from "@/components/fabric/filter-form";

// Results depend on the URL's filters; render them fully on the server before sending
// so the filtered list is plain HTML, readable without JavaScript (NFR-05).
export const instant = false;

async function loadCatalogue(searchParams: PageProps<"/fabrics">["searchParams"]) {
  const fabrics = await getAllFabrics();
  const options = getFilterOptions(fabrics);
  const filters = parseFilters(await searchParams, options);
  return { fabrics, options, filters, results: applyFilters(fabrics, filters) };
}

export async function generateMetadata({ searchParams }: PageProps<"/fabrics">): Promise<Metadata> {
  const { filters, results } = await loadCatalogue(searchParams);
  const category = categoryOf(filters);
  if (category) {
    return {
      title: categoryMetaTitle(category),
      description: categoryMetaDescription(category, results.length),
      alternates: { canonical: `/fabrics${filtersToQuery(filters)}` },
    };
  }
  return {
    title: "Fabric catalogue – cotton and poly-cotton by GSM, width and colour",
    description:
      "Browse every Al Safwa fabric with full specs: GSM, width, composition, weave, colours and uses. Filter to find yours. MOQ 100 m per colour.",
    alternates: { canonical: "/fabrics" },
  };
}

export default async function CataloguePage({ searchParams }: PageProps<"/fabrics">) {
  const { fabrics, options, filters, results } = await loadCatalogue(searchParams);
  const category = categoryOf(filters);
  const count = activeFilterCount(filters);
  const labelFor = (key: (typeof FILTER_KEYS)[number], value: string) =>
    options[key].find((option) => option.value === value)?.label ?? value;

  return (
    <>
      <PageHeader
        eyebrow={`${fabrics.length} fabrics · MOQ 100 m per colour`}
        title={category ? categoryHeading(category) : "Fabric catalogue"}
        crumbs={
          category
            ? [{ label: "Fabrics", href: "/fabrics" }, { label: categoryHeading(category) }]
            : [{ label: "Fabrics" }]
        }
      >
        <p>Open any fabric for its full specifications, colours with codes, and a quote or sample request.</p>
        {/* FR-11: the whole catalogue as a PDF */}
        <a href="/al-safwa-fabrics-catalogue.pdf" download className={buttonClasses("outline-light", "mt-6")}>
          Download PDF catalogue
        </a>
      </PageHeader>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[17rem_1fr] lg:gap-12 lg:py-14">
        {/* Phone: filters fold away. Desktop: filters stay in a sidebar. */}
        <details className="group border border-line bg-white/60 lg:hidden">
          <summary className="flex min-h-14 items-center justify-between px-4 font-semibold text-ink">
            <span>
              Filter fabrics{" "}
              {count > 0 && <span className="ml-1 rounded-full bg-maroon-800 px-2 py-0.5 text-[0.8125rem] text-ivory">{count}</span>}
            </span>
            <ChevronDownIcon className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-line p-4">
            <FilterForm options={options} filters={filters} idPrefix="filter-mobile" />
          </div>
        </details>

        <aside className="hidden lg:block">
          <h2 className="font-sans text-[1.0625rem] font-semibold text-ink">Filter fabrics</h2>
          <div className="mt-4">
            <FilterForm options={options} filters={filters} idPrefix="filter-desktop" />
          </div>
        </aside>

        <section aria-labelledby="results-heading">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <h2 id="results-heading" className="font-sans text-[1.0625rem] font-semibold text-ink" aria-live="polite">
              {results.length === 1 ? "1 fabric" : `${results.length} fabrics`}
              {count > 0 && " match your filters"}
            </h2>
            {count > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Active filters">
                {FILTER_KEYS.filter((key) => filters[key]).map((key) => {
                  const rest = { ...filters };
                  delete rest[key];
                  return (
                    <li key={key}>
                      <Link
                        href={`/fabrics${filtersToQuery(rest)}`}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-sand px-3.5 text-[0.9375rem] text-ink hover:bg-line"
                        aria-label={`Remove filter ${FILTER_LABELS[key]}: ${labelFor(key, filters[key]!)}`}
                      >
                        {labelFor(key, filters[key]!)} <CloseIcon width={16} height={16} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {results.length > 0 ? (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((fabric) => (
                <li key={fabric.slug}>
                  <FabricCard fabric={fabric} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 border border-dashed border-line p-8 text-center">
              <p className="font-display text-[1.75rem] text-maroon-800">No fabrics match these filters.</p>
              <p className="mt-2 text-muted">Try removing a filter, or tell us what you need and we will check our stock.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/fabrics" variant="outline">
                  Clear filters
                </ButtonLink>
                <ExternalButton href={whatsappUrl()} variant="whatsapp">
                  <WhatsAppIcon /> Ask on WhatsApp
                </ExternalButton>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
