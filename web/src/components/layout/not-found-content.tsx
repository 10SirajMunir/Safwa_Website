import { ButtonLink, ExternalButton } from "@/components/ui/button-link";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappUrl } from "@/lib/whatsapp";

export function NotFoundContent() {
  return (
    <div className="container-page py-20 text-center sm:py-28">
      <p className="eyebrow text-gold-700">Page not found</p>
      <h1 className="mt-3 text-[2.6rem] text-maroon-800 sm:text-[3.25rem]">We could not find that page</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        The fabric or page may have moved. Browse the catalogue, or ask us on WhatsApp.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/fabrics">Browse fabrics</ButtonLink>
        <ExternalButton href={whatsappUrl()} variant="whatsapp">
          <WhatsAppIcon /> Ask on WhatsApp
        </ExternalButton>
      </div>
    </div>
  );
}
