import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT, useLocale } from "../../lib/useT";
import { PROJECTS, sectorOf } from "../../lib/projects";

/**
 * Der Hero.
 *
 * Aufgabe laut Brief: ohne Scrollen muss klar sein, dass DEEV Websites,
 * KI-Lösungen und individuelle Anwendungen baut, wem das hilft, und wie der
 * nächste Schritt aussieht.
 *
 * Drei Entscheidungen, die vom alten Hero abweichen:
 *
 *   Die Überschrift nennt einen Nutzen, keine Kategorie. „Platforms that
 *   convert. Systems that scale." war eine Selbstbeschreibung in Fachsprache;
 *   ein Handwerksbetrieb konnte daraus nicht ableiten, ob er hier richtig ist.
 *   Der Fließtext darunter nennt die drei Leistungen ausdrücklich, damit die
 *   Überschrift nicht allein abstrakt bleibt.
 *
 *   Rechts steht ein echtes Projekt statt Dekoration. Vorher lag dort eine
 *   Luxemburg-Karte mit Radarkreisen: aufwendig, aber sie belegt nichts. Ein
 *   Screenshot einer ausgelieferten Seite belegt, dass wir liefern, und ist
 *   verlinkt, damit er nachprüfbar ist.
 *
 *   Nichts wartet. Überschrift, Text und beide Aktionen stehen im HTML und
 *   werden nicht eingeblendet. Animiert wird nur das Bild, und auch das nicht
 *   unter prefers-reduced-motion.
 */
/**
 * React 18 kennt `fetchPriority` nicht: beim Server-Rendern wird das Attribut
 * verworfen, mitsamt einer Warnung. Verloren geht es ausgerechnet im
 * vorgerenderten HTML, also genau dort, wo der Preload-Scanner es liest.
 * Kleingeschrieben durchgereicht landet der Hinweis wirklich im Dokument.
 * Mit React 19 kann daraus wieder ein normales Prop werden.
 */
const PRIORITY_HINT = { fetchpriority: "high" } as Record<string, string>;

export default function Hero() {
  const t = useT();
  const locale = useLocale();
  const reduce = useReducedMotion();

  // Das erste Projekt mit Screenshot. PROJECTS ist screenshots-first sortiert,
  // also ist das immer eine echte Ansicht und nie eine Ersatzfläche.
  const sample = PROJECTS.find((p) => p.image);

  return (
    <section
      className="relative bg-[var(--surface-0)] overflow-hidden"
      style={{ paddingTop: "calc(68px + clamp(48px, 7vw, 96px))", paddingBottom: "clamp(56px, 8vw, 112px)" }}
    >
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-14 items-center"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        {/* ── Angebot und nächster Schritt ──────────────────────────────── */}
        <div className="lg:col-span-6">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-text)]" aria-hidden="true" />
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {t.home.hero.eyebrow}
            </span>
          </div>

          <h1
            className="text-[var(--text-hi)] font-medium mt-7"
            style={{
              fontSize: "clamp(2.25rem, 1rem + 3.4vw, 3.75rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
            }}
          >
            {t.home.hero.title[0]}
            <br />
            <span className="text-[var(--text-low)]">{t.home.hero.title[1]}</span>
          </h1>

          <p
            className="text-[var(--text-mid)] mt-7"
            style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "48ch" }}
          >
            {t.home.hero.lead}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3">
            <L
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 h-13 px-7 bg-[var(--signal)] text-white font-medium"
              style={{ fontSize: "var(--t-small)", height: "52px", borderRadius: "var(--radius-1)" }}
            >
              {t.home.hero.ctaPrimary}
              <ArrowRight
                className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </L>
            <L
              to="/project"
              className="inline-flex items-center justify-center h-13 px-7 border border-[var(--line-strong)] text-[var(--text-hi)] font-medium hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-small)", height: "52px", borderRadius: "var(--radius-1)" }}
            >
              {t.home.hero.ctaSecondary}
            </L>
          </div>

          {/* Der Vertrauensanker: es sind zwei Menschen, keine Agenturhotline. */}
          <p className="text-[var(--text-low)] mt-6" style={{ fontSize: "var(--t-small)" }}>
            {t.home.hero.founders}
          </p>
        </div>

        {/* ── Echte Arbeit, kein Mockup ─────────────────────────────────── */}
        {sample?.image && (
          <motion.div
            className="lg:col-span-6"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <L to={`/work/${sample.slug}`} className="group block">
              <div
                className="border border-[var(--line)] bg-[var(--surface-1)] overflow-hidden"
                style={{ borderRadius: "var(--radius-1)" }}
              >
                {/* Browserleiste als ruhiger Rahmen: sie sagt "Website", ohne
                    den Screenshot zu verzerren oder in ein Gerät zu stecken. */}
                <div className="flex items-center gap-2 px-4 h-10 border-b border-[var(--line)]">
                  <span className="flex gap-1.5" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
                    ))}
                  </span>
                  <span
                    className="eyebrow-mono text-[var(--text-low)] lowercase truncate"
                    style={{ fontSize: "var(--t-label)" }}
                  >
                    {sample.link?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  </span>
                </div>
                <img
                  src={sample.image}
                  alt={`${sample.title}, ${sectorOf(sample, locale)}`}
                  width={1200}
                  height={680}
                  // Das ist das LCP-Bild. Nicht lazy, und mit Priorität.
                  loading="eager"
                  {...PRIORITY_HINT}
                  decoding="async"
                  className="w-full h-auto"
                />
              </div>
              <div className="flex items-baseline justify-between gap-4 mt-4">
                <span
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {t.home.hero.sampleLabel}
                </span>
                <span
                  className="text-[var(--text-mid)] group-hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
                  style={{ fontSize: "var(--t-small)" }}
                >
                  {sample.title}, {sectorOf(sample, locale)}
                </span>
              </div>
            </L>
          </motion.div>
        )}
      </div>
    </section>
  );
}
