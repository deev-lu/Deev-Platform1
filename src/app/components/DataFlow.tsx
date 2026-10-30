import { useRef, useState, useEffect, type ReactNode, type CSSProperties } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionValueEvent, useInView, type MotionValue } from "motion/react";
import { Eyebrow } from "./Section";
import { useT } from "../../lib/useT";
import type { Dict } from "../../locales";
import { useIsMobile } from "../../lib/useIsMobile";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * Von Daten zu Entscheidungen - die Pipeline auf der KI-Seite.
 *
 * Dieselben 28 Punkte wandern durch alle vier Schritte: verstreut in vier
 * Quellen, sortiert in eine Tabelle (vier davon sind Dubletten und gehen in
 * ihrem Zwilling auf), aufgereiht als Zeitreihe mit Trend und einem
 * Ausreisser, und schliesslich durch ein KI-Modul in drei Ausgaenge. Es sind
 * absichtlich immer dieselben Punkte: die Aussage ist, dass es die eigenen
 * Daten sind, die nuetzlich werden, nicht neue.
 *
 * Wie SystemStack:
 *   - Desktop: gepinnt, und die Punkte haengen direkt am Scrollfortschritt.
 *     Kein Umschalten an Schwellen: jeder Punkt gleitet stufenlos von einem
 *     Zustand in den naechsten, jeder Schritt hat eine Haltezone, in der er
 *     steht und gelesen werden kann. Der Fortschritt laeuft durch eine
 *     weiche Feder, damit auch ein Ruck an der Scrollleiste gleitet.
 *   - Telefon: kein Pin. Jeder Schritt bekommt seine eigene kleine Buehne,
 *     die beim Hereinscrollen einmal vom vorigen Zustand in ihren wechselt.
 *     Keine Daueranimation (Performance-Regel 3).
 *   - Reduzierte Bewegung: gestapelt, jede Buehne steht still im Endzustand.
 *
 * Die Positionen kommen aus einem festen Seed, damit Prerender und Browser
 * dieselben Koordinaten schreiben.
 */

const W = 520;
const H = 420;
const N = 28;
/** Punkte ab diesem Index sind Dubletten und verschwinden ab Schritt 2. */
const UNIQUE = 24;
/** Wohin die Dubletten aufgehen: die Tabellenzelle ihres Zwillings. */
const TWIN = [3, 9, 14, 20];
const OUTLIER = 15;

type Pt = { x: number; y: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const TILES = [
  { x: 24, y: 36, label: "ERP" },
  { x: 296, y: 36, label: "XLSX" },
  { x: 24, y: 244, label: "MAIL" },
  { x: 296, y: 244, label: "PDF" },
];
const TILE_W = 200;
const TILE_H = 140;

// Tabelle
const T_X = 110;
const T_Y = 120;
const T_W = 300;
const T_HEAD = 30;
const T_ROW = 37.5;
const cell = (k: number): Pt => ({
  x: T_X + 25 + (k % 6) * 50,
  y: T_Y + T_HEAD + T_ROW / 2 + Math.floor(k / 6) * T_ROW,
});

// Diagramm
const C_X0 = 56;
const C_X1 = 440;
const C_BASE = 300;
const C_SLOPE = 7.5;
const trendAt = (k: number) => C_BASE - k * C_SLOPE;
const chartX = (k: number) => C_X0 + k * ((C_X1 - C_X0) / (UNIQUE - 1));

// Automatisierung
const NODE = { x: 230, y: 210, s: 76 };
const CARD_X = 326;
const CARD_W = 184;
const CARD_H = 52;
const LANES = [100, 210, 320];

const LAYOUT = (() => {
  const r = seeded(7);
  const scatter: Pt[] = [];
  const shade: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = TILES[i % 4];
    scatter.push({ x: t.x + 22 + r() * (TILE_W - 44), y: t.y + 40 + r() * (TILE_H - 58) });
    shade.push(0.45 + r() * 0.45);
  }

  const table: Pt[] = [];
  for (let i = 0; i < N; i++) table.push(cell(i < UNIQUE ? i : TWIN[i - UNIQUE]));

  const chart: Pt[] = [];
  for (let i = 0; i < N; i++) {
    if (i >= UNIQUE) {
      chart.push(table[i]);
      continue;
    }
    const noise = (r() - 0.5) * 34;
    chart.push({ x: chartX(i), y: i === OUTLIER ? trendAt(i) + 92 : trendAt(i) + noise });
  }

  const flow: Pt[] = [];
  for (let i = 0; i < N; i++) {
    if (i >= UNIQUE) {
      flow.push(table[i]);
    } else if (i < 12) {
      const x = 34 + i * 13;
      flow.push({ x, y: NODE.y + Math.sin(i * 0.9) * 6 });
    } else {
      const lane = (i - 12) % 3;
      const j = Math.floor((i - 12) / 3);
      const x0 = NODE.x + NODE.s / 2;
      const x = x0 + 12 + j * 13;
      flow.push({ x, y: NODE.y + (LANES[lane] - NODE.y) * ((x - x0) / (CARD_X - x0)) });
    }
  }

  return { stages: [scatter, table, chart, flow], shade };
})();

