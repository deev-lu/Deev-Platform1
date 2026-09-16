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
import type { Locale } from "./i18n";

export interface Project {
  slug: string;
  title: string;
  year: number;
  /**
   * Sector / what it is, e.g. "Real Estate Web-App", in every language.
   *
   * A record rather than a string, for the same reason an Article carries all
   * three locales: the type makes a project that is only described in English
   * a build error instead of an English sector name sitting in the middle of
   * a German page.
   */
  category: Record<Locale, string>;
  /** Grid filter bucket */
  filter: "Website" | "E-commerce" | "Web App";
  link?: string;
  image?: string;

  /** ── Die Fallstudie. Optional, aber wenn, dann in allen drei Sprachen. ──
   *
   * Als einfacher String stand deutscher Text auch auf der franzoesischen
   * Seite. Ein Record erzwingt alle drei, genau wie bei `category` und bei
   * einem Blogartikel: eine Fallstudie, die nur auf Deutsch existiert, ist ein
   * Build-Fehler statt einer halb uebersetzten Seite.
   *
   * `outcome` bleibt bewusst selten gefuellt. Ein Ergebnis ist eine Aussage
   * ueber den Kunden, und die gehoert belegt - siehe FRAGEN_AN_DEEV.md. Ohne
   * Beleg bleibt das Feld leer, und die Seite zeigt den Abschnitt nicht. */
  /**
   * Die Eröffnung. Ein Satz, der eine Haltung hat, keine Agenturfloskel:
   * er steht groß über der Seite und entscheidet, ob weitergelesen wird.
   */
  summary?: Record<Locale, string>;

  /**
   * Fünf Kapitel, in dieser Reihenfolge. Es sind bewusst fünf und nicht drei:
   * ohne `context` beginnt eine Fallstudie mitten im Problem, ohne dass der
   * Leser weiß, um wessen Geschäft es geht, und ohne `execution` bleibt der
   * Ansatz eine Absichtserklärung.
   *
   * Jedes Kapitel ist einzeln optional. Was fehlt, wird nicht gerendert - eine
   * Fallstudie mit drei ehrlichen Kapiteln ist besser als fünf, von denen zwei
   * gestreckt sind.
   */
  context?: Record<Locale, string>;
  challenge?: Record<Locale, string>;
  approach?: Record<Locale, string>;
  execution?: Record<Locale, string>;
  /**
   * Das Ergebnis ist die einzige Aussage hier, die dem Kunden gehört und nicht
   * uns. Sie steht nur da, wenn er sie so unterschreiben würde.
   */
  outcome?: Record<Locale, string>;
  /** e.g. ["Next.js", "Supabase", "Stripe"] */
  stack?: string[];

  /**
   * What DEEV actually delivered, as keys rather than sentences.
   *
   * Prose here would be sixteen near-identical paragraphs saying we built the
   * website, which reads as filler and counts as thin content besides. Keys
   * translate cleanly and say the same thing in a line the reader can scan.
   */
  scope?: ("website" | "onlineStore" | "platform" | "branding")[];
}

/**
 * Screenshots are discovered from src/assets/work by filename, so adding one
 * is a one-step job: drop `<slug>.jpg` in that folder and it appears in the
 * slider and on the case-study page. No import, no map entry, no rebuild of
 * this file.
 *
 * The shots taken before this convention existed keep their old names, which
 * is what ALIASES is for. New ones should just be named after the slug, and
 * an old one gets to drop out of that map whenever its file is renamed.
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
export const PROJECTS: Project[] = (projectData as Omit<Project, "image">[])
  .map((p) => ({ ...p, image: imageFor(p.slug) }))
  /**
   * Work we can show leads; within that, newest first.
   *
   * Sorting on year alone put the two newest projects at the front of both
   * the homepage slider and /work, and neither has been screenshotted yet, so
   * the portfolio opened on two typeset plates. Ordering is a presentation
   * choice, not a claim about recency, and a plate at position 1 costs more
   * than a real screenshot at position 3 gains.
   *
   * This reverses itself as screenshots arrive: drop <slug>.jpg into
   * src/assets/work and that project sorts back up to where its year puts it.
   */
  .sort((a, b) => {
    if (Boolean(a.image) !== Boolean(b.image)) return a.image ? -1 : 1;
    return b.year - a.year;
  });

export const getProject = (slug?: string) => PROJECTS.find((p) => p.slug === slug);

/** Wraps around, so the case-study footer always has somewhere to go. */
export const nextProject = (slug: string) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
};

/** The project's sector in one language. Every project has all three. */
export const sectorOf = (p: Project, locale: Locale) => p.category[locale];
