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
//  2. The tag loaded on every visit with storage denied - Consent Mode's own
//     design. It counted the visitors who ignore the banner, and it stored
//     nothing on their device, but it still fetched gtag.js and still sent a
//     ping carrying their IP address. "No cookie" is not "no request", and
//     the operator decided that nothing may reach Google before a yes.
//     Nothing is loaded now until analytics consent exists; advertising
//     storage stays denied in every state, because we run no ad products.
//
// Which categories are allowed comes from lib/consent.ts, the site's own
// consent store: this file only translates that into Consent Mode signals.

import { hasAnalyticsConsent, onConsentChange } from "./consent";

const PROD_HOST = "www.deev.lu";
const PROD_ID = "G-K0T15PZHMN";

/**
 * Auf einer Vorschau laeuft dieselbe Mechanik, aber unter einer Mess-ID, die
 * es nicht gibt.
 *
 * Die Frage "laedt GA4 vor der Einwilligung?" laesst sich nur beantworten,
 * indem man zusieht, ob die Anfrage an googletagmanager.com ausgeht. Vorher
 * war das unmoeglich: die Messung war an `www.deev.lu` gebunden, eine
 * Vorschau lud also nie etwas - und ein Test, der immer "keine Anfrage"
 * sagt, beweist nichts.
 *
 * Auf einer Vorschau laeuft deshalb derselbe Code mit derselben Reihenfolge,
 * nur dass die ID ins Leere zeigt. Im Netzwerk-Tab ist genau dasselbe zu
 * sehen: vor der Einwilligung keine Anfrage, danach eine. In GA4 kommt
 * nichts an, weil die Property nicht existiert - die eigene Abnahme
 * vermischt sich also nicht mit den echten Zahlen, was in GA4 nachtraeglich
 * nicht sauber herauszurechnen waere.
 */
const PREVIEW_ID = "G-PREVIEW0000";

/** localhost bleibt aussen vor: in der Entwicklung wird nichts geladen. */
const PREVIEW_HOST = /(^|\.)vercel\.app$|(^|\.)deev\.lu$/;

function measurementHost(): "production" | "preview" | null {
  if (typeof location === "undefined") return null;
  const h = location.hostname;
  if (h === PROD_HOST) return "production";
  return PREVIEW_HOST.test(h) ? "preview" : null;
}

function onProduction(): boolean {
  return measurementHost() !== null;
}

/** Die echte Property nur auf der echten Seite. */
function measurementId(): string {
  return measurementHost() === "production" ? PROD_ID : PREVIEW_ID;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let started = false;

/**
 * Load the tag. Only ever called once analytics consent exists.
 *
 * This used to run on every page load with consent defaulted to denied -
 * Consent Mode's own design, and defensible, but it still fetched gtag.js
 * from googletagmanager.com and still sent a cookieless ping carrying the
 * visitor's IP address and browser. "No cookie" is not "no request". The
 * operator's decision is that nothing reaches Google until somebody says
 * yes, so the script injection now lives behind that yes.
 *
 * The denied defaults are still queued first. The gap between injecting the
 * script and the update arriving is small, but the first hit must not escape
 * into it.
 */
function start(): void {
  if (started || typeof document === "undefined") return;
  if (!onProduction()) return;
  started = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as (...args: unknown[]) => void;

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
  window.gtag("set", "ads_data_redaction", true);
  // url_passthrough is gone. It appends click identifiers to internal links
  // so measurement survives without cookies - useful only for advertising
  // journeys, which this site does not run.

  window.gtag("js", new Date());
  const id = measurementId();
  window.gtag("config", id);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
}

/**
 * Remove the analytics cookies this site can reach.
 *
 * On withdrawal, telling the tag to stop storing leaves what it already
 * stored. GA writes `_ga` and `_ga_<measurement id>` on the registrable
 * domain, so the deletion is attempted on the exact host and on the
 * dot-prefixed parent - a cookie set on `.deev.lu` does not clear by
 * expiring one named the same on `www.deev.lu`.
 */
function dropGaCookies(): void {
  if (typeof document === "undefined") return;
  const host = location.hostname;
  const parent = host.split(".").slice(-2).join(".");
  const past = "Thu, 01 Jan 1970 00:00:00 GMT";
  for (const name of ["_ga", `_ga_${measurementId().replace(/^G-/, "")}`]) {
    for (const domain of [undefined, host, `.${parent}`]) {
      document.cookie =
        `${name}=; Expires=${past}; Path=/` + (domain ? `; Domain=${domain}` : "");
    }
  }
}

/** Analytics storage on or off. Advertising storage is never granted. */
function setAnalyticsConsent(granted: boolean): void {
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

/** Turn measurement on. Loads the tag the first time, then grants storage. */
function enable(): void {
  start();
  setAnalyticsConsent(true);
}

/**
 * Turn measurement off.
 *
 * Two different situations, one function. If the tag is already running -
 * consent given, then withdrawn in the same visit - it is told to stop
 * storing and the cookies it wrote are cleared. If it never loaded, there is
 * nothing to tell and nothing to clear, and the next page load will not load
 * it either, because that now depends on the stored choice.
 */
function disable(): void {
  if (started) setAnalyticsConsent(false);
  dropGaCookies();
}

/** Kept for callers that only want to know whether the tag is measuring. */
export function loadAnalytics(): void {
  enable();
}

/**
 * Apply whatever the visitor has already decided, then follow the consent
 * store live. Returns a cleanup fn.
 *
 * Nothing is loaded here unconditionally any more. Without a stored yes this
 * function does nothing at all, which is the whole point: no decision means
 * no request to Google.
 */
export function initAnalytics(): () => void {
  if (hasAnalyticsConsent()) enable();
  // Covers acceptance, a narrowing of the choice, and withdrawal.
  return onConsentChange((record) =>
    record?.categories.analytics === true ? enable() : disable()
  );
}

// ── Ereignisse ──────────────────────────────────────────────────────────────
//
// Seitenaufrufe allein beantworten nicht, woran es hakt. Diese Ereignisse
// beantworten die Fragen, die den Verkauf betreffen: Welcher Leistungsweg wird
// ueberhaupt geoeffnet? Welche Referenz wird gelesen? Wie viele brechen den
// Rechner ab, und wo? Und - der Punkt, der vorher voellig blind war - wie oft
// scheitert ein Absenden, statt anzukommen.
//
// Gesendet wird nur mit Einwilligung. Unter Consent Mode waere auch der
// verweigerte Zustand zulaessig - cookielose Pings ohne Kennung -, aber das
// bleibt eine Anfrage an Google, und die soll ohne Ja nicht stattfinden.

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
  if (!onProduction()) return;
  // Ohne Einwilligung wird nicht gemessen - und zwar hier, nicht erst im Tag.
  // Frueher schickte diese Funktion die Ereignisse auch im verweigerten
  // Zustand als cookielose Pings; das war unter Consent Mode zulaessig, aber
  // es blieb eine Anfrage an Google. Kein Ja, kein Ereignis.
  if (!hasAnalyticsConsent()) return;
  start();
  window.gtag?.("event", event, safe(params));
}
