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
    chapters: { context: "Ausgangslage", challenge: "Die Aufgabe", approach: "Der Ansatz", execution: "Die Umsetzung", outcome: "Das Ergebnis" },
    services: "Leistungen",
    specOnly: "Für dieses Projekt sind die Eckdaten und die ausgelieferte Seite dokumentiert, die ausführliche Fallstudie noch nicht. Wir schreiben sie erst, wenn Aufgabe, Umfang und Ergebnis mit dem Kunden abgestimmt sind.",
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

  servicePages: {
    websites: {
      eyebrow: "Websites",
      title: "Ein Auftritt, der Ihr Angebot verständlich macht und den nächsten Schritt einfach hält.",
      lead: "Unternehmenswebsites, Relaunch und Onlineshops. Gebaut, um gefunden, verstanden und genutzt zu werden.",
      problems: [
        "Besucher kommen an und wissen danach immer noch nicht, was Sie eigentlich machen.",
        "Der Auftritt sieht ordentlich aus, bringt aber keine Anfragen.",
        "Niemand kann einen Preis oder einen Text ändern, ohne eine Agentur anzurufen.",
      ],
    },
    ai: {
      eyebrow: "KI und Automatisierung",
      title: "Weniger manuelle Routine. Mit Lösungen, die zu Ihren Abläufen passen.",
      lead: "Wir schauen zuerst, wohin die Zeit tatsächlich geht. Nicht jedes Unternehmen braucht KI, und das sagen wir auch.",
      problems: [
        "Dieselben Anfragen werden jede Woche von Hand beantwortet.",
        "Dokumente werden von einem Menschen gelesen, sortiert und abgetippt.",
        "Daten liegen in drei Systemen und werden dazwischen kopiert.",
      ],
    },
    software: {
      eyebrow: "Individuelle Software",
      title: "Wenn Standardtools nicht mehr zu Ihrem Betrieb passen.",
      lead: "Webanwendungen, Portale, Schnittstellen und die Geschäftslogik dahinter.",
      problems: [
        "Eine Tabelle ist unbemerkt zum betriebskritischen System geworden.",
        "Eine Standardsoftware erzwingt einen Ablauf, der nicht Ihrer ist.",
        "Zwei Systeme müssten miteinander reden, und niemand hat sie verbunden.",
      ],
    },
    problemsLabel: "Kommt Ihnen das bekannt vor?",
    workLabel: "Passende Referenzen",
    cta: "Ein ähnliches Projekt besprechen",
  },

  project: {
    title: "Was würde Ihr Projekt kosten?",
    lead: "Konfigurieren Sie ein Projekt und sehen Sie eine unverbindliche Spanne. Das ist eine Orientierung, kein Angebot, und es wird keine E-Mail-Adresse verlangt.",
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
