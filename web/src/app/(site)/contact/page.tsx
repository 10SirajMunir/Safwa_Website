import type { Metadata } from "next";
import { formatAddress, siteConfig } from "@/config/site";
import { formatWhatsAppNumber, whatsappUrl } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/page-header";
import { ExternalButton } from "@/components/ui/button-link";
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { InquiryForm } from "@/components/forms/inquiry-form";

export const metadata: Metadata = {
  title: "Contact us – phone, WhatsApp, email and address",
  description: `Contact ${siteConfig.name}: call, WhatsApp or email us, visit our address, or send an inquiry. MOQ 100 m per colour.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const address = formatAddress();
  const telHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

  return (
    <>
      <PageHeader eyebrow="We are here to help" title="Contact us" crumbs={[{ label: "Contact" }]}>
        <p>Call, message or visit. For prices, WhatsApp is usually the quickest.</p>
      </PageHeader>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_1.25fr] lg:py-16">
        {/* NAP from the single settings source (FR-19) */}
        <section aria-labelledby="details-heading">
          <h2 id="details-heading" className="text-[2rem] text-maroon-800">
            {siteConfig.name}
          </h2>
          <address className="mt-5 space-y-4 not-italic" data-testid="contact-nap">
            <p className="flex gap-3">
              <MapPinIcon className="mt-1 shrink-0 text-gold-700" />
              <span>{address}</span>
            </p>
            <p className="flex gap-3">
              <PhoneIcon className="mt-1 shrink-0 text-gold-700" />
              <a href={telHref} className="font-semibold underline decoration-gold-500 underline-offset-4">
                {siteConfig.phone}
              </a>
            </p>
            <p className="flex gap-3">
              <WhatsAppIcon className="mt-1 shrink-0 text-gold-700" />
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-gold-500 underline-offset-4"
              >
                WhatsApp {formatWhatsAppNumber(siteConfig.whatsappNumber)}
              </a>
            </p>
            <p className="flex gap-3">
              <MailIcon className="mt-1 shrink-0 text-gold-700" />
              <a href={`mailto:${siteConfig.email}`} className="font-semibold underline decoration-gold-500 underline-offset-4">
                {siteConfig.email}
              </a>
            </p>
          </address>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <ExternalButton href={whatsappUrl()} variant="whatsapp">
              <WhatsAppIcon /> WhatsApp
            </ExternalButton>
            <ExternalButton href={telHref} variant="outline">
              <PhoneIcon /> Call us
            </ExternalButton>
          </div>
        </section>

        <section aria-labelledby="form-heading" className="bg-white/70 p-5 sm:p-8">
          <h2 id="form-heading" className="text-[2rem] text-maroon-800">
            Send us a message
          </h2>
          <p className="mt-2 text-muted">We reply by phone or WhatsApp.</p>
          <div className="mt-6">
            <InquiryForm variant="contact" />
          </div>
        </section>

        {/* Google Map (FR-09), placed after the form so its ~450 KB of Google scripts
            never compete with the first paint on a phone. No API key needed. */}
        <section aria-label="Map" className="lg:col-span-2">
          <div className="border border-line">
            <iframe
              title={`Map showing ${siteConfig.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              className="aspect-[4/3] w-full sm:aspect-[21/9]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center font-semibold text-maroon-700 underline underline-offset-4"
          >
            Open in Google Maps
          </a>
        </section>
      </div>
    </>
  );
}
