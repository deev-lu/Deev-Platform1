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
    previewNotice:
      "Beim Laden der Live-Vorschau wird die Website des Kunden in diese Seite eingebettet. Ihr Browser verbindet sich unmittelbar mit ihr, sodass Daten — darunter Ihre IP-Adresse — an deren Betreiber und an die dort eingesetzten Dienste übertragen werden können.",
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
        title: "KI & Daten",
        line: "Individuelle RAG-Systeme, KI-Agenten und Datenanalyse, gebaut auf Ihren eigenen Daten und gemacht für den Produktivbetrieb.",
        cue: "Wir wollen KI, die mit unseren Daten arbeitet, keine Demo.",
        caps: ["Individuelle RAG", "KI-Agenten", "Datenanalyse", "Prognosen"],
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
      eyebrow: "KI & Daten",
      title: "KI-Systeme auf Ihren Daten, gebaut für den Produktivbetrieb.",
      lead: "Individuelle RAG-Systeme, KI-Agenten und Datenanalyse für Organisationen, die mehr wollen als einen Chatbot. Wir konzentrieren uns auf substanzielle Projekte, die produktiv laufen, auf Ihren eigenen Daten, über Jahre. Und wir sagen trotzdem, wo sich KI nicht lohnt.",
      problems: [
        "Das Wissen steckt in Tausenden Dokumenten, und die richtige Antwort zu finden dauert Stunden.",
        "Jahrelang gesammelte Daten und trotzdem keine verlässliche Antwort auf einfache Geschäftsfragen.",
        "Fertigen KI-Werkzeugen können wir weder unsere Daten noch unsere Abläufe anvertrauen.",
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
        "Über die SME Packages Digital und AI erstattet der Staat Luxemburger KMU 70 % der förderfähigen Kosten, höchstens 17.500 € pro Projekt. Sagen Sie es uns, dann schneiden wir das Projekt auf das Programm zu.",
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
      callback: "Lieber zurückrufen statt per E-Mail antworten",
      submit: "Nachricht senden",
      submitting: "Wird gesendet…",
      consent: "Wir verwenden Ihre Angaben, um Ihre Anfrage zu bearbeiten und Sie hierzu zu kontaktieren. Dafür setzen wir Dienstleister für Websitebetrieb und E-Mail-Verarbeitung ein. Mit Ihrer Nachricht erhalten wir auch die Seite, von der aus Sie sie senden, und, falls Sie über einen Kampagnenlink gekommen sind, den Namen der Kampagne.",
      consentLink: "Mehr dazu in unserer Datenschutzerklärung.",
      errorLead: "Das Formular konnte gerade nicht gesendet werden.",
      errorAction: "Stattdessen per E-Mail senden",
    },
    // Same order in every language: Contact.tsx maps ?interest=<key> by position.
    interests: [
      "Allgemeine Anfrage",
      "Kostenloses Erstgespräch",
      "Workshop / Beratung",
      "KI-Projekt / Automatisierung",
      "Individualsoftware / Webanwendung",
      "SME Package / Förderung",
      "Neue Website",
      "Lead-Kampagnen / Marketing",
      "Cybersecurity / NIS2-Awareness",
      "Sonstiges",
    ],
    success: {
      title: "Nachricht erhalten.",
      body: (firstName: string) =>
        `Danke${firstName ? `, ${firstName}` : ""}. Wir haben Ihre Anfrage aufgenommen und melden uns meist innerhalb eines Werktags.`,
      cta: "Zurück zur Startseite",
    },
  },

  /** /workshops: the workshop as its own page and the way into most projects.
   *  Only what home.workshops, home.ai and the workshop article already claim;
   *  no price and no duration, those belong in the conversation. */
  workshopsPage: {
    formatsLabel: "Drei Wege hinein",
    methodLabel: "Wie der Workshop abläuft",
    methodTitle: "Von dort, wo die Arbeit stockt. Zu einem Plan mit Daten.",
    deliverablesLabel: "Was Sie mitnehmen",
    deliverablesTitle: "Ein Dokument für den Aufsichtsrat.",
    deliverables: ["Jeder Engpass identifiziert und einzeln beziffert", "Eine Architektur über den bestehenden Systemen", "Ein Fahrplan in Phasen mit dem, was je Phase ausgeliefert wird", "Förderfähige Kosten und Förderweg je Phase kartiert"],
    honest: "Wenn das Ergebnis lautet, dass KI sich für einen bestimmten Prozess nicht rechnet, steht auch das im Dokument, und es ist dasselbe Geld wert wie ein Ja.",
    faqLabel: "Fragen",
    faq: [
      { q: "Wer sollte dabei sein?", a: "Die Menschen, die die Prozesse tragen, nicht nur die Geschäftsleitung. Wer einen Ablauf täglich lebt, weiß, um welchen Schritt alle still herumarbeiten, und das ist selten der aus dem Organigramm." },
      { q: "Wo findet er statt?", a: "Vor Ort, mit Ihrem operativen Team. Wir gehen jeden Ablauf mit der Person durch, die ihn lebt, und halten fest, wo er stockt." },
      { q: "Und wenn sich KI für einen Prozess nicht rechnet?", a: "Dann sagt das Konzept es. Dieses Ergebnis steht im Dokument und ist dasselbe Geld wert wie ein Ja." },
      { q: "Kann er gefördert werden?", a: "Er kann über das SME Package AI gefördert werden: Der Staat erstattet 70 % der förderfähigen Kosten bei einem Projekt von 3.000 bis 25.000 € netto. Arbeit, die vor der Bewilligung beginnt, ist nicht gedeckt, deshalb kommt die Voranalyse zuerst." },
      { q: "Was passiert nach dem Workshop?", a: "Wenn Sie weitermachen, wird der Fahrplan zum Projekt. Jede Phase hat eigenen Umfang, eigenes Budget und eigenes Ergebnis, und die erste endet mit etwas, das in Produktion läuft." },
    ],
    formLabel: "Workshop anfragen",
    formTitle: "Sagen Sie uns, wo Ihre Arbeit stockt.",
    formLead: "Wir antworten innerhalb eines Werktags, um einen Termin und die Teilnehmenden abzustimmen.",
    processes: "Welche Prozesse kosten Sie am meisten Zeit?",
    processesPlaceholder: "Zum Beispiel Eingangsrechnungen, Lieferanten-E-Mails, Vertragsprüfungen",
    submit: "Workshop anfragen",
    bookingCta: "Oder direkt einen Termin wählen",
    successTitle: "Anfrage erhalten.",
    successBody: "Danke. Wir melden uns innerhalb eines Werktags, um einen Termin abzustimmen.",
  },

  /** /about: the team and how we work. Names and roles are facts; the
   *  principles repeat what the rest of the site already promises. */
  aboutPage: {
    eyebrow: "Über uns",
    title: "Die Menschen hinter DEEV. Und wie wir arbeiten.",
    teamLabel: "Das Team",
    teamTitle: "Die Menschen, mit denen Sie wirklich arbeiten.",
    roles: { founder: "Mitgründer", securityData: "Cybersecurity und Daten" },
    principlesLabel: "Wie wir arbeiten",
    principlesTitle: "Fünf Dinge, an die wir uns halten.",
    principles: [
      { title: "Wer plant, baut auch.", copy: "Keine Übergabe zwischen Gespräch und Umsetzung: Wer Ihr Projekt plant, baut es auch." },
      { title: "Design und Entwicklung im Haus.", copy: "Beides sitzt im selben Team in Luxemburg, sodass das System, das Sie gezeigt bekommen, auch das System ist, das gebaut wird." },
      { title: "Ihre Daten bleiben, wo sie müssen.", copy: "Hosting in der EU oder auf Ihrer eigenen Infrastruktur, wenn die Daten sie nicht verlassen dürfen. Zugriffsrechte gelten bis in jede Antwort." },
      { title: "Rechnung vor Technik.", copy: "Jeder Engpass wird aus Ihren eigenen Mengen beziffert, bevor etwas vorgeschlagen wird. Rechnet sich KI für einen Prozess nicht, sagen wir das." },
      { title: "Verantwortlich nach dem Start.", copy: "Monitoring, Wartung und ein Team, das verantwortlich bleibt, wenn das System live ist." },
    ],
    factsLabel: "Das Unternehmen",
    phone: "Telefon",
    email: "E-Mail",
  },

  /** /accessibility: the accessibility statement (WCAG 2.1 AA / EN 301 549).
   *  Self-assessment; keep it true when the site changes. */
  accessibilityPage: {
    eyebrow: "Barrierefreiheit",
    title: "Erklärung zur Barrierefreiheit",
    intro: "www.deev.lu soll für alle funktionieren, auch für Menschen, die einen Screenreader, nur die Tastatur, eine Bildschirmlupe oder Sprachsteuerung nutzen.",
    standardTitle: "Der Standard, dem wir folgen",
    standard: "Wir gestalten und prüfen diese Website nach den Web Content Accessibility Guidelines (WCAG) 2.1, Stufe AA. Sie sind die Web-Anforderungen der europäischen Norm EN 301 549, auf die der European Accessibility Act verweist.",
    statusTitle: "Wie weit wir ihn erfüllen",
    status: "Teilweise konform. Nach unserer eigenen Bewertung erfüllen die Seiten, die wir bauen, WCAG 2.1 Stufe AA; die Ausnahmen betreffen Inhalte Dritter und stehen unten.",
    measuresTitle: "Was wir getan haben",
    measures: ["Jede Seitenart mit der Prüf-Engine axe-core gegen WCAG 2.1 A und AA getestet, im hellen und im dunklen Design, in Desktop- und Telefonbreite.", "Textkontrast von mindestens 4,5:1 überall und ein deutlicher, sichtbarer Fokusrahmen für die Tastatur.", "Ein Link „Zum Inhalt springen“ auf jeder Seite, und jedes Bedienelement mit der Tastatur erreichbar und nutzbar.", "Ein Schalter „Bewegung anhalten“ im Kopfbereich und im Footer, der das Hintergrundvideo und alle Animationen stoppt und die Wahl speichert. Die Einstellung „Bewegung reduzieren“ Ihres Geräts wird ebenfalls berücksichtigt.", "Die Seiten passen sich bis 320 Pixel Breite ohne seitliches Scrollen an, sodass Text bis 400 % vergrößert werden kann.", "Jedes Formularfeld hat eine sichtbare Beschriftung, und Fehler werden Screenreadern angesagt.", "Jede Seite gibt ihre Sprache an (Englisch, Französisch oder Deutsch), und Bilder haben eine Textalternative oder sind als dekorativ gekennzeichnet."],
    limitsTitle: "Bekannte Einschränkungen",
    limits: ["Das Hintergrundvideo auf der Startseite und die Videos im Bereich „In Bewegung“ werden von YouTube abgespielt. Die Barrierefreiheit des YouTube-Players liegt nicht in unserer Hand. Das Hintergrundvideo trägt keine Information und lässt sich anhalten.", "Referenzen zeigen Bildschirmfotos von Kundenwebsites. Die verlinkten Websites werden von ihren Inhabern betrieben, nicht von uns.", "Die animierten Beispiele (der KI-Film, das Lesen eines Dokuments und der Agentenlauf) sind Illustrationen. Was sie zeigen, steht auch als Text auf derselben Seite."],
    feedbackTitle: "Ein Problem melden",
    feedback: "Wenn Ihnen etwas auf dieser Website schwer fällt oder nicht gelingt, sagen Sie es uns: Wir helfen Ihnen und beheben es, wo wir können. Wir antworten innerhalb eines Werktags, wie bei jeder Anfrage.",
    emailLabel: "E-Mail",
    phoneLabel: "Telefon",
    preparedTitle: "Zu dieser Erklärung",
    prepared: "Erstellt am 28. Oktober 2026 auf Grundlage einer Selbstbewertung durch DEEV und überprüft, wann immer sich die Website wesentlich ändert.",
  },
};
