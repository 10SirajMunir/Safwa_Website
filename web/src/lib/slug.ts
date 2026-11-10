/** Lowercase, hyphen-separated, ASCII-only slug (FR-14), e.g. "65% Polyester 35% Cotton" → "65-polyester-35-cotton". */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
