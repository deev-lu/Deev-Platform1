import { useEffect, useState } from "react";

/**
 * Klar Access, the accessibility menu (public/klar-access/, the owner's own
 * tool). Display preferences for the visitor; it is not a compliance claim,
 * and nothing on the site should present it as one.
 *
 * Loaded once, after hydration (from App's first effect): the widget mounts
 * its button in its own shadow root at the start of <body>, outside #root,
 * so it never touches the markup React hydrates. The script guards itself
 * through window.KlarAccess; the data-klar-access marker additionally keeps
 * a second <script> from being added while the first is still loading.
 * Route changes do not reload it: App mounts once for the whole visit.
 *
 * Settings: German menu, the button bottom right, the decorative accent in
 * Electric Blue. The script reads them from its own data- attributes.
 *
 * Once it is ready, the DEEV look (klarAccessTheme.ts, its own chunk) goes
 * into the widget's shadow root, and the host's data-deev-theme follows the
 * site theme (the .dark class on <html>).
 */
const SRC = "/klar-access/klar-access.js";

declare global {
  interface Window {
    KlarAccess?: unknown;
  }
}

export function loadKlarAccess(): void {
  if (typeof document === "undefined") return;
  if (window.KlarAccess || document.querySelector("script[data-klar-access]")) return;
  // Fetched alongside the widget so its first paint is already in DEEV dress.
  const theme = import("./klarAccessTheme").then((m) => m.KLAR_ACCESS_THEME);
  document.addEventListener("klar-access:ready", () => brandKlarAccess(theme), { once: true });
  const s = document.createElement("script");
  s.src = SRC;
  s.async = true;
  s.dataset.klarAccess = "";
  s.dataset.lang = "de";
  s.dataset.position = "right";
  s.dataset.color = "#2563F6";
  document.body.appendChild(s);
}

function brandKlarAccess(theme: Promise<string>): void {
  const host = document.querySelector("klar-access");
  const shadow = host?.shadowRoot;
  if (!host || !shadow || shadow.querySelector("style[data-deev]")) return;
  const root = document.documentElement;
  const sync = () => host.setAttribute("data-deev-theme", root.classList.contains("dark") ? "dark" : "light");
  sync();
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ["class"] });
  theme.then((css) => {
    if (shadow.querySelector("style[data-deev]")) return;
    const style = document.createElement("style");
    style.dataset.deev = "";
    style.textContent = css;
    shadow.append(style);
  });
}

/**
 * True while the widget's "Bewegung reduzieren" is on (it sets
 * data-ka-motion on <html>, also when the system asks for reduced motion).
 * The widget pauses CSS animations and <video> elements; the site uses this
 * to do the rest: show finished states instead of frozen ones (motion.css),
 * stop the hero's YouTube film, and tell motion components to stay still.
 */
export function useKlarMotion(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setOn(root.hasAttribute("data-ka-motion"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-ka-motion"] });
    return () => mo.disconnect();
  }, []);
  return on;
}
