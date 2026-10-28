import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * "Pause motion": one switch for every moving thing on the site (WCAG 2.1
 * success criterion 2.2.2, Pause, Stop, Hide).
 *
 * The hero film, the client marquee and the looping demos all start by
 * themselves and run longer than five seconds, so a visitor needs a way to
 * stop them that does not depend on an operating-system setting. The switch
 * sits in the hero (next to the film) and in the footer; it sets the class
 * `motion-paused` on <html>, which motion.css turns into "no animation", and
 * every animated component reads it through useReduceMotion().
 *
 * The choice is kept in localStorage under `motion`, like the theme: a
 * preference the visitor set, needed to honour it on the next page. It is
 * also applied before paint by the inline script in index.html.
 */
const KEY = "motion";
const CLASS = "motion-paused";
const listeners = new Set<(paused: boolean) => void>();

export function isMotionPaused(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains(CLASS);
}

export function setMotionPaused(paused: boolean): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle(CLASS, paused);
  try {
    if (paused) localStorage.setItem(KEY, "paused");
    else localStorage.removeItem(KEY);
  } catch {
    /* the choice just will not persist */
  }
  listeners.forEach((fn) => fn(paused));
}

/** The visitor's own switch, live. False on the server and before mount. */
export function useMotionPaused(): boolean {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    setPaused(isMotionPaused());
    listeners.add(setPaused);
    return () => {
      listeners.delete(setPaused);
    };
  }, []);
  return paused;
}

/**
 * Reduce motion if the operating system asks for it OR the visitor pressed
 * pause. Use this instead of motion's useReducedMotion() in components.
 */
export function useReduceMotion(): boolean {
  const system = useReducedMotion();
  const paused = useMotionPaused();
  return Boolean(system) || paused;
}
