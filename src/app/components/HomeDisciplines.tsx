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
 * Darueberfahren fuellt sich die Karte mit einem blauen Verlauf (`.m-flowcard`),
 * die Schrift wird weiss, der Knopf weiss mit blauer Schrift, die Tafel waechst
 * leicht und die Karte hebt sich um 4px.
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
            <span className="text-[var(--metal)]">02</span> / {d.eyebrow}
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
                className="m-flowcard group h-full flex flex-col overflow-hidden border border-[var(--line)] bg-[var(--surface-1)] hover:border-[#7faeff]/60 focus-within:border-[#7faeff]/60 hover:-translate-y-1 transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ borderRadius: 24 }}
              >
                <div className="dark relative m-2.5 mb-0 bg-[#0B0E1C] overflow-hidden aspect-[4/3]" style={{ borderRadius: 16 }}>
                  <Plate
                    name={c.plate}
                    className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex-1 flex flex-col px-6 sm:px-7 pt-6 pb-7">
                  <div className="flex justify-between items-center gap-4">
                    <span
                      className="eyebrow-mono text-[var(--text-low)] group-hover:text-white/70 transition-colors duration-500"
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`inline-flex items-center h-[26px] px-3 rounded-full border eyebrow-mono uppercase transition-colors duration-500 group-hover:text-white group-hover:border-white/50 group-hover:bg-white/10 ${c.core ? "text-[var(--signal-text)] border-[var(--signal-text)]/35" : "text-[var(--text-low)] border-[var(--line-strong)]"}`}
                      style={{ fontSize: "0.625rem", letterSpacing: "0.16em" }}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <h3
                    className="display text-[var(--text-hi)] group-hover:text-white mt-5 transition-colors duration-500"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.12, letterSpacing: "-0.02em" }}
                  >
                    {c.data.title}
                  </h3>
                  <p
                    className="text-[var(--text-mid)] group-hover:text-white/85 mt-2.5 mb-0 transition-colors duration-500"
                    style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}
                  >
                    {c.data.copy}
                  </p>
                  <span
                    className="mt-auto pt-7 self-start"
                  >
                    <span
                      className="inline-flex items-center gap-2 h-[42px] px-[18px] rounded-full border border-[var(--line-strong)] bg-[var(--surface-0)]/40 text-[var(--text-hi)] font-semibold transition-colors duration-500 group-hover:bg-white group-hover:border-white group-hover:text-[#123a9e]"
                      style={{ fontSize: "var(--t-small)" }}
                    >
                      {c.data.cta}
                      <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-2)] group-hover:translate-x-1" strokeWidth={1.75} />
                    </span>
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
