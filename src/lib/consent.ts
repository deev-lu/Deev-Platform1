// ── Consent store ───────────────────────────────────────────────────────────
//
// A small first-party consent manager: no third-party CMP, so nothing about
// your visitors leaves the site in order to ask them whether anything may
// leave the site.
//
// What it keeps, and why:
//   - the choice per category, so scripts can be gated individually
//   - a random consent id and an ISO timestamp, which is the record a
//     supervisory authority asks for when it wants proof that consent was
//     given, and when
//   - the version of the cookie policy that was shown, so that changing the
//     policy re-asks instead of silently reusing an old agreement
//
// It is written to a first-party cookie (so it survives across subdomains and
// is readable at the edge later if needed) and mirrored to localStorage (so it
// survives a cookie purge that leaves site data intact). Either one is enough
// to read the record back.

export const CONSENT_VERSION = 1;

/** Twelve months. The EDPB treats a year as the outside limit for re-asking. */
export const CONSENT_MAX_AGE_DAYS = 365;

export const COOKIE_NAME = "deev_consent";
const MIRROR_KEY = "deev_consent";
const LEGACY_KEY = "cookie-consent"; // "accepted" | "rejected"

/** Fired whenever the record changes. detail is the new record, or null. */
export const CONSENT_EVENT = "deev:consent";
/** Fired to open the preferences dialog from anywhere (footer, policy page). */
export const CONSENT_OPEN_EVENT = "deev:consent-open";

export type ConsentMethod = "accept-all" | "reject-all" | "custom" | "legacy";

export interface ConsentCategories {
  /** Always true. Listed so the stored record is self-describing. */
  necessary: true;
  analytics: boolean;
}

export interface ConsentRecord {
  v: number;
  id: string;
  at: string; // ISO 8601
  method: ConsentMethod;
  categories: ConsentCategories;
}

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

function newId(): string {
  try {
    const b = new Uint8Array(8);
    crypto.getRandomValues(b);
    return Array.from(b, (n) => n.toString(16).padStart(2, "0")).join("");
  } catch {
    return `${Date.now().toString(16)}${Math.floor(Math.random() * 1e6).toString(16)}`;
  }
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string, days: number): void {
  if (!isBrowser()) return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

function clearCookie(name: string): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
}

function parse(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const r = JSON.parse(raw) as ConsentRecord;
    if (!r || typeof r !== "object" || typeof r.at !== "string") return null;
    if (r.v !== CONSENT_VERSION) return null; // policy changed: ask again
    const age = Date.now() - new Date(r.at).getTime();
    if (!Number.isFinite(age) || age > CONSENT_MAX_AGE_DAYS * 864e5) return null;
    return { ...r, categories: { necessary: true, analytics: !!r.categories?.analytics } };
  } catch {
    return null;
  }
}

/** Visitors who answered the previous banner keep their answer. */
function migrateLegacy(): ConsentRecord | null {
  if (!isBrowser()) return null;
  let old: string | null = null;
  try {
    old = localStorage.getItem(LEGACY_KEY);
  } catch {
    return null;
  }
  if (old !== "accepted" && old !== "rejected") return null;
  const record = save(old === "accepted", "legacy");
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* the mirror is already written */
  }
  return record;
}

/** The stored record, or null when we still have to ask. */
export function getConsent(): ConsentRecord | null {
  if (!isBrowser()) return null;
  let stored = parse(readCookie(COOKIE_NAME));
  if (!stored) {
    try {
      stored = parse(localStorage.getItem(MIRROR_KEY));
    } catch {
      stored = null;
    }
    if (stored) writeCookie(COOKIE_NAME, JSON.stringify(stored), CONSENT_MAX_AGE_DAYS);
  }
  return stored ?? migrateLegacy();
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.categories.analytics === true;
}

/** Record a decision and tell the rest of the app about it. */
export function save(analytics: boolean, method: ConsentMethod): ConsentRecord {
  const record: ConsentRecord = {
    v: CONSENT_VERSION,
    id: newId(),
    at: new Date().toISOString(),
    method,
    categories: { necessary: true, analytics },
  };
  const raw = JSON.stringify(record);
  writeCookie(COOKIE_NAME, raw, CONSENT_MAX_AGE_DAYS);
  try {
    localStorage.setItem(MIRROR_KEY, raw);
  } catch {
    /* the cookie is already written */
  }
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent<ConsentRecord>(CONSENT_EVENT, { detail: record }));
  }
  return record;
}

/** Delete the record. The banner comes back and analytics is denied again. */
export function withdrawConsent(): void {
  clearCookie(COOKIE_NAME);
  try {
    localStorage.removeItem(MIRROR_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent<ConsentRecord | null>(CONSENT_EVENT, { detail: null }));
  }
}

/** Subscribe to changes. Returns an unsubscribe fn. */
export function onConsentChange(cb: (r: ConsentRecord | null) => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<ConsentRecord | null>).detail ?? null);
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

/** Open the preferences dialog from a link anywhere on the site. */
export function openCookieSettings(): void {
  if (isBrowser()) window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
