import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";

/**
 * Direkt unter dem Hero: wohin will der Besucher?
 *
 * Drei Bereiche, jeder eine eigene Seite. KI & Daten fuehrt auf die Seite mit
 * der Daten-Pipeline und der Dokument-Demo. Absichtlich ohne Nummer: die
 * nummerierten Abschnitte beginnen mit der Arbeit darunter, und eine 00
 * davor wuerde die Reihe nur verschieben.
 *
 * Die kleinen Zeichnungen bewegen sich nur beim Ueberfahren und nur per
 * CSS-Transition - keine Daueranimation, nichts, was auf dem Telefon laeuft.
 * Eager, nicht lazy: der Streifen liegt an der Falz, ein Ladekreisel an
 * dieser Stelle waere schlechter als die zwei Kilobyte.
 */

const AREAS = [
  { key: "web" as const, to: "/services/websites", Motif: WebMotif },
  { key: "software" as const, to: "/services/custom-software", Motif: SoftwareMotif },
  { key: "data" as const, to: "/services/ai-automation", Motif: DataMotif },
];

export default function ExploreAreas() {
  const t = useT();
  const e = t.home.explore;

  return (
    <section className="border-t border-[var(--line)]" aria-labelledby="explore-title">
      <div
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "clamp(40px, 5vw, 64px)" }}
      >
        <h2
          id="explore-title"
          className="eyebrow-mono uppercase text-[var(--text-low)] mb-6 flex items-center gap-4"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          <span className="h-px w-10 bg-[var(--line-strong)]" aria-hidden="true" />
          {e.label}
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
          {AREAS.map(({ key, to, Motif }) => {
            const a = e.areas[key];
            return (
              <li key={key}>
                <L
                  to={to}
                  className="card-glow group relative flex h-full items-center gap-4 md:flex-col md:items-stretch md:gap-0 border border-[var(--line)] bg-[var(--surface-1)] px-4 py-5 md:p-7 hover:border-[var(--signal)] transition-colors duration-[var(--dur-2)]"
                  style={{ borderRadius: "var(--radius-1)" }}
                >
                  <span className="absolute left-0 top-0 h-px w-0 bg-[var(--signal)] transition-all duration-[var(--dur-3)] group-hover:w-full" aria-hidden="true" />

                  <Motif />

                  <span className="flex-1 min-w-0 md:flex md:flex-col md:mt-7">
                    <span
                      className="block text-[var(--text-hi)] font-medium"
                      style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.015em" }}
                    >
                      {a.title}
                    </span>
                    <span
                      className="block text-[var(--text-mid)] mt-2"
                      style={{ fontSize: "var(--t-small)", lineHeight: 1.5 }}
                    >
                      {a.line}
                    </span>
                    <span
                      className="hidden md:inline-flex items-center gap-2 md:mt-auto pt-6 text-[var(--signal-text)] font-medium"
                      style={{ fontSize: "var(--t-small)" }}
                    >
                      {e.cta}
                      <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
                    </span>
                  </span>

                  <ArrowRight className="md:hidden w-5 h-5 shrink-0 text-[var(--signal-text)]" strokeWidth={1.5} aria-hidden="true" />
                </L>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── Die drei Zeichnungen ──────────────────────────────────────────────── */

const motifBox = "w-[60px] md:w-[120px] h-auto shrink-0 text-[var(--line-strong)]";
const ease = "transition-all duration-[var(--dur-3)] ease-[var(--ease-out)]";

/** Ein Browserfenster, dessen Knopf beim Ueberfahren aufleuchtet. */
function WebMotif() {
  return (
    <svg viewBox="0 0 120 72" className={motifBox} fill="none" aria-hidden="true">
      <rect x="1" y="1" width="118" height="70" stroke="currentColor" />
      <line x1="1" y1="13" x2="119" y2="13" stroke="currentColor" />
      {[8, 15, 22].map((x) => (
        <circle key={x} cx={x} cy="7" r="1.6" fill="currentColor" />
      ))}
      <rect x="12" y="24" width="56" height="6" className="fill-[var(--text-low)]" />
      <rect x="12" y="35" width="76" height="3" fill="currentColor" />
      <rect x="12" y="42" width="64" height="3" fill="currentColor" />
      <rect x="12" y="53" width="26" height="9" className={`fill-[var(--line-strong)] group-hover:fill-[var(--signal)] ${ease}`} />
    </svg>
  );
}

/** Drei Schichten, die beim Ueberfahren auseinanderfahren. */
function SoftwareMotif() {
  return (
    <svg viewBox="0 0 120 72" className={motifBox} fill="none" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <g key={i} className={`${ease} ${i === 0 ? "group-hover:-translate-y-[5px]" : i === 2 ? "group-hover:translate-y-[5px]" : ""}`}>
          <polygon
            points={`60,${8 + i * 18} 112,${22 + i * 18} 60,${36 + i * 18} 8,${22 + i * 18}`}
            stroke={i === 1 ? "var(--signal)" : "currentColor"}
            className={i === 1 ? "fill-[var(--signal-dim)]" : "fill-[var(--surface-1)]"}
          />
        </g>
      ))}
    </svg>
  );
}

/** Punkte an einer Trendlinie; die Linie zieht sich beim Ueberfahren. */
function DataMotif() {
  const pts = [
    [10, 58], [22, 52], [34, 55], [46, 44], [58, 40], [70, 46], [82, 30], [94, 26], [106, 16],
  ];
  return (
    <svg viewBox="0 0 120 72" className={motifBox} fill="none" aria-hidden="true">
      <line x1="2" y1="70" x2="118" y2="70" stroke="currentColor" />
      <line
        x1="8" y1="62" x2="112" y2="14"
        stroke="var(--signal)"
        strokeWidth="1.25"
        pathLength={1}
        strokeDasharray="1"
        className={`[stroke-dashoffset:0.55] group-hover:[stroke-dashoffset:0] ${ease}`}
      />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" className={i === 5 ? "fill-[var(--warn)]" : "fill-[var(--signal)]"} />
      ))}
    </svg>
  );
}
