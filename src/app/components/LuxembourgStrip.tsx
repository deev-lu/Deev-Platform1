import { motion } from "motion/react";
import MadeInLuxembourg from "./MadeInLuxembourg";
import luxembourgImg from "../../assets/luxembourg.jpg";

/**
 * Cinematic full-bleed identity strip — real Luxembourg City photography
 * with a duotone treatment, coordinates and the certification mark.
 */
export default function LuxembourgStrip() {
  return (
    <section className="relative h-[440px] sm:h-[500px] overflow-hidden">
      {/* Real photography, duotone-treated */}
      <img
        src={luxembourgImg}
        alt="Luxembourg City — the Grund and the Alzette valley"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover grayscale-[0.45] contrast-[1.05] brightness-[0.85]"
      />
      {/* Cinematic grade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#04040c]/95 via-[#04040c]/60 to-[#04040c]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04040c]/80 via-transparent to-[#04040c]/40" />
      <div className="absolute inset-0 bg-[#0022FF]/[0.08] mix-blend-overlay" />
      {/* Hairlines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="eyebrow-mono flex items-center gap-3 text-[11px] font-semibold uppercase text-white/50 mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-[#00C6FF]/70 to-transparent" />
            49.6117° N — 6.1300° E
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-5">
            Engineered in Luxembourg.
            <br />
            <span className="text-white/60">Trusted across Europe.</span>
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-xl leading-relaxed">
            From the heart of Europe's financial capital, we build digital
            systems for companies that hold themselves to a higher standard.
          </p>
        </motion.div>

        {/* Certification mark — bottom right */}
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
