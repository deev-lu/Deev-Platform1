import { useRef } from "react";
import { motion, useInView } from "motion/react";
import L from "./L";
import { Section, SectionTitle } from "./Section";
import { useT } from "../../lib/useT";
import { FOUNDERS, TEAM_READY } from "../../lib/team";

/**
 * §10 — Who you'll work with.
 *
 * The human counterweight to nine sections of systems, layers and
 * architecture. Two real faces, a direct note, and a straight line to a
 * conversation.
 *
 * Upper-body crops in a square frame, not the full standing figure: the
 * portraits are cropped from one shared region of two matched canvases, so the
 * two of them still line up and the crop edge reads as a single line across
 * both cards.
 *
 * The portraits are cutouts on a transparent ground, so they are not framed:
 * a ring and a 4:5 crop around a standing figure lops off heads and knees and
 * turns two people into two stock tiles. They stand on a hairline baseline
 * instead, on their own surface step, at the scale the photographs were shot
 * for.
 *
 * Photos are discovered by filename the same way project screenshots are:
 * drop fabio.webp and sven.webp into src/assets/team and they appear. Until
 * both land the section is not in the page at all — see src/lib/team.ts.
 *
 * They are also gated on the section coming into view, which loading="lazy"
 * does not do here. The homepage mounts this while it is still eleven screens
 * down, before layout has placed it, so the browser resolves "is it near the
 * viewport?" as yes and fetches both portraits during first paint. That is 232
 * KiB and six Lighthouse points spent on something nobody has scrolled to. The
 * marketing shorts had the same problem and are fixed the same way.
 */

export default function FoundersNote() {
  const t = useT();
  const ref = useRef<HTMLUListElement>(null);
  const near = useInView(ref, { once: true, margin: "600px" });

  // Both portraits or no section. See src/lib/team.ts.
  if (!TEAM_READY) return null;

  return (
    <Section index="02" eyebrow={t.home.founders.eyebrow} tone={1}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-14 items-end">

        {/* ── The note ─────────────────────────────────────── */}
        <div className="lg:col-span-5 lg:pb-4">
          <SectionTitle>{t.home.founders.title}</SectionTitle>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.56, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[var(--text-mid)]"
            style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
          >
            {t.home.founders.body1}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.56, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[var(--text-mid)]"
            style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
          >
            {t.home.founders.body2}
          </motion.p>

          <L
            to="/contact"
            className="group inline-flex items-center gap-3 mt-10 text-[var(--text-hi)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)" }}
          >
            {t.home.founders.cta}
            <span className="inline-block transition-transform duration-[var(--dur-1)] group-hover:translate-x-1">
              &rarr;
            </span>
          </L>
        </div>

        {/* ── The two of them ──────────────────────────────── */}
        <ul ref={ref} className="lg:col-span-7 grid grid-cols-2 gap-6 sm:gap-10">
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
                <div className="relative flex items-end justify-center bg-[var(--surface-2)] border-b border-[var(--line-strong)] aspect-square overflow-hidden">
                  {near && (
                    <img
                      src={f.photo}
                      alt={t.home.founders.photoAlt(f.name, t.home.founders.role)}
                      decoding="async"
                      width={800}
                      height={800}
                      className="w-full h-full object-contain object-bottom"
                    />
                  )}
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
                    {t.home.founders.role}
                  </div>
                </div>
              </motion.li>
          ))}
        </ul>

      </div>
    </Section>
  );
}
