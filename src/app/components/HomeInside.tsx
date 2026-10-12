import { ArrowDown } from "lucide-react";
import { useT } from "../../lib/useT";
import { scrollToId } from "../../lib/smoothScroll";
import nightWide from "../../assets/photos/lux-night-1600.webp";
import nightNarrow from "../../assets/photos/lux-night-900.webp";

/**
 * Der zweite grosse Moment der Startseite: Luxemburg bei Nacht, ueber die
 * ganze Breite, und ein Satz darueber. Fuehrt in den Film "KI bei der Arbeit"
 * direkt darunter.
 *
 * Kein Abspielknopf: der Studiofilm ist noch nicht gedreht, und ein Knopf, der
 * nichts abspielt, waere eine Behauptung. Wenn er da ist, kommt er hierher.
 *
 * Das Foto ist ein Unsplash-Platzhalter (freie Lizenz) bis zum Shooting.
 * In beiden Themen dunkel, weil die Schrift auf dem Bild steht.
 */
export default function HomeInside() {
  const t = useT();
  const s = t.home.inside;

  return (
    <section
      data-surface="dark"
      aria-label={s.eyebrow}
      className="dark relative overflow-hidden bg-[var(--surface-0)] border-y border-[var(--line)]"
      style={{ minHeight: "clamp(520px, 62vw, 820px)" }}
    >
      <img
        src={nightWide}
        srcSet={`${nightNarrow} 900w, ${nightWide} 1600w`}
        sizes="100vw"
        alt=""
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        className="m-grade absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "50% 20%" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5"
        style={{ background: "linear-gradient(0deg, rgba(6,6,10,0.95), rgba(6,6,10,0))" }}
      />

      <div
        className="relative mx-auto flex flex-col justify-between"
        style={{
          maxWidth: "var(--container)",
          paddingInline: "var(--gutter)",
          paddingBlock: "clamp(40px, 5vw, 64px)",
          minHeight: "clamp(520px, 62vw, 820px)",
        }}
      >
        <div
          className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          <span className="h-px w-10 bg-[var(--line-strong)]" aria-hidden="true" />
          {s.eyebrow}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
          <h2
            className="text-[var(--text-hi)] font-medium m-0"
            style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.025em", maxWidth: "14ch" }}
          >
            {s.title}
          </h2>
          <a
            href="#film"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("film");
            }}
            className="group inline-flex items-center gap-4 text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-small)" }}
          >
            <span className="w-14 h-14 border border-white/40 group-hover:border-white/80 flex items-center justify-center transition-colors duration-[var(--dur-2)]">
              <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
            </span>
            {t.home.intro.film}
          </a>
        </div>
      </div>
    </section>
  );
}
