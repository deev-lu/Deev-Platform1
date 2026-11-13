import type { Activity, Contact, HubLang, Lead, Links, Member, Property, Repo, Stage, Task, Workspace } from "./types";

/**
 * The demo: the whole Hub in memory, with sample data, so it can be shown
 * before (and besides) a real account. Nothing is stored or sent; a reload
 * starts over. Every name, address and figure here is invented, and the app
 * says so on every screen while the demo runs. The AI agents do not run in
 * the demo (api/hub needs a real, signed-in account).
 */

const WS = "00000000-0000-4000-8000-00000000d3e0";
const ME = "00000000-0000-4000-8000-0000000000aa";
const id = () => crypto.randomUUID();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/** The starting pipeline, as create_workspace() writes it for a real agency. */
const STAGE_NAMES: Record<HubLang, string[]> = {
  en: ["New", "Contacted", "Viewing", "Offer", "Won", "Lost"],
  fr: ["Nouveau", "Contacté", "Visite", "Offre", "Gagné", "Perdu"],
  de: ["Neu", "Kontaktiert", "Besichtigung", "Angebot", "Gewonnen", "Verloren"],
};

function seed(lang: HubLang) {
  const stages: Stage[] = STAGE_NAMES[lang].map((name, i) => ({
    id: id(),
    name,
    position: i + 1,
    kind: i === 4 ? "won" : i === 5 ? "lost" : "open",
  }));

  const c = (first_name: string, last_name: string, kind: Contact["kind"], language: string, days: number, extra: Partial<Contact> = {}): Contact => ({
    id: id(), first_name, last_name, kind, language, email: `${first_name}.${last_name}@example.com`.toLowerCase(),
    phone: null, source: "Website", notes: null, marketing_consent: false, consent_at: null, created_at: daysAgo(days), ...extra,
  });
  const contacts: Contact[] = [
    c("Claire", "Weber", "buyer", "fr", 2, { phone: "+352 600 000 101", source: "Portal enquiry" }),
    c("Tom", "Schmit", "buyer", "lb", 6),
    c("Ana", "Ferreira", "tenant", "pt", 1, { source: "Walk-in" }),
    c("Jonas", "Becker", "investor", "de", 14, { notes: "Owns two flats in Esch; looking for a third." }),
    c("Sophie", "Muller", "seller", "fr", 20),
    c("Liam", "O'Brien", "tenant", "en", 3, { source: "Referral" }),
  ];

  const p = (title: string, kind: Property["kind"], deal: Property["deal"], price: number, surface: number, bedrooms: number, city: string, postcode: string, extra: Partial<Property> = {}): Property => ({
    id: id(), reference: `D-${Math.floor(1000 + Math.random() * 9000)}`, title, kind, deal, status: "available", price, surface_m2: surface,
    rooms: bedrooms + 1, bedrooms, bathrooms: 1, address: null, postcode, city, country: "LU", energy_class: "B", features: [],
    description: {}, created_at: daysAgo(10), ...extra,
  });
  const properties: Property[] = [
    p("Two-bedroom apartment with balcony", "apartment", "sale", 640000, 82, 2, "Strassen", "8010", { features: ["balcony", "lift", "parking space"] }),
    p("Family house with garden", "house", "sale", 1150000, 165, 4, "Bertrange", "8070", { energy_class: "C", features: ["garden", "garage"] }),
    p("Studio near the tram", "apartment", "rent", 1450, 38, 0, "Luxembourg-Kirchberg", "1855", { features: ["furnished"] }),
    p("Three-bedroom apartment, top floor", "apartment", "sale", 790000, 104, 3, "Mamer", "8210", { energy_class: "A", features: ["terrace", "lift"] }),
    p("One-bedroom flat", "apartment", "rent", 1850, 55, 1, "Luxembourg-Bonnevoie", "1611"),
    p("Building plot", "land", "sale", 520000, 600, 0, "Mersch", "7520", { status: "under_offer" }),
  ];

  const lead = (contact: Contact, stage: number, extra: Partial<Lead>): Lead => ({
    id: id(), contact_id: contact.id, stage_id: stages[stage].id, intent: "buy", budget_min: null, budget_max: null,
    locations: [], property_kinds: [], min_bedrooms: null, min_surface_m2: null, timeline: null, source: contact.source,
    notes: null, score: null, ai_summary: null, ai_updated_at: null, property_id: null,
    last_activity_at: contact.created_at, created_at: contact.created_at, ...extra,
  });
  const leads: Lead[] = [
    lead(contacts[0], 0, { budget_min: 550000, budget_max: 680000, locations: ["Strassen", "Bertrange"], property_kinds: ["apartment"], min_bedrooms: 2, timeline: "Within 3 months", notes: "Mortgage pre-approval in progress." }),
    lead(contacts[1], 1, { budget_max: 1200000, locations: ["Bertrange", "Mamer"], property_kinds: ["house"], min_bedrooms: 3 }),
    lead(contacts[2], 2, { intent: "rent", budget_max: 1600, locations: ["Kirchberg"], property_kinds: ["apartment"], timeline: "From next month" }),
    lead(contacts[3], 3, { intent: "invest", budget_max: 700000, property_kinds: ["apartment"], score: 72, ai_summary: "Experienced investor with a clear budget, wants a rentable apartment.", ai_updated_at: daysAgo(1) }),
    lead(contacts[4], 0, { intent: "sell", notes: "Wants a valuation of her house in Hesperange." }),
    lead(contacts[5], 1, { intent: "rent", budget_max: 2000, locations: ["Bonnevoie", "Gare"], min_bedrooms: 1 }),
  ];

  const tasks: Task[] = [
    { id: id(), title: "Call Claire about the Strassen apartment", due_at: new Date(Date.now() + 3 * 3_600_000).toISOString(), done: false, lead_id: leads[0].id, contact_id: null, property_id: null, created_at: daysAgo(1) },
    { id: id(), title: "Send Ana the studio's floor plan", due_at: daysAhead(1), done: false, lead_id: leads[2].id, contact_id: null, property_id: null, created_at: daysAgo(1) },
    { id: id(), title: "Book a valuation visit with Sophie", due_at: daysAhead(3), done: false, lead_id: leads[4].id, contact_id: null, property_id: null, created_at: daysAgo(2) },
    { id: id(), title: "Photos for the Mamer apartment", due_at: daysAgo(1), done: false, lead_id: null, contact_id: null, property_id: properties[3].id, created_at: daysAgo(4) },
  ];
  const activities: Activity[] = [
    { id: id(), kind: "call", body: "First call: wants two bedrooms, close to the A6.", lead_id: leads[0].id, contact_id: null, property_id: null, created_at: daysAgo(2) },
    { id: id(), kind: "viewing", body: "Viewed the Kirchberg studio, liked it, asked about the deposit.", lead_id: leads[2].id, contact_id: null, property_id: null, created_at: daysAgo(1) },
  ];
  const members: Member[] = [{ user_id: ME, role: "owner", full_name: "Demo user", email: "demo@example.com" }];
  const workspace: Workspace = { id: WS, name: { en: "Demo agency", fr: "Agence démo", de: "Demo-Agentur" }[lang], locale: lang, plan: "early_access", ai_daily_limit: 150, role: "owner" };
  return { stages, contacts, properties, leads, tasks, activities, members, workspace };
}

