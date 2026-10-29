import type { site as En } from "../en/site";

export const site: typeof En = {
  nav: {
    home: "DEEV, zurück zur Startseite",
    services: "Leistungen",
    work: "Referenzen",
    pricing: "Preise",
    journal: "Blog",
    whyDeev: "Warum Deev",
    about: "Über uns",
    workshops: "Workshops",
    funding: "KMU-Förderung",
    contact: "Kontakt",
    cta: "Kostenloses Erstgespräch",
    call: "Anrufen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    toLight: "Zum hellen Modus wechseln",
    toDark: "Zum dunklen Modus wechseln",
    language: "Sprache",
    languageOf: (name: string) => `Zu ${name} wechseln`,
    mainNav: "Hauptnavigation",
  },

  /** Accessibility labels (WCAG 2.2 AA): skip link, pause controls. */
  a11y: {
    skip: "Zum Inhalt springen",
    pauseLogos: "Kundenlogos anhalten",
    playLogos: "Kundenlogos abspielen",
    pauseVideo: "Hintergrundvideo anhalten",
    playVideo: "Hintergrundvideo abspielen",
    pauseFilm: "Animation anhalten",
    playFilm: "Animation abspielen",
    newTab: "(öffnet in einem neuen Tab)",
    pauseMotion: "Bewegung anhalten",
    playMotion: "Bewegung abspielen",
    motionLabel: "Animationen",
    requiredNote: "Mit * markierte Felder sind Pflichtfelder.",
  },

  footer: {
    blurb:
      "Software- und KI-Entwicklung aus Luxemburg. Wir bauen die Systeme, auf denen Ihr Unternehmen läuft, und bleiben nach dem Start verantwortlich.",
    certified: "Zertifiziertes Label",
    certifiedNote: "In Luxemburg entworfen und entwickelt.",
    services: "Leistungen",
    company: "Unternehmen",
    legal: "Rechtliches",
    links: {
      grant: "SME Packages",
      webApps: "Individualsoftware",
      aiAgents: "KI und Daten",
      ecommerce: "Websites, auf Einladung",
      marketingSites: "Marketing",
      portfolio: "Referenzen",
      terms: "Rechtliche Hinweise",
      privacy: "Datenschutzerklärung",
      cookies: "Cookie-Richtlinie",
      cookieSettings: "Cookie-Einstellungen",
    },
    rights: (year: number) => `© ${year} Deev / Lux VR States Sàrl-s. Alle Rechte vorbehalten.`,
    madeIn: "Mit Präzision in Luxemburg entwickelt",
  },

  /** The certification mark's accessible name. */
  madeInLabel: "Made in Luxembourg, zertifiziertes Label",

  /** Der schwebende WhatsApp-Button. */
  whatsapp: {
    label: "Auf WhatsApp schreiben",
    tooltip: "Fragen? Schreiben Sie uns",
    message: "Hallo Deev, ich habe eine Frage zu",
    dismiss: "Ausblenden",
  },

  mega: {
    toggle: (label: string) => `Menü ${label} öffnen`,
    close: "Menü schließen",
    columns: { build: "Bauen", grow: "Wachsen", studio: "Das Studio" },
    items: {
      "what-we-build": { label: "Was wir bauen", desc: "Websites, Plattformen, Onlineshops und KI-Produkte" },
      "how-it-runs": { label: "Wie es läuft", desc: "Interface, Intelligenz und Infrastruktur in der EU" },
      "pricing": { label: "Preise", desc: "Projekt konfigurieren und den Preis live mitlaufen sehen" },
      "marketing": { label: "Marketing", desc: "Ads, SEO und die Messung, die beides belegt" },
      "ai": { label: "KI-Workshops", desc: "Wo KI sich rechnet, beziffert aus Ihren eigenen Mengen" },
      "billovio": { label: "Billovio", desc: "Unser Produkt: ein Angebot aus einem einzigen Satz" },
      "why-it-works": { label: "Warum es funktioniert", desc: "Planbare Anfragen und messbare Ergebnisse" },
      "why-deev": { label: "Warum Deev", desc: "Wie wir arbeiten und wofür wir geradestehen" },
      "about": { label: "Mit wem Sie arbeiten", desc: "Zwei Gründer, beide an Ihrem Projekt" },
    },
    feature: {
      badge: "Staatliche Förderung",
      title: "70% vom Staat gefördert",
      body: "Luxemburger KMU erhalten 70% eines förderfähigen Digital- oder KI-Projekts. Sehen Sie, was Ihres tatsächlich kosten würde.",
      cta: "Nettopreis ansehen",
    },
    work: { browse: "Stöbern", all: "Alle Referenzen", recent: "Projekte, die wir gern zeigen" },
    journal: { browse: "Themen", all: "Blog lesen", latest: "Neueste Artikel" },
  },

  deck: {
    prev: (label: string) => `${label}: zurück`,
    next: (label: string) => `${label}: weiter`,
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
