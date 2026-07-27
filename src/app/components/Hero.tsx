import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

// Product visual — deferred so the statement paints first
const HeroShowcase = lazy(() => import("./HeroShowcase"));

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#06060a] pt-32 sm:pt-40 pb-0 transition-colors duration-300">
      {/* One soft, calm wash of brand colour — nothing else */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[560px] pointer-events-none opacity-70 dark:opacity-100"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(37,99,246,0.16) 0%, rgba(37,99,246,0.05) 45%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Statement */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5rem] font-medium text-slate-900 dark:text-white leading-[1.04] tracking-[-0.035em]"
        >
          AI systems,
          <br />
          <span className="bg-gradient-to-r from-[#3CE7FC] to-[#2563F6] bg-clip-text text-transparent">
            beautifully engineered.
          </span>
        </motion.h1>

        {/* One line of context */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
          className="mt-7 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Websites, web apps and AI that convert, automate and scale — built in
          Luxembourg for ambitious companies across Europe.
        </motion.p>

        {/* Apple-style text links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: "easeOut" }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-9 gap-y-4"
        >
          <button
            onClick={() =>
              document.getElementById("project-builder")?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center text-lg font-medium text-[#2563F6] dark:text-[#3CE7FC] hover:opacity-70 transition-opacity duration-200"
          >
            Configure your project
            <ChevronRight className="w-4 h-4 ml-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>

          <Link
            to="/contact"
            className="group inline-flex items-center text-lg font-medium text-[#2563F6] dark:text-[#3CE7FC] hover:opacity-70 transition-opacity duration-200"
          >
            Talk to us
            <ChevronRight className="w-4 h-4 ml-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>

      {/* The product — one large, centred visual */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-16 sm:mt-20 pb-20 sm:pb-28">
        <Suspense fallback={<div className="min-h-[300px]" />}>
          <HeroShowcase />
        </Suspense>
      </div>
    </section>
  );
}
