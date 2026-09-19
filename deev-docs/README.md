# DEEV — Devis und Rechnungen als HTML

Nachbau des Gabarits aus `DEEV-Brand-Template` in HTML und CSS. Ein Dokument
ist eine JSON-Datei; Layout und Masse stehen ausschliesslich im Stylesheet.

```bash
npm i -D playwright-core                               # einmalig
# Markenassets und Schriften nach assets/ legen — siehe assets/README.md
node make-fonts.mjs                                    # einmalig
node build.mjs samples/facture.json out/facture        # HTML + PDF
node build.mjs samples/devis-sme.json out/devis-sme
```

## Dateien

| Datei | Inhalt |
|---|---|
| `deev-document.css` | Das Gabarit. Jede Zahl stammt aus SPECIFICATION.md, nichts ist geschaetzt. |
| `deev-fonts.css` | Erzeugt, nicht versioniert. Inter und JetBrains Mono eingebettet. |
| `make-fonts.mjs` | Erzeugt die obige Datei aus `assets/*.ttf`. |
| `render.mjs` | JSON → HTML. Enthaelt keinen einzigen Zahlenwert des Gabarits. |
| `build.mjs` | Rendert und druckt nach PDF. |
| `samples/` | Zwei Dokumente: eine Rechnung, ein SME-Devis. |
| `assets/` | Logo, Filigran, Schriften — liegen nicht im Repo, siehe dort. |

## Ein Dokument schreiben

Kopf, Empfaenger und Betreff sind feste Felder. Alles darunter ist eine Liste
von Bloecken, die in der Reihenfolge gesetzt werden, in der sie dastehen:

| Block | Wofuer |
|---|---|
| `cards` | Kartenraster (Kontext, Ziele) |
| `items` | Leistungstabelle; `columns` setzt die Spaltenueberschriften |
| `totals` | Total HT, TVA, Total TTC |
| `bullets` | Bedingungen |
| `callout` | Encart; `variant: "payment"` blauer, `"sme"` gruener Rand |
| `accord` | Bon pour accord mit Datum und Unterschrift |
| `articles` | Rechtsartikel |
| `p`, `break` | Absatz, Seitenumbruch |

Betraege werden als Zahl uebergeben, nie als Text: `render.mjs` setzt sie im
franzoesischen Zahlensatz mit geschuetzten Leerzeichen (`5 400,00 €`).

`"watermark": false` unterdrueckt das Filigran (die Beispielrechnung hat
keines).

## Drei Fallen, die beim Nachbauen zuschlagen

**Schriften ueber `file://` laden nicht.** Chromium blockt sie still, das
Dokument sieht fast richtig aus und ist in Wahrheit in einer Ersatzschrift
gesetzt — im ersten Durchlauf hier genau so passiert und erst beim Messen
aufgefallen. Deshalb sind sie als Data-URI eingebettet, und `build.mjs`
bricht ab, wenn Inter nicht geladen ist.

**Der Seitenkopf beginnt bei 12 mm, nicht bei 38 mm.** Die Spezifikation
nennt beide Masse: 12 mm ist die Kopfzone, 38 mm der Textkoerper. Im
Fliesssatz gilt 12 mm; Logo und Filet schieben den Koerper von selbst auf
rund 38 mm.

**Die Fusszeile steht nicht im Dokument**, sondern in Chromiums
`footerTemplate` (`build.mjs`). Nur so traegt jede Seite dieselben zwei
Zeilen und eine echte Seitenzahl. Sie braucht ihre Schrift eingebettet, weil
Kopf- und Fussvorlagen ein eigenes Dokument sind.

## Was noch fehlt

**Seitenkopf ab Seite 2.** Die Spezifikation verlangt dort ein kleineres Logo
(13 mm) und `// DEVIS <REFERENZ>`. Chromium kann Kopfzeilen nicht je Seite
unterscheiden, und `position: fixed` wiederholt sich im Druck nicht
verlaesslich. Fuer mehrseitige Devis braucht es eine Paged-Media-Engine
(Paged.js) — dann laesst sich auch das Filigran wieder exakt auf 156/250 mm
der letzten Seite setzen statt ans Ende des Inhalts.

**Die Variante „devis long juridique“** mit den 18 Rechtsartikeln ist als
Block `articles` vorhanden, aber nicht gegen das Referenz-PDF geprueft.

## Geprueft

Die Schriftgroessen im erzeugten PDF wurden gegen die Textoperatoren des
Referenz-PDF gehalten, nicht nach Augenmass. Chromium schreibt sie in
CSS-Pixeln, `÷ 1,333` ergibt Punkt:

| | Referenz | erzeugt |
|---|---|---|
| Titel | 26 pt | 34,66 → 26 pt |
| Kundenname, Projekttitel | 11 pt | 14,66 → 11 pt |
| Absender | 9,5 pt | 12,66 → 9,5 pt |
| Chapeau, Referenzwerte | 9 pt | 12 → 9 pt |
| Adresszeilen, Betraege | 8,5 pt | 11,33 → 8,5 pt |
| Leistungsbeschreibung | 8 pt | 10,66 → 8 pt |
| TVA-Hinweis | 7,5 pt | 10 → 7,5 pt |
| Abschnittsmarken | 7 pt | 9,33 → 7 pt |
| Untertitel, Tabellenkopf | 6,5 pt | 8,66 → 6,5 pt |
| Referenzlabel | 6 pt | 8 → 6 pt |
| Fusszeile | 5,5 pt | 7,33 → 5,5 pt |

Die Nutzbreite betraegt in beiden Dokumenten 174 mm (657 px bei gleichem
Massstab gemessen).

## Eine Abweichung in der Vorlage

`SPECIFICATION.md` §9 und die Fusszeile nennen **L-4965 Clemency (Kéinzig)**,
das SME-Beispiel ebenfalls. `exemple-facture.pdf` schreibt dagegen
**L-4965 Käerjeng** — im Adressblock und in der Fusszeile. Clemency ist ein
Ort in der Gemeinde Käerjeng, beide sind also vertretbar, aber es sollte
ueberall dasselbe stehen. Hier ist durchgaengig die Fassung der
Spezifikation gesetzt.
