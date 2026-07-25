import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import LuxShade from "./LuxShade";
import NoiseOverlay from "./NoiseOverlay";

export default function FinalCTA() {
  return (
    <section className="relative py-16 sm:py-28 md:py-36 bg-slate-50 dark:bg-[#06060a] overflow-hidden transition-colors duration-300">
      {/* Luxembourg brand shade */}
      <LuxShade className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[260px] sm:w-[360px] aspect-square opacity-[0.04] dark:opacity-[0.05]" />
      {/* Premium film grain — dark only */}
      <NoiseOverlay className="hidden dark:block" opacity={0.04} />

      {/* Background — dark only */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(60,231,252,0.10) 0%, rgba(37,99,246,0.06) 50%, transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      {/* Subtle dot grid — both modes */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #000000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-[#2563F6] dark:text-[#3CE7FC] mb-10"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-medium tracking-widest uppercase">Ready to scale?</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-slate-900 dark:text-white leading-[1.08] mb-8 tracking-tight"
        >
          Let's build something
          <br />
          <span className="bg-gradient-to-r from-[#3CE7FC] to-[#2563F6] bg-clip-text text-transparent">
            extraordinary.
          </span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          No sales layer, no account managers. When you write to DEEV, you talk
          directly to the people who design, build and ship your project — from
          the first call to launch day.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => document.getElementById("project-builder")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative px-10 py-4 rounded-lg font-semibold text-lg text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(37,99,246,0.3)] hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #2563F6 0%, #3CE7FC 100%)" }}
          >
            <span className="relative z-10 flex items-center gap-2.5">
              Start your project
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563F6] to-[#3CE7FC] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <Link
            to="/contact"
            className="px-10 py-4 rounded-lg font-semibold text-lg text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/[0.12] hover:border-[#2563F6] dark:hover:border-white/25 hover:text-[#2563F6] dark:hover:text-white transition-all duration-300"
          >
            Say hello →
          </Link>
        </motion.div>

        {/* Personal sign-off */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="eyebrow-mono mt-14 text-[11px] uppercase text-slate-400 dark:text-slate-500"
        >
          — the DEEV founding team · Luxembourg
        </motion.div>

      </div>
    </section>
  );
}
