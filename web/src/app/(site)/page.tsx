import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { orderSteps } from "@/content/order-steps";
import { getAllFabrics, getFabricTypes, getFeaturedFabrics } from "@/server/catalog/repository";
import { getAllArticles, getFaqs } from "@/server/content/repository";
import { fabricTypeLabels, guideCategoryLabels, useLabels } from "@/lib/labels";
import { whatsappUrl } from "@/lib/whatsapp";
import { ButtonLink, ExternalButton } from "@/components/ui/button-link";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Ornament } from "@/components/ui/ornament";
import { SectionHeading } from "@/components/ui/section-heading";
import { FabricCard } from "@/components/fabric/fabric-card";
import { FabricTexture } from "@/components/fabric/fabric-texture";
import type { FabricUse } from "@/types/fabric";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [allFabrics, featured, types, articles, faqs] = await Promise.all([
    getAllFabrics(),
    getFeaturedFabrics(),
    getFabricTypes(),
    getAllArticles(),
    getFaqs(),
  ]);
  const uses = [...new Set(allFabrics.flatMap((f) => f.uses))] as FabricUse[];
  const swatchBook = allFabrics.slice(0, 4);

  return (
    <>
      {/* Hero: the clear message, MOQ and WhatsApp (PRD §2, Home). */}
      <section className="relative overflow-hidden bg-maroon-800 text-ivory">
        <div className="container-page grid items-center gap-12 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.15fr_1fr] lg:pb-20 lg:pt-20">
          <div>
            <p className="eyebrow text-gold-400">Fabric supplier · Pakistan</p>
            <h1 className="mt-4 text-[2.6rem] leading-[1.05] text-ivory sm:text-[3.6rem] lg:text-[4.1rem]">
              Cotton and poly-cotton fabrics, from{" "}
              <span className="whitespace-nowrap text-gold-300">100 meters</span> per colour.
            </h1>
            <p className="mt-5 max-w-xl text-[1.125rem] text-gold-200/90">
              Every fabric is listed with its GSM, width, composition and colour codes, so you can choose in
              minutes and order on WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/fabrics" variant="gold">
                Browse fabrics <ArrowRightIcon />
              </ButtonLink>
              <ExternalButton href={whatsappUrl()} variant="outline-light">
                <WhatsAppIcon /> Ask on WhatsApp
              </ExternalButton>
            </div>
          </div>

          {/* Swatch book: the starter fabrics fanned out like a sample card. */}
          <div className="relative mx-auto hidden w-full max-w-md sm:block" aria-hidden="true">
            <div className="flex h-64 gap-0 sm:h-80">
              {swatchBook.map((fabric, index) => (
                <div
                  key={fabric.slug}
                  className="relative flex-1 origin-bottom shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]"
                  style={{ transform: `rotate(${(index - 1.5) * 4}deg) translateY(${Math.abs(index - 1.5) * 10}px)` }}
                >
                  <FabricTexture hex={fabric.colours[0].hex} weave={fabric.weave} finish={fabric.finish} className="absolute inset-0" />
                  <span className="absolute inset-x-0 bottom-0 bg-ivory px-2 py-1.5 text-center text-[0.75rem] font-semibold tracking-wide text-maroon-800">
                    {fabric.code}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MOQ highlight */}
      <section aria-label="Order essentials" className="border-b border-line bg-sand">
        <dl className="container-page grid gap-6 py-8 sm:grid-cols-3 sm:gap-10">
          <div className="sm:border-r sm:border-line sm:pr-8">
            <dt className="eyebrow text-gold-700">Minimum order</dt>
            <dd className="mt-1 font-display text-[2.4rem] leading-none text-maroon-800">
              {siteConfig.moqMeters} m <span className="text-[1.25rem] text-muted">per colour</span>
            </dd>
          </div>
          <div className="sm:border-r sm:border-line sm:pr-8">
            <dt className="eyebrow text-gold-700">Samples</dt>
            <dd className="mt-1 text-[1.0625rem] text-ink">Order a sample from any fabric page before you buy.</dd>
          </div>
          <div>
            <dt className="eyebrow text-gold-700">Payment</dt>
            <dd className="mt-1 text-[1.0625rem] text-ink">{siteConfig.paymentMethods.join(", ")}.</dd>
          </div>
        </dl>
      </section>

      {/* Top fabric categories */}
      <section className="container-page py-16 sm:py-20" aria-labelledby="types-heading">
        <SectionHeading id="types-heading" eyebrow="Start here" title="Shop by fabric type" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {types.map(({ type, count }) => {
            const sample = allFabrics.find((f) => f.type === type);
            return (
              <li key={type}>
                <Link
                  href={`/fabrics?type=${type}`}
                  className="group grid min-h-28 grid-cols-[6rem_1fr_auto] items-center gap-5 border border-line bg-white/60 pr-5 transition-colors hover:border-gold-500"
                >
                  {sample && (
                    <FabricTexture hex={sample.colours[0].hex} weave={sample.weave} finish={sample.finish} className="h-full min-h-28" />
                  )}
                  <span>
                    <span className="block font-display text-[1.9rem] leading-tight text-maroon-800">
                      {fabricTypeLabels[type]}
                    </span>
                    <span className="text-muted">
                      {count} {count === 1 ? "fabric" : "fabrics"}
                    </span>
                  </span>
                  <ArrowRightIcon className="text-gold-700 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ul>

        <h3 className="mt-10 font-sans text-[1rem] font-semibold text-ink">Or by what you are making</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {uses.map((use) => (
            <li key={use}>
              <Link
                href={`/fabrics?use=${use}`}
                className="inline-flex min-h-12 items-center rounded-full border border-maroon-800/25 px-5 font-semibold text-maroon-800 transition-colors hover:border-maroon-800 hover:bg-maroon-800 hover:text-ivory"
              >
                {useLabels[use]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured fabrics: one tap from Home to a fabric (NFR-03) */}
      <section className="border-y border-line bg-sand/60 py-16 sm:py-20" aria-labelledby="featured-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading id="featured-heading" eyebrow="In stock and ready to quote" title="Popular fabrics" />
            <Link href="/fabrics" className="inline-flex min-h-12 items-center gap-2 font-semibold text-maroon-700 hover:text-maroon-900">
              See all {allFabrics.length} fabrics <ArrowRightIcon />
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((fabric) => (
              <li key={fabric.slug}>
                <FabricCard fabric={fabric} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How ordering works */}
      <section className="container-page py-16 sm:py-20" aria-labelledby="steps-heading">
        <SectionHeading id="steps-heading" eyebrow="Simple from start to finish" title="How to order">
          Six steps, from choosing your fabric to dispatch.
        </SectionHeading>
        <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {orderSteps.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[2.75rem_1fr] gap-3">
              <span className="font-display text-[2.4rem] leading-none text-gold-500" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3 className="font-sans text-[1.0625rem] font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <ButtonLink href="/how-to-order" variant="outline" className="mt-10">
          Full ordering guide
        </ButtonLink>
      </section>

      <div className="container-page">
        <Ornament />
      </div>

      {/* FAQ preview + guides */}
      <section className="container-page grid gap-14 py-16 sm:py-20 lg:grid-cols-2" aria-label="Questions and guides">
        <div>
          <SectionHeading eyebrow="Quick answers" title="Common questions" />
          <div className="mt-6 border-t border-line">
            {faqs.slice(0, 3).map((faq) => (
              <details key={faq.id} className="group border-b border-line">
                <summary className="flex min-h-14 items-center justify-between gap-4 py-3 font-semibold text-ink">
                  {faq.question}
                  <span className="text-[1.5rem] leading-none text-gold-700 group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-4 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
          <Link href="/faq" className="mt-5 inline-flex min-h-12 items-center gap-2 font-semibold text-maroon-700">
            All questions <ArrowRightIcon />
          </Link>
        </div>

        <div>
          <SectionHeading eyebrow="Fabric guide" title="Know your fabric" />
          <ul className="mt-6 space-y-4">
            {articles.slice(0, 3).map((article) => (
              <li key={article.slug}>
                <Link href={`/blog/${article.slug}`} className="group block border-l-2 border-gold-400 py-1 pl-4">
                  <span className="eyebrow text-[0.75rem] text-gold-700">{guideCategoryLabels[article.category]}</span>
                  <span className="mt-1 block font-display text-[1.5rem] leading-snug text-maroon-800 group-hover:underline group-hover:decoration-gold-500 group-hover:underline-offset-4">
                    {article.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-maroon-900 text-ivory">
        <div className="container-page flex flex-col gap-6 py-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[2.1rem] text-ivory sm:text-[2.5rem]">Not sure which fabric fits?</h2>
            <p className="mt-2 text-gold-200/85">Tell us what you are making. We will suggest a fabric and GSM.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ExternalButton href={whatsappUrl()} variant="whatsapp">
              <WhatsAppIcon /> Message on WhatsApp
            </ExternalButton>
            <ButtonLink href="/contact" variant="outline-light">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
