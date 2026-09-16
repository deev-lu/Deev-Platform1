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

  /* ── Öffentliche Einordnung ────────────────────────────────────────────
     Ein Projekt gehört in mehrere Schubladen, und das Erzwingen einer
     einzigen war eine Vereinfachung, die Arbeit unterschlägt: Feltes ist
     Website UND Plattform, Vino Amore Website UND Onlineshop. Wer nach
     "Webanwendungen" filtert, soll Feltes finden.

     `filter` bleibt daneben bestehen, weil die alten Kategorie-URLs darauf
     zeigen; `services` ist die Wahrheit, `filter` die Altlast. */
  services?: ServiceTag[];

  /** Eigenes Produkt, kein Kundenauftrag. Wird als Etikett gezeigt. */
  ownProduct?: boolean;

  /** Ort und Branche, wenn belegt. Leere Felder werden nicht gerendert. */
  location?: string;
  industry?: Record<Locale, string>;
  audience?: Record<Locale, string>;

  /* ── Die Fallstudie, Fortsetzung ──────────────────────────────────── */

  /** Was konkret geliefert wurde, projektspezifisch, nicht als Symbolkarten. */
  deliverables?: Record<Locale, string[]>;

  /** "Unter der Oberfläche": Integrationen, CMS, Zahlungsanbieter, Logik. */
  technical?: Record<Locale, string[]>;

  /**
   * Belegte Kennzahlen. Fehlen sie, verschwindet der Abschnitt vollständig.
   * Es gibt hier absichtlich keinen Platzhalter und keinen Vorgabewert: eine
   * erfundene Prozentzahl auf einer Referenzseite ist der teuerste Fehler,
   * den diese Website machen kann.
   */
  metrics?: { value: string; label: Record<Locale, string> }[];

  /** Nur mit echtem, freigegebenem Zitat. Sonst fehlt der Abschnitt. */
  testimonial?: { quote: Record<Locale, string>; name: string; role?: Record<Locale, string> };

  /* ── Interne Steuerung. Erscheint nirgends im Browser. ─────────────────
     Das Portfolio wurde nach Jahr sortiert. Ein starkes Projekt von 2024 ist
     aber kommerziell mehr wert als ein kleines von 2026, und diese
     Entscheidung gehört DEEV, nicht einem Vergleichsoperator.

     Rang und Einstufung werden nie ausgeliefert: ein kleinerer Kunde darf
     öffentlich nicht als weniger wichtig markiert sein. */
  homepageRank?: number;
  portfolioRank?: number;
  tier?: "A" | "B" | "C";
  scale?: "small" | "medium" | "large";
  caseStudy?: "full" | "short" | "none";
}

/**
 * Die Leistungsarten, nach denen öffentlich gefiltert wird.
 *
 * `ai` steht schon hier, obwohl noch kein Projekt es trägt: die Filterleiste
 * zeigt nur Kategorien, in denen etwas liegt, damit niemand auf eine leere
 * Seite klickt. Sobald ein Projekt `ai` bekommt, erscheint der Filter.
 */
export type ServiceTag = "website" | "software" | "ecommerce" | "ai";

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
   * Kuratiert, nicht chronologisch.
   *
   * Vorher: Aufnahme vorhanden, dann Jahr absteigend. Das Jahr entschied damit
   * über die Reihenfolge des Portfolios, und ein starkes Projekt von 2024
   * landete hinter einem kleinen von 2026. Welche Arbeit vorn steht, ist eine
   * Vertriebsentscheidung.
   *
   * Reihenfolge der Kriterien:
   *   1. eine Aufnahme gibt es oder nicht - ohne Bild trägt keine Kachel
   *   2. `portfolioRank`, von Hand gesetzt, kleinste Zahl zuerst
   *   3. eine ausgeschriebene Fallstudie vor einer kurzen vor keiner
   *   4. das Jahr, als letztes Signal
   */
  .sort((a, b) => {
    if (Boolean(a.image) !== Boolean(b.image)) return a.image ? -1 : 1;

    const rank = (p: Project) => p.portfolioRank ?? Number.MAX_SAFE_INTEGER;
    if (rank(a) !== rank(b)) return rank(a) - rank(b);

    const depth = (p: Project) => ({ full: 0, short: 1, none: 2 }[p.caseStudy ?? "none"]);
    if (depth(a) !== depth(b)) return depth(a) - depth(b);

    return b.year - a.year;
  });

/**
 * Die Startseite hat ihre eigene, von Hand gesetzte Reihenfolge.
 *
 * Bewusst getrennt vom Portfolio: was oben auf der Startseite steht, ist die
 * engste Auswahl überhaupt und wird öfter gewechselt als die Sortierung des
 * ganzen Portfolios. Ein Projekt ohne Aufnahme fällt heraus, statt eine leere
 * Fläche zu hinterlassen.
 */
export const HOMEPAGE_FEATURED: Project[] = PROJECTS.filter(
  (p) => p.homepageRank !== undefined && p.image,
).sort((a, b) => a.homepageRank! - b.homepageRank!);

export const getProject = (slug?: string) => PROJECTS.find((p) => p.slug === slug);

/** Wraps around, so the case-study footer always has somewhere to go. */
export const nextProject = (slug: string) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
};

/** The project's sector in one language. Every project has all three. */
export const sectorOf = (p: Project, locale: Locale) => p.category[locale];
