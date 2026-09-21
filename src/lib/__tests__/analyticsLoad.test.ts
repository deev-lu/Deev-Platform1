import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Die zentrale Zusage der Consent-Umstellung: ohne Einwilligung wird
 * gtag.js nicht angefordert.
 *
 * Der Filtertest nebenan prueft, dass `track` nichts sendet. Das ist nicht
 * dasselbe. Frueher lud das Tag auf jeder Seite und schickte cookielose
 * Pings mit IP-Adresse, ganz ohne dass eine einzige Zeile `track` aufrief -
 * die Anfrage an googletagmanager.com entstand durch das Einhaengen des
 * Skripts selbst. Genau das wird hier gezaehlt.
 *
 * Eigene Datei, weil `initAnalytics` nur beim ersten Aufruf einhaengt:
 * das Modul muss je Fall frisch geladen werden.
 */

type Script = { src: string; async: boolean };

function setupDom(analytics: boolean | null) {
  const injected: Script[] = [];
  const listeners: Array<(e: Event) => void> = [];

  const jar =
    analytics === null
      ? ""
      : `deev_consent=${encodeURIComponent(
          JSON.stringify({
            v: 2,
            id: "testref",
            at: new Date().toISOString(),
            method: analytics ? "accept-all" : "reject-all",
            categories: { necessary: true, analytics },
          })
        )}`;

  const g = globalThis as Record<string, unknown>;
  g.location = { hostname: "www.deev.lu" };
  g.window = {
    dataLayer: [],
    addEventListener: (_t: string, cb: (e: Event) => void) => void listeners.push(cb),
    removeEventListener: () => {},
  };
  let cookie = jar;
  g.document = {
    get cookie() {
      return cookie;
    },
    set cookie(v: string) {
      cookie = v;
    },
    createElement: () => ({ src: "", async: false }) as Script,
    head: { appendChild: (s: Script) => void injected.push(s) },
  };
  g.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
  return { injected };
}

const tagRequests = (injected: Script[]) =>
  injected.filter((s) => s.src.includes("googletagmanager.com"));

describe("gtag.js wird erst nach einer Zustimmung angefordert", () => {
  beforeEach(() => {
    // Modulzustand zuruecksetzen: `started` merkt sich sonst den Vorlauf.
    vi.resetModules();
  });

  it("keine Auswahl: kein Skript, keine Anfrage", async () => {
    const { injected } = setupDom(null);
    const { initAnalytics } = await import("../analytics");
    initAnalytics();
    expect(tagRequests(injected)).toHaveLength(0);
  });

  it("Ablehnung: kein Skript, keine Anfrage", async () => {
    const { injected } = setupDom(false);
    const { initAnalytics } = await import("../analytics");
    initAnalytics();
    expect(tagRequests(injected)).toHaveLength(0);
  });

  it("Zustimmung: genau eine Anfrage, an die echte Property", async () => {
    const { injected } = setupDom(true);
    const { initAnalytics } = await import("../analytics");
    initAnalytics();
    const reqs = tagRequests(injected);
    expect(reqs).toHaveLength(1);
    expect(reqs[0].src).toContain("id=G-K0T15PZHMN");
  });

  it("Vorschau misst unter einer ID, die keine echten Zahlen beruehrt", async () => {
    const { injected } = setupDom(true);
    (globalThis as Record<string, unknown>).location = {
      hostname: "deev-platform1-git-test.vercel.app",
    };
    const { initAnalytics } = await import("../analytics");
    initAnalytics();
    const reqs = tagRequests(injected);
    expect(reqs).toHaveLength(1);
    expect(reqs[0].src).not.toContain("G-K0T15PZHMN");
  });

  it("url_passthrough wird nicht mehr gesetzt", async () => {
    setupDom(true);
    const g = globalThis as { window?: { dataLayer?: unknown[] } };
    const { initAnalytics } = await import("../analytics");
    initAnalytics();
    const pushed = (g.window!.dataLayer ?? []).map((a) =>
      Array.from(a as ArrayLike<unknown>)
    );
    expect(pushed.some((a) => a[1] === "url_passthrough")).toBe(false);
    // Die verweigerten Vorgaben stehen weiterhin vor allem anderen.
    expect(pushed[0]?.[0]).toBe("consent");
    expect(pushed[0]?.[1]).toBe("default");
  });
});
