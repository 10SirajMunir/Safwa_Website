// Blog and FAQ data access. Phase 2: PostgreSQL via the admin (AD-05, AD-06).
import "server-only";
import { articles } from "@/content/articles";
import { faqs } from "@/content/faq";
import { fabrics } from "@/content/fabrics";
import type { Article, FaqItem, GuideCategory } from "@/types/content";
import type { Fabric } from "@/types/fabric";

const newestFirst = (a: Article, b: Article) => b.publishedAt.localeCompare(a.publishedAt);

export async function getAllArticles(): Promise<Article[]> {
  return [...articles].sort(newestFirst);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return articles.find((article) => article.slug === slug);
}

export async function getArticlesByCategory(): Promise<{ category: GuideCategory; articles: Article[] }[]> {
  const order: GuideCategory[] = ["gsm-guides", "fabric-comparisons", "fabric-uses"];
  return order
    .map((category) => ({
      category,
      articles: articles.filter((a) => a.category === category).sort(newestFirst),
    }))
    .filter((group) => group.articles.length > 0);
}

export async function getFabricsForArticle(article: Article): Promise<Fabric[]> {
  return article.relatedFabrics
    .map((slug) => fabrics.find((fabric) => fabric.slug === slug))
    .filter((fabric): fabric is Fabric => fabric !== undefined);
}

export async function getFaqs(): Promise<FaqItem[]> {
  return faqs;
}
