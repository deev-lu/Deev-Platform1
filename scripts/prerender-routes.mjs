// Emit one static HTML document per route after `vite build`.
//
// Why this exists: vercel.json rewrites every path to index.html, and
// index.html carries a hardcoded <link rel="canonical" href="https://www.deev.lu/">.
// So every URL on the domain answered 200 with the homepage's canonical, and
// Google filed them all under "Alternative page with proper canonical tag" —
// 28 of them. Indexed pages fell 29 → 5 after the June 2026 relaunch.
//
// Each route now ships its own canonical, title and description. The body is
// unchanged and still hydrates as the same SPA.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://www.deev.lu";

const routes = JSON.parse(readFileSync(join(root, "src/lib/routeMeta.json"), "utf8"));

// A document per case study, derived from the same data the app renders.
// Every value here is a fact from projects.data.json — nothing is invented.
const projects = JSON.parse(readFileSync(join(root, "src/lib/projects.data.json"), "utf8"));
mkdirSync(join(dist, "work"), { recursive: true });
for (const p of projects) {
  routes[`/work/${p.slug}`] = {
    file: `work/${p.slug}.html`,
    title: `${p.title} | ${p.category} | DEEV`,
    description: `${p.title}: a ${p.category.toLowerCase()} designed and built by DEEV, an AI-native digital engineering studio in Luxembourg. Shipped ${p.year}.`,
    project: p,
  };
}
const template = readFileSync(join(dist, "index.html"), "utf8");

// Screenshots are emitted with a content hash, and the six taken before the
// filename convention kept their old names (same aliases as src/lib/projects.ts).
// Matching them here lets a case study share its own picture instead of the
// studio's default card.
const ALIASES = {
  "bureau-immobilier-feltes": "feltes",
  "aurora-experience": "aurora",
  "oscars-bar": "oscarsbar",
  "geoplus-3d": "geoplus",
  "vino-amore": "vinoamore",
};
const assets = readdirSync(join(dist, "assets"));
const shotFor = (slug) => {
  const base = ALIASES[slug] ?? slug;
  return assets.find((f) => new RegExp(`^${base}-[A-Za-z0-9_-]+\\.jpe?g$`).test(f));
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// index.html formats several of these across multiple lines, so every pattern
// has to tolerate whitespace between attributes. A single-line regex matches
// nothing and silently leaves the homepage's copy in place.
// Each pattern captures exactly three groups: opening, value, closing.
const metaTag = (attr, name) =>
  new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")([\\s\\S]*?)(")`);

let written = 0;
for (const [routePath, route] of Object.entries(routes)) {
  const url = routePath === "/" ? `${SITE}/` : `${SITE}${routePath}`;
  const title = esc(route.title);
  const description = esc(route.description);

  const shot = route.project ? shotFor(route.project.slug) : undefined;
  const image = shot ? `${SITE}/assets/${shot}` : null;

  const edits = [
    { label: "title",               re: /(<title>)([\s\S]*?)(<\/title>)/,                    value: title },
    { label: "canonical",           re: /(<link\s+rel="canonical"\s+href=")([^"]*)(")/,      value: url },
    { label: "description",         re: metaTag("name", "description"),                      value: description },
    { label: "og:url",              re: metaTag("property", "og:url"),                       value: url },
    { label: "og:title",            re: metaTag("property", "og:title"),                     value: title },
    { label: "og:description",      re: metaTag("property", "og:description"),               value: description },
    { label: "twitter:title",       re: metaTag("name", "twitter:title"),                    value: title },
    { label: "twitter:description", re: metaTag("name", "twitter:description"),              value: description },
    ...(image
      ? [
          { label: "og:image",       re: metaTag("property", "og:image"),      value: image },
          { label: "twitter:image",  re: metaTag("name", "twitter:image"),     value: image },
          { label: "og:image:width", re: metaTag("property", "og:image:width"), value: "1000" },
          { label: "og:image:height", re: metaTag("property", "og:image:height"), value: "583" },
          { label: "og:image:alt",   re: metaTag("property", "og:image:alt"),  value: esc(`${route.project.title}, ${route.project.category}`) },
        ]
      : []),
  ];

  let html = template;
  for (const { label, re, value } of edits) {
    if (!re.test(html)) throw new Error(`prerender: ${label} not found in dist/index.html (route ${routePath})`);
    html = html.replace(re, (_m, open, _old, close) => `${open}${value}${close}`);
  }

  // Re-read every tag from the emitted document. A silent miss is worse than a
  // failed build: it ships duplicate metadata that looks fine in the diff.
  for (const { label, re, value } of edits) {
    const found = html.match(re)?.[2];
    if (found !== value) {
      throw new Error(`prerender: ${label} wrong for ${routePath} — got ${JSON.stringify(found)}`);
    }
  }

  // A case study should describe itself, not just inherit the studio's
  // ProfessionalService block from the homepage template. Every value below is
  // a fact from projects.data.json: no ratings, no invented claims.
  if (route.project) {
    const p = route.project;
    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Deev", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: p.title, item: url },
          ],
        },
        {
          "@type": "CreativeWork",
          name: p.title,
          url,
          genre: p.category,
          dateCreated: String(p.year),
          inLanguage: "en",
          creator: { "@type": "Organization", name: "Deev", url: `${SITE}/` },
          ...(p.link ? { sameAs: p.link } : {}),
        },
      ],
    };
    const block = `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
    html = html.replace("</head>", `  ${block}\n  </head>`);
    // Fail the build rather than ship a document with broken structured data.
    const emitted = html.match(/<script type="application\/ld\+json">(\{"@context":"https:\/\/schema\.org","@graph".*?)<\/script>/s)?.[1];
    if (!emitted) throw new Error(`prerender: structured data missing for ${routePath}`);
    JSON.parse(emitted);
  }

  writeFileSync(join(dist, route.file), html);
  written++;
  console.log(`  ${route.file.padEnd(13)} ${url}`);
}
console.log(`prerender: ${written} route documents verified and written`);

