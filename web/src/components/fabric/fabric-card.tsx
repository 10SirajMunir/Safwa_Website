import Link from "next/link";
import Image from "next/image";
import type { Fabric } from "@/types/fabric";
import { fabricDisplayName, formatWidth } from "@/lib/format";
import { FabricTexture } from "./fabric-texture";

const MAX_DOTS = 5;

export function FabricCard({ fabric }: { fabric: Fabric }) {
  const cover = fabric.media.find((m) => m.kind === "flat") ?? fabric.media.find((m) => m.kind !== "video");
  const [first] = fabric.colours;
  const extra = fabric.colours.length - MAX_DOTS;

  return (
    <article className="group relative flex h-full flex-col border border-line bg-white/60 transition-colors hover:border-gold-500">
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <FabricTexture
            hex={first.hex}
            weave={fabric.weave}
            finish={fabric.finish}
            label={`${first.name} ${fabricDisplayName(fabric)} fabric swatch`}
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute left-3 top-3 bg-ivory/95 px-2 py-0.5 text-[0.8125rem] font-semibold tracking-wide text-maroon-800">
          {fabric.code}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.65rem] leading-tight text-maroon-800">
          <Link href={`/fabrics/${fabric.slug}`} className="after:absolute after:inset-0">
            {fabric.name} <span className="tabular whitespace-nowrap">{fabric.gsm} GSM</span>
          </Link>
        </h3>
        <p className="mt-1.5 text-[0.975rem] text-muted">
          {fabric.composition} · <span className="tabular">{formatWidth(fabric)}</span>
        </p>

        <div className="mt-4 flex items-center gap-1.5">
          <span className="sr-only">{fabric.colours.length} colours</span>
          {fabric.colours.slice(0, MAX_DOTS).map((colour) => (
            <span
              key={colour.code}
              title={colour.name}
              aria-hidden="true"
              className="size-5 rounded-full ring-1 ring-black/15 ring-inset"
              style={{ backgroundColor: colour.hex }}
            />
          ))}
          {extra > 0 && <span className="ml-1 text-[0.875rem] text-muted">+{extra}</span>}
        </div>

        <p className="mt-auto pt-4 text-[0.9375rem] font-semibold text-gold-700">
          MOQ {fabric.moq} m per colour
        </p>
      </div>
    </article>
  );
}
