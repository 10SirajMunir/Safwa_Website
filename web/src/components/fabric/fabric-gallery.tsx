"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Fabric } from "@/types/fabric";
import { fabricDisplayName } from "@/lib/format";
import { FabricTexture } from "./fabric-texture";

type Slide =
  | { key: string; caption: string; kind: "image"; src: string; alt: string }
  | { key: string; caption: string; kind: "video"; src: string; alt: string }
  | { key: string; caption: string; kind: "texture"; hex: string; zoom: number; alt: string };

const MEDIA_CAPTIONS = { flat: "Flat", drape: "Drape", texture: "Texture close-up", colour: "Colour", video: "Video" };

function buildSlides(fabric: Fabric): Slide[] {
  const name = fabricDisplayName(fabric);
  if (fabric.media.length > 0) {
    return fabric.media.map((m, i) => {
      const colour = m.colourCode ? fabric.colours.find((c) => c.code === m.colourCode) : undefined;
      const caption = colour ? colour.name : MEDIA_CAPTIONS[m.kind];
      return m.kind === "video"
        ? { key: `m${i}`, caption, kind: "video", src: m.src, alt: m.alt }
        : { key: `m${i}`, caption, kind: "image", src: m.src, alt: m.alt };
    });
  }
  const [first] = fabric.colours;
  return [
    { key: "flat", caption: "Flat", kind: "texture", hex: first.hex, zoom: 1, alt: `${first.name} ${name}, flat view` },
    {
      key: "texture",
      caption: "Texture close-up",
      kind: "texture",
      hex: first.hex,
      zoom: 3.5,
      alt: `${first.name} ${name}, texture close-up`,
    },
    ...fabric.colours.slice(1).map<Slide>((c) => ({
      key: c.code,
      caption: c.name,
      kind: "texture",
      hex: c.hex,
      zoom: 1,
      alt: `${c.name} ${name}`,
    })),
  ];
}

/**
 * FR-03 gallery. Slides sit in a swipeable scroll-snap row, so every view is reachable
 * by swiping even without JavaScript; thumbnails jump to a view when JavaScript runs.
 */
export function FabricGallery({ fabric }: { fabric: Fabric }) {
  const slides = buildSlides(fabric);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const show = (index: number) => {
    const el = track.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActive(index);
  };

  return (
    // min-w-0 stops the slide row from widening its grid column (no sideways page scroll).
    <div className="min-w-0">
      <div
        ref={track}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const { scrollLeft, clientWidth } = e.currentTarget;
          setActive(Math.round(scrollLeft / clientWidth));
        }}
        aria-label={`${fabricDisplayName(fabric)} photos`}
        role="region"
        tabIndex={0}
      >
        {slides.map((slide, index) => (
          <figure key={slide.key} className="relative aspect-square w-full shrink-0 snap-start overflow-hidden bg-sand sm:aspect-[5/4]">
            {slide.kind === "image" && (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
            )}
            {slide.kind === "video" && (
              <video src={slide.src} aria-label={slide.alt} controls muted playsInline preload="metadata" className="size-full object-cover" />
            )}
            {slide.kind === "texture" && (
              <FabricTexture
                hex={slide.hex}
                weave={fabric.weave}
                finish={fabric.finish}
                zoom={slide.zoom}
                label={slide.alt}
                className="absolute inset-0"
              />
            )}
            <figcaption className="absolute bottom-3 left-3 bg-ivory/95 px-2.5 py-1 text-[0.875rem] font-semibold text-maroon-800">
              {slide.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {slides.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Choose a view">
          {slides.map((slide, index) => (
            <li key={slide.key} className="shrink-0">
              <button
                type="button"
                onClick={() => show(index)}
                aria-label={`Show ${slide.caption}`}
                aria-current={active === index ? "true" : undefined}
                className="relative block size-16 overflow-hidden ring-1 ring-line transition aria-[current=true]:ring-2 aria-[current=true]:ring-maroon-800 sm:size-[4.5rem]"
              >
                {slide.kind === "texture" ? (
                  <FabricTexture hex={slide.hex} weave={fabric.weave} finish={fabric.finish} zoom={slide.zoom} className="absolute inset-0" />
                ) : slide.kind === "image" ? (
                  <Image src={slide.src} alt="" fill sizes="72px" className="object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center bg-maroon-800 text-[0.75rem] font-semibold text-gold-300">
                    Video
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
