# Plan und Auditdelta

Audit: `DEEV_Website_Audit_2026-09-16.md`, Basis Commit `014d5b25`.
Das ist der aktuelle HEAD des Feature-Branches, das Audit ist also nicht veraltet.

## Auditdelta: P0 gegen den heutigen Code geprüft

| ID | Status heute | Beleg |
|---|---|---|
| D-01 | **bestätigt** | `ProjectBuilder.tsx:1168` `await sendLeadEmail({...})` ohne Auswertung, `:1185` `setStep(4)` unabhängig vom Ergebnis. `Contact.tsx:70` wertet denselben Rückgabewert korrekt aus. |
| D-02 | **bestätigt** | `api/lead.ts` `FROM_EMAIL = "Deev Website <onboarding@resend.dev>"`. Kontoseite nicht prüfbar. |
| D-03 | **bestätigt, schwerer als beschrieben** | `home.ts:151` EN „capped at €25,000 of grant per project", DE `:149` „gedeckelt bei 25.000 € Zuschuss", FR `:149` „plafonné à 25 000 € d'aide". Der Zuschuss ist auf 17.500 € gedeckelt; 25.000 € ist die Projektobergrenze. Zusätzlich dreht „SMEs cover 70%" die Rollen um. |
| D-04 | **bestätigt, reproduziert** | `reproduce_grant.mjs`: Intervall 2200–3800 liefert `subsidyMin 1540`, `netMin 660`. 2200 € liegt unter der Mindestgrenze und ist nicht förderfähig. |
| D-05 | **bestätigt** | `prerender-routes.mjs` schreibt den Body mit `content-visibility:hidden`, `index.html` legt einen opaken Vollbildloader darüber, `main.tsx` nutzt `createRoot`. Von mir selbst so gebaut; die Kritik ist berechtigt. |

## Reihenfolge

- **B1** D-03 Förderaussagen korrigieren, drei Sprachen, eine geprüfte Quelle.
- **B2** D-04 Intervalllogik: keine Förderung für nicht förderfähige Endpunkte.
- **B3** D-01 Lead-Zustände trennen, Fehler sichtbar, Doppelsendung verhindern.
- **B4** D-07 serverseitige Validierung, Größenlimit, Honeypot, Rate-Limit.
- **B5** Regressionstests (vitest, bisher kein Testsetup im Projekt).
- **C** Gate A: Header, Hero, Referenzen, Desktop und Mobile. Einmal Freigabe.
- **D–F** Homepage-Struktur, `/project`, Leistungsseiten, D-05 Rendering, SEO, QA.

## Offene Blocker für den Betreiber

- **D-02** braucht eine verifizierte Absenderdomain im Resend-Konto. DNS-Arbeit und Kontozugriff liegen nicht bei mir. Kein Testversand ohne Freigabe.
- Kein Merge nach `main` und kein Deploy ohne Gate B.
