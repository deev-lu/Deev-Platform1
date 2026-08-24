import { motion } from "motion/react";
import { Link } from "react-router";
import { Section, SectionTitle } from "./Section";
import { FOUNDERS, TEAM_READY } from "../../lib/team";

/**
 * §10 — Who you'll work with.
 *
 * The human counterweight to nine sections of systems, layers and
 * architecture. Two real faces, a direct note, and a straight line to a
 * conversation.
 *
 * The portraits are cutouts on a transparent ground, so they are not framed:
 * a ring and a 4:5 crop around a standing figure lops off heads and knees and
 * turns two people into two stock tiles. They stand on a hairline baseline
 * instead, on their own surface step, at the scale the photographs were shot
 * for.
 *
 * Photos are discovered by filename the same way project screenshots are:
 * drop fabio.png and sven.png into src/assets/team and they appear. Until both
 * land the section is not in the page at all — see src/lib/team.ts.
 */

export default function FoundersNote() {
  // Both portraits or no section. See src/lib/team.ts.
  if (!TEAM_READY) return null;

  return (
    <Section index="10" eyebrow="Who you'll work with" tone={1}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-14 items-end">

        {/* ── The note ─────────────────────────────────────── */}
        <div className="lg:col-span-5 lg:pb-4">
          <SectionTitle>Two people. Both of them on your project.</SectionTitle>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.56, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[var(--text-mid)]"
            style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
          >
            There is no sales team here. When you write to DEEV you reach the two
            people who design and build your project, and you keep that line
            until launch day.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.56, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[var(--text-mid)]"
            style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
          >
            A small, senior studio in Luxembourg. That is deliberate: fewer
            projects, run properly, by the people whose names are on them.
          </motion.p>

          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 mt-10 text-[var(--text-hi)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)" }}
          >
            Talk to us directly
            <span className="inline-block transition-transform duration-[var(--dur-1)] group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        {/* ── The two of them ──────────────────────────────── */}
        <ul className="lg:col-span-7 grid grid-cols-2 gap-6 sm:gap-10">
          {FOUNDERS.map((f, i) => (
              <motion.li
                key={f.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.64, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* The figure stands on the rule. Bottom-aligned so both of
                    them share one baseline whatever the crop of each file. */}
                <div className="relative flex items-end justify-center bg-[var(--surface-2)] border-b border-[var(--line-strong)] aspect-[3/4] overflow-hidden">
                  <img
                    src={f.photo}
                    alt={`${f.name}, ${f.role} at DEEV`}
                    loading="lazy"
                    decoding="async"
                    width={1024}
                    height={1536}
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>

                <div className="mt-5">
                  <div
                    className="text-[var(--text-hi)] font-medium"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
                  >
                    {f.name}
                  </div>
                  <div
                    className="eyebrow-mono uppercase text-[var(--text-low)] mt-2"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {f.role}
                  </div>
                </div>
              </motion.li>
          ))}
        </ul>

      </div>
    </Section>
  );
}
