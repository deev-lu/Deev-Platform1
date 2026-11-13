import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Activity, CatalogItem, Contact, Deal, HubLang, Links, Member, Repo, Role, Stage, Task } from "./types";
import type { Workspace } from "./types";

/**
 * The Hub's own Supabase project (not the website's lead table). Set at build
 * time in Vercel: VITE_HUB_SUPABASE_URL and VITE_HUB_SUPABASE_ANON_KEY. The
 * anon key is public by design; Row Level Security is what protects the data.
 */
const url = import.meta.env.VITE_HUB_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_HUB_SUPABASE_ANON_KEY as string | undefined;

export const hubConfigured = Boolean(url && anon);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient {
  if (!hubConfigured) throw new Error("The Hub's database is not configured");
  client ??= createClient(url!, anon!, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "deev-hub-auth" },
  });
  return client;
}

/** A database error as the person should read it: our wording, not Postgres's. */
export class RepoError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
function check<T>(r: { data: T; error: { message: string; code?: string } | null }): T {
  if (r.error) {
    const m = r.error.message;
    if (/No Hub account/i.test(m)) throw new RepoError("no-account");
    if (/at least one owner/i.test(m)) throw new RepoError("last-owner");
    if (/Workspace limit/i.test(m)) throw new RepoError("workspace-limit");
    if (r.error.code === "42501" || /row-level security|permission/i.test(m)) throw new RepoError("forbidden");
    throw new RepoError("failed");
  }
  return r.data;
}

const DEAL_COLS = "*, contact:contacts(id, first_name, last_name, company, email, phone, language, kind)";

/** Strip what the app adds for display before writing a row back. */
function writable<T extends object>(row: T, drop: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) if (!drop.includes(k) && v !== undefined) out[k] = v;
  return out;
}

async function upsert(table: string, ws: string, row: { id?: string } & Record<string, unknown>): Promise<string> {
  const db = supabase();
  const { id, ...rest } = row;
  if (id) {
    check(await db.from(table).update(rest).eq("workspace_id", ws).eq("id", id));
    return id;
  }
  const data = check(await db.from(table).insert({ ...rest, workspace_id: ws }).select("id").single());
  return (data as { id: string }).id;
}

const ilike = (q: string) => `%${q.replace(/[%_\\,()*]/g, " ").trim()}%`;

export const supabaseRepo: Repo = {
  demo: false,

  async myWorkspaces() {
    const db = supabase();
    const { data: auth } = await db.auth.getUser();
    if (!auth.user) return [];
    const rows = check(
      await db
        .from("members")
        .select("role, workspace:workspaces(id, name, locale, plan, ai_daily_limit)")
        .eq("user_id", auth.user.id),
    ) as any[];
    return rows.filter((r) => r.workspace).map((r) => ({ ...r.workspace, role: r.role })) as Workspace[];
  },
  async createWorkspace(name, locale, ownerName) {
    return check(await supabase().rpc("create_workspace", { ws_name: name, ws_locale: locale, owner_name: ownerName })) as string;
  },
  async renameWorkspace(ws, name) {
    check(await supabase().from("workspaces").update({ name }).eq("id", ws));
  },
  async members(ws) {
    return check(await supabase().from("members").select("user_id, role, full_name, email").eq("workspace_id", ws).order("created_at")) as Member[];
  },
  async addMember(ws, email, role) {
    check(await supabase().rpc("add_member", { ws, member_email: email, member_role: role }));
  },
  async updateMemberRole(ws, userId, role: Role) {
    check(await supabase().from("members").update({ role }).eq("workspace_id", ws).eq("user_id", userId));
  },
  async removeMember(ws, userId) {
    check(await supabase().from("members").delete().eq("workspace_id", ws).eq("user_id", userId));
  },

  async stages(ws) {
    return check(await supabase().from("pipeline_stages").select("id, name, position, kind").eq("workspace_id", ws).order("position")) as Stage[];
  },
  async deals(ws) {
    return check(await supabase().from("deals").select(DEAL_COLS).eq("workspace_id", ws).order("last_activity_at", { ascending: false }).limit(1000)) as Deal[];
  },
  async deal(ws, id) {
    return check(await supabase().from("deals").select(DEAL_COLS).eq("workspace_id", ws).eq("id", id).maybeSingle()) as Deal | null;
  },
  async saveDeal(ws, deal) {
    return upsert("deals", ws, writable(deal, ["contact", "created_at", "last_activity_at"]));
  },
  async deleteDeal(ws, id) {
    check(await supabase().from("deals").delete().eq("workspace_id", ws).eq("id", id));
  },

  async contacts(ws, q) {
    let query = supabase().from("contacts").select("*").eq("workspace_id", ws);
    if (q?.trim()) {
      const t = ilike(q);
      query = query.or(`first_name.ilike.${t},last_name.ilike.${t},company.ilike.${t},email.ilike.${t},phone.ilike.${t}`);
    }
    return check(await query.order("created_at", { ascending: false }).limit(500)) as Contact[];
  },
  async contact(ws, id) {
    return check(await supabase().from("contacts").select("*").eq("workspace_id", ws).eq("id", id).maybeSingle()) as Contact | null;
  },
  async saveContact(ws, c) {
    return upsert("contacts", ws, writable(c, ["created_at"]));
  },
  async deleteContact(ws, id) {
    check(await supabase().from("contacts").delete().eq("workspace_id", ws).eq("id", id));
  },
  async dealsOfContact(ws, contactId) {
    return check(await supabase().from("deals").select(DEAL_COLS).eq("workspace_id", ws).eq("contact_id", contactId)) as Deal[];
  },

  async catalog(ws) {
    return check(await supabase().from("catalog_items").select("*").eq("workspace_id", ws).order("active", { ascending: false }).order("name").limit(500)) as CatalogItem[];
  },
  async saveCatalogItem(ws, item) {
    return upsert("catalog_items", ws, writable(item, ["created_at"]));
  },
  async deleteCatalogItem(ws, id) {
    check(await supabase().from("catalog_items").delete().eq("workspace_id", ws).eq("id", id));
  },

  async tasks(ws, opts = {}) {
    let q = supabase().from("tasks").select("*").eq("workspace_id", ws);
    if (opts.open) q = q.eq("done", false);
    if (opts.deal_id) q = q.eq("deal_id", opts.deal_id);
    if (opts.contact_id) q = q.eq("contact_id", opts.contact_id);
    return check(await q.order("done").order("due_at", { ascending: true, nullsFirst: false }).limit(500)) as Task[];
  },
  async saveTask(ws, t) {
    return upsert("tasks", ws, writable(t, ["created_at"]));
  },
  async deleteTask(ws, id) {
    check(await supabase().from("tasks").delete().eq("workspace_id", ws).eq("id", id));
  },

  async activities(ws, links: Links) {
    let q = supabase().from("activities").select("*").eq("workspace_id", ws);
    if (links.deal_id) q = q.eq("deal_id", links.deal_id);
    if (links.contact_id) q = q.eq("contact_id", links.contact_id);
    return check(await q.order("created_at", { ascending: false }).limit(100)) as Activity[];
  },
  async addActivity(ws, a) {
    check(await supabase().from("activities").insert({ ...a, workspace_id: ws }));
  },

  async aiUsage(ws) {
    const db = supabase();
    const left = check(await db.rpc("ai_calls_left", { ws })) as number;
    const w = check(await db.from("workspaces").select("ai_daily_limit").eq("id", ws).single()) as { ai_daily_limit: number };
    return { left, limit: w.ai_daily_limit, today: Math.max(0, w.ai_daily_limit - left) };
  },
};

export type { HubLang };
