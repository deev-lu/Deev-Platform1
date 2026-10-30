import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT, useLocale } from "../../lib/useT";
import { scrollToId } from "../../lib/smoothScroll";
import { GOOGLE_REVIEWS } from "../../lib/reviews";
import { useReduceMotion } from "../../lib/motionPref";
import MotionToggle from "./MotionToggle";

/**
 * Der Hero, seit dem 30.10.2026 im Stil von nvision.lu in DEEV-Farben (der
 * Wunsch des Inhabers): kein Foto, kein Film mehr, sondern der dunkle,
 * von Orbs beleuchtete Grund (OrbField), eine sehr grosse Typold-Zeile und
 * ein Wort, das wechselt und im Blau-Cyan-Verlauf laeuft.
 *
 * "Wir bauen / Individualsoftware / fuer Luxemburger Unternehmen." Die
 * wechselnden Woerter stammen alle aus dem Lead, nichts Neues wird
 * behauptet. Das echte <h1> bleibt der bisherige Satz und ist nur fuer
 * Screenreader und Suchmaschinen da; die sichtbare Zeile ist dekorativ und
 * aria-hidden, damit der Wechsel nichts ansagt.
 *
 * Darunter links der Lead mit zwei Pillen-Knoepfen, rechts das Angebot als
 * Glas-Karte (ab 1024px; darunter als 2x2-Raster), unten die
 * Google-Bewertung und "Scrollen und entdecken". Das Wort steht still unter
 * reduzierter Bewegung und bei "Bewegung anhalten" (oben rechts).
 */

/** Where each entry of `home.intro.offers` leads, in the same order. */
const HERO_OFFER_LINKS = ["/services/custom-software", "/services/ai-automation", "/workshops", "/services/websites", "/#cybersecurity"] as const;

const ROTATE_MS = 2600;

export default function Hero() {
  const t = useT();
  const h = t.home.intro;

  return (
    <section className="relative" aria-labelledby="hero-title">
      {/* Pause fuer alle Bewegung (WCAG 2.2.2), oben rechts unter der
          Navigation. */}
      <MotionToggle className="absolute z-10 right-4 top-[84px] md:right-6 md:top-[96px]" />

      <div
        className="relative mx-auto w-full flex flex-col justify-end"
        style={{
          maxWidth: "var(--container)",
          paddingInline: "var(--gutter)",
          minHeight: "max(640px, min(100svh, 1000px))",
          paddingTop: "calc(68px + clamp(48px, 8vh, 120px))",
          paddingBottom: "clamp(40px, 6vh, 72px)",
        }}
      >
        <h1 id="hero-title" className="sr-only">
          {h.lines.join(" ")} {h.accent}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] items-end gap-x-14 gap-y-10">
          <div className="min-w-0">
            <HeroTitle build={h.build} words={h.rotate} accent={h.accent} />
            <p
              className="m-fade-up text-[var(--text)] mt-8 mb-0"
              style={{ maxWidth: "56ch", fontSize: "var(--t-lead)", lineHeight: 1.55, animationDelay: "0.3s" }}
            >
              {h.lead}
            </p>
            <div className="m-fade-up mt-8 flex flex-col sm:flex-row sm:items-center gap-3" style={{ animationDelay: "0.4s" }}>
              <L
                to="/contact?interest=call"
                className="btn-grad m-arrow inline-flex items-center justify-center gap-2.5 px-7 text-white font-semibold rounded-full"
                style={{ height: 54, fontSize: "var(--t-small)" }}
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
                className="btn-ghost inline-flex items-center justify-center gap-2.5 pl-2 pr-6 rounded-full font-medium"
                style={{ height: 54, fontSize: "var(--t-small)" }}
              >
                <span className="w-10 h-10 rounded-full bg-[var(--signal-dim)] flex items-center justify-center" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                </span>
                {h.film}
              </a>
            </div>

            {/* Google-Bewertung, sobald die echten Zahlen in lib/reviews.ts stehen. */}
            <HeroReviews />

            {/* Unter 1024px: das Angebot als 2x2-Raster, darunter die Foerderung. */}
            <div className="lg:hidden m-fade-up mt-8" style={{ animationDelay: "0.5s" }}>
              <div className="eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "0.625rem", letterSpacing: "0.16em" }}>
                {h.offersLabel}
              </div>
              <ul className="grid grid-cols-2 gap-2 mt-3 m-0 p-0">
                {h.offers.map((o, i) => (
                  <li key={o.title} className={`list-none ${h.offers.length % 2 && i === h.offers.length - 1 ? "col-span-2" : ""}`}>
                    <L
                      to={HERO_OFFER_LINKS[i]}
                      className="glass-pill flex h-full flex-col gap-1 p-3.5 hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
                      style={{ borderRadius: "var(--radius-1)" }}
                    >
                      <span className="text-[var(--text-hi)] font-medium" style={{ fontSize: "0.875rem", lineHeight: 1.25 }}>
                        {o.title}
                      </span>
                      <span className="text-[var(--text-low)]" style={{ fontSize: "0.75rem", lineHeight: 1.35 }}>
                        {o.sub}
                      </span>
                    </L>
                  </li>
                ))}
              </ul>
              <FundingLine text={h.funding} />
            </div>
          </div>

          {/* Ab 1024px: das Angebot als Glas-Karte rechts. */}
          <nav
            aria-label={h.offersLabel}
            className="glass-pill hidden lg:flex m-fade-up flex-col w-[360px] p-6"
            style={{ borderRadius: "var(--radius-2)", animationDelay: "0.5s" }}
          >
            <div className="eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "0.625rem", letterSpacing: "0.16em" }}>
              {h.offersLabel}
            </div>
            <ul className="flex flex-col mt-3 m-0 p-0">
              {h.offers.map((o, i) => (
                <li key={o.title} className="list-none border-b border-[var(--line)] last:border-b-0">
                  <L to={HERO_OFFER_LINKS[i]} className="group flex items-center gap-3 py-3">
                    <span className="eyebrow-mono text-[var(--signal-text)] shrink-0" style={{ fontSize: "var(--t-label)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-small)" }}>
                        {o.title}
                      </span>
                      <span className="block text-[var(--text-low)]" style={{ fontSize: "0.75rem", lineHeight: 1.4 }}>
                        {o.sub}
                      </span>
                    </span>
                    <ArrowRight
                      className="w-4 h-4 shrink-0 text-[var(--text-low)] group-hover:text-[var(--text-hi)] group-hover:translate-x-0.5 transition-[color,transform] duration-[var(--dur-1)]"
                      strokeWidth={1.5}
                    />
                  </L>
                </li>
              ))}
            </ul>
            <FundingLine text={h.funding} />
          </nav>
        </div>

        {/* "Scrollen und entdecken", wie bei nvision: eine Maus mit einem
            Punkt, der nach unten laeuft (ab 768px). */}
        <div className="hidden md:flex justify-center mt-12" aria-hidden="true">
          <span className="scroll-cue">
            <span className="eyebrow-mono uppercase" style={{ fontSize: "0.625rem", letterSpacing: "0.22em" }}>
              {h.scroll}
            </span>
            <span className="scroll-cue__mouse">
              <span className="scroll-cue__dot" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * Die sichtbare Titelzeile: "Wir bauen", das wechselnde Wort im Verlauf,
 * die Akzentzeile. Dekorativ (aria-hidden); das <h1> traegt den Satz.
 */
function HeroTitle({ build, words, accent }: { build: string; words: readonly string[]; accent: string }) {
  const reduce = useReduceMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce || words.length < 2) {
      setI(0);
      return;
    }
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduce, words.length]);
  const prev = (i - 1 + words.length) % words.length;

  return (
    <p
      aria-hidden="true"
      className="display text-[var(--text-hi)] m-0"
      style={{ fontSize: "clamp(2.6rem, 1rem + 4.6vw, 5.5rem)", lineHeight: 1.02, letterSpacing: "-0.04em" }}
    >
      <span className="m-fade-up block">{build}</span>
      <span className="rotator" style={{ paddingBlock: "0.06em" }}>
        {words.map((w, n) => (
          <span key={w} className="g-text pb-[0.08em]" data-on={n === i} data-out={n === prev && !reduce}>
            {w}
          </span>
        ))}
      </span>
      <span className="m-fade-up block" style={{ animationDelay: "0.15s" }}>{accent}</span>
    </p>
  );
}

