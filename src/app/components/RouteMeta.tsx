import { useEffect } from "react";
import { useLocation } from "react-router";
import routeMeta from "../../lib/routeMeta.json";
import projects from "../../lib/projects.data.json";
import { LOCALES, LOCALE_HREFLANG, DEFAULT_LOCALE, localeFromPath, stripLocale, withLocale } from "../../lib/i18n";

const SITE = "https://www.deev.lu";

type Meta = { title: string; description: string };
type Locale = (typeof LOCALES)[number];

const fill = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** The homepage keeps its trailing slash; nothing else has one. Same rule as
 *  scripts/prerender-routes.mjs, so the served document and this agree. */
const abs = (path: string) => (path === "/" ? `${SITE}/` : `${SITE}${path}`);

/**
 * Title, description, canonical, hreflang and <html lang> for the current
 * route and language.
 *
 * scripts/prerender-routes.mjs writes the same tags into the static document
 * for the first load; this covers in-app navigation, where a visitor moving
 * from the homepage to a case study would otherwise keep the previous page's
 * title, and a visitor switching language would keep the previous language's
 * canonical. Both read this same JSON, so the two cannot drift.
 */
function metaFor(path: string, locale: Locale): Meta | null {
  const route = (routeMeta.routes as Record<string, { meta: Record<string, Meta> }>)[path];
  if (route) return route.meta[locale];

  const slug = path.startsWith("/work/") ? path.slice("/work/".length) : null;
  if (!slug) return null;
  const p = (projects as { slug: string; title: string; category: string; year: number }[])
    .find((x) => x.slug === slug);
  if (!p) return null;

  const tpl = (routeMeta.workCase as Record<string, Meta>)[locale];
  const vars = {
    title: p.title,
    category: p.category,
    categoryLower: p.category.toLowerCase(),
    year: String(p.year),
  };
  return { title: fill(tpl.title, vars), description: fill(tpl.description, vars) };
}

/** One <link rel="alternate"> per language, plus x-default, replaced each time. */
function writeAlternates(path: string) {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  const add = (hreflang: string, href: string) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", hreflang);
    link.setAttribute("href", href);
    document.head.appendChild(link);
  };
  for (const l of LOCALES) add(LOCALE_HREFLANG[l], abs(withLocale(path, l)));
  add("x-default", abs(withLocale(path, DEFAULT_LOCALE)));
}

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const locale = localeFromPath(pathname);
    const path = stripLocale(pathname);

    // The language of the document itself, which screen readers and Google
    // both read before anything else on the page.
    document.documentElement.lang = LOCALE_HREFLANG[locale];

    const meta = metaFor(path, locale);
    if (!meta) return; // unknown path, leave the document as served

    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);

    const url = abs(pathname);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
    document.querySelector('meta[property="og:locale"]')
      ?.setAttribute("content", { en: "en_GB", fr: "fr_FR", de: "de_DE" }[locale]);

    writeAlternates(path);
  }, [pathname]);

  return null;
}
