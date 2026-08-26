// ── The site assistant ──────────────────────────────────────────────────────
//
// Streams an answer from Claude, grounded in api/_context.ts.
//
// Set ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables.
// Like RESEND_API_KEY it stays server-side: the browser talks to this function,
// never to Anthropic, so the key is never in a bundle, a network tab or a
// source map. Without the key this route answers 503 and the widget does not
// render, which is how the feature ships dark until someone decides otherwise.
//
// What stops this becoming a bill or a liability:
//
//   Spend        Hard caps on everything that costs money: message length,
//                how much history is replayed, output tokens, and how many
//                messages one visitor may send. Set a monthly limit in the
//                Anthropic console as well; that is the only backstop that
//                cannot be reasoned around by code with a bug in it.
//   Abuse        Same-origin only, POST only, and a per-IP window. The window
//                is per instance and therefore best-effort (see LIMIT below):
//                Vercel's firewall is the durable one.
//   Injection    The assistant has no tools. There is nothing to hijack: it
//                cannot send mail, write a file, read a database or call
//                another service. The worst a crafted message achieves is a
//                rude paragraph, and the system prompt is told to expect the
//                attempt.
//   Privacy      Nothing is logged. No transcript, no IP, no identifier is
//                written down or kept. What the visitor typed goes to
//                Anthropic to be answered and is not retained here.
//
// Anthropic is a processor for this feature and inference runs outside the EU.
// That belongs in the privacy policy, and the widget says so before the first
// message.

import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "./_context";

export const config = { runtime: "edge" };

const MODEL = "claude-opus-5";

/** Enough for a paragraph and a link. A chat window is not an essay. */
const MAX_TOKENS = 700;
/** One question. Longer than this is a document, and documents go to email. */
const MAX_CHARS = 1200;
/** Six exchanges of context. Older turns fall off the front. */
const MAX_TURNS = 12;

/**
 * Per-IP window, held in the instance's memory.
 *
 * Edge functions are spread across regions and recycled, so this is a speed
 * bump rather than a lock: a determined caller who reaches several instances
 * gets several windows. It is here because it costs nothing and stops the
 * ordinary case, a stuck loop or someone holding down enter. The durable limit
 * belongs in Vercel's firewall, on this path, where it sees every request.
 */
const LIMIT = { max: 20, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function withinLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  // The map would otherwise grow for the lifetime of the instance.
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < LIMIT.windowMs)) hits.delete(k);
  return recent.length <= LIMIT.max;
}

const ALLOWED_HOSTS = new Set(["www.deev.lu", "deev.lu", "localhost", "127.0.0.1"]);

/** Same-origin, or a Vercel preview of this project. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return ALLOWED_HOSTS.has(hostname) || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

const LOCALES = new Set(["en", "fr", "de"]);

interface Turn {
  role: "user" | "assistant";
  content: string;
}

/** Accept only the shape we expect, and only as much of it as we allow. */
function readTurns(value: unknown): Turn[] | null {
  if (!Array.isArray(value)) return null;
  const turns: Turn[] = [];
  for (const raw of value.slice(-MAX_TURNS)) {
    const t = raw as { role?: unknown; content?: unknown };
    if (t.role !== "user" && t.role !== "assistant") return null;
    if (typeof t.content !== "string") return null;
    const content = t.content.slice(0, MAX_CHARS).trim();
    if (content) turns.push({ role: t.role, content });
  }
  // The API requires the conversation to start with the visitor and to end
  // with the message being answered.
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return turns;
}

export default async function handler(req: Request): Promise<Response> {
  const fail = (status: number, error: string) =>
    new Response(JSON.stringify({ error }), {
      status,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });

  if (req.method !== "POST") return fail(405, "method-not-allowed");
  if (!sameOrigin(req)) return fail(403, "forbidden");

  const apiKey = (globalThis as { process?: { env?: Record<string, string> } }).process?.env
    ?.ANTHROPIC_API_KEY;
  if (!apiKey) return fail(503, "not-configured");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!withinLimit(ip)) return fail(429, "rate-limited");

  let body: { messages?: unknown; locale?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail(400, "bad-json");
  }

  const turns = readTurns(body.messages);
  if (!turns) return fail(400, "bad-messages");
  const locale = LOCALES.has(body.locale as string) ? (body.locale as "en" | "fr" | "de") : "en";

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(
          new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );

      try {
        const run = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          // Low effort, thinking left on its default. A short grounded answer
          // does not need deep reasoning, and disabling thinking outright on
          // this model has its own failure modes.
          output_config: { effort: "low" },
          system: [
            {
              type: "text",
              text: systemPrompt(locale),
              // The prompt is identical for every visitor in a language, so it
              // is read from cache rather than re-sent: a tenth of the price,
              // and the hour keeps it warm through a quiet afternoon.
              cache_control: { type: "ephemeral", ttl: "1h" },
            },
          ],
          messages: turns,
        });

        for await (const event of run) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta" &&
            event.delta.text
          ) {
            send("delta", { text: event.delta.text });
          }
        }

        const final = await run.finalMessage();
        // The model may decline. Say so plainly rather than ending on silence.
        if (final.stop_reason === "refusal") send("error", { error: "refused" });
        send("done", { stop: final.stop_reason });
      } catch (e) {
        const status = e instanceof Anthropic.APIError ? e.status : 0;
        // Never relay the upstream message: it can carry request detail, and
        // the widget only needs to know which sentence to show.
        send("error", { error: status === 429 ? "busy" : "upstream" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store",
      connection: "keep-alive",
      "x-content-type-options": "nosniff",
    },
  });
}
