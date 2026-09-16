// Vercel Edge Function — beantwortet, ob sich eine fremde Seite in einen
// Rahmen einbetten lässt.
//
// Der Hintergrund: die Fallstudienseiten zeigen die ausgelieferte Website in
// einem <iframe>. Ob das erlaubt ist, entscheidet die fremde Seite über zwei
// Kopfzeilen — `X-Frame-Options` und `Content-Security-Policy:
// frame-ancestors`. Verbietet sie es, zeigt der Browser eine graue
// Fehlerseite, und dagegen gibt es im Browser kein Mittel: der Rahmen meldet
// trotzdem "geladen", und der Inhalt ist nicht auslesbar. Geraten werden kann
// also nicht, gemessen schon — aber nur von einem Server aus, den die
// Regeln des Browsers nicht binden.
//
// Deshalb diese Funktion. Die Seite fragt hier nach, bevor sie einen Rahmen
// überhaupt anbietet. Sagt die Antwort nein, führt die Schaltfläche in einen
// neuen Tab statt in eine graue Fläche.

export const config = { runtime: "edge" };

/**
 * Nur die Adressen aus dem Portfolio dürfen geprüft werden.
 *
 * Abgeleitet aus den Projektdaten statt von Hand gepflegt: eine feste Liste
 * hätte bei jedem neuen Projekt nachgezogen werden müssen, und wer das
 * vergisst, bekommt ein Projekt ohne Live-Vorschau ohne zu wissen warum.
 *
 * Ohne diese Grenze wäre die Funktion ein offener Anfrageweiterleiter, mit
 * dem sich von unserer Domain aus beliebige Adressen abklopfen ließen.
 */
import projects from "../src/lib/projects.data.json";

const ALLOWED_HOSTS = new Set(
  (projects as { link?: string }[])
    .map((p) => {
      try {
        return p.link ? new URL(p.link).hostname.replace(/^www\./, "") : null;
      } catch {
        return null;
      }
    })
    .filter((h): h is string => h !== null),
);

const TIMEOUT_MS = 6_000;
/** Antworten kurz halten: die Kopfzeilen ändern sich selten. */
const CACHE = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": CACHE },
  });
}

/**
 * Liest die beiden Kopfzeilen, die das Einbetten verbieten können.
 *
 * `X-Frame-Options` kennt DENY und SAMEORIGIN; beides schließt uns aus, denn
 * wir sind nie dieselbe Herkunft. `frame-ancestors` ist die neuere Regel und
 * sticht die ältere — steht dort 'none', ist es verboten; steht dort eine
 * Liste, müsste unsere Domain darin vorkommen, und das tut sie bei fremden
 * Seiten praktisch nie.
 */
export function blockedBy(headers: {
  xfo?: string | null;
  csp?: string | null;
}): string | null {
  const csp = (headers.csp ?? "").toLowerCase();
  const fa = csp.match(/frame-ancestors([^;]*)/);
  if (fa) {
    const list = fa[1].trim();
    if (!list || list === "'none'") return "frame-ancestors";
    if (!/\bdeev\.lu\b|\*(?!\.)/.test(list)) return "frame-ancestors";
    return null; // erlaubt uns ausdrücklich
  }

  const xfo = (headers.xfo ?? "").trim().toLowerCase();
  if (xfo === "deny" || xfo === "sameorigin") return "x-frame-options";
  if (xfo.startsWith("allow-from")) return "x-frame-options";
  return null;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") return json({ error: "method" }, 405);

  const target = new URL(req.url).searchParams.get("url");
  if (!target) return json({ error: "url" }, 400);

  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return json({ error: "url" }, 400);
  }
  if (url.protocol !== "https:") return json({ error: "scheme" }, 400);

  // Ohne diese Liste wäre die Funktion ein offener Anfrageweiterleiter, mit
  // dem sich von unserer Domain aus beliebige Adressen abklopfen ließen.
  const host = url.hostname.replace(/^www\./, "");
  if (!ALLOWED_HOSTS.has(host)) return json({ error: "host" }, 403);

  const stop = AbortSignal.timeout(TIMEOUT_MS);
  try {
    // GET statt HEAD: manche Server beantworten HEAD anders oder gar nicht,
    // und dann fehlen genau die Kopfzeilen, um die es geht.
    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: stop,
      headers: { "user-agent": "DeevPortfolioBot/1.0 (+https://www.deev.lu)" },
    });
    const reason = blockedBy({
      xfo: res.headers.get("x-frame-options"),
      csp: res.headers.get("content-security-policy"),
    });
    return json({ embeddable: reason === null, reason, status: res.status });
  } catch {
    // Nicht erreichbar heißt nicht "verboten", aber anbieten wollen wir es
    // dann auch nicht.
    return json({ embeddable: false, reason: "unreachable" });
  }
}
