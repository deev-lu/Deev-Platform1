import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { scrollToId } from "../../lib/smoothScroll";
import HeroVideo from "./HeroVideo";
import heroWide from "../../assets/photos/hero-adolphe-1920.webp";
import heroNarrow from "../../assets/photos/hero-adolphe-900.webp";

/**
 * Der Hero, seit dem 13.10.2026 heller und ruhiger.
 *
 * Das Bild: die Adolphe-Bruecke ueber dem gruenen Petrusstal, dahinter die
 * Spuerkees mit ihrem Turm, blauer Himmel - vom Inhaber geliefert. Kaum
 * gegradet; ein Verlauf von links haelt die Schrift lesbar.
 *
 * Der Titel ist kleiner als zuvor und laeuft farblich von fast Weiss ueber
 * Hellblau ins Electric Blue (`.m-flow`, motion.css); "runs on." endet im
 * tieferen Blau. Darueber ein Label als Pille, darunter zwei Pillen-Knoepfe;
 * die drei Fakten stehen ab 1024px in einer kleinen Karte rechts.
 *
 * Auf dem Telefon randlos: das Bild geht bis an die Kanten, nur die unteren
 * Ecken sind rund. Der schmale Rand in Seitenfarbe sah dort wie ein Fehler
 * aus. Ab 768px eingelassen mit --radius-3.
 *
 * In beiden Themen dunkel (`dark`, data-surface), weil die Schrift auf einem
 * Foto steht. Groesstes Element der Seite, daher mit hoher Prioritaet; auf
 * dem Telefon die 900er-Fassung.
 */

export default function Hero() {
  const t = useT();
  const h = t.home.intro;

  return (
    <section className="bg-[var(--surface-0)] md:p-2 lg:p-3">
    <div
      data-surface="dark"
      className="dark relative overflow-hidden bg-[var(--surface-0)] flex flex-col rounded-b-[28px] md:rounded-[28px]"
      style={{ minHeight: "max(624px, min(calc(100svh - 24px), 940px))" }}
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
          className="m-drift absolute inset-0 w-full h-full object-cover object-[60%_50%]"
          style={{ filter: "saturate(0.92) contrast(1.02)" }}
        />
        {/* Ab 768px laeuft darueber der Film von YouTube, ab 0:10 (HeroVideo). */}
        <HeroVideo />
        {/* Verlaeufe nur fuer die Lesbarkeit: links und unten, oben ein
            Hauch fuer die Navigation. Rechts bleibt das Bild hell. */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(90deg, rgba(6,10,26,0.9) 0%, rgba(6,10,26,0.66) 42%, rgba(6,10,26,0) 70%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[78%] md:h-[30%]"
          style={{ background: "linear-gradient(0deg, rgba(6,10,26,0.97) 0%, rgba(6,10,26,0.88) 55%, rgba(6,10,26,0) 100%)" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{ background: "linear-gradient(180deg, rgba(6,10,26,0.55), rgba(6,10,26,0))" }}
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
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-10">
          <div className="min-w-0" style={{ maxWidth: 760 }}>
            <div
              className="m-fade-up inline-flex items-center gap-2.5 h-8 pl-2.5 pr-3.5 rounded-full border eyebrow-mono uppercase whitespace-nowrap text-[#c7dcff] text-[0.5625rem] tracking-[0.08em] sm:text-[length:var(--t-label)] sm:tracking-[0.16em]"
              style={{ background: "rgba(10,20,52,0.55)", borderColor: "rgba(127,174,255,0.32)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ce7fc]" aria-hidden="true" />
              {h.kicker}
            </div>

            {/* Der Verlauf liegt auf dem ganzen Block, nicht pro Zeile: jede
                Zeile laeuft von hell (links) nach blau (rechts). */}
            <h1
              className="m-flow w-fit font-medium mt-7 mb-0"
              style={{ fontSize: "clamp(2.375rem, 1.3rem + 3.2vw, 4.25rem)", lineHeight: 1.04, letterSpacing: "-0.035em", maxWidth: "15ch" }}
            >
              {h.lines.join(" ")} <span className="m-flow-deep">{h.accent}</span>
            </h1>

            <p
              className="m-fade-up text-[var(--text)] mt-6 mb-0"
              style={{ maxWidth: "50ch", fontSize: "var(--t-lead)", lineHeight: 1.5, animationDelay: "0.3s" }}
            >
              {h.lead}
            </p>
            <div className="m-fade-up mt-9 flex flex-col sm:flex-row sm:items-center gap-3" style={{ animationDelay: "0.4s" }}>
              <L
                to="/contact?interest=call"
                className="m-arrow inline-flex items-center justify-center gap-2.5 px-6 text-white font-semibold transition-[filter] duration-[var(--dur-1)] hover:brightness-110"
                style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)", background: "linear-gradient(100deg, #4c8dff, #2563f6)" }}
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
                className="inline-flex items-center justify-center gap-2.5 pl-2 pr-5 border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-[var(--text-hi)] font-medium transition-colors duration-[var(--dur-1)]"
                style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)" }}
              >
                <span className="w-9 h-9 rounded-full bg-white/[0.14] flex items-center justify-center" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                </span>
                {h.film}
              </a>
            </div>

            {/* Unter 1024px: die drei Fakten als Zeile */}
            <ul className="lg:hidden m-fade-up grid grid-cols-3 mt-8 pt-4 border-t border-white/10 text-[var(--text)]" style={{ fontSize: "0.75rem", lineHeight: 1.35, animationDelay: "0.5s" }}>
              {h.specs.map((spec, i) => (
                <li key={spec} className={i > 0 ? "pl-3 border-l border-white/10" : "pr-3"}>
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          {/* Ab 1024px: die Fakten als kleine Karte */}
          <div
            className="hidden lg:flex m-fade-up flex-col gap-4 w-[300px] p-6 border border-white/10"
            style={{ borderRadius: "var(--radius-2)", background: "rgba(11,14,28,0.72)", animationDelay: "0.5s" }}
          >
            <div className="eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "0.625rem", letterSpacing: "0.16em" }}>
              Studio
            </div>
            <ul className="flex flex-col gap-3 m-0 p-0" style={{ fontSize: "var(--t-small)" }}>
              {h.specs.map((spec, i) => (
                <li
                  key={spec}
                  className={`flex items-center gap-3 text-[var(--text-hi)] ${i < h.specs.length - 1 ? "pb-3 border-b border-white/[0.08]" : ""}`}
                >
                  <span className="eyebrow-mono text-[#7faeff]" style={{ fontSize: "var(--t-label)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
