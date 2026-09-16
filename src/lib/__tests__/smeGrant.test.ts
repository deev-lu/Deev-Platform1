import { describe, expect, it } from "vitest";
import {
  GRANT_CAP,
  GRANT_MAX,
  GRANT_MIN,
  GRANT_RATE,
  grantFor,
  grantForRange,
} from "../smeGrant";

/**
 * Regressionen zu Auditbefund D-04 und D-06.
 *
 * Die Grenzfälle stammen aus Abnahmetest T07: 2.999 / 3.000 / 25.000 / 25.001 /
 * 35.000 sowie die Spanne 2.200–3.800, die den Fehler ursprünglich sichtbar
 * gemacht hat.
 */
describe("Programmrahmen", () => {
  it("nennt 70 Prozent, 3.000 bis 25.000 und 17.500 als Maximum", () => {
    expect(GRANT_RATE).toBe(0.7);
    expect(GRANT_MIN).toBe(3_000);
    expect(GRANT_MAX).toBe(25_000);
    expect(GRANT_CAP).toBe(17_500);
  });
});

describe("grantFor, einzelner Betrag", () => {
  it("fördert 2.999 nicht", () => {
    expect(grantFor(2_999)).toMatchObject({ eligible: false, grant: 0 });
  });

  it("fördert ab genau 3.000", () => {
    expect(grantFor(3_000)).toMatchObject({ eligible: true, grant: 2_100, net: 900 });
  });

  it("erreicht bei 25.000 den Höchstzuschuss", () => {
    expect(grantFor(25_000)).toMatchObject({ grant: 17_500, net: 7_500 });
  });

  it("deckelt ab 25.001 den Zuschuss, der Rest bleibt Eigenanteil", () => {
    expect(grantFor(25_001).grant).toBe(GRANT_CAP);
    expect(grantFor(35_000)).toMatchObject({ grant: 17_500, net: 17_500 });
  });
});

describe("grantForRange, Preisspannen", () => {
  it("meldet eine Spanne komplett unter der Mindestgrenze als nicht förderfähig", () => {
    const r = grantForRange(1_800, 2_900);
    expect(r.status).toBe("below");
    expect(r.grantMax).toBe(0);
  });

  // Der eigentliche Auditbefund: hier entstand vorher netMin 660.
  it("bildet für 2.200 bis 3.800 keine Nettospanne", () => {
    const r = grantForRange(2_200, 3_800);
    expect(r.status).toBe("partial");
    expect(r.grantMin).toBe(0);
    expect(r.grantMax).toBe(0);
    expect(r.netMin).toBe(2_200);
    expect(r.threshold).toBe(3_000);
  });

  it("subventioniert einen nicht förderfähigen unteren Endpunkt nie", () => {
    for (const [min, max] of [[2_200, 3_800], [2_200, 3_550], [1, 3_000], [2_999, 26_000]]) {
      const r = grantForRange(min, max);
      expect(r.status).toBe("partial");
      expect(r.grantMin).toBe(0);
    }
  });

  it("rechnet eine Spanne innerhalb des Rahmens an beiden Enden", () => {
    const r = grantForRange(6_000, 12_000);
    expect(r).toMatchObject({
      status: "eligible",
      grantMin: 4_200,
      grantMax: 8_400,
      netMin: 1_800,
      netMax: 3_600,
      capped: false,
    });
  });

  it("markiert eine Spanne über der Obergrenze als gedeckelt", () => {
    const r = grantForRange(20_000, 40_000);
    expect(r.status).toBe("eligible");
    expect(r.grantMax).toBe(GRANT_CAP);
    expect(r.capped).toBe(true);
    expect(r.netMax).toBe(40_000 - GRANT_CAP);
  });

  it("behandelt die Mindestgrenze als eingeschlossen", () => {
    expect(grantForRange(3_000, 5_000).status).toBe("eligible");
    expect(grantForRange(2_999, 5_000).status).toBe("partial");
  });
});
