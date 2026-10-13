import { ArrowRight } from "lucide-react";
import L from "./L";
import Plate, { TwoTone, type PlateName } from "./Plate";
import { useT } from "../../lib/useT";

/**
 * 01 auf der Startseite: was wir tun.
 *
 * Drei Karten, jede mit ihrer Tafel aus "Signal Lumen": Schichten fuer
 * Software, ein Feld von Quellen fuer KI und Daten, Radien im Verhaeltnis
 * fuer Design. Die Tafel steht auf einer dunklen Flaeche (in beiden Themen),
 * darunter Index, Titel, zwei Zeilen und der Weg zur Leistungsseite. Beim
 * Darueberfahren hebt sich die Karte um eine Flaechenstufe und die Tafel
 * waechst um drei Prozent.
 */

export default function HomeDisciplines() {
  const t = useT();
  const d = t.home.disciplines;
  const cards: { key: string; data: typeof d.software; to: string; tag: string; core: boolean; plate: PlateName }[] = [
    { key: "software", data: d.software, to: "/services/custom-software", tag: d.core, core: true, plate: "strata" },
    { key: "ai", data: d.ai, to: "/services/ai-automation", tag: d.core, core: true, plate: "retrieval" },
    { key: "design", data: d.design, to: "/services/websites", tag: d.invitation, core: false, plate: "proportion" },
  ];

  return (
    <section id="services" className="bg-[var(--surface-0)]" style={{ paddingBlock: "var(--section-y-lg)" }}>
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
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
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "18ch" }}
        >
          <TwoTone text={d.title} />
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mt-14 lg:mt-20">
          {cards.map((c, i) => (
            <li key={c.key} className="min-w-0">
              <L
                to={c.to}
                className="group h-full flex flex-col overflow-hidden border border-[var(--line)] bg-[var(--surface-1)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] transition-colors duration-[var(--dur-2)]"
                style={{ borderRadius: "var(--radius-2)" }}
              >
                <div className="dark relative bg-[#0B0E1C] border-b border-[var(--line)] overflow-hidden aspect-[4/3]">
                  <Plate
                    name={c.plate}
                    className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex-1 flex flex-col p-6 sm:p-8">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="eyebrow-mono text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                      0{i + 1}
                    </span>
                    <span
                      className={`eyebrow-mono uppercase ${c.core ? "text-[var(--signal-text)]" : "text-[var(--text-low)]"}`}
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <h3
                    className="display text-[var(--text-hi)] mt-6"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.12, letterSpacing: "-0.015em" }}
                  >
                    {c.data.title}
                  </h3>
                  <p className="text-[var(--text-mid)] mt-3 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
                    {c.data.copy}
                  </p>
                  <span
                    className="mt-auto pt-7 inline-flex items-center gap-2 text-[var(--text-hi)] font-medium group-hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                    style={{ fontSize: "var(--t-small)" }}
                  >
                    {c.data.cta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-2)] group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </div>
              </L>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
