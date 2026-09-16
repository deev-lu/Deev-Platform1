/**
 * The nine service areas, in the order they appear on the homepage.
 *
 * Both the navigation panel and /services read this, so a section can never
 * be listed in one and missing from the other. The words themselves are not
 * here: labels and descriptions live in each locale's `site.mega.items`,
 * keyed by the ids below.
 */
export const SERVICE_GROUPS = {
  build: ["what-we-build", "how-it-runs", "pricing"],
  grow: ["marketing", "ai", "billovio"],
  studio: ["why-it-works", "why-deev", "about"],
} as const;

export type ServiceGroup = keyof typeof SERVICE_GROUPS;
export type ServiceId = (typeof SERVICE_GROUPS)[ServiceGroup][number];

/** Wohin jede Kachel führt. */
export const SERVICE_HREF: Record<string, string> = {
  // Nach dem Entschlacken tragen Seiten den Inhalt. Vier dieser Ziele zeigten
  // danach auf "/services" - also auf die Seite, auf der die Kacheln selbst
  // stehen. Auf /services war der Klick damit wirkungslos: die Adresse ändert
  // sich nicht, es wird nicht gescrollt, nichts passiert. Von aussen sah das
  // aus wie ein kaputter Link, und es war einer.
  //
  // Jetzt zeigt jede Kachel auf den Abschnitt, den sie ankündigt. Die vier
  // Anker stehen in ServicesIndex und werden dort gesetzt; wer sie umbenennt,
  // muss hier mit umbenennen.
  "what-we-build": "/services#services-detail",
  "how-it-runs": "/services/custom-software",
  pricing: "/project",
  marketing: "/services#marketing",
  ai: "/services/ai-automation",
  billovio: "/services/custom-software",
  "why-it-works": "/services#why-it-works",
  "why-deev": "/services#why-deev",
  about: "/#about",
};
