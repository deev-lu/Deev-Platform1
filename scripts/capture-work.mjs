/**
 * Re-capture the work screenshots as tall, full-page images.
 *
 * Run this on your own machine — it needs to reach the client sites, which the
 * build container cannot:
 *
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/capture-work.mjs
 *
 * Why: the current shots are 1000x583 — a single viewport. Cropping one of
 * those into a tile leaves the client's own navigation and carousel arrows
 * sliced across the top with no context. Full-page captures fix that, and they
 * unlock the scroll-on-hover treatment (the tile pans down the page as you
 * hover), which gives the "live preview" feel without embedding anyone's site.
 *
 * It deliberately does NOT touch projects.data.json. Review the output, keep
 * what looks good, and only then point the app at it.
 */

import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src/assets/work/full");
const WIDTH = 1440;
const MAX_HEIGHT = 4200; // long enough to pan, short enough to stay reasonable

const projects = JSON.parse(readFileSync(join(root, "src/lib/projects.data.json"), "utf8"))
  .filter((p) => p.link);

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
let ok = 0;
const failed = [];

for (const p of projects) {
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  try {
    await page.goto(p.link, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(1500);

    // Scroll the whole page so lazy images load, then return to the top.
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < Math.min(h, MAX_HEIGHT); y += 800) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(220);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    // Dismiss the obvious consent overlays — they otherwise dominate the shot.
    for (const label of [/accept/i, /agree/i, /akzeptieren/i, /tout accepter/i, /accepter/i]) {
      const btn = page.getByRole("button", { name: label }).first();
      if (await btn.count().catch(() => 0)) {
        await btn.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(500);
        break;
      }
    }

    await page.screenshot({
      path: join(OUT, `${p.slug}.jpg`),
      quality: 82,
      type: "jpeg",
      fullPage: true,
      clip: { x: 0, y: 0, width: WIDTH, height: Math.min(h, MAX_HEIGHT) },
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
console.log(`\n${ok}/${projects.length} captured into src/assets/work/full/`);
if (failed.length) {
  console.log("failed:");
  for (const [slug, why] of failed) console.log(`  ${slug}: ${why}`);
}
