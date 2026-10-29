# Barrierefreiheit: Prüfung und Korrekturen

Stand: 29. Oktober 2026. Technisches Ziel: **WCAG 2.2, Konformitätsstufe AA**.

Dieses Dokument beschreibt, was geprüft, korrigiert und getestet wurde und
was offen ist. Es ist **keine Konformitätserklärung**. Automatische Tests
ohne Befund belegen keine vollständige WCAG-Konformität. Ein Test mit einem
echten Screenreader steht noch aus (siehe „Offen“).

Klar Access (das Barrierefreiheits-Menü unten rechts) ist eine
Komfortfunktion. Alle Korrekturen unten betreffen die Website in ihrer
Standarddarstellung. Das Widget ersetzt keine davon.

---

## 1. Projekt und Umfang

**Technik:** React 18 + TypeScript, Vite, Tailwind CSS v4, motion/react,
react-router. Jede Route wird vorgerendert (`scripts/prerender-routes.mjs`)
und im Browser hydriert. Es gibt drei Sprachen (EN unter `/`, FR unter
`/fr`, DE unter `/de`) und zwei Designs (dunkel als Standard, hell
umschaltbar).

**Seitenvorlagen** (je in EN, FR und DE, zusammen 123 URLs laut
`dist/sitemap.xml`):

| Vorlage | Beispiel | Komponente |
|---|---|---|
| Startseite | `/` | `App.tsx` (HomePage) |
| Leistungen, Übersicht | `/services` | `ServicesIndex.tsx` |
| Leistung, Detail (4×) | `/services/ai-automation` | `ServiceDetail.tsx` mit Demos |
| Workshops | `/workshops` | `WorkshopsPage.tsx` |
| Über uns | `/about` | `AboutPage.tsx` |
| Förderung (KMU-Pakete) | `/sme-packages` | `GrantPage.tsx` |
| Projekt-Rechner | `/project` | `ProjectPage.tsx`, `ProjectBuilder.tsx` |
| Arbeiten, Übersicht und Kategorien | `/work`, `/work/websites` | `WorkIndex.tsx` |
| Arbeiten, Projekt | `/work/billovio` | `WorkCase.tsx` |
| Blog, Übersicht und Artikel | `/blog`, `/blog/<slug>` | `NewsIndex.tsx`, `NewsArticle.tsx` |
| Kontakt | `/contact` | `Contact.tsx` |
| Rechtliches | `/legal` | `Legal.tsx` |
| 404 | `/does-not-exist` | `NotFound.tsx` |

**Gemeinsame Komponenten:** Navbar mit Mega-Menü (Desktop) und Schublade
(Telefon), Sprachumschalter, Theme-Schalter, Footer, Cookie-Leiste und
Cookie-Einstellungen, WhatsApp-Knopf (Desktop), Kontaktleiste (Telefon),
Klar Access, Hero-Film (YouTube), Kundenlogo-Band, „KI bei der Arbeit“-Film,
eingebettete YouTube-Videos.

**Wichtige Nutzerwege:**

- Navigation (Desktop, Telefon, Sprache, Theme)
- Kontaktformular
- Workshop-Anfrage
- Förder-Check mit Ergebnis per E-Mail
- Projekt-Rechner mit Anfrageformular
- Cookie-Einwilligung und -Widerruf
- Anruf, WhatsApp und E-Mail

**Nicht vorhanden** und daher nicht geprüft: Suche, Anmeldung,
Benutzerkonten, Warenkorb, Checkout. Auch eine eigene Online-Buchung fehlt:
`BOOKING_URL` ist leer, deshalb gibt es keinen Kalender-Link.

**Vorhandene Tests vor dieser Arbeit:** Vitest-Unit-Tests (`npm run test`,
fünf Dateien, Analytics, Lead-API, Förderrechnung). Browser- oder
Barrierefreiheitstests gab es nicht.

---

## 2. Durchgeführte Korrekturen

Die Korrekturen sitzen möglichst in gemeinsam genutzten Komponenten. Ein
Teil stammt aus der zurückgenommenen Runde #38: Diese Code-Korrekturen
wurden wieder eingespielt und an den aktuellen Stand angepasst (neues Light
Mode, Klar Access). Die damalige Seite `/accessibility` mit Erklärung
wurde **nicht** übernommen.

### Struktur, Landmarks, Sprache

- **Landmarks:** Startseite, Kontakt und Rechtliches hatten kein `<main>`,
  jetzt hat jede Seite `<header>`, ein `<main>` und `<footer>` (1.3.1).
