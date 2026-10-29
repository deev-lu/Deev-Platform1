import { motion, useReducedMotion } from "motion/react";
import type { PathKey } from "./ServicesIndex";

/**
 * Die Bühne neben dem Leistungsnavigator.
 *
 * Vier abstrakte Zeichnungen, eine je Leistungsweg, damit sich die Wege auch
 * ohne Lesen unterscheiden. Bewusst keine Fotografie und keine Symbole für
 * „verstehen" oder „bauen": das wäre Dekoration, die etwas behauptet.
 *
 * Reines SVG aus Hairlines und der Signalfarbe, also dieselbe Formensprache
 * wie der Rest der Seite. Nichts davon lädt etwas nach, nichts animiert
 * dauerhaft - gewechselt wird nur, wenn ein anderer Weg aktiv wird.
 */
export default function ServiceStage({ active }: { active: PathKey }) {
  const reduce = useReducedMotion();
  const line = "var(--line-strong)";
  const signal = "var(--signal)";

  const scenes: Record<PathKey, React.ReactNode> = {
    // Ein Auftritt: Rahmen, Raster, Textzeilen - das Gerüst einer Seite.
    websites: (
      <g fill="none" stroke={line} strokeWidth="1">
        <rect x="40" y="46" width="240" height="168" />
        <line x1="40" y1="74" x2="280" y2="74" />
        <circle cx="54" cy="60" r="3" /><circle cx="66" cy="60" r="3" /><circle cx="78" cy="60" r="3" />
        <rect x="58" y="92" width="96" height="50" stroke={signal} />
        <line x1="58" y1="160" x2="154" y2="160" />
        <line x1="58" y1="174" x2="126" y2="174" />
        <rect x="176" y="92" width="86" height="34" />
        <rect x="176" y="138" width="86" height="34" />
      </g>
    ),
    // Ein Ablauf: Knoten, die etwas weiterreichen.
    ai: (
      <g fill="none" stroke={line} strokeWidth="1">
        <rect x="42" y="112" width="58" height="36" />
        <rect x="131" y="66" width="58" height="36" />
        <rect x="131" y="158" width="58" height="36" />
        <rect x="220" y="112" width="58" height="36" stroke={signal} />
        <path d="M100 130 H116 V84 H131" />
        <path d="M100 130 H116 V176 H131" />
        <path d="M189 84 H205 V130 H220" />
        <path d="M189 176 H205 V130" />
        <circle cx="116" cy="130" r="2.5" fill={signal} stroke="none" />
        <circle cx="205" cy="130" r="2.5" fill={signal} stroke="none" />
      </g>
    ),
    // Ein System: Schichten und Felder, die zusammenhängen.
    software: (
      <g fill="none" stroke={line} strokeWidth="1">
        <rect x="40" y="46" width="92" height="168" />
        <line x1="40" y1="88" x2="132" y2="88" />
        <line x1="56" y1="112" x2="116" y2="112" />
        <line x1="56" y1="130" x2="116" y2="130" />
        <line x1="56" y1="148" x2="100" y2="148" />
        <rect x="148" y="46" width="132" height="74" stroke={signal} />
        <rect x="148" y="140" width="62" height="74" />
        <rect x="218" y="140" width="62" height="74" />
        <line x1="132" y1="83" x2="148" y2="83" />
      </g>
    ),
    // Ein Trichter: viele Signale, ein Weg, ein Ziel.
    marketing: (
      <g fill="none" stroke={line} strokeWidth="1">
        <line x1="44" y1="66" x2="128" y2="122" />
        <line x1="44" y1="130" x2="128" y2="130" />
        <line x1="44" y1="194" x2="128" y2="138" />
        <circle cx="44" cy="66" r="3" /><circle cx="44" cy="130" r="3" /><circle cx="44" cy="194" r="3" />
        <path d="M128 112 H206 L232 130 L206 148 H128 Z" stroke={signal} />
        <line x1="232" y1="130" x2="278" y2="130" />
        <rect x="254" y="118" width="24" height="24" stroke={signal} />
      </g>
    ),
  };

  return (
    <div
      className="relative w-full border border-[var(--line)] bg-[var(--surface-1)] overflow-hidden"
      style={{ borderRadius: "var(--radius-1)", aspectRatio: "4 / 3" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 320 260" className="absolute inset-0 w-full h-full">
        {/* Ein ruhiges Raster als Grund, damit die Fläche nicht leer wirkt. */}
        <defs>
          <pattern id="svc-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0 H0 V32" fill="none" stroke="var(--line-faint)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="320" height="260" fill="url(#svc-grid)" />
        <motion.g
          key={active}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {scenes[active]}
        </motion.g>
      </svg>
    </div>
  );
}
