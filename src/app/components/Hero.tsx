import { ArrowRight } from "lucide-react";
import L from "./L";
import HeroWork from "./HeroWork";
import { useT } from "../../lib/useT";

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
 *   Rechts stehen echte Projekte im Wechsel, keine Dekoration. Ein
 *   Screenshot einer ausgelieferten Seite belegt, dass wir liefern; eine
 *   Illustration belegt nichts. Anklickbar und verlinkt, damit der Besucher
 *   selbst wählen und nachsehen kann.
 *
 *   Nichts wartet. Überschrift, Text, beide Aktionen und die erste
 *   Arbeitsprobe stehen im HTML und werden nicht eingeblendet; ohne
 *   JavaScript bliebe sonst die halbe Fläche leer.
 */
export default function Hero() {
  const t = useT();


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

        {/* ── Echte Arbeit, im Wechsel ──────────────────────────────────
            Drei ausgelieferte Projekte statt einer Illustration. Anklickbar,
            damit man selbst wählen kann, und verlinkt, damit es nachprüfbar
            bleibt. */}
        <HeroWork />

      </div>
    </section>
  );
}