- **Navigation:** Die Desktop- und die Telefonnavigation sind als
  „Hauptnavigation“ / „Main“ / „Principale“ benannt.
- **Projekt-Rechner:**
  - Überschriften in Auswahl-Knöpfen entfernt, die die Gliederung
    gestört hatten (h1 → h3 ohne h2).
  - Der Auswahlzustand der Optionen wird jetzt per `aria-pressed`
    gemeldet (4.1.2).
- **Englische Texte auf FR/DE-Seiten:** Das Ergebnis des Rechners zeigte
  englische Texte („Timeline“, „weeks“, „Start my project“ …). Sie sind
  jetzt übersetzt (3.1.2).
- **Definitionslisten** (`<dl>`) auf Leistungs- und Projektseiten
  korrigiert (1.3.1).

### Tastatur und Fokus

- **„Zum Inhalt springen“** auf jeder Seite, in der Seitensprache, ohne
  JavaScript-Abhängigkeit vorgerendert (2.4.1). Der gleichartige deutsche
  Sprungknopf von Klar Access ist ausgeblendet, damit nicht zwei
  Sprunglinks hintereinander stehen.
- **Seitenwechsel:** Nach einem Wechsel innerhalb der App geht der Fokus
  an den Anfang des Inhalts, und der neue Seitentitel wird angesagt
  (2.4.3, 4.1.3).
- **Desktop-Mega-Menü:**
  - Panels öffnen sich nicht mehr schon beim Fokussieren, sondern nur über
    ihren Pfeil-Knopf (3.2.1).
  - Das Panel steht im DOM direkt hinter diesem Knopf. Vorher wechselte
    jeder Tab das Panel, und dessen Inhalt war per Tastatur nicht
    erreichbar (2.1.1, 2.4.3).
  - Escape schließt und gibt den Fokus an den Knopf zurück.
- **Telefon-Menü:**
  - Der Menü-Knopf meldet `aria-expanded` und `aria-controls`.
  - Escape schließt das Menü und gibt den Fokus zurück.
  - Seiten sind echte Links statt Knöpfe.
  - Bei langem Inhalt scrollt das Menü.
- **Sprachumschalter:**
  - Er ist ein Disclosure ohne irreführendes `aria-haspopup`.
  - Sein Name beginnt mit dem sichtbaren „EN“ (2.5.3).
  - Escape gibt den Fokus zurück.
  - Die Kurzlinks im Telefon-Menü nennen die volle Sprache.
- **Modale Dialoge:** Ein gemeinsamer Hook `src/lib/useModal.ts` setzt den
  Fokus in den Dialog, hält Tab darin, schließt mit Escape und gibt den
  Fokus zurück. Er ist eingesetzt in:
  - den **Cookie-Einstellungen**
  - dem **Anfrageformular des Projekt-Rechners**. Das war vorher kein
    Dialog im Sinne der Zugänglichkeit: Es hatte kein `role="dialog"`,
    keine Fokusführung und kein Escape (2.1.2, 2.4.3, 4.1.2).
- **Fokusrahmen:** Er ist jetzt deckend, Electric Blue auf hell, Cyan auf
  dunkel. Vorher war er Cyan mit 65 % Deckkraft und hatte etwa 1,4:1
  (2.4.7, 1.4.11).
- **Nicht verdeckter Fokus:** `scroll-padding` oben (Navbar) und unten
  (Cookie-Leiste bzw. Telefon-Kontaktleiste, deren Höhe live übernommen
  wird) sorgt dafür, dass ein fokussiertes Element nicht unter festen
  Leisten landet (2.4.11).
- **Seitlich scrollende Bereiche** sind per Tastatur erreichbar und
  benannt (2.1.1).

### Formulare

- **Sichtbare Labels:** Jedes Feld hat ein dauerhaft sichtbares,
  zugeordnetes Label (3.3.2, 1.3.1). Vorher hatten nur Platzhalter oder
  `aria-label` beschriftet:
  - das Anfrageformular des Rechners (fünf Felder)
  - das Ergebnis-Formular des Förder-Checks (zwei Felder)
- **Pflichtfelder:** Der Stern ist über jedem Formular erklärt („Mit *
  markierte Felder sind Pflichtfelder.“). Der Stern selbst ist für
  Screenreader ausgeblendet, die Pflicht meldet das native `required`.
- **Autocomplete:** `autocomplete` ist ergänzt, wo es fehlte (Website-Feld
  `url`, Firma, Name, E-Mail) (1.3.5).
