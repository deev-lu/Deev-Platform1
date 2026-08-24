import { motion } from "motion/react";
import { Section, SectionTitle } from "./Section";
import { useT } from "../../lib/useT";
import { mark } from "../../lib/i18nMark";
import { Deck, CARD_BASE } from "./Deck";

/**
 * AI workshops & executive concepts.
 *
 * Everything here describes DEEV's own method and deliverable. The example at
 * the end is deliberately unattributed: the underlying engagement's client
 * name, sites, headcount, portfolio size, internal tool stack and the
 * estimated annual cost of its bottlenecks are all that company's operational
 * data, and naming any two of them together would identify them to anyone in
 * the same market. What is kept is what belongs to us — how we work.
 *
 * The funding figures are public: Luxinnovation's SME Package AI & Digital.
 */

export default function AiConcepts() {
  const t = useT();
  const METHOD = t.home.ai.method.map((m, i) => ({ ...m, index: String(i + 1).padStart(2, "0") }));

  return (
    <Section index="06" eyebrow={t.home.ai.eyebrow} tone={0}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12">

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionTitle>{t.home.ai.title}</SectionTitle>
            <p
              className="mt-6 text-[var(--text-mid)]"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              {t.home.ai.lead}
            </p>

            <div className="mt-10 border-t border-[var(--line)] pt-6">
              <div
                className="eyebrow-mono uppercase text-[var(--text-low)] mb-3"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {t.home.ai.fundingLabel}
              </div>
              <p
                className="text-[var(--text-mid)]"
                style={{ fontSize: "var(--t-small)", lineHeight: 1.55, maxWidth: "46ch" }}
              >
                {mark(t.home.ai.funding, "text-[var(--positive)]")}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Deck label={t.home.ai.deckLabel} className="md:block md:border-t md:border-[var(--line)]">
            {METHOD.map((m, i) => (
              <motion.li
                key={m.index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.56, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`${CARD_BASE} border border-[var(--line)] bg-[var(--surface-1)] p-7
                            md:bg-transparent md:p-0 md:border-0 md:border-b
                            md:grid md:grid-cols-[auto_1fr] md:gap-x-10 md:py-8`}
              >
                <span
                  className="eyebrow-mono text-[var(--metal)] block mb-6 md:mb-0 md:pt-1"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {m.index}
                </span>
                <div>
                  <h3
                    className="text-[var(--text-hi)] font-medium mb-2"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.01em" }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="text-[var(--text-mid)]"
                    style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "56ch" }}
                  >
                    {m.copy}
                  </p>
                </div>
              </motion.li>
            ))}
          </Deck>

          {/* An unattributed example. Method and deliverable only. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 border border-[var(--line)] bg-[var(--surface-1)] p-9 sm:p-11"
          >
            <div
              className="eyebrow-mono uppercase text-[var(--text-low)] mb-6"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {t.home.ai.exampleLabel}
            </div>
            <p
              className="text-[var(--text)] mb-8"
              style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "52ch" }}
            >
              {t.home.ai.example}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {t.home.ai.exampleBullets.map((line) => (
                <li key={line} className="grid grid-cols-[auto_1fr] gap-x-4">
                  <span className="mt-[9px] w-4 h-px bg-[var(--signal)] shrink-0" />
                  <span
                    className="text-[var(--text-mid)]"
                    style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
                  >
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>
    </Section>
  );
}
