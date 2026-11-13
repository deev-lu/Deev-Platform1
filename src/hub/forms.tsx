import { useEffect, useState, type FormEvent } from "react";
import { useHub, useWs } from "./session";
import { Button, Check, CheckGroup, Dialog, Field, Select, Status, TextArea, fullName, numOrNull, splitList, toLocalInput } from "./ui";
import { CONTACT_KINDS, CONTACT_LANGS, INTENTS, PROPERTY_KINDS, type Contact, type Lead, type Stage, type Task } from "./types";
import { RepoError } from "./supabase";

const errText = (t: ReturnType<typeof useHub>["t"], e: unknown) =>
  e instanceof RepoError && e.code === "forbidden" ? t.forbidden : t.error;

// ── Contact ─────────────────────────────────────────────────

export function ContactFields({ value, onChange }: { value: Partial<Contact>; onChange: (c: Partial<Contact>) => void }) {
  const { t } = useHub();
  const set = (k: keyof Contact) => (e: { target: { value: string } }) => onChange({ ...value, [k]: e.target.value });
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label={t.contacts.first} required autoComplete="off" maxLength={80} value={value.first_name ?? ""} onChange={set("first_name")} />
      <Field label={t.contacts.last} autoComplete="off" maxLength={80} value={value.last_name ?? ""} onChange={set("last_name")} />
      <Field label={t.contacts.email} type="email" autoComplete="off" maxLength={254} value={value.email ?? ""} onChange={set("email")} />
      <Field label={t.contacts.phone} type="tel" autoComplete="off" maxLength={40} value={value.phone ?? ""} onChange={set("phone")} />
      <Select
        label={t.contacts.kind}
        value={value.kind ?? "buyer"}
        onChange={set("kind")}
        options={CONTACT_KINDS.map((k) => ({ value: k, label: t.contacts.kinds[k] }))}
      />
      <Select
        label={t.contacts.language}
        value={value.language ?? ""}
        onChange={set("language")}
        options={[{ value: "", label: "–" }, ...CONTACT_LANGS.map((l) => ({ value: l, label: t.contacts.langs[l] }))]}
      />
      <Field label={t.contacts.source} maxLength={80} placeholder={t.lead.sourcePh} value={value.source ?? ""} onChange={set("source")} className="sm:col-span-2" />
      <TextArea label={t.contacts.notes} maxLength={5000} value={value.notes ?? ""} onChange={set("notes")} className="sm:col-span-2" />
      <Check
        label={t.contacts.consent}
        checked={Boolean(value.marketing_consent)}
        onChange={(e) => onChange({ ...value, marketing_consent: e.target.checked })}
        className="sm:col-span-2"
      />
    </div>
  );
}

/** Empty strings become nulls, and consent keeps its date. */
export function cleanContact(c: Partial<Contact>, before?: Contact | null): Partial<Contact> {
  const n = (v: unknown) => (typeof v === "string" ? v.trim() || null : v ?? null);
  const consentChanged = Boolean(c.marketing_consent) !== Boolean(before?.marketing_consent);
  return {
    ...(c.id ? { id: c.id } : {}),
    first_name: (c.first_name ?? "").trim(),
    last_name: n(c.last_name) as string | null,
    email: n(c.email) as string | null,
    phone: n(c.phone) as string | null,
    language: n(c.language) as string | null,
    kind: c.kind ?? "buyer",
    source: n(c.source) as string | null,
    notes: n(c.notes) as string | null,
    marketing_consent: Boolean(c.marketing_consent),
    consent_at: consentChanged ? (c.marketing_consent ? new Date().toISOString() : null) : before?.consent_at ?? null,
  };
}

export function ContactDialog({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  initial?: Contact | null;
  onClose: () => void;
  onSaved: (id: string) => void;
}) {
  const { t, repo } = useHub();
  const ws = useWs();
  const [c, setC] = useState<Partial<Contact>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (open) {
      setC(initial ?? { kind: "buyer" });
      setErr(null);
    }
  }, [open, initial]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const id = await repo.saveContact(ws.id, cleanContact(c, initial));
      onSaved(id);
      onClose();
    } catch (x) {
      setErr(errText(t, x));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={initial ? fullName(initial) : t.contacts.new} wide>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.required}</p>
        <ContactFields value={c} onChange={setC} />
        <Status message={err} tone="bad" />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>{t.cancel}</Button>
          <Button type="submit" variant="primary" disabled={busy || !c.first_name?.trim()}>
            {busy ? t.saving : t.save}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// ── Lead ────────────────────────────────────────────────────

interface LeadDraft {
  intent: Lead["intent"];
  stage_id: string;
  budget_min: string;
  budget_max: string;
  locations: string;
  property_kinds: string[];
  min_bedrooms: string;
  min_surface_m2: string;
  timeline: string;
  source: string;
  notes: string;
}

const draftOf = (l: Partial<Lead> | null | undefined, stages: Stage[]): LeadDraft => ({
  intent: l?.intent ?? "buy",
  stage_id: l?.stage_id ?? stages[0]?.id ?? "",
  budget_min: l?.budget_min != null ? String(l.budget_min) : "",
  budget_max: l?.budget_max != null ? String(l.budget_max) : "",
  locations: (l?.locations ?? []).join(", "),
  property_kinds: l?.property_kinds ?? [],
  min_bedrooms: l?.min_bedrooms != null ? String(l.min_bedrooms) : "",
  min_surface_m2: l?.min_surface_m2 != null ? String(l.min_surface_m2) : "",
  timeline: l?.timeline ?? "",
  source: l?.source ?? "",
  notes: l?.notes ?? "",
});

