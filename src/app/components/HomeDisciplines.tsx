import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";

/**
 * 01 auf der Startseite: was wir tun.
 *
 * Nach dem Brand Book: Haarlinien statt Karten. Links die Aussage, rechts die
 * drei Bereiche als Liste - Index, Titel, zwei Zeilen, und ob es Kern ist
 * oder Design auf Einladung. Jede Zeile fuehrt auf ihre Leistungsseite; beim
 * Darueberfahren steigt sie eine Flaechenstufe, sonst passiert nichts.
 */

export default function HomeDisciplines() {
  const t = useT();
  const d = t.home.disciplines;
  const rows = [
    { key: "software", data: d.software, to: "/services/custom-software", tag: d.core, core: true },
    { key: "ai", data: d.ai, to: "/services/ai-automation", tag: d.core, core: true },
    { key: "design", data: d.design, to: "/services/websites", tag: d.invitation, core: false },
  ];

  return (
    <section id="services" className="bg-[var(--surface-0)]" style={{ paddingBlock: "var(--section-y-lg)" }}>
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-14"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <div className="lg:col-span-5">
          <div
            className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span>
              <span className="text-[var(--metal)]">01</span> / {d.eyebrow}
            </span>
          </div>
          <h2
            className="text-[var(--text-hi)] font-medium mt-8"
            style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.025em", maxWidth: "11ch" }}
          >
            {d.title}
          </h2>
        </div>

        <ul className="lg:col-span-7 border-t border-[var(--line)]">
          {rows.map((r, i) => (
            <li key={r.key} className="border-b border-[var(--line)]">
              <L
                to={r.to}
                className="group grid grid-cols-[40px_minmax(0,1fr)] sm:grid-cols-[64px_minmax(0,1fr)_auto] gap-x-4 sm:gap-x-6 gap-y-4 py-9 sm:py-11 pr-2 sm:pr-6 hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-2)]"
              >
                <span
                  className="eyebrow-mono text-[var(--text-low)] pt-2.5"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  0{i + 1}
                </span>
                <span className="min-w-0">
                  <span
                    className="display block text-[var(--text-hi)]"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.01em" }}
                  >
                    {r.data.title}
                  </span>
                  <span
                    className="block mt-3 text-[var(--text-mid)]"
                    style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
                  >
                    {r.data.copy}
                  </span>
                  <span
                    className="inline-flex items-center gap-2 mt-5 text-[var(--text-hi)] font-medium group-hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                    style={{ fontSize: "var(--t-small)" }}
                  >
                    {r.data.cta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-2)] group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </span>
                <span
                  className={`col-start-2 sm:col-start-3 row-start-2 sm:row-start-1 eyebrow-mono uppercase sm:pt-2.5 ${r.core ? "text-[var(--signal-text)]" : "text-[var(--text-low)]"}`}
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {r.tag}
                </span>
              </L>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
