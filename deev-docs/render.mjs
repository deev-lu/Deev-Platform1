/**
 * DEEV — Devis und Rechnungen aus Daten erzeugen.
 *
 * Ein Dokument ist hier ein JSON-Objekt, kein Layout. Die Reihenfolge der
 * Abschnitte steht in `blocks`, und jeder Blocktyp hat genau eine Entsprechung
 * im Stylesheet. Das ist dieselbe Entscheidung wie beim Blog der Website:
 * Bloecke statt Markup, damit niemand, der spaeter Inhalte pflegt, das Layout
 * kaputt schreiben kann - und damit es keinen Parser zu warten gibt.
 *
 * Alle Masse liegen im Stylesheet. Hier steht kein einziger Zahlenwert aus der
 * Spezifikation; wer das Gabarit aendert, aendert nur die CSS-Datei.
 */

/* Als Escape-Sequenz, nicht als Zeichen. Ein echtes geschuetztes Leerzeichen
   waere im Quelltext von einem gewoehnlichen nicht zu unterscheiden - und
   genau das ist der Unterschied zwischen "15 200,00 €" und einem Betrag, der
   mitten im Umbruch auseinanderfaellt. */
const NBSP = " ";

/** Franzoesischer Zahlensatz: 15 200,00 € mit geschuetzten Leerzeichen. */
export function money(n, locale = "fr") {
  const fixed = Math.abs(n).toFixed(2);
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, locale === "en" ? "," : NBSP);
  const sep = locale === "en" ? "." : ",";
  return `${n < 0 ? "-" : ""}${grouped}${sep}${dec}${NBSP}€`;
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const label = (t) => (t ? `<p class="label">${esc(t)}</p>` : "");

/* ── Bloecke ─────────────────────────────────────────────────────────── */

const BLOCKS = {
  p: (b) => `<p class="lead">${esc(b.p)}</p>`,

  cards: (b) =>
    `<div class="cards">${b.cards
      .map((c) => `<div class="card"><p class="card__label">${esc(c.label)}</p><p class="card__text">${esc(c.text)}</p></div>`)
      .join("")}</div>`,

  items: (b, doc) => {
    const cols = b.columns ?? ["QTÉ", "DÉSIGNATION", "PRIX UNIT. HT", "PRIX TOTAL HT"];
    const rows = b.rows
      .map(
        (r) => `<tr>
        <td class="col-qty"><span class="item__n">${esc(r.n ?? "")}</span></td>
        <td class="col-designation">
          <p class="item__title">${esc(r.title)}</p>
          ${r.desc ? `<p class="item__desc">${esc(r.desc)}</p>` : ""}
        </td>
        <td class="col-unit"><span class="item__unit">${r.unit === undefined ? esc(r.unitText ?? "") : money(r.unit, doc.locale)}</span></td>
        <td class="col-total"><span class="item__total">${r.total === undefined ? "" : money(r.total, doc.locale)}</span></td>
      </tr>`
      )
      .join("");
    return `${label(b.label)}${b.note ? `<p class="lead" style="color:var(--slate)">${esc(b.note)}</p>` : ""}
      <table class="items"><thead><tr>
        <th class="col-qty">${esc(cols[0])}</th>
        <th class="col-designation">${esc(cols[1])}</th>
        <th class="col-unit">${esc(cols[2])}</th>
        <th class="col-total">${esc(cols[3])}</th>
      </tr></thead><tbody>${rows}</tbody></table>`;
  },

  totals: (b, doc) => {
    const row = (l, v, cls = "") =>
      `<tr class="${cls}"><td class="t-spacer"></td><td class="t-label">${esc(l)}</td><td class="t-value">${v}</td></tr>`;
    return `<div class="totals"><table>
        ${row(b.htLabel ?? "Total HT", money(b.ht, doc.locale))}
        ${row(b.vatLabel ?? `TVA (${b.vatRate}${NBSP}%)`, money(b.vat, doc.locale))}
        ${row(b.ttcLabel ?? "Total TTC", money(b.ttc, doc.locale), "ttc")}
      </table></div>
      ${b.note ? `<p class="vat-note">${esc(b.note)}</p>` : ""}`;
  },

  bullets: (b) =>
    `${label(b.label)}<ul class="bullets">${b.bullets.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`,

  callout: (b) =>
    `${label(b.label)}<div class="callout${b.variant ? ` callout--${b.variant}` : ""}">
      ${b.paragraphs
        .map((p) => (p.rule ? `<hr class="callout__rule">` : `<p${p.muted ? ' class="muted"' : ""}>${esc(p.text ?? p)}</p>`))
        .join("")}
    </div>`,

  accord: (b) =>
    `${label(b.label ?? "// BON POUR ACCORD")}<div class="callout">
      ${b.text ? `<p>${esc(b.text)}</p>` : ""}
      <div class="accord">
        <div class="accord__field"><div class="accord__line"></div><p class="accord__caption">${esc(b.dateCaption ?? "DATE")}</p></div>
        <div class="accord__field"><div class="accord__line"></div><p class="accord__caption">${esc(b.signCaption ?? "SIGNATURE ET CACHET")}</p></div>
      </div>
    </div>`,

  articles: (b) =>
    `${label(b.label)}${b.articles
      .map((a) => `<div class="article"><p class="article__title">${esc(a.title)}</p><p class="article__body">${esc(a.body)}</p></div>`)
      .join("")}`,

  break: () => `<div class="break"></div>`,
};

