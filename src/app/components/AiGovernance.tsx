import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Section, SectionTitle } from "./Section";
import { useT } from "../../lib/useT";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * 06 auf der KI-Seite: Evaluation und Governance.
 *
 * Links ein Testsatz aus echten Fragen des Kunden, wie er vor dem Start und
 * nach jeder Aenderung laeuft - mit den Faellen, auf die es ankommt: eine
 * gesperrte Quelle bleibt gesperrt, eine fehlende Quelle fuehrt zu "nicht
 * gefunden" statt zu einer erfundenen Antwort, und ein Treffer im falschen
 * Abschnitt wird zur Pruefung markiert. Die Zeilen sind erfunden und als
 * Beispiel gekennzeichnet. Rechts die vier Zusagen zum Betrieb.
 *
 * Bewegung: die Ergebnisse laufen einmal Zeile fuer Zeile ein.
 */

const REVIEW = 4;
const ROW_MS = 460;
const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function AiGovernance() {
  const t = useT();
  const g = t.home.aiGovernance;
  const reduce = useReduceMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [done, setDone] = useState(g.rows.length);

  useEffect(() => {
    if (!reduce) setDone(0);
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      setDone(g.rows.length);
      return;
    }
    if (!inView) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setDone(n);
      if (n >= g.rows.length) window.clearInterval(id);
    }, ROW_MS);
    return () => window.clearInterval(id);
  }, [inView, reduce, g.rows.length]);

  return (
    <Section index="06" eyebrow={g.eyebrow} tone={1}>
      <SectionTitle className="mb-12" >{g.title}</SectionTitle>
      <div className="flex flex-wrap gap-8">
        <div
          ref={ref}
          className="min-w-0 border border-[var(--line-strong)] bg-[var(--surface-0)]"
          style={{ flex: "1.5 1 560px", borderRadius: "var(--radius-1)" }}
          aria-hidden="true"
        >
          <div
            className="flex flex-wrap justify-between gap-3 px-5 py-3.5 border-b border-[var(--line)] eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span>{g.evalLabel}</span>
            <span>{g.illustrative}</span>
          </div>
          {/* Scrolls sideways on a phone: focusable and named, so a keyboard
              can reach it (WCAG 2.1.1). */}
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={g.evalLabel}>
            <table className="w-full border-collapse" style={{ minWidth: 520, fontSize: "var(--t-small)" }}>
              <thead>
                <tr>
                  {g.cols.map((c) => (
                    <th
                      key={c}
                      className="text-left font-normal eyebrow-mono uppercase text-[var(--text-low)] px-5 py-3 border-b border-[var(--line)]"
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r, i) => {
                  const ready = i < done;
                  const running = i === done;
                  const tone = i === REVIEW ? "var(--warn)" : "var(--positive)";
                  return (
                    <tr key={r.q} className={i < g.rows.length - 1 ? "border-b border-[var(--line-faint)]" : ""}>
                      <td className="px-5 py-3.5 text-[var(--text-hi)]">{r.q}</td>
                      <td className="px-5 py-3.5 text-[var(--text-low)]">{r.src}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="relative inline-block">
                          <span
                            className="eyebrow-mono uppercase"
                            style={{ fontSize: "var(--t-label)", letterSpacing: "0.1em", color: tone, opacity: ready ? 1 : 0, transition: `opacity 400ms ${ease}` }}
                          >
                            {r.result}
                          </span>
                          <span
                            className="absolute left-0 top-0 eyebrow-mono uppercase text-[var(--text-low)]"
                            style={{ fontSize: "var(--t-label)", letterSpacing: "0.1em", opacity: running ? 1 : 0, transition: `opacity 250ms ${ease}` }}
                          >
                            {g.running} …
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ul className="min-w-0 border-t border-[var(--line)]" style={{ flex: "1 1 340px" }}>
          {g.points.map((pt, i) => (
            <li key={pt.title} className="flex gap-4 py-5 border-b border-[var(--line)]">
              <span className="eyebrow-mono text-[var(--signal-text)] pt-[3px]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-body)" }}>
                  {pt.title}
                </h3>
                <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
                  {pt.copy}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
