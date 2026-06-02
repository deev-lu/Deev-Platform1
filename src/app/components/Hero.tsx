import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import CountUp from "./CountUp";
import HeroDashboard from "./HeroDashboard";
import HeroShapes from "./HeroShapes";
import NoiseOverlay from "./NoiseOverlay";
import { useIsMobile } from "../../lib/useIsMobile";

const stats = [
  { value: "50+", label: "Projects delivered" },
  { value: "100%", label: "Client satisfaction" },
  { value: "LU 🇱🇺", label: "Based in Luxembourg" },
];

export default function Hero() {
  const isMobile = useIsMobile();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#06060a] pt-28 sm:pt-32 pb-20 transition-colors duration-300">

      {/* Decorative shades: AI workflow + Luxembourg silhouette */}
      <HeroShapes />
      {/* Premium film grain — dark only */}
      <NoiseOverlay className="hidden dark:block" opacity={0.04} />

      {/* Soft layered background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-[#0022FF]/[0.14] blur-[150px]"
          animate={isMobile ? undefined : { opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#00C6FF]/[0.10] blur-[140px]"
          animate={isMobile ? undefined : { opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className="absolute top-[20%] -right-[10%] w-[560px] h-[560px] rounded-full bg-[#0022FF]/[0.10] blur-[140px]"
          animate={isMobile ? undefined : { opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
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
        {/* Fade to page bottom */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-50 dark:from-[#06060a] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">

        {/* Premium badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center mb-7"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold tracking-wide text-[#0022FF] dark:text-[#00C6FF] border-[#0022FF]/25 dark:border-[#00C6FF]/25"
            style={{
              background: "linear-gradient(135deg, rgba(0,198,255,0.08), rgba(0,34,255,0.08))",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0022FF] dark:bg-[#00C6FF] animate-pulse" />
            <span>AI-Native Digital Engineering</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl xl:text-[5rem] font-semibold text-slate-900 dark:text-white leading-[1.05] mb-7 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          We engineer AI-native web systems
          <br className="hidden sm:block" /> that are{" "}
          <span className="bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent">
            impossible to ignore.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          We design and build AI-powered platforms, web apps, and digital
          systems engineered to convert, automate, and scale — for ambitious
          companies that refuse to blend in.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <button
            onClick={() => document.getElementById("project-builder")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,198,255,0.45)] hover:-translate-y-1 active:translate-y-0"
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
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/[0.12] hover:border-[#0022FF]/50 dark:hover:border-white/25 hover:text-[#0022FF] dark:hover:text-white transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
          >
            Book a strategy call
          </Link>
        </motion.div>

        {/* Availability signal */}
        <motion.div
          className="flex items-center justify-center gap-2.5 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Currently accepting new projects for 2026
          </span>
        </motion.div>
      </div>

      {/* Animated AI dashboard mockup */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 mt-14 sm:mt-16">
        <HeroDashboard />
      </div>

      {/* Stats strip */}
      <motion.div
        className="relative z-10 flex items-center justify-center mt-12 sm:mt-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {i > 0 && <span className="w-px h-9 bg-slate-300 dark:bg-white/[0.10] mx-5 sm:mx-8" />}
            <div className="text-center">
              <CountUp value={stat.value} className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight" />
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
