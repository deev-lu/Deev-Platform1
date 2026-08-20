import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import HeroShapes from "./HeroShapes";
import NoiseOverlay from "./NoiseOverlay";
// Heavy, animation-rich — deferred so the hero text paints first
const HeroMark = lazy(() => import("./HeroMark"));


// Stated plainly under the headline. Every line here is something the site
// already claims elsewhere — nothing new is asserted.
const CLAIMS = [
  "AI-native web platforms, web apps and online stores",
  "Lead engines engineered to convert, not just to look good",
  "Up to 70% funded by the Luxembourg SME state grant",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 dark:bg-[#06060a] pt-28 sm:pt-32 pb-16 transition-colors duration-300">

      {/* Decorative shades: AI workflow + Luxembourg silhouette */}
      <HeroShapes />
      {/* Premium film grain — dark only */}
      <NoiseOverlay className="hidden dark:block" opacity={0.04} />

      {/* Soft layered background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Two committed light sources beat five apologetic ones */}
        <div
          className="absolute -top-[18%] left-[38%] w-[1000px] h-[760px] rounded-full bg-[#2563F6]/[0.22] dark:bg-[#2563F6]/[0.20] blur-[50px] md:blur-[160px]"
        />
        <div
          className="absolute top-[26%] -right-[6%] w-[620px] h-[620px] rounded-full bg-[#3CE7FC]/[0.20] dark:bg-[#3CE7FC]/[0.14] blur-[50px] md:blur-[150px]"
        />
        {/* Subtle dot-grid overlay — dark dots in light, white dots in dark */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:hidden"
          style={{
            backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] hidden dark:block"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        {/* Perspective data-grid floor (desktop) */}
        <div className="hero-grid-floor hidden md:block opacity-50 dark:opacity-100" />
        {/* Fade to page bottom */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-50 dark:from-[#06060a] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-14 lg:gap-8 items-center">

        {/* ── Left: editorial content ─────────────────────────────── */}
        <div className="text-left">
          {/* Mono eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow-mono flex items-center gap-3 text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-8"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563F6] dark:bg-[#3CE7FC] animate-pulse" />
              AI-native digital engineering — Luxembourg
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-[#3CE7FC]/70 to-transparent" />
          </motion.div>

          {/* Kinetic headline */}
          <motion.h1
            className="text-[2.45rem] sm:text-[3.4rem] lg:text-[3.45rem] xl:text-[4.05rem] 2xl:text-[4.5rem] font-medium text-slate-900 dark:text-white leading-[1.03] mb-8 tracking-[-0.035em]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block bg-gradient-to-r from-[#3CE7FC] to-[#2563F6] bg-clip-text text-transparent">
              Platforms that convert.
            </span>
            <span className="block bg-gradient-to-r from-[#3CE7FC] to-[#2563F6] bg-clip-text text-transparent">
              Systems that scale.
            </span>
            <span className="block">Built in Luxembourg.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-9 max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            AI-powered platforms, web apps and digital systems engineered to
            convert, automate and scale — built in Luxembourg for ambitious
            companies across Europe.
          </motion.p>

          {/* Three concrete claims, stated plainly */}
          <motion.ul
            className="mb-9 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {CLAIMS.map((claim) => (
              <li key={claim} className="flex items-start gap-3">
                <Check className="w-[18px] h-[18px] mt-[3px] shrink-0 text-[#2563F6] dark:text-[#3CE7FC]" />
                <span className="text-[15px] text-slate-600 dark:text-slate-300">{claim}</span>
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42, ease: "easeOut" }}
          >
            <button
              onClick={() => document.getElementById("project-builder")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative w-full sm:w-auto px-8 py-4 rounded-lg font-medium text-base text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(60,231,252,0.45)] hover:-translate-y-1 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #2563F6 0%, #1747C4 100%)" }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                Configure your project
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2F6FF8] to-[#1747C4] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <Link
              to="/contact"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-base text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/[0.12] hover:border-[#2563F6]/50 dark:hover:border-white/25 hover:text-[#2563F6] dark:hover:text-white transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            >
              Book a strategy call
            </Link>
          </motion.div>

        </div>

        {/* ── Right: abstract brand mark (deferred) ───────────────── */}
        <div className="relative lg:pl-2">
          <Suspense fallback={<div className="min-h-[340px]" />}>
            <HeroMark />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
