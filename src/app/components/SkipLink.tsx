import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useT } from "../../lib/useT";

/**
 * "Skip to content" (WCAG 2.4.1, Bypass Blocks): the first thing a keyboard
 * reaches on every page, hidden until focused. It moves focus to the anchor
 * right after the navigation (#main), so the next Tab lands in the page.
 * Focus is set by hand because smooth scrolling intercepts hash links.
 */
export default function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main"
      onClick={(e) => {
        const target = document.getElementById("main");
        if (!target) return;
        e.preventDefault();
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start" });
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-3 focus:left-3 focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[var(--signal)] focus:text-white focus:font-semibold"
    >
      {t.site.a11y.skip}
    </a>
  );
}

/** Where the skip link lands: placed straight after the navigation. */
export function MainAnchor() {
  return <div id="main" tabIndex={-1} className="outline-none scroll-mt-20" />;
}

/**
 * A route change in a single-page app is silent: the old page is swapped for
 * the new one, focus stays on a link that may no longer exist, and a screen
 * reader says nothing. After each navigation (not on first load) focus moves
 * to #main, so the next Tab starts at the new page's content, and the new
 * page's title is announced politely (WCAG 2.4.3, 4.1.3).
 */
export function RouteAnnouncer() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // RouteMeta sets the title in an effect of its own; wait for it.
    const t = window.setTimeout(() => {
      setMessage(document.title);
      // A link to a section (/#cybersecurity) scrolls there; focus at the top
      // of the page would pull the next Tab back up, so it stays put.
      if (!hash) document.getElementById("main")?.focus({ preventScroll: true });
    }, 150);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per page, not per hash
  }, [pathname]);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
