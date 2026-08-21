import { motion } from "motion/react";
import MadeInLuxembourg from "./MadeInLuxembourg";
import luxembourgImg from "../../assets/luxembourg.jpg";

/**
 * Cinematic full-bleed identity strip — real Luxembourg City photography
 * with a duotone treatment, coordinates and the certification mark.
 */
export default function LuxembourgStrip() {
  return (
    <section className="relative h-[86vh] min-h-[560px] max-h-[900px] overflow-hidden">
      {/* Real photography, duotone-treated */}
      <img
        src={luxembourgImg}
        alt="Luxembourg City, the Grund and the Alzette valley"
        loading="lazy"
        decoding="async"
        className="animate-drift absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-[1.06] brightness-[0.92]"
      />
      {/* Cinematic grade */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(4,4,12,0.90) 0%, rgba(4,4,12,0.55) 38%, rgba(4,4,12,0.10) 72%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to top, rgba(4,4,12,0.70), transparent)" }} />
      {/* Hairlines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 h-full mx-auto flex flex-col justify-center"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="eyebrow-mono flex items-center gap-3 text-[11px] font-semibold uppercase text-white/50 mb-6">
            <span className="h-px w-10 bg-white/40" />
            49.6117° N, 6.1300° E
          </div>
          <h2 className="font-medium text-white mb-6"
            style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.025em" }}>
            Engineered in Luxembourg.
            <br />
            <span className="text-white/60">Trusted across Europe.</span>
          </h2>
          <p className="text-white/65"
            style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "44ch" }}>
            From the heart of Europe's financial capital, we build digital
            systems for companies that hold themselves to a higher standard.
          </p>
        </motion.div>

        {/* Certification mark, bottom right */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-8 right-6 sm:right-10 hidden sm:block"
        >
          <MadeInLuxembourg className="h-20 w-24 text-white/85" />
        </motion.div>
      </div>
    </section>
  );
}
