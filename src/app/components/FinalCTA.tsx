import { motion } from "motion/react";
import L from "./L";
import { scrollToId } from "../../lib/smoothScroll";
import { useT } from "../../lib/useT";

/**
 * §6K — Closing CTA. Near-empty: one headline at h1 scale, one paragraph,
 * one primary CTA and one text link, with 240px of air above and below.
 * Copy unchanged from the previous implementation.
 */
export default function FinalCTA() {
  const t = useT();

  return (
    <section className="relative bg-[var(--surface-0)] border-t border-[var(--line)]">
      <div
        className="mx-auto text-center"
        style={{
          maxWidth: "var(--container)",
          paddingInline: "var(--gutter)",
          paddingBlock: "clamp(160px, 18vw, 260px)",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
          className="text-[var(--text-hi)] font-medium mx-auto"
          style={{
            fontSize: "var(--t-h1)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            maxWidth: "18ch",
          }}
        >
          {t.home.finalCta.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.56, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="text-[var(--text-mid)] mx-auto mt-8"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "48ch" }}
        >
          {t.home.finalCta.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.56, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-col sm:flex-row gap-8 sm:gap-10 items-center justify-center"
        >
          <button
            onClick={() =>
              scrollToId("project-builder")
            }
            className="h-11 px-7 text-white font-medium transition-colors duration-[var(--dur-1)] hover:bg-[var(--signal-hi)]"
            style={{
              background: "var(--signal)",
              borderRadius: "var(--radius-2)",
              fontSize: "var(--t-small)",
            }}
          >
            {t.home.finalCta.primary}
          </button>

          <L
            to="/contact"
            className="group inline-flex items-center gap-2 text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)" }}
          >
            {t.home.finalCta.secondary}
            <span className="inline-block transition-transform duration-[var(--dur-1)] group-hover:translate-x-1">
              &rarr;
            </span>
          </L>
        </motion.div>
      </div>
    </section>
  );
}