/** Als Klasse, nicht als style: motion schreibt einen String-Wert in `style`
 *  eines SVG-Elements nur beim ersten Rendern und aendert ihn danach nicht. */
function dotFill(i: number, step: number): string {
  if (step === 0) return "fill-[var(--metal)]";
  if (step === 2 && i === OUTLIER) return "fill-[var(--warn)]";
  if (step === 3 && i >= 12 && i < UNIQUE && (i - 12) % 3 === 2) return "fill-[var(--warn)]";
  return "fill-[var(--signal)]";
}

function dotOpacity(i: number, step: number): number {
  if (i >= UNIQUE && step >= 1) return 0;
  if (step === 0) return LAYOUT.shade[i];
  if (step === 3 && i < 12) return 0.55;
  return 1;
}

/** Weiches Ein- und Ausschwingen fuer die Morphs. */
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Fortschritt → Zustand: halten, gleiten, halten ... Die Uebergaenge liegen
 *  um 0.25, 0.5 und 0.75, die Haltezonen dazwischen. */
const HOLD = [0, 0.19, 0.31, 0.44, 0.56, 0.69, 0.81, 1];
const STAGE_AT = [0, 0, 1, 1, 2, 2, 3, 3];
const stepAt = (p: number) => (p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3);

/** Ein Punkt, der am Scrollfortschritt haengt. Ein leichter Versatz je Punkt
 *  laesst die Menge fliessen statt im Gleichschritt zu springen. */
function ScrubDot({ i, progress, step, r }: { i: number; progress: MotionValue<number>; step: number; r: number }) {
  const off = (i % 7) * 0.007;
  const input = HOLD.map((v, k) => (k === 0 || k === HOLD.length - 1 ? v : v + off));
  const at = (f: (k: number) => number) => STAGE_AT.map(f);
  const s = LAYOUT.stages;
  const cx = useTransform(progress, input, at((k) => s[k][i].x), { ease: inOut });
  const cy = useTransform(progress, input, at((k) => s[k][i].y), { ease: inOut });
  // Dubletten wandern erst auf ihren Zwilling und verschwinden dann darin.
  const opacity = useTransform(
    progress,
    i >= UNIQUE ? [0, 0.19 + off, 0.29 + off, 0.34 + off, 1] : input,
    i >= UNIQUE ? [LAYOUT.shade[i], LAYOUT.shade[i], 1, 0, 0] : at((k) => dotOpacity(i, k)),
  );
  return (
    <motion.circle
      r={r}
      cx={cx}
      cy={cy}
      style={{ opacity }}
      className={`${dotFill(i, step)} transition-[fill] duration-[600ms]`}
    />
  );
}

/** Eine Ebene der Buehne: am Scroll eingeblendet oder per CSS-Uebergang. */
function Layer({ fade, css, children }: { fade?: MotionValue<number>; css: CSSProperties; children: ReactNode }) {
  return fade ? <motion.g style={{ opacity: fade }}>{children}</motion.g> : <g style={css}>{children}</g>;
}

type Labels = Dict["home"]["dataFlow"]["labels"];

/** Eine Buehne. `step` ist der Zustand, `flowing` die Daueranimation der
 *  Verbindungen im letzten Schritt (nur Desktop, nur sichtbar). */
