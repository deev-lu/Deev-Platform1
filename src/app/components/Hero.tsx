import { useEffect, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import CountUp from "./CountUp";
import HeroShapes from "./HeroShapes";
import NoiseOverlay from "./NoiseOverlay";
// Heavy, animation-rich — deferred so the hero text paints first
const HeroDashboard = lazy(() => import("./HeroDashboard"));

const stats = [
  { value: "50+", label: "Projects delivered" },
  { value: "100%", label: "Client satisfaction" },
  { value: "LU 🇱🇺", label: "Based in Luxembourg" },
];

// Rotating headline phrases — kept short so they always stay on one line
const PHRASES = [
  "AI systems",
  "web platforms",
  "online stores",
  "lead engines",
];

function RotatingPhrase() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % PHRASES.length), 2800);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <span className="relative block min-h-[1.18em]">
      <AnimatePresence initial={false}>
        <motion.span
          key={PHRASES[i]}
          initial={{ opacity: 0, y: "0.5em", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.5em", filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 top-0 whitespace-nowrap bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent"
        >
          {PHRASES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 dark:bg-[#06060a] pt-28 sm:pt-32 pb-16 transition-colors duration-300">

      {/* Decorative shades: AI workflow + Luxembourg silhouette */}
      <HeroShapes />
      {/* Premium film grain — dark only */}
      <NoiseOverlay className="hidden dark:block" opacity={0.04} />

      {/* Soft layered background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[15%] left-1/3 w-[900px] h-[700px] rounded-full bg-[#0022FF]/[0.14] blur-[70px] md:blur-[150px]"
        />
        <div
          className="absolute top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#00C6FF]/[0.10] blur-[70px] md:blur-[140px]"
        />
        <div
          className="absolute top-[30%] -right-[10%] w-[560px] h-[560px] rounded-full bg-[#0022FF]/[0.10] blur-[70px] md:blur-[140px]"
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-14 lg:gap-12 items-center">

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
              <span className="w-1.5 h-1.5 rounded-full bg-[#0022FF] dark:bg-[#00C6FF] animate-pulse" />
              AI-native digital engineering — Luxembourg
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-[#00C6FF]/70 to-transparent" />
          </motion.div>

          {/* Kinetic headline */}
          <motion.h1
            className="text-[2.5rem] sm:text-6xl lg:text-[3.4rem] xl:text-[3.9rem] 2xl:text-[4.3rem] font-light text-slate-900 dark:text-white leading-[1.08] mb-8 tracking-[-0.02em]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block">We engineer</span>
            <RotatingPhrase />
            <span className="block">impossible to ignore.</span>
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

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={() => document.getElementById("project-builder")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative w-full sm:w-auto px-8 py-4 rounded-lg font-medium text-base text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,198,255,0.45)] hover:-translate-y-1 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #00C6FF 0%, #0055ff 100%)" }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                Configure your project
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#0033ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <Link
              to="/contact"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-base text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/[0.12] hover:border-[#0022FF]/50 dark:hover:border-white/25 hover:text-[#0022FF] dark:hover:text-white transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            >
              Book a strategy call
            </Link>
          </motion.div>

          {/* Terminal status */}
          <motion.div
            className="flex items-center gap-2.5 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="eyebrow-mono text-[11px] sm:text-xs uppercase text-slate-600 dark:text-slate-400">
              systems online — accepting projects for 2026
              <span className="caret-blink text-[#00C6FF]">&nbsp;▌</span>
            </span>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="flex items-center mt-9 pt-8 border-t border-slate-200 dark:border-white/[0.08]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                {i > 0 && <span className="w-px h-9 bg-slate-300 dark:bg-white/[0.10] mx-5 sm:mx-7" />}
                <div>
                  <CountUp value={stat.value} className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight" />
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: live AI dashboard (deferred) ─────────────────── */}
        <div className="relative lg:pl-2">
          <Suspense fallback={<div className="min-h-[340px]" />}>
            <HeroDashboard />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
