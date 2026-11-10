// FR-16: XML sitemap of every public page, category, fabric and guide.
// Phase 2 refreshes it on publish (AD-10).
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getAllFabrics, getFabricTypes } from "@/server/catalog/repository";
import { getFilterOptions } from "@/server/catalog/filters";
import { getAllArticles } from "@/server/content/repository";

const STATIC_PAGES = ["/", "/fabrics", "/how-to-order", "/about", "/blog", "/faq", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [fabrics, types, articles] = await Promise.all([getAllFabrics(), getFabricTypes(), getAllArticles()]);

  return [
    ...STATIC_PAGES.map((path) => ({ url: absoluteUrl(path) })),
    ...types.map(({ type }) => ({ url: absoluteUrl(`/fabrics?type=${type}`) })),
    ...getFilterOptions(fabrics).use.map(({ value }) => ({ url: absoluteUrl(`/fabrics?use=${value}`) })),
    ...fabrics.map((fabric) => ({ url: absoluteUrl(`/fabrics/${fabric.slug}`) })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/blog/${article.slug}`),
      lastModified: article.updatedAt ?? article.publishedAt,
    })),
  ];
}
