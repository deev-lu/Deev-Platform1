// Vercel Edge Function — emails form submissions to contact@deev.lu via Resend.
// Set RESEND_API_KEY in Vercel → Project → Settings → Environment Variables.
// The key stays server-side and is never exposed to the browser.

export const config = { runtime: "edge" };

const TO_EMAIL = "contact@deev.lu";
// Resend's shared sender works without domain verification (delivers to the
// account owner's address). Swap to "Deev <hello@deev.lu>" once deev.lu is
// verified in Resend for branded, send-to-anyone delivery.
const FROM_EMAIL = "Deev Website <onboarding@resend.dev>";

/** Größter akzeptierter Request. Alles darüber ist kein Formular mehr. */
const MAX_BODY_BYTES = 16_000;
/** Pro Feld. Verhindert, dass ein Feld die Mail sprengt. */
const MAX_FIELD_CHARS = 5_000;

/**
 * Bereits gemeldete Anfrageschlüssel.
 *
 * Instanzlokal und damit nur eine Bremse, keine Sperre: Edge-Instanzen laufen
 * verteilt. Für den Zweck reicht es, denn der Fall ist der Doppelklick und der
 * Retry nach Zeitüberschreitung aus demselben Browser, nicht ein verteilter
 * Angriff. Eine dauerhafte Ablage steht in docs/CONTENT_GAPS.md als Blocker.
 */
const seen = new Map<string, number>();
const SEEN_TTL_MS = 30 * 60 * 1000;

/** Einfaches Zeitfenster pro IP. */
const hits = new Map<string, number[]>();
const RATE = { max: 8, windowMs: 10 * 60 * 1000 };

function withinRate(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE.windowMs)) hits.delete(k);
  }
  return recent.length <= RATE.max;
}

/** Grobe Form, nicht Zustellbarkeit. Die prüft erst der Mailserver. */
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const esc = (s: unknown) =>
  String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

export default async function handler(req: Request): Promise<Response> {
  const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    });

  if (req.method !== "POST") return json(405, { success: false, error: "method-not-allowed" });

  const apiKey = (globalThis as { process?: { env?: Record<string, string> } }).process?.env
    ?.RESEND_API_KEY;
  if (!apiKey) return json(503, { success: false, error: "not-configured" });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!withinRate(ip)) return json(429, { success: false, error: "rate-limited" });

  // Erst die Größe, dann parsen: ein 50-MB-Body soll nicht durch JSON.parse.
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { success: false, error: "too-large" });

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { success: false, error: "bad-json" });
  }
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return json(400, { success: false, error: "bad-json" });
  }

  // Idempotenz: derselbe Schlüssel meldet nicht zweimal. Die Antwort ist
  // bewusst ein Erfolg, denn die Anfrage liegt ja bereits vor.
  const key = req.headers.get("Idempotency-Key") ?? String(payload.request_id ?? "");
  if (key) {
    const now = Date.now();
    for (const [k, t] of seen) if (now - t > SEEN_TTL_MS) seen.delete(k);
    if (seen.has(key)) return json(200, { success: true, duplicate: true });
  }

  // Honeypot: ein ausgefülltes Feld, das kein Mensch sieht.
  if (typeof payload.website_url === "string" && payload.website_url.trim()) {
    return json(200, { success: true });
  }

  // Serverseitige Pflichtfelder. Das Formular prüft dasselbe, aber der
  // Endpunkt darf sich darauf nicht verlassen.
  const replyToRaw = typeof payload.replyto === "string" ? payload.replyto.trim() : "";
  if (replyToRaw && !looksLikeEmail(replyToRaw)) {
    return json(422, { success: false, error: "invalid-email" });
  }
  const hasContent = Object.entries(payload).some(
    ([k, v]) => !["subject", "from_name", "replyto", "request_id"].includes(k) && typeof v === "string" && v.trim(),
  );
  if (!hasContent) return json(422, { success: false, error: "empty" });

  // Überlange Felder kappen, statt die Anfrage zu verwerfen.
  for (const [k, v] of Object.entries(payload)) {
    if (typeof v === "string" && v.length > MAX_FIELD_CHARS) {
      payload[k] = v.slice(0, MAX_FIELD_CHARS) + " […]";
    }
  }

  const { subject, replyto, from_name, request_id, website_url, ...rest } = payload as {
    subject?: string;
    replyto?: string;
    from_name?: string;
    request_id?: string;
    website_url?: string;
    [k: string]: unknown;
  };

  const rows = Object.entries(rest)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#64748b;font-weight:600;white-space:nowrap;text-transform:capitalize;vertical-align:top">${esc(
          k.replace(/_/g, " ")
        )}</td><td style="padding:6px 0;color:#0f172a">${esc(v).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");

  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:560px">
    <h2 style="color:#0022FF;margin:0 0 12px">${esc(subject || "New submission")}</h2>
    <table style="border-collapse:collapse;font-size:14px;width:100%">${rows}</table>
    <p style="margin-top:20px;color:#94a3b8;font-size:12px">Sent from the deev.lu website.</p>
  </div>`;

  const body: Record<string, unknown> = {
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    subject: subject || "New submission from deev.lu",
    html,
  };
  if (from_name) body.from = `${from_name} via Deev <onboarding@resend.dev>`;
  if (replyto) body.reply_to = replyto;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    // Providerfehler nicht weiterreichen: er kann Kontodetails enthalten.
    if (!res.ok) return json(502, { success: false, error: "delivery-failed" });
    if (key) seen.set(key, Date.now());
    return json(200, { success: true, id: (data as { id?: string }).id });
  } catch (e) {
    return json(502, { success: false, error: "delivery-failed" });
  }
}
