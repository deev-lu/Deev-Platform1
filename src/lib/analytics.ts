// ── Google Analytics 4, with Consent Mode v2 ────────────────────────────────
//
// Two things were wrong with the first version, and both cost data:
//
//  1. The gtag shim pushed a rest array to dataLayer. gtag.js only executes
//     commands pushed as an `arguments` object; a plain array is treated as a
//     data-layer event and the `js` and `config` commands were never run. The
//     script loaded and then measured nothing. Keep the odd-looking
//     `arguments` push below exactly as Google writes it.
//
//  2. Nothing was requested at all until someone pressed Accept. Visitors who
//     ignored the banner, and there are always more of those than of the ones
//     who press a button, were invisible. Consent Mode fixes that without
//     storing anything on their device: the tag loads with every storage type
//     denied, which sends cookieless pings that GA4 counts, and is upgraded to
//     granted the moment consent is given. Advertising storage stays denied in
//     both states because we run no ad products.
//
// Which categories are allowed comes from lib/consent.ts, the site's own
// consent store: this file only translates that into Consent Mode signals.

import { hasAnalyticsConsent, onConsentChange } from "./consent";

const GA_ID = "G-K0T15PZHMN";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let started = false;

/** Boot the tag with everything denied, then load the library. Idempotent. */
function start(): void {
  if (started || typeof document === "undefined") return;
  started = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as (...args: unknown[]) => void;

  // Defaults must be queued before gtag.js runs, or the first hit escapes
  // before consent state is known.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("set", "url_passthrough", true);

  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Analytics storage on or off. Advertising storage is never granted. */
function setAnalyticsConsent(granted: boolean): void {
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

/** Kept for callers that only want to know whether the tag is measuring. */
export function loadAnalytics(): void {
  start();
  setAnalyticsConsent(true);
}

/**
 * Start measurement, apply whatever the visitor has already decided, and
 * follow the consent store live. Returns a cleanup fn.
 */
export function initAnalytics(): () => void {
  start();
  if (hasAnalyticsConsent()) setAnalyticsConsent(true);
  // Covers acceptance, a narrowing of the choice, and withdrawal.
  return onConsentChange((record) => setAnalyticsConsent(record?.categories.analytics === true));
}
