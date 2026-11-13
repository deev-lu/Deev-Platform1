import { describe, expect, it } from "vitest";
import { prefilter, type Candidate } from "../_hub/agents";
import { ilikeTerm } from "../_hub/tools";
import { POST } from "../hub/agent";

const prop = (over: Partial<Candidate>): Candidate => ({
  id: crypto.randomUUID(),
  title: "Apartment",
  kind: "apartment",
  deal: "sale",
  status: "available",
  price: 600000,
  surface_m2: 80,
  bedrooms: 2,
  city: "Strassen",
  postcode: "8010",
  energy_class: "B",
  features: [],
  ...over,
});

describe("prefilter (matching shortlist)", () => {
  const lead = { intent: "buy", budget_min: 450000, budget_max: 650000, locations: ["Strassen"], property_kinds: ["apartment"], min_bedrooms: 2 };

  it("keeps only available listings of the right deal, kind, budget and size", () => {
    const keep = prop({ title: "keep" });
    const list = [
      keep,
      prop({ title: "sold", status: "sold" }),
      prop({ title: "rent", deal: "rent" }),
      prop({ title: "house", kind: "house" }),
      prop({ title: "too dear", price: 800000 }),
      prop({ title: "too cheap", price: 200000 }),
      prop({ title: "one bed", bedrooms: 1 }),
    ];
    expect(prefilter(lead, list).map((p) => p.title)).toEqual(["keep"]);
  });

  it("allows 10% over budget and ranks the wanted town first", () => {
    const elsewhere = prop({ title: "elsewhere", city: "Ettelbruck", postcode: "9010" });
    const stretch = prop({ title: "stretch", price: 700000 });
    const ranked = prefilter(lead, [elsewhere, stretch]).map((p) => p.title);
    expect(ranked).toEqual(["stretch", "elsewhere"]);
  });

  it("has nothing to match for sellers and landlords", () => {
    expect(prefilter({ ...lead, intent: "sell" }, [prop({})])).toEqual([]);
    expect(prefilter({ ...lead, intent: "let" }, [prop({})])).toEqual([]);
  });

  it("matches tenants against rentals", () => {
    const rental = prop({ deal: "rent", price: 2200 });
    expect(prefilter({ intent: "rent", budget_max: 2500 }, [rental, prop({})])).toHaveLength(1);
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
