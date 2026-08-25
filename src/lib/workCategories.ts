/**
 * The portfolio's categories, each one a real page.
 *
 * They used to be component state: clicking "Online stores" changed what was
 * on screen but not the URL, so a category could not be linked to, shared,
 * bookmarked or indexed, and the navigation had nowhere to point. Each one is
 * its own route now, prerendered per language like every other page.
 *
 * The slugs stay English in all three languages, the same as /work and /news.
 * Only the language prefix changes.
 */

export const WORK_CATEGORIES = [
  { slug: "", filter: "All" as const, key: "all" as const },
  { slug: "websites", filter: "Website" as const, key: "website" as const },
  { slug: "online-stores", filter: "E-commerce" as const, key: "ecommerce" as const },
  { slug: "web-apps", filter: "Web App" as const, key: "webapp" as const },
];

export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export const categoryBySlug = (slug?: string) =>
  WORK_CATEGORIES.find((c) => c.slug === (slug ?? "")) ?? WORK_CATEGORIES[0];

/** "" -> "/work", "websites" -> "/work/websites" */
export const categoryPath = (slug: string) => (slug ? `/work/${slug}` : "/work");
