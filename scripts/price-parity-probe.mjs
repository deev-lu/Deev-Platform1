// Drives the simulator through fixed configurations and records the estimate.
// Run before and after the chrome restyle; the two files must match exactly.
import { chromium } from "/home/user/Deev-Platform1/node_modules/playwright-core/index.mjs";
import { writeFileSync } from "node:fs";
const out = process.argv[2];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.addInitScript(()=>{try{localStorage.setItem("cookie-consent","rejected")}catch{}});
const page = await ctx.newPage();
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.evaluate(()=>document.getElementById("project-builder")?.scrollIntoView());
await page.waitForTimeout(1200);

// Every clickable label inside the builder, in DOM order — stable identifiers
// that survive a restyle because they come from the copy, not the classes.
const labels = await page.evaluate(() => {
  const root = document.getElementById("project-builder");
  return [...root.querySelectorAll("button")]
    .map((b, i) => ({ i, t: b.textContent.trim().replace(/\s+/g," ").slice(0, 46) }))
    .filter(x => x.t.length > 1);
});
// Every numeric token the builder renders. Prices, weeks, counts, percentages
// — all of it must be byte-identical after a chrome-only restyle.
const readPrice = () => page.evaluate(() => {
  const root = document.getElementById("project-builder");
  const txt = root.innerText.replace(/\s+/g, " ");
  return { nums: (txt.match(/[\d][\d.,]*/g) || []) };
});

const results = { labels: labels.map(l => l.t), runs: [] };
// A few deterministic click paths through the builder
for (const path of [[], [0], [1], [0,4], [1,5], [2,4,8], [0,4,9,12], [1,5,9,12,14]]) {
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.evaluate(()=>document.getElementById("project-builder")?.scrollIntoView());
  await page.waitForTimeout(800);
  for (const idx of path) {
    const btns = await page.$$("#project-builder button");
    if (btns[idx]) { await btns[idx].click().catch(()=>{}); await page.waitForTimeout(500); }
  }
  await page.waitForTimeout(900);
  results.runs.push({ path, price: await readPrice() });
}
writeFileSync(out, JSON.stringify(results, null, 2));
console.log("wrote", out, "-", results.runs.length, "configurations");
for (const r of results.runs) console.log(" ", JSON.stringify(r.path), "->", JSON.stringify(r.price));
await browser.close();
