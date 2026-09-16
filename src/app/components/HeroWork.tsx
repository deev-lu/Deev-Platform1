import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import L from "./L";
import { useLocale, useT } from "../../lib/useT";
import { PROJECTS, sectorOf, type Project } from "../../lib/projects";
import { useIsMobile } from "../../lib/useIsMobile";

/**
 * Die Arbeitsprobe im Hero: echte Projekte, die einander ablösen.
 *
 * Die Reihenfolge ist hier fest verdrahtet, und zwar absichtlich. Alles
 * andere auf der Seite zieht sich aus dem Portfolio; welche drei Projekte
 * aber ganz oben stehen, ist eine Vertriebsentscheidung und keine
 * Eigenschaft der Daten.
 *
 * Fehlt ein Eintrag oder sein Screenshot, fällt er still heraus, statt eine
 * leere Fläche zu hinterlassen. `fachinstitut-tierheilkunde` steht deshalb
 * schon in der Liste, obwohl es das Projekt im Repository noch nicht gibt:
 * sobald Eintrag und `fachinstitut-tierheilkunde.jpg` vorliegen, erscheint es
 * hier von selbst, ohne dass an dieser Datei etwas zu ändern wäre.
 */
const FEATURED = ["fachinstitut-tierheilkunde", "bureau-immobilier-feltes", "supa-saya-gin"];

const INTERVAL = 5200;

export default function HeroWork() {
  const locale = useLocale();
  const t = useT();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);
  // Nach einem Klick hört die Rotation auf. Wer selbst gewählt hat, will nicht
  // drei Sekunden später woanders hingeschoben werden.
  const [held, setHeld] = useState(false);
  const shown = useRef<Set<string>>(new Set());

  const picks: Project[] = FEATURED.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter(
    (p): p is Project => Boolean(p?.image),
  );

  const stop = reduce || held || picks.length < 2;

  useEffect(() => {
    if (stop) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % picks.length), INTERVAL);
    return () => clearInterval(id);
  }, [stop, picks.length]);

  if (picks.length === 0) return null;

  const active = picks[Math.min(index, picks.length - 1)];
  // Einmal gezeigt heißt geladen: nur das erste Bild ist beim Aufbau wichtig,
  // die anderen holt der Browser, sobald sie das erste Mal an der Reihe sind.
  shown.current.add(active.slug);

  return (
    <div className="lg:col-span-6">
      <div
        className="relative border border-[var(--line)] bg-[var(--surface-1)] overflow-hidden"
        style={{ borderRadius: "var(--radius-1)" }}
      >
        {/* Browserleiste als ruhiger Rahmen: sie sagt „Website", ohne den
            Screenshot zu verzerren oder in ein Gerät zu stecken. */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-[var(--line)]">
          <span className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
            ))}
          </span>
          <span
            className="eyebrow-mono text-[var(--text-low)] lowercase truncate"
            style={{ fontSize: "var(--t-label)" }}
          >
            {active.link?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </span>
        </div>

        {/* Alle Aufnahmen liegen übereinander und werden ein- und
            ausgeblendet. Ein Wechsel des src-Attributs hätte bei jedem
            Durchlauf ein weißes Aufblitzen erzeugt, solange das nächste Bild
            noch lädt. */}
        <div className="relative" style={{ aspectRatio: "1200 / 680" }}>
          {picks.map((p, i) => {
            const isActive = p.slug === active.slug;
            return (
              <L
                key={p.slug}
                to={`/work/${p.slug}`}
                className="absolute inset-0 group"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: reduce ? undefined : "opacity 600ms var(--ease-out)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
                aria-hidden={!isActive}
                tabIndex={isActive ? undefined : -1}
              >
                <img
                  src={p.image}
                  alt={`${p.title}, ${sectorOf(p, locale)}`}
                  width={1200}
                  height={680}
                  // Nur die erste Aufnahme ist für den Seitenaufbau wichtig.
                  loading={i === 0 ? "eager" : "lazy"}
                  {...(i === 0 ? PRIORITY_HINT : {})}
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </L>
            );
          })}
        </div>

        {/* Zeigt, dass gewechselt wird und wann. Ohne das springt das Bild
            unerklaert um; mit dem Balken ist es eine Ansage. Steht die
            Rotation - nach einem Klick oder bei reduzierter Bewegung -, ist
            auch der Balken weg, statt eine Bewegung zu versprechen, die nicht
            kommt. */}
        {!stop && (
          <div className="h-[2px] w-full bg-[var(--line)]" aria-hidden="true">
            <div
              key={`${active.slug}-${index}`}
              className="h-full bg-[var(--signal)]"
              style={{ animation: `hw-progress ${INTERVAL}ms linear forwards` }}
            />
          </div>
        )}
      </div>

      {/* Auswahl und Beschriftung. Echte Schaltflächen, nicht nur Punkte:
          man muss lesen können, wohin man wechselt, und mit der Tastatur
          dorthin gelangen. */}
      {picks.length > 1 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mt-4">
          {picks.map((p, i) => {
            const isActive = i === index;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setHeld(true);
                }}
                onMouseEnter={() => !isMobile && setIndex(i)}
                aria-current={isActive}
                className={`px-3.5 h-9 border transition-colors duration-[var(--dur-1)] ${
                  isActive
                    ? "border-[var(--signal)] text-[var(--text-hi)] bg-[var(--surface-2)]"
                    : "border-[var(--line)] text-[var(--text-mid)] bg-[var(--surface-1)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)]"
                }`}
                style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mt-3">
        <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)" }}>
          {sectorOf(active, locale)}
          {active.year ? ` · ${active.year}` : ""}
        </p>
        {/* Zwei Projekte im Hero, siebzehn im Portfolio. Ohne diesen Weg endet
            der Beleg hier, und der Besucher muss die Navigation suchen. */}
        <L
          to="/work"
          className="text-[var(--signal-text)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
          style={{ fontSize: "var(--t-small)" }}
        >
          {t.home.selected.all}
        </L>
      </div>
    </div>
  );
}

/**
 * React 18 kennt `fetchPriority` nicht und verwirft das Attribut beim
 * Server-Rendern - ausgerechnet im vorgerenderten HTML, wo der
 * Preload-Scanner es liest. Kleingeschrieben durchgereicht steht es im
 * Dokument. Mit React 19 kann daraus wieder ein normales Prop werden.
 */
const PRIORITY_HINT = { fetchpriority: "high" } as Record<string, string>;
