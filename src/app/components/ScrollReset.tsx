import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { scrollToIdWhenReady, scrollToTop } from "../../lib/smoothScroll";

/**
 * Where a page starts.
 *
 * A single-page app keeps the scroll position across a route change unless
 * something resets it, so following a footer link from the bottom of one page
 * opened the next one halfway down. Every route now begins at the top, or at
 * the section a link names.
 *
 * Anchored links (/#services from the footer) start at the top too, then
 * scrollToIdWhenReady jumps to the section once it has stopped moving: the
 * homepage mounts in pieces, and a section's position is not final on the
 * first frame after navigation. No glide in either case: you arrive where
 * the page or section begins, never at the old position (often the footer).
 *
 * A layout effect, so the reset lands before the new page is painted; with a
 * plain effect the first frame still showed the previous scroll position.
 */
/** Layout effect in the browser; plain effect during the prerender, where a
 *  layout effect only produces a warning. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ScrollReset() {
  const { pathname, hash } = useLocation();

  useIsoLayoutEffect(() => {
    scrollToTop(true);
    if (hash) scrollToIdWhenReady(hash);
  }, [pathname, hash]);

  return null;
}
