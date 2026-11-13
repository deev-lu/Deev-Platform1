// The Hub's records, as the app works with them. Column names follow the
// database (supabase/migrations/20261113000000_business_hub.sql).

export type HubLang = "en" | "fr" | "de";
export type Role = "owner" | "admin" | "agent";

export interface Workspace {
  id: string;
  name: string;
  locale: HubLang;
  plan: string;
  ai_daily_limit: number;
  role: Role;
}

export interface Member {
  user_id: string;
  role: Role;
  full_name: string | null;
  email: string | null;
}

export interface Stage {
  id: string;
  name: string;
  position: number;
  kind: "open" | "won" | "lost";
}

export const CONTACT_KINDS = ["buyer", "seller", "tenant", "landlord", "investor", "other"] as const;
export type ContactKind = (typeof CONTACT_KINDS)[number];
export const CONTACT_LANGS = ["en", "fr", "de", "lb", "pt", "it", "nl"] as const;

export interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  language: string | null;
  kind: ContactKind;
  source: string | null;
  notes: string | null;
  marketing_consent: boolean;
  consent_at: string | null;
  created_at: string;
}

export const PROPERTY_KINDS = ["apartment", "house", "land", "commercial", "office", "parking", "other"] as const;
export const PROPERTY_STATUSES = ["draft", "available", "under_offer", "sold", "rented", "withdrawn"] as const;
export const ENERGY_CLASSES = ["A+", "A", "B", "C", "D", "E", "F", "G", "H", "I"] as const;

export interface Property {
  id: string;
  reference: string | null;
  title: string;
  kind: (typeof PROPERTY_KINDS)[number];
  deal: "sale" | "rent";
  status: (typeof PROPERTY_STATUSES)[number];
  price: number | null;
  surface_m2: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  address: string | null;
  postcode: string | null;
  city: string | null;
  country: string;
  energy_class: string | null;
  features: string[];
  description: Partial<Record<HubLang, string>>;
  created_at: string;
}

export const INTENTS = ["buy", "rent", "sell", "let", "invest"] as const;

export interface Lead {
  id: string;
  contact_id: string;
  stage_id: string | null;
  intent: (typeof INTENTS)[number];
  budget_min: number | null;
  budget_max: number | null;
  locations: string[];
  property_kinds: string[];
  min_bedrooms: number | null;
  min_surface_m2: number | null;
  timeline: string | null;
  source: string | null;
  notes: string | null;
  score: number | null;
  ai_summary: string | null;
  ai_updated_at: string | null;
  property_id: string | null;
  last_activity_at: string;
  created_at: string;
  contact?: Pick<Contact, "id" | "first_name" | "last_name" | "email" | "phone" | "language" | "kind">;
}

export interface Task {
  id: string;
  title: string;
  due_at: string | null;
  done: boolean;
  lead_id: string | null;
  contact_id: string | null;
  property_id: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  kind: "note" | "call" | "email" | "meeting" | "viewing" | "ai" | "stage";
  body: string;
  lead_id: string | null;
  contact_id: string | null;
  property_id: string | null;
  created_at: string;
}

export interface AiUsage {
  left: number;
  limit: number;
  today: number;
}

export type Links = { lead_id?: string | null; contact_id?: string | null; property_id?: string | null };

/** Everything the screens need from storage. Two implementations: Supabase and the demo. */
export interface Repo {
  readonly demo: boolean;
  myWorkspaces(): Promise<Workspace[]>;
  createWorkspace(name: string, locale: HubLang, ownerName: string): Promise<string>;
  renameWorkspace(ws: string, name: string): Promise<void>;
  members(ws: string): Promise<Member[]>;
  addMember(ws: string, email: string, role: "admin" | "agent"): Promise<void>;
  updateMemberRole(ws: string, userId: string, role: Role): Promise<void>;
  removeMember(ws: string, userId: string): Promise<void>;

  stages(ws: string): Promise<Stage[]>;
  leads(ws: string): Promise<Lead[]>;
  lead(ws: string, id: string): Promise<Lead | null>;
  saveLead(ws: string, lead: Partial<Lead>): Promise<string>;
  deleteLead(ws: string, id: string): Promise<void>;

  contacts(ws: string, q?: string): Promise<Contact[]>;
  contact(ws: string, id: string): Promise<Contact | null>;
  saveContact(ws: string, c: Partial<Contact>): Promise<string>;
  deleteContact(ws: string, id: string): Promise<void>;
  leadsOfContact(ws: string, contactId: string): Promise<Lead[]>;

  properties(ws: string): Promise<Property[]>;
  property(ws: string, id: string): Promise<Property | null>;
  saveProperty(ws: string, p: Partial<Property>): Promise<string>;
  deleteProperty(ws: string, id: string): Promise<void>;

  tasks(ws: string, opts?: { open?: boolean } & Links): Promise<Task[]>;
  saveTask(ws: string, t: Partial<Task>): Promise<string>;
  deleteTask(ws: string, id: string): Promise<void>;

  activities(ws: string, links: Links): Promise<Activity[]>;
  addActivity(ws: string, a: Pick<Activity, "kind" | "body"> & Links): Promise<void>;

  aiUsage(ws: string): Promise<AiUsage>;
}
