import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useT } from "../../lib/useT";
import { useIsMobile } from "../../lib/useIsMobile";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * "KI bei der Arbeit" - der Film auf der Startseite.
 *
 * Kein Video, sondern eine choreografierte Sequenz im Seitencode: scharf in
 * jeder Groesse, in allen drei Sprachen, und ohne Megabytes. Vier Kapitel
 * zu je vier Sekunden - Eingang, Lesen, Pruefen, Handeln -, darueber ein
 * Zeitcode und ein Live-Punkt, darunter Kapitel zum Anklicken mit
 * Fortschritt und eine Pause-Taste. Jede Szene wird beim Kapitelwechsel neu
 * eingehaengt, damit ihre CSS-Animationen (src/styles/motion.css) von vorn
 * laufen. Alle Namen und Zahlen sind erfunden und der Rahmen sagt das.
 *
 * Eine Uhr in Zehntelsekunden treibt alles. Sie laeuft nur, solange der Film
 * sichtbar ist: auf dem Desktop in Schleife, auf dem Telefon einmal
 * (Performance-Regel 3), danach bleibt das letzte Kapitel stehen. Unter
 * reduzierter Bewegung und im Prerender steht das letzte Kapitel fertig da.
 *
 * Sobald es echte Bildschirmaufnahmen gibt, kann der Rahmen sie spielen.
 */

const SCENE = 40; // Zehntelsekunden je Kapitel
const LENGTH = SCENE * 4;
const LAST = LENGTH - 10;

