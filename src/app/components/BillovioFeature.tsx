import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import billovioShot from "../../assets/work/billovio.jpg";

/**
 * §07 — Billovio.
 *
 * Its own room on the site: our own product, so it should feel like walking
 * through a door. The room used to be a straight inversion of the page, which
 * meant full black in one theme and full white in the other. It now has its
 * own tone, --surface-product: a deep blue-slate in dark, a cool light grey
 * in light. Different space, same theme. It earns the moment by scale rather
 * than by decoration —
 * the product name at display size, the statement under it, and the product
 * itself framed and running off the right edge of the screen.
 *
 * The live /try iframe this section used to embed rendered as a blank
 * rectangle whenever billovio.com was slow or blocked, leaving a void in the
 * middle of the page. A real product shot is honest and always paints; the
 * CTA still goes to the live product.
 *
 * Copy unchanged.
 */

const FEATURES = [
  "Scope written from one sentence",
  "Priced to your own rate card",
  "Signature and invoice in one flow",
  "In your brand, in about 30 seconds",
];

/** The image runs from its column to the right edge of the viewport. */
const BLEED_RIGHT = "calc(-1 * (var(--gutter) + max(0px, (100vw - var(--container)) / 2)))";

export default function BillovioFeature() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[var(--surface-product)] border-y border-[var(--line)]">
      <div
        className="mx-auto"
        style={{
          maxWidth: "var(--container)",
          paddingInline: "var(--gutter)",
          paddingBlock: "var(--section-y)",
        }}
      >
        <div className="flex items-center gap-4 mb-12">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-mid)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            07 / Our own product
          </span>
        </div>

        {/* The name, at the size a product deserves in its own room. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-baseline gap-x-8 gap-y-3"
        >
          <h2
            className="font-brand text-[var(--text-hi)]"
            style={{ fontSize: "var(--t-display)", lineHeight: 0.92, letterSpacing: "-0.04em" }}
          >
            Billovio
          </h2>
          <span
            className="eyebrow-mono uppercase text-[var(--text-mid)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            by DEEV
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-14 mt-16 items-start">
          <div className="lg:col-span-4">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
              className="text-[var(--text-hi)] font-medium"
              style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.015em" }}
            >
              We don&rsquo;t just build AI. We ship it.
            </motion.p>

            <p
              className="text-[var(--text)] mt-6"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "42ch" }}
            >
              Describe a job in one sentence and Billovio writes the scope, prices
              the work, and takes it all the way to signature and invoice.
            </p>

            <ul className="mt-12">
              {FEATURES.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-[auto_1fr] gap-x-6 py-5 border-t border-[var(--line)] last:border-b"
                >
                  <span
                    className="eyebrow-mono text-[var(--text-mid)] tabular-nums"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[var(--text)]"
                    style={{ fontSize: "var(--t-small)", lineHeight: 1.5 }}
                  >
                    {f}
                  </span>
                </motion.li>
              ))}
            </ul>

            <a
              href="https://www.billovio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 mt-12 h-12 px-7 bg-[var(--text-hi)] text-[var(--surface-product)] hover:opacity-85 transition-opacity duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
            >
              Open billovio.com
              <span className="inline-block transition-transform duration-[var(--dur-1)] group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>

          {/* The product, framed and running off the edge of the screen. */}
          <motion.div
            className="lg:col-span-8"
            style={{ marginRight: BLEED_RIGHT, ...(reduce ? {} : { y }) }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.56, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="border border-[var(--line-strong)] bg-white overflow-hidden">
              <div className="flex items-center gap-3 px-4 h-10 border-b border-black/10 bg-white">
                <span className="flex gap-1.5 shrink-0" aria-hidden="true">
                  <span className="w-[6px] h-[6px] rounded-full bg-black/20" />
                  <span className="w-[6px] h-[6px] rounded-full bg-black/20" />
                  <span className="w-[6px] h-[6px] rounded-full bg-black/20" />
                </span>
                <span
                  className="eyebrow-mono lowercase text-black/45"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.08em" }}
                >
                  billovio.com
                </span>
              </div>
              <img
                src={billovioShot}
                alt="Billovio, a quote written, priced and sent from a single sentence"
                loading="lazy"
                decoding="async"
                width={1200}
                height={820}
                className="w-full h-auto block"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
