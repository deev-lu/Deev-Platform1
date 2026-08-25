import type { pages as En } from "../en/pages";

export const pages: typeof En = {
  work: {
    eyebrow: "Referenzen",
    title: "Jedes Projekt, das wir ausliefern.",
    lead: "Websites, Onlineshops und Webanwendungen, gebaut in Luxemburg für Unternehmen in ganz Europa.",
    filters: {
      all: "Alles",
      website: "Websites",
      ecommerce: "Onlineshops",
      webapp: "Webanwendungen",
    },
    count: (n: number, filterLabel?: string) =>
      `${n} ${n === 1 ? "Projekt" : "Projekte"}${filterLabel ? ` in ${filterLabel.toLowerCase()}` : ""}`,
  },

  workCase: {
    back: "Alle Referenzen",
    spec: { client: "Kunde", sector: "Branche", type: "Art", year: "Jahr", stack: "Technologien" },
    scope: "Was wir gemacht haben",
    scopeItems: {
      website: "Website",
      onlineStore: "Onlineshop",
      platform: "Web-Plattform",
      branding: "Marken- und visuelle Identität",
    },
    visit: "Zur Live-Website",
    brief: "Die Aufgabe",
    built: "Was wir gebaut haben",
    outcome: "Das Ergebnis",
    next: "Nächstes Projekt",
  },

  /**
   * /services — die Seite, auf die der Menüpunkt "Services" verweist. Die neun
   * Bereiche selbst stammen aus site.mega.items, damit Menü und Seite nicht
   * auseinanderlaufen können.
   */
  services: {
    eyebrow: "Was wir machen",
    title: "Alles, was wir bauen und betreiben.",
    lead:
      "Websites, Plattformen, Onlineshops, KI und das Marketing, das sie füllt. Entwickelt in Luxemburg, zu 70 % gefördert für luxemburgische KMU.",
    cta: {
      title: "Sie wissen nicht, was Sie brauchen?",
      body:
        "Sagen Sie uns, was Sie lösen wollen. Wir sagen Ihnen, was es braucht, was es kostet und was der Staat übernimmt.",
      action: "Sprechen wir darüber",
    },
  },

  contact: {
    badge: "Kontakt aufnehmen",
    title: "Sprechen wir über",
    titleAccent: "Ihr Projekt.",
    lead:
      "Erzählen Sie uns, was Sie bauen. Wir lesen jede Nachricht und antworten persönlich, meist innerhalb eines Werktags.",
    grant: {
      badge: "70% gefördert",
      body:
        "Luxemburger KMU können über die Programme SME Digital und SME AI 70% für Websites, Webanwendungen, KI und begleitendes Marketing zurückerhalten. Sagen Sie uns Bescheid, und wir strukturieren Ihr Projekt so, dass die Förderung maximal ausfällt.",
      cta: "Nettopreis schätzen",
    },
    details: {
      email: "E-Mail",
      whatsapp: "WhatsApp",
      office: "Büro",
      responseTime: "Antwortzeit",
      responseValue: "Innerhalb von 1 Werktag",
    },
    form: {
      name: "Name",
      namePlaceholder: "Ihr Name",
      email: "Geschäftliche E-Mail",
      emailPlaceholder: "sie@unternehmen.com",
      company: "Unternehmen",
      companyPlaceholder: "Name des Unternehmens",
      phone: "Telefon",
      phonePlaceholder: "+352 …",
      interest: "Wobei können wir helfen?",
      message: "Nachricht",
      messagePlaceholder: "Erzählen Sie uns von Ihrem Projekt, Ihren Zielen und Ihrem Zeitrahmen…",
      submit: "Nachricht senden",
      submitting: "Wird gesendet…",
      consent: "Mit dem Absenden erklären Sie sich damit einverstanden, dass wir Sie zu Ihrer Anfrage kontaktieren. Wir geben Ihre Daten niemals weiter.",
      errorLead: "Das Formular konnte gerade nicht gesendet werden.",
      errorAction: "Stattdessen per E-Mail senden",
    },
    interests: [
      "Allgemeine Anfrage",
      "Neue Website",
      "Webanwendung / SaaS-Plattform",
      "KI-Projekt / Automatisierung",
      "Lead-Kampagnen / Marketing",
      "Sonstiges",
    ],
    success: {
      title: "Nachricht erhalten.",
      body: (firstName: string) =>
        `Danke${firstName ? `, ${firstName}` : ""}. Wir haben Ihre Anfrage aufgenommen und melden uns innerhalb eines Werktags.`,
      cta: "Zurück zur Startseite",
    },
  },
};
