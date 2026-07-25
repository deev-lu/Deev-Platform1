import { motion } from "motion/react";
import NoiseOverlay from "./NoiseOverlay";

/**
 * "The System" — editorial dark band with a pure-CSS 3D layered stack.
 * Three planes (Interface / Intelligence / Infrastructure) rotate slowly;
 * copy rows on the right map to each layer. No WebGL, compositor-only.
 */

const LAYERS = [
  {
    n: "01",
    name: "Interface",
    desc: "The websites and products your customers touch — fast, precise, engineered to convert.",
  },
  {
    n: "02",
    name: "Intelligence",
    desc: "AI agents and automations working inside your operations — qualifying, answering, executing.",
  },
  {
    n: "03",
    name: "Infrastructure",
    desc: "EU-hosted, GDPR-native foundations built to scale without drama.",
  },
];

// Plane visual order: bottom → top
const PLANES = [
  { z: 0, opacity: 0.95, tone: "rgba(37,99,246,0.16)", border: "rgba(37,99,246,0.55)" },
  { z: 74, opacity: 0.95, tone: "rgba(0,120,255,0.14)", border: "rgba(0,140,255,0.55)" },
  { z: 148, opacity: 1, tone: "rgba(60,231,252,0.14)", border: "rgba(60,231,252,0.65)" },
];

export default function SystemStack() {
  return (
    <section className="relative overflow-hidden bg-[#050509] py-20 sm:py-28 md:py-32">
      {/* Ambient */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[500px] bg-[#2563F6]/[0.10] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#3CE7FC]/[0.06] rounded-full blur-[130px] pointer-events-none" />
      <NoiseOverlay opacity={0.035} />
      {/* Hairline frame */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-8 items-center">
        {/* ── 3D stack ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="stack-scene relative h-[340px] sm:h-[420px] flex items-center justify-center"
        >
          <div className="stack-object relative w-[230px] h-[230px] sm:w-[290px] sm:h-[290px]">
            {PLANES.map((p, i) => (
              <div
                key={i}
                className="stack-plane absolute inset-0 rounded-lg"
                style={{
                  transform: `translateZ(${p.z}px)`,
                  opacity: p.opacity,
                  background: `linear-gradient(135deg, ${p.tone}, rgba(255,255,255,0.02))`,
                  border: `1px solid ${p.border}`,
                  boxShadow: `0 0 40px ${p.tone}`,
                  backgroundImage: `linear-gradient(135deg, ${p.tone}, rgba(255,255,255,0.02)),
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: "auto, 36px 36px, 36px 36px",
                }}
              >
                {/* corner nodes */}
                {[
                  "top-2.5 left-2.5",
                  "top-2.5 right-2.5",
                  "bottom-2.5 left-2.5",
                  "bottom-2.5 right-2.5",
                ].map((pos) => (
                  <span
                    key={pos}
                    className={`absolute ${pos} w-1.5 h-1.5 rounded-full`}
                    style={{ background: p.border }}
                  />
                ))}
              </div>
            ))}
            {/* central axis beam */}
            <div
              className="absolute left-1/2 top-1/2 w-px"
              style={{
                height: "150px",
                background:
                  "linear-gradient(to top, rgba(37,99,246,0.7), rgba(60,231,252,0.9))",
                transform: "translate(-50%, -50%) rotateX(-90deg) translateZ(0px) translateY(-75px)",
                transformStyle: "preserve-3d",
              }}
            />
          </div>

          {/* Floor glow */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-10 bg-[#2563F6]/25 rounded-[100%] blur-2xl pointer-events-none" />
        </motion.div>

        {/* ── Copy ─────────────────────────────────────────────── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="eyebrow-mono flex items-center gap-3 text-[11px] font-semibold uppercase text-slate-500 mb-6">
              <span className="h-px w-8 bg-gradient-to-r from-[#3CE7FC]/60 to-transparent" />
              02 / How it runs
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight mb-5">
              One system.
              <br />
              Every layer engineered.
            </h2>
            <p className="text-lg text-slate-400 max-w-md">
              We don't ship disconnected deliverables. Everything we build runs
              as one coherent system — from the pixel to the model to the
              server.
            </p>
          </motion.div>

          <div className="space-y-0 border-t border-white/[0.08]">
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.n}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group grid grid-cols-[3rem_1fr] gap-4 py-6 border-b border-white/[0.08] transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <span className="eyebrow-mono text-xs text-[#3CE7FC]/70 pt-1">
                  {layer.n}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1.5 group-hover:text-[#3CE7FC] transition-colors duration-300">
                    {layer.name}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                    {layer.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
