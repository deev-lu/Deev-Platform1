import { motion } from "motion/react";
import billovioShot from "../../assets/work/billovio.jpg";

/**
 * §6H — Billovio. The only inverted section on the site: DEEV's own product,
 * so it should feel like walking into a different room. Surface-inv ground,
 * text-inv type, product shot at radius-0 behind a 1px hairline.
 *
 * The live /try iframe this section used to embed rendered as a large blank
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

export default function BillovioFeature() {
  return (
    <section className="relative bg-[var(--surface-inv)]">
      <div
        className="mx-auto"
        style={{
          maxWidth: "var(--container)",
          paddingInline: "var(--gutter)",
          paddingBlock: "var(--section-y)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 items-center">

          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-10">
              <span className="h-px w-10 bg-black/20" />
              <span
                className="eyebrow-mono uppercase text-black/45"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                07 / Our own product
              </span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
              className="text-[var(--text-inv)] font-medium"
              style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em" }}
            >
              We don&rsquo;t just build AI. We ship it.
            </motion.h2>

            <div className="flex items-baseline gap-3 mt-7">
              <span className="text-[var(--text-inv)] font-medium" style={{ fontSize: "1.25rem" }}>
                Billovio
              </span>
              <span
                className="eyebrow-mono uppercase text-black/45"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                by DEEV
              </span>
            </div>

            <p
              className="text-black/65 mt-5"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              Describe a job in one sentence and Billovio writes the scope, prices
              the work, and takes it all the way to signature and invoice.
            </p>

            <ul className="mt-10 border-t border-black/10">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="eyebrow-mono uppercase text-black/60 py-4 border-b border-black/10"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="https://www.billovio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 mt-10 text-[var(--text-inv)] hover:text-[var(--signal)] transition-colors duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-small)" }}
            >
              billovio.com
              <span className="inline-block transition-transform duration-[var(--dur-1)] group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.56, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <img
              src={billovioShot}
              alt="Billovio, a quote written, priced and sent from a single sentence"
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
              style={{ borderRadius: "var(--radius-0)", border: "1px solid rgba(0,0,0,0.08)" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
