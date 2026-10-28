import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { FileText, Lock } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import { useT } from "../../lib/useT";
import { useIsMobile } from "../../lib/useIsMobile";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * Individuelle RAG - die Demo auf der KI-Seite.
 *
 * Eine Frage wird gestellt, die Wissensbasis durchsucht, drei Stellen
 * gefunden (eine Quelle ist gesperrt und bleibt es: so sieht "Zugriffsrechte
 * bleiben bestehen" aus), und die Antwort entsteht Wort fuer Wort mit
 * Quellenangaben. Frage, Quellen und Antwort sind erfunden und als Beispiel
 * gekennzeichnet; die Relevanzwerte zeigen den Mechanismus, sie messen nichts.
 *
 * Eine einzige Zeitleiste treibt alles, abgeleitet aus der verstrichenen
 * Zeit, und der Zustand aendert sich nur, wenn sich etwas Sichtbares aendert.
 * Ein- und Ausblenden laeuft ueber CSS-Uebergaenge, daher gleitet es auch
 * zwischen zwei Zustaenden. Text steht von Anfang an in voller Laenge da und
 * wird nur sichtbar: nichts verschiebt sich, waehrend die Antwort entsteht.
 *
 * Desktop: Schleife, solange sichtbar. Telefon: einmal. Reduzierte Bewegung
 * und Prerender: Endzustand.
 */

const T_TYPE = 500;
const T_SEARCH = 2300;
const T_RANK = 3900;
const T_ANSWER = 5000;
const T_DONE = 7800;
const T_END = 11200;

/** Welche Quellen die Suche findet, in Rangfolge, und welche gesperrt ist. */
const HITS = [0, 1, 2];
const SCORES = [0.91, 0.86, 0.82];
const LOCKED = 3;

type Phase = "idle" | "type" | "search" | "rank" | "answer" | "done";
type Snap = { phase: Phase; chars: number; sweep: number; words: number };

const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function RagDemo() {
  const t = useT();
  const r = t.home.rag;
  const d = r.demo;
  const reduce = useReduceMotion();
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { amount: 0.35 });
  const played = useRef(false);

  // Die Antwort in Woerter zerlegt, jedes mit seinem Leerraum, damit die
  // Satzzeichen am Anfang eines Abschnitts richtig anschliessen.
  const segments = d.answer.map((seg) => ({ cite: "cite" in seg ? seg.cite : undefined, tokens: seg.text.match(/\S+\s*/g) ?? [] }));
  const total = segments.reduce((n, s) => n + s.tokens.length, 0);

  const FINAL: Snap = { phase: "done", chars: d.question.length, sweep: -1, words: total };
  const [snap, setSnap] = useState<Snap>(FINAL);

  // Unter der Falz: der Wechsel auf leer ist nie zu sehen.
  useEffect(() => {
    if (!reduce) setSnap({ phase: "idle", chars: 0, sweep: -1, words: 0 });
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      setSnap(FINAL);
      return;
    }
    if (!inView || (isMobile && played.current)) return;

    const n = d.sources.length;
    const at = (ms: number): Snap => {
      if (ms < T_TYPE) return { phase: "idle", chars: 0, sweep: -1, words: 0 };
      if (ms < T_SEARCH)
        return { phase: "type", chars: Math.ceil(((ms - T_TYPE) / (T_SEARCH - T_TYPE - 250)) * d.question.length), sweep: -1, words: 0 };
      if (ms < T_RANK)
        return { phase: "search", chars: d.question.length, sweep: Math.min(n - 1, Math.floor(((ms - T_SEARCH) / (T_RANK - T_SEARCH)) * n)), words: 0 };
      if (ms < T_ANSWER) return { phase: "rank", chars: d.question.length, sweep: -1, words: 0 };
      if (ms < T_DONE)
        return { phase: "answer", chars: d.question.length, sweep: -1, words: Math.ceil(((ms - T_ANSWER) / (T_DONE - T_ANSWER)) * total) };
      return FINAL;
    };

    let start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      let ms = now - start;
      if (ms >= T_END) {
        if (isMobile) {
          played.current = true;
          setSnap(FINAL);
          return;
        }
        start = now;
        ms = 0;
      }
      const next = at(ms);
      next.chars = Math.min(next.chars, d.question.length);
      next.words = Math.min(next.words, total);
      setSnap((prev) =>
        prev.phase === next.phase && prev.chars === next.chars && prev.sweep === next.sweep && prev.words === next.words ? prev : next,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // FINAL, total und die Quellen haengen nur an der Sprache, die sich hier nicht aendert.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, isMobile]);

  const ranked = snap.phase === "rank" || snap.phase === "answer" || snap.phase === "done";
  const answering = snap.phase === "answer" || snap.phase === "done";
  const status =
    snap.phase === "done"
      ? d.status.done
      : snap.phase === "answer"
        ? d.status.answering
        : snap.phase === "rank"
          ? d.status.found
          : snap.phase === "search"
            ? d.status.searching
            : d.status.typing;
  const statusTone = snap.phase === "done" ? "var(--positive)" : "var(--signal-text)";

  let seen = 0;

  return (
    <Section index="02" eyebrow={r.eyebrow} tone={0}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 items-start">
        <div className="lg:col-span-5">
          <SectionTitle>{r.title}</SectionTitle>
          <p className="mt-6 text-[var(--text-mid)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "48ch" }}>
            {r.lead}
          </p>
          <div
            className="mt-10 eyebrow-mono uppercase text-[var(--text-low)] pb-4 border-b border-[var(--line)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {r.pointsLabel}
          </div>
          <ul>
            {r.points.map((p) => (
              <li key={p.title} className="grid grid-cols-[auto_1fr] gap-x-4 py-5 border-b border-[var(--line)]">
                <span className="mt-[11px] w-4 h-px bg-[var(--signal)]" aria-hidden="true" />
                <div>
                  <h3 className="text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-body)", letterSpacing: "-0.01em" }}>
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
                    {p.copy}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 lg:sticky lg:top-28" ref={panelRef}>
          <div className="border border-[var(--line-strong)] bg-[var(--surface-1)]" style={{ borderRadius: "var(--radius-1)" }} aria-hidden="true">
            <div
              className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[var(--line)] eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span>{d.label}</span>
              <span>RAG</span>
            </div>

            {/* Die Frage */}
            <div className="px-5 sm:px-7 py-5 border-b border-[var(--line)] bg-[var(--surface-0)]">
              <div className="eyebrow-mono uppercase text-[var(--text-low)] mb-2" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                {d.askLabel}
              </div>
              <p className="text-[var(--text-hi)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.45 }}>
                <span>{d.question.slice(0, snap.chars)}</span>
                <span
                  className="inline-block w-px h-[1.1em] align-[-0.15em] bg-[var(--signal)]"
                  style={{ opacity: snap.phase === "type" || snap.phase === "idle" ? 1 : 0, transition: "opacity 300ms" }}
                />
                <span className="opacity-0">{d.question.slice(snap.chars)}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              {/* Die Wissensbasis */}
              <div className="px-5 sm:px-6 py-5 border-b md:border-b-0 md:border-r border-[var(--line)]">
                <div className="eyebrow-mono uppercase text-[var(--text-low)] mb-3" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  {d.indexLabel}
                </div>
                <ul>
                  {d.sources.map((name, i) => {
                    const rank = HITS.indexOf(i);
                    const hit = rank >= 0 && ranked;
                    const locked = i === LOCKED;
                    const scanning = snap.sweep === i;
                    const dim = ranked && !hit && !locked;
                    return (
                      <li
                        key={name}
                        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2.5 py-2 px-2 -mx-2"
                        style={{
                          background: scanning ? "var(--signal-dim)" : hit ? "color-mix(in srgb, var(--signal) 6%, transparent)" : "transparent",
                          transition: `background 260ms ${ease}`,
                          borderRadius: "var(--radius-1)",
                        }}
                      >
                        {/* Symbol und Quellennummer teilen sich einen Platz und
                            blenden ineinander, damit der Name nicht springt. */}
                        <span className="relative w-6 h-4 flex items-center">
                          {locked ? (
                            <Lock className="w-3.5 h-3.5 text-[var(--text-low)]" strokeWidth={1.5} />
                          ) : (
                            <>
                              <FileText
                                className="w-3.5 h-3.5 text-[var(--text-low)]"
                                strokeWidth={1.5}
                                style={{ opacity: hit ? 0 : 1, transition: `opacity 400ms ${ease} ${Math.max(rank, 0) * 120}ms` }}
                              />
                              <span
                                className="absolute inset-0 flex items-center eyebrow-mono text-[var(--signal-text)]"
                                style={{ fontSize: "var(--t-label)", letterSpacing: "0.02em", opacity: hit ? 1 : 0, transition: `opacity 400ms ${ease} ${Math.max(rank, 0) * 120}ms` }}
                              >
                                [{rank + 1}]
                              </span>
                            </>
                          )}
                        </span>
                        {/* Nicht getroffene Quellen treten per Farbe zurueck, nicht per
                            Deckkraft: 42 % Deckkraft lag unter 4,5:1 (WCAG 1.4.3). */}
                        <span
                          className={`truncate ${dim ? "text-[var(--text-low)] line-through decoration-[var(--line-strong)]" : "text-[var(--text)]"}`}
                          style={{ fontSize: "var(--t-small)", transition: `color 600ms ${ease}` }}
                        >
                          {name}
                        </span>
                        {locked ? (
                          <span
                            className="eyebrow-mono uppercase text-[var(--text-low)]"
                            style={{ fontSize: "var(--t-label)", letterSpacing: "0.08em", opacity: ranked ? 1 : 0, transition: `opacity 500ms ${ease}` }}
                          >
                            {d.locked}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 w-[4.6rem] justify-end">
                            <span className="h-[3px] w-7 bg-[var(--line)] overflow-hidden" style={{ opacity: rank >= 0 ? 1 : 0 }}>
                              <span
                                className="block h-full bg-[var(--signal)]"
                                style={{
                                  width: hit ? `${SCORES[rank] * 100}%` : "0%",
                                  transition: `width 900ms ${ease} ${Math.max(rank, 0) * 140}ms`,
                                }}
                              />
                            </span>
                            <span
                              className="eyebrow-mono tabular-nums text-[var(--text-mid)]"
                              style={{ fontSize: "var(--t-label)", letterSpacing: "0.02em", opacity: hit ? 1 : 0, transition: `opacity 500ms ${ease} ${Math.max(rank, 0) * 140 + 300}ms` }}
                            >
                              {rank >= 0 ? SCORES[rank].toFixed(2) : ""}
                            </span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Die Antwort */}
              <div className="relative px-5 sm:px-7 py-5">
                <div className="eyebrow-mono uppercase text-[var(--text-low)] mb-3" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  {d.answerLabel}
                </div>
                {/* Platzhalter, bis geschrieben wird */}
                <div className="absolute left-5 sm:left-7 right-7 top-[3.25rem] space-y-2.5" style={{ opacity: answering ? 0 : 1, transition: `opacity 500ms ${ease}` }}>
                  {[92, 100, 78, 64].map((w) => (
                    <span key={w} className="block h-2 bg-[var(--surface-2)]" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <p className="relative text-[var(--text-hi)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.7 }}>
                  {segments.map((seg, si) => {
                    const first = seen;
                    seen += seg.tokens.length;
                    const last = seen;
                    return (
                      <span key={si}>
                        {seg.tokens.map((tok, ti) => (
                          <span key={ti} style={{ opacity: first + ti < snap.words ? 1 : 0, transition: `opacity 380ms ${ease}` }}>
                            {tok}
                          </span>
                        ))}
                        {seg.cite && (
                          <span
                            className="eyebrow-mono text-[var(--signal-text)] align-[0.15em] mx-0.5 px-1 border border-[var(--signal)]"
                            style={{
                              fontSize: "0.68rem",
                              borderRadius: "var(--radius-1)",
                              opacity: last <= snap.words ? 1 : 0,
                              transition: `opacity 380ms ${ease}`,
                            }}
                          >
                            {seg.cite}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3.5 border-t border-[var(--line)]" style={{ fontSize: "var(--t-small)" }}>
              <span
                className="w-1.5 h-1.5 shrink-0"
                style={{ background: statusTone, borderRadius: "var(--radius-pill)", transition: `background 300ms ${ease}` }}
              />
              <span style={{ color: statusTone, transition: `color 300ms ${ease}` }}>{status}</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
