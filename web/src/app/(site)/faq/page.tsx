import type { Metadata } from "next";
import { getFaqs } from "@/server/content/repository";
import { faqPageJsonLd } from "@/lib/structured-data";
import { whatsappUrl } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/page-header";
import { ExternalButton } from "@/components/ui/button-link";
import { WhatsAppIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "FAQ – MOQ, delivery, payment, samples and colour matching",
  description:
    "Direct answers: our MOQ is 100 meters per colour. We accept cash on delivery, Easypaisa, JazzCash and bank transfer. Samples and colour matching on request.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <PageHeader eyebrow="Quick answers" title="Frequently asked questions" crumbs={[{ label: "FAQ" }]}>
        <p>MOQ, delivery, payment, samples and colour matching.</p>
      </PageHeader>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
        <div className="border-t border-line">
          {faqs.map((faq) => (
            <details key={faq.id} id={faq.id} className="group border-b border-line" open={faq.id === "moq"}>
              <summary className="flex min-h-16 items-center justify-between gap-6 py-4">
                <h2 className="font-display text-[1.6rem] leading-snug text-maroon-800 sm:text-[1.85rem]">{faq.question}</h2>
                <span className="shrink-0 text-[1.75rem] leading-none text-gold-700 transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-[1.0625rem] text-ink">{faq.answer}</p>
            </details>
          ))}
        </div>

        <aside className="self-start border border-line bg-white/60 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-[1.75rem] text-maroon-800">Still have a question?</h2>
          <p className="mt-2 text-muted">Ask us directly. We usually reply on WhatsApp first.</p>
          <ExternalButton href={whatsappUrl()} variant="whatsapp" className="mt-5 w-full">
            <WhatsAppIcon /> Ask on WhatsApp
          </ExternalButton>
        </aside>
      </div>

      <JsonLd data={faqPageJsonLd(faqs)} />
    </>
  );
}
