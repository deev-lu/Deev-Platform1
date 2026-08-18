import { useIsMobile } from "../../lib/useIsMobile";

/**
 * Cinematic background video layer for the hero.
 * Desktop only — on phones we keep the static poster so the mobile
 * paint/scroll work isn't undone by a 3.6MB autoplaying video.
 */
export default function HeroVideo() {
  const isMobile = useIsMobile();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {isMobile ? (
        <img
          src="/video/hero-poster.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/video/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Grade: keep the footage as texture, never competing with the copy */}
      <div className="absolute inset-0 bg-slate-50/92 dark:bg-[#06060a]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/85 to-slate-50/60 dark:from-[#06060a] dark:via-[#06060a]/85 dark:to-[#06060a]/55" />
      <div className="absolute inset-0 bg-[#2563F6]/[0.05] mix-blend-overlay" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-50 dark:from-[#06060a] to-transparent" />
    </div>
  );
}