export function createDemoRepo(lang: HubLang = "en"): Repo {
  const s = seed(lang);
  const withContact = (l: Lead): Lead => {
    const c = s.contacts.find((x) => x.id === l.contact_id);
    return clone({ ...l, contact: c && { id: c.id, first_name: c.first_name, last_name: c.last_name, email: c.email, phone: c.phone, language: c.language, kind: c.kind } });
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
  const linked = <T extends Links>(x: T, l: Links) =>
    (!l.lead_id || x.lead_id === l.lead_id) && (!l.contact_id || x.contact_id === l.contact_id) && (!l.property_id || x.property_id === l.property_id);
  const touch = (leadId?: string | null) => {
    const l = s.leads.find((x) => x.id === leadId);
    if (l) l.last_activity_at = new Date().toISOString();
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
    async leads() { return [...s.leads].sort((a, b) => b.last_activity_at.localeCompare(a.last_activity_at)).map(withContact); },
    async lead(_ws, lid) { const l = s.leads.find((x) => x.id === lid); return l ? withContact(l) : null; },
    async saveLead(_ws, l) {
      const { contact: _c, ...row } = l;
      return save(s.leads, { ...row, last_activity_at: new Date().toISOString() }, () => ({
        id: "", contact_id: "", stage_id: s.stages[0].id, intent: "buy", budget_min: null, budget_max: null, locations: [], property_kinds: [],
        min_bedrooms: null, min_surface_m2: null, timeline: null, source: null, notes: null, score: null, ai_summary: null,
        ai_updated_at: null, property_id: null, last_activity_at: new Date().toISOString(), created_at: "",
      }));
    },
    async deleteLead(_ws, lid) {
      s.leads = s.leads.filter((x) => x.id !== lid);
      s.tasks = s.tasks.filter((x) => x.lead_id !== lid);
      s.activities = s.activities.filter((x) => x.lead_id !== lid);
    },

    async contacts(_ws, q) {
      const t = q?.trim().toLowerCase();
      return clone(s.contacts.filter((c) => !t || [c.first_name, c.last_name, c.email, c.phone].some((v) => v?.toLowerCase().includes(t))));
    },
    async contact(_ws, cid) { return clone(s.contacts.find((x) => x.id === cid) ?? null); },
    async saveContact(_ws, c) {
      return save(s.contacts, c, () => ({ id: "", first_name: "", last_name: null, email: null, phone: null, language: null, kind: "buyer", source: null, notes: null, marketing_consent: false, consent_at: null, created_at: "" }));
    },
    async deleteContact(_ws, cid) {
      const gone = s.leads.filter((l) => l.contact_id === cid).map((l) => l.id);
      s.contacts = s.contacts.filter((x) => x.id !== cid);
      s.leads = s.leads.filter((l) => l.contact_id !== cid);
      s.tasks = s.tasks.filter((t) => t.contact_id !== cid && !gone.includes(t.lead_id ?? ""));
    },
    async leadsOfContact(_ws, cid) { return s.leads.filter((l) => l.contact_id === cid).map(withContact); },

    async properties() { return clone(s.properties); },
    async property(_ws, pid) { return clone(s.properties.find((x) => x.id === pid) ?? null); },
    async saveProperty(_ws, p) {
      return save(s.properties, p, () => ({ id: "", reference: null, title: "", kind: "apartment", deal: "sale", status: "available", price: null, surface_m2: null, rooms: null, bedrooms: null, bathrooms: null, address: null, postcode: null, city: null, country: "LU", energy_class: null, features: [], description: {}, created_at: "" }));
    },
    async deleteProperty(_ws, pid) { s.properties = s.properties.filter((x) => x.id !== pid); },

    async tasks(_ws, opts = {}) {
      return clone(
        s.tasks
          .filter((t) => (!opts.open || !t.done) && linked(t, opts))
          .sort((a, b) => Number(a.done) - Number(b.done) || (a.due_at ?? "9").localeCompare(b.due_at ?? "9")),
      );
    },
    async saveTask(_ws, t) {
      return save(s.tasks, t, () => ({ id: "", title: "", due_at: null, done: false, lead_id: null, contact_id: null, property_id: null, created_at: "" }));
    },
    async deleteTask(_ws, tid) { s.tasks = s.tasks.filter((x) => x.id !== tid); },

    async activities(_ws, l) { return clone(s.activities.filter((a) => linked(a, l))); },
    async addActivity(_ws, a) {
      s.activities.unshift({ id: id(), lead_id: null, contact_id: null, property_id: null, ...clone(a), created_at: new Date().toISOString() });
      touch(a.lead_id);
    },
    async aiUsage() { return { left: 0, limit: 0, today: 0 }; },
  };
}

export const DEMO_USER = { id: ME, email: "demo@example.com" };
