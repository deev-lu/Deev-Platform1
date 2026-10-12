import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { scrollToId } from "../../lib/smoothScroll";
import heroWide from "../../assets/photos/hero-grund-1920.webp";
import heroNarrow from "../../assets/photos/hero-grund-900.webp";

/**
 * Der Hero nach dem Brand Book: ein Bild, das die ganze Breite nimmt.
 *
 * Luxemburg in der Abenddaemmerung, kuehl und ruhig gegradet, mit einem
 * schwarzen Verlauf von links, damit die Schrift auf dem Bild steht und nicht
 * auf einer Flaeche daneben. Darauf nur die Aussage, zwei Wege und drei
 * Fakten. Akzent ist ein einziges Wort in Sky; Electric Blue fuellt nur den
 * Hauptknopf.
 *
 * Das Foto ist ein Platzhalter von Unsplash (freie Lizenz), bis das eigene
 * Shooting da ist. Es ist das groesste Element der Seite und deshalb mit
 * hoher Prioritaet geladen; auf dem Telefon die 900er-Fassung.
 *
 * Bewegung: die Titelzeilen steigen aus ihrer Maske, das Bild treibt langsam
 * (nur ab 768px, src/styles/motion.css). Reduzierte Bewegung: alles steht.
 *
 * Der Abschnitt ist in beiden Themen dunkel (`dark`, data-surface), weil die
 * Schrift auf einem Foto steht und nicht auf der Seitenflaeche.
 */

export default function Hero() {
  const t = useT();
  const h = t.home.intro;

  return (
    <section
      data-surface="dark"
      className="dark relative overflow-hidden bg-[var(--surface-0)] border-b border-[var(--line)] flex flex-col"
      style={{ minHeight: "max(640px, min(100svh, 980px))" }}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          src={heroWide}
          srcSet={`${heroNarrow} 900w, ${heroWide} 1920w`}
          sizes="100vw"
          alt=""
          width={1920}
          height={1280}
          {...({ fetchpriority: "high" } as Record<string, string>)}
          decoding="async"
          className="m-grade m-drift absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "60% 55%" }}
        />
        {/* Verlaeufe nur von Schwarz nach klar: Lesbarkeit, keine Farbe. */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(6,6,10,0.92) 0%, rgba(6,6,10,0.66) 42%, rgba(6,6,10,0.2) 80%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: "linear-gradient(0deg, rgba(6,6,10,1), rgba(6,6,10,0))" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{ background: "linear-gradient(180deg, rgba(6,6,10,0.6), rgba(6,6,10,0))" }}
        />
      </div>

      <div
        className="relative mx-auto w-full flex-1 flex flex-col justify-end"
        style={{
          maxWidth: "var(--container)",
          paddingInline: "var(--gutter)",
          paddingTop: "calc(68px + 64px)",
          paddingBottom: "clamp(48px, 7vw, 88px)",
        }}
      >
        <div
          className="m-fade-up flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-mid)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          <span className="h-px w-10 bg-[var(--line-strong)]" aria-hidden="true" />
          {h.kicker}
        </div>

        <h1
          className="text-[var(--text-hi)] font-medium mt-8"
          style={{ fontSize: "clamp(2.875rem, 1.2rem + 6vw, 7.5rem)", lineHeight: 0.92, letterSpacing: "-0.035em", maxWidth: "13ch" }}
        >
          {h.lines.map((line, i) => (
            <span key={line} className="m-rise">
              <span style={{ animationDelay: `${0.08 + i * 0.08}s` }}>
                {line}
                {i === h.lines.length - 1 && (
                  <>
                    {" "}
                    <span className="text-[var(--signal-text)]">{h.accent}</span>
                  </>
                )}
              </span>{" "}
            </span>
          ))}
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-12 mt-10">
          <div className="min-w-0">
            <p
              className="m-fade-up text-[var(--text)] m-0"
              style={{ maxWidth: "48ch", fontSize: "var(--t-lead)", lineHeight: 1.45, animationDelay: "0.4s" }}
            >
              {h.lead}
            </p>
            <div className="m-fade-up mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: "0.5s" }}>
              <L
                to="/contact"
                className="inline-flex items-center px-6 bg-[var(--signal)] hover:bg-[#1747c4] text-white font-medium transition-colors duration-[var(--dur-1)]"
                style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-2)" }}
              >
                {h.primary}
              </L>
              <a
                href="#film"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("film");
                }}
                className="m-arrow inline-flex items-center gap-2.5 text-[var(--text-hi)] font-medium"
                style={{ fontSize: "var(--t-small)" }}
              >
                {h.film}
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Drei Fakten auf einer Haarlinie */}
          <ul
            className="m-fade-up grid grid-cols-1 sm:grid-cols-3 border-t border-[var(--line)] w-full sm:w-auto"
            style={{ animationDelay: "0.6s" }}
          >
            {h.specs.map((spec, i) => (
              <li
                key={spec}
                className={`pt-4 pb-1 sm:pr-7 ${i > 0 ? "sm:pl-7 sm:border-l border-[var(--line)]" : ""}`}
              >
                <span
                  className="block eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block mt-1.5 text-[var(--text-hi)]" style={{ fontSize: "var(--t-small)" }}>
                  {spec}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
