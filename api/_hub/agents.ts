// The Business Hub's AI agents, all on Claude.
//
//   copilot     a conversation over the company's own CRM, with tools (tools.ts)
//   deal_brief  scores a deal, sums it up, names the next step, drafts a follow-up
//   proposal    drafts a proposal from the catalogue, priced from the catalogue only
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

const SYSTEM_BASE = `You work inside DEEV Business Hub, a CRM for small and medium-sized companies, most of them in Luxembourg.
Rules:
- Use only facts from the CRM data you are given or that your tools return. If something is not in the data, say it is not recorded; never invent prices, names, dates, figures or promises.
- Amounts are in EUR excluding VAT, unless the data says otherwise.
- Be brief and practical: the person reads you between two meetings.
- Personal data stays inside this company: do not repeat more of it than the task needs.`;

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
        ? `[Context: today is ${today}; company "${ws.name}"; reply in ${LANG_NAME[input.data.lang]} unless I write in another language.]\n\n${t.content}`
        : t.content,
  }));

  const final = await claude().beta.messages.toolRunner({
    model: hubEnv.model,
    max_tokens: 16000,
    max_iterations: 8,
    output_config: { effort: "medium" },
    cache_control: { type: "ephemeral" },
    system: `${SYSTEM_BASE}
You are the company's CRM copilot. Look things up with your tools before you answer; don't ask the person for data you can find yourself. When you mention a deal, contact or product, give its name. Create tasks or notes only when asked to, or after the person agrees. Format with short paragraphs or brief lists; no tables.`,
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

async function loadDeal(s: HubSession, workspaceId: string, dealId: unknown) {
  if (!isUuid(dealId)) throw new HttpError(400, "bad-input");
  const { data: deal } = await s.db
    .from("deals")
    .select("*, stage:pipeline_stages(name, kind), contact:contacts(*)")
    .eq("workspace_id", workspaceId)
    .eq("id", dealId)
    .maybeSingle();
  if (!deal) throw new HttpError(404, "not-found");
  const [{ data: timeline }, { data: tasks }] = await Promise.all([
    s.db.from("activities").select("kind, body, created_at").eq("deal_id", dealId).order("created_at", { ascending: false }).limit(30),
    s.db.from("tasks").select("title, due_at, done").eq("deal_id", dealId).order("created_at", { ascending: false }).limit(20),
  ]);
  return { deal: deal as any, timeline: timeline ?? [], tasks: tasks ?? [] };
}

/** The record as the model sees it: no internal ids it does not need. */
function dealFacts(d: any, timeline: unknown[], tasks: unknown[]) {
  const c = d.contact ?? {};
  return JSON.stringify(
    {
      contact: {
        name: [c.first_name, c.last_name].filter(Boolean).join(" "),
        company: c.company,
        job_title: c.job_title,
        kind: c.kind,
        language: c.language,
        source: c.source,
        has_email: Boolean(c.email),
        has_phone: Boolean(c.phone),
        notes: c.notes,
      },
      deal: {
        title: d.title,
        stage: d.stage?.name,
        value_eur: d.value,
        expected_close: d.expected_close,
        needs: d.needs,
        source: d.source,
        notes: d.notes,
        created_at: d.created_at,
        last_activity_at: d.last_activity_at,
      },
      timeline,
      tasks,
      today: new Date().toISOString().slice(0, 10),
    },
    null,
    1,
  );
}

// Deal brief

export const DealBrief = z.object({
  score: z.number().int().min(0).max(100).describe("How likely this deal is to close soon, 0-100"),
  score_reason: z.string().describe("One sentence: why this score"),
  summary: z.string().describe("Three to five sentences on who this is, what they need and where it stands"),
  missing_info: z.array(z.string()).describe("What the team should still find out, most important first; empty if nothing"),
  next_step: z.string().describe("The single most useful next action, concrete"),
  email: z.object({ subject: z.string(), body: z.string() }).describe("A follow-up email to the contact, ready to edit"),
});

export async function runDealBrief(s: HubSession, ws: { id: string }, raw: any, lang: Lang): Promise<AgentResult> {
  const { deal, timeline, tasks } = await loadDeal(s, ws.id, raw?.deal_id);
  const mailLang = LANG_NAME[deal.contact?.language] ?? LANG_NAME[lang];
  const r = await structured(
    DealBrief,
    `You qualify sales opportunities. Score on what is recorded: a clear need, a decision maker involved, a value and a timeline, recent two-way contact, budget or approval mentioned. A deal with little data scores low and says what is missing. Write score_reason, summary, missing_info and next_step in ${LANG_NAME[lang]}. Write the email in ${mailLang}, polite and short, signed with a placeholder "[Your name]"; it must not promise anything the data does not support.`,
    `Deal record:\n${dealFacts(deal, timeline, tasks)}`,
    "medium",
  );
  // Keep the score and summary on the deal, with their date, and say so on the timeline.
  await s.db
    .from("deals")
    .update({ score: r.value.score, ai_summary: r.value.summary, ai_updated_at: new Date().toISOString() })
    .eq("id", deal.id)
    .eq("workspace_id", ws.id);
  await s.db.from("activities").insert({
    workspace_id: ws.id,
    deal_id: deal.id,
    kind: "ai",
    body: `${r.value.score}/100 · ${r.value.next_step}`,
    created_by: s.userId,
  });
  return { data: r.value, usage: r.usage, model: r.model };
}

// Proposal

export interface CatalogItem {
  id: string;
  name: string;
  description: string | null;
  unit_price: number | null;
  unit: string;
}

export const ProposalDraft = z.object({
  subject: z.string().describe("Subject line of the proposal email"),
  intro: z.string().describe("Opening paragraphs: the customer's need in their terms and how we meet it"),
  lines: z
    .array(
      z.object({
        catalog_id: z.string().describe("The id of a catalogue item; never anything else"),
        quantity: z.number().positive().describe("How many units; 1 if the record does not say"),
        why: z.string().describe("One short sentence: why this item, from the customer's need"),
      }),
    )
    .describe("The catalogue items that answer the need; empty if none does"),
  closing: z.string().describe("Next steps and a polite close, signed [Your name]"),
  open_questions: z.array(z.string()).describe("What must be clarified with the customer before sending"),
});

export interface ProposalLine {
  catalog_id: string;
  name: string;
  unit: string;
  quantity: number;
  unit_price: number | null;
  total: number | null;
  why: string;
}

/**
 * The priced lines: names and prices come from the catalogue, never from the
 * model. Unknown ids are dropped, quantities kept sensible, and the total is
 * null as soon as one line has no price (it is shown as "to be priced").
 */
export function priceLines(
  chosen: { catalog_id: string; quantity: number; why: string }[],
  catalog: CatalogItem[],
): { lines: ProposalLine[]; total: number | null } {
  const byId = new Map(catalog.map((c) => [c.id, c]));
  const lines: ProposalLine[] = [];
  for (const c of chosen) {
    const item = byId.get(c.catalog_id);
    if (!item || lines.some((l) => l.catalog_id === item.id)) continue;
    // Quarter steps (hours and days are often split), at least 0.25, at most 10,000;
    // anything that is not a positive number counts as 1.
    const q = Number(c.quantity);
    const quantity = Number.isFinite(q) && q > 0 ? Math.min(10_000, Math.max(0.25, Math.round(q * 4) / 4)) : 1;
    const unit_price = item.unit_price == null ? null : Number(item.unit_price);
    lines.push({
      catalog_id: item.id,
      name: item.name,
      unit: item.unit,
      quantity,
      unit_price,
      total: unit_price == null ? null : Math.round(unit_price * quantity * 100) / 100,
      why: c.why,
    });
  }
  const total = lines.length && lines.every((l) => l.total != null) ? lines.reduce((sum, l) => sum + (l.total as number), 0) : null;
  return { lines, total: total == null ? null : Math.round(total * 100) / 100 };
}

export async function runProposal(s: HubSession, ws: { id: string }, raw: any, lang: Lang): Promise<AgentResult> {
  const { deal, timeline, tasks } = await loadDeal(s, ws.id, raw?.deal_id);
  const { data: catalog } = await s.db
    .from("catalog_items")
    .select("id, name, description, unit_price, unit")
    .eq("workspace_id", ws.id)
    .eq("active", true)
    .order("name")
    .limit(200);
  const items = (catalog ?? []) as CatalogItem[];
  const writeIn = LANG_NAME[raw?.language] ?? LANG_NAME[deal.contact?.language] ?? LANG_NAME[lang];
  const extra = typeof raw?.notes === "string" ? raw.notes.slice(0, 2000) : "";
  const r = await structured(
    ProposalDraft,
    `You draft commercial proposals for a small company. Choose only items from the catalogue given, by id; do not name or price anything else. Do not state prices in the text: the priced lines are added separately. If the catalogue has nothing that fits, return no lines and say so in open_questions. Write subject, intro, closing, the "why" lines and open_questions in ${writeIn}. No legal terms, discounts or deadlines unless the data states them.`,
    `Deal:\n${dealFacts(deal, timeline, tasks)}\n\nCatalogue:\n${JSON.stringify(items, null, 1)}\n\nExtra instructions from the team:\n${extra || "none"}`,
    "medium",
  );
  const priced = priceLines(r.value.lines, items);
  return {
    data: { subject: r.value.subject, intro: r.value.intro, closing: r.value.closing, open_questions: r.value.open_questions, ...priced },
    usage: r.usage,
    model: r.model,
  };
}

// Email

export const EmailDraft = z.object({ subject: z.string(), body: z.string() });

export async function runEmail(s: HubSession, ws: { id: string }, raw: any, lang: Lang): Promise<AgentResult> {
  const purpose = typeof raw?.purpose === "string" ? raw.purpose.trim().slice(0, 1500) : "";
  if (!purpose) throw new HttpError(400, "bad-input");
  let facts = "";
  let contactLang: string | undefined;
  if (raw?.deal_id) {
    const { deal, timeline, tasks } = await loadDeal(s, ws.id, raw.deal_id);
    facts = dealFacts(deal, timeline.slice(0, 10), tasks);
    contactLang = deal.contact?.language;
  } else if (isUuid(raw?.contact_id)) {
    const { data: c } = await s.db
      .from("contacts")
      .select("first_name, last_name, company, job_title, kind, language, notes")
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
    `You draft business emails to a client or partner. Write in ${writeIn}: polite, short, plain text, signed "[Your name]". Use only the facts given; leave a [bracketed placeholder] where a fact is needed but missing (a date, a price, a name).`,
    `Purpose of the email: ${purpose}\n\nWhat the CRM knows:\n${facts}`,
    "low",
  );
  return { data: r.value, usage: r.usage, model: r.model };
}
