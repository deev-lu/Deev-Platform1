import { useEffect } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import L from "./L";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  Cpu,
  Lightbulb,
  Tag,
  Target,
  TrendingUp,
} from "lucide-react";
import { getProject, nextProject, sectorOf } from "../../lib/projects";
import { useT, useLocalePath, useLocale } from "../../lib/useT";
import { track } from "../../lib/analytics";

/**
 * /work/:slug — a dedicated page per project.
 *
 * Opens full-bleed on the project's own image with the title over it, then a
 * mono specification table, then whatever narrative exists. Blocks with no
 * content simply do not render, so a project carrying only facts still reads
 * as a finished page rather than a page with holes in it.
 */
export default function WorkCase() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const t = useT();
  const locale = useLocale();
  const localePath = useLocalePath();
  const project = getProject(slug);

  useEffect(() => {
    // Stay in the reader's language when a bad slug bounces to the homepage.
    if (!project) navigate(localePath("/"), { replace: true });
  }, [project, navigate, localePath]);

  // Welche Referenz wird wirklich gelesen? Das entscheidet, welche drei auf
  // der Startseite stehen sollten - bisher war das eine Vermutung.
  useEffect(() => {
    if (project) track("case_view", { project: project.slug, locale });
  }, [project, locale]);

  if (!project) return null;

  const next = nextProject(project.slug);

  /* Links: nur, was belegt ist. Die Vorlage führt hier auch Zielgruppe und
     Land; beides steht bei uns nirgends, und eine Referenzseite ist der
     letzte Ort, an dem man so etwas schätzt. Eine Zeile ohne Wert fällt
     heraus, statt leer dazustehen. */
  const facts = [
    { icon: Building2, label: t.pages.workCase.spec.client, value: project.title },
    { icon: Tag, label: t.pages.workCase.spec.sector, value: sectorOf(project, locale) },
    { icon: Calendar, label: t.pages.workCase.spec.year, value: String(project.year) },
    project.stack?.length
      ? { icon: Cpu, label: t.pages.workCase.spec.stack, value: project.stack.join(" · ") }
      : null,
  ].filter((r): r is { icon: typeof Building2; label: string; value: string } => r !== null);

  /* Rechts: Aufgabe, Umfang, Ergebnis - dieselbe Dreiteilung wie in der
     Vorlage. Der Umfang kommt als Liste aus `scope`, also aus Daten, die jedes
     Projekt hat; die Prosa daneben ist optional. Ein Abschnitt ohne Inhalt
     wird nicht gerendert, und `outcome` ist fast überall leer, weil ein
     Ergebnis eine Aussage über den Kunden ist und einen Beleg braucht. */
  type Block = {
    icon: typeof Target;
    heading: string;
    body?: string;
    bullets?: string[];
  };
  const hasNarrative = Boolean(project.challenge?.[locale] || project.approach?.[locale] || project.outcome?.[locale]);

  const story: Block[] = ([
    project.challenge?.[locale]
      ? { icon: Target, heading: t.pages.workCase.brief, body: project.challenge[locale], bullets: undefined }
      : null,
    project.scope?.length || project.approach?.[locale]
      ? {
          icon: Lightbulb,
          heading: t.pages.workCase.built,
          body: project.approach?.[locale],
          bullets: project.scope?.map((k) => t.pages.workCase.scopeItems[k]),
        }
      : null,
    project.outcome?.[locale]
      ? { icon: TrendingUp, heading: t.pages.workCase.outcome, body: project.outcome[locale], bullets: undefined }
      : null,
  ] as (Block | null)[]).filter((r): r is Block => r !== null);

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">

      {/* ── Opening ─────────────────────────────────────────────── */}
      <header className="relative">
        {project.image ? (
          <div className="relative h-[62vh] min-h-[420px] overflow-hidden">
            <img
              src={project.image}
              alt={`${project.title}, ${sectorOf(project, locale)}`}
              width={1000}
              height={583}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--surface-0) 8%, rgba(8,9,11,0.45) 60%, rgba(8,9,11,0.25) 100%)" }} />
          </div>
        ) : (
          <div className="h-[34vh] min-h-[220px] border-b border-[var(--line)]" />
        )}

        <div
          className={`mx-auto ${project.image ? "-mt-40 relative z-10" : "pt-16"}`}
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
        >
          <L
            to="/work"
            className="group inline-flex items-center gap-2 text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)] mb-10"
            style={{ fontSize: "var(--t-small)" }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:-translate-x-1" strokeWidth={1.5} />
            {t.pages.workCase.back}
          </L>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.025em", maxWidth: "16ch" }}
          >
            {project.title}
          </motion.h1>
        </div>
      </header>

      {/* ── Specification ───────────────────────────────────────── */}
      <section
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
      >
        {/* Zwei Tafeln: links die harten Angaben, rechts die Erzählung.
            Vorher lief beides als eine Spalte Fließtext, und die Seite sah bei
            jedem Projekt gleich aus, egal wie viel dahinterstand.

            Die Tafeln sind flach, hart gekantet und tragen Signalblau statt
            runder farbiger Kreise: dieselbe Aufteilung wie die Vorlage, aber
            in der Formensprache des Brand Book. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── Die Fakten ──────────────────────────────────────── */}
          <div
            className="lg:col-span-5 border border-[var(--line)] bg-[var(--surface-1)] p-8 sm:p-10"
            style={{ borderRadius: "var(--radius-2)" }}
          >
            <dl className="space-y-7">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <span
                    className="shrink-0 flex items-center justify-center w-9 h-9 bg-[var(--signal-dim)] text-[var(--signal-text)]"
                    style={{ borderRadius: "var(--radius-1)" }}
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <dt
                      className="eyebrow-mono uppercase text-[var(--text-low)]"
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      {label}
                    </dt>
                    <dd className="text-[var(--text-hi)] mt-1.5" style={{ fontSize: "var(--t-body)", lineHeight: 1.45 }}>
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 w-full inline-flex items-center justify-center gap-2 h-[52px] px-7 bg-[var(--signal)] text-white font-medium"
                style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                {t.pages.workCase.visit}
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </a>
            )}
          </div>

          {/* ── Die Erzählung ───────────────────────────────────── */}
          <div
            className="lg:col-span-7 border border-[var(--line)] bg-[var(--surface-2)] p-8 sm:p-10"
            style={{ borderRadius: "var(--radius-2)" }}
          >
            {project.summary?.[locale] && (
              <p
                className="text-[var(--text-hi)] pb-9 mb-9 border-b border-[var(--line)]"
                style={{ fontSize: "var(--t-lead)", lineHeight: 1.45 }}
              >
                {project.summary[locale]}
              </p>
            )}

            {/* Der Umfang allein ist keine Fallstudie: ohne Aufgabe und ohne
                Beschreibung steht rechts eine Zeile, und die Tafel sieht aus,
                als fehle etwas. Sie sagt dann selbst, was sie zeigt. */}
            {story.length > 0 ? (
              <div className="space-y-9">
                {story.map(({ icon: Icon, heading, body, bullets }) => (
                  <div key={heading} className="flex items-start gap-4">
                    <span
                      className="shrink-0 flex items-center justify-center w-9 h-9 bg-[var(--signal-dim)] text-[var(--signal-text)]"
                      style={{ borderRadius: "var(--radius-1)" }}
                      aria-hidden="true"
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <h2
                        className="text-[var(--text-hi)] font-medium"
                        style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.01em" }}
                      >
                        {heading}
                      </h2>
                      {bullets && bullets.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {bullets.map((b) => (
                            <li
                              key={b}
                              className="flex gap-3 text-[var(--text)]"
                              style={{ fontSize: "var(--t-body)", lineHeight: 1.5 }}
                            >
                              <span
                                className="mt-[0.6em] h-px w-3 shrink-0 bg-[var(--signal)]"
                                aria-hidden="true"
                              />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                      {body && (
                        <p
                          className="text-[var(--text-mid)] mt-4"
                          style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "62ch" }}
                        >
                          {body}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {!hasNarrative && (
                  <p
                    className="text-[var(--text-mid)] pt-8 border-t border-[var(--line)]"
                    style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}
                  >
                    {t.pages.workCase.specOnly}
                  </p>
                )}
              </div>
            ) : (
              /* Kein erfundener Lückenfüller. Steht noch keine Fallstudie da,
                 sagt die Seite, was sie zeigt, statt Absätze zu erfinden. */
              <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.6 }}>
                {t.pages.workCase.specOnly}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Next project ────────────────────────────────────────── */}
      <section className="border-t border-[var(--line)]">
        <L
          to={`/work/${next.slug}`}
          className="group block hover:bg-[var(--surface-1)] transition-colors duration-[240ms]"
        >
          <div
            className="mx-auto flex items-baseline justify-between gap-8"
            style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "clamp(56px, 7vw, 96px)" }}
          >
            <div>
              <span
                className="eyebrow-mono uppercase text-[var(--text-low)] block mb-4"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {t.pages.workCase.next}
              </span>
              <span
                className="text-[var(--text-hi)] font-medium"
                style={{ fontSize: "var(--t-h2)", letterSpacing: "-0.025em" }}
              >
                {next.title}
              </span>
            </div>
            <ArrowUpRight
              className="w-7 h-7 shrink-0 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-all duration-[var(--dur-1)] group-hover:translate-x-1 group-hover:-translate-y-1"
              strokeWidth={1}
            />
          </div>
        </L>
      </section>
    </main>
  );
}
