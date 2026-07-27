import { motion, useReducedMotion } from "motion/react";
import logo from "../../assets/logo.png";

/**
 * Clean, abstract brand visual for the hero.
 * Concentric orbit rings around the DEEV mark — calm, geometric, no chrome.
 * Pure CSS/SVG: no images beyond the logo, nothing to load or cycle.
 */

const RINGS = [
  { size: 100, dur: 46, dots: [0], opacity: 0.32 },
  { size: 76,  dur: 34, dots: [140, 300], opacity: 0.45 },
  { size: 54,  dur: 24, dots: [220], opacity: 0.6 },
];

export default function HeroMark() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-square max-w-[520px] mx-auto"
      aria-hidden="true"
    >
      {/* Ambient bloom */}
      <div className="absolute inset-[16%] rounded-full bg-[#2563F6]/30 blur-[80px] pointer-events-none" />

      {/* Grounding glass disc behind the mark */}
      <div className="absolute inset-[36%] rounded-full bg-gradient-to-br from-white/[0.10] to-white/[0.02] dark:from-white/[0.08] dark:to-white/[0.01] border border-slate-300/50 dark:border-white/[0.10] backdrop-blur-sm pointer-events-none" />

      {/* Orbit rings */}
      {RINGS.map((ring) => (
        <motion.div
          key={ring.size}
          className="absolute inset-0 flex items-center justify-center"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="relative rounded-full border border-slate-300/70 dark:border-white/20"
            style={{
              width: `${ring.size}%`,
              height: `${ring.size}%`,
              opacity: ring.opacity,
            }}
          >
            {/* Nodes riding the ring */}
            {ring.dots.map((deg) => (
              <span
                key={deg}
                className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#3CE7FC] to-[#2563F6]"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${deg}deg) translateX(${ring.size / 2}%) translate(-50%, -50%)`,
                  transformOrigin: "0 0",
                  marginLeft: `${-0.75}px`,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Sweeping arc — a single bright accent on the outer ring */}
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="hm-arc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3CE7FC" stopOpacity="0" />
              <stop offset="100%" stopColor="#3CE7FC" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke="url(#hm-arc)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="70 395"
          />
        </svg>
      </motion.div>

      {/* Brand mark, centred and still */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={logo}
          alt=""
          className="w-[34%] h-auto object-contain drop-shadow-[0_12px_48px_rgba(37,99,246,0.55)]"
        />
      </motion.div>
    </motion.div>
  );
}
