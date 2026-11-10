import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  /** Trail after "Home", ending with the current page (no href). */
  crumbs: Crumb[];
  children?: ReactNode;
}

/** Top of every inner page: breadcrumb back to Home, then the page's single H1 (FR-15). */
export function PageHeader({ eyebrow, title, crumbs, children }: PageHeaderProps) {
  return (
    <header className="bg-maroon-800 text-ivory">
      <div className="container-page pb-10 pt-3 sm:pb-14 sm:pt-5">
        <Breadcrumbs tone="light" items={[{ label: "Home", href: "/" }, ...crumbs]} />
        {eyebrow && <p className="eyebrow mt-4 text-gold-400 sm:mt-6">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-[2.375rem] text-ivory sm:text-[3.25rem]">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-[1.0625rem] text-gold-200/90 sm:text-lg">{children}</div>}
      </div>
    </header>
  );
}
