/** The site assistant. Structure lives in ChatWidget.tsx; every word is here. */
export const chat = {
  open: "Frage stellen",
  close: "Schließen",
  title: "Deev fragen",
  subtitle: "Antworten zu unseren Projekten, Leistungen und der 70-%-Förderung.",
  greeting:
    "Fragen Sie mich, was Deev baut, welche Projekte wir umgesetzt haben oder wie die luxemburgische KMU-Förderung funktioniert. Für eine echte Anfrage geht das Kontaktformular schneller.",
  placeholder: "Ihre Frage eingeben",
  send: "Senden",
  stop: "Stopp",
  clear: "Unterhaltung löschen",
  thinking: "Schreibt",
  suggestions: [
    "Was baut Deev?",
    "Wie funktioniert die 70-%-Förderung?",
    "Zeigen Sie mir eine Webanwendung",
  ],
  notice:
    "Antworten werden von einer KI erzeugt und können falsch sein. Bitte geben Sie keine persönlichen oder vertraulichen Daten ein.",
  noticeLink: "Wie wir damit umgehen",
  errors: {
    busy: "Zu viele Fragen auf einmal. Versuchen Sie es gleich noch einmal.",
    upstream: "Bei uns ist etwas schiefgelaufen. Versuchen Sie es erneut oder schreiben Sie an contact@deev.lu.",
    offline: "Keine Verbindung. Prüfen Sie Ihr Netzwerk und versuchen Sie es erneut.",
    limited: "Das sind viele Fragen. Machen Sie eine kurze Pause oder schreiben Sie an contact@deev.lu.",
    refused: "Diese Frage beantworte ich lieber nicht. Fragen Sie mich etwas über Deev.",
    unavailable: "Der Assistent ist gerade nicht verfügbar. Schreiben Sie an contact@deev.lu, wir melden uns.",
  },
};