function Stage({
  step,
  labels,
  instant,
  flowing,
  compact,
  progress,
}: {
  step: number;
  labels: Labels;
  instant: boolean;
  flowing: boolean;
  compact: boolean;
  /** Gesetzt: alles haengt stufenlos am Scroll. Fehlt: Schritt fuer Schritt. */
  progress?: MotionValue<number>;
}) {
  const fallback = useMotionValue(0);
  const p = progress ?? fallback;
  const fades = [
    useTransform(p, [0, 0.19, 0.25], [1, 1, 0]),
    useTransform(p, [0.25, 0.31, 0.44, 0.5], [0, 1, 1, 0]),
    useTransform(p, [0.5, 0.56, 0.69, 0.75], [0, 1, 1, 0]),
    useTransform(p, [0.75, 0.81, 1], [0, 1, 1]),
  ];
  const draw = useTransform(p, [0.52, 0.68], [0, 1]);

  const fs = compact ? 14 : 10.5;
  const show = (k: number) => ({
    opacity: step === k ? 1 : 0,
    transition: instant ? "none" : `opacity 480ms var(--ease-out) ${step === k ? "260ms" : "0ms"}`,
  });
  const ease = [0.65, 0, 0.35, 1] as const;
  const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: "0.12em" };
  const merged = N - UNIQUE;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-hidden="true">
      {/* 01 Quellen */}
      <Layer fade={progress ? fades[0] : undefined} css={show(0)}>
        {TILES.map((t) => (
          <g key={t.label}>
            <rect x={t.x} y={t.y} width={TILE_W} height={TILE_H} fill="none" stroke="var(--line-strong)" strokeWidth={1} />
            <text x={t.x + 12} y={t.y + 20} fontSize={fs} fill="var(--text-low)" style={mono}>
              {t.label}
            </text>
          </g>
        ))}
      </Layer>

      {/* 02 Tabelle */}
      <Layer fade={progress ? fades[1] : undefined} css={show(1)}>
        <rect x={T_X} y={T_Y} width={T_W} height={T_HEAD + T_ROW * 4} fill="var(--surface-0)" stroke="var(--line-strong)" />
        <line x1={T_X} x2={T_X + T_W} y1={T_Y + T_HEAD} y2={T_Y + T_HEAD} stroke="var(--line-strong)" />
        {[1, 2, 3, 4, 5].map((c) => (
          <line key={c} x1={T_X + c * 50} x2={T_X + c * 50} y1={T_Y} y2={T_Y + T_HEAD + T_ROW * 4} stroke="var(--line)" />
        ))}
        {[1, 2, 3].map((rw) => (
          <line key={rw} x1={T_X} x2={T_X + T_W} y1={T_Y + T_HEAD + rw * T_ROW} y2={T_Y + T_HEAD + rw * T_ROW} stroke="var(--line)" />
        ))}
        {[0, 1, 2, 3, 4, 5].map((c) => (
          <rect key={c} x={T_X + c * 50 + 12} y={T_Y + 12} width={26} height={5} fill="var(--line-strong)" />
        ))}
        <text x={T_X} y={T_Y + T_HEAD + T_ROW * 4 + 30} fontSize={fs} fill="var(--signal-text)" style={mono}>
          −{merged} {labels.duplicates.toUpperCase()}
        </text>
      </Layer>

      {/* 03 Diagramm */}
      <Layer fade={progress ? fades[2] : undefined} css={show(2)}>
        <line x1={40} x2={500} y1={350} y2={350} stroke="var(--line-strong)" />
        <line x1={40} x2={40} y1={60} y2={350} stroke="var(--line-strong)" />
        {[130, 200, 270].map((y) => (
          <line key={y} x1={40} x2={500} y1={y} y2={y} stroke="var(--line-faint)" />
        ))}
        {progress ? (
          <motion.path
            d={`M ${C_X0} ${trendAt(0)} L ${C_X1} ${trendAt(UNIQUE - 1)}`}
            stroke="var(--signal)"
            strokeWidth={1.5}
            fill="none"
            style={{ pathLength: draw }}
          />
        ) : (
          <motion.path
            d={`M ${C_X0} ${trendAt(0)} L ${C_X1} ${trendAt(UNIQUE - 1)}`}
            stroke="var(--signal)"
            strokeWidth={1.5}
            fill="none"
            initial={false}
            animate={{ pathLength: step === 2 ? 1 : 0 }}
            transition={{ duration: instant ? 0 : 1.1, ease, delay: instant ? 0 : 0.35 }}
          />
        )}
        <path
          d={`M ${C_X1} ${trendAt(UNIQUE - 1)} L 500 ${trendAt(UNIQUE - 1) - (60 / ((C_X1 - C_X0) / (UNIQUE - 1))) * C_SLOPE}`}
          stroke="var(--signal)"
          strokeWidth={1.5}
          strokeDasharray="4 5"
          fill="none"
        />
        <text x={C_X1 - 8} y={trendAt(UNIQUE - 1) - 22} fontSize={fs} fill="var(--signal-text)" textAnchor="end" style={mono}>
          {labels.trend.toUpperCase()} · {labels.forecast.toUpperCase()} →
        </text>
        <circle
          cx={chartX(OUTLIER)}
          cy={trendAt(OUTLIER) + 92}
          r={11}
          fill="none"
          stroke="var(--warn)"
          strokeWidth={1}
        />
        <text x={chartX(OUTLIER) + 18} y={trendAt(OUTLIER) + 96} fontSize={fs} fill="var(--warn)" style={mono}>
          {labels.anomaly.toUpperCase()}
        </text>
      </Layer>

      {/* 04 Automatisierung */}
      <Layer fade={progress ? fades[3] : undefined} css={show(3)}>
        <line x1={24} x2={NODE.x - NODE.s / 2} y1={NODE.y} y2={NODE.y} stroke="var(--line-strong)" />
        {LANES.map((y, lane) => (
          <motion.line
            key={y}
            x1={NODE.x + NODE.s / 2}
            y1={NODE.y}
            x2={CARD_X}
            y2={y}
            stroke={lane === 2 ? "var(--warn)" : "var(--signal)"}
            strokeOpacity={0.6}
            strokeWidth={1}
            strokeDasharray="3 5"
            initial={false}
            animate={flowing ? { strokeDashoffset: [0, -16] } : { strokeDashoffset: 0 }}
            transition={flowing ? { duration: 0.9, ease: "linear", repeat: Infinity } : { duration: 0 }}
          />
        ))}
        <rect
          x={NODE.x - NODE.s / 2}
          y={NODE.y - NODE.s / 2}
          width={NODE.s}
          height={NODE.s}
          fill="var(--signal-dim)"
          stroke="var(--signal)"
        />
        <text x={NODE.x} y={NODE.y + fs * 0.62} fontSize={fs * 1.7} textAnchor="middle" fill="var(--signal-text)" style={{ ...mono, letterSpacing: "0.08em" }}>
          {labels.model}
        </text>
        {LANES.map((y, lane) => {
          const tone = lane === 2 ? "var(--warn)" : lane === 1 ? "var(--positive)" : "var(--text-hi)";
          const label = [labels.outReply, labels.outBook, labels.outReview][lane];
          return (
            <g key={y}>
              <rect x={CARD_X} y={y - CARD_H / 2} width={CARD_W} height={CARD_H} fill="var(--surface-0)" stroke="var(--line-strong)" />
              <rect x={CARD_X} y={y - CARD_H / 2} width={3} height={CARD_H} fill={tone} />
              <text x={CARD_X + 16} y={y + fs * 0.36} fontSize={fs} fill={tone} style={mono}>
                {label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </Layer>

      {/* Die Daten selbst */}
      {progress &&
        LAYOUT.stages[0].map((_, i) => <ScrubDot key={i} i={i} progress={progress} step={step} r={compact ? 6 : 4.5} />)}
      {!progress && LAYOUT.stages[0].map((_, i) => {
        const p = LAYOUT.stages[step][i];
        return (
          <motion.circle
            key={i}
            r={compact ? 6 : 4.5}
            initial={false}
            animate={{ cx: p.x, cy: p.y, opacity: dotOpacity(i, step) }}
            transition={{
              duration: instant ? 0 : 1.1,
              ease,
              delay: instant ? 0 : (i % 7) * 0.035,
              opacity: { duration: instant ? 0 : 0.4, delay: instant ? 0 : i >= UNIQUE && step >= 1 ? 0.75 : 0 },
            }}
            className={`${dotFill(i, step)} ${instant ? "" : "transition-[fill] duration-[400ms] delay-300"}`}
          />
        );
      })}
    </svg>
  );
}

export default function DataFlow() {
  const t = useT();
  const d = t.home.dataFlow;
  const reduce = useReduceMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageVisible = useInView(stageRef, { amount: 0.3 });
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 170, damping: 34, mass: 0.4, restDelta: 0.0005 });
  useMotionValueEvent(progress, "change", (p) => {
    const i = stepAt(p);
    setStep((prev) => (prev === i ? prev : i));
  });

  // Gepinnt muss alles in eine Bildschirmhoehe passen: Titel eine Stufe
  // kleiner, und auf niedrigen Bildschirmen faellt der Vorspann weg - die
  // vier Schritte sagen dasselbe.
  const heading = (pinned: boolean) => (
    <>
      <Eyebrow index="04">{d.eyebrow}</Eyebrow>
      <h2
        className="text-[var(--text-hi)] font-medium"
        style={{
          fontSize: pinned ? "clamp(2rem, 1rem + 2vw, 3.25rem)" : "var(--t-h2)",
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          maxWidth: pinned ? "22ch" : "20ch",
        }}
      >
        {d.title}
      </h2>
      <p
        className={`mt-6 text-[var(--text-mid)] ${pinned ? "[@media(max-height:820px)]:hidden" : ""}`}
        style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "48ch" }}
      >
        {d.lead}
      </p>
    </>
  );

  // Telefon und reduzierte Bewegung: gestapelt, eine Buehne pro Schritt.
  if (isMobile || reduce) {
    return (
      <section ref={ref} className="relative border-y border-[var(--line)]">
        <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}>
          {heading(false)}
          <ol className="mt-12">
            {d.steps.map((s, k) => (
              <StackedStep key={s.title} k={k} title={s.title} copy={s.copy} labels={d.labels} instant={!!reduce} />
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative border-y border-[var(--line)]" style={{ height: "340vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center pt-[68px]">
        <div
          className="relative w-full mx-auto grid grid-cols-12 gap-x-16 items-center"
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
        >
          <div className="col-span-5">
            {heading(true)}
            <ol className="mt-10 border-b border-[var(--line)]">
              {d.steps.map((s, k) => (
                <li key={s.title} className="relative border-t border-[var(--line)] py-4">
                  <RowProgress k={k} progress={progress} />
                  <div className="grid grid-cols-[auto_1fr] gap-x-6">
                    <span
                      className={`eyebrow-mono pt-[3px] transition-colors duration-[var(--dur-2)] ${k === step ? "text-[var(--signal-text)]" : "text-[var(--metal)]"}`}
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      {String(k + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3
                        className={`font-medium transition-colors duration-[var(--dur-2)] ${k === step ? "text-[var(--text-hi)]" : "text-[var(--text-low)]"}`}
                        style={{ fontSize: "var(--t-body)", letterSpacing: "-0.01em" }}
                      >
                        {s.title}
                      </h3>
                      <motion.div
                        initial={false}
                        animate={{ height: k === step ? "auto" : 0, opacity: k === step ? 1 : 0 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p
                          className="pt-2 text-[var(--text-mid)]"
                          style={{ fontSize: "var(--t-small)", lineHeight: 1.55, maxWidth: "46ch" }}
                        >
                          {s.copy}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="col-span-7" ref={stageRef}>
            <div className="border border-[var(--line)] bg-[var(--surface-1)]" style={{ borderRadius: "var(--radius-1)" }}>
              <div
                className="flex items-center justify-between px-5 py-3 eyebrow-mono uppercase text-[var(--text-low)]"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                <span>
                  <span className="text-[var(--signal-text)]">{String(step + 1).padStart(2, "0")}</span> / 04 · {d.steps[step].title}
                </span>
              </div>
              {/* Stufenloser Fortschritt statt vier Striche. */}
              <div className="h-px bg-[var(--line)]" aria-hidden="true">
                <motion.div className="h-px bg-[var(--signal)] origin-left" style={{ scaleX: progress }} />
              </div>
              <div className="p-6 xl:p-8">
                <Stage step={step} labels={d.labels} instant={false} flowing={stageVisible && step === 3} compact={false} progress={progress} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Die Linie ueber einem Schritt fuellt sich, waehrend man durch ihn scrollt:
 *  erledigte Schritte voll, der aktuelle zum Teil, kommende leer. */
function RowProgress({ k, progress }: { k: number; progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [k / 4, (k + 1) / 4], [0, 1], { clamp: true });
  return (
    <motion.span
      className="absolute left-0 top-0 h-px w-full origin-left bg-[var(--signal)]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

function StackedStep({
  k,
  title,
  copy,
  labels,
  instant,
}: {
  k: number;
  title: string;
  copy: string;
  labels: Labels;
  instant: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  // Vom vorigen Schritt in diesen, einmal, beim Hereinscrollen.
  const [step, setStep] = useState(instant ? k : Math.max(0, k - 1));
  useEffect(() => {
    if (seen) setStep(k);
  }, [seen, k]);

  return (
    <li ref={ref} className="border-t border-[var(--line)] pt-6 pb-10">
      <div className="grid grid-cols-[auto_1fr] gap-x-5">
        <span className="eyebrow-mono text-[var(--signal-text)] pt-[3px]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
          {String(k + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 className="text-[var(--text-hi)] font-medium mb-2" style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.01em" }}>
            {title}
          </h3>
          <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
            {copy}
          </p>
        </div>
      </div>
      <div className="mt-6 border border-[var(--line)] bg-[var(--surface-1)] p-3" style={{ borderRadius: "var(--radius-1)" }}>
        <Stage step={step} labels={labels} instant={instant} flowing={false} compact />
      </div>
    </li>
  );
}
