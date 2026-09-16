// Emit one static HTML document per route per language after `vite build`.
//
// Why this exists: every URL on the domain used to answer 200 with the
// homepage's canonical, and Google filed 28 of them under "Alternative page
// with proper canonical tag". Indexed pages fell 29 -> 5 after the June 2026
// relaunch. Each route now ships its own canonical, title and description.
//
// With three languages there are three documents per page, at /, /fr and /de.
// Each one declares the other two with hreflang and carries its own <html
// lang>, which is what lets Google index French and German separately instead
// of reading them as duplicates of the English page. The body is unchanged and
// still hydrates as the same SPA, which reads the language back off the URL.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://www.deev.lu";

const meta = JSON.parse(readFileSync(join(root, "src/lib/routeMeta.json"), "utf8"));
const projects = JSON.parse(readFileSync(join(root, "src/lib/projects.data.json"), "utf8"));
const articles = JSON.parse(readFileSync(join(root, "src/lib/news.data.json"), "utf8"));

// The languages are whatever the metadata actually provides, and every entry
// has to provide the same set. A language added to src/lib/i18n.ts without its
// copy would otherwise ship as pages with the wrong language's title.
const LOCALES = Object.keys(meta.routes["/"].meta);
const DEFAULT_LOCALE = "en";
const OG_LOCALE = { en: "en_GB", fr: "fr_FR", de: "de_DE" };

for (const [name, entry] of [
  ...Object.entries(meta.routes).map(([p, r]) => [`route ${p}`, r.meta]),
  ["workCase", meta.workCase],
  ["article", meta.article],
  ["notFound", meta.notFound],
]) {
  const got = Object.keys(entry).sort().join(",");
  const want = [...LOCALES].sort().join(",");
  if (got !== want) throw new Error(`prerender: ${name} has locales [${got}], expected [${want}]`);
}

const withLocale = (path, locale) =>
  locale === DEFAULT_LOCALE ? path : path === "/" ? `/${locale}` : `/${locale}${path}`;
const abs = (path) => (path === "/" ? `${SITE}/` : `${SITE}${path}`);
const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

