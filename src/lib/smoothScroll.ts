import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Site-wide smooth scrolling.
 *
 * Lenis intercepts the wheel and eases the page to where the wheel asked for,
 * which is the weighted, slightly inertial feel the reference sites have. It
 * drives the real window scroll position, so `position: sticky`, the pinned
 * layers section and every `useScroll` progress value keep working exactly as
 * before.
 *
 * It is deliberately narrow about where it runs:
 *   - Pointer devices only. Touch scrolling is already smooth and native
 *     momentum beats anything we can synthesise, so phones and tablets are
 *     left alone. That also keeps the main thread free on mobile, per the
 *     performance rules.
 *   - Never under prefers-reduced-motion. Hijacking the wheel is exactly the
 *     kind of motion that setting is asking us not to do.
 *
 * Every programmatic jump on the site goes through scrollToTop/scrollToId
 * below so the two systems never fight over the same scroll.
 */

let lenis: Lenis | null = null;

/** Height of the fixed navbar, so an anchored section does not land under it. */
const NAV_OFFSET = -72;

const canSmoothScroll = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initSmoothScroll(): () => void {
  if (!canSmoothScroll()) return () => {};

  lenis = new Lenis({
    duration: 1.05,
    // Exponential ease-out: quick to answer the wheel, long tail to settle.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });

  let frame = requestAnimationFrame(function loop(time: number) {
    lenis?.raf(time);
    frame = requestAnimationFrame(loop);
  });

  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTop(immediate = false) {
  if (lenis) {
    lenis.scrollTo(0, immediate ? { immediate: true } : undefined);
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

/** Hold the page still while a modal is open, then let it move again. */
export function pauseSmoothScroll(): void {
  lenis?.stop();
}

export function resumeSmoothScroll(): void {
  lenis?.start();
}

/**
 * Scroll to a section that may not have settled yet.
 *
 * After a route change the page mounts in pieces, so a section's position
 * keeps moving for a moment: `#why-deev` exists as an empty wrapper on the
 * first frame and ends up eight thousand pixels further down once everything
 * above it has rendered. Two guards, because either alone lands short:
 *   - wait until both the document height and the target's offset have held
 *     still for several frames, and never accept that before 400ms
 *   - scroll, then check once more shortly after and correct if the page
 *     moved underneath the animation
 */
export function scrollToIdWhenReady(id: string, timeout = 4000) {
  const key = id.replace(/^#/, "");
  const started = performance.now();
  let lastTop: number | null = null;
  let lastHeight = 0;
  let stable = 0;

  const correct = () => {
    const el = document.getElementById(key);
    if (!el) return;
    if (Math.abs(el.getBoundingClientRect().top + NAV_OFFSET) > 4) scrollToId(key);
  };

  const tick = () => {
    const el = document.getElementById(key);
    const height = document.body.scrollHeight;
    if (el) {
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
      const held = lastTop !== null && Math.abs(top - lastTop) < 2 && height === lastHeight;
      stable = held ? stable + 1 : 0;
      lastTop = top;
      lastHeight = height;

      if (stable >= 5 && performance.now() - started > 400) {
        scrollToId(key);
        window.setTimeout(correct, 900);
        return;
      }
    } else {
      lastHeight = height;
    }

    if (performance.now() - started < timeout) {
      requestAnimationFrame(tick);
    } else if (el) {
      scrollToId(key);
      window.setTimeout(correct, 900);
    }
  };

  requestAnimationFrame(tick);
}

/** Accepts "#id" or a bare id. */
export function scrollToId(id: string) {
  const target = document.getElementById(id.replace(/^#/, ""));
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: NAV_OFFSET });
    return;
  }
  target.scrollIntoView({ behavior: "smooth" });
}
