// The Hub's records, as the app works with them. Column names follow the
// database (supabase/migrations/20261113000000_business_hub.sql).

export type HubLang = "en" | "fr" | "de";
export type Role = "owner" | "admin" | "member";

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

export const CONTACT_KINDS = ["lead", "customer", "partner", "supplier", "other"] as const;
export type ContactKind = (typeof CONTACT_KINDS)[number];
export const CONTACT_LANGS = ["en", "fr", "de", "lb", "pt", "it", "nl"] as const;

export interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
  job_title: string | null;
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

export const UNITS = ["item", "hour", "day", "month", "year", "project"] as const;

export interface CatalogItem {
  id: string;
  name: string;
  description: string | null;
  unit_price: number | null;
  unit: (typeof UNITS)[number];
  active: boolean;
  created_at: string;
}

export interface Deal {
  id: string;
  title: string;
  contact_id: string;
  stage_id: string | null;
  value: number | null;
  expected_close: string | null;
  needs: string | null;
  source: string | null;
  notes: string | null;
  score: number | null;
  ai_summary: string | null;
  ai_updated_at: string | null;
  last_activity_at: string;
  created_at: string;
  contact?: Pick<Contact, "id" | "first_name" | "last_name" | "company" | "email" | "phone" | "language" | "kind">;
}

export interface Task {
  id: string;
  title: string;
  due_at: string | null;
  done: boolean;
  deal_id: string | null;
  contact_id: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  kind: "note" | "call" | "email" | "meeting" | "ai" | "stage";
  body: string;
  deal_id: string | null;
  contact_id: string | null;
  created_at: string;
}

export interface AiUsage {
  left: number;
  limit: number;
  today: number;
}

export type Links = { deal_id?: string | null; contact_id?: string | null };

/** Everything the screens need from storage. Two implementations: Supabase and the demo. */
export interface Repo {
  readonly demo: boolean;
  myWorkspaces(): Promise<Workspace[]>;
  createWorkspace(name: string, locale: HubLang, ownerName: string): Promise<string>;
  renameWorkspace(ws: string, name: string): Promise<void>;
  members(ws: string): Promise<Member[]>;
  addMember(ws: string, email: string, role: "admin" | "member"): Promise<void>;
  updateMemberRole(ws: string, userId: string, role: Role): Promise<void>;
  removeMember(ws: string, userId: string): Promise<void>;

  stages(ws: string): Promise<Stage[]>;
  deals(ws: string): Promise<Deal[]>;
  deal(ws: string, id: string): Promise<Deal | null>;
  saveDeal(ws: string, deal: Partial<Deal>): Promise<string>;
  deleteDeal(ws: string, id: string): Promise<void>;

  contacts(ws: string, q?: string): Promise<Contact[]>;
  contact(ws: string, id: string): Promise<Contact | null>;
  saveContact(ws: string, c: Partial<Contact>): Promise<string>;
  deleteContact(ws: string, id: string): Promise<void>;
  dealsOfContact(ws: string, contactId: string): Promise<Deal[]>;

  catalog(ws: string): Promise<CatalogItem[]>;
  saveCatalogItem(ws: string, item: Partial<CatalogItem>): Promise<string>;
  deleteCatalogItem(ws: string, id: string): Promise<void>;

  tasks(ws: string, opts?: { open?: boolean } & Links): Promise<Task[]>;
  saveTask(ws: string, t: Partial<Task>): Promise<string>;
  deleteTask(ws: string, id: string): Promise<void>;

  activities(ws: string, links: Links): Promise<Activity[]>;
  addActivity(ws: string, a: Pick<Activity, "kind" | "body"> & Links): Promise<void>;

  aiUsage(ws: string): Promise<AiUsage>;
}
