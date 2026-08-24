import type { consent as En } from "../en/consent";

export const consent: typeof En = {
  banner: {
    eyebrow: "Cookies",
    title: "Ihre Wahl, dokumentiert.",
    body: "Wir setzen, was die Website zum Funktionieren braucht. Mit Ihrer Einwilligung messen wir zusätzlich, wie sie genutzt wird, um sie zu verbessern. Sie können das jederzeit ändern oder widerrufen.",
    policyLink: "Cookie- und Datenschutzrichtlinie",
    reject: "Nicht notwendige ablehnen",
    accept: "Alle akzeptieren",
    customise: "Anpassen",
  },
  prefs: {
    eyebrow: "Cookie-Einstellungen",
    title: "Was Sie erlauben, Kategorie für Kategorie.",
    close: "Cookie-Einstellungen schließen",
    necessary: {
      title: "Unbedingt erforderlich",
      copy: "Notwendig, damit die Website funktioniert und sich genau diese Auswahl merkt. Sie lassen sich nicht abschalten und werden nie zur Profilbildung verwendet.",
    },
    analytics: {
      title: "Statistik",
      copy: "Google Analytics 4, um Besuche zu zählen und zu sehen, welche Seiten gelesen werden. Bis Sie zustimmen, läuft das Tag im Zustand der verweigerten Einwilligung: keine Cookies, keine Kennung, nur ein aggregiertes Signal.",
    },
    always: "Immer aktiv",
    table: { name: "Cookie", provider: "Anbieter", purpose: "Zweck", life: "Speicherdauer" },
    recordLabel: "Ihr Einwilligungsnachweis",
    given: "Erteilt am",
    reference: "Referenz",
    expires: "Läuft ab am",
    none: "Noch nichts erfasst. Die Statistik bleibt abgelehnt, bis Sie sich entscheiden.",
    version: (v: number) =>
      `Richtlinienversion ${v}. Wir fragen nach zwölf Monaten erneut, oder früher, wenn sich die Richtlinie ändert. Alle Einzelheiten in der`,
    policyLink: "Cookie- und Datenschutzrichtlinie",
    save: "Auswahl speichern",
    withdraw: "Widerrufen",
  },
  cookies: {
    consent: "Speichert Ihre Cookie-Auswahl und deren Nachweis (Kennung und Datum).",
    theme: "Merkt sich, ob Sie die helle oder die dunkle Darstellung gewählt haben.",
    ga: "Unterscheidet einen Besucher vom anderen, damit Besuche gezählt werden können.",
    gaProperty: "Hält den Zustand des aktuellen Besuchs für diese Property fest.",
    months12: "12 Monate",
    untilCleared: "Bis zum Löschen",
    years2: "2 Jahre",
  },
};
