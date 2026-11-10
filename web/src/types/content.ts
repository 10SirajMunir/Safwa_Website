export type GuideCategory = "gsm-guides" | "fabric-comparisons" | "fabric-uses";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  body: ArticleBlock[];
  relatedFabrics: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  topic: "moq" | "delivery" | "payment" | "samples" | "colour-matching";
}
