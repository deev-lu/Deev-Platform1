# Release: was der Betreiber tun muss

## Sofort nach dem Deploy prüfen

**1. Kommt eine Anfrage an? (kritisch, Befund D-02 ist offen)**

`api/lead.ts` versendet weiterhin über `onboarding@resend.dev`. Resend
beschränkt diesen Testabsender auf die Adresse, die zum Resend-Konto gehört.
Ob `contact@deev.lu` diese Adresse ist, konnte ich nicht prüfen.

Das ist wichtiger als vorher, weil der Fehler jetzt sichtbar ist: Der Simulator
hat einen fehlgeschlagenen Versand bisher als Erfolg angezeigt. Wenn also
Anfragen nie ankamen, hat das niemand gemerkt. Ab jetzt sieht der Besucher
stattdessen eine Fehlermeldung mit dem Hinweis auf contact@deev.lu.

Zu tun: eine Testanfrage über das Kontaktformular senden und prüfen, ob sie im
Microsoft-Postfach liegt. Wenn nicht, im Resend-Konto eine eigene
Absenderdomain oder Versand-Subdomain verifizieren (DNS bei OVH) und
`FROM_EMAIL` in `api/lead.ts` darauf umstellen. **Die Microsoft-MX-Einträge für
eingehende Mail dabei nicht anfassen.**

**2. Alte Kampagnenlinks**

`/#project-builder` und `/#pricing` führen jetzt auf den Budget-Abschnitt der
Startseite, von dort geht es auf `/project`. Lokal in allen drei Sprachen
geprüft. Nach dem Deploy an einer echten Anzeige gegenprüfen.

Empfehlung: die Ziel-URLs in den Google-Ads-Kampagnen auf `/project`,
`/de/project` beziehungsweise `/fr/project` umstellen, dann entfällt der Umweg.

**3. Search Console**

`/project` ist neu und in der Sitemap. Ein Indexierungsantrag beschleunigt es.

## Rückfallplan

Der letzte Stand vor diesen Änderungen ist `014d5b25`. Rollback in Vercel über
"Promote to Production" auf dem vorherigen Deployment, oder per Git:

```
git revert --no-commit 014d5b25..83c95b77 && git commit
```

Die vier Integritätsfixes würden dabei mitverschwinden. Wenn nur die neue
Startseite zurücksoll, sind das die Commits `93e1e451` und `83c95b77`.

## Noch nicht erledigt

Aus dem Auftrag offen: restliche Entschlackung der Startseite auf sechs
Abschnitte, eigene Leistungsseiten, Befund D-05 (sichtbares HTML statt
verstecktem Prerender-Markup), Fallstudieninhalte, Tracking-Events,
Performance-Basislinie. Siehe `docs/STATUS.md`.
