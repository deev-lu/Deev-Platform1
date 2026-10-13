import strata from "../../assets/visuals/strata.svg?raw";
import retrieval from "../../assets/visuals/retrieval.svg?raw";
import proportion from "../../assets/visuals/proportion.svg?raw";
import flow from "../../assets/visuals/flow.svg?raw";

/**
 * Die Tafeln aus "Signal Lumen": vier Zeichnungen nach Regeln - Schichten
 * (Software), Abruf (KI und Daten), Proportion (Design), Fluss (Phasen).
 * Erzeugt mit einem Skript, jede mit genau einem Lichtpunkt.
 *
 * Eingebettet statt als <img>, damit die Mono-Beschriftungen in der Schrift
 * der Seite stehen; ein SVG im <img> sieht keine Webfonts. Die Tafeln sind
 * fuer dunklen Grund gezeichnet - das Panel um sie herum ist in beiden Themen
 * dunkel.
 */
const PLATES = { strata, retrieval, proportion, flow } as const;
export type PlateName = keyof typeof PLATES;

export default function Plate({ name, className = "" }: { name: PlateName; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`[&>svg]:block [&>svg]:w-full [&>svg]:h-full ${className}`}
      dangerouslySetInnerHTML={{ __html: PLATES[name] }}
    />
  );
}

/** Splits a headline after its first sentence: the claim in full white, the
 *  rest a step quieter. "Large programmes. Delivered in phases." In the dark
 *  theme the claim flows from near-white into light blue (`.m-flow-dark`). */
export function TwoTone({ text }: { text: string }) {
  const m = text.match(/^(.+?[.!?])\s+(.+)$/);
  if (!m) return <>{text}</>;
  return (
    <>
      <span className="m-flow-dark">{m[1]}</span> <span className="text-[var(--text-mid)]">{m[2]}</span>
    </>
  );
}
