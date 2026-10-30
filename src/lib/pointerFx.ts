import { isMotionPaused } from "./motionPref";

/**
 * Pointer effects, since 30 Oct 2026 (design.css, "Pointer light"):
 *
 * - every `.card-glow` gets the pointer's position as `--mx`/`--my` (px,
 *   for the spotlight) and `--px`/`--py` (-0.5..0.5, for the screenshot
 *   tilt in SelectedWork, `[data-tilt]`);
 * - a `.btn-grad` leans a few pixels towards the pointer (`--mag-x/-y`).
 *
 * One listener on the document, at most one write per frame. Mouse and pen
 * only (a finger has no hover), and nothing at all under reduced motion,
 * "Pause motion" or Klar Access's "Bewegung reduzieren": then every value
 * goes back to rest and stays there. Purely decorative; nothing depends on
 * it, so a browser without it simply shows still cards.
 */
const MAG_X = 6;
const MAG_Y = 4;

export function initPointerFx(): () => void {
  if (typeof window === "undefined") return () => {};
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  let card: HTMLElement | null = null;
  let btn: HTMLElement | null = null;
  let last: PointerEvent | null = null;
  let raf = 0;

  const rest = (el: HTMLElement | null, props: string[]) => {
    if (el) for (const p of props) el.style.removeProperty(p);
  };
  const leaveCard = () => {
    rest(card, ["--px", "--py"]);
    card = null;
  };
  const leaveBtn = () => {
    rest(btn, ["--mag-x", "--mag-y"]);
    btn = null;
  };

  const frame = () => {
    raf = 0;
    const e = last;
    if (!e) return;
    const target = e.target instanceof Element ? e.target : null;

    const c = target?.closest<HTMLElement>(".card-glow") ?? null;
    if (c !== card) leaveCard();
    if (c) {
      card = c;
      const r = c.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      c.style.setProperty("--mx", `${x.toFixed(0)}px`);
      c.style.setProperty("--my", `${y.toFixed(0)}px`);
      c.style.setProperty("--px", (x / r.width - 0.5).toFixed(3));
      c.style.setProperty("--py", (y / r.height - 0.5).toFixed(3));
    }

    const b = target?.closest<HTMLElement>(".btn-grad") ?? null;
    if (b !== btn) leaveBtn();
    if (b) {
      btn = b;
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      b.style.setProperty("--mag-x", `${(dx * MAG_X).toFixed(1)}px`);
      b.style.setProperty("--mag-y", `${(dy * MAG_Y).toFixed(1)}px`);
    }
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch" || !fine.matches || reduce.matches || isMotionPaused()) {
      if (card || btn) {
        leaveCard();
        leaveBtn();
      }
      return;
    }
    last = e;
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const onLeave = () => {
    last = null;
    leaveCard();
    leaveBtn();
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => {
    document.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    if (raf) cancelAnimationFrame(raf);
    onLeave();
  };
}
