# Testumgebung: Änderungen ansehen, bevor sie live gehen

Von meiner Umgebung aus ist `vercel.com` gesperrt und es liegt kein Token
vor. Die Domain selbst müssen Sie anlegen — es sind wenige Klicks. Was ich
vorbereiten konnte, ist das, was bei einer Testdomain sonst schiefgeht;
siehe „Zwei Fallen" unten.

## Variante 0 — sofort testen, ein Befehl auf Ihrem Rechner

Das Repository hat keine GitHub-Action, die deployt; laut `CLAUDE.md` wird
von Hand deployt. Der dort dokumentierte Befehl hat `--prod` und geht damit
auf `www.deev.lu`. **Ohne `--prod` entsteht stattdessen eine Vorschau-URL** —
dieselbe Mechanik, andere Adresse, die echte Seite bleibt unberührt:

```bash
git fetch origin claude/website-connection-status-kziv3w
git checkout claude/website-connection-status-kziv3w
npx vercel --archive=tgz --yes        # kein --prod!
```

Am Ende steht eine Adresse der Form `deev-<hash>.vercel.app`. Die ist sofort
teilbar und dank der `noindex`-Regel unten nicht indexierbar.

`--archive=tgz` bitte beibehalten: laut `CLAUDE.md` sind einfache Uploads
über wackelige Verbindungen wiederholt fehlgeschlagen.

## Variante A — Vorschau je Branch (dauerhaft, kein Aufwand mehr)

Wenn das Repository in Vercel mit GitHub verbunden ist, entsteht für **jeden
Push auf einen Branch automatisch eine eigene URL**. Kein Anlegen, keine DNS,
nichts zu pflegen — und jeder Stand bleibt unter seiner eigenen Adresse
erreichbar, was beim Vergleichen hilft.

So finden Sie die URL für den aktuellen Stand:

1. vercel.com → Projekt `deev` → Reiter **Deployments**
2. Auf den Branch `claude/website-connection-status-kziv3w` filtern
3. Oberster Eintrag → **Visit**

Alternativ steht die Adresse direkt am Commit in GitHub, sobald der Build
durch ist (grüner Haken → „Details").

**Falls dort nichts erscheint**, ist das Projekt nicht mit GitHub verbunden:
Vercel → Projekt → Settings → **Git** → Repository `deev-lu/Deev-Platform1`
verbinden. Danach genügt ein Push.

## Variante B — feste Adresse `test.deev.lu`

Sinnvoll, wenn Sie jemandem immer denselben Link geben wollen.

1. **Vercel:** Projekt → Settings → **Domains** → `test.deev.lu` hinzufügen →
   als Branch **nicht** `main` wählen, sondern den Entwicklungsbranch.
   Vercel zeigt daraufhin den Zielwert für den DNS-Eintrag an.
2. **OVH:** in der DNS-Zone **einen** Eintrag ergänzen:

   | Typ | Name | Ziel |
   |---|---|---|
   | CNAME | `test` | der von Vercel angezeigte Wert |

**Ihr Mailbetrieb bleibt unberührt.** Ein CNAME auf der Subdomain `test`
ändert nichts an den MX-Einträgen der Hauptdomain; Microsoft 365 auf
`contact@deev.lu` merkt davon nichts. Legen Sie ausschließlich diesen einen
Eintrag an und fassen Sie keine bestehende Zeile an.

## Zwei Fallen, beide jetzt zugemauert

**1. Google indexiert die Kopie.** Eine erreichbare Zweitfassung der Seite
konkurriert mit `www.deev.lu` um dieselben Suchbegriffe, und der Aufwand aus
dem Juni-Relaunch wäre teilweise entwertet. In `vercel.json` liefert jetzt
**jeder Host außer `www.deev.lu`** den Header `X-Robots-Tag: noindex,
nofollow`. Das gilt automatisch für jede Vorschau-URL und für
`test.deev.lu`, ohne dass dort etwas eingestellt werden muss.

**2. Testklicks in Ihrem frischen GA4.** Vorschauen laufen mit demselben
Build und derselben Mess-ID. Ohne Grenze zählte jeder eigene Klick bei der
Abnahme als Sitzung — in genau dem Konto, das Sie gerade aufsetzen.
Absprungrate, Sitzungsdauer und die Zahl der Anfragen wären von Anfang an
mit unserer eigenen Durchsicht vermischt, und nachträglich lässt sich das in
GA4 nicht sauber herausrechnen. `analytics.ts` misst deshalb **nur** auf
`www.deev.lu`.

Die Kehrseite, damit sie nicht überrascht: auf der Testdomain können Sie die
Tracking-Ereignisse nicht in GA beobachten. Das ist Absicht. Wenn Sie sie
doch einmal prüfen wollen, sagen Sie Bescheid — dafür ist eine zweite Mess-ID
für die Testumgebung der saubere Weg, nicht das Aufweichen dieser Grenze.

## Was auf der Testdomain *nicht* getestet werden kann

Das Kontaktformular sendet über `api/lead.ts` an Resend. Der Absender steht
weiterhin auf `onboarding@resend.dev` (offener Punkt D-02), und echte
Testmails sollen ohne Ihre Freigabe nicht laufen. Ein Absenden auf der
Testdomain geht also entweder ins Leere oder erzeugt eine echte Mail — bitte
vorher abstimmen, nicht einfach ausprobieren.
