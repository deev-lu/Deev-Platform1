import { motion, useReducedMotion } from "motion/react";

/**
 * Animated AI "neural network" layer for the Hero background.
 * Pulsing nodes + flowing data lines + travelling packets.
 * Purely decorative — pointer-events-none, respects reduced-motion.
 */

// Node positions on a 0–100 viewBox grid (kept sparse + organic)
const nodes = [
  { x: 8,  y: 22 }, { x: 22, y: 12 }, { x: 18, y: 48 }, { x: 33, y: 33 },
  { x: 30, y: 70 }, { x: 48, y: 18 }, { x: 46, y: 55 }, { x: 60, y: 38 },
  { x: 64, y: 74 }, { x: 78, y: 26 }, { x: 80, y: 58 }, { x: 92, y: 44 },
];

// Edges between node indices
const edges: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], [4, 6],
  [5, 7], [6, 7], [6, 8], [7, 9], [7, 10], [8, 10], [9, 11], [10, 11], [9, 10],
];

export default function NeuralBackground() {
  const reduce = useReducedMotion();

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="neural-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3CE7FC" />
          <stop offset="100%" stopColor="#2563F6" />
        </linearGradient>
        <radialGradient id="neural-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3CE7FC" />
          <stop offset="100%" stopColor="#2563F6" />
        </radialGradient>
      </defs>

      {/* Connection lines */}
      <g stroke="url(#neural-line)" strokeWidth="0.18" opacity="0.22">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      {/* Travelling data packets along a subset of edges */}
      {!reduce &&
        edges.slice(0, 9).map(([a, b], i) => (
          <motion.circle
            key={`p-${i}`}
            r="0.55"
            fill="#3CE7FC"
            initial={{ cx: nodes[a].x, cy: nodes[a].y, opacity: 0 }}
            animate={{
              cx: [nodes[a].x, nodes[b].x],
              cy: [nodes[a].y, nodes[b].y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.6 + (i % 4) * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 6) * 0.5,
            }}
          />
        ))}

      {/* Pulsing nodes */}
      {nodes.map((n, i) => (
        <motion.circle
          key={`n-${i}`}
          cx={n.x}
          cy={n.y}
          r="0.7"
          fill="url(#neural-node)"
          initial={{ opacity: 0.35, scale: 1 }}
          animate={
            reduce
              ? { opacity: 0.4 }
              : { opacity: [0.3, 0.9, 0.3], scale: [1, 1.5, 1] }
          }
          transition={{
            duration: 3 + (i % 5) * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 7) * 0.4,
          }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}
    </svg>
  );
}
