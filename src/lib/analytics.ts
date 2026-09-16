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

/**
 * Gemessen wird nur auf der echten Seite.
 *
 * Vorschauen und Testdomains laufen mit demselben Build und derselben
 * Mess-ID. Ohne diese Grenze zaehlt jeder eigene Klick auf einer
 * Vorschau-URL als Sitzung, und zwar in genau dem Konto, das gerade
 * aufgesetzt wird: Absprungrate, Sitzungsdauer und die Zahl der Anfragen
 * waeren von Anfang an mit unserer eigenen Abnahme vermischt. Nachtraeglich
 * laesst sich das in GA4 nicht sauber herausrechnen.
 *
 * Auch `localhost` ist damit ausgenommen - in der Entwicklung soll ohnehin
 * nichts gesendet werden.
 */
const PROD_HOST = "www.deev.lu";

function onProduction(): boolean {
  return typeof location !== "undefined" && location.hostname === PROD_HOST;
}

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
  if (!onProduction()) return;
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

// ── Ereignisse ──────────────────────────────────────────────────────────────
//
// Seitenaufrufe allein beantworten nicht, woran es hakt. Diese Ereignisse
// beantworten die Fragen, die den Verkauf betreffen: Welcher Leistungsweg wird
// ueberhaupt geoeffnet? Welche Referenz wird gelesen? Wie viele brechen den
// Rechner ab, und wo? Und - der Punkt, der vorher voellig blind war - wie oft
// scheitert ein Absenden, statt anzukommen.
//
// Unter Consent Mode duerfen diese Ereignisse auch ohne Einwilligung gesendet
// werden: im verweigerten Zustand sind es cookielose Pings ohne Kennung. Was
// die Einwilligung steuert, ist die Speicherung, nicht die Messung.

/** Die vollstaendige Liste. Ein Tippfehler waere sonst ein stilles Leck. */
export type TrackEvent =
  | "service_view"
  | "case_view"
  | "calculator_start"
  | "calculator_step"
  | "calculator_complete"
  | "lead_accepted"
  | "lead_error";

type Param = string | number | boolean;

/**
 * Schluessel, die niemals nach Google gehen. GA4 darf keine
 * personenbezogenen Daten enthalten, und die Stelle, an der so etwas
 * passiert, ist immer dieselbe: jemand reicht das Formularobjekt durch,
 * statt einzelne Felder zu waehlen. Deshalb wird hier gefiltert und nicht
 * nur in der Anleitung darum gebeten.
 */
const FORBIDDEN = /email|mail|name|phone|tel|address|message|company|contact|ip\b/i;

function safe(params: Record<string, Param>): Record<string, Param> {
  const out: Record<string, Param> = {};
  for (const [k, v] of Object.entries(params)) {
    if (FORBIDDEN.test(k)) continue;
    // Auch ein harmlos benannter Schluessel kann eine Adresse tragen.
    if (typeof v === "string" && (v.includes("@") || v.length > 100)) continue;
    out[k] = v;
  }
  return out;
}

/**
 * Ein Ereignis senden.
 *
 * `start()` wird hier mitgerufen, und das ist kein Beiwerk. In React laufen
 * die Effekte der Kinder vor denen der Eltern; `initAnalytics()` haengt im
 * Effekt von `App`, ganz oben. Ein Ereignis, das ein Baustein beim Einhaengen
 * meldet, kam also vor dem Shim an und fiel ersatzlos aus - im Browser
 * nachgemessen: `case_view` auf einer Fallstudienseite wurde nie gesendet,
 * `service_view` dagegen schon, weil die Leistungsseiten nachgeladen werden
 * und dadurch spaeter dran sind. Ein Messpunkt, der davon abhaengt, in
 * welcher Reihenfolge React zwei Effekte ausfuehrt, ist keiner.
 *
 * `start()` ist idempotent und setzt die Consent-Vorgaben, bevor irgendetwas
 * gesendet wird; es vorzuziehen aendert an der Einwilligung nichts.
 *
 * Ohne Fenster - im Serverrendern, im Test ohne DOM - passiert nichts.
 */
export function track(event: TrackEvent, params: Record<string, Param> = {}): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  // Ausdruecklich, nicht nur als Nebenwirkung davon, dass `start()` auf einer
  // Testdomain nichts aufsetzt: diese Zeile ist die Zusage, dass eine Vorschau
  // keine Messdaten erzeugt, und sie laesst sich pruefen.
  if (!onProduction()) return;
  start();
  window.gtag?.("event", event, safe(params));
}
