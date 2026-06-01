import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

interface CountUpProps {
  /** The full display value, e.g. "50+", "100%", "LU 🇱🇺", "Senior" */
  value: string;
  /** Animation duration in ms */
  duration?: number;
  className?: string;
}

/**
 * Animates the leading number of a value upward when it scrolls into view.
 * If the value has no leading number (e.g. "LU 🇱🇺", "Senior") it renders as-is.
 * Preserves any prefix/suffix around the number (e.g. "+", "%", "k").
 */
export default function CountUp({ value, duration = 1600, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState<string>(value);

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
    if (!inView) {
      setDisplay(`${prefix}0${suffix}`);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo for a punchy settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = (target * eased).toFixed(decimals);
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
