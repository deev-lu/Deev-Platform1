import { motion } from "motion/react";
import { Section, SectionTitle, Eyebrow } from "./Section";
import { useT } from "../../lib/useT";
import { Deck, CARD_BASE } from "./Deck";

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

export default function ValueProposition() {
  const t = useT();
  const nn = (i: number) => String(i + 1).padStart(2, "0");
  const values = t.home.values.items.map((v, i) => ({ ...v, index: nn(i) }));
  const steps = t.home.values.steps.map((s, i) => ({ ...s, number: nn(i) }));

  return (
    <Section index="03" eyebrow={t.home.values.eyebrow} tone={0}>
      <div className="max-w-[760px] mb-16">
        <SectionTitle>{t.home.values.title}</SectionTitle>
      </div>

      {/* ── §6D — four panels. A swipeable deck on phones, the bordered
             2x2 from md up. Same four cards, one DOM. ───────────── */}
      <Deck
        label="What we build"
        className="md:grid md:grid-cols-2 md:border-t md:border-l md:border-[var(--line)]"
      >
        {values.map((v, i) => (
          <motion.li
            key={v.index}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.56, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className={`${CARD_BASE} group relative border border-[var(--line)] bg-[var(--surface-1)]
                       md:border-0 md:border-r md:border-b
                       hover:bg-[var(--surface-2)] hover:border-[var(--line-strong)]
                       transition-colors duration-[240ms] p-7 sm:p-12 flex flex-col
                       min-h-[268px] lg:min-h-[320px]`}
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
              {v.copy}
            </p>
          </motion.li>
        ))}
      </Deck>

      {/* ── §6E — process as a diagram ────────────────────────── */}
      <div className="mt-28">
        <Eyebrow index="03.1">{t.home.values.processEyebrow}</Eyebrow>

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
                    {s.copy}
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
                {s.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
