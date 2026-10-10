import { motion, useReducedMotion } from "motion/react";
import { BookOpenText, Bot, ChartLine, Database, ScanText, ShieldCheck } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import { useT } from "../../lib/useT";

/**
 * Was wir bauen - der Auftakt der KI-Seite.
 *
 * Sechs Leistungen, jede in einem Satz, was sie tut. Keine Ergebniszahlen:
 * die stehen uns erst zu, wenn ein Kunde sie freigibt. Die Reihenfolge folgt
 * der Seite darunter: RAG und Agenten zuerst, dann das Datenfundament, auf
 * dem beide stehen, zuletzt der Rahmen, ohne den grosse Projekte nicht
 * live gehen.
 */

const ICONS = [BookOpenText, Bot, Database, ChartLine, ScanText, ShieldCheck];

export default function AiCapabilities() {
  const t = useT();
  const c = t.home.aiCapabilities;
  const reduce = useReducedMotion();

  return (
    <Section index="01" eyebrow={c.eyebrow} tone={1}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-6 mb-14">
        <div className="lg:col-span-7">
          <SectionTitle>{c.title}</SectionTitle>
        </div>
        <p
          className="lg:col-span-5 lg:pt-3 text-[var(--text-mid)]"
          style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "48ch" }}
        >
          {c.lead}
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[var(--line)]">
        {c.items.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : (i % 3) * 0.08 + Math.floor(i / 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative border-r border-b border-[var(--line)] p-7 lg:p-9 bg-[var(--surface-1)] hover:bg-[var(--surface-0)] transition-colors duration-[var(--dur-3)]"
            >
              <span
                className="absolute left-0 top-0 h-px w-0 bg-[var(--signal)] transition-[width] duration-[var(--dur-4)] ease-[var(--ease-out)] group-hover:w-full"
                aria-hidden="true"
              />
              <div className="flex items-center justify-between mb-8">
                <Icon className="w-5 h-5 text-[var(--signal-text)]" strokeWidth={1.5} aria-hidden="true" />
                <span className="eyebrow-mono text-[var(--metal)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3
                className="text-[var(--text-hi)] font-medium mb-3"
                style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
              >
                {item.title}
              </h3>
              <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}>
                {item.copy}
              </p>
            </motion.li>
          );
        })}
      </ul>
    </Section>
  );
}
