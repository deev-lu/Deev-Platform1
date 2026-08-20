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

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://www.deev.lu";

const routes = JSON.parse(readFileSync(join(root, "src/lib/routeMeta.json"), "utf8"));
const template = readFileSync(join(dist, "index.html"), "utf8");

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

  const edits = [
    { label: "title",               re: /(<title>)([\s\S]*?)(<\/title>)/,                    value: title },
    { label: "canonical",           re: /(<link\s+rel="canonical"\s+href=")([^"]*)(")/,      value: url },
    { label: "description",         re: metaTag("name", "description"),                      value: description },
    { label: "og:url",              re: metaTag("property", "og:url"),                       value: url },
    { label: "og:title",            re: metaTag("property", "og:title"),                     value: title },
    { label: "og:description",      re: metaTag("property", "og:description"),               value: description },
    { label: "twitter:title",       re: metaTag("name", "twitter:title"),                    value: title },
    { label: "twitter:description", re: metaTag("name", "twitter:description"),              value: description },
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

  writeFileSync(join(dist, route.file), html);
  written++;
  console.log(`  ${route.file.padEnd(13)} ${url}`);
}
console.log(`prerender: ${written} route documents verified and written`);
