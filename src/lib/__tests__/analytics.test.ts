import { describe, it, expect, beforeEach } from "vitest";
import { track } from "../analytics";

/**
 * Der Filter in `track` ist die letzte Stelle vor Google. Was hier
 * durchrutscht, steht in einem fremden System und laesst sich nicht
 * zurueckholen - deshalb wird er geprueft und nicht nur kommentiert.
 */

const sent: Array<[string, string, Record<string, unknown>]> = [];

// Die Tests laufen ohne DOM. `track` startet das Tag selbst, braucht also
// ein Fenster und ein Dokument, das ein Skriptelement aufnehmen kann - mehr
// nicht. Ein vollstaendiges jsdom waere eine Abhaengigkeit fuer zehn Zeilen.
type FakeWindow = { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
const g = globalThis as { window?: FakeWindow; document?: unknown };
const win: FakeWindow = g.window ?? {};
g.window = win;
// Ohne einen Produktionshost sendet `track` nichts - das ist die Zusage fuer
// Testdomains. Fuer die Filtertests wird er hier gesetzt.
(g as { location?: { hostname: string } }).location = { hostname: "www.deev.lu" };
g.document = g.document ?? {
  createElement: () => ({ set src(_v: string) {}, async: false }),
  head: { appendChild: () => {} },
};

beforeEach(() => {
  win.dataLayer = [];
  // Nach dem ersten `start()` setzt analytics.ts den echten Shim und
  // ueberschreibt einen vorher gesetzten Rekorder. Deshalb erst ein
  // Aufwaermruf, dann den Rekorder setzen - und erst danach leeren, sonst
  // steht der Aufwaermruf selbst als erster Eintrag drin.
  track("service_view");
  win.gtag = (...args: unknown[]) => {
    sent.push(args as [string, string, Record<string, unknown>]);
  };
  sent.length = 0;
});

describe("track", () => {
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

  it("sendet auf einer Testdomain gar nichts", () => {
    const loc = (g as { location?: { hostname: string } }).location!;
    loc.hostname = "deev-platform1-git-test.vercel.app";
    track("service_view", { service: "ai" });
    expect(sent).toHaveLength(0);
    loc.hostname = "www.deev.lu";
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
