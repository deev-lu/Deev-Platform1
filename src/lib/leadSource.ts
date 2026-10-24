/**
 * Where an enquiry came from, sent along with it.
 *
 * Without this a lead email said who wrote, never what brought them: no page,
 * no campaign. So no change to the site or to an ad could be judged by the
 * enquiries it produced.
 *
 * Held in memory only. The landing address and the outside referrer are read
 * once, when the site first loads, and live in this module until the tab
 * closes or reloads. Nothing is written to cookies or storage, so this needs
 * no consent; it travels only inside an enquiry the visitor chooses to send,
 * and the form says so next to the button.
 */

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

type Landing = { path: string; referrer: string; utm: Record<string, string> };

let landing: Landing | null = null;

/** Read the first address of the visit. Called once, before the router moves. */
export function captureLanding(): void {
  if (landing || typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const utm: Record<string, string> = {};
  for (const k of UTM) {
    const v = url.searchParams.get(k);
    if (v) utm[k] = v.slice(0, 100);
  }
  // Only an outside referrer says anything; our own host is navigation.
  let referrer = "";
  try {
    const r = document.referrer ? new URL(document.referrer) : null;
    if (r && r.hostname !== url.hostname) referrer = r.hostname;
  } catch {
    /* malformed referrer: leave it out */
  }
  landing = { path: url.pathname, referrer, utm };
}

/** The fields an enquiry carries about its origin. Empty values are left out. */
export function leadSource(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = { sent_from: window.location.pathname };
  if (landing) {
    if (landing.path !== window.location.pathname) out.landing_page = landing.path;
    if (landing.referrer) out.came_from = landing.referrer;
    const campaign = UTM.map((k) => landing!.utm[k]).filter(Boolean).join(" / ");
    if (campaign) out.campaign = campaign;
  }
  return out;
}
