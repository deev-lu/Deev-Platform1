import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useState } from "react";
import L from "./L";
import { useT } from "../../lib/useT";
import { useIsMobile } from "../../lib/useIsMobile";

/**
 * Abschnitt 4: wie ein Projekt abläuft.
 *
 * Der Text ist unverändert — er lag seit Langem lokalisiert unter
 * `home.values.steps`. Geändert hat sich, wie man ihn erlebt: statt vier
 * gleichzeitig lesbarer Spalten läuft der Ablauf jetzt am Scrollen entlang,
 * Schritt für Schritt, mit einer Linie, die mitwächst.
 *
 * Der Grund ist nicht Schmuck. „Verstehen → Bauen → Launchen → Wachsen" ist
 * eine Abfolge, und vier nebeneinanderstehende Spalten zeigen eine Aufzählung.
 * Die Bewegung trägt hier die Aussage, statt sie zu dekorieren.
 *
 * Aufbau: eine hohe Hülle (240vh), darin eine klebende Bühne von einer
 * Viewporthöhe. `useScroll` misst den Fortschritt durch die Hülle; daraus
 * ergibt sich der aktive Schritt und die Füllung der Linie. Das ist ein
 * einziger Scroll-Abonnent für den ganzen Abschnitt, kein Listener je Element.
 *
 * Drei Fassungen, bewusst getrennt:
 *
 *   Desktop: klebende Bühne, vier Spalten, waagerechte Fortschrittslinie.
 *
 *   Telefon und Tablet: eine senkrechte Zeitleiste. Vier Spalten auf 390px
 *   sind vier Schlitze, und eine klebende Bühne kostet dort genau die
 *   Scrollflüssigkeit, die auf dem Telefon das Qualitätsmerkmal ist.
 *
 *   Reduzierte Bewegung: alles gleichzeitig sichtbar, ohne Hülle, ohne
 *   Kleben. Der Inhalt darf nie von der Animation abhängen.
 */
export default function HowWeWork() {
  const t = useT();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile("(max-width: 1023px)");

  const steps = t.home.values.steps;
  const eyebrow = t.home.values.processEyebrow;
  const cta = t.home.hero.ctaPrimary;

  if (reduce || isMobile) return <Stacked steps={steps} eyebrow={eyebrow} cta={cta} timeline={!reduce} />;
  return <Sticky steps={steps} eyebrow={eyebrow} cta={cta} />;
}

type Step = { title: string; copy: string };
type Props = { steps: readonly Step[]; eyebrow: string; cta: string };

/* ── Kopfzeile, in beiden Fassungen gleich ──────────────────────────────── */
function Eyebrow({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="flex items-center gap-4">
      {/* Die Linie wächst zuerst, dann erscheint die Beschriftung: der
          Abschnitt kündigt sich an, bevor der Ablauf beginnt. */}
      <motion.span
        className="h-px bg-[var(--line-strong)]"
        initial={{ width: 0 }}
        whileInView={{ width: 40 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="eyebrow-mono uppercase text-[var(--text-low)]"
        style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.32 }}
      >
        <span className="text-[var(--metal)]">06</span> / {eyebrow}
      </motion.span>
    </div>
  );
}

/** Deckkraft nach Zustand. Kommend bleibt lesbar, nicht unsichtbar. */
const dim = (state: "past" | "now" | "next") =>
  state === "now" ? 1 : state === "past" ? 0.62 : 0.36;

