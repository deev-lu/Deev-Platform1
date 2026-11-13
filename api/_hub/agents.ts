// The Business Hub's AI agents, all on Claude.
//
//   copilot     a conversation over the agency's own CRM, with tools (tools.ts)
//   lead_brief  scores a lead, sums it up, names the next step, drafts a reply
//   listing     writes listing texts in English, French and German from the facts
//   matches     ranks the agency's listings for a lead and says why
//   email       drafts an email to a contact for a stated purpose
//
// Facts come from the CRM only. Every prompt tells the model to leave out what
// the record does not say rather than fill it in, and the structured agents
// return JSON checked against a schema before anything is shown or saved.

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { hubEnv } from "./env.js";
import { HttpError, isUuid, type HubSession } from "./db.js";
import { crmTools, type ToolAction } from "./tools.js";

export type Lang = "en" | "fr" | "de";
const LANG_NAME: Record<string, string> = {
  en: "English",
  fr: "French",
  de: "German",
  lb: "Luxembourgish",
  pt: "Portuguese",
  it: "Italian",
  nl: "Dutch",
};

/** Server-side fallback when Claude Opus 5.5 declines: the API routes by category. */
const FALLBACK = { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };

export interface AgentResult {
  data: unknown;
  usage: { input: number; output: number };
  model: string;
}

let client: Anthropic | null = null;
function claude(): Anthropic {
  if (!hubEnv.anthropicKey) throw new HttpError(503, "ai-not-configured");
  client ??= new Anthropic({ apiKey: hubEnv.anthropicKey, maxRetries: 2, timeout: 55_000 });
  return client;
}

const usageOf = (m: { usage?: { input_tokens?: number; output_tokens?: number } | null }) => ({
  input: m.usage?.input_tokens ?? 0,
  output: m.usage?.output_tokens ?? 0,
});

function refused(m: { stop_reason?: string | null }) {
  if (m.stop_reason === "refusal") throw new HttpError(422, "ai-declined");
}

const SYSTEM_BASE = `You work inside DEEV Business Hub, a CRM for real-estate agents, most of them in Luxembourg.
Rules:
- Use only facts from the CRM data you are given or that your tools return. If something is not in the data, say it is not recorded; never estimate prices, invent features, names, dates or figures.
- Amounts are in EUR, surfaces in m², unless the data says otherwise.
- Be brief and practical: an agent reads you between two viewings.
- Personal data stays inside this agency: do not repeat more of it than the task needs.`;

// ── Copilot ─────────────────────────────────────────────────

const ChatTurn = z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) });
export const CopilotInput = z.object({
  messages: z.array(ChatTurn).min(1).max(30),
  lang: z.enum(["en", "fr", "de"]).default("en"),
});

export async function runCopilot(s: HubSession, ws: { id: string; name: string }, raw: unknown): Promise<AgentResult> {
  const input = CopilotInput.safeParse(raw);
  if (!input.success) throw new HttpError(400, "bad-input");
  const turns = input.data.messages;
  if (turns[turns.length - 1].role !== "user") throw new HttpError(400, "bad-input");

  const actions: ToolAction[] = [];
  const today = new Date().toISOString().slice(0, 10);
  // Volatile context rides on the newest user turn, so the system prompt and
  // the tool list stay byte-identical and cacheable.
  const messages: Anthropic.Beta.BetaMessageParam[] = turns.map((t, i) => ({
    role: t.role,
    content:
      i === turns.length - 1
        ? `[Context: today is ${today}; agency "${ws.name}"; reply in ${LANG_NAME[input.data.lang]} unless I write in another language.]\n\n${t.content}`
        : t.content,
  }));

  const final = await claude().beta.messages.toolRunner({
    model: hubEnv.model,
    max_tokens: 16000,
    max_iterations: 8,
    output_config: { effort: "medium" },
    cache_control: { type: "ephemeral" },
    system: `${SYSTEM_BASE}
You are the agency's copilot. Look things up with your tools before you answer; don't ask the person for data you can find yourself. When you mention a lead, contact or property, give its name or title. Create tasks or notes only when asked to, or after the person agrees. Format with short paragraphs or brief lists; no tables.`,
    tools: crmTools(s, ws.id, actions),
    messages,
    ...FALLBACK,
  });

  refused(final);
  const reply = final.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n\n")
    .trim();
  return { data: { reply, actions }, usage: usageOf(final), model: final.model };
}