- **Fokus nach dem Absenden:** Ersetzt die Bestätigung das Formular,
  springt der Fokus dorthin (Kontakt, Workshop, Förder-Check).
- **Fehlermeldungen** stehen in `role="alert"`; das war bereits vorhanden.
- **Ränder von Bedienelementen:** Eingabefelder, Schalter und Checkboxen
  haben jetzt Ränder mit mindestens 3:1. Dafür gibt es das neue Token
  `--line-control` in beiden Designs (1.4.11).

### Kontrast

- **Textfarben:** `--text-low` (dunkel), Warnfarbe und Legal-/Kontakt-Badges
  sind angehoben.
- **Demos:** Sie treten über Farbe statt über Deckkraft zurück. Vorher
  rutschten Texte in den Demos unter 4,5:1 (1.4.3).
- **Light Mode:** Navigation auf `/workshops` war weiß auf weiß. Jetzt
  wird der Hintergrund hinter der Leiste selbst gemessen.
- **Platzhalter** haben jetzt ausreichenden Kontrast.

### Bewegung (2.2.2, 2.3.3)

- **„Bewegung anhalten“:**
  - **Wo:** im Hero oben rechts und im Footer jeder Seite.
  - **Was:** stoppt den Hero-Film, das Kundenlogo-Band, alle CSS-Loops
    und alle Motion-Komponenten.
  - **Speicherung:** Die Wahl wird gespeichert und vor dem ersten Zeichnen
    angewendet.
  - **Klar Access:** Der Schalter ist mit dessen „Bewegung reduzieren“
    gekoppelt. Beide Schalter zeigen denselben Zustand, und jeder schaltet
    beide.
  - **Fade-ins:** Animationen laufen beim Anhalten sofort zu Ende, statt
    unsichtbar einzufrieren.
- **Kundenlogos:** eigener Pause-Knopf am Band.
- **„KI bei der Arbeit“-Film:** hatte bereits Play/Pause. Die
  Kapitel-Knöpfe sind jetzt über ihren sichtbaren Text benannt (2.5.3).
- **Betriebssystem:** `prefers-reduced-motion` wird überall respektiert.

### Namen, Bilder, Medien

- **Logo:** Das Bild neben dem Schriftzug „DEEV“ ist dekorativ
  (`alt=""`), damit der Name nicht doppelt angesagt wird.
- **Google-Bewertungs-Link:** Der Name enthält den sichtbaren Text (2.5.3).
- **Footer-Wortmarke:** als CSS-Inhalt, für Screenreader verborgen.

### Klar Access

- **Optik:** DEEV-Design, folgt dem Seiten-Theme. Die vier Dateien des
  Inhabers sind unverändert.
- **„Textgröße“ bis 200 %:**
  - Abstände bleiben fest, statt mitzuwachsen. Vorher liefen
    Mehrspalten-Bereiche bei 200 % seitlich aus dem Bildschirm.
  - Die Navigation wechselt in die kompakte Form. Vorher lag der
    Menü-Knopf auf dem Telefon außerhalb des Bildschirms.

---

## 3. Tatsächlich ausgeführte Tests

Alle Tests liefen lokal gegen den Produktions-Build (`npm run build`,
`vite preview`) in Chromium (Playwright).

