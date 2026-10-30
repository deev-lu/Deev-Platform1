import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useInView } from "motion/react";
import { useT } from "../../lib/useT";
import { clients } from "./ClientLogos";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * Die Kunden direkt unter dem Hero, seit dem 30.10.2026 als 3D-Karussell im
 * Stil von nvision.lu: die mittlere Karte gross und vorn, die Nachbarn
 * kleiner, nach hinten gedreht und blasser. Pfeile, Punkte und Wischen
 * blaettern; von selbst laeuft es alle 3 Sekunden weiter, solange es im
 * Bild ist.
 *
 * Nur echte Logos aus ClientLogos (dort ist geklaert, welche Datei welchen
 * Filter braucht). Ein neuer Kunde kommt mit seiner Logodatei dort hinein.
 *
 * Barrierefreiheit: ein Karussell nach dem APG-Muster (aria-roledescription,
 * Folien als benannte Gruppen), alle Logos bleiben fuer Screenreader in der
 * Liste. Eigene Pause-Taste (WCAG 2.2.2); haelt auch bei Hover und
 * Tastaturfokus an, bei "Bewegung anhalten", Klar Access und reduzierter
 * Bewegung laeuft es gar nicht von selbst. Wischen hat die Pfeile als
 * Alternative (2.5.7).
 */

type Client = (typeof clients)[number];
const tall = (c: Client) => c.h > c.w * 0.9;
const STEP_MS = 3000;

export default function HomeClients() {
  const t = useT();
  const a = t.site.a11y;
  const n = clients.length;
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const reduce = useReduceMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const auto = !reduce && !userPaused && !hold && inView;

  const go = useCallback((d: number) => setActive((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => go(1), STEP_MS);
    return () => window.clearInterval(id);
  }, [auto, go]);

  // Wischen: eine waagerechte Geste von mehr als 40px blaettert.
  const start = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    start.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  /** Shortest signed distance from the active card, so the ring wraps. */
  const offset = (i: number) => {
    let o = i - active;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
  };

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label={t.home.clients.label}
      data-autoplay={auto ? "true" : "false"}
      className="relative overflow-hidden"
      style={{ paddingBlock: "calc(var(--section-pad) * 0.75)" }}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false);
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <p
          className="eyebrow-mono uppercase text-[var(--text-low)] text-center m-0"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.18em" }}
        >
          {t.home.clients.label}
        </p>
      </div>

      <div
        className="relative mt-8 h-[150px] md:h-[190px] select-none touch-pan-y"
        style={{ perspective: "1200px" }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (start.current = null)}
      >
        <div aria-live={auto ? "off" : "polite"}>
          {clients.map((c, i) => {
            const o = offset(i);
            const d = Math.abs(o);
            const shown = d <= 3;
            return (
              <div
                key={c.name}
                role="group"
                aria-roledescription="slide"
                aria-label={a.slideOf(i + 1, n)}
                className="absolute left-1/2 top-1/2 grid place-items-center w-[190px] h-[112px] md:w-[260px] md:h-[150px] rounded-[var(--radius-2)] border border-[var(--line)] bg-[var(--surface-1)] transition-[transform,opacity,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: `translate(-50%, -50%) translateX(${o * 62}%) translateZ(${-d * 90}px) rotateY(${o * -18}deg) scale(${1 - Math.min(d, 3) * 0.08})`,
                  zIndex: 50 - d,
                  // Far cards fade out but stay in the list for screen readers.
                  opacity: shown ? 1 - d * 0.22 : 0,
                  borderColor: o === 0 ? "var(--line-strong)" : undefined,
                  boxShadow: o === 0 ? "0 30px 70px -36px rgba(37,99,246,0.75)" : undefined,
                }}
              >
                <img
                  src={c.src}
                  alt={c.name}
                  width={c.w}
                  height={c.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className={`${tall(c) ? "h-14 md:h-[72px]" : "h-9 md:h-12"} w-auto max-w-[70%] object-contain ${c.filter}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button type="button" onClick={() => go(-1)} aria-label={a.prevLogo} className="card-arrow hover:bg-[var(--surface-2)]">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
        <div className="hidden sm:flex items-center gap-0.5">
          {clients.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={a.showLogo(c.name)}
              aria-current={i === active ? "true" : undefined}
              className="group grid place-items-center w-6 h-6"
            >
              <span
                aria-hidden="true"
                className={`block h-[3px] rounded-full transition-all duration-300 ${i === active ? "w-5 bg-[linear-gradient(90deg,#2563f6,#3ce7fc)]" : "w-2 bg-[var(--line-control)] group-hover:bg-[var(--text-low)]"}`}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label={a.nextLogo} className="card-arrow hover:bg-[var(--surface-2)]">
          <ArrowRight className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
        {!reduce && (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? a.playLogos : a.pauseLogos}
            title={userPaused ? a.playLogos : a.pauseLogos}
            className="card-arrow ml-2 hover:bg-[var(--surface-2)]"
          >
            {userPaused ? <Play className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" /> : <Pause className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />}
          </button>
        )}
      </div>
    </section>
  );
}
