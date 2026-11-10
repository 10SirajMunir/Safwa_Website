import Link from "next/link";
import type { ReactNode } from "react";
import type { Fabric } from "@/types/fabric";
import { finishLabels, useLabels, weaveLabels } from "@/lib/labels";
import { formatAvailability, formatMoq, formatPkr, formatPriceSummary, formatSlabRange, formatWidth } from "@/lib/format";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(7.5rem,40%)_1fr] gap-4 border-b border-line py-3.5 last:border-b-0">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular font-semibold text-ink">{children}</dd>
    </div>
  );
}

/** FR-02 / FR-04: every PRD §6 field as real, crawlable text. */
export function SpecTable({ fabric }: { fabric: Fabric }) {
  return (
    <dl className="border-y border-line">
      <Row label="Fabric code">{fabric.code}</Row>
      <Row label="Composition">{fabric.composition}</Row>
      <Row label="Weight">{fabric.gsm} GSM</Row>
      <Row label="Width">{formatWidth(fabric)}</Row>
      <Row label="Weave / knit">{weaveLabels[fabric.weave]}</Row>
      <Row label="Finish">{fabric.finish ? finishLabels[fabric.finish] : "Standard"}</Row>
      <Row label="Colours">{fabric.colours.length} colours</Row>
      <Row label="MOQ">{formatMoq(fabric.moq)}</Row>
      <Row label="Recommended uses">
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          {fabric.uses.map((use) => (
            <Link
              key={use}
              href={`/fabrics?use=${use}`}
              className="text-maroon-700 underline decoration-gold-500 underline-offset-4 hover:decoration-maroon-700"
            >
              {useLabels[use]}
            </Link>
          ))}
        </span>
      </Row>
      <Row label="Availability">{formatAvailability(fabric.availability)}</Row>
      <Row label="Price">{formatPriceSummary(fabric.price)}</Row>
    </dl>
  );
}

export function PropertiesTable({ fabric }: { fabric: Fabric }) {
  const { stretch, shrinkage, colourFastness, feel } = fabric.properties;
  return (
    <dl className="border-y border-line">
      <Row label="Stretch">{stretch}</Row>
      <Row label="Shrinkage">{shrinkage}</Row>
      <Row label="Colour fastness">{colourFastness}</Row>
      <Row label="Feel">{feel}</Row>
    </dl>
  );
}

/** Price by quantity slab (PRD §6), shown only when the owner has set slab prices. */
export function PriceSlabs({ fabric }: { fabric: Fabric }) {
  if (fabric.price.type !== "slabs") return null;
  return (
    <table className="tabular w-full text-left">
      <caption className="sr-only">Price per meter by quantity</caption>
      <thead>
        <tr className="border-b border-line text-muted">
          <th scope="col" className="py-2 font-normal">Quantity per colour</th>
          <th scope="col" className="py-2 text-right font-normal">Price per meter</th>
        </tr>
      </thead>
      <tbody>
        {fabric.price.slabs.map((slab) => (
          <tr key={slab.minMeters} className="border-b border-line last:border-b-0">
            <td className="py-2.5">{formatSlabRange(slab.minMeters, slab.maxMeters)}</td>
            <td className="py-2.5 text-right font-semibold">{formatPkr(slab.pricePerMeter)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
