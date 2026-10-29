import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Section, SectionTitle } from "./Section";
import { useT } from "../../lib/useT";

/**
 * 03 auf der KI-Seite: Agenten und Ablaeufe.
 *
 * Ein Agentenlauf als Protokoll: Eingang, Einordnung, Abruf aus dem Vertrag
 * (RAG), eine Regel greift, Entwurf, und dann haelt er an und wartet auf
 * einen Menschen. Genau das ist die Aussage: der Agent erledigt die Arbeit,
 * die Entscheidung bleibt beim Menschen. Der Lauf ist erfunden und als
 * Beispiel gekennzeichnet.
 *
 * Bewegung: die Schritte laufen einmal nacheinander ein, wenn das Protokoll
 * ins Bild kommt; danach steht es. Prerender und reduzierte Bewegung zeigen
 * gleich alles. Der Freigabepunkt pulsiert nur auf dem Desktop.
 */

const TIMES = ["09:14:02", "09:14:03", "09:14:05", "09:14:06", "09:14:09", "09:14:09", "—"];
const RETRIEVE = 2;
const CHECK = 3;
const APPROVAL = 5;
const PENDING = 6;
const STEP_MS = 520;

const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function AgentRun() {
  const t = useT();
  const a = t.home.aiAgents;
  const steps = a.panel.steps;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [shown, setShown] = useState(steps.length);

  // Unter der Falz: der Wechsel auf leer ist nie zu sehen.
  useEffect(() => {
    if (!reduce) setShown(0);
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      setShown(steps.length);
      return;
    }
    if (!inView) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= steps.length) window.clearInterval(id);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [inView, reduce, steps.length]);

  const waiting = shown > APPROVAL;

  return (
    <Section index="03" eyebrow={a.eyebrow} tone={1}>
      <div className="flex flex-wrap items-start gap-x-16 gap-y-12">
        <div className="min-w-0" style={{ flex: "1 1 360px" }}>
          <SectionTitle>{a.title}</SectionTitle>
          <p className="mt-6 text-[var(--text-mid)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "46ch" }}>
            {a.lead}
          </p>
          <ul className="mt-9 space-y-3">
            {a.points.map((pt) => (
              <li key={pt} className="flex items-center gap-3 text-[var(--text)]" style={{ fontSize: "var(--t-small)" }}>
                <span className="w-[18px] h-px bg-[var(--signal)] shrink-0" aria-hidden="true" />
                {pt}
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={ref}
          className="min-w-0 border border-[var(--line-strong)] bg-[var(--surface-0)]"
          style={{ flex: "1.4 1 560px", borderRadius: "var(--radius-1)" }}
          aria-hidden="true"
        >
          <div
            className="flex flex-wrap justify-between gap-3 px-5 py-3.5 border-b border-[var(--line)] eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span>{a.panel.label}</span>
            <span>{a.panel.illustrative}</span>
          </div>

          <ol className="py-2">
            {steps.map((s, i) => {
              const visible = i < shown;
              const check = i === CHECK;
              const approval = i === APPROVAL;
              const kindColor = check ? "var(--warn)" : approval || i === RETRIEVE ? "var(--signal-text)" : "var(--text-low)";
              return (
                <li
                  key={s.kind}
                  className="relative grid gap-x-4 gap-y-1 px-5 py-3.5 grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[84px_112px_minmax(0,1fr)] items-baseline"
                  style={{
                    opacity: visible ? (i === PENDING ? 0.5 : 1) : 0,
                    transform: visible ? "none" : "translateY(4px)",
                    background: check
                      ? "color-mix(in srgb, var(--warn) 9%, transparent)"
                      : approval
                        ? "var(--signal-dim)"
                        : "transparent",
                    transition: `opacity 420ms ${ease}, transform 420ms ${ease}`,
                  }}
                >
                  {check && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--warn)]" />}
                  <span
                    className="hidden sm:inline eyebrow-mono tabular-nums text-[var(--text-low)]"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.04em" }}
                  >
                    {TIMES[i]}
                  </span>
                  <span
                    className="eyebrow-mono uppercase inline-flex items-center gap-2"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em", color: kindColor }}
                  >
                    {approval && <span className="w-1.5 h-1.5 rounded-full bg-[#3CE7FC] md:motion-safe:animate-pulse" />}
                    {s.kind}
                  </span>
                  <span className={check || approval ? "text-[var(--text-hi)]" : "text-[var(--text)]"} style={{ fontSize: "var(--t-small)" }}>
                    {s.text}
                    {i === RETRIEVE && (
                      <span
                        className="eyebrow-mono ml-2 px-1.5 border border-[var(--signal)] text-[var(--signal-text)]"
                        style={{ fontSize: "0.68rem", letterSpacing: "0.04em", borderRadius: "var(--radius-1)" }}
                      >
                        RAG
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-wrap gap-2.5 px-5 py-4 border-t border-[var(--line)]">
            <span
              className="inline-flex items-center h-11 px-5 font-medium"
              style={{
                fontSize: "var(--t-small)",
                borderRadius: "var(--radius-1)",
                background: waiting ? "var(--signal)" : "var(--surface-2)",
                color: waiting ? "#fff" : "var(--text-low)",
                transition: `background 500ms ${ease}, color 500ms ${ease}`,
              }}
            >
              {a.panel.approve}
            </span>
            <span className="inline-flex items-center h-11 px-5 border border-[var(--line-strong)] text-[var(--text-hi)]" style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}>
              {a.panel.edit}
            </span>
            <span className="inline-flex items-center h-11 px-5 border border-[var(--line-strong)] text-[var(--text-hi)]" style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}>
              {a.panel.reject}
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