// ── 404 ───────────────────────────────────────────────────────────────────
// Vercel serves this for any path that does not resolve, with a real 404
// status. Before this existed, a catch-all rewrite answered every unknown URL
// with the homepage at HTTP 200: every typo, every dead legacy link and every
// tracking variant became a duplicate of the front page in Google's index.
{
  let html = template;
  const edits = [
    { re: /(<title>)([\s\S]*?)(<\/title>)/, value: esc("Page not found | DEEV") },
    {
      re: metaTag("name", "description"),
      value: esc("That page does not exist. Everything DEEV has published is one click away from the homepage."),
    },
    { re: /(<meta\s+name="robots"\s+content=")([^"]*)(")/, value: "noindex, follow" },
  ];
  for (const { re, value } of edits) {
    if (!re.test(html)) throw new Error("prerender: 404 template tag missing");
    html = html.replace(re, (_m, open, _old, close) => `${open}${value}${close}`);
  }
  // A page that does not exist should not claim a canonical URL.
  html = html.replace(/\s*<link\s+rel="canonical"[^>]*>/, "");
  if (/rel="canonical"/.test(html)) throw new Error("prerender: canonical not stripped from 404.html");
  if (!/content="noindex, follow"/.test(html)) throw new Error("prerender: 404.html is not noindex");
  writeFileSync(join(dist, "404.html"), html);
  console.log("  404.html      (noindex, no canonical)");
}

// The sitemap is generated, not hand-maintained, so a new project cannot be
// shipped without it. Search Console showed the site down to 5 indexed pages;
// every case study is a page worth indexing.
const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(routes).map((path) => {
  const loc = path === "/" ? `${SITE}/` : `${SITE}${path}`;
  const priority = path === "/" ? "1.0" : path.startsWith("/work/") ? "0.7" : "0.5";
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
});
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`
);
console.log(`prerender: sitemap.xml written with ${urls.length} URLs`);
