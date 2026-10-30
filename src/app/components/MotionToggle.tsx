import { Pause, Play } from "lucide-react";
import { useT } from "../../lib/useT";
import { setMotionPaused, useMotionPaused } from "../../lib/motionPref";

/**
 * The "Pause motion" switch (WCAG 2.2.2). Two looks: a small round button
 * for the hero, next to the film it stops, and a text button for the footer.
 * Both flip the same site-wide setting (lib/motionPref.ts), which Klar
 * Access's "Bewegung reduzieren" shares. The name says what a press does
 * ("Pause motion" / "Play motion"), so there is no aria-pressed on top: a
 * changing name and a pressed state together read as a contradiction.
 */
export default function MotionToggle({ variant = "icon", className = "" }: { variant?: "icon" | "text"; className?: string }) {
  const t = useT();
  const paused = useMotionPaused();
  const label = paused ? t.site.a11y.playMotion : t.site.a11y.pauseMotion;
  const Icon = paused ? Play : Pause;

  if (variant === "text") {
    return (
      <button type="button" onClick={() => setMotionPaused(!paused)} className={`inline-flex items-center gap-2 cursor-pointer text-left ${className}`} style={{ font: "inherit" }}>
        <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        {label}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-label={label}
      title={label}
      className={`glass-pill grid place-items-center w-11 h-11 rounded-full text-[var(--text-hi)] hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)] ${className}`}
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
