import { motion, useReducedMotion } from "motion/react";
import LiteYouTube from "./LiteYouTube";
import { useT } from "../../lib/useT";

/**
 * „In Bewegung" — die Aufnahmen der Arbeit, auf der Startseite.
 *
 * Der Block stand bisher unten auf der Marketingseite, als Unterabschnitt
 * 06.1. Dort hat ihn fast niemand gesehen, obwohl er das Einzige auf der
 * Seite ist, das die Arbeit in Bewegung zeigt - ein Screenshot beweist, dass
 * etwas existiert, eine Aufnahme, dass es sich gut anfühlt.
 *
 * Er steht jetzt direkt hinter den Referenzen: dieselbe Arbeit, eine Stufe
 * tiefer. Verschoben, nicht kopiert - auf der Marketingseite ist er
 * entfallen, damit es ihn nicht zweimal gibt.
 *
 * Wenig Text, mit Absicht. Die Aufnahmen sind der Inhalt.
 *
 * Geladen wird nichts, bis jemand abspielt: `LiteYouTube` zeigt zuerst nur
 * das Standbild. Vier Videos gleichzeitig einzubetten würde die Startseite
 * sonst mehr kosten als alles andere zusammen.
 */
const VIDEO_IDS = ["LeAYeRih-_Y", "zURSJEqZO2E", "j9zL-hiTnF4", "J0xtCDzHrXU"];

export default function InMotion() {
  const t = useT();
  const reduce = useReducedMotion();
  const m = t.home.inMotion;

  return (
    <section
      id="in-motion"
      className="bg-[var(--surface-0)] border-t border-[var(--line-faint)]"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-7">
              <span className="h-px w-10 bg-[var(--line-strong)]" />
              <span
                className="eyebrow-mono uppercase text-[var(--text-low)]"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                <span className="text-[var(--metal)]">02</span> / {m.eyebrow}
              </span>
            </div>
            <h2
              className="text-[var(--text-hi)] font-medium"
              style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.028em" }}
            >
              {m.title}
            </h2>
          </div>

          <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-lead)" }}>
            {m.lead}
          </p>
        </div>

        {/* Hochformat, so wie aufgenommen. Auf dem Telefon zwei nebeneinander:
            einzeln untereinander wären vier Hochkantvideos ein halber
            Kilometer Scrollweg. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {VIDEO_IDS.map((id, i) => (
            <motion.div
              key={id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <LiteYouTube id={id} title={t.home.marketing.videoTitle(i + 1, VIDEO_IDS.length)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