// Screenshots are emitted with a content hash, and the six taken before the
// filename convention kept their old names (same aliases as src/lib/projects.ts).
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
  return assets.find((f) => new RegExp(`^${base}-[A-Za-z0-9_-]+\\.(jpe?g|webp)$`).test(f));
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// index.html formats several of these across multiple lines, so every pattern
// has to tolerate whitespace between attributes. A single-line regex matches
// nothing and silently leaves the homepage's copy in place.
const metaTag = (attr, name) =>
  new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")([\\s\\S]*?)(")`);

const template = readFileSync(join(dist, "index.html"), "utf8");

// The static render of the app itself. Built by `vite build --ssr` into
// dist-ssr just before this script runs; see package.json.
//
// Without it every document shipped a loading shell: the word DEEV and
// nothing else. Googlebot executes the JavaScript and saw the real page, but
// the crawlers that feed language models mostly do not, so to them the whole
// site was blank. Now the markup carries the words.
const { render, grantFaq } = await import(pathToFileURL(join(root, "dist-ssr/entry-server.js")).href);

/** Wo die App einhaengt. */
const ROOT_RE = /(<div id="root">)([\s\S]*?)(<\/div>\s*<\/body>)/;
if (!ROOT_RE.test(template)) throw new Error("prerender: #root not found in index.html");

/** Build the full route table: the fixed pages plus one per case study. */
const pages = [];
for (const [path, route] of Object.entries(meta.routes)) {
  pages.push({ path, file: route.file, meta: route.meta });
}
for (const p of projects) {
  const perLocale = {};
  for (const l of LOCALES) {
    const vars = {
      title: p.title,
      category: p.category[l],
      categoryLower: p.category[l].toLowerCase(),
      year: String(p.year),
    };
    perLocale[l] = {
      title: fill(meta.workCase[l].title, vars),
      description: fill(meta.workCase[l].description, vars),
    };
  }
  pages.push({ path: `/work/${p.slug}`, file: `work/${p.slug}.html`, meta: perLocale, project: p });
}

for (const a of articles) {
  const perLocale = {};
  for (const l of LOCALES) {
    if (!a[l]) throw new Error(`prerender: article ${a.slug} has no ${l} text`);
    const vars = { title: a[l].title, excerpt: a[l].excerpt };
    perLocale[l] = {
      title: fill(meta.article[l].title, vars),
      description: fill(meta.article[l].description, vars),
    };
  }
  pages.push({ path: `/blog/${a.slug}`, file: `blog/${a.slug}.html`, meta: perLocale, article: a });
}

let written = 0;
for (const locale of LOCALES) {
  const dir = locale === DEFAULT_LOCALE ? dist : join(dist, locale);
  mkdirSync(join(dir, "work"), { recursive: true });
  mkdirSync(join(dir, "blog"), { recursive: true });
  mkdirSync(join(dir, "services"), { recursive: true });

  for (const page of pages) {
    const url = abs(withLocale(page.path, locale));
    const title = esc(page.meta[locale].title);
    const description = esc(page.meta[locale].description);

    const shot = page.project ? shotFor(page.project.slug) : undefined;
    const image = shot ? `${SITE}/assets/${shot}` : null;

    const edits = [
      { label: "title",               re: /(<title>)([\s\S]*?)(<\/title>)/,               value: title },
      { label: "canonical",           re: /(<link\s+rel="canonical"\s+href=")([^"]*)(")/, value: url },
      { label: "description",         re: metaTag("name", "description"),                 value: description },
      { label: "og:url",              re: metaTag("property", "og:url"),                  value: url },
      { label: "og:title",            re: metaTag("property", "og:title"),                value: title },
      { label: "og:description",      re: metaTag("property", "og:description"),          value: description },
      { label: "og:locale",           re: metaTag("property", "og:locale"),               value: OG_LOCALE[locale] },
      { label: "twitter:title",       re: metaTag("name", "twitter:title"),               value: title },
      { label: "twitter:description", re: metaTag("name", "twitter:description"),         value: description },
      ...(image
        ? [
            { label: "og:image",        re: metaTag("property", "og:image"),        value: image },
            { label: "twitter:image",   re: metaTag("name", "twitter:image"),       value: image },
            { label: "og:image:width",  re: metaTag("property", "og:image:width"),  value: "1000" },
            { label: "og:image:height", re: metaTag("property", "og:image:height"), value: "583" },
            { label: "og:image:alt",    re: metaTag("property", "og:image:alt"),    value: esc(`${page.project.title}, ${page.project.category[locale]}`) },
          ]
        : []),
    ];

    let html = template;
    for (const { label, re, value } of edits) {
      if (!re.test(html)) throw new Error(`prerender: ${label} not found in dist/index.html (${locale} ${page.path})`);
      html = html.replace(re, (_m, open, _old, close) => `${open}${value}${close}`);
    }

    // Re-read every tag from the emitted document. A silent miss is worse than
    // a failed build: it ships duplicate metadata that looks fine in the diff.
    for (const { label, re, value } of edits) {
      const found = html.match(re)?.[2];
      if (found !== value) {
        throw new Error(`prerender: ${label} wrong for ${locale} ${page.path} — got ${JSON.stringify(found)}`);
      }
    }

    // The document's own language.
    html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${locale}"`);
    if (!new RegExp(`<html lang="${locale}"`).test(html)) {
      throw new Error(`prerender: <html lang> not set for ${locale} ${page.path}`);
    }

    // Every language's URL for this page, each one naming all the others.
    // Google requires the set to be reciprocal and to include the page itself.
    const alts = LOCALES.map(
      (l) => `  <link rel="alternate" hreflang="${l}" href="${abs(withLocale(page.path, l))}" />`,
    );
    alts.push(`  <link rel="alternate" hreflang="x-default" href="${abs(withLocale(page.path, DEFAULT_LOCALE))}" />`);
    html = html.replace("</head>", `${alts.join("\n")}\n  </head>`);
    if ((html.match(/rel="alternate" hreflang=/g) || []).length !== LOCALES.length + 1) {
      throw new Error(`prerender: hreflang set incomplete for ${locale} ${page.path}`);
    }

    // Structured data. Every value is a fact from projects.data.json.
    if (!page.project && !page.article && page.path !== "/") {
      const graph = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Deev", item: abs(withLocale("/", locale)) },
          { "@type": "ListItem", position: 2, name: page.meta[locale].title.split("|")[0].trim(), item: url },
        ],
      };
      html = html.replace("</head>", `  <script type="application/ld+json">${JSON.stringify(graph)}</script>\n  </head>`);
    }

    if (page.article) {
      const a = page.article;
      const graph = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Deev", item: abs(withLocale("/", locale)) },
              { "@type": "ListItem", position: 2, name: page.meta[locale].title.split("|")[0].trim(), item: url },
            ],
          },
          {
            "@type": "BlogPosting",
            headline: a[locale].title,
            description: a[locale].description ?? a[locale].excerpt,
            url,
            datePublished: a.date,
            dateModified: a.date,
            inLanguage: locale,
            author: { "@type": "Organization", name: "Deev", url: abs("/") },
            publisher: { "@type": "Organization", name: "Deev", url: abs("/") },
            mainEntityOfPage: url,
          },
        ],
      };
      const block = `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
      html = html.replace("</head>", `  ${block}\n  </head>`);
      const emitted = html.match(/<script type="application\/ld\+json">(\{"@context":"https:\/\/schema\.org","@graph".*?)<\/script>/s)?.[1];
      if (!emitted) throw new Error(`prerender: structured data missing for ${locale} ${page.path}`);
      JSON.parse(emitted);
    }

    if (page.project) {
      const p = page.project;
      const graph = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Deev", item: abs(withLocale("/", locale)) },
              { "@type": "ListItem", position: 2, name: p.title, item: url },
            ],
          },
          {
            "@type": "CreativeWork",
            name: p.title,
            url,
            genre: p.category[locale],
            dateCreated: String(p.year),
            inLanguage: locale,
            creator: { "@type": "Organization", name: "Deev", url: abs("/") },
            ...(p.link ? { sameAs: p.link } : {}),
          },
        ],
      };
      const block = `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
      html = html.replace("</head>", `  ${block}\n  </head>`);
      const emitted = html.match(/<script type="application\/ld\+json">(\{"@context":"https:\/\/schema\.org","@graph".*?)<\/script>/s)?.[1];
      if (!emitted) throw new Error(`prerender: structured data missing for ${locale} ${page.path}`);
      JSON.parse(emitted);
    }

    // The funding page answers seven real questions, so it says so in a form
    // Google and the AI crawlers can read directly. Built from the same
    // dictionary the page renders.
    if (page.path === "/sme-packages") {
      const faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: grantFaq(locale).map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      };
      html = html.replace("</head>", `  <script type="application/ld+json">${JSON.stringify(faq)}</script>\n  </head>`);
      const emitted = html.match(/<script type="application\/ld\+json">(\{"@context":"https:\/\/schema\.org","@type":"FAQPage".*?)<\/script>/s)?.[1];
      if (!emitted) throw new Error(`prerender: FAQPage missing for ${locale} ${page.path}`);
      const parsed = JSON.parse(emitted);
      if (!parsed.mainEntity.length) throw new Error(`prerender: FAQPage for ${locale} has no questions`);
    }

    // Der Koerper der Seite, mit Klassen und Stilen.
    //
    // Vorher wurde beides herausgeschnitten und das Ergebnis unsichtbar hinter
    // einen deckenden Ladebildschirm gelegt: Crawler lasen die Woerter, ein
    // Besucher sah einen Balken, bis das JavaScript fertig war. Gemessen auf
    // gedrosseltem Mobilgeraet waren das 1,4s bis zum ersten Pixel und 2,9s,
    // bis ueberhaupt Inhalt dastand.
    //
    // Jetzt ist dieses Markup die Seite. Es wird angezeigt, und React haengt
    // sich per hydrateRoot daran, statt es zu ersetzen. Die Klassen sind damit
    // keine ueberfluessigen Bytes mehr, sondern das, was die Seite aussehen
    // laesst - sie muessen bleiben.
    const body = await render(withLocale(page.path, locale));
    if (!/<h1[ >]/.test(body) && page.path !== "/legal") {
      throw new Error(`prerender: no h1 in the rendered body for ${locale} ${page.path}`);
    }
    if (body.length < 600) {
      throw new Error(`prerender: body for ${locale} ${page.path} is only ${body.length} bytes`);
    }
    // Der Ladebildschirm faellt hier weg. Er war die Antwort darauf, dass in
    // #root nichts Anzeigbares stand; jetzt steht dort die fertige Seite, und
    // ein Balken davor wuerde sie nur verdecken. In der Entwicklung, wo nicht
    // vorgerendert wird, bleibt er in index.html stehen.
    // `data-ssr` traegt die Sprache, in der dieses Dokument gerendert wurde,
    // nicht nur ein Ja. Der Client vergleicht sie mit der Sprache in der
    // Adresse und hydriert nur, wenn beide uebereinstimmen.
    //
    // Der Grund ist die Aufloesung von /de zu einer Datei. Diese Seite liegt
    // als de/index.html vor, und ob ein Host sie unter /de ausliefert oder
    // auf die englische Wurzel zurueckfaellt, ist Hostverhalten, das ich von
    // hier aus nicht nachpruefen kann. Faellt er zurueck, waere Hydrieren der
    // schlechteste Ausgang: englisches Markup, das sichtbar zu deutschem
    // umspringt. Mit dem Vergleich wird daraus stillschweigend das Verhalten
    // von vorher, naemlich ein sauberes Rendern auf dem Client.
    //
    // Die 404-Seite unten bekommt die Markierung nicht: dort steht weiterhin
    // nur der Ladebildschirm in #root.
    html = html.replace(
      ROOT_RE,
      (_m, _open, _old, close) => `<div id="root" data-ssr="${locale}">${body}${close}`,
    );
    if (!html.includes(body)) throw new Error(`prerender: body not injected for ${locale} ${page.path}`);

    writeFileSync(join(dir, page.file), html);
    written++;
  }
  console.log(`  ${locale}: ${pages.length} documents`);
}
console.log(`prerender: ${written} route documents verified and written`);

