import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import { useT } from "../../lib/useT";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * 01 auf der KI-Seite: das Fundament.
 *
 * Erklaert das gemeinsame Modell des Unternehmens an einem einzigen Objekt:
 * ein Vertrag mit seinen Eigenschaften, seinen Verknuepfungen und den
 * Aktionen, die darauf erlaubt sind - eine davon nur mit Freigabe. Der
 * Vertrag ist erfunden und als Beispiel gekennzeichnet.
 *
 * Bewegung: Felder, Verknuepfungen und Aktionen erscheinen einmal gestaffelt,
 * wenn die Tafel ins Bild kommt. Keine Daueranimation.
 */

const ease = [0.16, 1, 0.3, 1] as const;

export default function AiFoundation() {
  const t = useT();
  const f = t.home.aiFoundation;
  const p = f.panel;
  const reduce = useReduceMotion();
  const appear = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.15 + i * 0.07, ease },
  });

  return (
    <Section index="01" eyebrow={f.eyebrow} tone={1}>
      <div className="flex flex-wrap items-start gap-x-16 gap-y-12">
        <div className="min-w-0" style={{ flex: "1 1 420px" }}>
          <SectionTitle>{f.title}</SectionTitle>
          <p className="mt-6 text-[var(--text-mid)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "48ch" }}>
            {f.lead}
          </p>
          <ul className="mt-10 border-t border-[var(--line)]">
            {f.points.map((pt, i) => (
              <li key={pt.title} className="flex gap-5 py-4 border-b border-[var(--line)]">
                <span className="eyebrow-mono text-[var(--signal-text)] pt-[3px]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  {String.fromCharCode(65 + i)}
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

        <div
          className="min-w-0 border border-[var(--line-strong)] bg-[var(--surface-0)]"
          style={{ flex: "1 1 520px", borderRadius: "var(--radius-1)" }}
          aria-hidden="true"
        >
          <div
            className="flex justify-between gap-3 px-5 py-3.5 border-b border-[var(--line)] eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span>{p.label}</span>
            <span>{p.illustrative}</span>
          </div>

          <div className="px-6 pt-6 flex flex-wrap justify-between gap-4">
            <div>
              <div className="text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.015em", lineHeight: 1.2 }}>
                {p.name}
              </div>
              <div className="text-[var(--text-low)] mt-1" style={{ fontSize: "var(--t-small)" }}>
                {p.party}
              </div>
            </div>
            <span
              className="self-start eyebrow-mono uppercase px-2.5 py-1.5 border text-[var(--positive)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em", borderColor: "color-mix(in srgb, var(--positive) 50%, transparent)", borderRadius: "var(--radius-1)" }}
            >
              {p.status}
            </span>
          </div>

          <div className="mx-6 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
            {p.fields.map((field, i) => (
              <motion.div key={field.k} {...appear(i)} className="bg-[var(--surface-0)] px-4 py-3.5">
                <div className="eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}>
                  {field.k}
                </div>
                <div className="text-[var(--text-hi)] mt-1" style={{ fontSize: "var(--t-small)" }}>
                  {field.v}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="px-6 pt-6">
            <div className="eyebrow-mono uppercase text-[var(--text-low)] mb-3" style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}>
              {p.linkedLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {p.linked.map((l, i) => (
                <motion.span
                  key={l}
                  {...appear(4 + i)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--line-strong)] bg-[var(--surface-1)] text-[var(--text)]"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  <span className="w-1.5 h-1.5 border border-[var(--signal-text)]" />
                  {l}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="px-6 py-6 mt-6 border-t border-[var(--line)]">
            <div className="eyebrow-mono uppercase text-[var(--text-low)] mb-3" style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}>
              {p.actionsLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {p.actions.map((a, i) => (
                <motion.span
                  key={a}
                  {...appear(8 + i)}
                  className="inline-flex items-center h-10 px-4 border border-[var(--line-strong)] text-[var(--text-hi)]"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  {a}
                </motion.span>
              ))}
              <motion.span
                {...appear(10)}
                className="inline-flex items-center gap-2 h-10 px-4 border text-[var(--warn)]"
                style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)", borderColor: "color-mix(in srgb, var(--warn) 55%, transparent)" }}
              >
                <Lock className="w-3.5 h-3.5" strokeWidth={1.75} />
                {p.gated}
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
