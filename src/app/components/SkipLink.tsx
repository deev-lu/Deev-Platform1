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
