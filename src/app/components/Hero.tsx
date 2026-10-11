import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { scrollToId } from "../../lib/smoothScroll";

/**
 * Der Hero, seit der High-End-Ueberarbeitung.
 *
 * Eine Aussage, gross gesetzt, und zwei Wege: ein Projekt beginnen oder
 * zuerst sehen, was wir bauen (der Film direkt darunter). Software und KI
 * stehen vorn, Websites als Design auf Einladung im Nachsatz.
 *
 * Bewegung ist reines CSS (src/styles/motion.css), damit nichts auf
 * JavaScript wartet: die Titelzeilen steigen nacheinander aus ihrer Maske,
 * dahinter laeuft eine Lichtwelle durch ein Punktraster. Das Raster ist
 * auf dem Telefon ausgeblendet, die Welle laeuft erst ab 768px, und unter
 * reduzierter Bewegung steht alles sofort.
 *
 * Darunter das Laufband mit den Leistungen.
 */

const COLS = 26;
const ROWS = 12;
const DOTS = Array.from({ length: COLS * ROWS }, (_, i) => (Math.floor(i / COLS) + (i % COLS)) * 70);

export default function Hero() {
  const t = useT();
  const h = t.home.intro;
  const run = (
    <span
      className="display text-[var(--text-hi)] whitespace-nowrap pr-12"
      style={{ fontSize: "clamp(1.375rem, 1rem + 1vw, 1.875rem)", letterSpacing: "-0.02em" }}
    >
      {t.home.ticker.map((item) => (
        <span key={item}>
          {item} <span className="text-[var(--signal)]">/</span>{" "}
        </span>
      ))}
    </span>
  );

  return (
    <>
      <section className="relative bg-[var(--surface-0)] overflow-hidden" style={{ paddingTop: "calc(68px + clamp(56px, 8vw, 128px))" }}>
        {/* Punktraster, nur ab Tablet */}
        <div
          aria-hidden="true"
          className="hidden md:grid absolute top-0 right-0 h-full pointer-events-none"
          style={{
            width: "62%",
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            alignContent: "start",
            rowGap: 34,
            padding: "120px 40px 0 0",
          }}
        >
          {DOTS.map((delay, i) => (
            <div key={i} className="flex justify-center">
              <div className="m-dot" style={{ animationDelay: `${delay}ms` }} />
            </div>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, var(--surface-0) 30%, color-mix(in srgb, var(--surface-0) 55%, transparent) 60%, color-mix(in srgb, var(--surface-0) 20%, transparent))",
          }}
        />

        <div className="relative mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
          <div
            className="m-fade-up flex items-center gap-3.5 eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.18em" }}
          >
            <span className="w-2 h-2 bg-[var(--signal)]" aria-hidden="true" />
            {h.kicker}
          </div>

          <h1
            className="text-[var(--text-hi)] font-medium mt-10"
            style={{ fontSize: "clamp(3rem, 1.2rem + 6.6vw, 8.75rem)", lineHeight: 0.95, letterSpacing: "-0.045em", maxWidth: "13ch" }}
          >
            {h.lines.map((line, i) => (
              <span key={line} className="m-rise">
                <span style={{ animationDelay: `${0.08 + i * 0.12}s` }}>
                  {line}
                  {i === h.lines.length - 1 && (
                    <>
                      {" "}
                      <span className="text-[var(--signal-text)]">{h.accent}</span>
                    </>
                  )}
                </span>
              </span>
            ))}
          </h1>

          <div
            className="m-fade-up flex flex-wrap items-end justify-between gap-10 mt-12 lg:mt-14"
            style={{ animationDelay: "0.55s" }}
          >
            <p className="text-[var(--text-mid)] m-0" style={{ flex: "1 1 420px", maxWidth: "54ch", fontSize: "var(--t-lead)", lineHeight: 1.5 }}>
              {h.lead}
            </p>
            <div className="flex flex-wrap gap-3">
              <L
                to="/contact"
                className="m-arrow inline-flex items-center gap-3 px-7 bg-[var(--text-hi)] text-[var(--surface-0)] font-medium"
                style={{ height: 56, fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                {h.primary}
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </L>
              <a
                href="#film"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("film");
                }}
                className="inline-flex items-center gap-3 px-6 border border-[var(--line-strong)] text-[var(--text-hi)] font-medium hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
                style={{ height: 56, fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
                {h.film}
              </a>
            </div>
          </div>
        </div>

        {/* Laufband */}
        <div aria-hidden="true" className="mt-24 lg:mt-28 border-y border-[var(--line)] py-5 overflow-hidden">
          <div className="m-ticker">
            {run}
            {run}
          </div>
        </div>
      </section>
    </>
  );
}
