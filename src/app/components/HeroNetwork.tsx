import type { CSSProperties } from "react";

/**
 * Hinter der freien Ecke des Hero-Titels (ab 1024px): ein kleines Netz aus
 * Knoten und Verbindungen, das sich beim Laden zeichnet; auf einigen
 * Verbindungen laufen Lichtpunkte - Systeme, die miteinander sprechen, das,
 * was wir bauen. Rein dekorativ (aria-hidden), reines CSS (design.css,
 * "the network"): die Pakete laufen ab 768px und stehen bei reduzierter
 * Bewegung, "Bewegung anhalten" und Klar Access still bzw. verschwinden.
 */

const NODES: [number, number][] = [
  [60, 120], [170, 60], [300, 96], [440, 50], [120, 250], [250, 210],
  [390, 200], [480, 300], [200, 350], [330, 330], [40, 380],
];
/** Pairs of node indices. */
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [2, 6], [3, 6], [4, 5],
  [5, 6], [6, 7], [4, 8], [5, 9], [8, 9], [9, 7], [4, 10], [8, 10], [6, 9],
];
/** Links that carry a packet: [link index, seconds per trip, delay]. */
const PACKETS: [number, number, number][] = [
  [1, 3.6, 0.4], [5, 4.2, 1.6], [9, 3.2, 2.4], [12, 4.6, 0.9], [14, 3.8, 3.1], [3, 5.2, 2], [10, 3.4, 4.2],
];
/** Nodes that send out a slow ring now and then. */
const HALOS: [number, number][] = [[2, 0.6], [6, 2.2], [4, 3.6]];

export default function HeroNetwork({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 520 420" className={`net ${className}`}>
      {LINKS.map(([a, b], i) => (
        <line
          key={i}
          className="net__link"
          pathLength={1}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          style={{ animationDelay: `${0.25 + i * 0.05}s` }}
        />
      ))}
      {HALOS.map(([n, delay]) => (
        <circle key={`h${n}`} className="net__halo" cx={NODES[n][0]} cy={NODES[n][1]} r={6} style={{ animationDelay: `${delay}s` }} />
      ))}
      {PACKETS.map(([l, dur, delay]) => {
        const [a, b] = LINKS[l];
        return (
          <circle
            key={`p${l}`}
            className="net__packet"
            r={2.4}
            style={
              {
                "--x1": `${NODES[a][0]}px`,
                "--y1": `${NODES[a][1]}px`,
                "--x2": `${NODES[b][0]}px`,
                "--y2": `${NODES[b][1]}px`,
                "--dur": `${dur}s`,
                animationDelay: `${1.6 + delay}s`,
              } as CSSProperties
            }
          />
        );
      })}
      {NODES.map(([x, y], i) => (
        <circle key={`n${i}`} className="net__node" cx={x} cy={y} r={i % 3 === 0 ? 3.5 : 2.5} style={{ animationDelay: `${0.15 + i * 0.06}s` }} />
      ))}
    </svg>
  );
}