/**
 * Sterne, Note und Anzahl der Google-Bewertungen, verlinkt auf das Profil.
 * Nichts, solange GOOGLE_REVIEWS leer ist (lib/reviews.ts).
 */
function HeroReviews() {
  const t = useT();
  const locale = useLocale();
  if (!GOOGLE_REVIEWS) return null;
  const { rating, count, url } = GOOGLE_REVIEWS;
  const r = rating.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="m-fade-up mt-7 inline-flex items-center gap-3 text-[var(--text)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
      style={{ fontSize: "var(--t-small)", animationDelay: "0.45s" }}
    >
      <GoogleG />
      <Stars rating={rating} />
      {/* Der sichtbare Text ist der Name des Links (WCAG 2.5.3); "von 5"
          kommt fuer Screenreader dazu, die Sterne sind Grafik. */}
      <span>
        {t.home.intro.reviews(r, count)}
        <span className="sr-only"> ({t.home.intro.reviewsAria(r, count)})</span>
      </span>
    </a>
  );
}

/** Fuenf Sterne, anteilig gefuellt. */
function Stars({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (fill: string) => (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={fill}>
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />
        </svg>
      ))}
    </span>
  );
  return (
    <span className="relative inline-flex" aria-hidden="true">
      {row("var(--line-strong)")}
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {row("#fbbc04")}
      </span>
    </span>
  );
}

/** Googles "G", als Herkunftsangabe der Bewertung. */
function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/** Die Foerderung als eine Zeile, verlinkt auf /sme-packages. */
function FundingLine({ text }: { text: string }) {
  return (
    <L
      to="/sme-packages"
      className="group mt-4 pt-4 border-t border-[var(--line)] flex items-center gap-2 text-[var(--text)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
      style={{ fontSize: "0.8125rem", lineHeight: 1.4 }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#3ce7fc] shrink-0" aria-hidden="true" />
      <span className="flex-1">{text}</span>
      <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5" strokeWidth={1.5} />
    </L>
  );
}
