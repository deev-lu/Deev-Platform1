// What the Hub copilot can do in the CRM, as tools for Claude.
//
// Every tool runs as the signed-in user (db.ts), so it sees one agency and
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
      "Find contacts (buyers, sellers, tenants, landlords, investors) of the agency by name, email or phone. Returns up to 25, newest first. Use an empty query to list recent contacts.",
    inputSchema: z.object({
      query: z.string().max(80).describe("Part of a name, email or phone number; empty for recent contacts"),
      kind: z.enum(["buyer", "seller", "tenant", "landlord", "investor", "other"]).optional(),
    }),
    run: async ({ query, kind }) => {
      let q = ws(s.db.from("contacts").select("id, first_name, last_name, email, phone, kind, language, created_at"));
      if (query.trim()) {
        const t = ilikeTerm(query);
        q = q.or(`first_name.ilike.${t},last_name.ilike.${t},email.ilike.${t},phone.ilike.${t}`);
      }
      if (kind) q = q.eq("kind", kind);
      const { data, error } = await q.order("created_at", { ascending: false }).limit(LIMIT);
      if (error) throw new Error("Could not read contacts");
      return json(data);
    },
  });

  const listLeads = betaZodTool({
    name: "list_leads",
    description:
      "List the agency's leads with their contact, pipeline stage, budget, wanted locations and AI score. Filter by stage name, by intent, or to leads with no activity for a number of days. Returns up to 25, most recently active first.",
    inputSchema: z.object({
      stage: z.string().max(60).optional().describe("Pipeline stage name, e.g. 'Viewing'"),
      intent: z.enum(["buy", "rent", "sell", "let", "invest"]).optional(),
      idle_days: z.number().int().min(1).max(365).optional().describe("Only leads with no activity for at least this many days"),
    }),
    run: async ({ stage, intent, idle_days }) => {
      let q = ws(
        s.db
          .from("leads")
          .select(
            "id, intent, budget_min, budget_max, locations, property_kinds, min_bedrooms, timeline, score, last_activity_at, stage:pipeline_stages(name, kind), contact:contacts(id, first_name, last_name, email, phone)",
          ),
      );
      if (intent) q = q.eq("intent", intent);
      if (idle_days) q = q.lt("last_activity_at", new Date(Date.now() - idle_days * 86_400_000).toISOString());
      const { data, error } = await q.order("last_activity_at", { ascending: false }).limit(100);
      if (error) throw new Error("Could not read leads");
      const rows = (data ?? []).filter((l: any) => !stage || l.stage?.name?.toLowerCase() === stage.toLowerCase());
      return json(rows.slice(0, LIMIT));
    },
  });

  const getLead = betaZodTool({
    name: "get_lead",
    description:
      "Everything about one lead: the contact, criteria, stage, notes, the last 20 timeline entries and open tasks.",
    inputSchema: z.object({ lead_id: uuid }),
    run: async ({ lead_id }) => {
      const { data: lead } = await ws(
        s.db
          .from("leads")
          .select("*, stage:pipeline_stages(name, kind), contact:contacts(*), property:properties(id, title, price, city)"),
      )
        .eq("id", lead_id)
        .maybeSingle();
      if (!lead) return "No lead with that id in this agency.";
      const [{ data: acts }, { data: tasks }] = await Promise.all([
        ws(s.db.from("activities").select("kind, body, created_at")).eq("lead_id", lead_id).order("created_at", { ascending: false }).limit(20),
        ws(s.db.from("tasks").select("id, title, due_at, done")).eq("lead_id", lead_id).eq("done", false).limit(20),
      ]);
      return json({ lead, timeline: acts, open_tasks: tasks });
    },
  });

  const searchProperties = betaZodTool({
    name: "search_properties",
    description:
      "Search the agency's listings. All filters are optional. Prices are in EUR, surfaces in m². Returns up to 25.",
    inputSchema: z.object({
      deal: z.enum(["sale", "rent"]).optional(),
      kind: z.enum(["apartment", "house", "land", "commercial", "office", "parking", "other"]).optional(),
      status: z.enum(["draft", "available", "under_offer", "sold", "rented", "withdrawn"]).optional(),
      city: z.string().max(80).optional(),
      max_price: z.number().nonnegative().optional(),
      min_bedrooms: z.number().int().min(0).max(50).optional(),
      text: z.string().max(80).optional().describe("Part of the title or reference"),
    }),
    run: async (f) => {
      let q = ws(
        s.db
          .from("properties")
          .select("id, reference, title, kind, deal, status, price, surface_m2, bedrooms, city, postcode, energy_class, features"),
      );
      if (f.deal) q = q.eq("deal", f.deal);
      if (f.kind) q = q.eq("kind", f.kind);
      if (f.status) q = q.eq("status", f.status);
      if (f.city) q = q.ilike("city", ilikeTerm(f.city));
      if (f.max_price != null) q = q.lte("price", f.max_price);
      if (f.min_bedrooms != null) q = q.gte("bedrooms", f.min_bedrooms);
      if (f.text) {
        const t = ilikeTerm(f.text);
        q = q.or(`title.ilike.${t},reference.ilike.${t}`);
      }
      const { data, error } = await q.order("created_at", { ascending: false }).limit(LIMIT);
      if (error) throw new Error("Could not read properties");
      return json(data);
    },
  });

  const listTasks = betaZodTool({
    name: "list_tasks",
    description: "Open tasks of the agency, soonest due first. Optionally only those due before a date.",
    inputSchema: z.object({
      due_before: z.string().optional().describe("ISO date, e.g. 2026-11-20"),
      include_done: z.boolean().optional(),
    }),
    run: async ({ due_before, include_done }) => {
      let q = ws(s.db.from("tasks").select("id, title, due_at, done, lead_id, contact_id, property_id"));
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
      "Create a follow-up task in the CRM, optionally linked to a lead, contact or property. Only do this when the person asks for a task or reminder, or agrees to one you proposed.",
    inputSchema: z.object({
      title: z.string().min(1).max(200),
      due_at: z.string().optional().describe("ISO date-time, e.g. 2026-11-20T09:00:00+01:00"),
      lead_id: uuid.optional(),
      contact_id: uuid.optional(),
      property_id: uuid.optional(),
    }),
    run: async (t) => {
      const due = t.due_at && !Number.isNaN(Date.parse(t.due_at)) ? new Date(t.due_at).toISOString() : null;
      const { data, error } = await s.db
        .from("tasks")
        .insert({
          workspace_id: workspaceId,
          title: t.title,
          due_at: due,
          lead_id: t.lead_id ?? null,
          contact_id: t.contact_id ?? null,
          property_id: t.property_id ?? null,
          assigned_to: s.userId,
          created_by: s.userId,
        })
        .select("id")
        .single();
      if (error || !data) return "The task could not be created (check that the linked record belongs to this agency).";
      actions.push({ type: "task", id: data.id, label: t.title });
      return json({ created: data.id });
    },
  });

  const addNote = betaZodTool({
    name: "add_note",
    description:
      "Add a note to the timeline of a lead, contact or property. Only when the person asks you to note or log something.",
    inputSchema: z.object({
      body: z.string().min(1).max(4000),
      lead_id: uuid.optional(),
      contact_id: uuid.optional(),
      property_id: uuid.optional(),
    }),
    run: async (n) => {
      if (!n.lead_id && !n.contact_id && !n.property_id) return "Say which lead, contact or property the note belongs to.";
      const { data, error } = await s.db
        .from("activities")
        .insert({
          workspace_id: workspaceId,
          kind: "note",
          body: n.body,
          lead_id: n.lead_id ?? null,
          contact_id: n.contact_id ?? null,
          property_id: n.property_id ?? null,
          created_by: s.userId,
        })
        .select("id")
        .single();
      if (error || !data) return "The note could not be saved.";
      actions.push({ type: "note", id: data.id, label: n.body.slice(0, 80) });
      return json({ created: data.id });
    },
  });

  return [searchContacts, listLeads, getLead, searchProperties, listTasks, createTask, addNote];
}
