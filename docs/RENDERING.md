# D-05: die Seite wird ausgeliefert, nicht nachgebaut

## Was vorher passierte

`prerender-routes.mjs` rendert jede Route serverseitig. Das Ergebnis landete
aber nicht als Seite im Dokument, sondern:

- ohne `class` und `style` (beides wurde herausgeschnitten),
- in einem `<div id="prerendered" style="content-visibility:hidden">`,
- unter einem `#app-loader`, der deckend über allem lag.

`main.tsx` rief `createRoot`, verwarf dieses Markup und baute die Seite neu.

Für einen Crawler ohne JavaScript standen die Wörter da. Für einen Besucher
stand ein Ladebalken da, bis das JavaScript geladen, geparst und ausgeführt
war. Der Aufwand des Vorrenderns kam also genau der Gruppe zugute, die nicht
kauft, und niemandem sonst.

## Was jetzt passiert

Das vorgerenderte Markup ist die Seite: mit Klassen, sichtbar, ohne Loader.
`main.tsx` hängt sich mit `hydrateRoot` daran, statt es zu ersetzen.

Damit das trägt, mussten drei Bausteine über dem Seitenumbruch aufhören, sich
selbst zu verstecken. Sie standen mit Deckkraft 0 im HTML und wurden erst von
`motion` eingeblendet — ohne JavaScript also gar nicht:

| Baustein | vorher | jetzt |
|---|---|---|
| `Navbar` | schwebte von oben ein | steht |
| `Hero`-Bild | blendete auf | steht — es ist das LCP-Element |
| `ClientLogos`-Label | `whileInView` | steht |

Bausteine unterhalb des Seitenumbruchs behalten ihre Einblendung. Bis dorthin
gescrollt wird, ist das JavaScript da.

## Zwei Sicherungen

**Sprachvergleich.** `data-ssr` trägt die Sprache, in der das Dokument
gerendert wurde. `main.tsx` hydriert nur, wenn sie zur Sprache in der Adresse
passt. `/de` liegt als `de/index.html` vor; ob ein Host das unter `/de`
ausliefert oder auf die englische Wurzel zurückfällt, ist Hostverhalten.
Fällt er zurück, wäre Hydrieren der schlechteste Ausgang: englisches Markup,
das sichtbar zu deutschem umspringt. Der Vergleich macht daraus stillschweigend
das Verhalten von vorher.

**Der Loader bleibt.** In der Entwicklung und auf `404.html` wird nicht
vorgerendert; dort steht weiter der Ladebildschirm und `createRoot`.

## Gemessen

Gedrosselt wie ein Mobilgerät: 4× langsamere CPU, 1,6 Mbit/s, 150 ms Latenz,
Viewport 390×844, Median aus fünf Läufen gegen denselben Produktionsbuild.

`CONTENT` ist die Zeit, bis kein Loader mehr davor liegt und eine H1
tatsächlich Fläche im Viewport hat — also bis wirklich etwas dasteht.

| Route | Messwert | vorher | nachher | |
|---|---|---|---|---|
| `/` | FCP | 1356 ms | 1476 ms | +120 ms |
| `/` | CONTENT | 2908 ms | **1423 ms** | −1485 ms |
| `/` | LCP | 3556 ms | **2640 ms** | −916 ms |
| `/de/` | CONTENT | 2901 ms | **1465 ms** | −1436 ms |
| `/de/` | LCP | 3568 ms | **2364 ms** | −1204 ms |
| `/services/ai-automation` | CONTENT | 2950 ms | **1325 ms** | −1625 ms |
| `/services/ai-automation` | LCP | 2984 ms | **1356 ms** | −1628 ms |
| `/services/ai-automation` | CLS | 0,7346 | **0** | |

FCP steigt um 120 ms, und das ist kein Verlust: vorher war der erste Pixel ein
Ladebalken, jetzt ist er die Seite. Die Zahl, die den Unterschied beschreibt,
ist CONTENT — rund 1,5 Sekunden früher.

CLS 0,73 auf der KI-Leistungsseite war der Umbau selbst: Loader weg, Seite neu
gebaut, alles verschoben. Ohne Neubau gibt es nichts zu verschieben.

## Geprüft

15 Routen in drei Sprachen: keine Hydratationsfehler, keine
Konsolenmeldungen, Scrollposition 0, Text identisch zu vorher.

Ohne JavaScript, `/` und `/de/`: Überschrift, Navigation, Hero-Bild und 38
Links sichtbar und gestylt. Vorher: ein Ladebalken, dauerhaft.
