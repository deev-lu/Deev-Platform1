import type { site as En } from "../en/site";

export const site: typeof En = {
  nav: {
    services: "Leistungen",
    work: "Referenzen",
    pricing: "Preise",
    whyDeev: "Warum Deev",
    about: "Über uns",
    contact: "Kontakt",
    cta: "Angebot anfordern",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    toLight: "Zum hellen Modus wechseln",
    toDark: "Zum dunklen Modus wechseln",
    language: "Sprache",
    languageOf: (name: string) => `Zu ${name} wechseln`,
  },

  footer: {
    blurb:
      "Ein unabhängiges, inhabergeführtes Studio in Luxemburg. Wir bauen digitale Systeme, die Ihr Unternehmen unübersehbar machen.",
    certified: "Zertifiziertes Label",
    certifiedNote: "In Luxemburg entworfen und entwickelt.",
    services: "Leistungen",
    company: "Unternehmen",
    legal: "Rechtliches",
    links: {
      webApps: "Webanwendungen",
      aiAgents: "KI-Agenten",
      ecommerce: "E-Commerce-Systeme",
      marketingSites: "Marketing-Websites",
      portfolio: "Referenzen",
      terms: "AGB und Impressum",
      privacy: "Datenschutzerklärung",
      cookies: "Cookie-Richtlinie",
      cookieSettings: "Cookie-Einstellungen",
    },
    rights: (year: number) => `© ${year} Deev / Lux VR States Sàrl-s. Alle Rechte vorbehalten.`,
    madeIn: "Mit Präzision in Luxemburg entwickelt",
  },

  notFound: {
    eyebrow: "404 / Seite nicht gefunden",
    title: "Diese Seite gibt es nicht.",
    body:
      "Der Link ist veraltet oder enthält einen Tippfehler. Alles, was wir veröffentlicht haben, ist einen Klick von der Startseite entfernt.",
    cta: "Zurück zur Startseite",
    workLabel: "Referenzen",
  },
};