export function LeadDialog({
  open,
  stages,
  initial,
  contactId,
  onClose,
  onSaved,
}: {
  open: boolean;
  stages: Stage[];
  initial?: Lead | null;
  /** Fixed contact (from a contact page); otherwise pick one or create one. */
  contactId?: string;
  onClose: () => void;
  onSaved: (id: string) => void;
}) {
  const { t, repo } = useHub();
  const ws = useWs();
  const [d, setD] = useState<LeadDraft>(draftOf(null, stages));
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pick, setPick] = useState<string>("");
  const [newContact, setNewContact] = useState<Partial<Contact>>({ kind: "buyer" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setD(draftOf(initial, stages));
    setErr(null);
    setPick(initial?.contact_id ?? contactId ?? "");
    setNewContact({ kind: "buyer" });
    if (!initial && !contactId) repo.contacts(ws.id).then(setContacts).catch(() => setContacts([]));
  }, [open, initial, contactId, stages, repo, ws.id]);

  const set = (k: keyof LeadDraft) => (e: { target: { value: string } }) => setD({ ...d, [k]: e.target.value });
  const needContact = !initial && !contactId;
  const creating = needContact && !pick;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      let cid = initial?.contact_id ?? contactId ?? pick;
      if (creating) cid = await repo.saveContact(ws.id, cleanContact(newContact));
      const id = await repo.saveLead(ws.id, {
        ...(initial ? { id: initial.id } : {}),
        contact_id: cid,
        stage_id: d.stage_id || null,
        intent: d.intent,
        budget_min: numOrNull(d.budget_min),
        budget_max: numOrNull(d.budget_max),
        locations: splitList(d.locations),
        property_kinds: d.property_kinds,
        min_bedrooms: numOrNull(d.min_bedrooms),
        min_surface_m2: numOrNull(d.min_surface_m2),
        timeline: d.timeline.trim() || null,
        source: d.source.trim() || null,
        notes: d.notes.trim() || null,
      });
      onSaved(id);
      onClose();
    } catch (x) {
      setErr(errText(t, x));
    } finally {
      setBusy(false);
    }
  };

  const valid = !creating || Boolean(newContact.first_name?.trim());

  return (
    <Dialog open={open} onClose={onClose} title={initial ? t.edit : t.pipeline.newLead} wide>
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.required}</p>
        {needContact && (
          <fieldset className="m-0 p-4 rounded-[var(--radius-1)] border border-[var(--line)] flex flex-col gap-4">
            <legend className="px-1 text-[0.8125rem] font-semibold text-[var(--text-hi)]">{t.lead.contact}</legend>
            <Select
              label={t.lead.pickContact}
              value={pick}
              onChange={(e) => setPick(e.target.value)}
              options={[{ value: "", label: `– ${t.lead.newContact} –` }, ...contacts.map((c) => ({ value: c.id, label: fullName(c) + (c.email ? ` · ${c.email}` : "") }))]}
            />
            {creating && <ContactFields value={newContact} onChange={setNewContact} />}
          </fieldset>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <Select label={t.lead.intent} value={d.intent} onChange={set("intent")} options={INTENTS.map((i) => ({ value: i, label: t.lead.intents[i] }))} />
          <Select label={t.lead.stage} value={d.stage_id} onChange={set("stage_id")} options={stages.map((s) => ({ value: s.id, label: s.name }))} />
          <Field label={t.lead.budgetMin} inputMode="numeric" value={d.budget_min} onChange={set("budget_min")} />
          <Field label={t.lead.budgetMax} inputMode="numeric" value={d.budget_max} onChange={set("budget_max")} />
          <Field label={t.lead.locations} hint={t.lead.locationsHint} value={d.locations} onChange={set("locations")} className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <CheckGroup
              legend={t.lead.kinds}
              value={d.property_kinds}
              onChange={(v) => setD({ ...d, property_kinds: v })}
              options={PROPERTY_KINDS.map((k) => ({ value: k, label: t.props.kinds[k] }))}
            />
          </div>
          <Field label={t.lead.minBedrooms} inputMode="numeric" value={d.min_bedrooms} onChange={set("min_bedrooms")} />
          <Field label={t.lead.minSurface} inputMode="numeric" value={d.min_surface_m2} onChange={set("min_surface_m2")} />
          <Field label={t.lead.timeline} placeholder={t.lead.timelinePh} maxLength={80} value={d.timeline} onChange={set("timeline")} />
          <Field label={t.lead.source} placeholder={t.lead.sourcePh} maxLength={80} value={d.source} onChange={set("source")} />
          <TextArea label={t.lead.notes} maxLength={5000} value={d.notes} onChange={set("notes")} className="sm:col-span-2" />
        </div>
        <Status message={err} tone="bad" />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>{t.cancel}</Button>
          <Button type="submit" variant="primary" disabled={busy || !valid}>
            {busy ? t.saving : t.save}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// ── Task ────────────────────────────────────────────────────

export function TaskQuickAdd({ links, onSaved }: { links: Pick<Task, "lead_id" | "contact_id" | "property_id"> | Record<string, never>; onSaved: () => void }) {
  const { t, repo } = useHub();
  const ws = useWs();
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await repo.saveTask(ws.id, { title: title.trim(), due_at: due ? new Date(due).toISOString() : null, done: false, ...links });
      setTitle("");
      setDue("");
      setErr(null);
      onSaved();
    } catch (x) {
      setErr(errText(t, x));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row sm:items-end gap-3" noValidate>
      <Field label={t.tasks.new} maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1" />
      <Field label={t.tasks.due} type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} />
      <Button type="submit" variant="primary" disabled={busy || !title.trim()}>
        {t.add}
      </Button>
      {err && <Status message={err} tone="bad" />}
    </form>
  );
}

export { toLocalInput };
