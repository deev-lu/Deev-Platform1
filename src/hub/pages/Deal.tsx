import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useHub, useWs } from "../session";
import { Badge, Button, Card, LoadError, Loading, PageHeader, Select, Status, fullName, useFmt, useLoad } from "../ui";
import { DealDialog, TaskQuickAdd } from "../forms";
import { TaskList, Timeline, scoreTone } from "../widgets";
import AgentsPanel from "../AgentsPanel";

export default function DealPage() {
  const { id = "" } = useParams();
  const { t, repo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const { data, error, loading, reload } = useLoad(async () => {
    const [deal, stages, tasks, timeline] = await Promise.all([
      repo.deal(ws.id, id),
      repo.stages(ws.id),
      repo.tasks(ws.id, { deal_id: id }),
      repo.activities(ws.id, { deal_id: id }),
    ]);
    return { deal, stages, tasks, timeline };
  }, [ws.id, id, repo]);

  if (loading && !data) return <Loading />;
  if (error || !data) return <LoadError retry={reload} />;
  const { deal, stages } = data;
  if (!deal) return <p className="text-[var(--text-mid)]">{t.notFound}</p>;

  const c = deal.contact;
  const facts: [string, string][] = [
    [t.deal.value, deal.value != null ? f.money(deal.value) : "–"],
    [t.deal.expectedClose, deal.expected_close ? f.date(deal.expected_close) : "–"],
    [t.deal.source, deal.source ?? "–"],
  ];

  return (
    <>
      <p className="m-0 mb-3 text-[0.875rem]">
        <Link to="/pipeline" className="text-[var(--signal-text)] underline underline-offset-2">
          ← {t.nav.pipeline}
        </Link>
      </p>
      <PageHeader
        title={deal.title}
        sub={
          <span className="flex flex-wrap items-center gap-2">
            <span>
              {fullName(c)}
              {c?.company ? ` · ${c.company}` : ""}
            </span>
            {deal.score != null && (
              <Badge tone={scoreTone(deal.score)}>
                {t.deal.score} {deal.score}
              </Badge>
            )}
            <span>
              · {t.deal.lastActive}: {f.day(deal.last_activity_at)}
            </span>
          </span>
        }
        actions={
          <>
            <Button onClick={() => setEditing(true)}>{t.edit}</Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!window.confirm(t.confirmDelete(deal.title))) return;
                try {
                  await repo.deleteDeal(ws.id, deal.id);
                  navigate("/pipeline");
                } catch {
                  setMsg(t.error);
                }
              }}
            >
              {t.deal.deleteDeal}
            </Button>
          </>
        }
      />
      <Status message={msg} tone="bad" />

      <div className="grid xl:grid-cols-[1fr_420px] gap-4 sm:gap-6 items-start">
        <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
          <Card title={t.deal.about}>
            <div className="max-w-xs mb-5">
              <Select
                label={t.deal.stage}
                value={deal.stage_id ?? ""}
                onChange={async (e) => {
                  const s = stages.find((x) => x.id === e.target.value);
                  try {
                    await repo.saveDeal(ws.id, { id: deal.id, stage_id: e.target.value });
                    await repo.addActivity(ws.id, { kind: "stage", body: `→ ${s?.name ?? ""}`, deal_id: deal.id });
                    setMsg(null);
                    reload();
                  } catch {
                    setMsg(t.error);
                  }
                }}
                options={stages.map((s) => ({ value: s.id, label: s.name }))}
              />
            </div>
            <dl className="m-0 grid sm:grid-cols-3 gap-x-6 gap-y-3">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.75rem] text-[var(--text-low)]">{k}</dt>
                  <dd className="m-0 text-[0.9375rem] text-[var(--text-hi)]">{v}</dd>
                </div>
              ))}
            </dl>
            {deal.needs && (
              <div className="mt-5">
                <h3 className="m-0 text-[0.75rem] font-normal text-[var(--text-low)]">{t.deal.needs}</h3>
                <p className="m-0 mt-1 text-[0.9375rem] text-[var(--text-hi)] whitespace-pre-wrap">{deal.needs}</p>
              </div>
            )}
            {deal.notes && (
              <div className="mt-4">
                <h3 className="m-0 text-[0.75rem] font-normal text-[var(--text-low)]">{t.deal.notes}</h3>
                <p className="m-0 mt-1 text-[0.9375rem] text-[var(--text)] whitespace-pre-wrap">{deal.notes}</p>
              </div>
            )}
            {deal.ai_summary && (
              <div className="mt-5 rounded-[var(--radius-1)] bg-[var(--signal-dim)] p-4">
                <p className="m-0 text-[0.75rem] text-[var(--signal-text)] font-medium">{t.agents.updated(f.date(deal.ai_updated_at))}</p>
                <p className="m-0 mt-1 text-[0.9375rem] text-[var(--text-hi)]">{deal.ai_summary}</p>
              </div>
            )}
          </Card>

          <Card title={t.deal.contact} actions={c && <Link to={`/contacts/${c.id}`} className="text-[0.875rem] text-[var(--signal-text)] underline underline-offset-2">{fullName(c)}</Link>}>
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

          <Card title={t.deal.tasks}>
            <div className="flex flex-col gap-4">
              <TaskQuickAdd links={{ deal_id: deal.id }} onSaved={reload} />
              <TaskList tasks={data.tasks} onChange={reload} />
            </div>
          </Card>

          <Card title={t.deal.timelineTitle}>
            <Timeline items={data.timeline} links={{ deal_id: deal.id }} onChange={reload} />
          </Card>
        </div>

        <AgentsPanel deal={deal} onBrief={reload} />
      </div>

      <DealDialog open={editing} stages={stages} initial={deal} onClose={() => setEditing(false)} onSaved={() => reload()} />
    </>
  );
}
