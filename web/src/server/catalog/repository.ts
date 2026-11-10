// The only way pages read fabric data. Phase 1 reads the typed content file;
// Phase 2 replaces these function bodies with PostgreSQL queries (NFR-08: one source
// of fabric data), so pages and components do not change.
import "server-only";
import { fabrics } from "@/content/fabrics";
import { articles } from "@/content/articles";
import type { Fabric, FabricType } from "@/types/fabric";
import type { Article } from "@/types/content";

export async function getAllFabrics(): Promise<Fabric[]> {
  return fabrics;
}

export async function getFabricBySlug(slug: string): Promise<Fabric | undefined> {
  return fabrics.find((fabric) => fabric.slug === slug);
}

export async function getFeaturedFabrics(): Promise<Fabric[]> {
  return fabrics.filter((fabric) => fabric.featured);
}

export async function getFabricTypes(): Promise<{ type: FabricType; count: number }[]> {
  const counts = new Map<FabricType, number>();
  for (const fabric of fabrics) counts.set(fabric.type, (counts.get(fabric.type) ?? 0) + 1);
  return [...counts].map(([type, count]) => ({ type, count }));
}

/** FR-05: fabrics that share the type, weave or a use with this one, closest matches first. */
export async function getRelatedFabrics(fabric: Fabric, limit = 3): Promise<Fabric[]> {
  const score = (other: Fabric) =>
    (other.type === fabric.type ? 2 : 0) +
    (other.weave === fabric.weave ? 2 : 0) +
    other.uses.filter((use) => fabric.uses.includes(use)).length;

  return fabrics
    .filter((other) => other.slug !== fabric.slug)
    .map((other) => ({ other, score: score(other) }))
    .filter(({ score: s }) => s > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ other }) => other);
}

/** FR-05: guides linked from a fabric page. */
export async function getGuidesForFabric(fabric: Fabric): Promise<Article[]> {
  return articles.filter(
    (article) => fabric.relatedGuides.includes(article.slug) || article.relatedFabrics.includes(fabric.slug),
  );
}
