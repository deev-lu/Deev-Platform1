import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { scrollToId } from "../../lib/smoothScroll";
import heroWide from "../../assets/photos/kirchberg-aerial-1920.webp";
import heroNarrow from "../../assets/photos/kirchberg-aerial-900.webp";

/**
 * Der Hero nach dem Brand Book: ein Bild, das die ganze Breite nimmt.
 *
 * Der Kirchberg von oben, bei Tag - unser eigenes Foto. Die Schriftzuege
 * auf dem Dach des mittleren Turms sind retuschiert: ein fremdes Logo ueber
 * unserem Titel laese sich wie eine Referenz. Kuehl und ruhig gegradet, mit einem
 * schwarzen Verlauf von links, damit die Schrift auf dem Bild steht und nicht
 * auf einer Flaeche daneben. Darauf nur die Aussage, zwei Wege und drei
 * Fakten. Akzent ist ein einziges Wort in Sky; Electric Blue fuellt nur den
 * Hauptknopf.
 *
 * Es ist das groesste Element der Seite und deshalb mit hoher Prioritaet
 * geladen; auf dem Telefon die 900er-Fassung.
 *
 * Bewegung: die Titelzeilen steigen aus ihrer Maske, das Bild treibt langsam
 * (nur ab 768px, src/styles/motion.css). Reduzierte Bewegung: alles steht.
 *
 * Seit dem 13.10.2026 eingelassen mit runden Ecken (--radius-3).
 *
 * Der Abschnitt ist in beiden Themen dunkel (`dark`, data-surface), weil die
 * Schrift auf einem Foto steht und nicht auf der Seitenflaeche.
 */

export default function Hero() {
  const t = useT();
  const h = t.home.intro;

  return (
    <section className="bg-[var(--surface-0)] p-2 lg:p-3">
    {/* Das Bild als eingelassene Flaeche mit runden Ecken, in beiden Themen
        dunkel; drumherum ein schmaler Rand der Seitenfarbe. */}
    <div
      data-surface="dark"
      className="dark relative overflow-hidden bg-[var(--surface-0)] flex flex-col"
      style={{ minHeight: "max(624px, min(calc(100svh - 24px), 960px))", borderRadius: "var(--radius-3)" }}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          src={heroWide}
          srcSet={`${heroNarrow} 900w, ${heroWide} 1920w`}
          sizes="100vw"
          alt=""
          width={1920}
          height={1080}
          {...({ fetchpriority: "high" } as Record<string, string>)}
          decoding="async"
          className="m-drift absolute inset-0 w-full h-full object-cover object-[62%_60%]"
          style={{ filter: "saturate(0.7) contrast(1.06) brightness(0.86)" }}
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
          style={{ fontSize: "clamp(2.5rem, 1.1rem + 4.4vw, 5.75rem)", lineHeight: 0.95, letterSpacing: "-0.03em", maxWidth: "14ch" }}
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
                style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)" }}
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
    </div>
    </section>
  );
}
