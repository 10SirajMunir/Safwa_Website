import type { CSSProperties } from "react";
import type { Finish, Weave } from "@/types/fabric";

interface FabricTextureProps {
  hex: string;
  weave: Weave;
  finish?: Finish;
  /** 1 = normal view; larger numbers zoom into the weave (texture close-up). */
  zoom?: number;
  /** Accessible name; omit for decorative uses (e.g. thumbnails next to a caption). */
  label?: string;
  className?: string;
}

/**
 * Draws a woven surface in the fabric's colour: diagonal ribs for twill, a fine
 * cross-grid for plain weave, a soft sheen for satin. Used wherever a real fabric
 * photo has not been uploaded yet (FR-03), and for every colour swatch.
 */
export function FabricTexture({ hex, weave, finish, zoom = 1, label, className = "" }: FabricTextureProps) {
  const unit = (n: number) => `${n * zoom}px`;
  const layers: string[] = [];

  if (weave === "twill") {
    layers.push(
      `repeating-linear-gradient(125deg, rgba(255,255,255,0.10) 0 ${unit(1.5)}, rgba(0,0,0,0.10) ${unit(1.5)} ${unit(3)}, transparent ${unit(3)} ${unit(4.5)})`,
    );
  } else if (weave === "plain") {
    layers.push(
      `repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 ${unit(1)}, transparent ${unit(1)} ${unit(3)})`,
      `repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 ${unit(1)}, transparent ${unit(1)} ${unit(3)})`,
    );
  } else {
    layers.push(
      "linear-gradient(105deg, rgba(255,255,255,0) 15%, rgba(255,255,255,0.22) 42%, rgba(255,255,255,0.04) 58%, rgba(255,255,255,0) 80%)",
      `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 ${unit(1)}, transparent ${unit(1)} ${unit(2.5)})`,
    );
  }

  // Peach finish has a brushed, slightly matte surface; mercerised has a gentle lustre.
  if (finish === "peach") layers.push("linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05))");
  if (finish === "mercerised") {
    layers.push("linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 55%)");
  }

  // Soft fold shading so the swatch reads as cloth, not a flat block of colour.
  layers.push("linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.12))");

  const style: CSSProperties = { backgroundColor: hex, backgroundImage: layers.join(", ") };

  return label ? (
    <div role="img" aria-label={label} className={className} style={style} />
  ) : (
    <div aria-hidden="true" className={className} style={style} />
  );
}