| Test | Umfang | Ergebnis |
|---|---|---|
| Build inkl. Typecheck und Vitest | `npm run build` | bestanden, 50/50 Unit-Tests |
| Neue Regressionstests (`npm run test:a11y`, `tests/e2e/a11y.e2e.ts`) | 100 Tests, Projekte „desktop“ (1440 px) und „phone“ (390 px) | **98 bestanden, 2 gezielt übersprungen** (Desktop-Menü-Test auf dem Telefon und umgekehrt) |
| axe-core 4.14, WCAG 2.0/2.1/2.2 A+AA | alle 123 URLs der Sitemap, dunkel/1440 px und hell/390 px, reduzierte Bewegung | **0 Verstöße** (246 Seitenaufrufe) |
| axe-core 4.14, wie oben, Bewegung eingeschaltet | alle 123 URLs | 5 Momentaufnahmen laufender Animationen, siehe 3a |
| axe-core 4.10 Ausgangsmessung (vor den Korrekturen) | 21 Seiten, beide Designs, 1440/390 | color-contrast ×176, region ×636, scrollable-region-focusable ×12, definition-list ×12, heading-order ×4 |
| Tastatur-Durchlauf (Tab durch die ganze Seite) | `/`, `/contact`, `/workshops`, `/sme-packages`, `/project`; dunkel und hell; 1440 und 390 px | jeder Stopp mit sichtbarem Fokusrahmen, keiner von festen Leisten verdeckt (45–98 Stopps je Seite) |
| Reflow bei 320 CSS-Pixeln (1.4.10, entspricht 400 % Zoom) | 19 repräsentative Seiten | kein seitliches Scrollen |
| Zoom 200 % (1.4.4) | abgedeckt durch die Reflow-Breiten 640 und 320 px | kein Verlust |
| Textabstände (1.4.12, Bookmarklet-Werte) | 18 Seiten bei 1280 px | kein abgeschnittener Text (gemeldet wurden nur bewusst unsichtbare Screenreader-Texte) |
| Zielgrößen (2.5.8, 24×24 oder Abstandsausnahme) | 18 Seiten bei 390 und 1440 px | keine Unterschreitung gefunden |
| Klar Access: jede Einstellung (Textgröße 200 %, Abstände, Schrift, Links, Kontrast hell/dunkel, Bewegung, Lesehilfe) | 5 Seiten, dunkel und hell, 390 und 1280 px | 108 von 110 ohne Befund, 2 Animations-Momentaufnahmen, siehe 3a |
| Klar Access: Tastatur | Öffnen, Fokus im Dialog, Tab gefangen, Escape, Fokus zurück | bestanden |

### 3a. Ergebnisse der letzten Läufe

- **axe-core 4.14, alle 123 URLs, Bewegung eingeschaltet** (246
  Seitenaufrufe): 5 Kontrast-Treffer. Alle fielen mitten in laufende
  Animationen: einblendende Hinweis-Chips der Phishing-Demo,
  einblendende Zeilen und ein überblendendes „Running …“ in den KI-Demos.
  - Drei Wiederholungen derselben Seiten trafen jeweils andere oder gar
    keine Elemente.
  - Der Lauf mit reduzierter Bewegung, der die Endzustände zeigt, hat 0
    Verstöße.
  - Einordnung: Momentaufnahmen von Übergängen, kein dauerhafter Zustand.
    Offen bleibt Punkt 4.7.
- **Klar Access, jede Einstellung in frischem Browser-Kontext** (110
  Läufe: 5 Seiten × Einstellungen × 2 Designs × 390/1280 px): 108 ohne
  Befund.
  - Kein seitliches Scrollen.
  - Kein Bedienelement außerhalb des Bildschirms.
  - Unter „Bewegung reduzieren“ alle Einblendungen sichtbar.
  - Kontrast in den Modi „Hell“ und „Dunkel“ ohne Befund.
  - Die 2 Treffer betreffen `/services/ai-automation` bei 200 % Textgröße:
    Zeilen der KI-Demo während ihres 420-ms-Einblendens, also dieselbe Art
    Momentaufnahme.

**Kein Screenreader-Test.** In der Prüfumgebung (Linux-Container ohne
Desktop) war kein Screenreader verfügbar. Geprüft wurden DOM, Namen, Rollen
und Zustände. Das ersetzt keinen Test mit NVDA, JAWS, VoiceOver oder
TalkBack.

---

## 4. Offene Punkte und nicht geprüfte Bereiche

1. **Screenreader-Test:** Mit NVDA (Windows), VoiceOver (macOS und iOS)
   und TalkBack (Android) ist nichts getestet, siehe Abschnitt 5.
2. **Untertitel der YouTube-Videos** (Abschnitt „In Bewegung“ auf der
   Startseite und Marketing-Seite):
   - Ob die Videos Sprache enthalten und Untertitel haben, ließ sich hier
     nicht prüfen (1.2.2).
   - **Benötigt:** Der Inhaber prüft auf YouTube, ob jedes Video mit Ton
     korrekte Untertitel hat (keine automatischen ohne Durchsicht), und
     ergänzt sie bei Bedarf.
   - Der Hero-Film ist stumm und rein dekorativ.
3. **YouTube-Player selbst:** Seine Bedienung liegt bei YouTube, nicht in
   diesem Code.
4. **Fremde Websites:** Verlinkte Kunden-Websites, das Google-Profil und
   WhatsApp sind nicht Teil dieser Prüfung.
5. **Erklärung zur Barrierefreiheit:** Es gibt keine. Ob und in welcher
   Form eine benötigt wird (etwa nach dem European Accessibility Act), ist
   eine rechtliche Entscheidung des Inhabers. Klar Access könnte über
   `data-statement` darauf verlinken.
