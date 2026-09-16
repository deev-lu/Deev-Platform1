import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import L from "./L";
import { useT, useLocale } from "../../lib/useT";
import { PROJECTS, type Project, sectorOf } from "../../lib/projects";
import { WORK_CATEGORIES, categoryPath, inCategory } from "../../lib/workCategories";

/**
 * /work — the portfolio as a page of its own.
 *
 * The homepage carries one project at a time. This is where all of them live,
 * split by the kind of work rather than listed flat, because "websites",
 * "online stores" and "web apps" are three different questions a visitor
 * arrives with.
 *
 * Built for the phone first: one card per row, each one large enough to read
 * the work in, filters as a scrollable rail rather than a wrapped block of
 * chips, and the count of what you are looking at. Two and three columns come
 * later, at the widths that can hold them.
 */

const domainOf = (link?: string) =>
  link ? link.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") : "";

export default function WorkIndex({ categorySlug = "" }: { categorySlug?: string }) {
  const t = useT();
  const locale = useLocale();
  const reduce = useReducedMotion();

  // The category comes from the route, so the URL is always the truth about
  // what is on screen and every category can be linked to directly.
  const current = WORK_CATEGORIES.find((c) => c.slug === categorySlug) ?? WORK_CATEGORIES[0];

  // PROJECTS already arrives ordered: screenshots first, newest within that.
  // Re-sorting on year here would undo it and put the plates back on top.
  const all = useMemo(() => [...PROJECTS], []);
  const shown = all.filter((p) => inCategory(p, current.tag));
  const countFor = (tag: string | null) => all.filter((p) => inCategory(p, tag)).length;

  // Das Leitprojekt nur, wenn es eine Aufnahme hat - eine grosse Flaeche mit
  // Platzhaltermuster waere das Gegenteil des Gewuenschten.
  const lead = shown[0]?.image ? shown[0] : undefined;
  const grid = lead ? shown.slice(1) : shown;

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">
      <header
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
      >
        <div className="flex items-center gap-4 mb-10">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.pages.work.eyebrow}
          </span>
        </div>

        <h1
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "14ch" }}
        >
          {t.pages.work.title}
        </h1>

        <p
          className="text-[var(--text-mid)] mt-6"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "46ch" }}
        >
          {t.pages.work.lead}
        </p>

        {/* A rail, not a wrapped block: on a phone it scrolls sideways with
            the thumb instead of stacking into three rows of chips. */}
        <div className="mt-12 -mx-[var(--gutter)] px-[var(--gutter)] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {WORK_CATEGORIES.filter((c) => countFor(c.tag) > 0).map((c) => {
              const active = c.slug === current.slug;
              return (
                <L
                  key={c.key}
                  to={categoryPath(c.slug)}
                  aria-current={active ? "page" : undefined}
                  className={`eyebrow-mono uppercase inline-flex items-center gap-2 h-11 px-5 border transition-colors duration-[var(--dur-1)] ${
                    active
                      ? "bg-[var(--signal)] border-[var(--signal)] text-white"
                      : "border-[var(--line)] text-[var(--text-mid)] hover:border-[var(--line-strong)] hover:text-[var(--text-hi)]"
                  }`}
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", borderRadius: "var(--radius-1)" }}
                >
                  {/* Ohne Zahl. Die Gesamtzahl der gezeigten Projekte ist
                      keine oeffentliche Aussage: das Portfolio ist eine
                      Auswahl, keine Bilanz. */}
                  {t.pages.work.filters[c.key]}
                </L>
              );
            })}
          </div>
        </div>
      </header>

      <div
        className="mx-auto pb-[var(--section-y)]"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        {/* Das erste Projekt gross, der Rest im Raster.
            Sechzehn gleich grosse Kacheln sind eine Wand: nichts fuehrt das
            Auge, und der Besucher entscheidet nach Bildzufall statt nach
            Relevanz. Eine grosse Aufnahme oben gibt der Seite einen Anfang und
            zeigt die Arbeit in der Groesse, in der man sie beurteilen kann. */}
        {lead && (
          <div className="mb-6">
            <Card project={lead} index={0} reduce={!!reduce} featured />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {grid.map((p, i) => (
            <Card key={p.slug} project={p} index={i} reduce={!!reduce} />
          ))}
        </div>

      </div>
    </main>
  );
}

