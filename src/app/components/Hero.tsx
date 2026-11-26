import { ArrowRight, ArrowUpRight } from "lucide-react";
import L from "./L";
import { useT, useLocale } from "../../lib/useT";
import { scrollToId } from "../../lib/smoothScroll";
import { GOOGLE_REVIEWS } from "../../lib/reviews";
import { getProject, sectorOf } from "../../lib/projects";
import { mark } from "../../lib/i18nMark";
import MotionToggle from "./MotionToggle";

/**
 * Der Hero, seit dem 25.11.2026 mit einer einzigen Aufgabe: ein Luxemburger
 * Unternehmer erkennt sofort, dass er bei DEEV eine Website in Auftrag geben
 * kann, sieht ein echtes Beispiel und kann direkt anfragen.
 *
 * Links: kleine Zeile, feste Ueberschrift (das echte <h1>, nichts rotiert
 * mehr), Unterzeile, der Hauptknopf "Website-Projekt anfragen", ein
 * Textlink zur Projektauswahl (#projects) und darunter die Google-Bewertung.
 * Rechts: ein echtes Kundenprojekt (Bureau Immobilier Feltes) gross im
 * Browserrahmen; Bild und Name fuehren zur Fallstudie. Auf dem Telefon
 * kommen Ueberschrift, Text und Knopf zuerst, das Bild danach.
 *
 * Bewegung bleibt die vorhandene: Orbs (OrbField), die Zeile steigt aus der
 * Maske (.line-mask), der Rest blendet ein (.m-fade-up), die Vorschau neigt
 * sich zum Zeiger ([data-tilt]). "Bewegung anhalten" oben rechts.
 */

/** The project shown in the hero. A real client, with its own case study. */
export const HERO_PROJECT = "bureau-immobilier-feltes";

export default function Hero() {
  const t = useT();
  const locale = useLocale();
  const h = t.web.hero;
  const project = getProject(HERO_PROJECT);

  return (
    <section className="relative" aria-labelledby="hero-title">
      {/* Pause fuer alle Bewegung (WCAG 2.2.2), oben rechts unter der
          Navigation. */}
      <MotionToggle className="absolute z-10 right-4 top-[84px] md:right-6 md:top-[96px]" />

      <div
        className="relative mx-auto w-full flex flex-col justify-center lg:min-h-[min(100svh,960px)]"
        style={{
          maxWidth: "var(--container)",
          paddingInline: "var(--gutter)",
          paddingTop: "calc(68px + clamp(40px, 7vh, 104px))",
          paddingBottom: "clamp(32px, 6vh, 72px)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] items-center gap-x-14 gap-y-10">
          <div className="min-w-0">
            <div
              className="m-fade-up flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="h-px w-10 bg-[var(--line-strong)]" aria-hidden="true" />
              <span>{h.eyebrow}</span>
            </div>
            <h1
              id="hero-title"
              className="display text-[var(--text-hi)] mt-6 mb-0"
              style={{ fontSize: "clamp(2.35rem, 1.1rem + 3.3vw, 4.4rem)", lineHeight: 1.04, letterSpacing: "-0.035em", maxWidth: "15ch" }}
            >
              <span className="line-mask">
                <span>{mark(h.title, "g-text")}</span>
              </span>
            </h1>
            <p
              className="m-fade-up text-[var(--text)] mt-6 mb-0"
              style={{ maxWidth: "52ch", fontSize: "var(--t-lead)", lineHeight: 1.55, animationDelay: "0.2s" }}
            >
              {h.lead}
            </p>
            <div className="m-fade-up mt-8 flex flex-col sm:flex-row sm:items-center gap-x-7 gap-y-4" style={{ animationDelay: "0.3s" }}>
              <L
                to="/contact?interest=website"
                data-cta="project_request"
                data-cta-at="hero"
                className="btn-grad m-arrow inline-flex items-center justify-center gap-2.5 px-7 text-white font-semibold rounded-full"
                style={{ height: 56, fontSize: "var(--t-body)" }}
              >
                {h.primary}
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </L>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("projects");
                }}
                className="group inline-flex items-center justify-center sm:justify-start gap-2 font-medium text-[var(--text-hi)] underline underline-offset-[6px] decoration-[var(--line-strong)] hover:decoration-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                style={{ fontSize: "var(--t-body)" }}
              >
                {h.secondary}
                <ArrowRight className="w-4 h-4 rotate-90 transition-transform duration-[var(--dur-1)] group-hover:translate-y-0.5" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>

            {/* Google-Bewertung, dezent, direkt beim Hauptknopf. */}
            <HeroReviews />
          </div>

          {project?.image && (
            <figure className="m-fade-up m-0 min-w-0" style={{ animationDelay: "0.35s" }}>
              <L
                to={`/work/${project.slug}`}
                className="group block"
              >
                <div
                  data-tilt
                  className="card-glow overflow-hidden border border-[var(--line-strong)] bg-[var(--surface-1)] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.6)] transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5"
                  style={{ borderRadius: "var(--radius-2)" }}
                >
                  <div className="flex items-center gap-1.5 h-9 px-3.5 border-b border-[var(--line)]" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-strong)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-strong)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-strong)]" />
                    <span className="mx-auto px-3 h-5 inline-flex items-center rounded-full bg-[var(--surface-2)] eyebrow-mono text-[var(--text-low)]" style={{ fontSize: "0.6875rem", letterSpacing: "0.06em" }}>
                      {domainOf(project.link)}
                    </span>
                  </div>
                  <img
                    src={project.image}
                    alt={`${project.title}, ${sectorOf(project, locale)}`}
                    width={1000}
                    height={583}
                    loading="eager"
                    decoding="async"
                    className="block w-full h-auto"
                  />
                </div>
                <figcaption className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-x-4 gap-y-2">
                  <span className="min-w-0">
                    <span className="block eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                      {h.previewLabel} · {sectorOf(project, locale)}
                    </span>
                    <span className="block mt-1.5 text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-body)" }}>
                      {project.title}
                    </span>
                  </span>
                  <span className="shrink-0 inline-flex items-center gap-1.5 text-[var(--signal-text)] font-medium" style={{ fontSize: "var(--t-small)" }}>
                    {h.previewCta}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                  </span>
                </figcaption>
              </L>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

export function domainOf(link?: string) {
  if (!link) return null;
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
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
      className="m-fade-up mt-6 inline-flex items-center gap-3 text-[var(--text)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
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
