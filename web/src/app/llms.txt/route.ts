// FR-22: /llms.txt, a plain Markdown summary of the business and key pages for AI assistants.
import { absoluteUrl, formatAddress, siteConfig } from "@/config/site";
import { getAllFabrics } from "@/server/catalog/repository";
import { getAllArticles, getFaqs } from "@/server/content/repository";
import { fabricDisplayName, formatWidth } from "@/lib/format";
import { formatWhatsAppNumber } from "@/lib/whatsapp";

export async function GET() {
  const [fabrics, articles, faqs] = await Promise.all([getAllFabrics(), getAllArticles(), getFaqs()]);

  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Key facts",
    `- Minimum order quantity (MOQ): ${siteConfig.moqMeters} meters per colour`,
    `- Payment methods: ${siteConfig.paymentMethods.join(", ")}`,
    `- Address: ${formatAddress()}`,
    `- Phone: ${siteConfig.phone}`,
    `- WhatsApp: ${formatWhatsAppNumber(siteConfig.whatsappNumber)}`,
    `- Email: ${siteConfig.email}`,
    "",
    "## Key pages",
    `- [Fabric catalogue](${absoluteUrl("/fabrics")}): all fabrics, filter by type, GSM, composition, width, colour and use`,
    `- [PDF catalogue](${absoluteUrl("/al-safwa-fabrics-catalogue.pdf")}): every fabric with specs, colour codes and QR codes`,
    `- [How to order](${absoluteUrl("/how-to-order")}): steps, MOQ and payment`,
    `- [FAQ](${absoluteUrl("/faq")}): MOQ, delivery, payment, samples, colour matching`,
    `- [About](${absoluteUrl("/about")})`,
    `- [Contact](${absoluteUrl("/contact")})`,
    "",
    "## Fabrics",
    ...fabrics.map(
      (f) =>
        `- [${f.code} ${fabricDisplayName(f)}](${absoluteUrl(`/fabrics/${f.slug}`)}): ${f.composition}, ${formatWidth(f)}, ${f.colours.length} colours, MOQ ${f.moq} m per colour`,
    ),
    "",
    "## Fabric guides",
    ...articles.map((a) => `- [${a.title}](${absoluteUrl(`/blog/${a.slug}`)}): ${a.description}`),
    "",
    "## FAQ",
    ...faqs.flatMap((q) => [`### ${q.question}`, q.answer, ""]),
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
