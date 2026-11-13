import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useHub, useWs } from "../session";
import { Badge, Button, Card, LoadError, Loading, PageHeader, Select, Status, fullName, useFmt, useLoad } from "../ui";
import { LeadDialog, TaskQuickAdd } from "../forms";
import { TaskList, Timeline, scoreTone } from "../widgets";
import AgentsPanel from "../AgentsPanel";

export default function LeadPage() {
  const { id = "" } = useParams();
  const { t, repo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const { data, error, loading, reload } = useLoad(async () => {
    const [lead, stages, tasks, timeline] = await Promise.all([
      repo.lead(ws.id, id),
      repo.stages(ws.id),
      repo.tasks(ws.id, { lead_id: id }),
      repo.activities(ws.id, { lead_id: id }),
    ]);
    return { lead, stages, tasks, timeline };
  }, [ws.id, id, repo]);

  if (loading && !data) return <Loading />;
  if (error || !data) return <LoadError retry={reload} />;
  const { lead, stages } = data;
  if (!lead) return <p className="text-[var(--text-mid)]">{t.notFound}</p>;

  const c = lead.contact;
  const facts: [string, string][] = [
    [t.lead.intent, t.lead.intents[lead.intent]],
    [t.lead.budget, lead.budget_min || lead.budget_max ? `${lead.budget_min ? f.money(lead.budget_min) : "…"} – ${lead.budget_max ? f.money(lead.budget_max) : "…"}` : "–"],
    [t.lead.locations, lead.locations.join(", ") || "–"],
    [t.lead.kinds, lead.property_kinds.map((k) => t.props.kinds[k as keyof typeof t.props.kinds] ?? k).join(", ") || "–"],
    [t.lead.minBedrooms, lead.min_bedrooms != null ? String(lead.min_bedrooms) : "–"],
    [t.lead.minSurface, lead.min_surface_m2 != null ? `${f.num(lead.min_surface_m2)} m²` : "–"],
    [t.lead.timeline, lead.timeline ?? "–"],
    [t.lead.source, lead.source ?? "–"],
  ];

  return (
    <>
      <p className="m-0 mb-3 text-[0.875rem]">
        <Link to="/pipeline" className="text-[var(--signal-text)] underline underline-offset-2">
          ← {t.nav.pipeline}
        </Link>
      </p>
      <PageHeader
        title={fullName(c)}
        sub={
          <span className="flex flex-wrap items-center gap-2">
            <span>{t.lead.title}</span>
            {lead.score != null && (
              <Badge tone={scoreTone(lead.score)}>
                {t.lead.score} {lead.score}
              </Badge>
            )}
            <span>
              · {t.lead.lastActive}: {f.day(lead.last_activity_at)}
            </span>
          </span>
        }
        actions={
          <>
            <Button onClick={() => setEditing(true)}>{t.edit}</Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!window.confirm(t.confirmDelete(fullName(c)))) return;
                try {
                  await repo.deleteLead(ws.id, lead.id);
                  navigate("/pipeline");
                } catch {
                  setMsg(t.error);
                }
              }}
            >
              {t.lead.deleteLead}
            </Button>
          </>
        }
      />
      <Status message={msg} tone="bad" />

      <div className="grid xl:grid-cols-[1fr_400px] gap-4 sm:gap-6 items-start">
        <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
          <Card title={t.lead.criteria}>
            <div className="max-w-xs mb-5">
              <Select
                label={t.lead.stage}
                value={lead.stage_id ?? ""}
                onChange={async (e) => {
                  const s = stages.find((x) => x.id === e.target.value);
                  try {
                    await repo.saveLead(ws.id, { id: lead.id, stage_id: e.target.value });
                    await repo.addActivity(ws.id, { kind: "stage", body: `→ ${s?.name ?? ""}`, lead_id: lead.id });
                    setMsg(null);
                    reload();
                  } catch {
                    setMsg(t.error);
                  }
                }}
                options={stages.map((s) => ({ value: s.id, label: s.name }))}
              />
            </div>
            <dl className="m-0 grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.75rem] text-[var(--text-low)]">{k}</dt>
                  <dd className="m-0 text-[0.9375rem] text-[var(--text-hi)]">{v}</dd>
                </div>
              ))}
            </dl>
            {lead.notes && <p className="mt-4 mb-0 text-[0.9375rem] text-[var(--text)] whitespace-pre-wrap">{lead.notes}</p>}
            {lead.ai_summary && (
              <div className="mt-5 rounded-[var(--radius-1)] bg-[var(--signal-dim)] p-4">
                <p className="m-0 text-[0.75rem] text-[var(--signal-text)] font-medium">{t.agents.updated(f.date(lead.ai_updated_at))}</p>
                <p className="m-0 mt-1 text-[0.9375rem] text-[var(--text-hi)]">{lead.ai_summary}</p>
              </div>
            )}
          </Card>

          <Card title={t.lead.contact} actions={c && <Link to={`/contacts/${c.id}`} className="text-[0.875rem] text-[var(--signal-text)] underline underline-offset-2">{t.edit}</Link>}>
            <dl className="m-0 grid sm:grid-cols-3 gap-x-6 gap-y-3">
              <div>
                <dt className="text-[0.75rem] text-[var(--text-low)]">{t.contacts.email}</dt>
                <dd className="m-0 text-[0.9375rem] break-all">{c?.email ? <a className="text-[var(--signal-text)] underline underline-offset-2" href={`mailto:${c.email}`}>{c.email}</a> : "–"}</dd>
              </div>
              <div>
                <dt className="text-[0.75rem] text-[var(--text-low)]">{t.contacts.phone}</dt>
                <dd className="m-0 text-[0.9375rem]">{c?.phone ? <a className="text-[var(--signal-text)] underline underline-offset-2" href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a> : "–"}</dd>
              </div>
              <div>
                <dt className="text-[0.75rem] text-[var(--text-low)]">{t.contacts.language}</dt>
                <dd className="m-0 text-[0.9375rem] text-[var(--text-hi)]">{c?.language ? t.contacts.langs[c.language as keyof typeof t.contacts.langs] : "–"}</dd>
              </div>
            </dl>
          </Card>

          <Card title={t.lead.tasks}>
            <div className="flex flex-col gap-4">
              <TaskQuickAdd links={{ lead_id: lead.id, contact_id: null, property_id: null }} onSaved={reload} />
              <TaskList tasks={data.tasks} onChange={reload} />
            </div>
          </Card>

          <Card title={t.lead.timelineTitle}>
            <Timeline items={data.timeline} links={{ lead_id: lead.id }} onChange={reload} />
          </Card>
        </div>

        <AgentsPanel lead={lead} onBrief={reload} />
      </div>

      <LeadDialog open={editing} stages={stages} initial={lead} onClose={() => setEditing(false)} onSaved={() => reload()} />
    </>
  );
}
