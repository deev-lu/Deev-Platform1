// ── Anfrageübermittlung ─────────────────────────────────────────────────────
//
// Schickt Formulareingaben an unsere eigene Vercel-Funktion (/api/lead), die
// sie per Resend an contact@deev.lu meldet. Der API-Schlüssel bleibt
// serverseitig.
//
// Warum ein Ergebnisobjekt statt eines Booleans: Der Simulator hat den
// Rückgabewert früher ignoriert und nach einem fehlgeschlagenen Versand den
// Erfolgsschritt gezeigt (Auditbefund D-01). Ein Boolean lädt dazu ein, weil
// `await senden(...)` ohne Zuweisung wie erledigte Arbeit aussieht. Ein Typ mit
// `status` muss ausgewertet werden, sonst ist die Anzeige nicht formulierbar.
//
// Was hier ehrlich bleibt: Wir haben keine dauerhafte Datenhaltung. „Angenommen"
// heißt deshalb genau das, was es heißt: die Benachrichtigung wurde vom
// Zustelldienst angenommen. Es heißt nicht „in einem CRM gespeichert" und nicht
// „im Postfach zugestellt". Siehe docs/CONTENT_GAPS.md.

export type LeadStatus =
  /** Die Benachrichtigung wurde angenommen. */
  | "accepted"
  /** Der Server hat die Eingaben abgelehnt. */
  | "invalid"
  /** Zu viele Versuche. */
  | "rate-limited"
  /** Der Endpunkt ist nicht konfiguriert. */
  | "unconfigured"
  /** Netzwerk weg, Abbruch oder Zeitüberschreitung. */
  | "offline"
  /** Alles andere, inklusive Providerfehler. */
  | "failed";

export interface LeadResult {
  status: LeadStatus;
  /** Wahr nur bei `accepted`. Zum Verzweigen in der Oberfläche. */
  ok: boolean;
  /**
   * Der Schlüssel, unter dem dieser Versuch lief. Ein erneuter Versuch mit
   * demselben Schlüssel darf keine zweite Anfrage erzeugen.
   */
  requestId: string;
}

/** Zufällig, und ohne Rückschluss auf die Person. */
export function newRequestId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

/** Nach dieser Zeit gilt der Versuch als gescheitert, statt ewig zu hängen. */
const TIMEOUT_MS = 15_000;

export async function sendLead(
  fields: Record<string, unknown>,
  requestId: string,
): Promise<LeadResult> {
  const done = (status: LeadStatus): LeadResult => ({
    status,
    ok: status === "accepted",
    requestId,
  });

  // AbortSignal.timeout gibt es nicht überall; der Controller schon.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Der Server weist einen bereits gesehenen Schlüssel ab, statt ein
        // zweites Mal zu melden.
        "Idempotency-Key": requestId,
      },
      body: JSON.stringify({ ...fields, request_id: requestId }),
      signal: controller.signal,
    });

    if (res.status === 429) return done("rate-limited");
    if (res.status === 503) return done("unconfigured");
    if (res.status === 400 || res.status === 422) return done("invalid");

    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    return done(res.ok && data.success === true ? "accepted" : "failed");
  } catch (e) {
    // Abbruch durch das Zeitlimit oder keine Verbindung.
    const offline =
      (e as Error)?.name === "AbortError" ||
      (typeof navigator !== "undefined" && navigator.onLine === false);
    return done(offline ? "offline" : "failed");
  } finally {
    clearTimeout(timer);
  }
}
