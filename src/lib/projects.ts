/**
 * Single source of truth for shipped work.
 *
 * Shared by the homepage grid and the /work/:slug case-study pages, so a
 * project can never appear in one and not the other.
 *
 * Everything below is factual: title, year, sector, the live URL and the
 * screenshot we took. The narrative fields are optional and deliberately
 * empty — a case study describing a brief, an approach or an outcome has to
 * come from the people who did the work, not be written around the data.
 * A project with none of them still renders a complete page; each one that
 * gets filled in simply adds a block.
 */

import projectData from "./projects.data.json";

export interface Project {
  slug: string;
  title: string;
  year: number;
  /** Sector / what it is, e.g. "Real Estate Web-App" */
  category: string;
  /** Grid filter bucket */
  filter: "Website" | "E-commerce" | "Web App";
  link?: string;
  image?: string;

  /** ── Optional narrative. Fill these in to deepen a case study. ── */
  summary?: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  /** e.g. ["Next.js", "Supabase", "Stripe"] */
  stack?: string[];
}

/**
 * Screenshots are discovered from src/assets/work by filename, so adding one
 * is a one-step job: drop `<slug>.jpg` in that folder and it appears in the
 * slider and on the case-study page. No import, no map entry, no rebuild of
 * this file.
 *
 * The six shots taken before this convention existed keep their old names,
 * which is what ALIASES is for. New ones should just be named after the slug.
 */
const FILES = import.meta.glob("../assets/work/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const ALIASES: Record<string, string> = {
  "bureau-immobilier-feltes": "feltes",
  "aurora-experience": "aurora",
  "oscars-bar": "oscarsbar",
  "geoplus-3d": "geoplus",
  "vino-amore": "vinoamore",
};

const byBasename: Record<string, string> = {};
for (const [path, url] of Object.entries(FILES)) {
  const base = path.split("/").pop()!.replace(/\.[a-z]+$/i, "");
  byBasename[base] = url;
}

const imageFor = (slug: string) => byBasename[slug] ?? byBasename[ALIASES[slug]];

// Facts live in projects.data.json — scripts/prerender-routes.mjs reads the
// same file to emit a document per case study, so the site and the sitemap
// can never disagree about which projects exist.
export const PROJECTS: Project[] = (projectData as Omit<Project, "image">[]).map((p) => ({
  ...p,
  image: imageFor(p.slug),
}));

export const getProject = (slug?: string) => PROJECTS.find((p) => p.slug === slug);

/** Wraps around, so the case-study footer always has somewhere to go. */
export const nextProject = (slug: string) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
};
