import { motion, useReducedMotion } from "motion/react";
import logo from "../../assets/logo.png";
import { useIsMobile } from "../../lib/useIsMobile";

/**
 * Die Illustration im Hero: konzentrische Ringe um die Wortmarke.
 * Reines CSS und SVG, ausser dem Logo wird nichts geladen.
 *
 * Drei Dinge weichen von der ersten Fassung ab, weil sich das Umfeld
 * geaendert hat:
 *
 *   Sie blendet sich nicht mehr ein. Sie steht ueber dem Seitenumbruch, und
 *   das vorgerenderte HTML wird inzwischen angezeigt statt verworfen; mit
 *   Deckkraft 0 im Markup waere sie ohne JavaScript unsichtbar.
 *
 *   Die Ringe drehen sich auf dem Telefon nicht. Fuenf endlose Animationen
 *   sind dort genau die Last, die der Rest der Seite bewusst vermeidet.
 *
 *   Farben statt Verlaeufe. Die Designtoken entfernen Verlaufsflaechen
 *   global; die Punkte waeren damit ohne Fuellung geblieben, also
 *   unsichtbar.
 */

const RINGS = [
  { size: 100, dur: 46, dots: [0], opacity: 0.32 },
  { size: 76,  dur: 34, dots: [140, 300], opacity: 0.45 },
  { size: 54,  dur: 24, dots: [220], opacity: 0.6 },
];

export default function HeroMark() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const still = reduce || isMobile;

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto" aria-hidden="true">
      {/* Ambient bloom */}

      {/* Grounding glass disc behind the mark */}
      <div className="absolute inset-[36%] rounded-full bg-[var(--surface-2)] border border-[var(--line)] pointer-events-none" />

      {/* Orbit rings */}
      {RINGS.map((ring) => (
        <motion.div
          key={ring.size}
          className="absolute inset-0 flex items-center justify-center"
          animate={still ? undefined : { rotate: 360 }}
          transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="relative rounded-full border border-[var(--line-strong)]"
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
                className="absolute w-1.5 h-1.5 rounded-full bg-[var(--signal)]"
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

      {/* Sweeping arc, a single bright accent on the outer ring */}
      <motion.div
        className="absolute inset-0"
        animate={still ? undefined : { rotate: -360 }}
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
        animate={still ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={logo}
          alt=""
          width={256}
          height={256}
          className="w-[34%] h-auto object-contain"
        />
      </motion.div>
    </div>
  );
}
