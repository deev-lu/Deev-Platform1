/**
 * Erzeugt deev-fonts.css mit eingebetteten Schriften.
 *
 * Warum eingebettet und nicht verlinkt: Chromium laedt Schriften ueber
 * file:// nicht - die Sperre ist dieselbe wie bei CORS, und sie ist still.
 * Das Dokument sieht dann fast richtig aus und ist in Wahrheit in einer
 * Ersatzschrift gesetzt. Als Data-URI gibt es diese Fehlerquelle nicht mehr,
 * und die Datei bleibt vollstaendig, egal wohin sie kopiert wird.
 *
 *   node make-fonts.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);

const face = (family, file, weight, style = "normal") => {
  const path = resolve(HERE, "assets", file);
  if (!existsSync(path)) {
    throw new Error(
      `Fehlt: deev-docs/assets/${file}\n` +
        `Die Schriften kommen aus dem Paket DEEV-Brand-Template (02_fonts/).\n` +
        `Siehe deev-docs/assets/README.md.`
    );
  }
  const b64 = readFileSync(path).toString("base64");
  return `@font-face{font-family:"${family}";src:url(data:font/ttf;base64,${b64}) format("truetype");font-weight:${weight};font-style:${style};font-display:block}`;
};

writeFileSync(
  resolve(HERE, "deev-fonts.css"),
  [
    "/* Erzeugt von make-fonts.mjs — nicht von Hand aendern. */",
    face("Inter", "Inter-Regular.ttf", 400),
    face("Inter", "Inter-Bold.ttf", 700),
    face("Inter", "Inter-Italic.ttf", 400, "italic"),
    face("JetBrains Mono", "JetBrainsMono-Regular.ttf", 400),
  ].join("\n") + "\n"
);
console.log("deev-fonts.css geschrieben");
