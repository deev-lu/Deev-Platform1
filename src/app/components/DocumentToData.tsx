import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { Check } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import { useT } from "../../lib/useT";
import { useIsMobile } from "../../lib/useIsMobile";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * Vom Dokument zu Daten - die zweite Erklaerung auf der KI-Seite.
 *
 * Eine Rechnung wird Feld fuer Feld gelesen, rechts entsteht der Datensatz,
 * ein unsicheres Feld geht zur Pruefung an einen Menschen, danach ist der
 * Beleg buchungsbereit. Jeder Wert ist erfunden und die Tafel sagt das; die
 * Sicherheitswerte zeigen den Mechanismus, sie messen nichts.
 *
 * Laeuft nur, solange die Tafel sichtbar ist. Auf dem Desktop in Schleife,
 * auf dem Telefon einmal (Performance-Regel 3), unter reduzierter Bewegung
 * gar nicht: dort steht gleich der Endzustand. Der Prerender schreibt
 * ebenfalls den Endzustand, damit das HTML ohne Skript vollstaendig ist.
 */

const FIELDS = ["supplier", "number", "date", "net", "vat", "total", "iban"] as const;
type Field = (typeof FIELDS)[number];
const CONFIDENCE: Record<Field, number> = {
  supplier: 99, number: 99, date: 98, net: 99, vat: 99, total: 99, iban: 71,
};
/** Das bekannte Muster-IBAN fuer Luxemburg, kein echtes Konto. */
const IBAN = "LU28 0019 4006 4475 0000";

const READ = 0;
const REVIEW = FIELDS.length;
const APPROVED = REVIEW + 1;
const DONE = APPROVED + 1;
const IDLE = -1;

const duration = (p: number) => (p === IDLE ? 700 : p < REVIEW ? 620 : p === REVIEW ? 1500 : p === APPROVED ? 1100 : 2800);

// Papier bleibt in beiden Themen Papier.
const INK = "#33383f";
// #5f656d: 5,9:1 auf Papier (vorher #7a8088, 3,98:1 - zu wenig fuer kleinen Text).
const INK_LOW = "#5f656d";
const BLUE = "#2563f6";
const AMBER = "#8f5a0d";

