# Status

**Branch:** `claude/sales-relaunch` (aus `claude/website-connection-status-kziv3w`)
**Nicht nach `main` gemergt, nicht deployt.** Gate B steht aus.

## Erledigt

- **Phase A** Bestandsaufnahme, Auditdelta in `docs/PLAN.md`. Alle fünf P0-Befunde
  im heutigen Code bestätigt, D-04 mit dem mitgelieferten Skript reproduziert.
- **Phase B** D-01, D-03, D-04, D-07 behoben. Testsetup neu (vitest 3.2.7),
  24 Regressionstests, im Build verdrahtet.
- **Phase C** Hero, Referenzsektion und `/project` als erste sichtbare Richtung.

## Wartet auf Freigabe

**Gate A: visuelle Richtung.** Screenshots liegen vor.

## Echte Blocker

| Punkt | Warum ich nicht weiterkomme |
|---|---|
| D-02 Resend-Absender | Braucht verifizierte Absenderdomain im Resend-Konto und DNS bei OVH. Kein Kontozugriff, kein Testversand ohne Freigabe. |
| Dauerhafte Leadablage | Kein Backend vorhanden. Supabase liegt als Abhängigkeit bei, aber mit Platzhalter-Zugangsdaten. Bis dahin ist „angenommen" = Benachrichtigung angenommen, nicht gespeichert. |
| Reale Performance-Basislinie | Das Audit hat keine. Vorher/Nachher an vergleichbaren Produktionsbuilds ist geplant, aber noch nicht gelaufen. |
| Typold-Webfont-Lizenz | Die PDF nennt nur eine Desktop-Lizenz. Eine WOFF2 im Repo belegt keine Weblizenz. |

## Nächster Schritt nach Freigabe

Restliche Homepage auf die sechs Abschnitte, Leistungsseiten, D-05 Rendering
(sichtbares HTML plus Hydrierung statt verstecktem Markup), Ankerübergänge für
`#project-builder` und `#pricing`, SEO, Tracking, QA.
