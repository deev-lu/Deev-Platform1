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
  { slug: "", tag: null, key: "all" as const },
  { slug: "websites", tag: "website" as const, key: "website" as const },
  { slug: "web-apps", tag: "software" as const, key: "webapp" as const },
  { slug: "online-stores", tag: "ecommerce" as const, key: "ecommerce" as const },
  { slug: "ai-automation", tag: "ai" as const, key: "ai" as const },
] as const;

/**
 * Ein Projekt gehoert in mehrere Kategorien.
 *
 * Vorher entschied ein einzelnes `filter`-Feld, und das unterschlug Arbeit:
 * Feltes ist Website UND Plattform, Vino Amore Website UND Onlineshop. Wer
 * nach Webanwendungen filterte, fand Feltes nicht - obwohl genau dort die
 * anspruchsvollste Arbeit steckt.
 *
 * `services` traegt jetzt alle Zugehoerigkeiten. Fehlt es bei einem alten
 * Eintrag, wird aus `filter` abgeleitet, damit nichts herausfaellt.
 */
const FROM_FILTER: Record<string, string[]> = {
  Website: ["website"],
  "E-commerce": ["ecommerce", "website"],
  "Web App": ["software"],
};

export function tagsOf(p: { services?: readonly string[]; filter: string }): readonly string[] {
  return p.services?.length ? p.services : (FROM_FILTER[p.filter] ?? []);
}

export function inCategory(p: { services?: readonly string[]; filter: string }, tag: string | null) {
  return tag === null || tagsOf(p).includes(tag);
}

export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export const categoryBySlug = (slug?: string) =>
  WORK_CATEGORIES.find((c) => c.slug === (slug ?? "")) ?? WORK_CATEGORIES[0];

/** "" -> "/work", "websites" -> "/work/websites" */
export const categoryPath = (slug: string) => (slug ? `/work/${slug}` : "/work");
