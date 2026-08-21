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

import shotFeltes from "../assets/work/feltes.jpg";
import shotOscars from "../assets/work/oscarsbar.jpg";
import shotMellys from "../assets/work/mellys.jpg";
import shotAurora from "../assets/work/aurora.jpg";
import shotGeoplus from "../assets/work/geoplus.jpg";
import shotVino from "../assets/work/vinoamore.jpg";
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

const IMAGES: Record<string, string> = {
  "bureau-immobilier-feltes": shotFeltes,
  "aurora-experience": shotAurora,
  "oscars-bar": shotOscars,
  "mellys": shotMellys,
  "geoplus-3d": shotGeoplus,
  "vino-amore": shotVino,
};

// Facts live in projects.data.json — scripts/prerender-routes.mjs reads the
// same file to emit a document per case study, so the site and the sitemap
// can never disagree about which projects exist.
export const PROJECTS: Project[] = (projectData as Omit<Project, "image">[]).map((p) => ({
  ...p,
  image: IMAGES[p.slug],
}));

export const getProject = (slug?: string) => PROJECTS.find((p) => p.slug === slug);

/** Wraps around, so the case-study footer always has somewhere to go. */
export const nextProject = (slug: string) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
};
