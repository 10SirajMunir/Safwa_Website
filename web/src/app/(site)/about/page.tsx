import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { Ornament } from "@/components/ui/ornament";

// STARTER COPY: story, experience, capacity and stock/warehouse photos come from the
// owner (Open Question OQ-04). Only facts stated in the PRD are used below.
export const metadata: Metadata = {
  title: "About us",
  description:
    "Al Safwa Fabrics supplies cotton and poly-cotton fabrics across Pakistan with clear specs, colour codes and a low MOQ of 100 meters per colour.",
  alternates: { canonical: "/about" },
};

const qualityChecks = [
  { title: "Weight (GSM)", text: "Checked against the GSM listed for the fabric." },
  { title: "Width", text: "Measured edge to edge against the listed width." },
  { title: "Colour", text: "Matched to the colour code you ordered." },
  { title: "Fabric faults", text: "Inspected for weaving and dyeing faults before packing." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About us" title={`About ${siteConfig.name}`} crumbs={[{ label: "About" }]}>
        <p>Fabric for tailors, garment makers, uniform suppliers and retailers across Pakistan.</p>
      </PageHeader>

      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_1.2fr] lg:py-20">
        <h2 className="text-[2.25rem] text-maroon-800 sm:text-[2.75rem]">Clear details. Low minimums. Honest answers.</h2>
        <div className="space-y-5 text-[1.0625rem]">
          <p>
            We started {siteConfig.name} to make buying fabric simple. Too often a buyer has to send ten WhatsApp
            messages just to learn a fabric&apos;s weight, width and colours. So every fabric we sell has its own page
            with its full specifications and a code for every colour.
          </p>
          <p>
            We keep our minimum order at {siteConfig.moqMeters} meters per colour, so smaller workshops and new brands
            can order the same quality as large buyers, and try a new colour without a big risk.
          </p>
        </div>
      </section>

      <div className="container-page">
        <Ornament />
      </div>

      <section className="container-page py-14 lg:py-20" aria-labelledby="quality-heading">
        <p className="eyebrow text-gold-700">Before every dispatch</p>
        <h2 id="quality-heading" className="mt-2 text-[2.25rem] text-maroon-800">
          Quality checks
        </h2>
        <ol className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {qualityChecks.map((check, index) => (
            <li key={check.title} className="bg-ivory p-6">
              <span className="font-display text-[1.25rem] text-gold-700">0{index + 1}</span>
              <h3 className="mt-2 font-sans text-[1.0625rem] font-semibold text-ink">{check.title}</h3>
              <p className="mt-1 text-muted">{check.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-maroon-800 text-ivory">
        <div className="container-page flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[2rem] text-ivory">See what is in stock</h2>
          <ButtonLink href="/fabrics" variant="gold">
            Browse fabrics
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
