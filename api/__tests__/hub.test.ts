import { describe, expect, it } from "vitest";
import { priceLines, type CatalogItem } from "../_hub/agents";
import { ilikeTerm } from "../_hub/tools";
import { POST } from "../hub/agent";

const catalog: CatalogItem[] = [
  { id: "a", name: "Consulting", description: null, unit_price: 120, unit: "hour" },
  { id: "b", name: "Website", description: null, unit_price: 4800, unit: "project" },
  { id: "c", name: "Custom work", description: null, unit_price: null, unit: "item" },
];

describe("priceLines (proposal)", () => {
  it("prices from the catalogue only and totals the lines", () => {
    const r = priceLines(
      [
        { catalog_id: "a", quantity: 10, why: "workshop" },
        { catalog_id: "b", quantity: 1, why: "relaunch" },
      ],
      catalog,
    );
    expect(r.lines.map((l) => [l.name, l.unit_price, l.total])).toEqual([
      ["Consulting", 120, 1200],
      ["Website", 4800, 4800],
    ]);
    expect(r.total).toBe(6000);
  });

  it("drops ids that are not in the catalogue, and duplicates", () => {
    const r = priceLines(
      [
        { catalog_id: "made-up", quantity: 1, why: "" },
        { catalog_id: "a", quantity: 2, why: "" },
        { catalog_id: "a", quantity: 5, why: "" },
      ],
      catalog,
    );
    expect(r.lines.map((l) => [l.catalog_id, l.quantity])).toEqual([["a", 2]]);
  });

  it("leaves the total open when an item has no price", () => {
    const r = priceLines([{ catalog_id: "a", quantity: 1, why: "" }, { catalog_id: "c", quantity: 1, why: "" }], catalog);
    expect(r.lines[1].total).toBeNull();
    expect(r.total).toBeNull();
  });

  it("keeps quantities sensible", () => {
    const r = priceLines([{ catalog_id: "a", quantity: 0.1, why: "" }, { catalog_id: "b", quantity: 1e9, why: "" }], catalog);
    expect(r.lines.map((l) => l.quantity)).toEqual([0.25, 10000]);
  });
});

describe("ilikeTerm", () => {
  it("strips the characters that would change a PostgREST filter", () => {
    expect(ilikeTerm("a,b(c)*%_\\d")).toBe("%a b c     d%");
    expect(ilikeTerm("  Müller ")).toBe("%Müller%");
  });
});

describe("POST /api/hub/agent", () => {
  const call = (body: unknown, headers: Record<string, string> = {}) =>
    POST(new Request("https://x/api/hub/agent", { method: "POST", body: JSON.stringify(body), headers }));

  it("rejects an unknown agent before anything else", async () => {
    const r = await call({ agent: "rm -rf" });
    expect(r.status).toBe(400);
    expect(await r.json()).toEqual({ ok: false, error: "unknown-agent" });
  });

  it("answers 503 while the Hub's database is not configured", async () => {
    const r = await call({ agent: "copilot", workspace_id: crypto.randomUUID() }, { authorization: "Bearer x" });
    expect(r.status).toBe(503);
  });

  it("refuses oversized bodies", async () => {
    const r = await call({ agent: "copilot", pad: "x".repeat(70_000) });
    expect(r.status).toBe(413);
  });
});
