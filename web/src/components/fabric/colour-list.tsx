import Image from "next/image";
import type { Fabric } from "@/types/fabric";
import { fabricDisplayName } from "@/lib/format";
import { FabricTexture } from "./fabric-texture";

/** PRD §6 "Available colours": swatch + colour name + colour code for every colour. */
export function ColourList({ fabric }: { fabric: Fabric }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {fabric.colours.map((colour) => (
        <li key={colour.code} className="border border-line bg-white/60">
          <div className="relative aspect-square">
            {colour.swatchImage ? (
              <Image
                src={colour.swatchImage}
                alt={`${colour.name} ${fabricDisplayName(fabric)} swatch`}
                fill
                sizes="(min-width: 1024px) 200px, 50vw"
                className="object-cover"
              />
            ) : (
              <FabricTexture
                hex={colour.hex}
                weave={fabric.weave}
                finish={fabric.finish}
                label={`${colour.name} ${fabricDisplayName(fabric)} swatch`}
                className="absolute inset-0"
              />
            )}
          </div>
          <div className="px-3 py-2.5">
            <p className="font-semibold leading-snug text-ink">{colour.name}</p>
            <p className="tabular text-[0.875rem] text-muted">{colour.code}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