export default function AiFilm() {
  const t = useT();
  const f = t.home.film;
  const reduce = useReduceMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [tick, setTick] = useState(LAST);
  const [userPaused, setUserPaused] = useState(false);
  const [done, setDone] = useState(false);

  // Unter der Falz: der Sprung an den Anfang ist nie zu sehen.
  useEffect(() => {
    if (!reduce) setTick(0);
  }, [reduce]);

  const running = !reduce && inView && !userPaused && !(isMobile && done);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTick((prev) => {
        const next = prev + 1;
        if (next >= LENGTH) {
          if (isMobile) {
            setDone(true);
            return LAST;
          }
          return 0;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [running, isMobile]);

  const scene = Math.min(3, Math.floor(tick / SCENE));
  const secs = Math.floor(tick / 10);
  const frames = Math.floor((tick % 10) * 2.4);
  const pad = (n: number) => String(n).padStart(2, "0");
  const timecode = `00:00:${pad(secs)}:${pad(frames)}`;
  const playing = running;

  const toggle = () => {
    if (reduce) return;
    if (isMobile && done) {
      setDone(false);
      setTick(0);
      setUserPaused(false);
      return;
    }
    setUserPaused((p) => !p);
  };

  return (
    <section id="film" style={{ paddingBlock: "var(--section-pad)", scrollMarginTop: 40 }}>
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <div className="flex flex-wrap items-end justify-between gap-x-20 gap-y-8 mb-14 lg:mb-16">
          <div className="min-w-0" style={{ flex: "1 1 520px" }}>
            <div
              className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="h-px w-10 bg-[var(--line-strong)]" />
              {f.eyebrow}
            </div>
            <h2
              className="text-[var(--text-hi)] font-medium mt-9"
              style={{ fontSize: "clamp(2.5rem, 1.3rem + 3.8vw, 5.25rem)", lineHeight: 0.98, letterSpacing: "-0.04em", maxWidth: "15ch" }}
            >
              {f.title}
            </h2>
          </div>
          <p className="text-[var(--text-mid)] m-0" style={{ flex: "1 1 340px", maxWidth: "42ch", fontSize: "var(--t-body)", lineHeight: 1.6 }}>
            {f.lead}
          </p>
        </div>

        {/* Der Rahmen */}
        <div
          ref={ref}
          className="border border-[var(--line-strong)] overflow-hidden md:shadow-[0_40px_120px_-40px_rgba(37,99,246,0.35)]"
          style={{ background: "#08090C", borderRadius: "var(--radius-2)", color: "#C9CED6" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="eyebrow-mono uppercase" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", color: "#8B929B" }}>
              {f.frame}
            </span>
            <span className="flex items-center gap-5" aria-hidden="true">
              <span className="eyebrow-mono tabular-nums" style={{ fontSize: "var(--t-label)", letterSpacing: "0.08em", color: "#8B929B" }}>
                {timecode}
              </span>
              <span className="inline-flex items-center gap-2 eyebrow-mono uppercase" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", color: "#F2F4F6" }}>
                <span className={`w-2 h-2 rounded-full bg-[#FF4D4D] ${playing ? "m-rec" : ""}`} />
                {f.live}
              </span>
            </span>
          </div>

          <div
            className="relative"
            aria-hidden="true"
            style={{
              minHeight: isMobile ? 560 : 520,
              aspectRatio: isMobile ? undefined : "16 / 8",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          >
            <div key={scene} className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
              {scene === 0 && <Intake f={f} />}
              {scene === 1 && <Read f={f} />}
              {scene === 2 && <Reason f={f} />}
              {scene === 3 && <Act f={f} />}
            </div>
          </div>

          {/* Steuerung */}
          <div className="flex items-stretch" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? f.pause : f.play}
              className="shrink-0 w-14 sm:w-16 flex items-center justify-center cursor-pointer"
              style={{ background: "transparent", border: 0, borderRight: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F6" }}
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              )}
            </button>
            <div className="flex-1 grid grid-cols-4">
              {f.chapters.map((name, i) => {
                const fill = i < scene ? 100 : i === scene ? ((tick % SCENE) / SCENE) * 100 : 0;
                const on = i === scene;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setTick(i * SCENE);
                      setDone(false);
                    }}
                    aria-current={on ? "step" : undefined}
                    className="relative text-left px-3 sm:px-5 pt-4 pb-4 cursor-pointer min-w-0"
                    style={{ background: "transparent", border: 0, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : 0 }}
                  >
                    <span
                      className="absolute left-0 top-0 h-[2px] bg-[var(--signal)]"
                      style={{ width: `${fill}%`, transition: "width 120ms linear" }}
                    />
                    <span className="block eyebrow-mono" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", color: on ? "#F2F4F6" : "#8B929B" }}>
                      0{i + 1}
                    </span>{" "}
                    {/* Hidden on a phone, but still the button's name there:
                        the visible "01" plus the chapter (WCAG 2.5.3). */}
                    <span className="sr-only sm:not-sr-only sm:block mt-1 font-medium truncate" style={{ fontSize: "var(--t-small)", color: on ? "#F2F4F6" : "#8B929B" }}>
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Film = ReturnType<typeof useT>["home"]["film"];

const head = "eyebrow-mono uppercase mb-5";
const headStyle = { fontSize: "var(--t-label)", letterSpacing: "0.16em", color: "#3CE7FC" } as const;
const panel = { background: "#0F131A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2 } as const;

function Intake({ f }: { f: Film }) {
  const tones = ["#E0A33C", "#5B9BFF", "#5B9BFF"];
  return (
    <div className="w-full" style={{ maxWidth: 760 }}>
      <div className={`${head} m-in`} style={headStyle}>{f.intake.head}</div>
      {f.intake.mails.map((m, i) => (
        <div
          key={m.subject}
          className="m-in flex flex-wrap items-center justify-between gap-3 px-5 py-4 mt-2.5"
          style={{ ...panel, animationDelay: `${0.25 + i * 0.3}s` }}
        >
          <div className="min-w-0">
            <div className="font-medium" style={{ color: "#F2F4F6" }}>{m.subject}</div>
            <div style={{ fontSize: 14, color: "#8B929B" }}>{m.from}</div>
          </div>
          <span
            className="m-pop eyebrow-mono uppercase px-2.5 py-1.5"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.12em", border: `1px solid ${tones[i]}`, color: tones[i], borderRadius: 2, animationDelay: `${1.2 + i * 0.3}s` }}
          >
            {m.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function Read({ f }: { f: Film }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 w-full">
      <div
        className="m-in relative overflow-hidden shrink-0"
        style={{ width: 280, height: 340, background: "#F4F5F7", borderRadius: 2, padding: 24, boxSizing: "border-box", color: "#33383F", fontSize: 12 }}
      >
        <div style={{ fontWeight: 700, fontSize: 13 }}>{f.read.docTitle}</div>
        <div style={{ color: "#7A8088" }}>{f.read.docSub}</div>
        {[80, 64, 72].map((w) => (
          <div key={w} style={{ marginTop: 8, height: 6, width: `${w}%`, background: "#DADDE2" }} />
        ))}
        <div style={{ marginTop: 22 }}>
          {f.read.rows.map((r, i) => (
            <div key={r.doc} className="relative flex justify-between gap-3" style={{ height: 24, alignItems: "center", fontWeight: i === 0 ? 700 : 400 }}>
              <span>{r.doc}</span>
              <span>{r.value}</span>
              {/* Der Rahmen um das erkannte Feld sitzt in der Zeile selbst. */}
              <span className="m-box" style={{ inset: "1px -8px", animationDelay: `${1.1 + i * 0.5}s` }} />
            </div>
          ))}
        </div>
        {[90, 50].map((w) => (
          <div key={w} style={{ marginTop: 10, height: 6, width: `${w}%`, background: "#DADDE2" }} />
        ))}
        <div className="m-beam" />
      </div>
      <div className="flex flex-col gap-2.5" style={{ minWidth: 240 }}>
        <div className={`${head} m-in mb-2`} style={headStyle}>{f.read.head}</div>
        {f.read.rows.map((r, i) => (
          <div
            key={r.key}
            className="m-in flex justify-between gap-6 px-4 py-3"
            style={{ ...panel, animationDelay: `${1.2 + i * 0.5}s` }}
          >
            <span className="eyebrow-mono uppercase" style={{ fontSize: "var(--t-label)", letterSpacing: "0.12em", color: "#8B929B" }}>{r.key}</span>
            <span style={{ color: "#F2F4F6" }}>
              {r.value}
              <span className="eyebrow-mono" style={{ fontSize: "var(--t-label)", color: "#55D096", marginLeft: 8 }}>{r.conf}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Reason({ f }: { f: Film }) {
  const last = f.reason.lines.length - 1;
  return (
    <div className="w-full" style={{ maxWidth: 780, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 15, lineHeight: 2.05 }}>
      <div className={`${head} m-in`} style={headStyle}>{f.reason.head}</div>
      {f.reason.lines.map((line, i) => (
        <div key={line} style={{ color: i === last ? "#E0A33C" : "#C9CED6", whiteSpace: "pre-wrap" }}>
          <span style={{ color: i === last ? "#E0A33C" : "#5B9BFF" }}>› </span>
          <span className="m-type" style={{ animationDelay: `${0.3 + i * 0.85}s` }}>{line}</span>
          {i === last && <span className="m-caret ml-1" />}
        </div>
      ))}
    </div>
  );
}

function Act({ f }: { f: Film }) {
  return (
    <div className="w-full" style={{ maxWidth: 720 }}>
      <div className={`${head} m-in`} style={headStyle}>{f.act.head}</div>
      <div className="m-in flex flex-wrap items-center justify-between gap-4 px-6 py-5" style={{ ...panel, animationDelay: "0.2s" }}>
        <div>
          <div className="eyebrow-mono uppercase" style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em", color: "#8B929B" }}>{f.act.requested}</div>
          <div className="font-medium mt-1" style={{ color: "#F2F4F6" }}>{f.act.task}</div>
        </div>
        <span
          className="m-pop inline-flex items-center px-4 font-medium"
          style={{ height: 44, background: "#2563F6", color: "#FFFFFF", fontSize: 14, borderRadius: 2, animationDelay: "1s" }}
        >
          {f.act.approved}
        </span>
      </div>
      {f.act.done.map((line, i) => (
        <div
          key={line}
          className="m-in flex items-center gap-3.5 px-5 py-4 mt-2.5"
          style={{
            border: `1px solid ${i < 2 ? "rgba(85,208,150,0.35)" : "rgba(255,255,255,0.12)"}`,
            color: i < 2 ? "#F2F4F6" : "#A9B0B9",
            animationDelay: `${1.6 + i * 0.5}s`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={i < 2 ? "#55D096" : "#8B929B"} strokeWidth="2" aria-hidden="true">
            {i < 2 ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M4 6h16M4 12h16M4 18h10" />}
          </svg>
          {line}
        </div>
      ))}
    </div>
  );
}
