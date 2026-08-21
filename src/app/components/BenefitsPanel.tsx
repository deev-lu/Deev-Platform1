import { motion } from "motion/react";
import { Section, SectionTitle } from "./Section";

/**
 * §6C — Positioning + advantages.
 * Asymmetric 5/7. The statement is sticky through the scroll of the list.
 * Advantages are hairline-separated rows, not cards: mono index, title, copy.
 */

const ADVANTAGES = [
  {
    index: "01",
    title: "Predictable enquiries",
    copy: "Traffic is directed at a single goal and the path to it is designed, so qualified enquiries arrive steadily instead of by chance.",
  },
  {
    index: "02",
    title: "Measurable outcomes",
    copy: "Every build ships with analytics wired in from day one, so you can see what the work returns rather than take it on faith.",
  },
  {
    index: "03",
    title: "AI where it earns its place",
    copy: "Automation applied to the steps that actually cost you time — not bolted on because the word sells.",
  },
  {
    index: "04",
    title: "Full transparency",
    copy: "You talk to the people who design and build your project, and you always know what is being worked on and why.",
  },
];

export default function BenefitsPanel() {
  return (
    <Section index="01" eyebrow="Why it works" tone={1}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12">

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionTitle>
              Digital systems engineered for sustainable growth
            </SectionTitle>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.56, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-[var(--text-mid)]"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              We build the whole system, not a single piece of it — the site, the
              product behind it, and the campaigns that feed it. Clear structure,
              decisions grounded in data, and work whose commercial effect can
              actually be measured.
            </motion.p>
          </div>
        </div>

        <ul className="lg:col-span-7 border-t border-[var(--line)]">
          {ADVANTAGES.map((a, i) => (
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
              className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10 py-8 border-b border-[var(--line)]"
            >
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
