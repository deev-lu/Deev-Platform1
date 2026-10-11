import type { home as En } from "../en/home";

export const home: typeof En = {
  hero: {
    eyebrow: "Websites · KI · individuelle Software — Luxemburg",
    title: ["Mehr Anfragen.", "Weniger Routine."],
    lead:
      "Wir entwickeln Websites, KI-Lösungen und individuelle Webanwendungen für Unternehmen in Luxemburg. Mit Fokus auf Kundengewinnung und einfachere Abläufe.",
    ctaPrimary: "Projekt besprechen",
    ctaSecondary: "Budget einschätzen",
    founders: "Direkt mit Sven und Fabio.",
    sampleLabel: "Aktuelle Arbeit",
    positioning: "AI-native digital engineering",
  },

  logos: { label: "Das Vertrauen führender Unternehmen in Luxemburg und darüber hinaus" },

  grant: {
    badge: "Staatliche Förderung",
    title: "Luxemburger KMU: [[70% gefördert]] vom Staat.",
    body:
      "Websites, Webanwendungen und KI-Projekte sind über die Programme SME Digital und SME AI förderfähig: 70% von Investitionen zwischen 3.000 € und 25.000 € (netto), davon bis zu 15% Marketing und 15% Werbebudget.",
    strong: "Programme SME Digital und SME AI",
    cta: "Nettopreis berechnen",
  },

  explore: {
    label: "Wo möchten Sie anfangen?",
    cta: "Ansehen",
    areas: {
      web: { title: "Web", line: "Websites und Onlineshops, die aus Besuchern Anfragen machen." },
      software: { title: "Software", line: "Webanwendungen, Portale und interne Tools, gebaut um Ihren Ablauf." },
      data: { title: "KI & Daten", line: "Individuelle RAG-Systeme, KI-Agenten und Datenanalyse für anspruchsvolle Projekte." },
    },
  },

  intro: {
    kicker: "Software- und KI-Engineering · Luxemburg",
    lines: ["Wir bauen die", "Systeme, auf denen", "Ihr Unternehmen"],
    accent: "läuft.",
    lead: "Individuelle Software, KI und Datenplattformen für Organisationen mit großen Vorhaben. Und für einige wenige: Websites, gestaltet auf dem Niveau der Marke dahinter.",
    primary: "Projekt starten",
    film: "KI bei der Arbeit ansehen",
    specs: ["Entwickelt in Luxemburg", "Hosting in der EU oder bei Ihnen", "Design und Engineering im Haus"],
    visual: {
      illustrative: "Beispiel",
      product: "Billovio · unser eigenes Produkt",
      agent: "Agentenlauf",
      steps: ["E-Mail eingeordnet", "Vertrag C-2041 geprüft", "Antwort entworfen"],
      waiting: "Wartet auf Freigabe",
      rag: "Wissensassistent",
      question: "Kündigungsfrist für Lieferantenverträge?",
      answer: "Drei Monate zum Quartalsende; sechs bei Rahmenverträgen.",
      sources: "3 Quellen",
      forecast: "Auftragseingang · Prognose",
    },
  },

  ticker: ["Individuelle Software", "KI-Agenten", "Individuelle RAG", "Datenplattformen", "Prognosen", "Dokumenten-KI", "Kundenportale", "Markenwebsites"],

  film: {
    eyebrow: "KI bei der Arbeit",
    title: "Sechzehn Sekunden, in denen ein Agent echte Arbeit erledigt.",
    lead: "Eine E-Mail kommt an, ein Dokument wird gelesen, ein Vertrag geprüft, ein Mensch gibt frei, das System wird aktualisiert. Das bauen wir: KI, die in Ihren Abläufen arbeitet, mit Menschen dort, wo es zählt.",
    frame: "DEEV · Agentenlauf · Beispiel",
    live: "Live",
    play: "Abspielen",
    pause: "Pausieren",
    chapters: ["Eingang", "Lesen", "Prüfen", "Handeln"],
    intake: {
      head: "01 · Eingang · 3 neue Nachrichten",
      mails: [
        { subject: "Aktualisierte Preisliste Q4", from: "Musterlieferant Sàrl", tag: "Preisänderung" },
        { subject: "Rechnung 4471", from: "Muster Logistik SA", tag: "Rechnung" },
        { subject: "Vertragsverlängerung", from: "Musterpartner SA", tag: "Vertrag" },
      ],
    },
    read: {
      head: "02 · Lesen · Felder werden ausgelesen",
      docTitle: "Musterlieferant Sàrl",
      docSub: "Preisliste · Q4",
      rows: [
        { doc: "Stückpreis neu", key: "Neuer Preis", value: "42,60 €", conf: "99 %" },
        { doc: "Stückpreis aktuell", key: "Aktuell", value: "40,00 €", conf: "99 %" },
        { doc: "Gültig ab", key: "Gültig ab", value: "01.10.2026", conf: "98 %" },
      ],
    },
    reason: {
      head: "03 · Prüfen · Abgleich mit dem Vertrag",
      lines: [
        "abrufen   Vertrag C-2041 · §7.2 Preisanpassung",
        "vereinbart        +5,0 % pro Jahr",
        "gefordert         +6,5 %",
        "über der Grenze  →  Widerspruch entwerfen, an den Einkauf",
      ],
    },
    act: {
      head: "04 · Handeln · mit einem Menschen im Ablauf",
      requested: "Freigabe angefragt",
      task: "Antwort an Musterlieferant Sàrl mit Verweis auf §7.2",
      approved: "Vom Einkauf freigegeben",
      done: ["Antwort gesendet", "Preistabelle im ERP unverändert", "Jeder Schritt protokolliert"],
    },
  },

  disciplines: {
    eyebrow: "Was wir tun",
    title: "Zuerst Engineering. Design, wo es zählt.",
    core: "Kern",
    invitation: "Auf Einladung",
    software: {
      title: "Individuelle Software",
      copy: "Plattformen, Portale und interne Systeme, gebaut um die Art, wie Ihre Organisation wirklich arbeitet, und so entwickelt, dass sie über Jahre gepflegt werden können.",
      list: ["Webplattformen und SaaS", "Kunden- und Partnerportale", "Interne Tools und Abläufe", "Anbindung an ERP und CRM"],
      cta: "Software ansehen",
    },
    ai: {
      title: "KI und Daten",
      copy: "Individuelle RAG-Systeme, KI-Agenten und Datenplattformen, die produktiv auf Ihren eigenen Daten laufen, mit Evaluation und Governance vom ersten Tag an.",
      list: ["Individuelle RAG und Wissensassistenten", "KI-Agenten und Prozessautomatisierung", "Datenplattformen und Datenstrecken", "Analyse und Prognosen"],
      cta: "KI und Daten ansehen",
    },
    design: {
      title: "Design",
      copy: "Websites und digitale Auftritte für eine begrenzte Zahl von Kunden, gestaltet auf dem Niveau der Marke dahinter.",
      list: ["Markenwebsites", "Digitale Identität", "Premium-E-Commerce"],
      cta: "Designauftrag anfragen",
    },
  },

  engage: {
    eyebrow: "Wie Projekte laufen",
    title: "Große Vorhaben. In Phasen geliefert.",
    lead: "Große Systeme entstehen nicht in einem Sprung. Jede Phase hat ihren eigenen Umfang, ihr eigenes Budget und ihr eigenes Ergebnis, und die erste endet mit etwas, das produktiv läuft.",
    phase: "Phase",
    phases: [
      { title: "Discovery und Architektur", copy: "Vor Ort mit den Menschen, die die Prozesse führen. Engpässe beziffert, Architektur und Fahrplan vereinbart." },
      { title: "Erste Version im Betrieb", copy: "Ein Ablauf, echte Nutzer, echte Daten, gemessen am Ausgangspunkt." },
      { title: "Ausbauen", copy: "Weitere Module und Abläufe auf demselben Fundament, jedes günstiger als das vorige." },
      { title: "Betreiben und weiterentwickeln", copy: "Monitoring, Wartung und ein Team, das nach dem Start verantwortlich bleibt." },
    ],
  },

  closing: {
    title: "Erzählen Sie uns, was Sie bauen.",
    lead: "Ein erstes Gespräch kostet nichts und verpflichtet zu nichts. Wenn wir nicht das richtige Team dafür sind, sagen wir es.",
  },

  paths: {
    eyebrow: "Was wir machen",
    title: "Drei Wege, wie wir arbeiten.",
    lead: "Unterschiedliche Probleme brauchen unterschiedliche Arbeit. Das sind nicht drei Namen für dasselbe Projekt.",
    items: {
      websites: {
        title: "Websites",
        problem: "Unser Auftritt erklärt und verkauft unser Angebot nicht gut genug.",
        body: "Ein Auftritt, der Ihr Angebot verständlich macht und den nächsten Schritt einfach hält. Unternehmenswebsites, Relaunch, Onlineshops.",
        cta: "Websites",
      },
      ai: {
        title: "KI & Daten",
        problem: "Unser Wissen und unsere Daten sollten für uns arbeiten, und das tun sie nicht.",
        body: "Individuelle RAG-Systeme über Ihren Dokumenten, KI-Agenten, die ganze Abläufe übernehmen, und Datenanalyse, auf die man Entscheidungen stützen kann. Gebaut für den Betrieb, nicht für eine Demo.",
        cta: "KI & Daten",
      },
      software: {
        title: "Individuelle Software",
        problem: "Standardtools bilden unsere Abläufe nicht mehr passend ab.",
        body: "Webanwendungen, Portale, Schnittstellen und die Geschäftslogik dahinter, gebaut um Ihren Ablauf herum statt gegen ihn.",
        cta: "Individuelle Software",
      },
    },
  },

  budget: {
    eyebrow: "Budget",
    title: "Was würde das kosten?",
    lead: "Konfigurieren Sie ein Projekt und sehen Sie in etwa einer Minute eine unverbindliche Spanne. Ohne E-Mail-Adresse, ohne Verpflichtung.",
    cta: "Budget einschätzen",
    grantTitle: "SME Packages Luxemburg",
    grantBody: "Der Staat erstattet 70 % der förderfähigen Kosten bei einem Projekt von 3.000 bis 25.000 € netto, also höchstens 17.500 € pro Package. Über die Förderfähigkeit entscheidet die Voranalyse.",
    grantCta: "Wie die Förderung funktioniert",
  },

  selected: {
    eyebrow: "Referenzen",
    title: "Projekte, die wir ausgeliefert haben.",
    lead: () => "Eine Auswahl unserer Arbeit. Jedes Projekt ist online, und jedes verlinkt auf das, was wir tatsächlich geliefert haben.",
    all: "Alle Referenzen ansehen",
    view: "Fallstudie ansehen",
  },

  work: {
    scrollbar: "Durch die Projekte scrollen",
    eyebrow: "Referenzen",
    title: "Projekte, auf die wir stolz sind.",
    lead:
      "Von Luxusreisen bis zu handwerklichen Spirituosen: jedes Projekt entsteht mit demselben Anspruch an Handwerk, Performance und Ergebnis.",
    counter: (n: number) => `${n} Projekte in ganz Europa umgesetzt`,
    seeProject: "Projekt ansehen",
    seeAll: "Alle Referenzen ansehen",
    prev: "Vorheriges Projekt",
    next: "Nächstes Projekt",
  },

  benefits: {
    eyebrow: "Warum es funktioniert",
    title: "Digitale Systeme, gebaut für nachhaltiges Wachstum",
    lead:
      "Wir bauen das ganze System, nicht ein einzelnes Teil davon: die Website, das Produkt dahinter und die Kampagnen, die sie speisen. Klare Struktur, Entscheidungen auf Datenbasis, und Arbeit, deren kommerzielle Wirkung sich tatsächlich messen lässt.",
    items: [
      {
        title: "Planbare Anfragen",
        copy: "Der Traffic wird auf ein einziges Ziel gelenkt und der Weg dorthin ist gestaltet, damit qualifizierte Anfragen regelmäßig eintreffen statt zufällig.",
      },
      {
        title: "Messbare Ergebnisse",
        copy: "Jedes Projekt geht mit fest verdrahteter Analytik live, damit Sie sehen, was die Arbeit einbringt, statt es glauben zu müssen.",
      },
      {
        title: "KI dort, wo sie sich lohnt",
        copy: "Automatisierung für die Schritte, die Sie wirklich Zeit kosten, nicht angeflanscht, weil das Wort sich gut verkauft.",
      },
      {
        title: "Volle Transparenz",
        copy: "Sie sprechen mit den Menschen, die Ihr Projekt entwerfen und bauen, und wissen jederzeit, woran gerade gearbeitet wird und warum.",
      },
    ],
  },

  values: {
    eyebrow: "Was wir bauen",
    title: "Alles, was Ihr Unternehmen braucht, um online zu bestehen",
    items: [
      {
        title: "AI-native Produkte",
        copy: "KI-Agenten und Assistenten, die Ihr Geschäft wirklich kennen: Kunden beantworten, Leads qualifizieren und die Fleißarbeit übernehmen, an der Ihr Team nicht hängen sollte.",
      },
      {
        title: "Plattformen, die mitwachsen",
        copy: "Webanwendungen und Plattformen, die vom ersten Tag an echte Kunden tragen und genauso zuverlässig laufen, wenn zehnmal mehr los ist.",
      },
      {
        title: "Websites, die konvertieren",
        copy: "Schnelle, schöne Websites, die Besucher zu Kunden machen und die Google tatsächlich belohnt.",
      },
      {
        title: "Wachstum, das liefert",
        copy: "Ads, SEO und Kampagnen, die qualifizierte Leads bringen, sauber gemessen, damit Sie immer wissen, was wirkt.",
      },
    ],
    deckLabel: "Was wir bauen",
    processEyebrow: "Wie wir arbeiten",
    steps: [
      { title: "Verstehen", copy: "Wir beginnen damit, Ihr Geschäft zu verstehen, Ihre Ziele und das, wogegen Sie antreten." },
      { title: "Bauen", copy: "Wir bauen es selbst, im Haus. Kein Outsourcing, kein Projekt, das eine Kette hinuntergereicht wird." },
      { title: "Launchen", copy: "Getestet und überwacht, bereit für echte Kunden ab dem ersten Tag." },
      { title: "Wachsen", copy: "Wir bleiben: verbessern, betreuen und halten Sie vorn." },
    ],
  },

  stack: {
    eyebrow: "Wie es läuft",
    title: "Ein System. Jede Ebene durchdacht.",
    layers: [
      { name: "Interface", copy: "Die Websites und Produkte, die Ihre Kunden anfassen: schnell, präzise, auf Conversion gebaut." },
      { name: "Intelligenz", copy: "KI-Agenten und Automatisierungen mitten in Ihrem Betrieb: qualifizieren, beantworten, ausführen." },
      { name: "Infrastruktur", copy: "In der EU gehostete, DSGVO-native Fundamente, gebaut zum Wachsen ohne Drama." },
    ],
  },

  inMotion: {
    eyebrow: "In Bewegung",
    title: "Gebaut, um sich zu bewegen.",
    lead: "Echte Arbeit, nicht nur Standbilder.",
  },
  marketing: {
    eyebrow: "Marketing",
    title: "Es zu bauen ist die halbe Arbeit. Gefunden zu werden die andere.",
    lead:
      "Wir fahren die Kampagnen, die die Systeme speisen, die wir bauen. So werden Traffic, Website und Messung gemeinsam entworfen statt zwischen drei Dienstleistern hin- und hergereicht.",
    items: [
      {
        title: "Bezahlte Werbung",
        copy: "Google Ads, Meta Ads und LinkedIn: optimiert auf Rendite, nicht auf Impressionen.",
        detail: ["Kampagnenstrategie", "A/B-Tests", "Conversion-Tracking"],
      },
      {
        title: "SEO und Content",
        copy: "Besser ranken und qualifizierte Leads organisch gewinnen, auf Fundamenten, die halten.",
        detail: ["Technisches SEO", "Content-Strategie", "Linkaufbau"],
      },
      {
        title: "Conversion-Optimierung",
        copy: "Mehr der Besucher, die Sie ohnehin haben, zu Kunden machen, entschieden anhand von Daten.",
        detail: ["Landingpages", "Nutzertests", "Analytik"],
      },
      {
        title: "Analytik und Reporting",
        copy: "Klare Erkenntnisse und transparentes Reporting zu den Zahlen, auf die es ankommt.",
        detail: ["Individuelle Dashboards", "ROI-Tracking", "Performance-Berichte"],
      },
    ],
    deckLabel: "Marketing-Leistungen",
    videosEyebrow: "In Bewegung",
    videoTitle: (n: number, total: number) => `Deev Marketingvideo, ${n} von ${total}`,
    playLabel: (title: string) => `Abspielen: ${title}`,
  },

  ai: {
    eyebrow: "KI-Workshops und Konzepte",
    title: "Bevor wir irgendetwas bauen, kartieren wir, wo KI sich wirklich rechnet.",
    lead:
      "Wir führen KI-Discovery-Workshops mit operativen Teams durch und machen daraus ein Executive-Konzept: die Engpässe, was jeder einzelne pro Jahr kostet, die Architektur, die sie beseitigt, und ein Stufenplan dorthin. Ein Dokument für den Aufsichtsrat, keine Verkaufspräsentation.",
    deckLabel: "Wie der Workshop abläuft",
    fundingLabel: "Förderung",
    funding:
      "Über die SME Packages Digital und AI erstattet der Staat [[70%]] der förderfähigen Kosten bei einem Projekt von 3.000 bis 25.000 € netto, also höchstens 17.500 € pro Package. Über die Förderfähigkeit entscheidet die Voranalyse, nicht der Preis.",
    method: [
      {
        title: "Discovery, vor Ort",
        copy: "Eine Arbeitssitzung mit den Menschen, die die Prozesse tatsächlich fahren, kein Managementinterview. Wir gehen jeden Arbeitsablauf mit der Person durch, die täglich darin steckt, und halten fest, wo er hängt.",
      },
      {
        title: "Jeder Ablauf, von Anfang bis Ende",
        copy: "Für jeden wesentlichen Prozess rekonstruieren wir den vollständigen Weg der Information, vom Auslöser bis zur Erledigung, und notieren jede manuelle Übergabe, jedes beteiligte Werkzeug und jeden Punkt, an dem Arbeit wartet.",
      },
      {
        title: "Beziffert, nicht behauptet",
        copy: "Jeder Engpass wird aus Ihren eigenen Mengen und einem konservativen Vollkostensatz in geschätzte Jahreskosten umgerechnet und gegen vergleichbare Unternehmen plausibilisiert. Sie bekommen eine Rechnung, über die sich streiten lässt, keine Adjektive.",
      },
      {
        title: "Eine Architektur, die sich einfügt",
        copy: "Die Systeme, die Sie bereits betreiben, bleiben. Die KI-Ebene legt sich darüber, so bleibt die bestehende Investition geschützt und die Einführung kann schrittweise erfolgen statt als Migration.",
      },
      {
        title: "Ein Fahrplan in Phasen",
        copy: "Zwölf Monate, vier Phasen, jede liefert etwas produktiv Nutzbares. Kein KI-Projekt, das sich lohnt, läuft als einzelner Launch, und die ersten spürbaren Gewinne kommen in den ersten zwei Monaten.",
      },
    ],
    exampleLabel: "Ein aktuelles Konzept",
    example:
      "Für eine luxemburgische Immobilienverwaltungsgruppe haben wir eine Discovery-Sitzung mit den Verantwortlichen für Betrieb und Prozesse durchgeführt, sieben Geschäftsprozesse durchgängig kartiert und ein dreißigseitiges Executive-Konzept geliefert.",
    exampleBullets: [
      "Sieben operative Engpässe identifiziert und einzeln beziffert",
      "Eine KI-Architektur aus vier Säulen über den bestehenden Systemen",
      "Ein Zwölfmonatsplan in vier Produktionsphasen",
      "Förderfähige Kosten und Förderweg je Phase kartiert",
    ],
  },

  dataFlow: {
    eyebrow: "Datenanalyse",
    title: "Ihre Daten kennen die Antwort schon. Sie liegt nur an fünf Orten.",
    lead:
      "Den meisten Unternehmen fehlen keine Daten. Es fehlt ein Fundament, dem man trauen kann. Bevor KI etwas wert ist, müssen die Daten übereinstimmen. So kommen wir dahin.",
    steps: [
      {
        title: "Jede Quelle anbinden",
        copy: "ERP, CRM, Tabellen, Postfächer, PDFs und Schnittstellen. Datenstrecken holen aus den Systemen, die Sie schon betreiben, zeitgesteuert oder in Echtzeit, ohne eines davon zu ersetzen.",
      },
      {
        title: "Bereinigen und modellieren",
        copy: "Dubletten zusammengeführt, Formate vereinheitlicht, und eine gemeinsame Definition dessen, was ein Kunde oder ein Umsatz ist. Das Ergebnis ist ein versioniertes Datenfundament, in dem jede Zahl bis zu ihrer Quelle nachvollziehbar bleibt.",
      },
      {
        title: "Auswerten und vorhersagen",
        copy: "Dashboards rund um die Entscheidungen, die Sie tatsächlich treffen, dazu Prognosen und Ausreißererkennung auf Ihrer eigenen Historie. Sie sehen, was kommt, nicht nur, was war.",
      },
      {
        title: "Mit KI handeln",
        copy: "Auf diesem Fundament arbeiten RAG-Assistenten und KI-Agenten verlässlich: Sie antworten aus Ihrem Wissen, entwerfen, verbuchen, markieren. Was wichtig ist, landet weiterhin bei einem Menschen.",
      },
    ],
    labels: {
      duplicates: "Dubletten zusammengeführt",
      trend: "Trend",
      anomaly: "Ausreißer",
      forecast: "Prognose",
      model: "KI",
      outReply: "Antwortentwurf",
      outBook: "Verbucht",
      outReview: "Zur Prüfung",
    },
  },

  aiHero: {
    kicker: "Für Organisationen, die KI in den Betrieb bringen",
    title: "KI, die auf Ihren Abläufen läuft.",
    lead: "Wir verbinden Ihre Daten, Ihr Wissen und Ihre Prozesse zu einer operativen Schicht und bauen darauf die RAG-Systeme, Agenten und Analysen, die damit arbeiten. Gebaut, um jahrelang zu laufen, nicht um in einer Demo zu beeindrucken.",
    primary: "Discovery-Termin vereinbaren",
    secondary: "Zur Architektur",
    strip: "RAG · Agenten · Datenplattformen · Analyse",
    layer: {
      label: "Die operative Schicht",
      note: "Ihre Systeme bleiben. Wir bauen darauf auf.",
      bands: [
        { name: "Aktion", sub: "Zurück in Ihre Systeme", items: ["Rückschreiben in ERP und CRM", "Freigabe durch Menschen", "Benachrichtigungen und Aufgaben", "Audit-Log"], note: "" },
        { name: "Intelligenz", sub: "Was wir bauen", items: ["Individuelle RAG", "KI-Agenten", "Prognosen", "Dokumenten-KI"], note: "Evaluiert · kontrolliert · Modellwahl bleibt offen" },
        { name: "Fundament", sub: "Ein Modell Ihres Unternehmens", items: ["Kunde", "Vertrag", "Auftrag", "Rechnung", "Anlage"], note: "Objekte · Beziehungen · Rechte · Historie" },
        { name: "Quellen", sub: "Was Sie schon betreiben", items: ["ERP", "CRM", "SharePoint", "Postfächer", "PDF und Scans", "Tabellen", "APIs"], note: "" },
      ],
    },
    cta: "Bringen Sie uns den Prozess, der Sie am meisten kostet.",
  },

  aiFoundation: {
    eyebrow: "Das Fundament",
    title: "Ihre Daten, modelliert wie Ihr Unternehmen arbeitet.",
    lead: "Bevor KI etwas wert ist, muss sie wissen, was in Ihrem Unternehmen ein Kunde, ein Vertrag oder ein Auftrag ist und wie sie zusammenhängen. Dieses gemeinsame Modell bauen wir einmal. Jeder Assistent, jeder Agent und jedes Dashboard arbeitet danach mit denselben Fakten und denselben Rechten.",
    points: [
      { title: "Objekte und Beziehungen", copy: "Kunden, Verträge, Anlagen und Aufträge, verknüpft wie in der Wirklichkeit." },
      { title: "Aktionen mit Regeln", copy: "Was sich ändern darf, wer es ändern darf und was eine Freigabe braucht." },
      { title: "Herkunft", copy: "Jede Zahl lässt sich bis zu dem System und dem Datensatz zurückverfolgen, aus dem sie stammt." },
    ],
    panel: {
      label: "Objekt · Vertrag",
      illustrative: "Beispiel",
      name: "C-2041 · Liefervertrag",
      party: "Musterlieferant Sàrl",
      status: "Aktiv",
      fields: [
        { k: "Kündigungsfrist", v: "3 Monate · zum Quartalsende" },
        { k: "Verlängerung", v: "Automatisch, jährlich" },
        { k: "Preisobergrenze", v: "+5 % pro Jahr" },
        { k: "Verantwortlich", v: "Einkauf" },
      ],
      linkedLabel: "Verknüpft",
      linked: ["Lieferant · 1", "Aufträge · 3", "Rechnungen · 2", "Quell-PDF · 1"],
      actionsLabel: "Aktionen",
      actions: ["Verlängern", "Preis anpassen"],
      gated: "Kündigen · braucht Freigabe",
    },
  },

  aiAgents: {
    eyebrow: "Agenten und Abläufe",
    title: "Agenten, die die Arbeit zu Ende bringen. Menschen, wo es zählt.",
    lead: "Ein Agent liest, was hereinkommt, holt sich aus Ihrem Fundament und Ihren Dokumenten, was er braucht, wendet Ihre Regeln an und handelt in Ihren Systemen. Alles außerhalb seiner Regeln hält an und wartet auf einen Menschen.",
    points: ["Jeder Schritt protokolliert und nachvollziehbar", "Regeln, die Sie festlegen, statt Prompts, auf die man hofft", "Freigabe vor allem, was sich nicht rückgängig machen lässt"],
    panel: {
      label: "Agentenlauf · Preisänderung eines Lieferanten",
      illustrative: "Beispiel",
      steps: [
        { kind: "Auslöser", text: "E-Mail eingegangen: „Aktualisierte Preisliste Q4“" },
        { kind: "Einordnen", text: "Preisänderung Lieferant · Musterlieferant Sàrl" },
        { kind: "Abrufen", text: "Vertrag C-2041 · Klausel 7.2, Preisobergrenze" },
        { kind: "Prüfen", text: "Erhöhung um 6,5 % überschreitet die vereinbarten 5 %" },
        { kind: "Entwurf", text: "Antwort an den Lieferanten mit Verweis auf Klausel 7.2" },
        { kind: "Freigabe", text: "Wartet auf: Leitung Einkauf" },
        { kind: "Schreiben", text: "Antwort senden · Preistabelle im ERP unverändert lassen" },
      ],
      approve: "Freigeben und senden",
      edit: "Entwurf bearbeiten",
      reject: "Ablehnen",
    },
  },

  aiGovernance: {
    eyebrow: "Evaluation und Governance",
    title: "Gemessen, bevor es live geht. Kontrolliert danach.",
    evalLabel: "Testsatz · Ihre echten Fragen",
    illustrative: "Beispiel",
    running: "Läuft",
    cols: ["Frage", "Erwartete Quelle", "Ergebnis"],
    rows: [
      { q: "Kündigungsfrist für Lieferantenverträge?", src: "Vertragsvorlage §7", result: "Bestanden · zitiert" },
      { q: "Wer gibt Bestellungen über dem Limit frei?", src: "Einkaufsrichtlinie §3", result: "Bestanden · zitiert" },
      { q: "Was hat der Vorstand in Q2 beschlossen?", src: "Vorstandsprotokoll · gesperrt", result: "Bestanden · zurückgehalten" },
      { q: "Urlaubsanspruch für Teilzeitkräfte?", src: "Nicht indexiert", result: "Bestanden · „nicht gefunden“" },
      { q: "Reaktionszeit bei Störungen mit Priorität 1?", src: "Service-SLA §2", result: "Prüfen · falscher Abschnitt" },
    ],
    points: [
      { title: "Rechte übernommen", copy: "Rollen und Berechtigungen kommen aus Ihren bestehenden Systemen." },
      { title: "Alles protokolliert", copy: "Jede Antwort, Entscheidung und Aktion lässt sich nachvollziehen." },
      { title: "DSGVO und EU AI Act von Anfang an", copy: "Vom ersten Tag an mitgedacht, nicht kurz vor dem Start nachgerüstet." },
      { title: "Modellwahl bleibt offen", copy: "Das Modell wechseln, ohne das System darum herum neu zu bauen." },
    ],
  },

  rag: {
    eyebrow: "Individuelle RAG",
    title: "Antworten aus Ihren Dokumenten. Jede Quelle sichtbar.",
    lead: "Retrieval-Augmented Generation verbindet ein Sprachmodell mit dem, was Ihre Organisation weiß: Verträge, Handbücher, Tickets, Wikis, Berichte. Es sucht zuerst die passenden Stellen und antwortet nur aus ihnen, mit Angabe, woher jede Aussage stammt. Gibt es nichts Passendes, sagt es das, statt zu raten.",
    pointsLabel: "Was unsere individuell macht",
    points: [
      { title: "Ihre Quellen, immer aktuell", copy: "Wir indexieren die Systeme, die Sie schon nutzen, und halten den Index aktuell, wenn sich Dokumente ändern." },
      { title: "Zugriffsrechte bleiben bestehen", copy: "Jeder bekommt nur Antworten aus Dokumenten, die er auch öffnen darf." },
      { title: "Jede Antwort nennt ihre Quellen", copy: "Jede Aussage verweist auf die Stelle, aus der sie stammt, und lässt sich mit einem Klick prüfen." },
      { title: "Gemessen vor dem Start", copy: "Die Antwortqualität wird an einer Reihe Ihrer echten Fragen getestet, vor dem Go-live und nach jeder Änderung." },
      { title: "Betrieb passend zu Ihren Daten", copy: "In der EU oder auf Ihrer eigenen Infrastruktur, wenn die Daten das Haus nicht verlassen dürfen." },
    ],
    demo: {
      label: "Beispiel zur Veranschaulichung",
      askLabel: "Frage",
      indexLabel: "Ihre Wissensbasis",
      answerLabel: "Antwort",
      locked: "Kein Zugriff",
      question: "Welche Kündigungsfrist gilt für unsere Lieferantenverträge?",
      sources: [
        "Lieferantenvertrag Vorlage.pdf",
        "Einkaufsrichtlinie 2025.docx",
        "Rahmenvertrag.pdf",
        "Vorstandsprotokoll Q2.pdf",
        "Service-SLA.pdf",
        "Onboarding-Wiki",
        "Ticket #4821",
      ],
      answer: [
        { text: "Standard-Lieferantenverträge enden mit drei Monaten Frist zum Quartalsende", cite: 1 },
        { text: ". Ausnahme sind Rahmenverträge: sechs Monate, schriftlich", cite: 3 },
        { text: ". Kürzere Fristen brauchen die Freigabe der Rechtsabteilung", cite: 2 },
        { text: "." },
      ],
      status: {
        typing: "Frage",
        searching: "Durchsuche 7 Quellen",
        found: "3 passende Stellen \u00b7 1 Quelle ohne Zugriff",
        answering: "Antwort wird geschrieben",
        done: "Antwort mit Quellen",
      },
    },
  },

  docAi: {
    eyebrow: "Vom Dokument zu Daten",
    title: "Ein Dokument kommt an. Niemand tippt es ab.",
    lead:
      "Rechnungen, Lieferscheine, Formulare und Verträge werden gelesen, ihre Felder ausgelesen und geprüft, und das Ergebnis landet direkt in dem System, in das es gehört.",
    points: [
      "Liest PDFs, Scans und abfotografiertes Papier.",
      "Jedes ausgelesene Feld trägt einen Sicherheitswert.",
      "Unsichere Felder gehen an einen Menschen, bevor etwas verbucht wird.",
    ],
    demoLabel: "Beispiel zur Veranschaulichung",
    recordLabel: "Ausgelesener Datensatz",
    confidence: "Sicherheit",
    doc: {
      kind: "Rechnung",
      supplier: "Musterlieferant Sàrl",
      address: "L-1234 Luxemburg",
      lines: [
        { label: "Beratung, September", amount: "1.120,00" },
        { label: "Reisekosten", amount: "120,00" },
      ],
    },
    fields: {
      supplier: "Lieferant",
      number: "Rechnungsnr.",
      date: "Datum",
      net: "Netto",
      vat: "MwSt. 17 %",
      total: "Gesamt",
      iban: "IBAN",
    },
    values: {
      number: "2026-0412",
      date: "14.09.2026",
      net: "1.240,00 €",
      vat: "210,80 €",
      total: "1.450,80 €",
    },
    status: {
      reading: "Dokument wird gelesen",
      review: "1 Feld zur Prüfung",
      approved: "Von einem Menschen geprüft",
      done: "Bereit zur Buchung",
    },
  },

  billovio: {
    eyebrow: "Unser eigenes Produkt",
    by: "von DEEV",
    statement: "Wir bauen KI nicht nur. Wir liefern sie aus.",
    lead:
      "Beschreiben Sie einen Auftrag in einem Satz, und Billovio schreibt den Leistungsumfang, kalkuliert die Arbeit und führt sie bis zu Unterschrift und Rechnung.",
    features: [
      "Leistungsumfang aus einem einzigen Satz",
      "Kalkuliert nach Ihrer eigenen Preisliste",
      "Unterschrift und Rechnung in einem Ablauf",
      "In Ihrem Branding, in rund 30 Sekunden",
    ],
    cta: "billovio.com öffnen",
    shotAlt: "Billovio: ein Angebot, aus einem einzigen Satz geschrieben, kalkuliert und versendet",
  },

  trust: {
    eyebrow: "Warum Deev",
    title: "Gebaut, um mit dem Wichtigen betraut zu werden.",
    lead:
      "Projekte mit hohem Einsatz brauchen mehr als gutes Design. Sie brauchen einen Partner, der Ihr Risiko bei jedem Schritt senkt.",
    credentials: [
      // "50+ Projekte" und "100% Termintreue" standen hier. Beides ist
      // nicht belegt: das Portfolio zaehlt die gezeigten Projekte, und eine
      // Termintreuequote wurde nie gemessen. Auf einer Vertrauensseite ist
      // eine erfundene Zahl das Gegenteil von Vertrauen.
      { value: "2", label: "Gründer, beide an Ihrem Projekt" },
      { value: "3", label: "Sprachen, vollständig gepflegt" },
      { value: "EU", label: "Sitz in Luxemburg" },
      { value: "Im Haus", label: "Design und Entwicklung" },
    ],
    pillars: [
      {
        title: "DSGVO und Datensouveränität",
        copy: "In der EU gehostete Infrastruktur, DSGVO-konform von Haus aus. Ihre Daten bleiben in Europa, behandelt nach dem Maßstab regulierter Branchen.",
      },
      {
        title: "Sicherheit zuerst",
        copy: "Secure-by-Design-Architektur, Prüfung der Abhängigkeiten und Zugriff nach dem Least-Privilege-Prinzip in jedem Projekt, kein nachträglich angeschraubter Gedanke.",
      },
      {
        title: "Direkte Umsetzung",
        copy: "Sie arbeiten direkt mit den Menschen, die Ihr System bauen. Keine Übergaben ins Ausland, keine Mauer aus Kundenbetreuern, niemand, der Ihr Briefing an ein Team weiterreicht, das Sie nie zu sehen bekommen.",
      },
      {
        title: "Fester Umfang, klare Meilensteine",
        copy: "Definierte Ergebnisse, transparente Zeitpläne und Lieferung in Meilensteinen. Sie wissen immer, was als Nächstes kommt: keine Überraschungen, kein ausuferndes Projekt.",
      },
    ],
    stackLabel: "Unser Produktions-Stack",
  },

  founders: {
    eyebrow: "Mit wem Sie arbeiten",
    title: "Zwei Gründer. Beide an Ihrem Projekt.",
    body1:
      "Hier gibt es keine Vertriebsschicht. Wenn Sie DEEV schreiben, erreichen Sie uns beide direkt, und diese Leitung bleibt bis zum Launch-Tag bestehen.",
    body2:
      "Ein kleines Studio in Luxemburg mit einem Team dahinter. Das ist Absicht: weniger Projekte, ordentlich geführt, von den Menschen, deren Namen darauf stehen.",
    cta: "Sprechen Sie uns direkt an",
    role: "Gründer und CEO",
    photoAlt: (name: string, role: string) => `${name}, ${role} bei DEEV`,
  },

  luxembourg: {
    coords: "49.6117° N, 6.1300° E",
    title: "Entwickelt in Luxemburg.",
    titleMuted: "Vertraut in ganz Europa.",
    body:
      "Aus dem Herzen der europäischen Finanzhauptstadt bauen wir digitale Systeme für Unternehmen, die einen hohen Anspruch an sich selbst stellen.",
    photoAlt: "Luxemburg-Stadt, der Grund und das Alzettetal",
  },

  finalCta: {
    title: "Bauen wir etwas Außergewöhnliches.",
    body:
      "Keine Vertriebsschicht, keine Kundenbetreuer. Wenn Sie DEEV schreiben, sprechen Sie direkt mit den Menschen, die Ihr Projekt entwerfen, bauen und ausliefern.",
    primary: "Projekt konfigurieren",
    secondary: "Strategiegespräch buchen",
  },
};
