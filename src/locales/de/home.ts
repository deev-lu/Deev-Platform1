import type { home as En } from "../en/home";

export const home: typeof En = {
  hero: {
    eyebrow: "AI-native Digital Engineering, Luxemburg",
    title: ["Plattformen, die [[konvertieren]].", "Systeme, die mitwachsen.", "Gebaut in Luxemburg."],
    lead:
      "KI-gestützte Plattformen, Webanwendungen und digitale Systeme, entwickelt für Conversion, Automatisierung und Wachstum. Gebaut in Luxemburg für ambitionierte Unternehmen in ganz Europa.",
    claims: [
      "AI-native Webplattformen, Webanwendungen und Onlineshops",
      "Lead-Maschinen, gebaut für Conversion, nicht nur fürs Auge",
      "Bis zu 70% gefördert durch die luxemburgische KMU-Staatsbeihilfe",
    ],
    ctaPrimary: "Projekt konfigurieren",
    ctaSecondary: "Strategiegespräch buchen",
  },

  logos: { label: "Das Vertrauen führender Unternehmen in Luxemburg und darüber hinaus" },

  grant: {
    badge: "Staatliche Förderung",
    title: "Luxemburger KMU: bis zu [[70% gefördert]] vom Staat.",
    body:
      "Websites, Webanwendungen und KI-Projekte sind über die Programme SME Digital und SME AI förderfähig: 70% von Investitionen zwischen 3.000 € und 25.000 € (netto), davon bis zu 15% Marketing und 15% Werbebudget.",
    strong: "Programme SME Digital und SME AI",
    cta: "Nettopreis berechnen",
  },

  work: {
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
      "Luxemburger KMU können bis zu [[70%]] der förderfähigen Kosten über das SME Package AI & Digital von Luxinnovation abdecken, gedeckelt bei 25.000 € Zuschuss pro Projekt.",
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
      { value: "50+", label: "Projekte umgesetzt" },
      { value: "100%", label: "Termintreue" },
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