// ── Structured agents ───────────────────────────────────────

async function structured<T extends z.ZodType>(
  schema: T,
  system: string,
  user: string,
  effort: "low" | "medium" | "high",
): Promise<{ value: z.infer<T>; usage: { input: number; output: number }; model: string }> {
  const msg = await claude().beta.messages.parse({
    model: hubEnv.model,
    max_tokens: 16000,
    output_config: { effort, format: betaZodOutputFormat(schema) },
    system: `${SYSTEM_BASE}\n${system}`,
    messages: [{ role: "user", content: user }],
    ...FALLBACK,
  });
  refused(msg);
  if (msg.stop_reason === "max_tokens" || msg.parsed_output == null) throw new HttpError(502, "ai-bad-output");
  return { value: msg.parsed_output as z.infer<T>, usage: usageOf(msg), model: msg.model };
}

async function loadLead(s: HubSession, workspaceId: string, leadId: unknown) {
  if (!isUuid(leadId)) throw new HttpError(400, "bad-input");
  const { data: lead } = await s.db
    .from("leads")
    .select("*, stage:pipeline_stages(name, kind), contact:contacts(*), property:properties(id, title, price, city)")
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .maybeSingle();
  if (!lead) throw new HttpError(404, "not-found");
  const [{ data: timeline }, { data: tasks }] = await Promise.all([
    s.db.from("activities").select("kind, body, created_at").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(30),
    s.db.from("tasks").select("title, due_at, done").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(20),
  ]);
  return { lead: lead as any, timeline: timeline ?? [], tasks: tasks ?? [] };
}

/** The record as the model sees it: no internal ids it does not need. */
function leadFacts(l: any, timeline: unknown[], tasks: unknown[]) {
  const c = l.contact ?? {};
  return JSON.stringify(
    {
      contact: {
        name: [c.first_name, c.last_name].filter(Boolean).join(" "),
        kind: c.kind,
        language: c.language,
        source: c.source,
        has_email: Boolean(c.email),
        has_phone: Boolean(c.phone),
        marketing_consent: c.marketing_consent,
        notes: c.notes,
      },
      lead: {
        intent: l.intent,
        stage: l.stage?.name,
        budget_min: l.budget_min,
        budget_max: l.budget_max,
        locations: l.locations,
        property_kinds: l.property_kinds,
        min_bedrooms: l.min_bedrooms,
        min_surface_m2: l.min_surface_m2,
        timeline: l.timeline,
        source: l.source,
        notes: l.notes,
        linked_property: l.property ? { title: l.property.title, price: l.property.price, city: l.property.city } : null,
        created_at: l.created_at,
        last_activity_at: l.last_activity_at,
      },
      timeline,
      tasks,
      today: new Date().toISOString().slice(0, 10),
    },
    null,
    1,
  );
}

// Lead brief

export const LeadBrief = z.object({
  score: z.number().int().min(0).max(100).describe("How likely this lead is to transact soon, 0-100"),
  score_reason: z.string().describe("One sentence: why this score"),
  summary: z.string().describe("Three to five sentences on who this is and what they want"),
  missing_info: z.array(z.string()).describe("What the agent should still find out, most important first; empty if nothing"),
  next_step: z.string().describe("The single most useful next action, concrete"),
  email: z.object({ subject: z.string(), body: z.string() }).describe("A follow-up email to the contact, ready to edit"),
});

export async function runLeadBrief(s: HubSession, ws: { id: string }, raw: any, lang: Lang): Promise<AgentResult> {
  const { lead, timeline, tasks } = await loadLead(s, ws.id, raw?.lead_id);
  const mailLang = LANG_NAME[lead.contact?.language] ?? LANG_NAME[lang];
  const r = await structured(
    LeadBrief,
    `You qualify real-estate leads. Score on what is recorded: budget stated and realistic for the wanted area, clear criteria, timeline, recent two-way contact, financing mentioned. A lead with little data scores low and says what is missing. Write score_reason, summary, missing_info and next_step in ${LANG_NAME[lang]}. Write the email in ${mailLang}, polite and short, signed with a placeholder "[Your name]"; it must not promise anything the data does not support.`,
    `Lead record:\n${leadFacts(lead, timeline, tasks)}`,
    "medium",
  );
  // Keep the score and summary on the lead, with their date, and say so on the timeline.
  await s.db
    .from("leads")
    .update({ score: r.value.score, ai_summary: r.value.summary, ai_updated_at: new Date().toISOString() })
    .eq("id", lead.id)
    .eq("workspace_id", ws.id);
  await s.db.from("activities").insert({
    workspace_id: ws.id,
    lead_id: lead.id,
    kind: "ai",
    body: `${r.value.score}/100 · ${r.value.next_step}`,
    created_by: s.userId,
  });
  return { data: r.value, usage: r.usage, model: r.model };
}

