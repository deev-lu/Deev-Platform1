// POST /api/hub/agent — the one door to the Business Hub's AI agents.
//
// Body: { agent, workspace_id, lang?, ...agent input } with the user's Supabase
// access token as `Authorization: Bearer`. The order of checks is the point:
// signed in → member of the workspace → calls left today → run → count it.
// Nothing reaches Claude for a visitor, a stranger to the company, or a
// company over its daily limit.

import Anthropic from "@anthropic-ai/sdk";
import { HttpError, callsLeft, recordRun, sessionFrom, workspaceFor } from "../_hub/db.js";
import { runCopilot, runDealBrief, runEmail, runProposal, type AgentResult, type Lang } from "../_hub/agents.js";

const MAX_BODY = 64_000;
const AGENTS = ["copilot", "deal_brief", "proposal", "email"] as const;
type AgentName = (typeof AGENTS)[number];

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export async function POST(req: Request): Promise<Response> {
  let agent: AgentName | null = null;
  let session: Awaited<ReturnType<typeof sessionFrom>> | null = null;
  let workspaceId = "";
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) throw new HttpError(413, "too-large");
    let body: any;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new HttpError(400, "bad-json");
    }
    if (!body || typeof body !== "object" || !AGENTS.includes(body.agent)) throw new HttpError(400, "unknown-agent");
    agent = body.agent as AgentName;
    const lang: Lang = ["en", "fr", "de"].includes(body.lang) ? body.lang : "en";

    session = await sessionFrom(req);
    const ws = await workspaceFor(session, body.workspace_id);
    workspaceId = ws.id;
    const left = await callsLeft(session, ws.id);
    if (left <= 0) throw new HttpError(429, "daily-ai-limit");

    let result: AgentResult;
    switch (agent) {
      case "copilot":
        result = await runCopilot(session, ws, { messages: body.messages, lang });
        break;
      case "deal_brief":
        result = await runDealBrief(session, ws, body, lang);
        break;
      case "proposal":
        result = await runProposal(session, ws, body, lang);
        break;
      case "email":
        result = await runEmail(session, ws, body, lang);
        break;
    }
    await recordRun(session, {
      workspaceId: ws.id,
      agent,
      model: result.model,
      input: result.usage.input,
      output: result.usage.output,
      ok: true,
    });
    return json(200, { ok: true, data: result.data, calls_left: Math.max(0, left - 1) });
  } catch (err) {
    if (err instanceof HttpError) return json(err.status, { ok: false, error: err.code });
    // A failed call still counts against the day: retries cost real money.
    if (session && workspaceId && agent) {
      await recordRun(session, { workspaceId, agent, model: "", input: 0, output: 0, ok: false }).catch(() => {});
    }
    if (err instanceof Anthropic.RateLimitError) return json(503, { ok: false, error: "ai-busy" });
    if (err instanceof Anthropic.APIError) return json(502, { ok: false, error: "ai-error" });
    console.error("hub agent failed", err);
    return json(500, { ok: false, error: "server-error" });
  }
}
