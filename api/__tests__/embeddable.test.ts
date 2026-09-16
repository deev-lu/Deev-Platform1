import { describe, it, expect } from "vitest";
import { blockedBy } from "../embeddable";

/**
 * Diese Auswertung entscheidet, ob eine Fallstudie einen Live-Rahmen anbietet
 * oder in einen neuen Tab führt. Liegt sie falsch, sieht der Besucher genau
 * die graue Fehlerfläche, die sie verhindern soll.
 */
describe("blockedBy", () => {
  it("laesst eine Seite ohne einschraenkende Kopfzeilen durch", () => {
    expect(blockedBy({ xfo: null, csp: null })).toBeNull();
    expect(blockedBy({ xfo: null, csp: "default-src 'self'" })).toBeNull();
  });

  it("erkennt X-Frame-Options DENY und SAMEORIGIN", () => {
    expect(blockedBy({ xfo: "DENY", csp: null })).toBe("x-frame-options");
    expect(blockedBy({ xfo: "SAMEORIGIN", csp: null })).toBe("x-frame-options");
    expect(blockedBy({ xfo: "sameorigin", csp: null })).toBe("x-frame-options");
    expect(blockedBy({ xfo: "  DENY  ", csp: null })).toBe("x-frame-options");
  });

  it("behandelt ALLOW-FROM als Sperre", () => {
    // Nur ein Ursprung darf einbetten, und der ist nicht unserer. Ausserdem
    // wird die Direktive von keinem aktuellen Browser mehr unterstuetzt.
    expect(blockedBy({ xfo: "ALLOW-FROM https://example.com", csp: null })).toBe("x-frame-options");
  });

  it("erkennt frame-ancestors none", () => {
    expect(blockedBy({ xfo: null, csp: "frame-ancestors 'none'" })).toBe("frame-ancestors");
    expect(blockedBy({ xfo: null, csp: "default-src 'self'; frame-ancestors 'none'; img-src *" }))
      .toBe("frame-ancestors");
  });

  it("erkennt eine Liste, in der wir nicht vorkommen", () => {
    expect(blockedBy({ xfo: null, csp: "frame-ancestors 'self' https://partner.example" }))
      .toBe("frame-ancestors");
  });

  it("laesst durch, wenn wir ausdruecklich erlaubt sind", () => {
    expect(blockedBy({ xfo: null, csp: "frame-ancestors 'self' https://www.deev.lu" })).toBeNull();
    expect(blockedBy({ xfo: null, csp: "frame-ancestors https://deev.lu" })).toBeNull();
  });

  it("laesst durch, wenn jeder einbetten darf", () => {
    expect(blockedBy({ xfo: null, csp: "frame-ancestors *" })).toBeNull();
  });

  it("gibt frame-ancestors den Vorrang vor X-Frame-Options", () => {
    // Die neuere Regel sticht die aeltere. Eine Seite, die beides sendet und
    // uns per frame-ancestors erlaubt, waere sonst faelschlich gesperrt.
    expect(blockedBy({ xfo: "DENY", csp: "frame-ancestors https://www.deev.lu" })).toBeNull();
    expect(blockedBy({ xfo: "", csp: "frame-ancestors 'none'" })).toBe("frame-ancestors");
  });
});