/* ── Desktop ────────────────────────────────────────────────────────────── */
function Sticky({ steps, eyebrow, cta }: Props) {
  const shell = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: shell, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  // Ein Abonnent für den ganzen Abschnitt. Der Zustand wechselt nur, wenn sich
  // der Schritt wirklich ändert - nicht bei jedem Scrollpixel.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(steps.length - 1, Math.floor(v * steps.length * 1.04));
    setActive((prev) => (prev === i ? prev : i));
  });

  const fill = useTransform(scrollYProgress, [0, 0.92], ["0%", "100%"]);

  // Der Aufruf haengt am letzten Schritt, nicht an einem eigenen Scrollfenster.
  // Zwei Gruende: er erscheint damit genau dann, wenn der Ablauf durch ist -
  // die Aussage, die er tragen soll -, und er haengt nicht an einer zweiten,
  // unabhaengig gerechneten Fortschrittsgrenze, die man beim Aendern der
  // Abschnittshoehe mitpflegen muesste.
  const done = active === steps.length - 1;

  return (
    <section
      id="how-we-work"
      ref={shell}
      className="relative bg-[var(--surface-0)] border-t border-[var(--line-faint)]"
      style={{ height: "240vh" }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
          <Eyebrow eyebrow={eyebrow} />

          {/* Die Linie. Eine durchgehende Hairline mit einem Knoten je Schritt
              und einer Füllung, die dem Scrollen folgt. Kein Leuchten, kein
              großer Punkt - sie soll technisch wirken, nicht dekorativ. */}
          <div className="relative mt-20 mb-14 h-px bg-[var(--line)]">
            <motion.div className="absolute inset-y-0 left-0 bg-[var(--signal)]" style={{ width: fill }} />
            {steps.map((s, i) => (
              <span
                key={s.title}
                className="absolute -top-[3px] h-[7px] w-[7px] -translate-x-1/2 transition-colors duration-[var(--dur-2)]"
                style={{
                  left: `${(i / (steps.length - 1)) * 100}%`,
                  background: i <= active ? "var(--signal)" : "var(--line-strong)",
                  borderRadius: "var(--radius-1)",
                }}
                aria-hidden="true"
              />
            ))}
          </div>

          <ol className="grid grid-cols-4 gap-x-8">
            {steps.map((s, i) => {
              const state = i === active ? "now" : i < active ? "past" : "next";
              return (
                <motion.li
                  key={s.title}
                  animate={{ opacity: dim(state), y: state === "now" ? -6 : 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className="eyebrow-mono"
                    style={{
                      fontSize: "var(--t-label)",
                      letterSpacing: "0.16em",
                      color: i <= active ? "var(--signal-text)" : "var(--metal)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="text-[var(--text-hi)] font-medium mt-4"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-[var(--text-mid)] mt-3"
                    style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}
                  >
                    {s.copy}
                  </p>
                </motion.li>
              );
            })}
          </ol>

          {/* Der Aufruf kommt am Ende des Ablaufs, nicht von Anfang an: der
              Weg führt dorthin. Immer im Dokument und anklickbar - nur seine
              Sichtbarkeit folgt dem Scrollen. */}
          <motion.div
            className="mt-16"
            animate={{ opacity: done ? 1 : 0, y: done ? 0 : 16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            // Unsichtbar heisst hier auch unklickbar und nicht antippbar:
            // ein Ziel, das man trifft, ohne es zu sehen, ist ein Fehler.
            style={{ pointerEvents: done ? "auto" : "none" }}
            aria-hidden={!done}
          >
            <L
              to="/contact"
              className="inline-flex items-center justify-center h-[52px] px-7 bg-[var(--signal)] text-white font-medium"
              style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
            >
              {cta}
            </L>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Telefon, Tablet, reduzierte Bewegung ───────────────────────────────── */
function Stacked({ steps, eyebrow, cta, timeline }: Props & { timeline: boolean }) {
  return (
    <section
      id="how-we-work"
      className="bg-[var(--surface-0)] border-t border-[var(--line-faint)]"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <Eyebrow eyebrow={eyebrow} />

        {/* Eine senkrechte Zeitleiste: derselbe Ablauf, für ein schmales
            Gerät gedacht statt aus vier Spalten zusammengefaltet. */}
        <ol className="relative mt-14 pl-8">
          <span className="absolute left-[3px] top-2 bottom-2 w-px bg-[var(--line)]" aria-hidden="true" />
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative pb-12 last:pb-0"
              initial={timeline ? { opacity: 0, y: 12 } : false}
              whileInView={timeline ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="absolute -left-8 top-[7px] h-[7px] w-[7px] bg-[var(--signal)]"
                style={{ borderRadius: "var(--radius-1)" }}
                aria-hidden="true"
              />
              <span
                className="eyebrow-mono text-[var(--signal-text)]"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="text-[var(--text-hi)] font-medium mt-3"
                style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
              >
                {s.title}
              </h3>
              <p className="text-[var(--text-mid)] mt-2" style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}>
                {s.copy}
              </p>
            </motion.li>
          ))}
        </ol>

        <L
          to="/contact"
          className="inline-flex items-center justify-center h-[52px] px-7 mt-12 bg-[var(--signal)] text-white font-medium"
          style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
        >
          {cta}
        </L>
      </div>
    </section>
  );
}
