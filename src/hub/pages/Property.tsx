import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useHub, useWs } from "../session";
import { agentErrorKey, callAgent } from "../agent";
import { Button, Card, CheckGroup, Field, LoadError, Loading, PageHeader, Select, Status, TextArea, numOrNull, splitList, useLoad } from "../ui";
import { TaskQuickAdd } from "../forms";
import { TaskList, Timeline } from "../widgets";
import { ENERGY_CLASSES, PROPERTY_KINDS, PROPERTY_STATUSES, type HubLang, type Property } from "../types";
import { HUB_LANGS, HUB_LANG_NAMES } from "../i18n";

type Draft = Record<
  "reference" | "title" | "kind" | "deal" | "status" | "price" | "surface_m2" | "rooms" | "bedrooms" | "bathrooms" | "address" | "postcode" | "city" | "energy_class" | "features",
  string
> & { description: Partial<Record<HubLang, string>> };

const toDraft = (p: Partial<Property> | null): Draft => ({
  reference: p?.reference ?? "",
  title: p?.title ?? "",
  kind: p?.kind ?? "apartment",
  deal: p?.deal ?? "sale",
  status: p?.status ?? "available",
  price: p?.price != null ? String(p.price) : "",
  surface_m2: p?.surface_m2 != null ? String(p.surface_m2) : "",
  rooms: p?.rooms != null ? String(p.rooms) : "",
  bedrooms: p?.bedrooms != null ? String(p.bedrooms) : "",
  bathrooms: p?.bathrooms != null ? String(p.bathrooms) : "",
  address: p?.address ?? "",
  postcode: p?.postcode ?? "",
  city: p?.city ?? "",
  energy_class: p?.energy_class ?? "",
  features: (p?.features ?? []).join(", "),
  description: p?.description ?? {},
});

const fromDraft = (d: Draft): Partial<Property> => ({
  reference: d.reference.trim() || null,
  title: d.title.trim(),
  kind: d.kind as Property["kind"],
  deal: d.deal as Property["deal"],
  status: d.status as Property["status"],
  price: numOrNull(d.price),
  surface_m2: numOrNull(d.surface_m2),
  rooms: numOrNull(d.rooms),
  bedrooms: numOrNull(d.bedrooms),
  bathrooms: numOrNull(d.bathrooms),
  address: d.address.trim() || null,
  postcode: d.postcode.trim() || null,
  city: d.city.trim() || null,
  energy_class: d.energy_class || null,
  features: splitList(d.features),
  description: Object.fromEntries(Object.entries(d.description).filter(([, v]) => v?.trim())),
});

