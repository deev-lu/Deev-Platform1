import type { HubLang } from "./types";

/**
 * The answer of POST /api/hub/agent: `data` when ok, `error` (a code) when
 * not. One flat shape, because the app compiles without strict null checks
 * and a union would not narrow on `ok`.
 */
export interface AgentReply<T> {
  ok: boolean;
  data?: T;
  error?: string;
  calls_left?: number;
}

export async function callAgent<T>(
  token: string | null,
  body: { agent: "copilot" | "deal_brief" | "proposal" | "email"; workspace_id: string; lang: HubLang } & Record<string, unknown>,
): Promise<AgentReply<T>> {
  if (!token) return { ok: false, error: "sign-in-required" };
  try {
    const r = await fetch("/api/hub/agent", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const json = await r.json().catch(() => null);
    if (!json || typeof json !== "object") return { ok: false, error: r.ok ? "bad-reply" : `http-${r.status}` };
    const reply = json as AgentReply<T>;
    return reply.ok ? reply : { ok: false, error: reply.error ?? `http-${r.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}

/** Which sentence of the dictionary explains an agent error. */
export function agentErrorKey(code: string): "limit" | "notConfigured" | "declined" | "failed" | "forbidden" {
  if (code === "daily-ai-limit") return "limit";
  if (code === "ai-not-configured" || code === "hub-not-configured") return "notConfigured";
  if (code === "ai-declined") return "declined";
  if (code === "not-a-member" || code === "sign-in-required") return "forbidden";
  return "failed";
}
