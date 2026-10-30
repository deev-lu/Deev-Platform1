# Prompt: Klar Access 1.1, im Stil jeder Website und mit echtem Leselineal

Für ein neues Claude-Code-Projekt (eigenes Repository für Klar Access). Die
vier Dateien der aktuellen Version 1.0.0 als Ausgangspunkt mitschicken:
`klar-access.js`, `klar-page.css`, `klar-panel.css`, `klar-cursor.svg`
(liegen in diesem Repo unter `public/klar-access/`).

Hintergrund aus der Einbindung auf www.deev.lu (29./30. Oktober 2026),
die im Prompt schon berücksichtigt ist:

- **Optik:** Die Anpassung an die Marke musste von außen in den Shadow Root
  geschrieben werden (`src/lib/klarAccessTheme.ts`).
- **„Bewegung reduzieren“** fror Einblend-Animationen unsichtbar ein und
  ließ YouTube-Filme weiterlaufen.
- **„Textgröße“ 200 %** schob Mehrspalten-Layouts und Navigationen seitlich
  aus dem Bildschirm.
- **Sprunglink:** Der eigene Sprunglink des Widgets doppelte den der
  Website, und das immer auf Deutsch.
- **Lesehilfe:** Sie ist nur eine 4 px dünne Linie 20 px unter dem
  Mauszeiger und auf Telefonen praktisch wirkungslos (Touch wird ignoriert).

---

