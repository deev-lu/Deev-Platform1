import type { Activity, CatalogItem, Contact, Deal, HubLang, Links, Member, Repo, Stage, Task, Workspace } from "./types";

/**
 * The demo: the whole Hub in memory, with sample data, so it can be shown
 * before (and besides) a real account. Nothing is stored or sent; a reload
 * starts over. Every company, name and figure here is invented, and the app
 * says so on every screen while the demo runs. The AI agents do not run in
 * the demo (api/hub needs a real, signed-in account).
 */

const WS = "00000000-0000-4000-8000-00000000d3e0";
const ME = "00000000-0000-4000-8000-0000000000aa";
const id = () => crypto.randomUUID();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();
const dateAhead = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString().slice(0, 10);
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/** The starting pipeline, as create_workspace() writes it for a real company. */
const STAGE_NAMES: Record<HubLang, string[]> = {
  en: ["New", "Contacted", "Proposal", "Negotiation", "Won", "Lost"],
  fr: ["Nouveau", "Contacté", "Proposition", "Négociation", "Gagné", "Perdu"],
  de: ["Neu", "Kontaktiert", "Angebot", "Verhandlung", "Gewonnen", "Verloren"],
};

function seed(lang: HubLang) {
  const stages: Stage[] = STAGE_NAMES[lang].map((name, i) => ({
    id: id(),
    name,
    position: i + 1,
    kind: i === 4 ? "won" : i === 5 ? "lost" : "open",
  }));

  const c = (first_name: string, last_name: string, company: string, job_title: string, kind: Contact["kind"], language: string, days: number, extra: Partial<Contact> = {}): Contact => ({
    id: id(), first_name, last_name, company, job_title, kind, language,
    email: `${first_name}.${last_name}@example.com`.toLowerCase().replace(/'/g, ""),
    phone: null, source: "Website", notes: null, marketing_consent: false, consent_at: null, created_at: daysAgo(days), ...extra,
  });
  const contacts: Contact[] = [
    c("Claire", "Weber", "Weber Boulangerie", "Owner", "lead", "fr", 2, { phone: "+352 600 000 101", source: "Referral" }),
    c("Tom", "Schmit", "Schmit Logistics", "Operations manager", "lead", "lb", 6),
    c("Ana", "Ferreira", "Ferreira Cleaning", "Managing director", "customer", "pt", 30, { marketing_consent: true, consent_at: daysAgo(30) }),
    c("Jonas", "Becker", "Becker Steuerberatung", "Partner", "lead", "de", 14, { source: "Trade fair", notes: "Met at the trade fair; 12 staff." }),
    c("Sophie", "Muller", "Atelier Muller", "Founder", "customer", "fr", 60),
    c("Liam", "O'Brien", "Northwind Consulting", "CEO", "partner", "en", 3, { source: "LinkedIn" }),
  ];

  const item = (name: string, unit_price: number | null, unit: CatalogItem["unit"], description: string | null = null): CatalogItem => ({
    id: id(), name, description, unit_price, unit, active: true, created_at: daysAgo(40),
  });
  const catalog: CatalogItem[] = [
    item("Discovery workshop", 1800, "day", "Half a day on site, a written summary within a week."),
    item("Consulting", 120, "hour"),
    item("Website (up to 8 pages)", 4800, "project", "Design, build, three languages, hosting set-up."),
    item("Online shop add-on", 2400, "project"),
    item("Maintenance and support", 180, "month", "Updates, backups, two hours of changes a month."),
    item("Custom integration", null, "project", "Priced after the workshop."),
  ];

  const deal = (title: string, contact: Contact, stage: number, extra: Partial<Deal>): Deal => ({
    id: id(), title, contact_id: contact.id, stage_id: stages[stage].id, value: null, expected_close: null, needs: null,
    source: contact.source, notes: null, score: null, ai_summary: null, ai_updated_at: null,
    last_activity_at: contact.created_at, created_at: contact.created_at, ...extra,
  });
  const deals: Deal[] = [
    deal("New website with online orders", contacts[0], 0, { value: 7200, expected_close: dateAhead(45), needs: "A new website in French and German, with click-and-collect orders for cakes." }),
    deal("Warehouse dashboard", contacts[1], 1, { value: 15000, needs: "See stock and late deliveries in one place instead of three spreadsheets." }),
    deal("Website maintenance renewal", contacts[2], 2, { value: 2160, expected_close: dateAhead(20), needs: "Renew the yearly maintenance plan." }),
    deal("Client portal for the tax firm", contacts[3], 3, { value: 24000, expected_close: dateAhead(30), score: 68, ai_summary: "Twelve-person tax firm that wants clients to upload documents safely; budget not yet confirmed by the partners.", ai_updated_at: daysAgo(1) }),
    deal("Brand refresh", contacts[4], 4, { value: 3600 }),
    deal("Joint offer for an SME package", contacts[5], 1, { needs: "Combine our build with their change management for SME Package clients." }),
  ];

  const tasks: Task[] = [
    { id: id(), title: "Call Claire about the order flow", due_at: new Date(Date.now() + 3 * 3_600_000).toISOString(), done: false, deal_id: deals[0].id, contact_id: null, created_at: daysAgo(1) },
    { id: id(), title: "Send Ana the renewal", due_at: new Date(Date.now() + 86_400_000).toISOString(), done: false, deal_id: deals[2].id, contact_id: null, created_at: daysAgo(1) },
    { id: id(), title: "Prepare the workshop agenda for Becker", due_at: new Date(Date.now() + 3 * 86_400_000).toISOString(), done: false, deal_id: deals[3].id, contact_id: null, created_at: daysAgo(2) },
    { id: id(), title: "Update the price list", due_at: daysAgo(1), done: false, deal_id: null, contact_id: null, created_at: daysAgo(4) },
  ];
  const activities: Activity[] = [
    { id: id(), kind: "call", body: "First call: wants orders online before the holidays.", deal_id: deals[0].id, contact_id: null, created_at: daysAgo(2) },
    { id: id(), kind: "meeting", body: "Demo of the portal idea; the partners decide next week.", deal_id: deals[3].id, contact_id: null, created_at: daysAgo(1) },
  ];
  const members: Member[] = [{ user_id: ME, role: "owner", full_name: "Demo user", email: "demo@example.com" }];
  const workspace: Workspace = {
    id: WS, name: { en: "Demo company", fr: "Entreprise démo", de: "Demo-Firma" }[lang], locale: lang,
    plan: "early_access", ai_daily_limit: 150, role: "owner",
  };
  return { stages, contacts, catalog, deals, tasks, activities, members, workspace };
}

export function createDemoRepo(lang: HubLang = "en"): Repo {
  const s = seed(lang);
  const withContact = (d: Deal): Deal => {
    const c = s.contacts.find((x) => x.id === d.contact_id);
    return clone({ ...d, contact: c && { id: c.id, first_name: c.first_name, last_name: c.last_name, company: c.company, email: c.email, phone: c.phone, language: c.language, kind: c.kind } });
  };
  const save = <T extends { id: string; created_at?: string }>(list: T[], row: Partial<T>, defaults: () => T): string => {
    if (row.id) {
      const i = list.findIndex((x) => x.id === row.id);
      if (i >= 0) list[i] = { ...list[i], ...clone(row) };
      return row.id;
    }
    const created = { ...defaults(), ...clone(row), id: id(), created_at: new Date().toISOString() } as T;
    list.unshift(created);
    return created.id;
  };
  const linked = <T extends Links>(x: T, l: Links) => (!l.deal_id || x.deal_id === l.deal_id) && (!l.contact_id || x.contact_id === l.contact_id);
  const touch = (dealId?: string | null) => {
    const d = s.deals.find((x) => x.id === dealId);
    if (d) d.last_activity_at = new Date().toISOString();
  };

  return {
    demo: true,
    async myWorkspaces() { return [clone(s.workspace)]; },
    async createWorkspace() { return WS; },
    async renameWorkspace(_ws, name) { s.workspace.name = name; },
    async members() { return clone(s.members); },
    async addMember() { throw new Error("demo"); },
    async updateMemberRole() {},
    async removeMember() {},

    async stages() { return clone(s.stages); },
    async deals() { return [...s.deals].sort((a, b) => b.last_activity_at.localeCompare(a.last_activity_at)).map(withContact); },
    async deal(_ws, did) { const d = s.deals.find((x) => x.id === did); return d ? withContact(d) : null; },
    async saveDeal(_ws, d) {
      const { contact: _c, ...row } = d;
      return save(s.deals, { ...row, last_activity_at: new Date().toISOString() }, () => ({
        id: "", title: "", contact_id: "", stage_id: s.stages[0].id, value: null, expected_close: null, needs: null, source: null,
        notes: null, score: null, ai_summary: null, ai_updated_at: null, last_activity_at: new Date().toISOString(), created_at: "",
      }));
    },
    async deleteDeal(_ws, did) {
      s.deals = s.deals.filter((x) => x.id !== did);
      s.tasks = s.tasks.filter((x) => x.deal_id !== did);
      s.activities = s.activities.filter((x) => x.deal_id !== did);
    },

    async contacts(_ws, q) {
      const t = q?.trim().toLowerCase();
      return clone(s.contacts.filter((c) => !t || [c.first_name, c.last_name, c.company, c.email, c.phone].some((v) => v?.toLowerCase().includes(t))));
    },
    async contact(_ws, cid) { return clone(s.contacts.find((x) => x.id === cid) ?? null); },
    async saveContact(_ws, c) {
      return save(s.contacts, c, () => ({ id: "", first_name: "", last_name: null, company: null, job_title: null, email: null, phone: null, language: null, kind: "lead", source: null, notes: null, marketing_consent: false, consent_at: null, created_at: "" }));
    },
    async deleteContact(_ws, cid) {
      const gone = s.deals.filter((d) => d.contact_id === cid).map((d) => d.id);
      s.contacts = s.contacts.filter((x) => x.id !== cid);
      s.deals = s.deals.filter((d) => d.contact_id !== cid);
      s.tasks = s.tasks.filter((t) => t.contact_id !== cid && !gone.includes(t.deal_id ?? ""));
    },
    async dealsOfContact(_ws, cid) { return s.deals.filter((d) => d.contact_id === cid).map(withContact); },

    async catalog() { return clone([...s.catalog].sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name))); },
    async saveCatalogItem(_ws, item) {
      return save(s.catalog, item, () => ({ id: "", name: "", description: null, unit_price: null, unit: "item", active: true, created_at: "" }));
    },
    async deleteCatalogItem(_ws, iid) { s.catalog = s.catalog.filter((x) => x.id !== iid); },

    async tasks(_ws, opts = {}) {
      return clone(
        s.tasks
          .filter((t) => (!opts.open || !t.done) && linked(t, opts))
          .sort((a, b) => Number(a.done) - Number(b.done) || (a.due_at ?? "9").localeCompare(b.due_at ?? "9")),
      );
    },
    async saveTask(_ws, t) {
      return save(s.tasks, t, () => ({ id: "", title: "", due_at: null, done: false, deal_id: null, contact_id: null, created_at: "" }));
    },
    async deleteTask(_ws, tid) { s.tasks = s.tasks.filter((x) => x.id !== tid); },

    async activities(_ws, l) { return clone(s.activities.filter((a) => linked(a, l))); },
    async addActivity(_ws, a) {
      s.activities.unshift({ id: id(), deal_id: null, contact_id: null, ...clone(a), created_at: new Date().toISOString() });
      touch(a.deal_id);
    },
    async aiUsage() { return { left: 0, limit: 0, today: 0 }; },
  };
}

export const DEMO_USER = { id: ME, email: "demo@example.com" };
