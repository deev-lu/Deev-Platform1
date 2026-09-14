/** /sme-packages — die Seite zur Förderung. */
export const grant = {
  eyebrow: "SME Packages Luxemburg",
  title: "Der Staat zahlt [[70 %]]. Sie zahlen den Rest.",
  lead:
    "Luxemburgische KMU erhalten 70 % eines förderfähigen Digital- oder KI-Projekts über die SME Packages zurück. Beim größten förderfähigen Projekt sind das 17.500 EUR. Hier steht genau, wie es funktioniert, was abgedeckt ist und was Ihnen zu zahlen bliebe.",
  ctaPrimary: "Projekt kalkulieren",
  ctaSecondary: "Erst sprechen",

  stats: {
    rate: { value: "70 %", label: "der förderfähigen Kosten", note: "Nicht bis zu 70 %. Der Satz steht fest." },
    range: { value: "3k–25k", label: "förderfähiges Projekt, EUR, netto", note: "Unter 3.000 gibt es keine Förderung." },
    cap: { value: "17.500", label: "maximale Rückerstattung, EUR", note: "70 % der Obergrenze von 25.000." },
  },

  check: {
    eyebrow: "Zuerst das",
    title: "Ist Ihr Unternehmen förderfähig?",
    lead: "Vier Bedingungen entscheiden. Haken Sie an, was zutrifft.",
    items: {
      sme: "Wir sind ein KMU: unter 250 Beschäftigte und Umsatz unter 50 Mio. EUR oder Bilanzsumme unter 43 Mio. EUR.",
      seat: "Der Firmensitz liegt in Luxemburg.",
      auth: "Wir haben eine gültige Niederlassungsgenehmigung (autorisation d'établissement).",
      size: "Das geplante Projekt ist mindestens 3.000 EUR netto wert.",
    },
    all: "Alle vier passen. Auf dieser Grundlage sieht Ihr Projekt förderfähig aus, und der Termin zur Vorprüfung ist der nächste Schritt.",
    some: (n) =>
      `${n} von 4. Was nicht angehakt ist, müsste sich vor einem Antrag ändern. Sagen Sie uns, welcher Punkt es ist, und wir sagen Ihnen, ob es machbar ist.`,
    none: "Noch nichts angehakt.",
    caveat:
      "Das ist ein Hinweis, keine Entscheidung. Die Förderfähigkeit wird beim Vorprüfungstermin bestätigt, und über den Antrag entscheidet das Wirtschaftsministerium.",
  },

  calc: {
    eyebrow: "Die Rechnung",
    title: "Was Sie zurückbekämen.",
    lead: "Ziehen Sie den Projektwert. Die Zahlen sind die Regeln des Programms, angewendet auf diesen Wert, mehr nicht.",
    project: "Projektwert, netto",
    grant: "Der Staat erstattet",
    net: "Ihre Nettokosten",
    capped: "Über 25.000 sind die förderfähigen Kosten gedeckelt, die Förderung endet also bei 17.500.",
    below: "Unter 3.000 qualifiziert sich ein Projekt nicht für ein Package.",
    cta: "Ein echtes Projekt konfigurieren",
  },

  scope: {
    eyebrow: "Was abgedeckt ist",
    title: "Was wir in einem Package bauen.",
    lead: "Die Stränge Digital und KI decken zusammen das meiste ab, was ein Unternehmen online braucht. Das liefern wir.",
    items: {
      website: { title: "Websites", body: "Eine Website, die gefunden wird und konvertiert, keine Broschüre." },
      store: { title: "Onlineshops", body: "Zahlungen, Katalog, Bestand und der Bestellprozess dahinter." },
      app: { title: "Webanwendungen und Plattformen", body: "Dashboards, Portale, Buchung und Abrechnung, interne Werkzeuge." },
      ai: { title: "KI und Automatisierung", body: "Assistenten, Recherche in Ihren eigenen Dokumenten, wiederkehrende Büroarbeit." },
      marketing: {
        title: "Marketing, mitgefördert",
        body: "Nicht eigenständig gefördert, aber bis zu 15 % Marketing und 15 % Werbebudget können in einem Digital-Package neben einem Website- oder Webanwendungsprojekt mitlaufen, zum selben Satz von 70 %.",
      },
      brand: { title: "Marke und Identität", body: "Wenn ein Projekt das Aussehen ebenso braucht wie den Bau." },
    },
  },

  steps: {
    eyebrow: "Wie es abläuft",
    title: "Sechs Schritte, in dieser Reihenfolge.",
    lead: "Die Reihenfolge zählt: Arbeit, die vor der Bewilligung beginnt, ist nicht gedeckt.",
    items: [
      { title: "Vorprüfung", body: "Sie vereinbaren einen Termin bei der House of Entrepreneurship oder, als Handwerksbetrieb, bei eHandwierk der Chambre des Métiers. Dort wird die Förderfähigkeit geprüft und beim Formular geholfen." },
      { title: "Umfang und Angebot", body: "Wir schreiben den Leistungsumfang und ein Angebot, das zum Package passt. Hier liegt unsere Arbeit: Ein Umfang, der zu den Kategorien des Programms passt, ist der Unterschied zwischen einer Bewilligung und einer Neufassung." },
      { title: "Antrag", body: "Die Akte geht mit dem Angebot an das Wirtschaftsministerium." },
      { title: "Bewilligung", body: "Sie warten die Entscheidung ab, bevor irgendetwas beginnt." },
      { title: "Wir bauen", body: "Das Projekt läuft. Sie bekommen die Website, die Plattform oder das System." },
      { title: "Erstattung", body: "Sie zahlen uns vollständig und reichen dann ein. Die Förderung kommt nach der Lieferung, nicht davor." },
    ],
    cashflow: {
      title: "Eines sollten Sie einplanen",
      body: "Das ist eine Erstattung, kein Rabatt an der Kasse. Sie zahlen die Rechnung vollständig und der Staat zahlt nach der Lieferung zurück; dazwischen muss das Geld verfügbar sein. Das sollten Sie jetzt wissen und nicht erst bei der Rechnung.",
    },
  },

  faq: {
    eyebrow: "Fragen",
    title: "Die, die uns wirklich gestellt werden.",
    items: [
      {
        q: "Sind es wirklich 70 % oder bis zu 70 %?",
        a: "Es sind 70 % der förderfähigen Kosten. Was mit bis zu gemeint ist, ist die Obergrenze: Die förderfähigen Kosten enden bei 25.000 EUR, die Förderung also bei 17.500 EUR. Der Satz selbst schwankt nicht.",
      },
      {
        q: "Wann bekomme ich das Geld?",
        a: "Nach der Lieferung des Projekts. Sie zahlen den Dienstleister vollständig und beantragen danach die Erstattung. Planen Sie den vollen Betrag ein und betrachten Sie die Förderung als Geld, das zurückkommt.",
      },
      {
        q: "Darf ich vor der Bewilligung anfangen?",
        a: "Nein. Arbeit, die vor der Bewilligung beginnt, ist nicht gedeckt. Erst die Vorprüfung, dann der Antrag, dann die Entscheidung, dann der Bau.",
      },
      {
        q: "Was, wenn mein Projekt größer als 25.000 ist?",
        a: "Sie können es trotzdem bauen. Die förderfähigen Kosten sind bei 25.000 EUR gedeckelt, die Förderung bei 17.500 EUR, den Rest tragen Sie. Wir sagen Ihnen klar, welche Teile in das Package fallen und welche nicht.",
      },
      {
        q: "Ist Marketing förderfähig?",
        a: "Nicht allein. Bis zu 15 % Marketing und 15 % Werbebudget können in einem Digital-Package neben einem Website- oder Webanwendungsprojekt mitlaufen, zum selben Satz.",
      },
      {
        q: "Übernehmen Sie den Papierkram?",
        a: "Wir schreiben Umfang und Angebot so, dass sie zum Programm passen, und begleiten Sie durch das Formular. Den Vorprüfungstermin vereinbaren Sie selbst, und die Entscheidung trifft das Ministerium. Niemand kann Ihnen eine Bewilligung versprechen, und wer das tut, sollte Sie misstrauisch machen.",
      },
      {
        q: "Wie lange dauert das?",
        a: "Das Programm veröffentlicht keinen festen Zeitplan; Fristen und Unterlagenlisten werden bei der Vorprüfung bestätigt statt vorab bekannt gegeben. Fragen Sie bei diesem Termin und planen Sie den Bau um die Antwort herum.",
      },
    ],
  },

  source: {
    body: "Die Zahlen auf dieser Seite stammen von guichet.public.lu und Luxinnovation und waren zum Zeitpunkt der Erstellung korrekt. Programmbedingungen ändern sich: Prüfen Sie die aktuellen Konditionen, bevor Sie sich darauf verlassen, und bestätigen Sie alles bei Ihrer Vorprüfung.",
    link: "SME Packages auf guichet.public.lu",
  },

  cta: {
    title: "Wissen, was Ihres kosten würde?",
    body: "Sagen Sie uns, was Sie bauen wollen. Wir sagen Ihnen, was es braucht, was es kostet, was in ein Package passt und wie Ihr Nettopreis aussieht.",
    action: "Gespräch beginnen",
    secondary: "Oder selbst kalkulieren",
  },
};
