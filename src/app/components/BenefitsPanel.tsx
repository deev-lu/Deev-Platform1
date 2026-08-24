import { motion } from "motion/react";
import { Section, SectionTitle } from "./Section";
import { useT } from "../../lib/useT";

/**
 * §6C — Positioning + advantages.
 * Asymmetric 5/7. The statement is sticky through the scroll of the list.
 * Advantages are hairline-separated rows, not cards: mono index, title, copy.
 */

export default function BenefitsPanel() {
  const t = useT();
  const advantages = t.home.benefits.items.map((a, i) => ({
    ...a,
    index: String(i + 1).padStart(2, "0"),
  }));

  return (
    <Section index="03" eyebrow={t.home.benefits.eyebrow} tone={1}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12">

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionTitle>{t.home.benefits.title}</SectionTitle>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.56, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-[var(--text-mid)]"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              {t.home.benefits.lead}
            </motion.p>
          </div>
        </div>

        <ul className="lg:col-span-7 border-t border-[var(--line)]">
          {advantages.map((a, i) => (
            <motion.li
              key={a.index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.56,
                delay: Math.min(i, 4) * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10 py-7 sm:py-8 border-b border-[var(--line)]"
            >
              {/* The rule under each row draws itself as the row arrives. One
                  pass, a composited scaleX, so it costs nothing on a phone and
                  gives the list something to do besides sit there. */}
              <motion.span
                aria-hidden="true"
                className="absolute left-0 bottom-[-1px] h-px w-full origin-left bg-[var(--signal)]"
                initial={{ scaleX: 0, opacity: 0.9 }}
                whileInView={{ scaleX: 1, opacity: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
              <span
                className="eyebrow-mono text-[var(--metal)] pt-1"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {a.index}
              </span>
              <div>
                <h3
                  className="text-[var(--text-hi)] font-medium mb-2"
                  style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.01em" }}
                >
                  {a.title}
                </h3>
                <p
                  className="text-[var(--text-mid)]"
                  style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "56ch" }}
                >
                  {a.copy}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

      </div>
    </Section>
  );
}