6. **Klar Access:**
   - **Sprache:** Das Menü ist auf allen Sprachversionen deutsch. Es trägt
     `lang="de"`, ist also korrekt ausgezeichnet, aber für FR/EN-Besucher
     nicht in ihrer Sprache.
   - **Kontrastmodus:** Einige Elemente mit eigener Farbübergangs-Animation
     zeigen kurz nach dem Umschalten für bis zu zwei Sekunden noch ihre alte
     Farbe (Übergang, kein Dauerzustand).
   - **Kein Konformitätsnachweis:** Das Widget ist eine Komfortfunktion.
   - **Sync beim ersten Laden:** Wurde „Bewegung anhalten“ auf der Seite
     gedrückt, bevor das Widget geladen war, zeigt dessen eigener Schalter
     beim ersten Laden „aus“, obwohl die Bewegung angehalten ist. Ein Klick
     auf einen der beiden Schalter gleicht das aus.
7. **Animierte Demos:**
   - Die automatischen Scans sind Momentaufnahmen. Zwischenzustände
     während einer Animation (Einblenden, Hervorheben) sind nicht
     vollständig erfasst.
   - Alle Demos lassen sich anhalten. Ihr Inhalt steht auch als Text auf
     derselben Seite.
8. **Windows-Kontrastmodus (forced colors):** Er wurde nicht visuell
   geprüft.
9. **Echte Geräte:** Es lief nur Chromium. Safari (macOS und iOS) und
   Firefox sind nicht getestet. Auch Sprachsteuerung und
   Schaltersteuerung sind nicht getestet.
10. **Inhalte:** Verständlichkeit der Texte, Alternativtexte der
    Projekt-Screenshots (vorhanden, aber nicht einzeln inhaltlich geprüft)
    und PDF-Downloads (keine gefunden) sind redaktionell nicht geprüft.

---

## 5. Schritte für die abschließende manuelle Abnahme

1. **Screenreader**, je einmal auf Startseite, `/contact`, `/project` und
   `/sme-packages`:
   - **NVDA + Firefox** (Windows):
     - Landmarks- und Überschriftenliste durchgehen.
     - Kontaktformular ausfüllen und absenden, mit leeren Pflichtfeldern
       und mit gültigen Daten.
   - **VoiceOver + Safari** (macOS und iPhone):
     - Menü öffnen und schließen, Sprachumschalter, Cookie-Einstellungen.
     - Projekt-Rechner bis zum Anfrage-Dialog.
   - **TalkBack + Chrome** (Android): Telefon-Menü und Kontaktleiste.
   - **Zu erwarten:**
     - Jede Seite meldet ihren Titel.
     - Nach einem Seitenwechsel wird der neue Titel angesagt.
     - Alle Felder haben einen Namen, Pflicht wird gemeldet.
     - Dialoge werden als Dialog mit Titel angekündigt.
2. **Nur Tastatur** (Maus weglegen), auf einer Seite je Vorlage:
   - Erstes Tab erreicht Klar Access, das zweite „Zum Inhalt springen“.
   - Mega-Menü über den Pfeil-Knopf öffnen, hineintabben, mit Escape
     schließen.
   - Cookie-Einstellungen im Footer öffnen, Tab bleibt im Dialog, Escape
     schließt.
   - „Bewegung anhalten“ im Footer.
3. **Zoom** in Chrome, Safari und Firefox auf 200 % und 400 % (Strg/Cmd +
   „+“): kein Inhalt abgeschnitten, kein seitliches Scrollen bei 400 %.
4. **Systemeinstellungen:**
   - „Bewegung reduzieren“ (macOS/iOS/Android): keine Animation, kein
     Hero-Film.
   - Windows-Kontrastmodus: Bedienelemente bleiben erkennbar.
5. **Videos:** Untertitel jedes YouTube-Videos mit Ton prüfen
   (Punkt 4.2).
6. **Klar Access:** jede Einstellung einmal auf dem Telefon und dem
   Desktop, Textgröße bis 200 %, Kontrast hell und dunkel. Nichts darf
   verdeckt sein, kein Bedienelement darf außerhalb des Bildschirms liegen.
7. **Regressionstests** nach jeder Design-Änderung:
   `npm run build && npm run test:a11y` (beim ersten Mal
   `npx playwright install chromium`).

Erst nach diesen Schritten, und mit einer vollständigen Bewertung aller
Seiten gegen alle Erfolgskriterien, lässt sich eine Aussage zur
Konformität treffen.
