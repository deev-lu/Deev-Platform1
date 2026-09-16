import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useIsMobile } from "../../lib/useIsMobile";

/**
 * Ein Abschnitt, der beim Hereinscrollen ankommt.
 *
 * Es gab diese Bewegung an vielen Stellen, aber jedes Mal neu geschrieben:
 * mal 0,5s, mal 0,64s, mal 20px, mal 12px, mal mit Verzögerung, mal ohne. Das
 * summiert sich zu einem unruhigen Eindruck, weil kein Abschnitt so ankommt
 * wie der davor. Hier steht es einmal.
 *
 * Bewusst zurückhaltend: 14px und 0,55s. Was weiter fliegt oder länger
 * braucht, wirkt beim zweiten Besuch zäh, und Premium heißt hier ruhig, nicht
 * viel.
 *
 * Drei Fälle bewegen sich nicht:
 *
 *   `prefers-reduced-motion` — Betriebssystemeinstellung, nicht verhandelbar.
 *
 *   Telefone. Dieselbe Regel, die auch die Endlosanimationen abschaltet: auf
 *   dem Telefon kostet jede animierte Fläche Scrollflüssigkeit, und flüssiges
 *   Scrollen ist dort das eigentliche Qualitätsmerkmal.
 *
 *   Alles über dem Seitenumbruch. Das gehört nicht hierher: es steht im
 *   vorgerenderten HTML und wird angezeigt, statt auf JavaScript zu warten.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  id,
}: {
  children: ReactNode;
  /** Sekunden. Für Geschwister, die nacheinander ankommen sollen. */
  delay?: number;
  as?: "div" | "section" | "li";
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const M = motion[Tag];

  if (reduce || isMobile) {
    return (
      <Tag className={className} id={id}>
        {children}
      </Tag>
    );
  }

  return (
    <M
      id={id}
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      // `once`, weil ein Abschnitt, der bei jedem Hoch- und Runterscrollen
      // erneut hereinfliegt, von Ruhe in Zappeln umschlägt.
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}
