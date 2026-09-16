import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Regressionen zu Auditbefund D-07 und den Abnahmetests T03, T04 und T06.
 *
 * Der Endpunkt wird als Modul geladen und mit echten Request-Objekten
 * aufgerufen. Kein Netzwerk: fetch ist gestubbt, es geht keine Mail hinaus.
 */
const ORIGIN = { origin: "https://www.deev.lu" };

async function loadHandler() {
  vi.resetModules();
  const mod = await import("../lead");
  return mod.default;
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://www.deev.lu/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", ...ORIGIN, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid = { subject: "Test", replyto: "a@b.lu", name: "A", message: "Hallo" };

beforeEach(() => {
  (globalThis as Record<string, unknown>).process = { env: { RESEND_API_KEY: "re_test" } };
  // Resend antwortet mit Annahme, ohne dass etwas das Haus verlässt.
  vi.stubGlobal("fetch", vi.fn(async () =>
    new Response(JSON.stringify({ id: "msg_1" }), { status: 200 })));
});

describe("Zugang", () => {
  it("lehnt GET ab", async () => {
    const h = await loadHandler();
    const r = await h(new Request("https://www.deev.lu/api/lead", { method: "GET" }));
    expect(r.status).toBe(405);
  });

  it("antwortet 503, wenn kein Schlüssel konfiguriert ist", async () => {
    (globalThis as Record<string, unknown>).process = { env: {} };
    const h = await loadHandler();
    expect((await h(post(valid))).status).toBe(503);
  });
});

describe("Eingabeprüfung", () => {
  it("weist kaputtes JSON ab", async () => {
    const h = await loadHandler();
    expect((await h(post("{kaputt"))).status).toBe(400);
  });

  it("weist ein Array als Body ab", async () => {
    const h = await loadHandler();
    expect((await h(post([1, 2, 3]))).status).toBe(400);
  });

  it("weist einen übergroßen Body ab, ohne ihn zu parsen", async () => {
    const h = await loadHandler();
    const r = await h(post({ ...valid, message: "x".repeat(20_000) }));
    expect(r.status).toBe(413);
  });

  it("weist eine unplausible Absenderadresse ab", async () => {
    const h = await loadHandler();
    const r = await h(post({ ...valid, replyto: "keine-adresse" }));
    expect(r.status).toBe(422);
  });

  it("weist eine Anfrage ohne jeden Inhalt ab", async () => {
    const h = await loadHandler();
    const r = await h(post({ subject: "Nur Betreff", replyto: "a@b.lu" }));
    expect(r.status).toBe(422);
  });

  it("nimmt eine gültige Anfrage an", async () => {
    const h = await loadHandler();
    const r = await h(post(valid));
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ success: true });
  });
});

describe("Missbrauch", () => {
  it("verschluckt Botinput im Honeypot, ohne zu melden", async () => {
    const h = await loadHandler();
    const sent = globalThis.fetch as ReturnType<typeof vi.fn>;
    const r = await h(post({ ...valid, website_url: "http://spam.example" }));
    expect(r.status).toBe(200);
    expect(sent).not.toHaveBeenCalled();
  });

  it("begrenzt die Anzahl Anfragen je IP", async () => {
    const h = await loadHandler();
    const codes: number[] = [];
    for (let i = 0; i < 11; i++) {
      codes.push((await h(post(valid, { "x-forwarded-for": "5.5.5.5" }))).status);
    }
    expect(codes.filter((c) => c === 200).length).toBe(8);
    expect(codes.at(-1)).toBe(429);
  });
});

describe("Idempotenz, Auditbefund D-01 und Abnahme T04", () => {
  it("meldet denselben Schlüssel nur einmal", async () => {
    const h = await loadHandler();
    const sent = globalThis.fetch as ReturnType<typeof vi.fn>;
    const headers = { "Idempotency-Key": "abc-123" };

    const first = await h(post(valid, headers));
    const second = await h(post(valid, headers));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(await second.json()).toMatchObject({ duplicate: true });
    // Entscheidend: nur eine Benachrichtigung.
    expect(sent).toHaveBeenCalledTimes(1);
  });
});

describe("Fehler verraten nichts", () => {
  it("gibt bei Providerfehler keine Providerdetails zurück", async () => {
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({ message: "domain not verified", key: "re_live_secret" }), { status: 403 })));
    const h = await loadHandler();
    const r = await h(post(valid));
    const body = JSON.stringify(await r.json());
    expect(r.status).toBe(502);
    expect(body).not.toContain("re_live_secret");
    expect(body).not.toContain("domain not verified");
  });

  it("meldet einen Netzwerkabbruch als Zustellfehler", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("ECONNRESET at 10.0.0.1"); }));
    const h = await loadHandler();
    const r = await h(post(valid));
    expect(r.status).toBe(502);
    expect(JSON.stringify(await r.json())).not.toContain("10.0.0.1");
  });
});
