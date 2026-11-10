import { siteConfig } from "@/config/site";

export interface WhatsAppFabric {
  code: string;
  label: string;
}

/** "923001234567" → "+92 300 1234567" (Pakistani mobile format); other numbers as "+<digits>". */
export function formatWhatsAppNumber(number: string): string {
  const digits = number.replace(/\D/g, "");
  const pk = digits.match(/^92(\d{3})(\d{7})$/);
  return pk ? `+92 ${pk[1]} ${pk[2]}` : `+${digits}`;
}

export function whatsappMessage(fabric?: WhatsAppFabric): string {
  return fabric
    ? `Assalam o Alaikum, I am interested in ${fabric.code} ${fabric.label}. Please share the price and available colours.`
    : "Assalam o Alaikum, I would like to ask about your fabrics.";
}

/** FR-06: WhatsApp click-to-chat link with a pre-filled message (fabric name included on fabric pages). */
export function whatsappUrl(fabric?: WhatsAppFabric, number: string = siteConfig.whatsappNumber): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(whatsappMessage(fabric))}`;
}
