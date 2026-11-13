// The database as the signed-in user sees it.
//
// The browser sends its Supabase access token; we hand it straight back to
// Supabase on every query, so Row Level Security decides what the agents can
// read and write exactly as it does for the person. There is no privileged
// key on the server to leak or to misuse.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hubEnv } from "./env.js";

export interface HubSession {
  db: SupabaseClient;
  userId: string;
  email: string | null;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

export async function sessionFrom(req: Request): Promise<HubSession> {
  if (!hubEnv.supabaseUrl || !hubEnv.supabaseAnonKey) throw new HttpError(503, "hub-not-configured");
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new HttpError(401, "sign-in-required");

  const db = createClient(hubEnv.supabaseUrl, hubEnv.supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, "sign-in-required");
  return { db, userId: data.user.id, email: data.user.email ?? null };
}

/** The workspace, if the user belongs to it (RLS returns nothing otherwise). */
export async function workspaceFor(s: HubSession, workspaceId: string) {
  if (!isUuid(workspaceId)) throw new HttpError(400, "bad-workspace");
  const { data } = await s.db.from("workspaces").select("id, name, locale").eq("id", workspaceId).maybeSingle();
  if (!data) throw new HttpError(403, "not-a-member");
  return data as { id: string; name: string; locale: "en" | "fr" | "de" };
}

export const isUuid = (v: unknown): v is string =>
  typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

/** Calls left today for the agency; 0 when the limit is reached. */
export async function callsLeft(s: HubSession, workspaceId: string): Promise<number> {
  const { data, error } = await s.db.rpc("ai_calls_left", { ws: workspaceId });
  if (error) throw new HttpError(502, "database-error");
  return typeof data === "number" ? data : 0;
}

export async function recordRun(
  s: HubSession,
  run: { workspaceId: string; agent: string; model: string; input: number; output: number; ok: boolean },
) {
  // Best effort: a failed write here must not turn a good answer into an error.
  await s.db.from("ai_runs").insert({
    workspace_id: run.workspaceId,
    user_id: s.userId,
    agent: run.agent,
    model: run.model,
    input_tokens: run.input,
    output_tokens: run.output,
    ok: run.ok,
  });
}
