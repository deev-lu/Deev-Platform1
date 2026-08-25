import { useEffect } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import L from "./L";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProject, nextProject, sectorOf } from "../../lib/projects";
import { useT, useLocalePath, useLocale } from "../../lib/useT";

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

  if (!project) return null;

  const next = nextProject(project.slug);
  const spec: [string, string][] = [
    [t.pages.workCase.spec.client, project.title],
    [t.pages.workCase.spec.sector, sectorOf(project, locale)],
    // No Type row. It carried the filter value, which is plural on purpose
    // ("Web apps" names a category of many) and read wrong for a single
    // project, and "What we did" below now says the same thing in the
    // singular. One row, not two.
    [t.pages.workCase.spec.year, String(project.year)],
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12">

          {/* The link used to sit inside the <dl>, which is invalid: a
              definition list may only contain dt/dd groups. */}
          <div className="lg:col-span-5">
          <dl className="border-t border-[var(--line)]">
            {spec.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 py-5 border-b border-[var(--line)]">
                <dt
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {k}
                </dt>
                <dd className="text-[var(--text-hi)] text-right" style={{ fontSize: "var(--t-body)" }}>
                  {v}
                </dd>
              </div>
            ))}
            {project.scope && project.scope.length > 0 && (
              <div className="flex items-baseline justify-between gap-6 py-5 border-b border-[var(--line)]">
                <dt
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {t.pages.workCase.scope}
                </dt>
                <dd className="text-[var(--text-hi)] text-right" style={{ fontSize: "var(--t-body)" }}>
                  {project.scope.map((k) => t.pages.workCase.scopeItems[k]).join(" \u00B7 ")}
                </dd>
              </div>
            )}

            {project.stack && project.stack.length > 0 && (
              <div className="flex items-baseline justify-between gap-6 py-5 border-b border-[var(--line)]">
                <dt
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {t.pages.workCase.spec.stack}
                </dt>
                <dd className="text-[var(--text-hi)] text-right" style={{ fontSize: "var(--t-body)" }}>
                  {project.stack.join(" · ")}
                </dd>
              </div>
            )}

          </dl>

          {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 mt-10 text-[var(--text-hi)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                style={{ fontSize: "var(--t-small)" }}
              >
              {t.pages.workCase.visit}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </a>
          )}
          </div>


          <div className="lg:col-span-7">
            {project.summary && (
              <p
                className="text-[var(--text)] mb-12"
                style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "48ch" }}
              >
                {project.summary}
              </p>
            )}

            {([
              [t.pages.workCase.brief, project.challenge],
              [t.pages.workCase.built, project.approach],
              [t.pages.workCase.outcome, project.outcome],
            ] as [string, string | undefined][])
              .filter(([, body]) => Boolean(body))
              .map(([heading, body]) => (
                <div key={heading} className="mb-12">
                  <h2
                    className="text-[var(--text-hi)] font-medium mb-4"
                    style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.01em" }}
                  >
                    {heading}
                  </h2>
                  <p
                    className="text-[var(--text-mid)]"
                    style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "62ch" }}
                  >
                    {body}
                  </p>
                </div>
              ))}
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
