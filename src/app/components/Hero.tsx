import { motion } from "motion/react";
import { ArrowRight, Sparkles, Code2, Users2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import luxembourgImg from "../../assets/luxembourg.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-[#06060a] dark:bg-[#06060a] pt-16">

      {/* Rich layered background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[20%] -left-[15%] w-[700px] h-[700px] rounded-full bg-[#00C6FF]/[0.12] blur-[130px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[30%] -right-[15%] w-[800px] h-[800px] rounded-full bg-[#0022FF]/[0.12] blur-[140px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#0022FF]/[0.07] blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen py-24">

        {/* Left Side Content */}
        <div className="text-left">

          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold tracking-wide"
              style={{
                background: "linear-gradient(135deg, rgba(0,198,255,0.08), rgba(0,34,255,0.08))",
                borderImage: "linear-gradient(135deg, rgba(0,198,255,0.5), rgba(0,34,255,0.5)) 1",
                borderColor: "transparent",
                color: "#00C6FF",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF] animate-pulse" />
              <span>High-end Digital Agency</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.5rem] font-semibold text-white leading-[1.1] mb-7 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            We build digital systems
            <br className="hidden sm:block" /> that are{" "}
            <span className="bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent">
              impossible to ignore.
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-slate-400 mb-10 max-w-lg leading-relaxed font-normal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            AI experiences, websites, and web apps designed to convert,
            automate and scale. Engineered by humans, for humans.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {/* Primary CTA — always gradient */}
            <button
              onClick={() => document.getElementById("project-builder")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative px-8 py-4 rounded-2xl font-bold text-base text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,198,255,0.45)] hover:-translate-y-1 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #00C6FF 0%, #0055ff 100%)" }}
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Configure your project
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#0033ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Secondary CTA */}
            <a
              href="mailto:contact@deev.lu"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-slate-300 border border-white/[0.12] hover:border-white/25 hover:text-white transition-all duration-300 hover:bg-white/[0.04]"
            >
              Talk to us
            </a>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            className="flex items-center gap-5 mt-10 pt-10 border-t border-white/[0.08]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          >
            {[
              { value: "50+", label: "Projects delivered" },
              { value: "100%", label: "Client satisfaction" },
              { value: "LU 🇱🇺", label: "Based in Luxembourg" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-extrabold text-white tracking-tight">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side Visuals */}
        <motion.div
          className="relative lg:h-[680px] w-full hidden md:flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main image card */}
          <div className="relative w-full max-w-[420px] h-[520px] rounded-[28px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/[0.10]">
            <ImageWithFallback
              src={luxembourgImg}
              alt="Luxembourg City"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Location badge */}
            <div className="absolute top-5 left-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-white text-xs font-semibold tracking-wide">
                📍 Luxembourg City
              </span>
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00C6FF] to-[#0022FF] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Built in Luxembourg</div>
                  <div className="text-white/55 text-xs font-medium">Serving clients across Europe</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating card — AI Agents */}
          <motion.div
            className="absolute top-8 -right-6 xl:-right-10 bg-[#0e0e18] p-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/[0.10]"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0022FF]/30 to-[#00C6FF]/20 flex items-center justify-center border border-[#00C6FF]/20">
                <Sparkles className="w-5 h-5 text-[#00C6FF]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">AI Agents</div>
                <div className="text-xs text-slate-400 font-medium">Processing 10k+ Tasks</div>
              </div>
            </div>
          </motion.div>

          {/* Floating card — Web Systems */}
          <motion.div
            className="absolute bottom-36 -left-10 xl:-left-14 bg-[#0e0e18] p-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/[0.10]"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00C6FF]/25 to-[#0022FF]/20 flex items-center justify-center border border-[#00C6FF]/20">
                <Code2 className="w-5 h-5 text-[#00C6FF]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Web Systems</div>
                <div className="text-xs text-slate-400 font-medium">Next.js & React</div>
              </div>
            </div>
          </motion.div>

          {/* Floating card — Clients */}
          <motion.div
            className="absolute bottom-10 right-0 xl:right-2 bg-[#0e0e18] p-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/[0.10]"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/25 to-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Users2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">50+ Clients</div>
                <div className="text-xs text-slate-400 font-medium">Across Europe</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
