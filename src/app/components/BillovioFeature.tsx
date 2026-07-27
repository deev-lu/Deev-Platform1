import { motion } from "motion/react";
import { ArrowRight, FileSignature, Receipt, Sparkles, BarChart3 } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, label: "AI proposals from a one-line brief" },
  { icon: FileSignature, label: "In-browser e-signature" },
  { icon: Receipt, label: "Auto-generated invoices + VAT" },
  { icon: BarChart3, label: "Win-rate & pipeline analytics" },
];

export default function BillovioFeature() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#050509] py-16 sm:py-24 md:py-32 border-t border-slate-100 dark:border-white/5">
      {/* Ambient */}
      <div className="absolute top-1/4 -right-40 w-[520px] h-[520px] bg-[#2563F6]/[0.08] dark:bg-[#2563F6]/[0.05] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-[#3CE7FC]/[0.07] dark:bg-[#3CE7FC]/[0.04] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ── Header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-10 sm:mb-12"
        >
          <div className="eyebrow-mono flex items-center justify-center gap-3 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#3CE7FC]/70" />
            Our own product
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#3CE7FC]/70" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-slate-900 dark:text-white tracking-tight mb-4">
            We don't just build AI.{" "}
            <span className="bg-gradient-to-r from-[#3CE7FC] to-[#2563F6] bg-clip-text text-transparent">
              We ship it.
            </span>
          </h2>

          <div className="flex items-baseline justify-center gap-3 mb-4">
            <span className="text-xl font-medium text-slate-900 dark:text-white">Billovio</span>
            <span className="eyebrow-mono text-[11px] uppercase text-[#2563F6] dark:text-[#3CE7FC]">
              by DEEV
            </span>
          </div>

          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Describe a job in one sentence and Billovio writes the scope, prices
            the work, and takes it all the way to signature and invoice — in
            your brand, in about 30 seconds.{" "}
            <span className="text-slate-700 dark:text-slate-300">Try it right here.</span>
          </p>
        </motion.div>

        {/* ── Feature chips ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10"
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#2563F6] dark:text-[#3CE7FC] shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">{f.label}</span>
              </div>
            );
          })}
        </motion.div>

        {/* ── Live product embed ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-[#2563F6]/12 blur-[70px] rounded-full pointer-events-none" />

          <div className="relative rounded-lg overflow-hidden ring-1 ring-slate-200 dark:ring-white/[0.10] shadow-[0_30px_80px_-20px_rgba(15,23,42,0.22)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] bg-white dark:bg-[#0b0b14]">
            <iframe
              src="https://www.billovio.com/try"
              title="Billovio — generate a proposal"
              loading="lazy"
              className="w-full block h-[760px] sm:h-[860px] lg:h-[900px] border-0"
            />
          </div>
        </motion.div>

        {/* ── CTA ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <a
            href="https://www.billovio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-medium text-base text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(37,99,246,0.4)]"
            style={{ background: "linear-gradient(135deg, #2563F6 0%, #3CE7FC 100%)" }}
          >
            Start free on Billovio
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="https://www.billovio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium text-base text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/[0.12] hover:border-[#2563F6]/50 dark:hover:border-white/25 hover:text-[#2563F6] dark:hover:text-white transition-all duration-300"
          >
            billovio.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
