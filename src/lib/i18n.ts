/**
 * Three languages, one app.
 *
 * English lives at the root and French and German sit behind /fr and /de, the
 * shape Google documents for a multilingual site: one URL per language per
 * page, each one crawlable on its own and each one declaring the others with
 * hreflang. A switcher that swapped the copy in place would have given three
 * languages a single URL, so two of them could never be indexed or linked.
 *
 * The locale is read from the path rather than held in state. That keeps it
 * true after a reload, a shared link or a crawl, and means the prerendered
 * document and the hydrated app can never disagree about which language the
 * page is in.
 */

export const LOCALES = ["en", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** What the switcher shows. Endonyms: a French speaker looks for Français. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
};

/** Two letters in the switcher, the full name in its title and aria-label. */
export const LOCALE_SHORT: Record<Locale, string> = { en: "EN", fr: "FR", de: "DE" };

/** hreflang values. Plain language codes: the site is not region-specific. */
export const LOCALE_HREFLANG: Record<Locale, string> = { en: "en", fr: "fr", de: "de" };

const PREFIXED = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/** "/fr/work" -> "fr". Anything without a known prefix is English. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.replace(/^\/+/, "").split("/")[0]?.toLowerCase();
  return (PREFIXED as readonly string[]).includes(first) ? (first as Locale) : DEFAULT_LOCALE;
}

/** "/fr/work" -> "/work". The path as the router's route table knows it. */
export function stripLocale(pathname: string): string {
  const locale = localeFromPath(pathname);
  if (locale === DEFAULT_LOCALE) return pathname || "/";
  const rest = pathname.replace(new RegExp(`^/${locale}(?=/|$)`, "i"), "");
  return rest === "" ? "/" : rest;
}

/** ("/work", "de") -> "/de/work". ("/", "de") -> "/de". */
export function withLocale(path: string, locale: Locale): string {
  const clean = stripLocale(path);
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Every language's URL for one page, for hreflang and for the switcher. */
export function alternates(path: string): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, withLocale(path, l)])) as Record<Locale, string>;
}
