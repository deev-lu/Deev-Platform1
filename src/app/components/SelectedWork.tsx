import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import L from "./L";
import { TwoTone } from "./Plate";
import { useT, useLocale } from "../../lib/useT";
import { PROJECTS, sectorOf, type Project } from "../../lib/projects";

/**
 * 02 auf der Startseite: ausgewaehlte Arbeit.
 *
 * Seit dem 13.10.2026 ein Raster aus fuenf Karten statt eines grossen
 * Bildschirmfotos mit zwei kleinen darunter. Jede Karte zeigt das echte
 * Bildschirmfoto in einem Browserrahmen mit der Domain, der aus einer
 * punktierten Flaeche aufsteigt; oben stehen Branche, Jahr, Titel und was
 * wir geliefert haben. Die ganze Karte fuehrt zur Fallstudie, ein eigener
 * Knopf zur echten Website.
 *
 * Reihenfolge: 7/5 in der ersten Reihe, drei gleiche in der zweiten. Auf dem
 * Telefon gestapelt.
 *
 * Beim Darueberfahren fuellt sich die Karte mit einem blauen Verlauf
 * (`.m-flowcard`), Titel und Pillen werden weiss, der Pfeilknopf weiss mit
 * blauem Pfeil und dreht sich, das Bildschirmfoto steigt.
 *
 * Was bewusst fehlt: Ergebniszahlen. Fuer keines der Projekte liegt eine
 * bestaetigte Kennzahl vor, und eine erfundene waere in einer Referenz die
 * teuerste Art von Fehler. Gezeigt wird, was geliefert wurde.
 */
export default function SelectedWork() {
  const t = useT();
  const reduce = useReducedMotion();

  // PROJECTS ist screenshots-first sortiert.
  const picks = PROJECTS.filter((p) => p.image).slice(0, 5);
  if (picks.length < 5) return null;

  const rise = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: reduce ? 0 : 0.6, delay: reduce ? 0 : (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  });

  const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

  return (
    <section className="bg-[var(--surface-0)]" style={{ paddingTop: "var(--section-y)", paddingBottom: "var(--section-y-lg)" }}>
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8 items-end">
          <div className="lg:col-span-7">
            <div
              className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="h-px w-10 bg-[var(--line-strong)]" />
              <span>
                <span className="text-[var(--metal)]">02</span> / {t.home.selected.eyebrow}
              </span>
            </div>
            <h2
              className="text-[var(--text-hi)] font-medium mt-8"
              style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "16ch" }}
            >
              <TwoTone text={t.home.selected.title} />
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col items-start gap-6">
            <p className="text-[var(--text-mid)] m-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "42ch" }}>
              {t.home.selected.lead()}
            </p>
            <L
              to="/work"
              className="group inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[var(--line-strong)] text-[var(--text-hi)] font-medium hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-small)" }}
            >
              {t.home.selected.all}
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </L>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 mt-14 lg:mt-20">
          {picks.map((p, i) => (
            <motion.div key={p.slug} {...rise(i)} className={`min-w-0 ${spans[i]} ${i === 0 ? "md:col-span-2" : ""}`}>
              <Card project={p} large={i < 2} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function domainOf(link?: string) {
  if (!link) return null;
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function Card({ project, large = false }: { project: Project; large?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const scope = project.scope?.map((s) => t.pages.workCase.scopeItems[s]) ?? [];
  const domain = domainOf(project.link);

  return (
    /* Zwei Ziele in einer Karte, also kein <a> um alles: ein Link im Link ist
       ungueltiges HTML. Der Link zur Fallstudie deckt die ganze Karte ab (sein
       Text ist der Titel), der Link zur echten Website liegt darueber. */
    <article
      className={`m-flowcard group relative flex flex-col overflow-hidden border border-[var(--line)] bg-[var(--surface-1)] hover:border-[#7faeff]/60 focus-within:border-[#7faeff]/60 hover:-translate-y-1 transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${large ? "h-[480px] sm:h-[560px]" : "h-[440px] sm:h-[480px]"}`}
      style={{ borderRadius: 24 }}
    >
      {/* Punktraster als Buehne, wie auf den Signal-Lumen-Tafeln */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity duration-500"
        style={{ backgroundImage: "radial-gradient(var(--line-strong) 1px, transparent 1.2px)", backgroundSize: "18px 18px", backgroundPosition: "9px 9px" }}
      />

      <div className={`relative z-[1] ${large ? "p-6 sm:p-8" : "p-6"}`}>
        <div className="flex items-center justify-between gap-4">
          <span className="eyebrow-mono uppercase text-[var(--text-low)] group-hover:text-white/75 transition-colors duration-500 truncate" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
            {sectorOf(project, locale)} · {project.year}
          </span>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              className="relative z-20 shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[var(--line)] bg-[var(--surface-0)] text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] group-hover:bg-white/10 group-hover:border-white/40 group-hover:text-white transition-colors duration-500"
              style={{ fontSize: "0.75rem" }}
            >
              {t.pages.workCase.visit}
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          )}
        </div>

        <div className="flex items-start justify-between gap-4 mt-4">
          <h3
            className="display text-[var(--text-hi)] group-hover:text-white transition-colors duration-500 m-0"
            style={{ fontSize: large ? "clamp(1.5rem, 1.1rem + 1.2vw, 2.25rem)" : "var(--t-h3)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
          >
            <L to={`/work/${project.slug}`} className="after:absolute after:inset-0 after:z-10">
              {project.title}
            </L>
          </h3>
          <span
            aria-hidden="true"
            className="shrink-0 w-11 h-11 rounded-full border border-[var(--line-strong)] flex items-center justify-center text-[var(--text-hi)] group-hover:bg-white group-hover:border-white group-hover:text-[#123a9e] group-hover:rotate-45 transition-[background-color,border-color,color,transform] duration-500"
          >
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
          </span>
        </div>

        {scope.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-4">
            {scope.map((s) => (
              <li
                key={s}
                className="px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--text-mid)] group-hover:border-white/40 group-hover:text-white group-hover:bg-white/10 transition-colors duration-500"
                style={{ fontSize: "0.75rem", lineHeight: 1.2 }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Das Bildschirmfoto im Browserrahmen, unten angeschnitten */}
      <div className={`relative flex-1 ${large ? "mx-6 sm:mx-10" : "mx-6"}`}>
        <div
          className="absolute inset-x-0 top-2 -bottom-12 flex flex-col border border-[var(--line-strong)] bg-[var(--surface-0)] overflow-hidden transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2.5"
          style={{ borderRadius: "16px 16px 0 0" }}
        >
          <div className="shrink-0 flex items-center gap-1.5 h-8 px-3 border-b border-[var(--line)]">
            <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
            <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
            <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
            {domain && (
              <span className="mx-auto px-3 h-5 inline-flex items-center rounded-full bg-[var(--surface-1)] eyebrow-mono text-[var(--text-low)] truncate" style={{ fontSize: "0.625rem", letterSpacing: "0.06em" }}>
                {domain}
              </span>
            )}
          </div>
          <img
            src={project.image}
            alt={`${project.title}, ${sectorOf(project, locale)}`}
            width={1200}
            height={750}
            loading="lazy"
            decoding="async"
            className="block w-full flex-1 min-h-0 object-cover object-top"
          />
        </div>
      </div>
    </article>
  );
}