function Card({
  project,
  index,
  reduce,
  featured = false,
}: {
  project: Project;
  index: number;
  reduce: boolean;
  featured?: boolean;
}) {
  const locale = useLocale();
  const t = useT();
  // Was wir gemacht haben, nicht nur fuer wen. Ohne diese Zeile sagt eine
  // Kachel nur "Website, 2025" und der Besucher muss sie oeffnen, um zu
  // erfahren, was daran unsere Arbeit war.
  const scope = project.scope?.length
    ? project.scope.map((k) => t.pages.workCase.scopeItems[k]).join(" · ")
    : null;
  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index % 3, 2) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Zwei Ziele, wie auf der Startseite: die Flaeche oeffnet die
          Fallstudie, der Knopf im Bild fuehrt direkt zur echten Website. Ein
          Link im Link ist ungueltiges HTML, deshalb ist die Karte ein <div>
          und der Kartenlink liegt als Flaeche unter der Ueberschrift. */}
      <div
        className="group relative border border-[var(--line)] hover:border-[var(--line-strong)] bg-[var(--surface-1)] overflow-hidden transition-colors duration-[var(--dur-1)]"
        style={{ borderRadius: "var(--radius-1)" }}
      >
        <div className="flex items-center gap-3 px-4 h-10 border-b border-[var(--line)] bg-[var(--surface-2)]">
          <span className="flex gap-1.5 shrink-0" aria-hidden="true">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
          </span>
          <span
            className="eyebrow-mono lowercase text-[var(--text-low)] truncate"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.08em" }}
          >
            {domainOf(project.link)}
          </span>
        </div>

        <div className="relative w-full overflow-hidden" style={{ aspectRatio: featured ? "1600 / 620" : "1000 / 583" }}>
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title}, ${sectorOf(project, locale)}`}
              loading="lazy"
              decoding="async"
              width={1000}
              height={583}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[var(--dur-4)] group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-end p-6 bg-[var(--surface-2)]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, var(--line) 0 1px, transparent 1px 84px), repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px 84px)",
              }}
            >
              <span
                className="text-[var(--text-hi)] font-medium"
                style={{ fontSize: "var(--t-h3)", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "12ch" }}
              >
                {sectorOf(project, locale)}
              </span>
            </div>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 h-8 px-3 bg-[var(--surface-0)]/90 border border-[var(--line-strong)] text-[var(--text-hi)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-label)", borderRadius: "var(--radius-1)" }}
            >
              {t.pages.workCase.visit}
              <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} />
            </a>
          )}
        </div>

        {/* Eine Grundlinie fuer alles: Titel, Angabe und Umfang beginnen an
            derselben Kante, der Pfeil sitzt rechts. Vorher richtete sich der
            Pfeil an der ersten Zeile aus und die Bloecke standen je nach
            Textlaenge unterschiedlich hoch. */}
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="min-w-0">
            <h2
              className="text-[var(--text-hi)] font-medium truncate"
              style={{ fontSize: featured ? "var(--t-h3)" : "var(--t-body)", letterSpacing: "-0.01em" }}
            >
              <L to={`/work/${project.slug}`} className="after:absolute after:inset-0 after:z-10">
                {project.title}
              </L>
            </h2>
            <p
              className="eyebrow-mono uppercase text-[var(--text-low)] mt-1.5 truncate"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {sectorOf(project, locale)} / {project.year}
            </p>
            {scope && (
              <p className="text-[var(--text-mid)] mt-3" style={{ fontSize: "var(--t-small)" }}>
                {scope}
              </p>
            )}
          </div>
          <ArrowUpRight
            className="w-4 h-4 shrink-0 mt-1 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </motion.article>
  );
}
