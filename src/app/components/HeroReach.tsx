import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useIsMobile } from "../../lib/useIsMobile";

/**
 * Hero background: the work leaving Luxembourg.
 *
 * Six hairline arcs spring from a single origin — the point where the
 * Luxembourg silhouette and the brand mark sit — and run out past the edges of
 * the frame, each with a light travelling along it. It is the studio's own
 * claim drawn rather than written: built here, shipped outward.
 *
 * Kept honest about cost:
 *   - Pure SVG hairlines. No canvas, no globe mesh, no image.
 *   - The travelling light is a dash moving along a normalised path
 *     (pathLength={1}), so nothing has to be measured at runtime and no
 *     layout or transform work happens per frame.
 *   - prefers-reduced-motion gets the arcs standing still, per the brief.
 *   - Below 768px the layer gets its own portrait geometry rather than a
 *     narrow slice of the desktop one, which showed two stray diagonals and no
 *     departure point. The travelling lights stay off there: a looping
 *     animation is what the mobile performance rules exclude, not the drawing.
 */

/** Fallback origin in viewBox units, used until the mark has been measured:
 *  inside the Luxembourg silhouette, under the brand mark. */
const O_FALLBACK = { x: 1105, y: 470 };

const VB = { w: 1440, h: 900 };

/** Portrait twin of VB. A phone hero is roughly 390x1290, so these units are
 *  near-square once the viewBox is stretched over it and the arcs keep their
 *  curvature instead of being squashed into vertical squiggles. */
const VB_M = { w: 100, h: 330 };

/** On a phone the mark sits below the copy rather than beside it, so the
 *  destinations fan outward and down from it and only two reach up past the
 *  headline, hugging the edges of the frame. Nothing travels along them: a
 *  looping animation is exactly what the mobile performance rules exclude, so
 *  the phone gets the drawing and not the light. */
const DESTINATIONS_M = [
  { x: -6, y: 196, bow: 0.16 },
  { x: 106, y: 190, bow: -0.16 },
  { x: -6, y: 306, bow: -0.14 },
  { x: 106, y: 300, bow: 0.14 },
  { x: 22, y: 342, bow: 0.16 },
  { x: 78, y: 342, bow: -0.16 },
  { x: -4, y: 54, bow: 0.22 },
  { x: 104, y: 48, bow: -0.22 },
];

/** Where the work goes: off every edge of the frame. The left-bound pair is
 *  bowed hard over the top and under the bottom so that no arc, and no light
 *  travelling along one, ever crosses the headline or the body copy. */
const DESTINATIONS = [
  { x: 80, y: 90, bow: 0.20, dur: 7.0, delay: 0.0 },
  { x: 60, y: 860, bow: -0.20, dur: 8.2, delay: 1.4 },
  { x: 470, y: 60, bow: 0.12, dur: 6.2, delay: 2.6 },
  { x: 520, y: 870, bow: -0.14, dur: 7.6, delay: 0.8 },
  { x: 1430, y: 150, bow: 0.22, dur: 5.6, delay: 3.4 },
  { x: 1410, y: 780, bow: -0.20, dur: 6.6, delay: 2.0 },
];

/** Quadratic arc from the origin, bowed perpendicular to the straight line. */
function arc(O: { x: number; y: number }, d: { x: number; y: number; bow: number }) {
  const mx = (O.x + d.x) / 2;
  const my = (O.y + d.y) / 2;
  const dx = d.x - O.x;
  const dy = d.y - O.y;
  return `M ${O.x} ${O.y} Q ${mx - dy * d.bow} ${my + dx * d.bow} ${d.x} ${d.y}`;
}

export default function HeroReach() {
  const isMobile = useIsMobile();
  const still = useReducedMotion() || isMobile;
  const ref = useRef<SVGSVGElement>(null);
  const [frac, setFrac] = useState({ x: O_FALLBACK.x / VB.w, y: O_FALLBACK.y / VB.h });

  /* The arcs have to leave from the mark, not from a coordinate that happens
     to sit under it at one window width. Measure where the mark actually is
     and convert that to viewBox units; with preserveAspectRatio="none" the
     two spaces map linearly, so the origin stays pinned at every width. */
  useEffect(() => {
    const section = ref.current?.closest("section");
    const anchor = section?.querySelector("[data-hero-anchor]");
    if (!section || !anchor) return;

    const measure = () => {
      const s = section.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      if (!s.width || !s.height) return;
      setFrac({
        x: (a.left + a.width / 2 - s.left) / s.width,
        y: (a.top + a.height / 2 - s.top) / s.height,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(anchor);
    return () => ro.disconnect();
  }, []);

  const box = isMobile ? VB_M : VB;
  const origin = { x: frac.x * box.w, y: frac.y * box.h };
  const paths = useMemo(
    () =>
      (isMobile ? DESTINATIONS_M : DESTINATIONS).map((d) => ({
        ...d,
        dur: "dur" in d ? d.dur : 0,
        delay: "delay" in d ? d.delay : 0,
        path: arc(origin, d),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [origin.x, origin.y, isMobile],
  );

  return (
    <svg
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none text-[var(--signal)]"
      viewBox={`0 0 ${box.w} ${box.h}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {paths.map((p) => (
        <g key={`${p.x}-${p.y}`}>
          <path
            d={p.path}
            stroke="currentColor"
            strokeWidth={isMobile ? 0.3 : 1}
            className="opacity-[0.14] dark:opacity-[0.18]"
          />
          {!still && (
            <motion.path
              d={p.path}
              pathLength={1}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              className="opacity-70"
              style={{ strokeDasharray: "0.08 1" }}
              animate={{ strokeDashoffset: [0.08, -1] }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
          {/* Where it lands. */}
          <circle
            cx={p.x}
            cy={p.y}
            r={isMobile ? 0.9 : 2.5}
            fill="currentColor"
            className="opacity-25 dark:opacity-30"
          />
        </g>
      ))}

      {/* Luxembourg: where it all leaves from. The mark sits on top of this
          point, so it stays a dot rather than a ring. */}
      <circle
        cx={origin.x}
        cy={origin.y}
        r={isMobile ? 1.2 : 3.5}
        fill="currentColor"
        className="opacity-40"
      />
    </svg>
  );
}
