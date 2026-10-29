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
      className={`grid place-items-center w-10 h-10 rounded-full border border-white/25 bg-[rgba(6,10,26,0.55)] text-white hover:bg-[rgba(6,10,26,0.8)] transition-colors duration-[var(--dur-1)] ${className}`}
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
