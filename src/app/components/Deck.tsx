import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * A list that reads as a swipeable deck on phones and as an ordinary block
 * from md up.
 *
 * One DOM either way. The cards are the same <li> elements in both layouts,
 * switched by CSS, so no copy is duplicated for the sake of a breakpoint and
 * every word is indexed exactly once.
 *
 * Why it exists: four hairline rows stacked vertically cost around 800px of
 * phone scroll and read as a wall. The same four cards side by side cost 340px
 * and turn reading into swiping, which is what the section is asking for.
 *
 * The counter, rail and arrows only appear while the track genuinely scrolls
 * sideways, so the desktop layout renders nothing extra.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export function Deck({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  /** Classes for the track. Give it its md-and-up layout here. */
  className?: string;
  /** Accessible name, e.g. "What we build". */
  label: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    // Only a track that actually overflows sideways gets controls.
    if (!cards.length || el.scrollWidth - el.clientWidth < 8) {
      setN(0);
      return;
    }
    const base = cards[0].offsetLeft;
    let best = 0;
    let bestD = Infinity;
    cards.forEach((c, idx) => {
      const d = Math.abs(c.offsetLeft - base - el.scrollLeft);
      if (d < bestD) {
        bestD = d;
        best = idx;
      }
    });
    setI(best);
    setN(cards.length);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const go = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const next = cards[Math.min(cards.length - 1, Math.max(0, i + dir))];
    if (next) el.scrollTo({ left: next.offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={ref}
        aria-label={label}
        className={`flex overflow-x-auto no-scrollbar snap-x snap-mandatory
                    -mx-[var(--gutter)] px-[var(--gutter)] gap-4 pb-1
                    md:mx-0 md:px-0 md:gap-0 md:overflow-visible md:snap-none ${className}`}
      >
        {children}
      </ul>

      {n > 0 && (
        <div className="flex items-center gap-5 mt-7 md:hidden">
          <span
            className="eyebrow-mono text-[var(--text-low)] tabular-nums shrink-0"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span className="text-[var(--text-hi)]">{pad(i + 1)}</span> / {pad(n)}
          </span>

          <div className="relative flex-1 h-px bg-[var(--line)]" aria-hidden="true">
            <span
              className="absolute inset-y-0 left-0 bg-[var(--signal)] transition-[width] duration-[var(--dur-2)] ease-[var(--ease-out)]"
              style={{ width: `${((i + 1) / n) * 100}%` }}
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={i === 0}
              aria-label={`${label}: previous`}
              className="w-9 h-9 grid place-items-center border border-[var(--line)] text-[var(--text-mid)]
                         disabled:opacity-30 active:bg-[var(--surface-2)] transition-colors duration-[var(--dur-1)]"
              style={{ borderRadius: "var(--radius-1)" }}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={i === n - 1}
              aria-label={`${label}: next`}
              className="w-9 h-9 grid place-items-center border border-[var(--line)] text-[var(--text-mid)]
                         disabled:opacity-30 active:bg-[var(--surface-2)] transition-colors duration-[var(--dur-1)]"
              style={{ borderRadius: "var(--radius-1)" }}
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** One card. `className` carries the md-and-up treatment. */
export const CARD_BASE =
  "snap-start shrink-0 w-[78vw] max-w-[330px] md:w-auto md:max-w-none md:shrink";
