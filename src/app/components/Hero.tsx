import { useEffect, useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { scrollToId } from "../../lib/smoothScroll";
import billovio from "../../assets/work/billovio.jpg";

/**
 * Der Hero, seit der High-End-Ueberarbeitung.
 *
 * Links die Aussage und zwei Wege: ein Projekt beginnen oder zuerst den Film
 * sehen. Rechts eine Komposition aus dem, was wir bauen: das echte Billovio
 * (unser eigenes Produkt) in einem nach hinten geneigten Rahmen, davor drei
 * schwebende Karten - ein Agent, der auf Freigabe wartet, ein Wissens-
 * assistent mit Quellen, eine Prognose, die sich zeichnet. Die Karten sind
 * Beispiele und als solche gekennzeichnet; das Bildschirmfoto ist echt.
 *
 * Bewegung (src/styles/motion.css): die Titelzeilen steigen aus ihrer Maske,
 * die Akzentworte bekommen eine Linie, dahinter eine Lichtwelle durch ein
 * Punktraster. Auf dem Desktop schweben die Karten und folgen der Maus in
 * eigener Tiefe. Telefon: keine Neigung, kein Schweben, keine Parallaxe,
 * kein Raster (Performance-Regeln 1-3). Reduzierte Bewegung: alles steht.
 *
 * Darunter das Laufband mit den Leistungen.
 */

const COLS = 26;
const ROWS = 12;
const DOTS = Array.from({ length: COLS * ROWS }, (_, i) => (Math.floor(i / COLS) + (i % COLS)) * 70);

const card =
  "border border-[var(--line-strong)] bg-[var(--surface-1)] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)]";
const label = "eyebrow-mono uppercase text-[var(--text-low)]";
const labelStyle = { fontSize: "var(--t-label)", letterSpacing: "0.14em" } as const;

export default function Hero() {
  const t = useT();
  const h = t.home.intro;
  const v = h.visual;
  const stageRef = useRef<HTMLDivElement>(null);

  // Mausparallaxe: nur feine Zeiger, nie unter reduzierter Bewegung, und
  // hoechstens ein Schreibzugriff pro Frame.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = (e.clientX / window.innerWidth) * 2 - 1;
      y = (e.clientY / window.innerHeight) * 2 - 1;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

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
    <section className="relative bg-[var(--surface-0)] overflow-hidden" style={{ paddingTop: "calc(68px + clamp(40px, 6vw, 96px))" }}>
      {/* Punktraster, nur ab Tablet */}
      <div
        aria-hidden="true"
        className="hidden md:grid absolute top-0 left-0 w-full h-full pointer-events-none opacity-70"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, alignContent: "start", rowGap: 34, padding: "110px 40px 0" }}
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
            "linear-gradient(90deg, var(--surface-0) 25%, color-mix(in srgb, var(--surface-0) 70%, transparent) 50%, color-mix(in srgb, var(--surface-0) 40%, transparent))",
        }}
      />

      <div
        className="relative mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-16 items-center"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        {/* ── Aussage ─────────────────────────────────────────────── */}
        <div className="lg:col-span-6 min-w-0">
          <div
            className="m-fade-up flex items-center gap-3.5 eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.18em" }}
          >
            <span className="w-2 h-2 bg-[var(--signal)]" aria-hidden="true" />
            {h.kicker}
          </div>

          <h1
            className="text-[var(--text-hi)] font-medium mt-9"
            style={{ fontSize: "clamp(2.875rem, 1.1rem + 5vw, 6.75rem)", lineHeight: 0.95, letterSpacing: "-0.045em" }}
          >
            {h.lines.map((line, i) => (
              <span key={line} className="m-rise">
                <span style={{ animationDelay: `${0.08 + i * 0.12}s` }}>
                  {line}
                  {i === h.lines.length - 1 && (
                    <>
                      {" "}
                      <span className="m-underline text-[var(--signal-text)]">{h.accent}</span>
                    </>
                  )}
                </span>
                {" "}
              </span>
            ))}
          </h1>

          <p
            className="m-fade-up text-[var(--text-mid)] mt-9"
            style={{ maxWidth: "50ch", fontSize: "var(--t-lead)", lineHeight: 1.5, animationDelay: "0.5s" }}
          >
            {h.lead}
          </p>
          <div className="m-fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.62s" }}>
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
              <span className="w-6 h-6 rounded-full bg-[var(--signal)] text-white flex items-center justify-center" aria-hidden="true">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </span>
              {h.film}
            </a>
          </div>
        </div>

        {/* ── Komposition ─────────────────────────────────────────── */}
        <div
          ref={stageRef}
          className="m-stage lg:col-span-6 relative min-w-0 m-fade-up"
          style={{ animationDelay: "0.35s" }}
          aria-hidden="true"
        >
          <div className="relative md:h-[540px] lg:h-[580px]">
            {/* Das echte Produkt */}
            <div className="m-layer md:absolute md:right-0 md:top-[56px] md:w-[86%]" style={{ ["--depth" as string]: "6px" }}>
              <div className={`m-tilt overflow-hidden ${card}`} style={{ borderRadius: "var(--radius-2)" }}>
                <div className="flex justify-between items-center gap-3 px-4 py-2.5 border-b border-[var(--line)]">
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
                    <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
                    <span className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
                  </span>
                  {/* Rechts, weil links die Agentenkarte davorliegt. */}
                  <span className={label} style={labelStyle}>{v.product}</span>
                </div>
                <img
                  src={billovio}
                  alt=""
                  width={1000}
                  height={583}
                  decoding="async"
                  className="block w-full h-auto object-cover object-top"
                  style={{ aspectRatio: "1000 / 600" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 md:mt-0">
              {/* Agent */}
              <div className="m-layer md:absolute md:left-0 md:top-0 md:w-[290px]" style={{ ["--depth" as string]: "20px" }}>
                <div className={`m-float-a p-4 ${card}`} style={{ borderRadius: "var(--radius-2)" }}>
                  <div className="flex justify-between gap-3">
                    <span className={label} style={labelStyle}>{v.agent}</span>
                    <span className={label} style={labelStyle}>{v.illustrative}</span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {v.steps.map((s, i) => (
                      <li
                        key={s}
                        className="m-in flex items-center gap-2.5 text-[var(--text)]"
                        style={{ fontSize: "var(--t-small)", animationDelay: `${0.9 + i * 0.35}s` }}
                      >
                        <Check className="w-3.5 h-3.5 text-[var(--positive)]" strokeWidth={2.25} />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="m-in mt-3 pt-3 border-t border-[var(--line)] flex items-center gap-2.5 text-[var(--text-hi)] font-medium"
                    style={{ fontSize: "var(--t-small)", animationDelay: "2s" }}
                  >
                    <span className="m-pulse w-2 h-2 rounded-full bg-[#3CE7FC]" />
                    {v.waiting}
                  </div>
                </div>
              </div>

              {/* Wissensassistent */}
              <div className="m-layer md:absolute md:right-[-2%] md:top-[50%] md:w-[320px]" style={{ ["--depth" as string]: "30px" }}>
                <div className={`m-float-b p-4 ${card}`} style={{ borderRadius: "var(--radius-2)" }}>
                  <span className={label} style={labelStyle}>{v.rag}</span>
                  <p className="mt-2 text-[var(--text-low)]" style={{ fontSize: "var(--t-small)" }}>
                    {v.question}
                  </p>
                  <p className="m-in mt-2 text-[var(--text-hi)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.55, animationDelay: "1.3s" }}>
                    {v.answer}{" "}
                    {[1, 3].map((n) => (
                      <span
                        key={n}
                        className="eyebrow-mono inline-block px-1 mx-0.5 border border-[var(--signal)] text-[var(--signal-text)]"
                        style={{ fontSize: "0.68rem", letterSpacing: "0.02em", borderRadius: "var(--radius-1)" }}
                      >
                        {n}
                      </span>
                    ))}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[var(--line)] flex items-center gap-2 text-[var(--positive)] eyebrow-mono uppercase" style={labelStyle}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--positive)]" />
                    {v.sources}
                  </div>
                </div>
              </div>

              {/* Prognose */}
              <div className="hidden md:block m-layer md:absolute md:left-[6%] md:bottom-0 md:w-[280px]" style={{ ["--depth" as string]: "14px" }}>
                <div className={`m-float-c p-4 ${card}`} style={{ borderRadius: "var(--radius-2)" }}>
                  <span className={label} style={labelStyle}>{v.forecast}</span>
                  <svg viewBox="0 0 240 72" className="mt-3 w-full h-auto block" fill="none">
                    <line x1="0" y1="70" x2="240" y2="70" stroke="var(--line)" />
                    <path
                      className="m-line"
                      pathLength={1}
                      d="M2 58 L24 54 L46 57 L68 46 L90 48 L112 38 L134 41 L156 30"
                      stroke="var(--signal)"
                      strokeWidth="2"
                      style={{ animationDelay: "1.1s" }}
                    />
                    {/* Die Prognose blendet ein; gestrichelt kann sie sich nicht zeichnen. */}
                    <g className="m-in" style={{ animationDelay: "2.5s" }}>
                      <path d="M156 30 L178 25 L200 19 L222 13 L238 9" stroke="var(--signal)" strokeWidth="2" strokeDasharray="4 5" />
                    </g>
                    <circle cx="156" cy="30" r="3.5" fill="var(--signal)" className="m-pulse" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laufband */}
      <div aria-hidden="true" className="mt-20 lg:mt-24 border-y border-[var(--line)] py-5 overflow-hidden">
        <div className="m-ticker">
          {run}
          {run}
        </div>
      </div>
    </section>
  );
}
