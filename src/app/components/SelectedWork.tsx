import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import L from "./L";
import { useT, useLocale } from "../../lib/useT";
import { PROJECTS, sectorOf, type Project } from "../../lib/projects";

/**
 * Die kuratierte Referenzsektion der Startseite.
 *
 * Warum sie den automatischen Slider ersetzt: Ein Slider, der von selbst
 * weiterläuft, ist die einzige Darstellung gewesen, in der man ein bestimmtes
 * Projekt nicht ansteuern konnte, ohne ihn zu erwischen. Drei feste Flächen mit
 * echten Links sind für einen Kaufentscheid besser als sechzehn, die an einem
 * vorbeiziehen. Das vollständige Portfolio bleibt unter /work erreichbar und
 * ist dort weiterhin filterbar.
 *
 * Ein großes Leitprojekt, zwei kleinere darunter. Auf dem Telefon stapeln sie
 * sich, das große bleibt oben.
 *
 * Was hier bewusst fehlt: Ergebniszahlen. Für keines der Projekte liegt eine
 * bestätigte Kennzahl vor, und eine erfundene wäre in einer Referenz die
 * teuerste Art von Fehler. Gezeigt wird, was geliefert wurde.
 */
export default function SelectedWork() {
  const t = useT();
  const reduce = useReducedMotion();

  // Die drei ersten mit Screenshot. PROJECTS ist screenshots-first sortiert.
  const picks = PROJECTS.filter((p) => p.image).slice(0, 3);
  if (picks.length < 3) return null;
  const [lead, ...rest] = picks;

  const rise = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      className="bg-[var(--surface-0)]"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-7">
              <span className="h-px w-10 bg-[var(--line-strong)]" />
              <span
                className="eyebrow-mono uppercase text-[var(--text-low)]"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                <span className="text-[var(--metal)]">01</span> / {t.home.selected.eyebrow}
              </span>
            </div>
            <h2
              className="text-[var(--text-hi)] font-medium"
              style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.028em", maxWidth: "18ch" }}
            >
              {t.home.selected.title}
            </h2>
            <p
              className="text-[var(--text-mid)] mt-5"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "54ch" }}
            >
              {t.home.selected.lead()}
            </p>
          </div>
          <L
            to="/work"
            className="group inline-flex items-center gap-2 text-[var(--text-mid)] hover:text-[var(--text-hi)] font-medium transition-colors duration-[var(--dur-1)] shrink-0"
            style={{ fontSize: "var(--t-small)" }}
          >
            {t.home.selected.all}
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </L>
        </div>

        <motion.div {...rise(0)}>
          <Card project={lead} featured />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {rest.map((p, i) => (
            <motion.div key={p.slug} {...rise(i + 1)}>
              <Card project={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ project, featured = false }: { project: Project; featured?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const scope = project.scope?.length
    ? project.scope.map((s) => t.pages.workCase.scopeItems[s]).join(" · ")
    : null;

  return (
    /* Zwei Ziele in einer Karte, und dafür darf sie kein <a> mehr sein: ein
       Link im Link ist ungültiges HTML, und Browser hängen den inneren dann
       einfach aus. Stattdessen deckt der Link zur Fallstudie die ganze Karte
       ab, und der Link zur echten Website liegt darüber. Beide bleiben echte
       Links mit eigenem Namen, also auch für Tastatur und Screenreader zwei
       getrennte Ziele. */
    <div
      className="group relative border border-[var(--line)] bg-[var(--surface-1)] overflow-hidden hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-2)]"
      style={{ borderRadius: "var(--radius-1)" }}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: featured ? "1200 / 430" : "1000 / 583" }}>
        <img
          src={project.image}
          alt={`${project.title}, ${sectorOf(project, locale)}`}
          width={1200}
          height={680}
          loading={featured ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[var(--dur-4)] group-hover:scale-[1.02]"
        />

        {/* Zur echten Website. Über dem Kartenlink, damit der Klick hier
            landet und nicht auf der Fallstudie. */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 h-9 px-3.5 bg-[var(--surface-0)]/90 border border-[var(--line-strong)] text-[var(--text-hi)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
          >
            {t.pages.workCase.visit}
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </a>
        )}
      </div>

      <div className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 ${featured ? "p-7 sm:p-8" : "p-6"}`}>
        <div className="min-w-0">
          <h3
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: featured ? "var(--t-h3)" : "var(--t-body)", letterSpacing: "-0.015em" }}
          >
            {/* Der Kartenlink. Er liegt als Fläche über der ganzen Karte, sein
                Text steht aber hier, damit die Überschrift sein Name ist. */}
            <L to={`/work/${project.slug}`} className="after:absolute after:inset-0 after:z-10">
              {project.title}
            </L>
          </h3>
          <p
            className="eyebrow-mono uppercase text-[var(--text-low)] mt-2"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {sectorOf(project, locale)} / {project.year}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Was wir geliefert haben, nicht was es gebracht hat. */}
          {scope && (
            <span className="text-[var(--text-mid)] hidden sm:inline" style={{ fontSize: "var(--t-small)" }}>
              {scope}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1.5 text-[var(--signal-text)] font-medium"
            style={{ fontSize: "var(--t-small)" }}
          >
            {t.home.selected.view}
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
