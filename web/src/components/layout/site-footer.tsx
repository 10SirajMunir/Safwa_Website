import Image from "next/image";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { formatAddress, siteConfig } from "@/config/site";
import { Ornament } from "@/components/ui/ornament";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** Footer with the business Name, Address and Phone from the single settings source (FR-19). */
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-maroon-900 text-gold-200/85">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image
            src="/brand/al-safwa-fabrics-logo-gold.png"
            alt={siteConfig.name}
            width={150}
            height={178}
            className="h-auto w-[7.5rem]"
          />
          <p className="mt-5 max-w-xs text-[0.975rem]">
            Cotton and poly-cotton fabrics by GSM, width and colour.{" "}
            <strong className="font-semibold text-gold-300">MOQ {siteConfig.moqMeters} meters per colour.</strong>
          </p>
          <a
            href="/al-safwa-fabrics-catalogue.pdf"
            download
            className="mt-4 inline-flex min-h-11 items-center font-semibold text-gold-300 underline decoration-gold-400/50 underline-offset-4 hover:text-ivory"
          >
            Download the PDF catalogue
          </a>
        </div>

        <div>
          <h2 className="eyebrow text-gold-400">Visit or call</h2>
          <address className="mt-4 space-y-2 text-[0.975rem] not-italic" data-testid="footer-nap">
            <p className="font-semibold text-ivory">{siteConfig.name}</p>
            <p>{formatAddress()}</p>
            <p>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:text-ivory hover:underline">
                {siteConfig.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${siteConfig.email}`} className="underline-offset-4 hover:text-ivory hover:underline">
                {siteConfig.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="eyebrow text-gold-400">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-[0.975rem] lg:grid-cols-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page pb-28 sm:pb-10">
        <Ornament className="opacity-40" />
        <div className="mt-6 flex flex-col gap-2 text-[0.875rem] text-gold-200/60 sm:flex-row sm:justify-between">
          <p>
            © <CopyrightYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p>We accept {siteConfig.paymentMethods.join(", ")}.</p>
        </div>
      </div>
    </footer>
  );
}
