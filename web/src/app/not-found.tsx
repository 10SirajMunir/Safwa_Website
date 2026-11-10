import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NotFoundContent } from "@/components/layout/not-found-content";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

// Unmatched URLs render outside the (site) layout, so this page brings its own header and footer.
export default function GlobalNotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
