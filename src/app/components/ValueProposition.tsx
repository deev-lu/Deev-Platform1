import { motion } from "motion/react";
import { Section, SectionTitle, Eyebrow } from "./Section";

/**
 * §6D — What we build. A 2×2 of full hairline-bordered panels. On hover the
 * panel lifts one surface step and the hairline strengthens. No shadow, no
 * scale, no colour change.
 *
 * §6E — Process. One horizontal rule with four numbered nodes hung beneath it,
 * a diagram rather than four more cards. Vertical on mobile.
 *
 * Copy is unchanged from the previous implementation.
 */

const values = [
  {
    index: "01",
    title: "AI-native products",
    description:
      "AI agents and assistants that actually know your business: answering customers, qualifying leads and handling the busywork your team shouldn't be stuck with.",
  },
  {
    index: "02",
    title: "Platforms that scale",
    description:
      "Web apps and platforms that handle real customers from day one, and keep working just as well when you're ten times busier.",
  },
  {
    index: "03",
    title: "Websites that convert",
    description:
      "Fast, beautiful websites that turn visitors into customers, and that Google actually rewards.",
  },
  {
    index: "04",
    title: "Growth that performs",
    description:
      "Ads, SEO and campaigns that bring you qualified leads, measured properly, so you always know what's working.",
  },
];

const steps = [
  { number: "01", title: "Understand", description: "We start by understanding your business, your goals and what you're up against." },
  { number: "02", title: "Build", description: "We build it ourselves. No handoffs, no outsourcing, no juniors learning on your budget." },
  { number: "03", title: "Launch", description: "Tested and monitored, ready for real customers from the first day it's live." },
  { number: "04", title: "Scale", description: "We stick around: improving, supporting and keeping you ahead." },
];

export default function ValueProposition() {
  return (
    <Section index="02" eyebrow="What we build" tone={0}>
      <div className="max-w-[760px] mb-16">
        <SectionTitle>Everything your business needs to compete online</SectionTitle>
      </div>

      {/* ── §6D — four panels ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[var(--line)]">
        {values.map((v, i) => (
          <motion.div
            key={v.index}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.56, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border-r border-b border-[var(--line)] bg-[var(--surface-1)]
                       hover:bg-[var(--surface-2)] hover:border-[var(--line-strong)]
                       transition-colors duration-[240ms] p-9 sm:p-12 flex flex-col
                       min-h-[280px] lg:min-h-[320px]"
          >
            <span
              className="eyebrow-mono text-[var(--metal)] mb-8"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {v.index}
            </span>
            <h3
              className="text-[var(--text-hi)] font-medium mb-4 mt-auto"
              style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.01em" }}
            >
              {v.title}
            </h3>
            <p
              className="text-[var(--text-mid)]"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              {v.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── §6E — process as a diagram ────────────────────────── */}
      <div className="mt-28">
        <Eyebrow index="02.1">How we work</Eyebrow>

        {/* desktop: nodes hung from one rule */}
        <div className="hidden md:block">
          <div className="relative border-t border-[var(--line)]">
            <div className="grid grid-cols-4">
              {steps.map((s, i) => (
                <motion.div
                  key={s.number}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.56, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pr-10 pt-10"
                >
                  <span className="absolute -top-[3px] left-0 w-[5px] h-[5px] rounded-full bg-[var(--signal)]" />
                  <span
                    className="eyebrow-mono text-[var(--metal)] block mb-4"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {s.number}
                  </span>
                  <h3 className="text-[var(--text-hi)] font-medium mb-3" style={{ fontSize: "1.25rem" }}>
                    {s.title}
                  </h3>
                  <p
                    className="text-[var(--text-mid)]"
                    style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
                  >
                    {s.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* mobile: the same rule, vertical */}
        <div className="md:hidden border-l border-[var(--line)] pl-7">
          {steps.map((s) => (
            <div key={s.number} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[30px] top-[7px] w-[5px] h-[5px] rounded-full bg-[var(--signal)]" />
              <span
                className="eyebrow-mono text-[var(--metal)] block mb-2"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {s.number}
              </span>
              <h3 className="text-[var(--text-hi)] font-medium mb-2" style={{ fontSize: "1.125rem" }}>
                {s.title}
              </h3>
              <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
