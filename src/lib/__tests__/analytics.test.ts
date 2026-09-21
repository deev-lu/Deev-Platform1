import { describe, it, expect, beforeEach } from "vitest";
import { track } from "../analytics";
import { CONSENT_VERSION } from "../consent";

/**
 * Zwei Zusagen werden hier geprueft, und beide sind teuer, wenn sie brechen.
 *
 * Die erste: ohne Einwilligung geht nichts an Google. Das ist seit der
 * Umstellung keine Frage der Speicherung mehr, sondern der Anfrage selbst -
 * frueher lud das Tag auf jeder Seite und schickte cookielose Pings mit der
 * IP-Adresse. Wer das wieder aufweicht, merkt es an dieser Stelle.
 *
 * Die zweite: der Filter in `track` ist die letzte Stelle vor Google. Was
 * hier durchrutscht, steht in einem fremden System und laesst sich nicht
 * zurueckholen.
 */

const sent: Array<[string, string, Record<string, unknown>]> = [];

// Die Tests laufen ohne DOM. Gebraucht werden ein Fenster, ein Dokument mit
// beschreibbarem Cookie-Speicher - `getConsent` liest daraus, und der Widerruf
// schreibt hinein - und ein Local Storage. Ein vollstaendiges jsdom waere eine
// Abhaengigkeit fuer dreissig Zeilen.
type FakeWindow = { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
const g = globalThis as {
  window?: FakeWindow;
  document?: unknown;
  localStorage?: unknown;
};
const win: FakeWindow = g.window ?? {};
g.window = win;

let jar = "";
g.document = {
  get cookie() {
    return jar;
  },
  set cookie(v: string) {
    // Reicht fuer diese Tests: der Name vor dem ersten "=" wird gesetzt oder,
    // bei abgelaufenem Datum, entfernt.
    const [pair, ...attrs] = v.split("; ");
    const name = pair.split("=")[0];
    const rest = jar
      .split("; ")
      .filter((c) => c && !c.startsWith(`${name}=`))
      .join("; ");
    const expired = attrs.some((a) => /^Expires=Thu, 01 Jan 1970/i.test(a));
    jar = expired ? rest : [rest, pair].filter(Boolean).join("; ");
  },
  createElement: () => ({ set src(_v: string) {}, async: false }),
  head: { appendChild: () => {} },
};

const store = new Map<string, string>();
g.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};

const loc = { hostname: "www.deev.lu" };
(g as { location?: { hostname: string } }).location = loc;

/** Eine gespeicherte Entscheidung, so wie die Seite sie schreiben wuerde. */
function decide(analytics: boolean): void {
  const record = {
    v: CONSENT_VERSION,
    id: "testref",
    at: new Date().toISOString(),
    method: analytics ? "accept-all" : "reject-all",
    categories: { necessary: true, analytics },
  };
  jar = `deev_consent=${encodeURIComponent(JSON.stringify(record))}`;
}

function forget(): void {
  jar = "";
  store.clear();
}

/** Zeichnet auf, was an gtag geht. Muss nach dem ersten `start()` gesetzt
 *  werden, weil analytics.ts dort seinen eigenen Shim schreibt. */
function record(): void {
  win.gtag = (...args: unknown[]) => {
    sent.push(args as [string, string, Record<string, unknown>]);
  };
  sent.length = 0;
}

beforeEach(() => {
  loc.hostname = "www.deev.lu";
  win.dataLayer = [];
  decide(true);
  track("service_view"); // Aufwaermruf: setzt den echten Shim
  record();
});

describe("Einwilligung entscheidet, ob ueberhaupt gemessen wird", () => {
  it("sendet nichts, solange niemand entschieden hat", () => {
    forget();
    track("service_view", { service: "ai" });
    expect(sent).toHaveLength(0);
  });

  it("sendet nichts nach einer Ablehnung", () => {
    decide(false);
    track("service_view", { service: "ai" });
    expect(sent).toHaveLength(0);
  });

  it("sendet nach einer Zustimmung", () => {
    decide(true);
    track("service_view", { service: "ai" });
    expect(sent).toHaveLength(1);
  });

  it("hoert nach einem Widerruf wieder auf", () => {
    decide(true);
    track("service_view");
    expect(sent).toHaveLength(1);
    decide(false);
    track("case_view", { project: "feltes" });
    expect(sent).toHaveLength(1); // unveraendert: nichts kam hinzu
  });

  it("misst auf localhost gar nicht, auch mit Zustimmung", () => {
    loc.hostname = "localhost";
    track("service_view", { service: "ai" });
    expect(sent).toHaveLength(0);
  });

  it("misst auf einer Vorschau, damit der Consent-Pfad pruefbar ist", () => {
    loc.hostname = "deev-platform1-git-test.vercel.app";
    track("service_view", { service: "ai" });
    expect(sent).toHaveLength(1);
  });
});

describe("track filtert, was nach Google geht", () => {
  it("sendet Ereignisname und unverfaengliche Parameter", () => {
    track("service_view", { service: "ai", locale: "de" });
    expect(sent).toHaveLength(1);
    expect(sent[0][0]).toBe("event");
    expect(sent[0][1]).toBe("service_view");
    expect(sent[0][2]).toEqual({ service: "ai", locale: "de" });
  });

  it("verwirft Schluessel, die nach Personendaten aussehen", () => {
    track("lead_accepted", {
      source: "contact",
      email: "kunde@example.com",
      name: "Max Mustermann",
      phone: "+352 691 000 000",
      company: "Muster SARL",
      message: "Hallo",
      address: "1 rue de Test",
    });
    expect(sent[0][2]).toEqual({ source: "contact" });
  });

  it("verwirft eine Adresse auch unter harmlosem Schluessel", () => {
    track("lead_error", { source: "calculator", reason: "kunde@example.com" });
    expect(sent[0][2]).toEqual({ source: "calculator" });
  });

  it("verwirft ueberlange Zeichenketten, in denen Freitext stecken kann", () => {
    track("lead_error", { source: "contact", reason: "x".repeat(101) });
    expect(sent[0][2]).toEqual({ source: "contact" });
  });

  it("laesst Zahlen und Wahrheitswerte durch", () => {
    track("calculator_step", { from: 2, to: 3, grant: true });
    expect(sent[0][2]).toEqual({ from: 2, to: 3, grant: true });
  });

  it("faellt still aus, wenn das Tag nicht laeuft", () => {
    win.gtag = undefined;
    expect(() => track("case_view", { project: "feltes" })).not.toThrow();
  });

  it("meldet den Grund eines Fehlschlags, nicht nur dass er auftrat", () => {
    track("lead_error", { source: "calculator", reason: "rate-limited" });
    expect(sent[0][2]).toEqual({ source: "calculator", reason: "rate-limited" });
  });
});