export default function PropertyPage() {
  const { id = "new" } = useParams();
  const isNew = id === "new";
  const { t, repo } = useHub();
  const ws = useWs();
  const navigate = useNavigate();
  const [d, setD] = useState<Draft>(toDraft(null));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad: boolean } | null>(null);

  const { data, error, loading, reload } = useLoad(async () => {
    if (isNew) return { p: null, tasks: [], timeline: [] };
    const [p, tasks, timeline] = await Promise.all([
      repo.property(ws.id, id),
      repo.tasks(ws.id, { property_id: id }),
      repo.activities(ws.id, { property_id: id }),
    ]);
    return { p, tasks, timeline };
  }, [ws.id, id, repo]);

  useEffect(() => {
    if (data) setD(toDraft(data.p));
  }, [data]);

  if (loading && !data) return <Loading />;
  if (error || !data) return <LoadError retry={reload} />;
  if (!isNew && !data.p) return <p className="text-[var(--text-mid)]">{t.notFound}</p>;

  const set = (k: keyof Omit<Draft, "description">) => (e: { target: { value: string } }) => setD({ ...d, [k]: e.target.value });

  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!d.title.trim()) return;
    setBusy(true);
    try {
      const saved = await repo.saveProperty(ws.id, { ...(isNew ? {} : { id }), ...fromDraft(d) });
      setMsg({ text: t.saved, bad: false });
      if (isNew) navigate(`/properties/${saved}`, { replace: true });
      else reload();
    } catch {
      setMsg({ text: t.error, bad: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <p className="m-0 mb-3 text-[0.875rem]">
        <Link to="/properties" className="text-[var(--signal-text)] underline underline-offset-2">
          ← {t.props.title}
        </Link>
      </p>
      <PageHeader
        title={isNew ? t.props.new : data.p!.title}
        actions={
          !isNew && (
            <Button
              variant="danger"
              onClick={async () => {
                if (!window.confirm(t.confirmDelete(data.p!.title))) return;
                try {
                  await repo.deleteProperty(ws.id, id);
                  navigate("/properties");
                } catch {
                  setMsg({ text: t.error, bad: true });
                }
              }}
            >
              {t.props.deleteProp}
            </Button>
          )
        }
      />

      <div className="grid xl:grid-cols-[1fr_420px] gap-4 sm:gap-6 items-start">
        <form onSubmit={save} noValidate className="flex flex-col gap-4 sm:gap-6 min-w-0">
          <Card title={t.props.title}>
            <p className="m-0 mb-4 text-[0.8125rem] text-[var(--text-mid)]">{t.required}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t.props.name} required maxLength={160} value={d.title} onChange={set("title")} className="sm:col-span-2" />
              <Field label={t.props.reference} maxLength={40} value={d.reference} onChange={set("reference")} />
              <Select label={t.props.status} value={d.status} onChange={set("status")} options={PROPERTY_STATUSES.map((s) => ({ value: s, label: t.props.statuses[s] }))} />
              <Select label={t.props.kind} value={d.kind} onChange={set("kind")} options={PROPERTY_KINDS.map((k) => ({ value: k, label: t.props.kinds[k] }))} />
              <Select label={t.props.deal} value={d.deal} onChange={set("deal")} options={(["sale", "rent"] as const).map((k) => ({ value: k, label: t.props.deals[k] }))} />
              <Field label={d.deal === "rent" ? t.props.rentPrice : t.props.price} inputMode="decimal" value={d.price} onChange={set("price")} />
              <Field label={t.props.surface} inputMode="decimal" value={d.surface_m2} onChange={set("surface_m2")} />
              <Field label={t.props.rooms} inputMode="numeric" value={d.rooms} onChange={set("rooms")} />
              <Field label={t.props.bedrooms} inputMode="numeric" value={d.bedrooms} onChange={set("bedrooms")} />
              <Field label={t.props.bathrooms} inputMode="numeric" value={d.bathrooms} onChange={set("bathrooms")} />
              <Select label={t.props.energy} value={d.energy_class} onChange={set("energy_class")} options={[{ value: "", label: "–" }, ...ENERGY_CLASSES.map((c) => ({ value: c, label: c }))]} />
              <Field label={t.props.address} maxLength={200} value={d.address} onChange={set("address")} className="sm:col-span-2" />
              <Field label={t.props.postcode} maxLength={12} value={d.postcode} onChange={set("postcode")} />
              <Field label={t.props.city} maxLength={80} value={d.city} onChange={set("city")} />
              <Field label={t.props.features} hint={t.props.featuresHint} value={d.features} onChange={set("features")} className="sm:col-span-2" />
            </div>
          </Card>
          <Card title={t.props.description}>
            <div className="flex flex-col gap-4">
              {HUB_LANGS.map((l) => (
                <TextArea
                  key={l}
                  label={`${t.props.description} · ${HUB_LANG_NAMES[l]}`}
                  rows={5}
                  lang={l}
                  value={d.description[l] ?? ""}
                  onChange={(e) => setD({ ...d, description: { ...d.description, [l]: e.target.value } })}
                />
              ))}
            </div>
          </Card>
          <div className="flex items-center justify-end gap-3">
            <Status message={msg?.text ?? null} tone={msg?.bad ? "bad" : "neutral"} />
            <Button type="submit" variant="primary" disabled={busy || !d.title.trim()}>
              {busy ? t.saving : t.save}
            </Button>
          </div>
        </form>

        <div className="flex flex-col gap-4 sm:gap-6">
          {!isNew && <ListingWriter propertyId={id} onUse={(texts) => setD((x) => ({ ...x, description: { ...x.description, ...texts } }))} />}
          {!isNew && (
            <Card title={t.lead.tasks}>
              <div className="flex flex-col gap-4">
                <TaskQuickAdd links={{ property_id: id, lead_id: null, contact_id: null }} onSaved={reload} />
                <TaskList tasks={data.tasks} onChange={reload} />
              </div>
            </Card>
          )}
          {!isNew && (
            <Card title={t.lead.timelineTitle}>
              <Timeline items={data.timeline} links={{ property_id: id }} onChange={reload} />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

/** The listing writer: facts in, texts out, for the agent to check and keep. */
function ListingWriter({ propertyId, onUse }: { propertyId: string; onUse: (texts: Partial<Record<HubLang, string>>) => void }) {
  const { t, lang, token, demo } = useHub();
  const ws = useWs();
  const [langs, setLangs] = useState<string[]>(["en", "fr", "de"]);
  const [tone, setTone] = useState("neutral");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [out, setOut] = useState<{ headline: string; texts: Partial<Record<HubLang, string>> } | null>(null);

  const run = async () => {
    if (demo) {
      setMsg(t.demo.ai);
      return;
    }
    setBusy(true);
    setMsg(t.agents.running);
    const r = await callAgent<{ headline: string; texts: Partial<Record<HubLang, string>> }>(token, {
      agent: "listing",
      workspace_id: ws.id,
      lang,
      property_id: propertyId,
      languages: langs,
      tone,
      notes,
    });
    setBusy(false);
    if (!r.ok) {
      const k = agentErrorKey(r.error);
      setMsg(k === "forbidden" ? t.forbidden : t.agents[k]);
      return;
    }
    setMsg(null);
    setOut(r.data);
  };

  return (
    <Card title={`✦ ${t.props.writer}`}>
      <p className="m-0 mb-4 text-[0.8125rem] text-[var(--text-mid)]">{t.props.writerHint}</p>
      <div className="flex flex-col gap-4">
        <CheckGroup legend={t.props.writerLangs} value={langs} onChange={setLangs} options={HUB_LANGS.map((l) => ({ value: l, label: HUB_LANG_NAMES[l] }))} />
        <Select label={t.props.tone} value={tone} onChange={(e) => setTone(e.target.value)} options={(["neutral", "warm", "premium"] as const).map((k) => ({ value: k, label: t.props.tones[k] }))} />
        <TextArea label={t.props.writerNotes} placeholder={t.props.writerNotesPh} rows={3} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button variant="primary" onClick={run} disabled={busy || !langs.length}>
          {busy ? t.agents.running : t.props.write}
        </Button>
        <Status message={msg} />
        {out && (
          <div className="flex flex-col gap-3">
            <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.agents.review}</p>
            <p className="m-0 font-semibold text-[var(--text-hi)]">
              {t.props.headline}: {out.headline}
            </p>
            {Object.entries(out.texts).map(([l, text]) => (
              <div key={l} lang={l} className="rounded-[var(--radius-1)] bg-[var(--surface-2)] p-3">
                <p className="m-0 text-[0.75rem] text-[var(--text-low)]">{HUB_LANG_NAMES[l as HubLang]}</p>
                <p className="m-0 mt-1 text-[0.875rem] text-[var(--text)] whitespace-pre-wrap">{text}</p>
              </div>
            ))}
            <Button onClick={() => onUse(out.texts)}>{t.props.use}</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