// Listing writer

export const ListingTexts = z.object({
  headline: z.string().describe("A short listing headline in the first requested language"),
  texts: z.object({
    en: z.string().optional(),
    fr: z.string().optional(),
    de: z.string().optional(),
  }),
});

export async function runListing(s: HubSession, ws: { id: string }, raw: any, lang: Lang): Promise<AgentResult> {
  if (!isUuid(raw?.property_id)) throw new HttpError(400, "bad-input");
  const langs = (Array.isArray(raw?.languages) ? raw.languages : ["en", "fr", "de"]).filter((l: string) =>
    ["en", "fr", "de"].includes(l),
  ) as Lang[];
  if (!langs.length) throw new HttpError(400, "bad-input");
  const tone = ["neutral", "warm", "premium"].includes(raw?.tone) ? raw.tone : "neutral";
  const { data: p } = await s.db
    .from("properties")
    .select("title, kind, deal, status, price, surface_m2, rooms, bedrooms, bathrooms, postcode, city, country, energy_class, features, description")
    .eq("workspace_id", ws.id)
    .eq("id", raw.property_id)
    .maybeSingle();
  if (!p) throw new HttpError(404, "not-found");
  const notes = typeof raw?.notes === "string" ? raw.notes.slice(0, 2000) : "";
  const r = await structured(
    ListingTexts,
    `You write property listings for Luxembourg portals and agency websites. Write one text per requested language (${langs.map((l) => LANG_NAME[l]).join(", ")}), each a native text, not a translation: 120-200 words, ${tone} tone, short paragraphs, no emojis, no exclamation marks. Mention only facts given. Do not name the street or house number. Do not describe views, light, condition, neighbourhood or transport unless the facts or notes say so. Leave out the languages that were not requested. Headline in ${LANG_NAME[langs[0]]}.`,
    `Facts:\n${JSON.stringify(p, null, 1)}\n\nAgent's notes (facts too, if any):\n${notes || "none"}`,
    "low",
  );
  // Returned for review; the person saves it on the listing.
  const texts = Object.fromEntries(langs.map((l) => [l, r.value.texts[l] ?? ""]));
  return { data: { headline: r.value.headline, texts }, usage: r.usage, model: r.model };
}

// Matching

export interface Candidate {
  id: string;
  title: string;
  kind: string;
  deal: string;
  status: string;
  price: number | null;
  surface_m2: number | null;
  bedrooms: number | null;
  city: string | null;
  postcode: string | null;
  energy_class: string | null;
  features: string[] | null;
}

/**
 * The shortlist before the model sees anything: rules a person would apply,
 * so the model ranks real candidates and cannot propose a listing that is not
 * for sale, out of budget or of the wrong kind.
 */
export function prefilter(lead: any, props: Candidate[], max = 12): (Candidate & { rule_score: number })[] {
  const deal = lead.intent === "rent" ? "rent" : lead.intent === "buy" || lead.intent === "invest" ? "sale" : null;
  if (!deal) return [];
  const locs: string[] = (lead.locations ?? []).map((l: string) => l.toLowerCase().trim()).filter(Boolean);
  const kinds: string[] = lead.property_kinds ?? [];
  const out: (Candidate & { rule_score: number })[] = [];
  for (const p of props) {
    if (p.status !== "available" || p.deal !== deal) continue;
    if (kinds.length && !kinds.includes(p.kind)) continue;
    const price = p.price == null ? null : Number(p.price);
    if (price != null && lead.budget_max != null && price > Number(lead.budget_max) * 1.1) continue;
    if (price != null && lead.budget_min != null && price < Number(lead.budget_min) * 0.7) continue;
    if (lead.min_bedrooms != null && p.bedrooms != null && p.bedrooms < lead.min_bedrooms) continue;
    if (lead.min_surface_m2 != null && p.surface_m2 != null && Number(p.surface_m2) < Number(lead.min_surface_m2) * 0.9) continue;

    let score = 50;
    const place = `${p.city ?? ""} ${p.postcode ?? ""}`.toLowerCase();
    if (locs.length) score += locs.some((l) => place.includes(l)) ? 30 : -15;
    if (price != null && lead.budget_max != null) score += price <= Number(lead.budget_max) ? 15 : 0;
    if (price == null) score -= 10;
    out.push({ ...p, rule_score: Math.max(0, Math.min(100, score)) });
  }
  return out.sort((a, b) => b.rule_score - a.rule_score).slice(0, max);
}

