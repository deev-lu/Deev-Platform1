import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";

/**
 * 01 auf der Startseite: was wir tun.
 *
 * Drei Bereiche nebeneinander, aber nicht gleich gewichtet: Software und KI
 * sind der Kern und breiter, Design steht als Auftrag auf Einladung daneben.
 * Jede Karte fuehrt auf ihre Leistungsseite. Ersetzt die fruehere
 * Bereichswahl unter dem Hero und die drei Leistungswege.
 */

export default function HomeDisciplines() {
  const t = useT();
  const d = t.home.disciplines;
  const cards = [
    { key: "software", data: d.software, to: "/services/custom-software", tag: d.core, grow: 1.25, tint: false },
    { key: "ai", data: d.ai, to: "/services/ai-automation", tag: d.core, grow: 1.25, tint: true },
    { key: "design", data: d.design, to: "/services/websites", tag: d.invitation, grow: 1, tint: false },
  ];

  return (
    <section id="services" className="bg-[var(--surface-0)]" style={{ paddingBottom: "var(--section-y-lg)" }}>
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <div
          className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span>
            <span className="text-[var(--signal-text)]">01</span> / {d.eyebrow}
          </span>
        </div>
        <h2
          className="text-[var(--text-hi)] font-medium mt-9"
          style={{ fontSize: "clamp(2.5rem, 1.3rem + 3.8vw, 5.25rem)", lineHeight: 0.98, letterSpacing: "-0.04em", maxWidth: "16ch" }}
        >
          {d.title}
        </h2>

        <div className="flex flex-wrap gap-px mt-16 lg:mt-20 bg-[var(--line)] border border-[var(--line)]">
          {cards.map((c, i) => (
            <article
              key={c.key}
              className="m-card min-w-0 px-7 sm:px-10 pt-10 pb-11"
              style={{
                flex: `${c.grow} 1 ${c.grow > 1 ? 380 : 320}px`,
                background: c.tint ? "color-mix(in srgb, var(--signal) 6%, var(--surface-0))" : "var(--surface-0)",
              }}
            >
              <div className="flex justify-between items-baseline">
                <span className="eyebrow-mono text-[var(--signal-text)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  0{i + 1}
                </span>
                <span
                  className="eyebrow-mono uppercase"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", color: c.tint ? "var(--signal-text)" : "var(--text-low)" }}
                >
                  {c.tag}
                </span>
              </div>
              <h3
                className="display text-[var(--text-hi)] mt-14 lg:mt-[72px]"
                style={{ fontSize: "clamp(2rem, 1.5rem + 1vw, 2.5rem)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
              >
                {c.data.title}
              </h3>
              <p className="text-[var(--text-mid)] mt-4" style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "40ch" }}>
                {c.data.copy}
              </p>
              <ul className="mt-9 border-t border-[var(--line)]">
                {c.data.list.map((item) => (
                  <li key={item} className="py-3 border-b border-[var(--line-faint)] text-[var(--text)]" style={{ fontSize: "var(--t-small)" }}>
                    {item}
                  </li>
                ))}
              </ul>
              <L
                to={c.to}
                className="m-arrow inline-flex items-center gap-2.5 mt-9 font-medium text-[var(--text-hi)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                style={{ fontSize: "var(--t-small)" }}
              >
                {c.data.cta}
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </L>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
