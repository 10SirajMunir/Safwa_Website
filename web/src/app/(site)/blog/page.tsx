import Link from "next/link";
import type { Metadata } from "next";
import { getArticlesByCategory } from "@/server/content/repository";
import { guideCategoryLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Fabric guide – GSM, fabric comparisons and uses",
  description:
    "Plain-language guides for fabric buyers: what GSM means, cotton vs poly-cotton, and which fabric to choose for shirts, uniforms, kurtas and trousers.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const groups = await getArticlesByCategory();

  return (
    <>
      <PageHeader eyebrow="Fabric guide" title="Know your fabric before you order" crumbs={[{ label: "Fabric guide" }]}>
        <p>Short, practical guides on GSM, fabric types and what to use for what.</p>
      </PageHeader>

      <div className="container-page space-y-14 py-12 lg:py-16">
        {groups.map(({ category, articles }) => (
          <section key={category} aria-labelledby={`cat-${category}`}>
            <h2 id={`cat-${category}`} className="eyebrow text-gold-700">
              {guideCategoryLabels[category]}
            </h2>
            <ul className="mt-4 border-t border-line">
              {articles.map((article) => (
                <li key={article.slug} className="border-b border-line">
                  <Link href={`/blog/${article.slug}`} className="group grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                    <span>
                      <span className="block font-display text-[1.75rem] leading-snug text-maroon-800 group-hover:underline group-hover:decoration-gold-500 group-hover:underline-offset-4 sm:text-[2rem]">
                        {article.title}
                      </span>
                      <span className="mt-1.5 block max-w-2xl text-muted">{article.description}</span>
                    </span>
                    <span className="flex items-center gap-3 text-[0.9375rem] text-muted">
                      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                      <span aria-hidden="true">·</span>
                      {article.readingMinutes} min read
                      <ArrowRightIcon className="hidden text-gold-700 transition-transform group-hover:translate-x-1 sm:block" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
