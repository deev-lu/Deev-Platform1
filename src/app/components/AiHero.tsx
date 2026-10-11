import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { useIsMobile } from "../../lib/useIsMobile";
import { scrollToId } from "../../lib/smoothScroll";

/**
 * Der Kopf der KI-Seite - ersetzt dort die allgemeine Leistungskopfzeile.
 *
 * Unter Titel und Aktionen steht die operative Schicht in vier Baendern:
 * was der Kunde schon betreibt, das gemeinsame Modell seines Unternehmens,
 * was wir darauf bauen, und was davon zurueck in seine Systeme geht. Die
 * Baender stehen oben nach unten so, wie man sie liest (Aktion zuerst), der
 * Lichtpunkt laeuft von unten nach oben, so wie die Daten fliessen.
 *
 * Das Wandern laeuft nur auf dem Desktop, nur sichtbar und nie unter
 * reduzierter Bewegung (Performance-Regel 3). Im HTML steht alles still und
 * vollstaendig: der Kopf liegt ueber der Falz und darf nicht warten.
 */

const STEP_MS = 1500;

export default function AiHero() {
  const t = useT();
  const h = t.home.aiHero;
  const eyebrow = t.pages.servicePages.ai.eyebrow;
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const layerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(layerRef, { amount: 0.3 });
  const bands = h.layer.bands;
  // Index im Array; -1 = nichts hervorgehoben.
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (reduce || isMobile || !inView) {
      setActive(-1);
      return;
    }
    // Von unten (Quellen) nach oben (Aktion), dann eine Pause ohne Licht.
    const seq = [...bands.keys()].reverse().concat([-1]);
    let i = 0;
    setActive(seq[0]);
    const id = window.setInterval(() => {
      i = (i + 1) % seq.length;
      setActive(seq[i]);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reduce, isMobile, inView, bands]);

  return (
    <header className="relative overflow-hidden border-b border-[var(--line)]">
      {/* Feines Raster als Grund. Statisch, also auch auf dem Telefon billig. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--line-faint) 1px, transparent 1px), linear-gradient(90deg, var(--line-faint) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="relative mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingTop: "clamp(48px, 7vw, 96px)", paddingBottom: "var(--section-y)" }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[var(--line)] eyebrow-mono uppercase text-[var(--text-low)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          <span>{eyebrow}</span>
          <span className="hidden sm:inline">{h.strip}</span>
        </div>

        <div className="flex flex-wrap items-end gap-x-14 gap-y-10 pt-16 lg:pt-24">
          <div className="min-w-0" style={{ flex: "999 1 560px" }}>
            <div
              className="flex items-center gap-3 mb-7 eyebrow-mono uppercase text-[var(--signal-text)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="w-2 h-2 bg-[var(--signal)]" aria-hidden="true" />
              {h.kicker}
            </div>
            <h1
              className="text-[var(--text-hi)] font-medium"
              style={{ fontSize: "clamp(2.75rem, 1.2rem + 5vw, 6rem)", lineHeight: 0.98, letterSpacing: "-0.035em", maxWidth: "14ch" }}
            >
              {h.title}
            </h1>
          </div>
          <div className="min-w-0" style={{ flex: "1 1 340px", maxWidth: 480 }}>
            <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-lead)", lineHeight: 1.5 }}>
              {h.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <L
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 bg-[var(--signal)] text-white font-medium"
                style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                {h.primary}
                <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
              </L>
              <a
                href="#ai-layer"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("ai-layer");
                }}
                className="inline-flex items-center px-6 border border-[var(--line-strong)] text-[var(--text-hi)] font-medium hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
                style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                {h.secondary}
              </a>
            </div>
          </div>
        </div>

        {/* Die operative Schicht */}
        <div
          id="ai-layer"
          ref={layerRef}
          className="mt-16 lg:mt-24 border border-[var(--line-strong)] bg-[var(--surface-1)]"
          style={{ borderRadius: "var(--radius-1)", scrollMarginTop: 96 }}
        >
          <div
            className="flex flex-wrap justify-between gap-3 px-5 py-3.5 border-b border-[var(--line)] eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span>{h.layer.label}</span>
            <span>{h.layer.note}</span>
          </div>
          <ol>
            {bands.map((band, i) => {
              const n = String(bands.length - i).padStart(2, "0");
              const on = active === i;
              const core = i === 1; // Intelligenz: das, was wir bauen
              const source = i === bands.length - 1;
              return (
                <li
                  key={band.name}
                  className={`relative flex flex-wrap ${i < bands.length - 1 ? "border-b border-[var(--line)]" : ""}`}
                  style={{
                    background: core ? "var(--signal-dim)" : "transparent",
                  }}
                >
                  {/* Der wandernde Lichtpunkt: eine Kante links */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--signal)]"
                    style={{ opacity: on ? 1 : 0, transition: "opacity 500ms var(--ease-out)" }}
                  />
                  <div className="w-full sm:w-[220px] shrink-0 px-5 py-5 sm:border-r border-b sm:border-b-0 border-[var(--line)]">
                    <div
                      className="eyebrow-mono"
                      style={{
                        fontSize: "var(--t-label)",
                        letterSpacing: "0.16em",
                        color: on || core ? "var(--signal-text)" : "var(--metal)",
                        transition: "color 500ms var(--ease-out)",
                      }}
                    >
                      {n}
                    </div>
                    <div className="text-[var(--text-hi)] font-medium mt-1.5">{band.name}</div>
                    <div className="text-[var(--text-low)]" style={{ fontSize: "var(--t-small)" }}>
                      {band.sub}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 px-5 py-5 flex flex-wrap items-center gap-2.5" style={{ flexBasis: 320 }}>
                    {band.items.map((item, k) => (
                      <span
                        key={item}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 ${source ? "eyebrow-mono uppercase border-dashed" : ""} ${core ? "font-medium" : ""} border`}
                        style={{
                          fontSize: source ? "var(--t-label)" : "var(--t-small)",
                          letterSpacing: source ? "0.12em" : undefined,
                          borderRadius: "var(--radius-1)",
                          color: source ? "var(--text-mid)" : "var(--text-hi)",
                          borderColor: on || core ? "var(--signal)" : "var(--line-strong)",
                          background: core ? "color-mix(in srgb, var(--signal) 14%, transparent)" : i === 2 ? "var(--surface-2)" : "transparent",
                          transition: `border-color 500ms var(--ease-out) ${on ? k * 60 : 0}ms`,
                        }}
                      >
                        {i === 2 && <span aria-hidden="true" className="w-[7px] h-[7px] border border-[var(--signal-text)]" />}
                        {i === 0 && k === 1 && (
                          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#3CE7FC] md:motion-safe:animate-pulse" />
                        )}
                        {item}
                      </span>
                    ))}
                    {band.note && (
                      <span
                        className="eyebrow-mono uppercase text-[var(--text-low)] sm:ml-1.5"
                        style={{ fontSize: "var(--t-label)", letterSpacing: "0.12em" }}
                      >
                        {band.note}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </header>
  );
}
