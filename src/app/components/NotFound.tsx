import { ArrowRight } from "lucide-react";
import { PROJECTS } from "../../lib/projects";
import L from "./L";
import { useT } from "../../lib/useT";

/**
 * What renders at a URL that does not exist.
 *
 * Vercel serves dist/404.html — noindex, no canonical, real 404 status — and
 * this is what it hydrates into. It lists the work rather than dead-ending,
 * because most bad URLs on this site are old or mistyped project links.
 */
export default function NotFound() {
  const t = useT();

  return (
    <main
      className="min-h-[80vh] flex items-center bg-[var(--surface-0)]"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div
        className="mx-auto w-full"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <div className="flex items-center gap-4 mb-10">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.site.notFound.eyebrow}
          </span>
        </div>

        <h1
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em", maxWidth: "16ch" }}
        >
          {t.site.notFound.title}
        </h1>

        <p
          className="text-[var(--text-mid)] mt-6"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "48ch" }}
        >
          {t.site.notFound.body}
        </p>

        <L
          to="/"
          className="group inline-flex items-center gap-3 mt-10 h-12 px-7 bg-[var(--signal)] text-white hover:opacity-90 transition-opacity duration-[var(--dur-1)]"
          style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
        >
          {t.site.notFound.cta}
          <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5" strokeWidth={1.5} />
        </L>

        <div className="mt-16 pt-10 border-t border-[var(--line)]">
          <div
            className="eyebrow-mono uppercase text-[var(--text-low)] mb-6"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.site.notFound.workLabel}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12">
            {PROJECTS.map((p) => (
              <li key={p.slug} className="border-b border-[var(--line)]">
                <L
                  to={`/work/${p.slug}`}
                  className="flex items-baseline gap-4 py-4 text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
                >
                  <span className="flex-1 min-w-0 truncate" style={{ fontSize: "var(--t-small)" }}>
                    {p.title}
                  </span>
                  <span
                    className="eyebrow-mono uppercase text-[var(--text-low)] shrink-0"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {p.year}
                  </span>
                </L>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
