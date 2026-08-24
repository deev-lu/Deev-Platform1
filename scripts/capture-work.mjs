/**
 * Capture the work screenshots the site puts in its browser frame.
 *
 * Run this on your own machine. The build container cannot reach client
 * domains: its egress policy answers 403 to everything except GitHub, npm and
 * a couple of package registries, so the ten projects without a shot here can
 * only get one from a machine that can actually open them.
 *
 * Until a project has one it sorts to the back of the portfolio: projects.ts
 * orders work we can show first, so the slider and /work never open on a
 * typeset plate. Capturing a shot moves that project back up to where its year
 * puts it, with no other change.
 *
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/capture-work.mjs            # only the projects missing a shot
 *   CHROME_PATH=/path/to/chrome node scripts/capture-work.mjs   # use your own Chrome
 *   node scripts/capture-work.mjs --all      # re-take every project
 *   node scripts/capture-work.mjs --full     # tall full-page shots into work/full
 *
 * Output goes to src/assets/work/<slug>.jpg, which is all the app needs:
 * projects.ts discovers screenshots by filename, so a captured file appears in
 * the slider and on its case-study page with no code change. Review the images
 * first — anything with a cookie wall or a half-loaded hero is worse than the
 * typeset plate it would replace, so delete those and re-run.
 */

import { chromium } from "playwright";
import { readFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORK = join(root, "src/assets/work");
const args = new Set(process.argv.slice(2));
const FULL = args.has("--full");
const ALL = args.has("--all");

// The frame on the site is 1000x583 (1.715:1). Capturing at 1440 wide keeps it
// sharp on a retina screen without shipping a 4K image.
const WIDTH = FULL ? 1440 : 1440;
const HEIGHT = 840;
const MAX_HEIGHT = 4200;

const OUT = FULL ? join(WORK, "full") : WORK;
mkdirSync(OUT, { recursive: true });

// Filenames already present, so a re-run does not redo work that is done.
const have = new Set(
  existsSync(WORK)
    ? readdirSync(WORK).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => f.replace(/\.[^.]+$/, ""))
    : [],
);
const ALIASES = {
  "bureau-immobilier-feltes": "feltes",
  "aurora-experience": "aurora",
  "oscars-bar": "oscarsbar",
  "geoplus-3d": "geoplus",
  "vino-amore": "vinoamore",
};
const hasShot = (slug) => have.has(slug) || have.has(ALIASES[slug]);

const projects = JSON.parse(readFileSync(join(root, "src/lib/projects.data.json"), "utf8"))
  .filter((p) => p.link)
  .filter((p) => ALL || FULL || !hasShot(p.slug));

if (!projects.length) {
  console.log("every project already has a screenshot — nothing to capture");
  process.exit(0);
}

console.log(`capturing ${projects.length} project${projects.length === 1 ? "" : "s"} into ${OUT}\n`);

// CHROME_PATH lets you point at a Chrome you already have instead of letting
// Playwright download one: CHROME_PATH=/path/to/chrome node scripts/capture-work.mjs
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
let ok = 0;
const failed = [];

for (const p of projects) {
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: FULL ? 1000 : HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  try {
    await page.goto(p.link, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(1500);

    // Dismiss the obvious consent overlays first — they otherwise dominate
    // the shot, and on a first viewport capture they cover the whole page.
    for (const label of [/accept/i, /agree/i, /akzeptieren/i, /tout accepter/i, /accepter/i, /zustimmen/i]) {
      const btn = page.getByRole("button", { name: label }).first();
      if (await btn.count().catch(() => 0)) {
        await btn.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(600);
        break;
      }
    }

    // Scroll through so lazy images load, then return to the top.
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < Math.min(h, MAX_HEIGHT); y += 800) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(220);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);

    await page.screenshot({
      path: join(OUT, `${p.slug}.jpg`),
      quality: 80,
      type: "jpeg",
      ...(FULL
        ? { fullPage: true, clip: { x: 0, y: 0, width: WIDTH, height: Math.min(h, MAX_HEIGHT) } }
        : {}),
    });
    console.log(`  ok    ${p.slug.padEnd(26)} ${p.link}`);
    ok++;
  } catch (err) {
    failed.push([p.slug, String(err).split("\n")[0]]);
    console.log(`  FAIL  ${p.slug.padEnd(26)} ${String(err).split("\n")[0]}`);
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${ok}/${projects.length} captured into ${OUT}`);
if (failed.length) {
  console.log("failed:");
  for (const [slug, why] of failed) console.log(`  ${slug}: ${why}`);
}
console.log("\nnext: look at the images, delete any that came out badly, then");
console.log("      npm run build && git add src/assets/work && git commit");