/* ── Dokument ────────────────────────────────────────────────────────── */

/**
 * `base` ist das Verzeichnis, in dem Stylesheet und Assets liegen. Ohne
 * diese Angabe sucht ein in einen Unterordner geschriebenes Dokument sie
 * neben sich - und findet nichts.
 */
export function renderDocument(doc, base = ".") {
  const refs = doc.refs
    .map(
      (r) =>
        `<div class="ref"><span class="ref__label">${esc(r.label)}</span><span class="ref__value${
          r.accent ? " ref__value--accent" : ""
        }">${esc(r.value)}</span></div>`
    )
    .join("");

  const issuerLines = doc.issuer.lines
    .map((l) => `<p class="ident__line${l.slate ? " ident__line--slate" : ""}">${esc(l.text ?? l)}</p>`)
    .join("");

  const recipientLines = doc.recipient.lines
    .map((l) => `<p class="recipient__line${l.slate ? " recipient__line--slate" : ""}">${esc(l.text ?? l)}</p>`)
    .join("");

  const recipientDetails = (doc.recipient.details ?? [])
    .map((d) => `<div class="detail"><span class="detail__label">${esc(d.label)}</span><span class="detail__value">${esc(d.value)}</span></div>`)
    .join("");

  const blocks = doc.blocks
    .map((b) => {
      const kind = Object.keys(BLOCKS).find((k) => k in b);
      if (!kind) throw new Error(`Unbekannter Block: ${JSON.stringify(Object.keys(b))}`);
      return BLOCKS[kind](b, doc);
    })
    .join("\n");

  return `<!doctype html>
<html lang="${esc(doc.locale ?? "fr")}">
<head>
<meta charset="utf-8">
<title>${esc(doc.filename ?? doc.title)}</title>
<base href="${esc(base)}/">
<link rel="stylesheet" href="deev-document.css">
</head>
<body>
<div class="sheet">

  <!-- Das Wort DEEV wird nie gesetzt, sondern immer als Datei platziert. -->
  <header class="doc-head">
    <img class="doc-head__logo" src="assets/deev-logo-lockup-navy.png" alt="DEEV">
    <div class="doc-head__right">
      <h1 class="doc-title">${esc(doc.title)}</h1>
      <p class="doc-subtitle">${esc(doc.subtitle)}</p>
    </div>
  </header>
  <hr class="rule">

  <section class="ident">
    <div class="ident__left">
      <p class="ident__name">${esc(doc.issuer.name)}</p>
      ${issuerLines}
    </div>
    <div class="ident__right">${refs}</div>
  </section>

  <p class="label">${esc(doc.recipient.label ?? "// POUR")}</p>
  <section class="recipient">
    <div class="recipient__left">
      <p class="recipient__name">${esc(doc.recipient.name)}</p>
      ${recipientLines}
    </div>
    <div class="recipient__right">${recipientDetails}</div>
  </section>

  <p class="label">${esc(doc.subject.label)}</p>
  <p class="project-title">${esc(doc.subject.title)}</p>
  <hr class="rule--short">
  <p class="lead">${esc(doc.subject.lead)}</p>

  ${blocks}

  ${doc.watermark === false ? "" : `<img class="watermark" src="assets/deev-icon-watermark-12pct.png" alt="">`}

  <footer class="doc-foot">
    <div class="doc-foot__row"><span>${esc(doc.footer[0])}</span><span>PAGE 1/1</span></div>
    <div class="doc-foot__row"><span>${esc(doc.footer[1])}</span></div>
  </footer>
</div>
</body>
</html>`;
}
