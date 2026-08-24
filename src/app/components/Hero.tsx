import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { mark } from "../../lib/i18nMark";
import HeroReach from "./HeroReach";
import LuxShade from "./LuxShade";
import NoiseOverlay from "./NoiseOverlay";
import { scrollToId } from "../../lib/smoothScroll";
// Heavy, animation-rich — deferred so the hero text paints first
const HeroMark = lazy(() => import("./HeroMark"));


// The three claims under the headline are in the dictionary: every line is
// something the site already says elsewhere, nothing new is asserted.
export default function Hero() {
  const t = useT();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 dark:bg-[#06060a] pt-28 sm:pt-32 pb-16 transition-colors duration-300">

      {/* The work leaving Luxembourg. One background idea, not three: the
          clipped AI-workflow diagram that used to sit against the left edge
          competed with the arcs and read as stray UI. */}
      <HeroReach />
      {/* Premium film grain, dark only */}
      <NoiseOverlay className="hidden dark:block" opacity={0.04} />

      {/* Soft layered background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Two committed light sources beat five apologetic ones */}
        {/* Subtle dot-grid overlay, dark dots in light, white dots in dark */}
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

      {/* Same container as every other section, so the hero copy starts on
          the page's own left edge instead of 50px inside it. */}
      <div
        className="relative z-10 w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-14 lg:gap-8 items-center"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >

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
              {t.home.hero.eyebrow}
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-[#3CE7FC]/70 to-transparent" />
          </motion.div>

          {/* Kinetic headline */}
          <motion.h1
            /* One fluid size instead of five breakpoint steps: the old chain
               grew the type faster than the column, so "Platforms that
               convert." sat on one line at 1440 and broke with "convert."
               orphaned at 1280 and again at 1920. Capped where the longest
               line still fits the column. */
            className="text-[clamp(2.15rem,4.6vw,4.05rem)] font-medium text-slate-900 dark:text-white leading-[1.03] mb-8 tracking-[-0.035em]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.home.hero.title.map((line) => (
              <span key={line} className="block">
                {mark(line, "text-[var(--signal-text)]")}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-9 max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {t.home.hero.lead}
          </motion.p>

          {/* Three concrete claims, stated plainly */}
          <motion.ul
            className="mb-9 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {t.home.hero.claims.map((claim) => (
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
              onClick={() => scrollToId("project-builder")}
              className="group relative w-full sm:w-auto px-8 py-4 rounded-lg font-medium text-base text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              style={{ background: "var(--signal)" }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                {t.home.hero.ctaPrimary}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2F6FF8] to-[#1747C4] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <L
              to="/contact"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-base text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/[0.12] hover:border-[#2563F6]/50 dark:hover:border-white/25 hover:text-[#2563F6] dark:hover:text-white transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            >
              {t.home.hero.ctaSecondary}
            </L>
          </motion.div>

        </div>

        {/* ── Right: abstract brand mark (deferred) ─────────────────
            data-hero-anchor is what HeroReach measures, so the arcs leave
            from the mark itself rather than from a fixed coordinate that
            drifts away from it on wide screens. The silhouette lives here
            too, so country, mark and arc origin share one centre. */}
        <div className="relative lg:pl-2 flex items-center justify-center" data-hero-anchor>
          <LuxShade className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-none aspect-square opacity-[0.07] pointer-events-none" />
          <Suspense fallback={<div className="min-h-[340px]" />}>
            <HeroMark />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
