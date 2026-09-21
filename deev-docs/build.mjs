/**
 * Ein Dokument aus JSON nach HTML und PDF.
 *
 *   node build.mjs samples/facture.json out/facture
 *
 * Die Fusszeile kommt nicht aus dem Fluss, sondern aus Chromiums
 * footerTemplate. Nur so traegt jede Seite dieselben zwei Zeilen und eine
 * echte Seitenzahl - ein im Dokument gesetzter Fuss stuende genau einmal da,
 * naemlich am Ende.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { renderDocument } from "./render.mjs";

/* playwright-core ist keine Abhaengigkeit der Website, sondern nur dieses
   Werkzeugs. Lieber ein klarer Satz als ein Stapelauszug. */
let chromium;
try {
  ({ chromium } = await import("playwright-core"));
} catch {
  console.error("playwright-core fehlt. Einmalig: npm i -D playwright-core");
  process.exit(1);
}

const HERE = dirname(new URL(import.meta.url).pathname);
const [, , dataPath, outBase] = process.argv;
if (!dataPath || !outBase) {
  console.error("Aufruf: node build.mjs <daten.json> <ausgabe-ohne-endung>");
  process.exit(1);
}

if (!existsSync(resolve(HERE, "deev-fonts.css"))) {
  console.error("deev-fonts.css fehlt. Erst `node make-fonts.mjs` ausfuehren.");
  process.exit(1);
}

const doc = JSON.parse(readFileSync(resolve(dataPath), "utf8"));
const html = renderDocument(doc, `file://${HERE}`);

mkdirSync(dirname(resolve(outBase)), { recursive: true });
const htmlPath = resolve(`${outBase}.html`);
writeFileSync(htmlPath, html);

/* Die Fusszeile braucht ihre eigene Schrift: Chromium rendert Kopf- und
   Fussvorlagen in einem eigenen Dokument, das die Schriften der Seite nicht
   kennt. Eingebettet als Data-URI ist sie unabhaengig vom Dateipfad. */
const monoB64 = readFileSync(resolve(HERE, "assets/JetBrainsMono-Regular.ttf")).toString("base64");

const footerTemplate = `
<style>
  @font-face { font-family:"JBM"; src:url(data:font/ttf;base64,${monoB64}) format("truetype"); }
  * { -webkit-print-color-adjust: exact; }
  .f {
    font-family:"JBM", monospace; font-size:5.5pt; letter-spacing:0.6pt;
    color:#8A93A8; text-transform:uppercase; line-height:1.5;
    width:100%; padding:0 18mm; box-sizing:border-box;
    /* Chromium zeichnet die Vorlage in die untere Randzone und beschneidet
       alles, was darueber hinausragt. Kein Aussenabstand, nur Innenabstand. */
    padding-top:4mm;
  }
  .r { display:flex; justify-content:space-between; }
</style>
<div class="f">
  <div class="r"><span>${doc.footer[0]}</span><span>PAGE <span class="pageNumber"></span>/<span class="totalPages"></span></span></div>
  <div class="r"><span>${doc.footer[1]}</span></div>
</div>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

/* Kontrolle statt Vertrauen: wenn die Schrift nicht geladen ist, ist das
   Dokument in einer Ersatzschrift gesetzt und sieht trotzdem fast richtig
   aus. Lieber hier abbrechen als beim Kunden auffallen. */
const fontsOk = await page.evaluate(() => document.fonts.check('700 26pt Inter'));
if (!fontsOk) {
  await browser.close();
  console.error("Inter wurde nicht geladen — Abbruch. `node make-fonts.mjs` erneut ausfuehren.");
  process.exit(1);
}

await page.pdf({
  path: resolve(`${outBase}.pdf`),
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<div></div>",
  footerTemplate,
  /* Diese Kombination ist die gepruefte: hier stehen 38 mm, im Stylesheet
     12 mm, und Chromium folgt dem Stylesheet - der Kopf sitzt 12 mm unter
     der Blattkante, wie das Gabarit es verlangt. Der Wert hier haelt nur
     die Randzone frei, in die Kopf- und Fussvorlage gezeichnet werden.
     Nicht "aufraeumen", ohne das Ergebnis neu zu messen. */
  margin: { top: "38mm", bottom: "24mm", left: "18mm", right: "18mm" },
});

await browser.close();
console.log(`geschrieben: ${outBase}.html und ${outBase}.pdf`);