export default function DocumentToData() {
  const t = useT();
  const d = t.home.docAi;
  const reduce = useReduceMotion();
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { amount: 0.4 });
  const played = useRef(false);
  const [phase, setPhase] = useState(DONE);

  // Unter der Falz: der Wechsel auf leer ist nie zu sehen.
  useEffect(() => {
    if (!reduce) setPhase(IDLE);
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      setPhase(DONE);
      return;
    }
    if (!inView || (isMobile && played.current)) return;
    let timer: ReturnType<typeof setTimeout>;
    const run = (p: number) => {
      setPhase(p);
      timer = setTimeout(() => {
        if (p < DONE) run(p + 1);
        else if (!isMobile) run(IDLE);
        else played.current = true;
      }, duration(p));
    };
    run(IDLE);
    return () => clearTimeout(timer);
  }, [inView, reduce, isMobile]);

  const value = (f: Field) =>
    f === "supplier" ? d.doc.supplier : f === "iban" ? IBAN : d.values[f];

  const reading = phase >= READ && phase < REVIEW;
  const status =
    phase === DONE ? d.status.done : phase === APPROVED ? d.status.approved : phase === REVIEW ? d.status.review : d.status.reading;
  const statusTone =
    phase === DONE || phase === APPROVED ? "var(--positive)" : phase === REVIEW ? "var(--warn)" : "var(--signal-text)";

  /** Ein Feld auf dem Papier: hervorgehoben, solange es gelesen wird. */
  const Mark = ({ f, children, className = "" }: { f: Field; children: ReactNode; className?: string }) => {
    const i = FIELDS.indexOf(f);
    const active = phase === READ + i;
    const done = phase > READ + i && phase !== IDLE;
    const held = f === "iban" && phase === REVIEW;
    return (
      <span
        className={`relative inline-block px-1 -mx-1 ${className}`}
        style={{
          outline: held ? `1px solid ${AMBER}` : active ? `1px solid ${BLUE}` : "1px solid transparent",
          background: held ? "rgba(161,101,15,0.12)" : active ? "rgba(37,99,246,0.12)" : done ? "rgba(37,99,246,0.05)" : "transparent",
          transition: "background 320ms cubic-bezier(0.16,1,0.3,1), outline-color 320ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {children}
      </span>
    );
  };

  return (
    <Section index="05" eyebrow={d.eyebrow} tone={0}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 items-start">
        <div className="lg:col-span-5">
          <SectionTitle>{d.title}</SectionTitle>
          <p className="mt-6 text-[var(--text-mid)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}>
            {d.lead}
          </p>
          <ul className="mt-10 border-t border-[var(--line)]">
            {d.points.map((p) => (
              <li key={p} className="grid grid-cols-[auto_1fr] gap-x-4 py-4 border-b border-[var(--line)]">
                <span className="mt-[10px] w-4 h-px bg-[var(--signal)]" />
                <span className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7" ref={panelRef}>
          <div className="border border-[var(--line-strong)] bg-[var(--surface-0)]" style={{ borderRadius: "var(--radius-1)" }}>
            <div
              className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[var(--line)] eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span>{d.demoLabel}</span>
              <span aria-hidden="true">PDF → JSON</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Das Papier */}
              <div className="p-5 sm:p-7 bg-[var(--surface-2)] border-b md:border-b-0 md:border-r border-[var(--line)]">
                <div
                  className="relative overflow-hidden bg-white px-6 py-7 sm:px-7"
                  style={{ color: INK, fontSize: 12, lineHeight: 1.5, borderRadius: "var(--radius-1)", boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }}
                  aria-hidden="true"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <Mark f="supplier"><span style={{ fontWeight: 600, fontSize: 13 }}>{d.doc.supplier}</span></Mark>
                      <div style={{ color: INK_LOW }}>{d.doc.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="eyebrow-mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: INK_LOW }}>
                        {d.doc.kind.toUpperCase()}
                      </div>
                      <div><Mark f="number">{d.values.number}</Mark></div>
                      <div><Mark f="date">{d.values.date}</Mark></div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
                    {d.doc.lines.map((l) => (
                      <div key={l.label} className="flex justify-between gap-4 py-1">
                        <span>{l.label}</span>
                        <span className="tabular-nums">{l.amount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t ml-auto" style={{ borderColor: "rgba(0,0,0,0.12)", maxWidth: 220 }}>
                    <div className="flex justify-between gap-4"><span style={{ color: INK_LOW }}>{d.fields.net}</span><Mark f="net"><span className="tabular-nums">{d.values.net}</span></Mark></div>
                    <div className="flex justify-between gap-4"><span style={{ color: INK_LOW }}>{d.fields.vat}</span><Mark f="vat"><span className="tabular-nums">{d.values.vat}</span></Mark></div>
                    <div className="flex justify-between gap-4" style={{ fontWeight: 600 }}><span>{d.fields.total}</span><Mark f="total"><span className="tabular-nums">{d.values.total}</span></Mark></div>
                  </div>

                  <div className="mt-6 pt-3 border-t" style={{ borderColor: "rgba(0,0,0,0.12)", color: INK_LOW, fontSize: 11 }}>
                    {/* Unscharf gedruckt: deshalb das unsichere Feld. */}
                    IBAN <Mark f="iban"><span style={{ filter: "blur(0.5px)" }}>{IBAN}</span></Mark>
                  </div>

                  {/* Die Leselinie */}
                  {/* Immer da, nur ein- und ausgeblendet: sie gleitet Feld fuer
                      Feld linear weiter, statt bei jedem Wechsel neu zu starten. */}
                  <motion.div
                    className="absolute inset-x-0 pointer-events-none"
                    style={{ top: 0 }}
                    initial={false}
                    animate={{
                      top: reading ? `${((phase - READ + 1) / FIELDS.length) * 100}%` : phase === IDLE ? "0%" : "100%",
                      opacity: reading ? 1 : 0,
                    }}
                    transition={{
                      top: { duration: reading ? duration(READ) / 1000 : 0, ease: "linear" },
                      opacity: { duration: 0.4 },
                    }}
                  >
                    <div style={{ height: 28, marginTop: -28, background: "rgba(37,99,246,0.07)" }} />
                    <div style={{ height: 1, background: BLUE }} />
                  </motion.div>
                </div>
              </div>

              {/* Der Datensatz */}
              <div className="p-5 sm:p-7">
                <div
                  className="eyebrow-mono uppercase text-[var(--text-low)] mb-4"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {d.recordLabel}
                </div>
                <dl className="border-t border-[var(--line)]">
                  {FIELDS.map((f, i) => {
                    const filled = phase !== IDLE && phase >= READ + i;
                    const doubtful = CONFIDENCE[f] < 90;
                    const tone =
                      !doubtful || phase >= APPROVED ? "var(--positive)" : "var(--warn)";
                    const held = doubtful && phase === REVIEW;
                    return (
                      <div
                        key={f}
                        className="relative grid grid-cols-[6.5rem_1fr_auto] items-center gap-x-3 py-2.5 border-b border-[var(--line)]"
                        style={{ background: held ? "color-mix(in srgb, var(--warn) 10%, transparent)" : "transparent", transition: "background 240ms" }}
                      >
                        {/* Der Markierungsstrich sitzt im dt: ein <dl> darf direkt
                            nur dt/dd-Gruppen enthalten (WCAG 1.3.1). */}
                        <dt className="eyebrow-mono uppercase text-[var(--text-low)] truncate" style={{ fontSize: "var(--t-label)", letterSpacing: "0.1em" }}>
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-0 bottom-0 w-[2px] -translate-x-3"
                            style={{ background: held ? "var(--warn)" : "transparent", transition: "background 240ms" }}
                          />
                          {d.fields[f]}
                        </dt>
                        {/* Wert und Platzhalter stehen beide immer da und
                            blenden ineinander: kein Springen der Zeile, und
                            beim Neustart der Schleife verschwinden die Werte
                            weich statt auf einen Schlag. */}
                        <dd className="relative min-w-0">
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-24 bg-[var(--surface-2)]"
                            style={{ opacity: filled ? 0 : 1, transition: "opacity 420ms var(--ease-out)" }}
                          />
                          <motion.span
                            initial={false}
                            animate={
                              filled
                                ? { opacity: 1, clipPath: "inset(0 0% 0 0)" }
                                : { opacity: 0, clipPath: "inset(0 100% 0 0)" }
                            }
                            transition={{ duration: reduce ? 0 : filled ? 0.6 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="relative block break-words text-[var(--text-hi)] tabular-nums"
                            style={{ fontSize: "var(--t-small)" }}
                          >
                            {value(f)}
                          </motion.span>
                        </dd>
                        <dd
                          className="eyebrow-mono tabular-nums text-right"
                          style={{
                            fontSize: "var(--t-label)",
                            letterSpacing: "0.06em",
                            color: tone,
                            opacity: filled ? 1 : 0,
                            transition: "opacity 420ms var(--ease-out), color 320ms var(--ease-out)",
                            minWidth: "3.2rem",
                          }}
                        >
                          {doubtful && phase >= APPROVED ? <Check className="w-3.5 h-3.5 inline" strokeWidth={2} /> : `${CONFIDENCE[f]}%`}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                <div className="mt-2 text-right eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}>
                  {d.confidence}
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-3 px-5 py-3.5 border-t border-[var(--line)]"
              style={{ fontSize: "var(--t-small)" }}
              aria-live="off"
            >
              <span className="w-1.5 h-1.5 shrink-0" style={{ background: statusTone, borderRadius: "var(--radius-pill)", transition: "background 240ms" }} />
              <span style={{ color: statusTone, transition: "color 240ms" }}>{status}</span>
              {reading && (
                <span className="ml-auto eyebrow-mono tabular-nums text-[var(--text-low)]" style={{ fontSize: "var(--t-label)" }}>
                  {phase + 1}/{FIELDS.length}
                </span>
              )}
              {phase === DONE && <Check className="ml-auto w-4 h-4 text-[var(--positive)]" strokeWidth={2} />}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
