import type { pages as En } from "../en/pages";

export const pages: typeof En = {
  work: {
    eyebrow: "Referenzen",
    title: "Eine Auswahl unserer Arbeit.",
    lead: "Websites, Onlineshops und Webanwendungen, gebaut in Luxemburg für Unternehmen in ganz Europa.",
    filters: {
      all: "Alle",
      website: "Websites",
      webapp: "Webanwendungen und Software",
      ecommerce: "E-Commerce",
      ai: "KI und Automatisierung",
    },
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
    deliverables: "Was wir geliefert haben",
    technical: "Unter der Oberfläche",
    ownProduct: "Eigenes Produkt",
    snapshot: { industry: "Branche", audience: "Für wen", location: "Ort" },
    livePreview: "Live",
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

  servicesNav: {
    eyebrow: "Leistungen",
    title: "Was muss bei Ihnen weitergehen?",
    lead: "Websites, KI, individuelle Software und Wachstum. Wählen Sie das Problem, das gelöst werden soll.",
    bestFor: "Passt, wenn",
    includes: "Enthält unter anderem",
    cta: (name: string) => `${name} ansehen`,
    paths: {
      websites: {
        title: "Websites und E-Commerce",
        line: "Auftritte und Onlineshops, die aus Aufmerksamkeit einen nächsten Schritt machen.",
        cue: "Ich brauche eine neue Website oder einen Shop.",
        caps: ["Websites", "E-Commerce", "CMS und Integrationen", "SEO und Performance"],
      },
      ai: {
        title: "KI und Automatisierung",
        line: "Agenten, Assistenten und Abläufe, gebaut um die Arbeit herum, die Ihr Team wirklich Zeit kostet.",
        cue: "Dieselbe Routine frisst jede Woche Stunden.",
        caps: ["KI-Agenten", "Prozessautomatisierung", "Assistenten", "Systemanbindung"],
      },
      software: {
        title: "Individuelle Software",
        line: "Plattformen, Portale und Webanwendungen, entworfen um Ihren Betrieb herum.",
        cue: "Standardsoftware passt nicht mehr zu uns.",
        caps: ["Webanwendungen", "Kundenportale", "Interne Plattformen", "Schnittstellen"],
      },
      marketing: {
        title: "Marketing und Wachstum",
        line: "Bezahlte Werbung, SEO und Conversion, ausgelegt auf qualifizierte Nachfrage.",
        cue: "Wir brauchen mehr passende Kunden.",
        caps: ["Bezahlte Werbung", "SEO", "Conversion", "Analytik"],
      },
    },
  },
  servicesTrust: {
    title: "Von Anfang an richtig gebaut.",
    points: [
      { title: "Erst verstehen, dann bauen", copy: "Wir fangen bei Ihrem Geschäft an, nicht beim Entwurf." },
      { title: "Design und Entwicklung im Haus", copy: "Kein Outsourcing, keine Kette, an deren Ende niemand haftet." },
      { title: "Messung ist eingebaut", copy: "Sie sehen, was die Arbeit einbringt, statt es glauben zu müssen." },
      { title: "Auch nach dem Launch da", copy: "Fehler im vereinbarten Umfang beheben wir. Für Späteres gibt es Wartung oder Aufwand." },
    ],
  },
  servicesCta: {
    title: "Nicht sicher, welcher Weg passt?",
    lead: "Sagen Sie uns, was Sie erreichen wollen. Wir klären mit Ihnen, was dafür tatsächlich gebaut werden muss.",
    primary: "Gespräch vereinbaren",
    secondary: "Projekt konfigurieren",
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
    marketing: {
      eyebrow: "Marketing und Wachstum",
      title: "Nachfrage, die zu Ihrem Angebot passt, statt Reichweite.",
      lead: "Bezahlte Werbung, SEO und die Messung dahinter. Wir fahren die Kampagnen, die die Systeme speisen, die wir bauen.",
      problems: [
        "Die Website ist gut, aber es kommt niemand.",
        "Es kommen Anfragen, aber die falschen.",
        "Niemand kann sagen, welcher Kanal die Kunden bringt.",
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
      responseValue: "Meist innerhalb eines Werktags",
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
      consent: "Wir verwenden Ihre Angaben, um Ihre Anfrage zu bearbeiten und Sie hierzu zu kontaktieren. Dafür setzen wir Dienstleister für Websitebetrieb und E-Mail-Verarbeitung ein.",
      consentLink: "Mehr dazu in unserer Datenschutzerklärung.",
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
        `Danke${firstName ? `, ${firstName}` : ""}. Wir haben Ihre Anfrage aufgenommen und melden uns meist innerhalb eines Werktags.`,
      cta: "Zurück zur Startseite",
    },
  },
};
