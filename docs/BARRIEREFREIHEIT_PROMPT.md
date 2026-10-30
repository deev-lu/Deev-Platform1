# Prompt: Website barrierefrei machen (WCAG 2.2 AA) mit Klar Access

Für jedes Website-Projekt von DEEV einmal in eine neue Claude-Code-Sitzung
im jeweiligen Repository einfügen. Die vier Klar-Access-Dateien
(`klar-access.js`, `klar-page.css`, `klar-panel.css`,
`klar-cursor.svg`) mitschicken. Ist das Widget im Projekt
schon eingebunden, entfällt der Anhang.

Der Prompt beschreibt den Stand, den www.deev.lu am 29. Oktober 2026
erreicht hat (siehe `ACCESSIBILITY.md` und den Abschnitt „Accessibility“ in
`CLAUDE.md` dort).

---

```text
Mach diese Website barrierefrei nach WCAG 2.2, Konformitätsstufe AA, und
binde das beigefügte Accessibility-Widget Klar Access ein. Arbeite bis zur
Umsetzung und Überprüfung durch, nicht nur bis zu einem Bericht.
Frage nur nach, wenn eine fehlende Information oder Entscheidung die
Arbeit wirklich blockiert.

GRUNDREGELN
- Die Website muss in ihrer Standarddarstellung zugänglich sein. Klar Access
  ist eine Komfortfunktion, nie der Grund, warum etwas besteht.
- Keine Konformitätserklärung, keine Prüfergebnisse, Kontaktangaben,
  Zertifikate oder Bildinhalte erfinden. Nirgends auf der Website behaupten,
  sie sei durch das Widget barrierefrei oder konform.
- Projektanweisungen (CLAUDE.md, README) beachten, Branding und Design
  erhalten, soweit mit Barrierefreiheit vereinbar. Vorhandene, nicht zu
  dieser Aufgabe gehörende Änderungen nicht anfassen.
- Probleme möglichst in gemeinsam genutzten Komponenten beheben.
- Nichts automatisch auf die produktive Website veröffentlichen. Am Ende
  auf einen Branch committen, pushen, die Vorschau-URL nennen und auf meine
  ausdrückliche Freigabe warten.

1. PROJEKT VERSTEHEN
- Framework, Rendering (statisch, SSR, Prerender, SPA mit Hydrierung),
  Routen und Sprachen, gemeinsame Komponenten und vorhandene Tests
  ermitteln.
- Alle Seitenvorlagen und Nutzerwege inventarisieren: Navigation
  (Desktop, Telefon, Sprache, Theme), Formulare, Suche, Anmeldung,
  Buchung, Warenkorb und Checkout, Cookie-Banner, eingebettete Videos und
  Karten, Downloads, soweit vorhanden.
- Ausgangsmessung mit axe-core (Tags wcag2a, wcag2aa, wcag21a, wcag21aa,
  wcag22aa) über repräsentative Seiten, in jedem Design (hell/dunkel), bei
  1440 und 390 px, mit und ohne reduzierte Bewegung. Ergebnis notieren.

2. KLAR ACCESS EINBINDEN (falls noch nicht vorhanden)
- Die vier Dateien zusammen im öffentlich ausgelieferten Verzeichnis
  /klar-access/ ablegen (bei einem public-Ordner: public/klar-access/).
  Es sind die Dateien des Inhabers: nicht verändern, nur als Satz ersetzen.
- /klar-access/klar-access.js einmal global laden, zum passenden
  Zeitpunkt, bei hydrierten Anwendungen nach der Hydrierung. Doppelte
  Initialisierung bei Navigation oder erneutem Rendern vermeiden (Guard
  über window.KlarAccess und eine Markierung am <script>).
- Data-Attribute am Script:
  - Menüsprache data-lang. Standard Deutsch; bei mehrsprachigen Seiten
    nachfragen, ob das Menü der Seitensprache folgen soll.
  - Akzentfarbe der Marke als data-color.
  - Position rechts.
- Die Ecke unten rechts gehört dem Knopf (56 px, 24 px Abstand, auf
  Telefonen 20 px). Andere schwebende Elemente rücken zur Seite:
  - WhatsApp- und Chat-Knöpfe
  - Cookie-Leiste und Dialog-Fußzeilen
  - feste Kontaktleisten auf dem Telefon
  Der Knopf darf nichts verdecken. Bei 1440, 1280, 1024, 800, 390 und 360
  px prüfen.
- Optik an die Marke anpassen, ohne die Dateien zu ändern: nach dem Event
  `klar-access:ready` ein <style> in den Shadow Root des Hosts
  <klar-access> hängen, nach dem eigenen Stylesheet des Widgets.
  - Markenschriften, Flächen- und Textfarben der Website, Akzentfarbe für
    aktive Schalter, Radien des Designsystems.
  - Ein Attribut am Host (z. B. data-site-theme) folgt dem Theme der
    Website, beobachtet per MutationObserver.
  - Geometrie des Knopfs nicht ändern.
  - Alles in @media (forced-colors: none) fassen.
  - Text mindestens 4,5:1, Schalter- und Feldränder mindestens 3:1,
    sichtbarer Fokus.
- Den eingebauten „Zum Hauptinhalt springen“-Knopf des Widgets im Theme
  ausblenden (.ka-skip { display: none !important }, außerhalb des
  forced-colors-Blocks). Die Website bekommt einen eigenen Sprunglink in
  der Seitensprache, der auch ohne Widget funktioniert.
- Das Widget im Cookie-Dialog bzw. der Cookie-Richtlinie aufführen: Es
  speichert `klar-access:v1` in localStorage.

3. VERHALTEN DES WIDGETS AUF DER SEITE ABFANGEN
- „Bewegung reduzieren“ setzt html[data-ka-motion] und pausiert alle
  CSS-Animationen. Einblendungen würden unsichtbar einfrieren. Deshalb unter
  dem Attribut jede Animation sofort zu Ende laufen lassen:
  - Selektor html[data-ka-motion][data-ka-motion] body *:not([data-ka-ignore],
    [data-ka-ignore] *), dazu ::before und ::after
  - animation-duration: 0.001ms; animation-delay: 0s;
    animation-iteration-count: 1; animation-play-state: running, jeweils
    !important
  - für Einblend-Klassen zusätzlich opacity: 1 und transform: none
- Das Widget pausiert nur <video>. YouTube-, Vimeo- oder Lottie-Animationen
  und JS-Animationen (Framer Motion, GSAP) müssen auf dasselbe Attribut
  reagieren und stoppen.
- „Textgröße“ vergrößert die Root-Schriftgröße. Abstände in rem wachsen
  sonst mit und schieben Mehrspalten-Layouts aus dem Bildschirm, weil Media
  Queries nicht umschalten. Unter html[data-ka-size] die Abstands-Einheit
  fest halten (bei Tailwind v4: --spacing: 4px). Bei 200 % auf 390 und 1280
  px prüfen, dass nichts seitlich überläuft und kein Bedienelement der
  Navigation außerhalb des Bildschirms liegt. Die Navigation notfalls in
  die kompakte Telefon-Variante schalten.
- Kontrastmodi „Hell“ und „Dunkel“ einschalten und mit axe nachmessen.

4. WCAG 2.2 AA PRÜFEN UND IM CODE BEHEBEN
- Struktur:
  - Jede Seite hat <header>, genau ein <main> und <footer>.
  - Navigationen sind benannt, wenn es mehrere gibt.
  - Die Überschriftenfolge ist logisch, keine Überschriften in Buttons.
  - Definitionslisten sind korrekt.
  - lang am <html> stimmt pro Sprache; Texte in anderer Sprache sind
    ausgezeichnet oder übersetzt (hartkodierte englische Strings auf
    FR/DE-Seiten suchen).
- Tastatur:
  - Alles ist bedienbar.
  - „Zum Inhalt springen“ ist der erste Stopp der Seite.
  - Der Fokusrahmen ist deckend, mindestens 3:1 gegen beide
    Untergründe.
  - Bei SPAs geht nach einem Seitenwechsel der Fokus an den
    Inhaltsanfang, und der neue Titel wird über eine aria-live-Region
    angesagt.
  - scroll-padding oben und unten sorgt dafür, dass feste Leisten
    (Header, Cookie-Leiste, mobile Kontaktleisten) den fokussierten
    Inhalt nicht verdecken (2.4.11).
- Menüs, Dropdowns, Mega-Menüs:
  - Disclosure-Muster: Ein Button mit aria-expanded und aria-controls
    öffnet.
  - Nie beim bloßen Fokussieren öffnen (3.2.1).
  - Das Panel steht im DOM direkt hinter seinem Button.
  - Escape schließt und gibt den Fokus an den Button zurück.
  - Seiten sind Links (<a href>), keine Buttons.
  - Kein aria-haspopup, wenn kein echtes role="menu" vorliegt.
- Modale Dialoge:
  - Ein gemeinsamer Hook oder eine Komponente für alle Modals:
    - Fokus beim Öffnen hinein
    - Tab bleibt im Dialog
    - Escape schließt
    - Fokus zurück an den Auslöser, mit Ersatzziel, falls der Auslöser
      verschwunden ist
  - Dazu role="dialog", aria-modal="true" und ein Name.
  - Auch Lead-Formulare und Rechner prüfen, die als Overlay erscheinen.
- Formulare:
  - Labels:
    - Jedes Feld hat ein dauerhaft sichtbares, zugeordnetes Label.
    - Platzhalter sind nur Beispiele.
    - Der Sternchen-Hinweis („Mit * markierte Felder sind Pflichtfelder“)
      steht über dem Formular; das Sternchen selbst bekommt
      aria-hidden.
  - Felder bekommen required und passende autocomplete-Werte.
  - Fehler stehen in role="alert".
  - Ersetzt eine Bestätigung das Formular, geht der Fokus darauf.
  - Feldränder, Checkboxen und Schalter haben mindestens 3:1 (1.4.11),
    etwa über ein eigenes Token für Bedienelement-Ränder; dekorative
    Haarlinien davon trennen.
  - Platzhalter-Text mindestens 4,5:1.
- Namen:
  - Icon-Buttons haben einen zugänglichen Namen.
  - Ein aria-label beginnt mit dem sichtbaren Text (2.5.3), sonst gilt
    der sichtbare Text als Name.
  - Wechselnde Beschriftung (Pause/Abspielen) nicht zusätzlich mit
    aria-pressed kombinieren.
  - Auswahlkarten melden ihren Zustand (aria-pressed oder native
    Radios/Checkboxen).
  - Dekorative Logos neben ihrem Schriftzug bekommen alt="".
- Kontrast:
  - Text mindestens 4,5:1, großer Text mindestens 3:1, in jedem Design
    und auf jeder Fläche.
  - Demos und Nebentexte über Farbe abschwächen, nie über Deckkraft.
  - Navigation über hellen und dunklen Abschnitten mitmessen.
  - Informationen nie nur über Farbe vermitteln.
- Bilder und Medien:
  - Informative Bilder bekommen aussagekräftiges alt, dekorative alt="";
    keine Bildinhalte erfinden.
  - Hintergrundvideos sind stumm und für Screenreader verborgen.
  - Für Videos mit Ton Untertitel prüfen oder als offen melden.
- Bewegung (2.2.2, 2.3.3):
  - Alles, was sich automatisch länger als 5 s bewegt (Hintergrundvideo,
    Logo-Laufband, Karussells, Animations-Loops), braucht einen
    sichtbaren Pause-Schalter.
  - Am besten ein seitenweiter Schalter „Bewegung anhalten“, im ersten
    Bildschirm und im Footer. Er wird in localStorage gespeichert, vor dem
    ersten Zeichnen angewendet und ist mit Klar Access gekoppelt: Beide
    Attribute zählen als pausiert, der Schalter setzt das Widget über
    window.KlarAccess.setSettings({ motion }), und klar-access:change
    gibt den Zustand zurück.
  - Laufbänder bekommen einen eigenen Pause-Knopf.
  - prefers-reduced-motion respektieren.
- Zoom und Anpassung:
  - Reflow bei 320 CSS-Pixeln ohne seitliches Scrollen (1.4.10).
  - 200 % Zoom (1.4.4).
  - Textabstände nach 1.4.12 ohne abgeschnittenen Text.
  - Zielgrößen mindestens 24×24 px oder mit Abstandsausnahme (2.5.8).
  - Alternativen zu Ziehbewegungen (2.5.7).
  - Nichts darf nur per Hover erreichbar sein.
- Seitlich scrollende Bereiche: tabIndex={0}, Rolle region und ein Name.
- Drittanbieter (Cookie-Banner, Karten, Chat, Buchungs-Widgets,
  YouTube): prüfen, was sich im eigenen Code beheben lässt; den Rest als
  offen dokumentieren.

5. VERIFIKATION
- Website lokal bauen und als Produktions-Build starten.
- axe-core über ALLE URLs (Sitemap, wenn vorhanden):
  - in jedem Design, 1440 und 390 px
  - mit und ohne reduzierte Bewegung
  - Treffer mitten in laufenden Animationen durch Wiederholen von echten
    Fehlern trennen.
- Manuell bzw. per Skript:
  - Tab-Durchlauf durch ganze Seiten: jeder Stopp mit sichtbarem
    Fokusrahmen, keiner verdeckt.
  - Menüs, Dialoge und Formulare per Tastatur inklusive Escape.
  - Reflow 320 px, Textabstände, Zielgrößen.
  - Jede Klar-Access-Einstellung in einem frischen Browser-Kontext (sonst
    summieren sich gespeicherte Einstellungen): Textgröße 200 %, Abstände,
    Schrift, Links, Kontrast hell/dunkel, Bewegung, Lesehilfe. Prüfen auf
    seitliches Scrollen, verdeckte Bedienelemente, Kontrast und
    eingefrorene Einblendungen.
- Regressionstests ins Projekt aufnehmen: Playwright + @axe-core/playwright
  als devDependencies, eigener Befehl (npm run test:a11y), Projekte
  „desktop“ und „phone“. Inhalt:
  - axe pro Seite und Design
  - Sprunglink
  - Menüs
  - Dialoge
  - Formular-Labels
  - Pause-Schalter und Kopplung mit Klar Access
  - Reflow 320 px
  - Textgröße 200 % im Widget

  Nicht in den normalen Build hängen; die Dateinamen so wählen, dass der
  Unit-Test-Runner sie nicht aufgreift.
- Build und alle vorhandenen Tests ausführen.
- Screenreader: Wenn keiner verfügbar ist, ausdrücklich als offen
  markieren. Eine DOM- oder Accessibility-Tree-Prüfung ersetzt keinen
  Screenreader-Test.
- Ein fehlerfreier automatischer Scan ist kein Nachweis vollständiger
  WCAG-Konformität.

6. ABSCHLUSS
- ACCESSIBILITY.md anlegen. Inhalt:
  - geprüfte Seiten, Komponenten und Nutzerwege
  - durchgeführte Korrekturen mit WCAG-Kriterium
  - tatsächlich ausgeführte Tests mit Zahlen; Ausgangsmessung vorher und
    Ergebnis nachher
  - offene Probleme und nicht geprüfte Bereiche: Screenreader,
    Untertitel, Drittanbieter, Erklärung zur Barrierefreiheit als
    Entscheidung des Inhabers
  - konkrete Schritte für die manuelle Abnahme: NVDA, VoiceOver, TalkBack,
    nur Tastatur, Zoom 200/400 %, Systemeinstellungen, Klar Access auf dem
    Telefon
- Die Regeln dauerhaft in CLAUDE.md (oder der Projektdokumentation)
  festhalten, damit spätere Änderungen sie nicht brechen.
- Commit mit einer echten GitHub-Autoren-E-Mail, auf einen Branch pushen,
  Vorschau-URL nennen. Nicht produktiv veröffentlichen ohne meine Freigabe.
- Zum Schluss verständlich zusammenfassen: was geändert wurde, was getestet
  wurde und was offen ist. Vollständige WCAG-Konformität nur behaupten,
  wenn eine vollständige Bewertung sie tatsächlich belegt.
```
