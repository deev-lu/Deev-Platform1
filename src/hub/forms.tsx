import { useEffect, useState, type FormEvent } from "react";
import { useHub, useWs } from "./session";
import { Button, Check, Dialog, Field, Select, Status, TextArea, fullName, numOrNull } from "./ui";
import { CONTACT_KINDS, CONTACT_LANGS, type Contact, type Deal, type Links, type Stage } from "./types";
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
      <Field label={t.contacts.company} autoComplete="off" maxLength={120} value={value.company ?? ""} onChange={set("company")} />
      <Field label={t.contacts.jobTitle} autoComplete="off" maxLength={80} value={value.job_title ?? ""} onChange={set("job_title")} />
      <Field label={t.contacts.email} type="email" autoComplete="off" maxLength={254} value={value.email ?? ""} onChange={set("email")} />
      <Field label={t.contacts.phone} type="tel" autoComplete="off" maxLength={40} value={value.phone ?? ""} onChange={set("phone")} />
      <Select
        label={t.contacts.kind}
        value={value.kind ?? "lead"}
        onChange={set("kind")}
        options={CONTACT_KINDS.map((k) => ({ value: k, label: t.contacts.kinds[k] }))}
      />
      <Select
        label={t.contacts.language}
        value={value.language ?? ""}
        onChange={set("language")}
        options={[{ value: "", label: "–" }, ...CONTACT_LANGS.map((l) => ({ value: l, label: t.contacts.langs[l] }))]}
      />
      <Field label={t.contacts.source} maxLength={80} placeholder={t.deal.sourcePh} value={value.source ?? ""} onChange={set("source")} className="sm:col-span-2" />
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
  const n = (v: unknown) => (typeof v === "string" ? v.trim() || null : (v ?? null)) as string | null;
  const consentChanged = Boolean(c.marketing_consent) !== Boolean(before?.marketing_consent);
  return {
    ...(c.id ? { id: c.id } : {}),
    first_name: (c.first_name ?? "").trim(),
    last_name: n(c.last_name),
    company: n(c.company),
    job_title: n(c.job_title),
    email: n(c.email),
    phone: n(c.phone),
    language: n(c.language),
    kind: c.kind ?? "lead",
    source: n(c.source),
    notes: n(c.notes),
    marketing_consent: Boolean(c.marketing_consent),
    consent_at: consentChanged ? (c.marketing_consent ? new Date().toISOString() : null) : (before?.consent_at ?? null),
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
      setC(initial ?? { kind: "lead" });
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

// ── Deal ────────────────────────────────────────────────────

interface DealDraft {
  title: string;
  stage_id: string;
  value: string;
  expected_close: string;
  needs: string;
  source: string;
  notes: string;
}

const draftOf = (d: Partial<Deal> | null | undefined, stages: Stage[]): DealDraft => ({
  title: d?.title ?? "",
  stage_id: d?.stage_id ?? stages[0]?.id ?? "",
  value: d?.value != null ? String(d.value) : "",
  expected_close: d?.expected_close ?? "",
  needs: d?.needs ?? "",
  source: d?.source ?? "",
  notes: d?.notes ?? "",
});

/** The contact's label in a list: name, then company. */
export const contactLabel = (c: Pick<Contact, "first_name" | "last_name" | "company">) =>
  fullName(c) + (c.company ? ` · ${c.company}` : "");

export function DealDialog({
  open,
  stages,
  initial,
  contactId,
  onClose,
  onSaved,
}: {
  open: boolean;
  stages: Stage[];
  initial?: Deal | null;
  /** Fixed contact (from a contact page); otherwise pick one or create one. */
  contactId?: string;
  onClose: () => void;
  onSaved: (id: string) => void;
}) {
  const { t, repo } = useHub();
  const ws = useWs();
  const [d, setD] = useState<DealDraft>(draftOf(null, stages));
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pick, setPick] = useState<string>("");
  const [newContact, setNewContact] = useState<Partial<Contact>>({ kind: "lead" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setD(draftOf(initial, stages));
    setErr(null);
    setPick(initial?.contact_id ?? contactId ?? "");
    setNewContact({ kind: "lead" });
    if (!initial && !contactId) repo.contacts(ws.id).then(setContacts).catch(() => setContacts([]));
  }, [open, initial, contactId, stages, repo, ws.id]);

  const set = (k: keyof DealDraft) => (e: { target: { value: string } }) => setD({ ...d, [k]: e.target.value });
  const needContact = !initial && !contactId;
  const creating = needContact && !pick;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      let cid = initial?.contact_id ?? contactId ?? pick;
      if (creating) cid = await repo.saveContact(ws.id, cleanContact(newContact));
      const id = await repo.saveDeal(ws.id, {
        ...(initial ? { id: initial.id } : {}),
        title: d.title.trim(),
        contact_id: cid,
        stage_id: d.stage_id || null,
        value: numOrNull(d.value),
        expected_close: d.expected_close || null,
        needs: d.needs.trim() || null,
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

  const valid = Boolean(d.title.trim()) && (!creating || Boolean(newContact.first_name?.trim()));

  return (
    <Dialog open={open} onClose={onClose} title={initial ? t.edit : t.pipeline.newDeal} wide>
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.required}</p>
        <Field label={t.deal.name} required maxLength={160} placeholder={t.deal.namePh} value={d.title} onChange={set("title")} />
        {needContact && (
          <fieldset className="m-0 p-4 rounded-[var(--radius-1)] border border-[var(--line)] flex flex-col gap-4">
            <legend className="px-1 text-[0.8125rem] font-semibold text-[var(--text-hi)]">{t.deal.contact}</legend>
            <Select
              label={t.deal.pickContact}
              value={pick}
              onChange={(e) => setPick(e.target.value)}
              options={[{ value: "", label: `– ${t.deal.newContact} –` }, ...contacts.map((c) => ({ value: c.id, label: contactLabel(c) }))]}
            />
            {creating && <ContactFields value={newContact} onChange={setNewContact} />}
          </fieldset>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <Select label={t.deal.stage} value={d.stage_id} onChange={set("stage_id")} options={stages.map((s) => ({ value: s.id, label: s.name }))} />
          <Field label={t.deal.value} inputMode="decimal" value={d.value} onChange={set("value")} />
          <Field label={t.deal.expectedClose} type="date" value={d.expected_close} onChange={set("expected_close")} />
          <Field label={t.deal.source} placeholder={t.deal.sourcePh} maxLength={80} value={d.source} onChange={set("source")} />
          <TextArea label={t.deal.needs} placeholder={t.deal.needsPh} maxLength={5000} value={d.needs} onChange={set("needs")} className="sm:col-span-2" />
          <TextArea label={t.deal.notes} maxLength={5000} rows={3} value={d.notes} onChange={set("notes")} className="sm:col-span-2" />
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

export function TaskQuickAdd({ links, onSaved }: { links: Links; onSaved: () => void }) {
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
      await repo.saveTask(ws.id, { title: title.trim(), due_at: due ? new Date(due).toISOString() : null, done: false, deal_id: null, contact_id: null, ...links });
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
