# Fehlende Fakten und Freigaben

Nur was wirklich fehlt. Alles andere ist im Repository belegt und wird
verwendet. Null heißt unbekannt, nicht „bitte ergänzen".

## Was bereits belegt ist und nicht erfragt werden muss

16 Projekte mit Titel, Jahr, Sektor, geliefertem Umfang, Live-URL und echtem
Screenshot. Das trägt die Referenzsektion und den Portfolioindex heute schon.

## 1. Fallstudien: alle 16 Projekte haben keinen Fließtext

`summary`, `challenge`, `approach` und `outcome` sind bei **allen 16** leer.
Die Fallstudienseiten rendern deshalb nur die Spezifikationstabelle.

Gebraucht werden die vier Fragen aus dem Brief, je Projekt:
1. Was war die konkrete Aufgabe?
2. Was hat DEEV tatsächlich geliefert, inklusive wichtiger Integration?
3. Welches Ergebnis ist bestätigt, ohne geschätzte Kennzahl?
4. Welche Screenshots, welche URL, welches Zitat sind freigegeben?

Priorität: die drei Projekte, die auf der Startseite stehen sollen. Zwei
vollständige echte Cases sind besser als ein dritter erfundener.

## 2. Im Brief genannt, aber nicht im Repository vorhanden

| Kandidat | Stand |
|---|---|
| F.I.T. / Fachinstitut für Tierheilkunde | Kein Projekt, kein Screenshot, keine URL. Vollständig unbekannt. |
| MBM Real Estate Group | Kein Projekt. Launchstatus und Veröffentlichungserlaubnis offen. |
| Billovio | Nur ein Bild in `src/assets/work/`. Kein Projekteintrag. Als eigenes Produkt zu kennzeichnen, nicht als Kundenreferenz. |
| Stoffel, Haas | Logos in der Kundenleiste, keine Projekte. Ob ein Projekt daraus wird, ist offen. |

Bureau Immobilier Feltes liegt als `bureau-immobilier-feltes` vor (2024, Web
App, Live-URL, Screenshot). Die im Brief erwähnte Apimo-Integration ist im
Repository **nicht** belegt und wird bis zur Bestätigung nicht behauptet.

## 3. Zahlen, die niemand belegt hat

- Gesamtzahl der Projekte. Die Kundenleiste sprach früher von „50+", das
  Portfolio hat 16. Ohne Definition steht auf der Startseite jetzt nur
  „Drei von sechzehn", was nachprüfbar ist.
- Reaktionszeit. „Innerhalb eines Werktags" steht auf der Kontaktseite. Vom
  Betreiber zu bestätigen oder zu streichen.
- Inklusivleistungen: Wartung, Hosting, Schulung, Übergabe. Was ist wirklich
  im Preis, was kostet extra? Betrifft die Leistungsseiten.

## 4. Rechte und Zugänge

- Bildrechte an den 16 Screenshots für die öffentliche Nutzung.
- Typold-Weblizenz. Die PDF nennt nur eine Desktop-Lizenz; eine WOFF2 im
  Repository belegt keine Weblizenz.
- Resend-Konto und DNS bei OVH für eine verifizierte Absenderdomain.

## 5. Die Leistungsseite „Websites" ist die dünnste der drei

Gemessen am ausgelieferten Build trägt sie rund 1.300 Zeichen Text, die
KI-Seite rund 3.400, die Softwareseite rund 2.000. Der Grund ist kein
Versehen: für KI und Software konnten vorhandene Blöcke von der Startseite
umziehen (`AiConcepts`, `SystemStack`, `BillovioFeature`), für Websites gibt
es keinen solchen Block.

Was die Seite füllen würde, ist genau das, was oben unter Punkt 3 fehlt: die
Inklusivleistungen. Wartung, Hosting, Schulung und spätere Inhaltsänderungen
sind die Fragen, die ein Interessent vor der Anfrage beantwortet haben will,
und sie sind eine kaufmännische Aussage, die ich nicht selbst treffen darf.

Bis dahin bleibt die Seite kurz und richtig, statt lang und ausgedacht.

## 6. F.I.T. Fachinstitut für Tierheilkunde: Eintrag da, Screenshot fehlt

Der Eintrag ist angelegt und erzeugt bereits Portfolioeintrag, Fallstudienseite
in drei Sprachen und Sitemap-Einträge. Zwei Punkte sind offen.

**Der Screenshot.** `fachinstitut-tierheilkunde.de` ist aus meiner
Arbeitsumgebung gesperrt, ich kann die Aufnahme nicht selbst machen, und die
Bilder aus dem Chat liegen mir nicht als Datei vor. Bitte als
`fachinstitut-tierheilkunde.jpg` hier ablegen:

https://github.com/deev-lu/Deev-Platform1/upload/main/src/assets/work

Erst danach erscheint das Projekt in der Hero-Rotation — die zeigt nur
Projekte mit Aufnahme, damit dort nie eine leere Fläche steht. Der Platz ist
bereits für es reserviert.

**Das Jahr.** Eingetragen ist 2026, abgeleitet aus den Kursterminen auf der
Seite (nächster Start Oktober 2026, Abendform März 2027). Das belegt, dass die
Seite 2026 läuft, nicht wann DEEV sie geliefert hat. Bitte bestätigen oder
korrigieren.

Die übrigen Angaben stammen aus den Aufnahmen der Seite selbst: berufsbegleitende
Ausbildungen in Tierphysiotherapie, Osteopathie, Chiropraktik und
Ernährungstherapie für Hund und Pferd, Theorie im virtuellen Klassenzimmer,
Praxis in NRW, Hessen und Niedersachsen. Was DEEV daran geliefert hat und
welches Ergebnis bestätigt ist, steht dort nicht — dafür weiterhin die vier
Fragen aus `FRAGEN_AN_DEEV.md`.
