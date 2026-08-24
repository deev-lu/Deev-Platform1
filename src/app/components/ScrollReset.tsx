import { useEffect } from "react";
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
 * Anchored links (/#services from the footer) are handed to
 * scrollToIdWhenReady, which waits for the target to stop moving: the
 * homepage mounts in pieces, and a section's position is not final on the
 * first frame after navigation.
 */
export default function ScrollReset() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      scrollToIdWhenReady(hash);
      return;
    }
    scrollToTop(true);
  }, [pathname, hash]);

  return null;
}
