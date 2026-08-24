import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "../../lib/projects";

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

const FILTERS = ["All", "Website", "E-commerce", "Web App"] as const;
type Filter = (typeof FILTERS)[number];

const LABEL: Record<Filter, string> = {
  All: "Everything",
  Website: "Websites",
  "E-commerce": "Online stores",
  "Web App": "Web apps",
};

const domainOf = (link?: string) =>
  link ? link.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") : "";

export default function WorkIndex() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");

  // Newest first, so the page opens on the most recent work.
  const all = useMemo(() => [...PROJECTS].sort((a, b) => b.year - a.year), []);
  const shown = filter === "All" ? all : all.filter((p) => p.filter === filter);
  const countFor = (f: Filter) => (f === "All" ? all.length : all.filter((p) => p.filter === f).length);

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
            Selected work
          </span>
        </div>

        <h1
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "14ch" }}
        >
          Every project we ship.
        </h1>

        <p
          className="text-[var(--text-mid)] mt-6"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "46ch" }}
        >
          Websites, online stores and web apps, built in Luxembourg for
          companies across Europe.
        </p>

        {/* A rail, not a wrapped block: on a phone it scrolls sideways with
            the thumb instead of stacking into three rows of chips. */}
        <div className="mt-12 -mx-[var(--gutter)] px-[var(--gutter)] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`eyebrow-mono uppercase inline-flex items-center gap-2 h-11 px-5 border transition-colors duration-[var(--dur-1)] cursor-pointer ${
                    active
                      ? "bg-[var(--signal)] border-[var(--signal)] text-white"
                      : "border-[var(--line)] text-[var(--text-mid)] hover:border-[var(--line-strong)] hover:text-[var(--text-hi)]"
                  }`}
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", borderRadius: "var(--radius-1)" }}
                >
                  {LABEL[f]}
                  <span className={active ? "text-white/70" : "text-[var(--text-low)]"}>{countFor(f)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div
        className="mx-auto pb-[var(--section-y)]"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {shown.map((p, i) => (
            <Card key={p.slug} project={p} index={i} reduce={!!reduce} />
          ))}
        </div>

        <p
          className="eyebrow-mono uppercase text-[var(--text-low)] mt-12"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          <span className="text-[var(--text-hi)]">{shown.length}</span>{" "}
          {shown.length === 1 ? "project" : "projects"}
          {filter !== "All" && ` in ${LABEL[filter].toLowerCase()}`}
        </p>
      </div>
    </main>
  );
}

function Card({ project, index, reduce }: { project: Project; index: number; reduce: boolean }) {
  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index % 3, 2) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/work/${project.slug}`}
        className="group block border border-[var(--line)] hover:border-[var(--line-strong)] bg-[var(--surface-1)] overflow-hidden transition-colors duration-[var(--dur-1)]"
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

        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1000 / 583" }}>
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title}, ${project.category}`}
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
                {project.category}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="min-w-0">
            <h2
              className="text-[var(--text-hi)] font-medium truncate"
              style={{ fontSize: "var(--t-body)", letterSpacing: "-0.01em" }}
            >
              {project.title}
            </h2>
            <p
              className="eyebrow-mono uppercase text-[var(--text-low)] mt-1.5 truncate"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {project.category} / {project.year}
            </p>
          </div>
          <ArrowUpRight
            className="w-4 h-4 shrink-0 mt-1 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </div>
      </Link>
    </motion.article>
  );
}
