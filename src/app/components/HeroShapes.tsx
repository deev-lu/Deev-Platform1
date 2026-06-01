import { motion, useReducedMotion } from "motion/react";
import LuxShade from "./LuxShade";

/**
 * Subtle decorative background shades for the Hero:
 *  - a faint AI-workflow / flow diagram on the left
 *  - the silhouette of Luxembourg on the right
 * Both are very low-opacity "shades" — quiet, not busy. pointer-events-none.
 */
export default function HeroShapes() {
  const reduce = useReducedMotion();
  // Animate scale only — animating opacity here would override the low base opacity set via class.
  const breathe = reduce
    ? {}
    : { scale: [1, 1.04, 1], transition: { duration: 14, repeat: Infinity, ease: "easeInOut" } };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* ── AI workflow shade (left) ─────────────────────────────── */}
      <motion.svg
        viewBox="0 0 220 180"
        className="absolute -left-10 top-[14%] w-[300px] sm:w-[420px] lg:w-[520px] opacity-[0.055]"
        fill="none"
        animate={breathe}
      >
        <defs>
          <linearGradient id="wf-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00C6FF" />
            <stop offset="100%" stopColor="#0022FF" />
          </linearGradient>
        </defs>
        {/* Connectors */}
        <g stroke="url(#wf-grad)" strokeWidth="1.5">
          <path d="M58 40 H92" />
          <path d="M58 90 H92" />
          <path d="M58 140 H92" />
          <path d="M118 40 C140 40 140 90 160 90" />
          <path d="M118 90 H160" />
          <path d="M118 140 C140 140 140 90 160 90" />
        </g>
        {/* Input nodes */}
        {[40, 90, 140].map((y) => (
          <rect key={y} x="22" y={y - 13} width="36" height="26" rx="7" stroke="url(#wf-grad)" strokeWidth="1.5" />
        ))}
        {/* Middle (processing) nodes */}
        {[40, 90, 140].map((y) => (
          <rect key={`m${y}`} x="92" y={y - 13} width="26" height="26" rx="13" stroke="url(#wf-grad)" strokeWidth="1.5" />
        ))}
        {/* Output node */}
        <rect x="160" y="72" width="40" height="36" rx="9" stroke="url(#wf-grad)" strokeWidth="1.5" />
        {/* Junction dots */}
        {[40, 90, 140].map((y) => (
          <circle key={`d${y}`} cx="105" cy={y} r="3" fill="url(#wf-grad)" />
        ))}
        <circle cx="180" cy="90" r="4" fill="url(#wf-grad)" />
      </motion.svg>

      {/* ── Luxembourg silhouette shade (right) — accurate outline ─ */}
      <motion.div
        animate={breathe}
        className="absolute right-[-8%] sm:right-[-2%] lg:right-[3%] top-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] lg:w-[480px] aspect-square"
      >
        <LuxShade className="w-full h-full opacity-[0.07]" />
      </motion.div>
    </div>
  );
}
