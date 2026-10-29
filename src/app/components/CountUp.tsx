import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

interface CountUpProps {
  /** The full display value, e.g. "50+", "100%", "In-house" */
  value: string;
  /** Animation duration in ms */
  duration?: number;
  className?: string;
}

/**
 * Animates the leading number of a value upward when it scrolls into view.
 * If the value has no leading number (e.g. "In-house") it renders as-is.
 * Preserves any prefix/suffix around the number (e.g. "+", "%", "k").
 */
export default function CountUp({ value, duration = 1600, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Grow the root by 120px on all sides so elements sitting at the viewport
  // edge (e.g. hero stats) still trigger their count-up on load.
  const inView = useInView(ref, { once: true, margin: "120px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState<string>(value); // final value from first paint

  // Parse "  prefix  NUMBER  suffix " → keep surrounding text intact
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2]) : null;
  const prefix = match ? match[1] : "";
  const suffix = match ? match[3] : "";
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;

  useEffect(() => {
    // Non-numeric or reduced motion → show final value immediately
    if (target === null || reduce) {
      setDisplay(value);
      return;
    }
    // Never render zero. The final value is what ships in the markup and what
    // a visitor sees if the animation never runs; the count is a short settle
    // from close to the target, not a climb from nothing. A stat block reading
    // "0+ PROJECTS DELIVERED" costs more credibility than the animation buys.
    if (!inView) {
      setDisplay(value);
      return;
    }

    const FROM = 0.88; // start within sight of the target

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo for a punchy settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const from = target * FROM;
      const current = (from + (target - from) * eased).toFixed(decimals);
      setDisplay(`${prefix}${current}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, value, prefix, suffix, decimals, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
