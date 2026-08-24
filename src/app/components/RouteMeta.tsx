import { useEffect } from "react";
import { useLocation } from "react-router";
import routeMeta from "../../lib/routeMeta.json";
import projects from "../../lib/projects.data.json";

const SITE = "https://www.deev.lu";

type Meta = { title: string; description: string };
const ROUTES: Record<string, Meta> = { ...(routeMeta as Record<string, Meta & { file: string }>) };

/* The case-study routes are not in routeMeta.json: they are derived from the
   project data, by this file and by scripts/prerender-routes.mjs, from the
   same two lines of template. Without this, moving to a project in-app left
   the previous page's title and canonical in the document. */
for (const p of projects as { slug: string; title: string; category: string; year: number }[]) {
  ROUTES[`/work/${p.slug}`] = {
    title: `${p.title} | ${p.category} | DEEV`,
    description: `${p.title}: a ${p.category.toLowerCase()} designed and built by DEEV, an AI-native digital engineering studio in Luxembourg. Shipped ${p.year}.`,
  };
}

/**
 * Keeps <title>, the meta description and the canonical link in step with the
 * current route during client-side navigation.
 *
 * The static documents emitted by scripts/prerender-routes.mjs already carry
 * the right tags on first load — this covers the case where a visitor (or a
 * crawler that follows in-app links) moves between routes without a reload.
 * Both read the same src/lib/routeMeta.json, so the two can't drift.
 */
export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = ROUTES[pathname];
    if (!meta) return; // unknown path, leave the document as served

    document.title = meta.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", meta.description);

    const url = pathname === "/" ? `${SITE}/` : `${SITE}${pathname}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", url);
  }, [pathname]);

  return null;
}
