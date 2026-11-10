import Link from "next/link";

export interface Crumb {
  label: string;
  /** Omit for the current page (the last crumb). */
  href?: string;
}

/** "Home › Fabrics › Cotton Twill 180 GSM": every level one tap away (CR-02). */
export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const link =
    tone === "light"
      ? "text-gold-300 underline-offset-4 hover:text-ivory hover:underline"
      : "text-maroon-700 underline-offset-4 hover:text-maroon-900 hover:underline";
  const current = tone === "light" ? "text-gold-200/80" : "text-muted";
  const separator = tone === "light" ? "text-gold-400/60" : "text-gold-500";

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem]">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && (
              <span className={separator} aria-hidden="true">
                ›
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className={`inline-flex min-h-11 items-center font-semibold ${link}`}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={current}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
