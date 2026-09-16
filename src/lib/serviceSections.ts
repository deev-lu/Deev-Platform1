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

/**
 * Wohin jeder Menuepunkt fuehrt.
 *
 * Vier davon zeigten auf Abschnitte von /services - #services-detail,
 * #why-it-works, #marketing, #why-deev. Diese Abschnitte gibt es dort nicht
 * mehr: die Seite ist ein Wegweiser auf die vier Leistungsseiten geworden,
 * statt selbst der Inhalt zu sein. Ein Anker auf einen geloeschten Abschnitt
 * scrollt nirgendwohin.
 *
 * Jeder Eintrag zeigt jetzt auf die Seite, die sein Thema wirklich traegt.
 * Dass mehrere auf dieselbe zeigen, ist richtig so: das Menue benennt neun
 * Themen, es gibt aber vier Wege.
 */
export const SERVICE_HREF: Record<string, string> = {
  "what-we-build": "/services/websites",
  "how-it-runs": "/services/custom-software",
  pricing: "/project",
  marketing: "/services/marketing",
  ai: "/services/ai-automation",
  billovio: "/services/custom-software",
  "why-it-works": "/services",
  "why-deev": "/services",
  about: "/#about",
};
