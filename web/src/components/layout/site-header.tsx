import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";

const desktopLink =
  "relative py-2 text-[0.975rem] font-semibold text-gold-200/90 transition-colors hover:text-ivory aria-[current=page]:text-ivory after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold-400 after:transition-transform aria-[current=page]:after:scale-x-100 hover:after:scale-x-100";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-maroon-800 text-ivory shadow-[0_1px_0_rgba(226,190,118,0.18)]">
      <div className="container-page relative flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/al-safwa-swan-mark.png" alt="" width={50} height={52} priority className="h-[52px] w-auto" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.6rem] font-semibold text-gold-300">Al Safwa</span>
            {/* Keeps the link's accessible name "Al Safwa Fabrics" (two words, not "SafwaFabrics"). */}
            <span className="sr-only"> </span>
            <span className="eyebrow mt-1 text-[0.625rem] tracking-[0.32em] text-gold-400/80">Fabrics</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks className="flex items-center gap-7" linkClassName={desktopLink} />
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
