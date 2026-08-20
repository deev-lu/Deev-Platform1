// ── Google Analytics 4 ───────────────────────────────────────────────────────
// Loaded lazily, and only once the visitor has accepted analytics cookies in
// the consent banner (see components/CookieBanner.tsx). Nothing is requested
// from Google — not even the script — until then.

const GA_ID = "G-K0T15PZHMN";
const CONSENT_KEY = "cookie-consent"; // "accepted" | "rejected"

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

/** True when the visitor has accepted non-essential cookies. */
export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

/**
 * Inject gtag.js and configure the property. Safe to call repeatedly —
 * the script is only ever added once.
 */
export function loadAnalytics(): void {
  if (loaded || typeof document === "undefined") return;
  loaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

/**
 * Load analytics if consent is already stored, and listen for the banner's
 * decision so acceptance takes effect immediately. Returns a cleanup fn.
 */
export function initAnalytics(): () => void {
  if (hasAnalyticsConsent()) loadAnalytics();

  const onConsent = (e: Event) => {
    if ((e as CustomEvent<string>).detail === "accepted") loadAnalytics();
  };
  window.addEventListener("cookie-consent", onConsent);
  return () => window.removeEventListener("cookie-consent", onConsent);
}
