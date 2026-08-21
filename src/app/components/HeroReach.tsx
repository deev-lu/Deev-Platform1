import { useMemo } from "react";
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
 *   - Below 768px the layer is not rendered at all: a narrow slice of it shows
 *     two stray diagonals rather than a departure point, and the phone keeps
 *     the paint budget.
 */

/** Origin, in viewBox units: inside the Luxembourg silhouette, under the
 *  brand mark, which is where the arcs should look like they leave from. */
const O = { x: 1105, y: 470 };

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
function arc(d: (typeof DESTINATIONS)[number]) {
  const mx = (O.x + d.x) / 2;
  const my = (O.y + d.y) / 2;
  const dx = d.x - O.x;
  const dy = d.y - O.y;
  return `M ${O.x} ${O.y} Q ${mx - dy * d.bow} ${my + dx * d.bow} ${d.x} ${d.y}`;
}

export default function HeroReach() {
  const still = useReducedMotion() || useIsMobile();
  const paths = useMemo(() => DESTINATIONS.map((d) => ({ ...d, path: arc(d) })), []);

  return (
    <svg
      className="hidden md:block absolute inset-0 w-full h-full pointer-events-none text-[var(--signal)]"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {paths.map((p) => (
        <g key={`${p.x}-${p.y}`}>
          <path
            d={p.path}
            stroke="currentColor"
            strokeWidth={1}
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
          <circle cx={p.x} cy={p.y} r={2.5} fill="currentColor" className="opacity-25 dark:opacity-30" />
        </g>
      ))}

      {/* Luxembourg: where it all leaves from. The mark sits on top of this
          point, so it stays a dot rather than a ring. */}
      <circle cx={O.x} cy={O.y} r={3.5} fill="currentColor" className="opacity-40" />
    </svg>
  );
}
