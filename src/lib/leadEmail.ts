// ── Lead email delivery ──────────────────────────────────────────────────────
// Posts submissions to our own Vercel function (/api/lead), which emails them
// to contact@deev.lu via Resend. The API key lives server-side only.

/**
 * Send a submission by email. Returns true on success.
 * Pass neutral keys: subject, from_name, replyto, plus any data fields.
 */
export async function sendLeadEmail(
  fields: Record<string, unknown>
): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(fields),
    });
    const data = await res.json().catch(() => ({ success: false }));
    return data.success === true;
  } catch {
    return false;
  }
}
