import { motion } from "motion/react";
import { BadgeEuro, ArrowRight } from "lucide-react";
import { scrollToId } from "../../lib/smoothScroll";

export default function SmeGrantBanner() {
  const scrollToBuilder = () =>
    scrollToId("project-builder");

  return (
    <section className="relative bg-white dark:bg-[#06060a] py-10 sm:py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-edge glass-sheen group relative rounded-lg border border-emerald-300/60 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50/60 to-white/30 dark:from-emerald-950/40 dark:to-[#08080c]/60 p-6 sm:p-8 md:p-10 transition-all duration-300 hover:-translate-y-0.5 dark:"
        >
          {/* Soft glow */}

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
            {/* Icon + flag */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-14 h-14 rounded-lg bg-emerald-500 flex items-center justify-center shadow-emerald-500/30">
                <BadgeEuro className="w-7 h-7 text-white" />
              </div>
              <span className="text-4xl" aria-hidden></span>
            </div>

            {/* Copy */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-medium uppercase tracking-widest mb-2.5">
                Government-backed funding
              </div>
              <h3 className="text-xl sm:text-2xl md:text-[1.7rem] font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                Luxembourg SMEs: get up to{" "}
                <span className="text-emerald-600 dark:text-emerald-400">70% funded</span>{" "}
                by the state.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Websites, web-apps and AI projects qualify for the{" "}
                <strong className="text-slate-800 dark:text-slate-200">SME Digital &amp; SME AI packages</strong>
                : 70% of investments from €3k–€25k (ex. VAT), with up to 15% marketing
                and 15% ad spend bundled in.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={scrollToBuilder}
              className="group shrink-0 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg font-medium text-base text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 hover:-translate-y-0.5 "
            >
              See your net price
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
