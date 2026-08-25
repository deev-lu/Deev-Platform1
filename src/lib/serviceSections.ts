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

/** Where each area actually lives: a section of the homepage. */
export const SERVICE_HREF: Record<string, string> = {
  "what-we-build": "#services",
  "how-it-runs": "#how-it-runs",
  pricing: "#pricing",
  marketing: "#marketing",
  ai: "#ai",
  billovio: "#billovio",
  "why-it-works": "#why-it-works",
  "why-deev": "#why-deev",
  about: "#about",
};