```text
Entwickle Klar Access von Version 1.0.0 (die vier beigefügten Dateien) zu
Version 1.1.0 weiter. Klar Access ist ein Accessibility-Widget zum
Einbinden in beliebige Websites: ein Knopf unten rechts, ein Dialog mit
Darstellungs-Einstellungen, alles in einem Shadow Root, Vanilla JS ohne
Abhängigkeiten. Arbeite bis zur fertigen, getesteten Version durch. Frage
nur nach, wenn eine Entscheidung wirklich blockiert.

ZIELE
1. Das Widget sieht auf jeder Website ohne Zusatzarbeit aus wie ein Teil
   dieser Website: Schriften, Farben, Hell/Dunkel, Rundungen.
2. Eine echte Lesehilfe: ein Leselineal, das die aktuelle Zeile hält,
   plus eine Lesemaske. Beides mit Maus, Tastatur und Touch.
3. Die Einstellungen beschädigen keine Website: keine eingefrorenen
   Inhalte, kein seitliches Überlaufen, nichts verdeckt.
4. Das Widget selbst erfüllt WCAG 2.2 AA in jedem automatisch erzeugten
   Stil.

FESTE REGELN
- Abwärtskompatibel bleiben:
  - dieselben vier Dateinamen
  - dieselben data-Attribute (data-lang, data-color, data-position,
    data-statement, data-main, data-brand, data-storage, data-launcher)
  - derselbe Speicher-Schlüssel klar-access:v1 mit Migration, falls sich
    das Format ändert
  - dieselbe API: window.KlarAccess mit open, close, reset, getSettings,
    setSettings, destroy
  - dieselben Events klar-access:ready und klar-access:change
  Eine Website mit 1.0.0 tauscht die Dateien und läuft weiter.
- Vanilla JS und CSS, keine Abhängigkeiten, kein Build-Schritt beim
  Einbinden.
- Größe: klar-access.js darf um höchstens 50 % wachsen; die Zahl im
  CHANGELOG nennen.
- Keine Konformitätsversprechen. Das Widget passt die Darstellung an; es
  macht keine Website barrierefrei, und kein Text darf das behaupten. Der
  Hinweis „Diese Einstellungen passen die Darstellung an.“ bleibt.
- Datenschutz: nur localStorage für die Einstellungen, keine Anfragen an
  Dritte, kein Tracking.
- Achte auf eine Content Security Policy: kein eval, keine fremden
  Ressourcen. Wo möglich Constructable Stylesheets statt Inline-Styles.

1. STIL DER WEBSITE ÜBERNEHMEN (Theming)
- Alle Gestaltungswerte im Shadow Root als Tokens führen, mindestens:
  - Flächen: --ka-bg, --ka-surface, --ka-surface-2
  - Text: --ka-text, --ka-text-muted
  - Akzent: --ka-accent, --ka-accent-text, --ka-on-accent
  - Linien und Fokus: --ka-border, --ka-control-border, --ka-focus
  - Schriften: --ka-font, --ka-font-heading, --ka-font-mono
  - Rundungen: --ka-radius-sm, --ka-radius-md, --ka-radius-lg
  - Schatten: --ka-shadow
  Das bisher fest kodierte Grün/Grau verschwindet.
- Drei Quellen, in dieser Rangfolge:
  a) Die Website setzt Variablen --klar-* auf :root (z. B.
     --klar-accent, --klar-font, --klar-radius). Prüfen und dokumentieren,
     dass Custom Properties trotz `all: initial` am Host in den Shadow Root
     erben.
  b) Konfiguration über data-Attribute und eine neue Methode
     KlarAccess.configure({ theme: {...} }). data-color wirkt weiter als
     Akzent.
  c) Automatische Erkennung, wenn nichts gesetzt ist:
     - Schrift von body und von h1/h2.
     - Text- und Hintergrundfarbe der Seite (vom body aufwärts die erste
       nicht transparente Fläche).
     - Akzent aus dem auffälligsten gefüllten Button bzw. der Linkfarbe.
     - Rundungen aus Buttons und Eingabefeldern.
     - Hell oder dunkel aus der Leuchtdichte des Seitenhintergrunds.
     Fonts der Seite sind im Shadow Root über ihren Familiennamen
     verfügbar; Fallback ist ein System-Stack.
- Live folgen: Wechselt die Website ihr Theme (Klassen .dark/.light,
  data-theme, data-color-scheme oder style am html/body, Media Query
  prefers-color-scheme), passt sich das Widget ohne Neuladen an. Dafür
  einen MutationObserver mit Drosselung einsetzen und
  KlarAccess.refreshTheme() öffentlich anbieten.
- Kontrast-Wächter: Jede abgeleitete Kombination nachrechnen (WCAG-Formel
  für relative Leuchtdichte).
  - Text mindestens 4,5:1.
  - Ränder von Bedienelementen, Schaltern, Segmenten und Fokus mindestens
    3:1.
  - Erfüllt der erkannte Akzent das als Textfarbe nicht, nur für Flächen
    nutzen und eine hellere oder dunklere Textvariante im selben Farbton
    ableiten.
  - --ka-on-accent (Schrift auf Akzentflächen) nach Kontrast wählen.
  - Nie eine Kombination unter den Schwellen ausliefern; im Zweifel auf
    sichere neutrale Werte zurückfallen.
- Der Knopf: Er bleibt sofort als Barrierefreiheits-Knopf erkennbar (Symbol,
  mindestens 44 × 44 px, Standard 56 px, kreisrund) und nimmt die Farben
  der Seite an: dunkle Tinte der Seite als Fläche, Akzent als Ring.
  Mindestens 3:1 gegen hellen und dunklen Hintergrund, auch über Fotos;
  dazu dient der Ring.
- Unter forced-colors: active gelten nur Systemfarben; das Theming greift
  dort nicht.

2. LESEHILFE NEU: LESELINEAL UND LESEMASKE
- Die Einstellung „Lesehilfe“ wird eine Auswahl mit drei Stufen: Aus,
  Leselineal, Lesemaske. Dazu eine Größe von 1, 2 oder 3 Zeilen, analog
  zur Textgröße mit +/−.
  - Speicherung: Das alte guide: true wird zu „Leselineal“ migriert.
- Leselineal: Ein waagerechtes Band über die ganze Breite, so hoch wie
  die gewählte Zeilenzahl der Textzeile darunter.
  - Ausrichtung: Das Band sitzt genau auf der Zeile, nicht 20 px darunter.
    Die Zeile wird per document.caretPositionFromPoint bzw.
    caretRangeFromPoint ermittelt, ihre Box über getClientRects des
    Zeichenbereichs. Liegt kein Text unter dem Zeiger, das Band um den
    Zeiger zentrieren, mit der Zeilenhöhe der Umgebung.
  - Aussehen: dezente Akzent-Tönung (etwa 10–15 %) mit 2 px Kanten oben und
    unten in --ka-accent. Der Text darunter bleibt voll lesbar und behält
    seinen Kontrast.
- Lesemaske: Alles außerhalb des Bands wird abgedunkelt, im dunklen Theme
  abgedunkelt oder aufgehellt, etwa 55–65 %. Das Band bleibt frei.
- Folgen:
  - Mauszeiger.
  - Tastaturfokus: das Band auf die erste Zeile des fokussierten
    Elements.
  - Textauswahl und Caret in Feldern.
  - Touch:
    - Das Band steht fest bei etwa 40 % der Bildschirmhöhe, der Text
      scrollt darunter durch.
    - Ein Antippen von Text setzt das Band auf diese Zeile.
    - Ein kleiner Griff am Band verschiebt es, mit Zieh-Alternative
      (WCAG 2.5.7): zwei Knöpfe „höher/tiefer“ im Dialog bzw. am Band.
- Technik: position fixed, pointer-events: none (außer dem Touch-Griff),
  aria-hidden, Bewegung per transform in requestAnimationFrame, keine
  Layout-Schleifen. Unter reduzierter Bewegung springt das Band ohne
  Animation. Unter dem geöffneten Dialog und unter dem Knopf, nie darüber.
  Unter forced-colors in Highlight bzw. Systemfarben.
- Keine Tastenkürzel, die Seite, Browser oder Screenreader belegen.
  Kürzel nur, wenn sie konfliktfrei und abschaltbar sind.

3. EINSTELLUNGEN, DIE KEINE WEBSITE BESCHÄDIGEN
- Bewegung reduzieren:
  - CSS-Animationen nicht pausieren, denn pausierte Einblendungen
    frieren unsichtbar ein. Stattdessen jede Animation sofort zu Ende
    laufen lassen: animation-duration 0.001ms, delay 0s,
    iteration-count 1, play-state running; Übergänge aus.
    [data-ka-ignore] bleibt ausgenommen.
  - Videos: <video> pausieren wie bisher, eingebettete YouTube- und
    Vimeo-Iframes über deren postMessage-Schnittstelle anhalten, sofern
    sie die API erlauben (enablejsapi), sonst im Event melden.
  - prefers-reduced-motion wie bisher als Untergrenze.
  - Das Event klar-access:change trägt den effektiven Zustand, damit
    JS-Animationen der Website (Framer Motion, GSAP, Lottie) reagieren
    können. Beispiel in der README.
- Textgröße: 1.0 skaliert die Root-Schriftgröße. Abstände in rem wachsen
  dadurch mit, und Mehrspalten-Layouts laufen bei 200 % seitlich aus dem
  Bildschirm (Media Queries schalten nicht um). Ansätze auf den
  Testseiten vergleichen und den mit dem wenigsten Schaden zum Standard
  machen; die Abwägung in der README festhalten:
  - Root-Skalierung mit Überlauf-Wächter: nach dem Anwenden
    scrollWidth > clientWidth prüfen und die Website per Event
    informieren.
  - Text-only-Skalierung über die Schriftgröße von Textelementen.
  - CSS zoom.
  Eine Website muss reagieren können: das Attribut data-ka-size und die
  Variable --ka-scale bleiben, dazu ein Hinweis zur Fixierung von
  Abständen (Tailwind v4: --spacing in px). Bis 200 % prüfen.
- Kontrastmodi Hell/Dunkel: Beim Umschalten Übergänge kurz abschalten, damit
  keine Farbe sekundenlang in einem unlesbaren Zwischenzustand hängt.
  Gradient-Text (background-clip: text) und -webkit-text-fill-color in
  den Modi auf echte Farbe zurücksetzen.
- Sprunglink: data-skip="auto|on|off", Standard auto. Bei auto erscheint
  der eigene Sprunglink nur, wenn die Seite keinen hat. Erkennung: ein
  frühes, fokussierbares a[href^="#"], dessen Text oder Ziel nach
  Sprunglink aussieht, oder ein [data-skip-link]. Der Sprunglink spricht
  die Seitensprache.
- Sprache: Standard ist die Sprache aus <html lang>, und sie folgt deren
  Änderungen in Single-Page-Apps (MutationObserver auf lang).
  - data-lang erzwingt eine Sprache.
  - Texte für de, en, fr; die Struktur so anlegen, dass weitere Sprachen
    (lb, nl, it, pt) einfach dazukommen.
  - lang am Host passend setzen.
- Position und Kollisionen: Abstände über --klar-offset-x und
  --klar-offset-y einstellbar. Liegt ein festes Element der Seite
  (Cookie-Leiste, Chat-Knopf, mobile Kontaktleiste) im Bereich des Knopfs,
  rückt der Knopf darüber; per ResizeObserver und Drosselung erkennen. Mit
  data-avoid="auto|off" abschaltbar. Größe und Lage des Knopfs als
  Variablen veröffentlichen, damit Websites Platz reservieren können.
- Fokus: Die Einstellungen ändern nie den Fokus der Seite. Nach dem
  Schließen geht der Fokus an den Auslöser zurück (wie bisher).

4. DAS WIDGET SELBST
- Der Dialog bleibt ein natives <dialog> mit showModal:
  - Fokus beim Öffnen auf „Schließen“, Tab bleibt im Dialog, Escape
    schließt, Fokus kehrt zurück.
  - Zielgrößen mindestens 44 px, sichtbarer Fokus.
  - Statusmeldungen über die bestehende Live-Region.
  - Schalter mit role="switch", Auswahl als Radiogruppe.
- In jedem automatisch erzeugten Stil (siehe Tests) mit axe-core bei
  geöffnetem Dialog: 0 Verstöße. Dazu Kontraste rechnerisch prüfen.
- Auf 320 px Breite und bei 200 % Browser-Zoom ist der Dialog vollständig
  bedienbar und scrollt intern.

5. TESTS
- Eine Testumgebung im Repository (z. B. /test-sites) mit mindestens
  diesen Seiten:
  1. Hell, Serifen, eckig, dunkelblauer Akzent.
  2. Dunkel, Grotesk, stark gerundet, Akzent, der als Text keine
     4,5:1 erreicht.
  3. Grellgelber Akzent auf Weiß.
  4. Tailwind-Layout mit rem-Abständen, 12-Spalten-Grid und
     Mehrspalten-Navigation.
  5. SPA mit Routenwechsel, Theme-Umschalter (.dark) und
     Sprachwechsel über <html lang>.
  6. Seite mit Einblend-Animationen, einem Logo-Laufband und einem
     YouTube-Hintergrundfilm.
  7. Seite mit Cookie-Leiste und Chat-Knopf unten rechts.
  8. Seite mit eigenem Sprunglink und eine ohne.
- Playwright (Chromium, Firefox, WebKit) plus @axe-core/playwright. Zu
  prüfen:
  - Theming: Die erkannten Tokens passen zur Seite, und alle Kontraste
    halten die Schwellen.
  - Live-Theme-Wechsel.
  - Tastatur im Dialog.
  - Leselineal und Lesemaske mit Maus, Tastatur und Touch-Emulation.
    Prüfen, dass das Band die Zeile unter dem Zeiger deckt.
  - Reduzierte Bewegung: keine unsichtbaren Einblendungen, Laufband
    steht, Film angehalten.
  - Textgröße 200 % ohne seitliches Überlaufen auf Seite 4.
  - Kollision mit Cookie-Leiste und Chat-Knopf.
  - Sprunglink-Erkennung.
  - Sprachwechsel.
  - Migration gespeicherter 1.0.0-Einstellungen.
  - destroy() stellt die Seite vollständig wieder her.
  - forced-colors-Emulation.
- Bildschirmfotos des Dialogs und der Lesehilfe auf allen Testseiten, hell
  und dunkel, Desktop und Telefon, als Artefakt zum Ansehen.
- Ein echter Screenreader-Test lässt sich hier nicht ersetzen. Als offen
  markieren und Prüfschritte nennen: NVDA, VoiceOver, TalkBack.

6. LIEFERUNG
- Die vier Dateien (Version 1.1.0 im Kopfkommentar und in
  KlarAccess.version).
- README:
  - Einbindung in einer Zeile.
  - Alle data-Attribute.
  - Die --klar-*-Variablen.
  - configure() und refreshTheme().
  - Events mit Beispielen für React/Next, Vue und statisches HTML.
  - Hinweise für Websites: Platz in der Ecke, Abstände unter
    data-ka-size, JS-Animationen an klar-access:change.
- CHANGELOG mit Migration von 1.0.0 und den Größen der Dateien.
- Ein kurzer Abschnitt „Was das Widget nicht ist“: kein Ersatz für
  barrierefreien Code, keine Konformitätserklärung.
- Am Ende committen und pushen. Nichts veröffentlichen ohne meine
  Freigabe. Zusammenfassen: was neu ist, was getestet wurde, was offen
  ist.
```

---

## Danach auf www.deev.lu

Wenn 1.1.0 fertig ist:

1. Die vier Dateien in `public/klar-access/` ersetzen.
2. `src/lib/klarAccessTheme.ts` auf das reduzieren, was die automatische
   Erkennung nicht trifft. Am besten bleiben nur `--klar-*`-Variablen in
   `tokens.css`.
3. Die eigenen Regeln für `data-ka-motion` in `motion.css` prüfen und
   entfernen, die das Widget jetzt selbst erledigt.
4. `npm run build && npm run test:a11y` ausführen.
