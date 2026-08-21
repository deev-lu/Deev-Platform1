import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { PROJECTS } from "../../lib/projects";

// Data lives in src/lib/projects.ts so the grid and the /work/:slug pages
// can never drift apart.
const portfolioItems = PROJECTS;

/** feltes.lu from https://www.feltes.lu/ — the address bar, not the full URL. */
const domainOf = (link?: string) => {
  if (!link) return "";
  return link.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
};

const filters = ["All", "Website", "E-commerce", "Web App"];

const countFor = (f: string) =>
  f === "All" ? portfolioItems.length : portfolioItems.filter((i) => i.filter === f).length;

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.filter === activeFilter);

  const featured = filtered.filter((i) => i.image);
  const rest = filtered.filter((i) => !i.image);

  return (
    <section className="relative bg-[var(--surface-0)] border-t border-[var(--line)]" style={{ paddingBlock: "var(--section-y)" }}>

      <div className="relative z-10 mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="text-[var(--metal)]">04</span> / Selected work
            </span>
          </div>
          <h2
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em", maxWidth: "18ch" }}
          >
            Projects we&rsquo;re proud of.
          </h2>
          <p
            className="text-[var(--text-mid)] mt-6"
            style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "48ch" }}
          >
            From luxury travel to artisan spirits — every project is built with
            the same commitment to craft, performance, and results.
          </p>
        </motion.div>

        {/* Filter Tabs (with counts) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`eyebrow-mono inline-flex items-center gap-1.5 px-4 h-9 uppercase border transition-colors duration-[var(--dur-1)] ${
                  active
                    ? "text-white"
                    : "border-[var(--line)] text-[var(--text-mid)] hover:border-[var(--line-strong)] hover:text-[var(--text-hi)]"
                }`}
                style={active
                  ? { background: "var(--signal)", borderColor: "var(--signal)", fontSize: "var(--t-label)", letterSpacing: "0.16em" }
                  : { fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {filter}
                <sup
                  className={`tabular-nums ${active ? "text-white/70" : "text-[var(--text-low)]"}`}
                  style={{ fontSize: "0.625em" }}
                >
                  {countFor(filter)}
                </sup>
              </button>
            );
          })}
        </motion.div>

        {/* Featured — real screenshots of shipped work */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          <AnimatePresence mode="popLayout">
            {featured.map((item, index) => {
              return (
                <motion.div
                  key={item.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: Math.min(index, 4) * 0.06 }}
                  className={index % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"}
                >
                  <Link
                    to={`/work/${item.slug}`}
                    className="group relative flex flex-col overflow-hidden border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors duration-[240ms] bg-[var(--surface-2)] h-[clamp(280px,30vw,440px)]"
                  >
                    {/* A browser bar, so the client's own navigation inside the
                        screenshot reads as part of a website rather than as a
                        stray strip across the top of a photograph. The domain
                        doubles as proof the site is real and live. */}
                    <div className="flex items-center gap-3 px-4 h-9 shrink-0 border-b border-[var(--line)] bg-[var(--surface-1)]">
                      <span className="flex gap-1.5 shrink-0" aria-hidden="true">
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
                        <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
                      </span>
                      <span
                        className="eyebrow-mono lowercase text-[var(--text-low)] truncate"
                        style={{ fontSize: "var(--t-label)", letterSpacing: "0.08em" }}
                      >
                        {domainOf(item.link)}
                      </span>
                      <ArrowUpRight
                        className="ml-auto shrink-0 w-3.5 h-3.5 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="relative flex-1 overflow-hidden">
                      <img
                        src={item.image}
                        alt={`${item.title} — live website`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[640ms] ease-[cubic-bezier(0.16,1,0.30,1)] group-hover:scale-[1.03]"
                      />

                      <div
                        className="absolute inset-0 transition-opacity duration-[var(--dur-2)] opacity-90 group-hover:opacity-100"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(6,7,9,0.92) 0%, rgba(6,7,9,0.72) 24%, rgba(6,7,9,0.28) 54%, rgba(6,7,9,0) 78%)",
                        }}
                      />

                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                        <div
                          className="eyebrow-mono uppercase text-white/60 truncate mb-2"
                          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                        >
                          {item.category} · {item.year}
                        </div>
                        <h3
                          className="text-white font-medium truncate"
                          style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.01em", lineHeight: 1.15 }}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* More work — compact rows */}
        {rest.length > 0 && (
          <>
            <div className="eyebrow-mono uppercase text-[var(--text-low)] mb-5 mt-14" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
              More work
            </div>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[var(--line)]">
              <AnimatePresence mode="popLayout">
                {rest.map((item, index) => {
                  return (
                    <motion.div
                      key={item.title}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <Link
                        to={`/work/${item.slug}`}
                        className="glass glass-edge glass-sheen group relative flex items-center gap-3.5 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 dark:"
                      >
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#2563F6] to-[#3CE7FC] flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[var(--text-hi)] font-medium leading-snug truncate" style={{ fontSize: "var(--t-small)" }}>
                            {item.title}
                          </h3>
                          <div className="eyebrow-mono uppercase text-[var(--text-low)] truncate mt-1" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                            {item.category} · {item.year}
                          </div>
                        </div>
                        <ArrowUpRight className="shrink-0 w-4 h-4 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-all duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.25} />
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* Count */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-6 mt-14 pt-8 border-t border-[var(--line)]"
        >
          <p className="eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
            <span className="text-[var(--text-hi)]">
              {portfolioItems.length}+
            </span>{" "}
            projects delivered across Europe
          </p>
        </motion.div>
      </div>
    </section>
  );
}
