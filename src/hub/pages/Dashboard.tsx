import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useHub, useWs } from "../session";
import { Badge, Button, Card, Empty, LoadError, Loading, PageHeader, fullName, useFmt, useLoad } from "../ui";
import { DealDialog } from "../forms";
import { TaskList, scoreTone } from "../widgets";

export default function Dashboard() {
  const { t, repo, user } = useHub();
  const ws = useWs();
  const f = useFmt();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const { data, error, loading, reload } = useLoad(async () => {
    const [stages, deals, tasks, usage, members] = await Promise.all([
      repo.stages(ws.id),
      repo.deals(ws.id),
      repo.tasks(ws.id, { open: true }),
      repo.aiUsage(ws.id).catch(() => null),
      repo.members(ws.id).catch(() => []),
    ]);
    return { stages, deals, tasks, usage, members };
  }, [ws.id, repo]);

  if (loading && !data) return <Loading />;
  if (error || !data) return <LoadError retry={reload} />;

  const kindOf = (id: string | null) => data.stages.find((s) => s.id === id)?.kind ?? "open";
  const open = data.deals.filter((d) => kindOf(d.stage_id) === "open");
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  // "Won this month" by the last change on the deal: the move to Won is the
  // last thing that happens to most won deals.
  const wonThisMonth = data.deals.filter((d) => kindOf(d.stage_id) === "won" && new Date(d.last_activity_at) >= monthStart);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const due = data.tasks.filter((x) => x.due_at && new Date(x.due_at) <= endOfToday);
  const me = data.members.find((m) => m.user_id === user?.id);
  const stageName = (id: string | null) => data.stages.find((s) => s.id === id)?.name ?? "–";
  const sum = (xs: { value: number | null }[]) => xs.reduce((n, d) => n + (Number(d.value) || 0), 0);

  const stats = [
    [t.dash.openDeals, String(open.length)],
    [t.dash.pipelineValue, f.money(sum(open))],
    [t.dash.won, f.money(sum(wonThisMonth))],
    [t.dash.dueToday, String(due.length)],
  ] as const;

  return (
    <>
      <PageHeader
        title={t.dash.title}
        sub={me?.full_name ? t.dash.hello(me.full_name.split(" ")[0]) : ws.name}
        actions={
          <>
            <Button onClick={() => navigate("/copilot")}>✦ {t.dash.askCopilot}</Button>
            <Button variant="primary" onClick={() => setAdding(true)}>
              + {t.pipeline.newDeal}
            </Button>
          </>
        }
      />

      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 m-0 mb-6">
        {stats.map(([label, value]) => (
          <div key={label} className="flex flex-col rounded-[var(--radius-2)] border border-[var(--line)] bg-[var(--surface-1)] p-4 sm:p-5 min-w-0">
            <dt className="order-2 mt-1 text-[0.8125rem] text-[var(--text-mid)]">{label}</dt>
            <dd className="m-0 font-brand text-[clamp(1.375rem,1rem+1.2vw,2rem)] leading-none text-[var(--text-hi)] tabular-nums truncate">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-6">
        <Card title={t.dash.recent} actions={<Link to="/pipeline" className="text-[0.875rem] text-[var(--signal-text)] underline underline-offset-2">{t.nav.pipeline}</Link>}>
          {data.deals.length ? (
            <ul className="m-0 p-0 list-none divide-y divide-[var(--line)]">
              {data.deals.slice(0, 8).map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <Link to={`/deals/${d.id}`} className="font-medium text-[var(--text-hi)] underline-offset-2 hover:underline">
                      {d.title}
                    </Link>
                    <p className="m-0 text-[0.8125rem] text-[var(--text-mid)] truncate">
                      {fullName(d.contact)}
                      {d.contact?.company ? ` · ${d.contact.company}` : ""} · {d.value != null ? f.money(d.value) : "–"}
                    </p>
                  </div>
                  <Badge>{stageName(d.stage_id)}</Badge>
                  {d.score != null && <Badge tone={scoreTone(d.score)}>{d.score}</Badge>}
                </li>
              ))}
            </ul>
          ) : (
            <Empty action={<Button variant="primary" onClick={() => setAdding(true)}>{t.dash.addFirst}</Button>}>{t.dash.noDeals}</Empty>
          )}
        </Card>

        <div className="flex flex-col gap-4 sm:gap-6">
          <Card title={t.dash.today} actions={<Link to="/tasks" className="text-[0.875rem] text-[var(--signal-text)] underline underline-offset-2">{t.nav.tasks}</Link>}>
            {due.length ? <TaskList tasks={due} onChange={reload} showLinks /> : <Empty>{t.dash.noTasks}</Empty>}
          </Card>
          {data.usage && data.usage.limit > 0 && (
            <Card title={t.dash.ai}>
              <p className="m-0 text-[var(--text)]">{t.dash.aiLeft(data.usage.left, data.usage.limit)}</p>
              <div className="mt-3 h-2 rounded-full bg-[var(--surface-2)] overflow-hidden" aria-hidden="true">
                <div className="h-full bg-[linear-gradient(90deg,#2563f6,#3ce7fc)]" style={{ width: `${Math.min(100, (data.usage.today / data.usage.limit) * 100)}%` }} />
              </div>
            </Card>
          )}
        </div>
      </div>

      <DealDialog open={adding} stages={data.stages} onClose={() => setAdding(false)} onSaved={(id) => navigate(`/deals/${id}`)} />
    </>
  );
}
