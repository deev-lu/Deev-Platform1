// What the Hub copilot can do in the CRM, as tools for Claude.
//
// Every tool runs as the signed-in user (db.ts), so it sees one company and
// nothing else. Reads return compact JSON; the two writes (a task, a note)
// are small, reversible and reported back to the person in the reply and in
// `actions`, so the app can refresh what changed.

import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { HubSession } from "./db.js";

export interface ToolAction {
  type: "task" | "note";
  id: string;
  label: string;
}

const LIMIT = 25;
const json = (v: unknown) => JSON.stringify(v);
const uuid = z.string().uuid();

/** Words a person types, safe for a PostgREST ilike filter. */
export function ilikeTerm(q: string): string {
  return `%${q.replace(/[%_\\,()*]/g, " ").trim().slice(0, 80)}%`;
}

export function crmTools(s: HubSession, workspaceId: string, actions: ToolAction[]) {
  const ws = (q: any) => q.eq("workspace_id", workspaceId);

  const searchContacts = betaZodTool({
    name: "search_contacts",
    description:
      "Find the company's contacts (leads, customers, partners, suppliers) by name, company, email or phone. Returns up to 25, newest first. Use an empty query to list recent contacts.",
    inputSchema: z.object({
      query: z.string().max(80).describe("Part of a name, company, email or phone number; empty for recent contacts"),
      kind: z.enum(["lead", "customer", "partner", "supplier", "other"]).optional(),
    }),
    run: async ({ query, kind }) => {
      let q = ws(s.db.from("contacts").select("id, first_name, last_name, company, job_title, email, phone, kind, language, created_at"));
      if (query.trim()) {
        const t = ilikeTerm(query);
        q = q.or(`first_name.ilike.${t},last_name.ilike.${t},company.ilike.${t},email.ilike.${t},phone.ilike.${t}`);
      }
      if (kind) q = q.eq("kind", kind);
      const { data, error } = await q.order("created_at", { ascending: false }).limit(LIMIT);
      if (error) throw new Error("Could not read contacts");
      return json(data);
    },
  });

  const listDeals = betaZodTool({
    name: "list_deals",
    description:
      "List the company's deals with their contact, pipeline stage, value (EUR), expected close date and AI score. Filter by stage name, or to deals with no activity for a number of days. Returns up to 25, most recently active first.",
    inputSchema: z.object({
      stage: z.string().max(60).optional().describe("Pipeline stage name, e.g. 'Proposal'"),
      idle_days: z.number().int().min(1).max(365).optional().describe("Only deals with no activity for at least this many days"),
    }),
    run: async ({ stage, idle_days }) => {
      let q = ws(
        s.db
          .from("deals")
          .select(
            "id, title, value, expected_close, score, last_activity_at, stage:pipeline_stages(name, kind), contact:contacts(id, first_name, last_name, company, email, phone)",
          ),
      );
      if (idle_days) q = q.lt("last_activity_at", new Date(Date.now() - idle_days * 86_400_000).toISOString());
      const { data, error } = await q.order("last_activity_at", { ascending: false }).limit(100);
      if (error) throw new Error("Could not read deals");
      const rows = (data ?? []).filter((d: any) => !stage || d.stage?.name?.toLowerCase() === stage.toLowerCase());
      return json(rows.slice(0, LIMIT));
    },
  });

  const getDeal = betaZodTool({
    name: "get_deal",
    description: "Everything about one deal: the contact, what they need, value, stage, notes, the last 20 timeline entries and open tasks.",
    inputSchema: z.object({ deal_id: uuid }),
    run: async ({ deal_id }) => {
      const { data: deal } = await ws(s.db.from("deals").select("*, stage:pipeline_stages(name, kind), contact:contacts(*)"))
        .eq("id", deal_id)
        .maybeSingle();
      if (!deal) return "No deal with that id in this company.";
      const [{ data: acts }, { data: tasks }] = await Promise.all([
        ws(s.db.from("activities").select("kind, body, created_at")).eq("deal_id", deal_id).order("created_at", { ascending: false }).limit(20),
        ws(s.db.from("tasks").select("id, title, due_at, done")).eq("deal_id", deal_id).eq("done", false).limit(20),
      ]);
      return json({ deal, timeline: acts, open_tasks: tasks });
    },
  });

  const searchCatalog = betaZodTool({
    name: "search_catalog",
    description: "The company's products and services with their unit prices (EUR, excluding VAT). Optionally filter by part of the name.",
    inputSchema: z.object({ text: z.string().max(80).optional() }),
    run: async ({ text }) => {
      let q = ws(s.db.from("catalog_items").select("id, name, description, unit_price, unit")).eq("active", true);
      if (text?.trim()) q = q.ilike("name", ilikeTerm(text));
      const { data, error } = await q.order("name").limit(50);
      if (error) throw new Error("Could not read the catalogue");
      return json(data);
    },
  });

  const listTasks = betaZodTool({
    name: "list_tasks",
    description: "Open tasks of the company, soonest due first. Optionally only those due before a date.",
    inputSchema: z.object({
      due_before: z.string().optional().describe("ISO date, e.g. 2026-11-20"),
      include_done: z.boolean().optional(),
    }),
    run: async ({ due_before, include_done }) => {
      let q = ws(s.db.from("tasks").select("id, title, due_at, done, deal_id, contact_id"));
      if (!include_done) q = q.eq("done", false);
      if (due_before && !Number.isNaN(Date.parse(due_before))) q = q.lte("due_at", new Date(due_before).toISOString());
      const { data, error } = await q.order("due_at", { ascending: true, nullsFirst: false }).limit(LIMIT);
      if (error) throw new Error("Could not read tasks");
      return json(data);
    },
  });

  const createTask = betaZodTool({
    name: "create_task",
    description:
      "Create a follow-up task in the CRM, optionally linked to a deal or a contact. Only do this when the person asks for a task or reminder, or agrees to one you proposed.",
    inputSchema: z.object({
      title: z.string().min(1).max(200),
      due_at: z.string().optional().describe("ISO date-time, e.g. 2026-11-20T09:00:00+01:00"),
      deal_id: uuid.optional(),
      contact_id: uuid.optional(),
    }),
    run: async (t) => {
      const due = t.due_at && !Number.isNaN(Date.parse(t.due_at)) ? new Date(t.due_at).toISOString() : null;
      const { data, error } = await s.db
        .from("tasks")
        .insert({
          workspace_id: workspaceId,
          title: t.title,
          due_at: due,
          deal_id: t.deal_id ?? null,
          contact_id: t.contact_id ?? null,
          assigned_to: s.userId,
          created_by: s.userId,
        })
        .select("id")
        .single();
      if (error || !data) return "The task could not be created (check that the linked record belongs to this company).";
      actions.push({ type: "task", id: data.id, label: t.title });
      return json({ created: data.id });
    },
  });

  const addNote = betaZodTool({
    name: "add_note",
    description: "Add a note to the timeline of a deal or a contact. Only when the person asks you to note or log something.",
    inputSchema: z.object({
      body: z.string().min(1).max(4000),
      deal_id: uuid.optional(),
      contact_id: uuid.optional(),
    }),
    run: async (n) => {
      if (!n.deal_id && !n.contact_id) return "Say which deal or contact the note belongs to.";
      const { data, error } = await s.db
        .from("activities")
        .insert({
          workspace_id: workspaceId,
          kind: "note",
          body: n.body,
          deal_id: n.deal_id ?? null,
          contact_id: n.contact_id ?? null,
          created_by: s.userId,
        })
        .select("id")
        .single();
      if (error || !data) return "The note could not be saved.";
      actions.push({ type: "note", id: data.id, label: n.body.slice(0, 80) });
      return json({ created: data.id });
    },
  });

  return [searchContacts, listDeals, getDeal, searchCatalog, listTasks, createTask, addNote];
}
