// Vercel Edge Function — emails form submissions to contact@deev.lu via Resend.
// Set RESEND_API_KEY in Vercel → Project → Settings → Environment Variables.
// The key stays server-side and is never exposed to the browser.

export const config = { runtime: "edge" };

const TO_EMAIL = "contact@deev.lu";
// Resend's shared sender works without domain verification (delivers to the
// account owner's address). Swap to "Deev <hello@deev.lu>" once deev.lu is
// verified in Resend for branded, send-to-anyone delivery.
const FROM_EMAIL = "Deev Website <onboarding@resend.dev>";

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

  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch {
    return json(400, { success: false, error: "bad-json" });
  }

  const { subject, replyto, from_name, ...rest } = payload as {
    subject?: string;
    replyto?: string;
    from_name?: string;
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
    if (!res.ok) return json(502, { success: false, error: data });
    return json(200, { success: true, id: (data as { id?: string }).id });
  } catch (e) {
    return json(502, { success: false, error: String(e) });
  }
}
