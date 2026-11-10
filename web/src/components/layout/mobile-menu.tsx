"use client";

import { useRef } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { NavLinks } from "./nav-links";

const mobileLink =
  "flex min-h-13 items-center border-b border-gold-400/10 font-display text-[1.6rem] text-ivory aria-[current=page]:text-gold-300";

/**
 * Phone menu built on <details>, so it opens and closes even without JavaScript (NFR-05).
 * With JavaScript, choosing a link or pressing Escape closes it.
 */
export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };

  return (
    <details
      ref={ref}
      className="group lg:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && ref.current?.open) {
          close();
          ref.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary className="inline-flex min-h-12 items-center gap-2 rounded-sm border border-gold-400/40 px-4 font-semibold text-gold-200 hover:border-gold-300">
        <MenuIcon className="group-open:hidden" />
        <CloseIcon className="hidden group-open:block" />
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Close</span>
      </summary>
      <div className="absolute inset-x-0 top-full border-t border-gold-400/20 bg-maroon-900 shadow-xl">
        <nav aria-label="Main" className="container-page py-4">
          <NavLinks linkClassName={mobileLink} onNavigate={close} />
        </nav>
      </div>
    </details>
  );
}
