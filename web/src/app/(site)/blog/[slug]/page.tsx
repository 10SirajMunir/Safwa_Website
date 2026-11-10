import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug, getFabricsForArticle } from "@/server/content/repository";
import { guideCategoryLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import type { ArticleBlock } from "@/types/content";
import { ExternalButton } from "@/components/ui/button-link";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Ornament } from "@/components/ui/ornament";
import { FabricCard } from "@/components/fabric/fabric-card";

// Same rendering rules as fabric pages: full HTML, real 404 for unknown slugs.
export const instant = false;
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const article = await getArticleBySlug((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        // Focusable so keyboard users can scroll a wide table on a phone.
        <div className="overflow-x-auto" role="region" aria-label={`Table: ${block.head.filter(Boolean).join(", ")}`} tabIndex={0}>
          <table className="w-full min-w-[30rem] border-collapse text-left text-[1rem]">
            <thead>
              <tr className="border-b-2 border-maroon-800">
                {block.head.map((cell, i) => (
                  <th key={i} scope="col" className="py-2.5 pr-4 font-semibold text-maroon-800">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-b border-line">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-2.5 pr-4 font-semibold text-ink">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="py-2.5 pr-4">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const article = await getArticleBySlug((await params).slug);
  if (!article) notFound();
  const fabrics = await getFabricsForArticle(article);

  return (
    <>
      <article className="container-page max-w-3xl py-8 lg:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Fabric guide", href: "/blog" },
            { label: article.title },
          ]}
        />
        <header className="mt-5">
          <p className="eyebrow text-gold-700">{guideCategoryLabels[article.category]}</p>
          <h1 className="mt-3 text-[2.5rem] text-maroon-800 sm:text-[3.25rem]">{article.title}</h1>
          <p className="mt-4 text-[0.9375rem] text-muted">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {article.readingMinutes} min read
          </p>
        </header>
        <Ornament className="mt-8" />
        <div className="prose-article mt-8 text-[1.125rem]">
          {article.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border border-line bg-white/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[1.5rem] leading-snug text-maroon-800">Questions about your order?</p>
          <ExternalButton href={whatsappUrl()} variant="whatsapp">
            <WhatsAppIcon /> Ask on WhatsApp
          </ExternalButton>
        </div>
      </article>

      {/* FR-05: guide → fabrics it mentions */}
      {fabrics.length > 0 && (
        <section className="border-t border-line bg-sand/60 py-14" aria-labelledby="fabrics-heading">
          <div className="container-page">
            <h2 id="fabrics-heading" className="text-[2rem] text-maroon-800">
              Fabrics in this guide
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fabrics.map((fabric) => (
                <li key={fabric.slug}>
                  <FabricCard fabric={fabric} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