export const MatchList = z.object({
  matches: z.array(
    z.object({
      property_id: z.string(),
      fit: z.number().int().min(0).max(100),
      reasons: z.array(z.string()).describe("Why it fits, from the data"),
      concerns: z.array(z.string()).describe("What does not fit or is unknown"),
    }),
  ),
});

export async function runMatches(s: HubSession, ws: { id: string }, raw: any, lang: Lang): Promise<AgentResult> {
  const { lead, timeline, tasks } = await loadLead(s, ws.id, raw?.lead_id);
  const { data: props } = await s.db
    .from("properties")
    .select("id, title, kind, deal, status, price, surface_m2, bedrooms, city, postcode, energy_class, features")
    .eq("workspace_id", ws.id)
    .eq("status", "available")
    .limit(500);
  const shortlist = prefilter(lead, (props ?? []) as Candidate[]);
  if (!shortlist.length) {
    return { data: { matches: [], note: "no-candidates" }, usage: { input: 0, output: 0 }, model: "rules" };
  }
  const r = await structured(
    MatchList,
    `You match buyers and tenants with listings. Rank at most 5 of the candidates given, best first; leave out any that do not really fit. property_id must be one of the candidates' ids. Write reasons and concerns in ${LANG_NAME[lang]}, a few words each.`,
    `Lead:\n${leadFacts(lead, timeline, tasks)}\n\nCandidates:\n${JSON.stringify(shortlist, null, 1)}`,
    "medium",
  );
  const known = new Map(shortlist.map((c) => [c.id, c]));
  const matches = r.value.matches
    .filter((m) => known.has(m.property_id))
    .slice(0, 5)
    .map((m) => ({ ...m, property: known.get(m.property_id) }));
  return { data: { matches }, usage: r.usage, model: r.model };
}

// Email

export const EmailDraft = z.object({ subject: z.string(), body: z.string() });

export async function runEmail(s: HubSession, ws: { id: string }, raw: any, lang: Lang): Promise<AgentResult> {
  const purpose = typeof raw?.purpose === "string" ? raw.purpose.trim().slice(0, 1500) : "";
  if (!purpose) throw new HttpError(400, "bad-input");
  let facts = "";
  let contactLang: string | undefined;
  if (raw?.lead_id) {
    const { lead, timeline, tasks } = await loadLead(s, ws.id, raw.lead_id);
    facts = leadFacts(lead, timeline.slice(0, 10), tasks);
    contactLang = lead.contact?.language;
  } else if (isUuid(raw?.contact_id)) {
    const { data: c } = await s.db
      .from("contacts")
      .select("first_name, last_name, kind, language, notes")
      .eq("workspace_id", ws.id)
      .eq("id", raw.contact_id)
      .maybeSingle();
    if (!c) throw new HttpError(404, "not-found");
    facts = JSON.stringify(c);
    contactLang = (c as any).language;
  } else {
    throw new HttpError(400, "bad-input");
  }
  const writeIn = LANG_NAME[raw?.language] ?? LANG_NAME[contactLang ?? ""] ?? LANG_NAME[lang];
  const r = await structured(
    EmailDraft,
    `You draft emails from a real-estate agent to a client. Write in ${writeIn}: polite, short, plain text, signed "[Your name]". Use only the facts given; leave a [bracketed placeholder] where a fact is needed but missing (a date, a price, an address).`,
    `Purpose of the email: ${purpose}\n\nWhat the CRM knows:\n${facts}`,
    "low",
  );
  return { data: r.value, usage: r.usage, model: r.model };
}