// ── 404 ───────────────────────────────────────────────────────────────────
// Vercel serves this for any path that does not resolve, with a real 404
// status. Before this existed, a catch-all rewrite answered every unknown URL
// with the homepage at HTTP 200: every typo, every dead legacy link and every
// tracking variant became a duplicate of the front page in Google's index.
//
// One document, in the default language: the host serves a single 404 for the
// whole domain, and the app swaps the copy once it reads the URL.
{
  let html = template;
  const edits = [
    { re: /(<title>)([\s\S]*?)(<\/title>)/, value: esc(meta.notFound[DEFAULT_LOCALE].title) },
    { re: metaTag("name", "description"), value: esc(meta.notFound[DEFAULT_LOCALE].description) },
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

// ── llms.txt ──────────────────────────────────────────────────────────────
// A plain-text map of the site for language models and coding agents.
//
// Worth being clear-eyed about what this is: it is not a search lever.
// Google has said it does not support llms.txt and has no plans to, and
// measurements of AI crawler traffic show the major crawlers almost never
// request it. What it is good for is agent retrieval: an assistant asked
// about Deev can read one short file instead of guessing at URLs. It is
// generated from the same data as the sitemap, so it cannot drift, and it
// costs one request to serve.
{
  const line = (path, label, locale = DEFAULT_LOCALE) =>
    `- [${label}](${abs(withLocale(path, locale))})`;

  const out = [
    "# Deev",
    "",
    "> An independent digital engineering studio in Luxembourg (legal name Lux VR States",
    "> Sarl-s), building websites, online stores, web apps and AI systems, plus the",
    "> marketing that feeds them. Luxembourg SMEs recover 70% of an eligible digital or",
    "> AI project through the SME Digital and SME AI packages, up to EUR 17,500.",
    "",
    "Founded and run by Fabio Falchero and Sven Kettel. Contact: contact@deev.lu,",
    "+352 691 388 887, 17 rue de Selange, L-4965 Clemency, Luxembourg.",
    "Published in English, French and German; the French and German versions of every",
    "page live under /fr and /de.",
    "",
    "## Pages",
    "",
    line("/", "Home: what Deev builds, and a live project price simulator"),
    line("/services", "Services: everything Deev builds and runs"),
    line("/sme-packages", "SME Packages: how Luxembourg's 70% digital and AI funding works, what qualifies, and an eligibility check"),
    line("/work", "Work: every project, filterable by type"),
    line("/blog", "Blog: articles on funding, engineering and AI"),
    line("/contact", "Contact"),
    line("/legal", "Terms, privacy, cookies"),
    "",
    "## Projects",
    "",
    ...projects.map((p) =>
      `- [${p.title}](${abs(`/work/${p.slug}`)}): ${p.category[DEFAULT_LOCALE]}, ${p.year}` +
      `${p.scope?.length ? `, delivered ${p.scope.join(" and ")}` : ""}` +
      `${p.link ? `, live at ${p.link}` : ""}`),
    "",
    "## Articles",
    "",
    ...articles.map((a) => `- [${a[DEFAULT_LOCALE].title}](${abs(`/blog/${a.slug}`)}): ${a[DEFAULT_LOCALE].excerpt}`),
    "",
    "## Other languages",
    "",
    ...LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((l) => line("/", `Deev in ${l.toUpperCase()}`, l)),
    "",
  ].join("\n");

  if (!out.includes("70%")) throw new Error("prerender: llms.txt lost the funding line");
  if (projects.some((p) => !out.includes(p.title))) throw new Error("prerender: llms.txt is missing a project");
  writeFileSync(join(dist, "llms.txt"), out);
  console.log(`  llms.txt      (${projects.length} projects, ${articles.length} articles)`);
}

// ── sitemap ───────────────────────────────────────────────────────────────
// Generated, not hand-maintained, so a new project or a new language cannot be
// shipped without it. Each entry lists every language of that page, which is
// the second place Google accepts hreflang and the one that survives a page
// being served from cache.
const today = new Date().toISOString().slice(0, 10);
const urls = [];
for (const locale of LOCALES) {
  for (const page of pages) {
    const loc = abs(withLocale(page.path, locale));
    const priority =
      page.path === "/" ? "1.0"
      : page.path.startsWith("/work/") || page.path.startsWith("/blog/") ? "0.7"
      : "0.5";
    const alts = [
      ...LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(withLocale(page.path, l))}" />`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(withLocale(page.path, DEFAULT_LOCALE))}" />`,
    ];
    urls.push(
      `  <url>\n    <loc>${loc}</loc>\n${alts.join("\n")}\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`,
    );
  }
}
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`,
);
console.log(`prerender: sitemap.xml written with ${urls.length} URLs across ${LOCALES.length} languages`);
