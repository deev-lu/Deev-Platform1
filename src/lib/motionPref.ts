import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * "Pause motion": one switch for every moving thing on the site (WCAG 2.2
 * success criterion 2.2.2, Pause, Stop, Hide).
 *
 * The hero film, the client marquee and the looping demos all start by
 * themselves and run longer than five seconds, so a visitor needs a way to
 * stop them that does not depend on an operating-system setting or on the
 * accessibility menu having loaded. The site's own switch (MotionToggle, in
 * the hero and in the footer) sets the class `motion-paused` on <html>,
 * which motion.css turns into "no animation", and every animated component
 * reads it through useReduceMotion().
 *
 * Klar Access (public/klar-access/) has the same setting, "Bewegung
 * reduzieren", which marks <html data-ka-motion>. The two are kept as one:
 * either attribute counts as paused, pressing the site's switch also sets
 * the menu's, and turning the menu's off releases the site's too. Without the
 * menu (blocked, failed to load) the site's switch works on its own.
 *
 * The choice is kept in localStorage under `motion`, like the theme: a
 * preference the visitor set, needed to honour it on the next page. It is
 * also applied before paint by the inline script in index.html.
 */
const KEY = "motion";
const CLASS = "motion-paused";
const KLAR_ATTR = "data-ka-motion";

interface KlarApi {
  getSettings?: () => { motion?: boolean };
  setSettings?: (next: { motion: boolean }) => void;
}

const klar = (): KlarApi | undefined =>
  (window as unknown as { KlarAccess?: KlarApi }).KlarAccess;

export function isMotionPaused(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  return root.classList.contains(CLASS) || root.hasAttribute(KLAR_ATTR);
}

function setOwn(paused: boolean): void {
  document.documentElement.classList.toggle(CLASS, paused);
  try {
    if (paused) localStorage.setItem(KEY, "paused");
    else localStorage.removeItem(KEY);
  } catch {
    /* the choice just will not persist */
  }
}

export function setMotionPaused(paused: boolean): void {
  if (typeof document === "undefined") return;
  setOwn(paused);
  const api = klar();
  if (api?.getSettings && api.setSettings && api.getSettings().motion !== paused) {
    api.setSettings({ motion: paused });
  }
}

let wired = false;
/** The menu's switch, turned off there, releases the site's as well. */
function wireKlar(): void {
  if (wired || typeof document === "undefined") return;
  wired = true;
  document.addEventListener("klar-access:change", (e) => {
    const motion = (e as CustomEvent<{ settings?: { motion?: boolean } }>).detail?.settings?.motion;
    if (motion === false && document.documentElement.classList.contains(CLASS)) setOwn(false);
  });
}

/**
 * Paused by the site's switch or by Klar Access, live. False on the server
 * and before mount.
 */
export function useMotionPaused(): boolean {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    wireKlar();
    const root = document.documentElement;
    const read = () => setPaused(isMotionPaused());
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["class", KLAR_ATTR] });
    return () => mo.disconnect();
  }, []);
  return paused;
}

/**
 * Reduce motion if the operating system asks for it OR the visitor paused
 * it. Use this instead of motion's useReducedMotion() in components.
 */
export function useReduceMotion(): boolean {
  const system = useReducedMotion();
  const paused = useMotionPaused();
  return Boolean(system) || paused;
}
