import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { orderSteps } from "@/content/order-steps";
import { whatsappUrl } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink, ExternalButton } from "@/components/ui/button-link";
import { WhatsAppIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "How to order fabric – MOQ 100 m per colour",
  description:
    "Order in six simple steps: choose fabric, colours and quantity, get a quote, pay by cash on delivery, Easypaisa, JazzCash or bank transfer, and we dispatch.",
  alternates: { canonical: "/how-to-order" },
};

export default function HowToOrderPage() {
  return (
    <>
      <PageHeader eyebrow="Ordering made simple" title="How to order" crumbs={[{ label: "How to order" }]}>
        <p>From choosing your fabric to dispatch, in six steps.</p>
      </PageHeader>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_22rem] lg:py-16">
        <ol className="relative space-y-0">
          {orderSteps.map((step, index) => (
            <li key={step.title} className="relative grid grid-cols-[3.25rem_1fr] gap-4 pb-10 last:pb-0">
              {index < orderSteps.length - 1 && (
                <span className="absolute bottom-0 left-[1.6rem] top-14 w-px bg-line" aria-hidden="true" />
              )}
              <span className="flex size-[3.25rem] items-center justify-center rounded-full border border-gold-500 bg-ivory font-display text-[1.6rem] text-maroon-800">
                {index + 1}
              </span>
              <div className="pt-2">
                <h2 className="text-[1.75rem] text-maroon-800">{step.title}</h2>
                <p className="mt-1.5 max-w-xl text-[1.0625rem] text-ink">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-maroon-800 p-6 text-ivory" data-testid="moq-panel">
            <p className="eyebrow text-gold-400">Minimum order (MOQ)</p>
            <p className="mt-2 font-display text-[3.25rem] leading-none text-gold-300">{siteConfig.moqMeters} m</p>
            <p className="mt-1 text-gold-200/90">per colour</p>
            <p className="mt-4 border-t border-gold-400/25 pt-4 text-[0.975rem] text-gold-200/90">
              Two colours of one fabric means at least {siteConfig.moqMeters * 2} meters in total, {siteConfig.moqMeters} m
              of each.
            </p>
          </div>

          <div className="border border-line bg-white/60 p-6">
            <h2 className="font-sans text-[1.0625rem] font-semibold text-ink">Ways to pay</h2>
            <ul className="mt-3 space-y-2">
              {siteConfig.paymentMethods.map((method) => (
                <li key={method} className="flex items-center gap-3">
                  <span className="size-1.5 rotate-45 bg-gold-500" aria-hidden="true" />
                  {method}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.9375rem] text-muted">
              Every order has its own Order ID. We dispatch once payment, or your cash-on-delivery order, is
              confirmed.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <ButtonLink href="/fabrics">Browse fabrics</ButtonLink>
            <ExternalButton href={whatsappUrl()} variant="whatsapp">
              <WhatsAppIcon /> Order on WhatsApp
            </ExternalButton>
          </div>
        </aside>
      </div>
    </>
  );
}
