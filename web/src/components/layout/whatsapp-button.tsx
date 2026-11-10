import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappUrl, type WhatsAppFabric } from "@/lib/whatsapp";

/**
 * FR-06: floating WhatsApp button. The site layout renders the general one on every page;
 * a fabric page adds one that names its fabric, and CSS (globals.css, `data-whatsapp`)
 * hides the general button whenever a fabric button is present. Pure server HTML, so it
 * works with JavaScript turned off.
 */
export function WhatsAppButton({ fabric }: { fabric?: WhatsAppFabric }) {
  return (
    <a
      href={whatsappUrl(fabric)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float"
      data-whatsapp={fabric ? "fabric" : "general"}
      aria-label={fabric ? `Ask about ${fabric.code} ${fabric.label} on WhatsApp` : "Chat with us on WhatsApp"}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 inline-flex min-h-14 items-center gap-2 rounded-full bg-whatsapp pl-4 pr-5 font-semibold text-white shadow-[0_8px_24px_-6px_rgba(11,94,49,0.55)] transition-colors hover:bg-whatsapp-dark sm:right-6"
    >
      <WhatsAppIcon width={26} height={26} />
      <span>WhatsApp</span>
    </a>
  );
}
