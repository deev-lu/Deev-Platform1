import { useEffect } from "react";
import { motion } from "motion/react";
import { Link, useParams, useNavigate } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProject, nextProject } from "../../lib/projects";
import { scrollToTop } from "../../lib/smoothScroll";

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
  const project = getProject(slug);

  useEffect(() => {
    scrollToTop(true);
  }, [slug]);

  useEffect(() => {
    if (!project) navigate("/", { replace: true });
  }, [project, navigate]);

  if (!project) return null;

  const next = nextProject(project.slug);
  const spec: [string, string][] = [
    ["Client", project.title],
    ["Sector", project.category],
    ["Type", project.filter],
    ["Year", String(project.year)],
  ];

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">

      {/* ── Opening ─────────────────────────────────────────────── */}
      <header className="relative">
        {project.image ? (
          <div className="relative h-[62vh] min-h-[420px] overflow-hidden">
            <img
              src={project.image}
              alt={`${project.title}, ${project.category}`}
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
          <Link
            to="/#portfolio"
            className="group inline-flex items-center gap-2 text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)] mb-10"
            style={{ fontSize: "var(--t-small)" }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:-translate-x-1" strokeWidth={1.5} />
            All work
          </Link>

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

          <dl className="lg:col-span-5 border-t border-[var(--line)]">
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
            {project.stack && project.stack.length > 0 && (
              <div className="flex items-baseline justify-between gap-6 py-5 border-b border-[var(--line)]">
                <dt
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  Stack
                </dt>
                <dd className="text-[var(--text-hi)] text-right" style={{ fontSize: "var(--t-body)" }}>
                  {project.stack.join(" · ")}
                </dd>
              </div>
            )}

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 mt-10 text-[var(--text-hi)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                style={{ fontSize: "var(--t-small)" }}
              >
                Visit the live site
                <ArrowUpRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
              </a>
            )}
          </dl>

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
              ["The brief", project.challenge],
              ["What we built", project.approach],
              ["The outcome", project.outcome],
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
        <Link
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
                Next project
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
        </Link>
      </section>
    </main>
  );
}
