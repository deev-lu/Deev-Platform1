import { motion } from "motion/react";
import { Section, SectionTitle } from "./Section";

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

const METHOD = [
  {
    index: "01",
    title: "Discovery, on site",
    copy: "A working session with the people who actually run the processes, not a management interview. We walk each workflow with the person who lives in it and record where it stalls.",
  },
  {
    index: "02",
    title: "Every flow, end to end",
    copy: "For each major process we reconstruct the full path of information, from the trigger to the resolution, noting every manual handoff, every tool involved and every point where work waits.",
  },
  {
    index: "03",
    title: "Costed, not asserted",
    copy: "Each bottleneck is converted into an estimated annual cost from your own volumes and a conservative loaded hourly rate, then sanity-checked against comparable firms. You get arithmetic you can argue with, not adjectives.",
  },
  {
    index: "04",
    title: "An architecture that integrates",
    copy: "The systems you already run stay. The AI layer sits on top of them, so the existing investment is protected and adoption can be gradual instead of a migration.",
  },
  {
    index: "05",
    title: "A phased roadmap",
    copy: "Twelve months, four phases, each one shipping something usable in production. No AI project worth doing runs as a single launch, and the first tangible gains land inside the first two months.",
  },
];

export default function AiConcepts() {
  return (
    <Section index="06" eyebrow="AI workshops & concepts" tone={0}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12">

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionTitle>
              Before we build anything, we map where AI actually pays.
            </SectionTitle>
            <p
              className="mt-6 text-[var(--text-mid)]"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              We run AI discovery workshops with operations teams and turn them
              into an executive concept: the bottlenecks, what each one costs a
              year, the architecture that removes them, and a phased plan to get
              there. It is a document you can take to a board, not a pitch deck.
            </p>

            <div className="mt-10 border-t border-[var(--line)] pt-6">
              <div
                className="eyebrow-mono uppercase text-[var(--text-low)] mb-3"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                Funding
              </div>
              <p
                className="text-[var(--text-mid)]"
                style={{ fontSize: "var(--t-small)", lineHeight: 1.55, maxWidth: "46ch" }}
              >
                Luxembourg SMEs can cover up to{" "}
                <span className="text-[var(--positive)]">70%</span> of eligible
                costs through Luxinnovation&rsquo;s SME Package AI &amp; Digital,
                capped at €25,000 of grant per project.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="border-t border-[var(--line)]">
            {METHOD.map((m, i) => (
              <motion.li
                key={m.index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.56, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10 py-8 border-b border-[var(--line)]"
              >
                <span
                  className="eyebrow-mono text-[var(--metal)] pt-1"
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
          </ul>

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
              A recent concept
            </div>
            <p
              className="text-[var(--text)] mb-8"
              style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "52ch" }}
            >
              For a Luxembourg property-management group we ran a discovery
              session with its operations and process leads, mapped seven
              business processes end to end, and delivered a thirty-page
              executive concept.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {[
                "Seven operational bottlenecks identified and individually costed",
                "A four-pillar AI architecture layered over the existing systems",
                "A twelve-month roadmap in four production phases",
                "Eligible cost and grant path mapped per phase",
              ].map((line) => (
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
