import { useState, type DragEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useHub, useWs } from "../session";
import { Badge, Button, Field, LoadError, Loading, PageHeader, Status, fullName, useFmt, useLoad } from "../ui";
import { DealDialog } from "../forms";
import { scoreTone } from "../widgets";
import type { Deal } from "../types";

/**
 * The board. Every card has a "Move to" menu, so the pipeline works with a
 * keyboard and a screen reader; dragging is a shortcut for the mouse, not the
 * only way. Moves are logged on the deal's timeline.
 */
export default function Pipeline() {
  const { t, repo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const { data, error, loading, reload, setData } = useLoad(
    async () => ({ stages: await repo.stages(ws.id), deals: await repo.deals(ws.id) }),
    [ws.id, repo],
  );
  if (loading && !data) return <Loading />;
  if (error || !data) return <LoadError retry={reload} />;

  const move = async (deal: Deal, stageId: string) => {
    if (deal.stage_id === stageId) return;
    const stage = data.stages.find((s) => s.id === stageId);
    // Optimistic: the card moves now, and moves back if saving fails.
    const before = data;
    setData({ ...data, deals: data.deals.map((d) => (d.id === deal.id ? { ...d, stage_id: stageId } : d)) });
    try {
      await repo.saveDeal(ws.id, { id: deal.id, stage_id: stageId });
      await repo.addActivity(ws.id, { kind: "stage", body: `→ ${stage?.name ?? ""}`, deal_id: deal.id });
      setMsg(t.pipeline.moved(stage?.name ?? ""));
    } catch {
      setData(before);
      setMsg(t.error);
    }
  };

  const term = q.trim().toLowerCase();
  const visible = data.deals.filter((d) => !term || [d.title, fullName(d.contact), d.contact?.company ?? ""].some((v) => v.toLowerCase().includes(term)));

  return (
    <>
      <PageHeader
        title={t.pipeline.title}
        sub={t.pipeline.count(data.deals.length)}
        actions={
          <Button variant="primary" onClick={() => setAdding(true)}>
            + {t.pipeline.newDeal}
          </Button>
        }
      />
      <div className="max-w-xs mb-4">
        <Field label={t.pipeline.filter} type="search" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Status message={msg} />

      <div className="mt-2 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto pb-4">
        <ol className="m-0 p-0 list-none grid grid-flow-col auto-cols-[minmax(250px,1fr)] xl:auto-cols-[minmax(168px,1fr)] gap-3 min-w-max xl:min-w-0">
          {data.stages.map((stage) => {
            const items = visible.filter((l) => l.stage_id === stage.id || (!l.stage_id && stage.position === data.stages[0]?.position));
            return (
              <li
                key={stage.id}
                aria-labelledby={`stage-${stage.id}`}
                onDragOver={(e: DragEvent) => {
                  e.preventDefault();
                  setDragOver(stage.id);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e: DragEvent) => {
                  e.preventDefault();
                  setDragOver(null);
                  const deal = data.deals.find((d) => d.id === e.dataTransfer.getData("text/plain"));
                  if (deal) move(deal, stage.id);
                }}
                className={`flex flex-col rounded-[var(--radius-2)] border p-3 min-h-[200px] transition-colors ${
                  dragOver === stage.id ? "border-[var(--signal)] bg-[var(--signal-dim)]" : "border-[var(--line)] bg-[var(--surface-2)]/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 px-1 pb-3">
                  <h2 id={`stage-${stage.id}`} className="m-0 text-[0.9375rem] font-semibold text-[var(--text-hi)]">
                    {stage.name}
                  </h2>
                  <Badge tone={stage.kind === "won" ? "good" : stage.kind === "lost" ? "bad" : "neutral"}>{items.length}</Badge>
                </div>
                {items.length ? (
                  <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
                    {items.map((l) => (
                      <li
                        key={l.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", l.id)}
                        className="rounded-[var(--radius-1)] border border-[var(--line)] bg-[var(--surface-1)] p-3 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/deals/${l.id}`} className="font-medium text-[var(--text-hi)] hover:underline underline-offset-2">
                            {l.title}
                          </Link>
                          {l.score != null && <Badge tone={scoreTone(l.score)}>{l.score}</Badge>}
                        </div>
                        <p className="m-0 mt-1 text-[0.8125rem] text-[var(--text-mid)] truncate">
                          {fullName(l.contact)}
                          {l.contact?.company ? ` · ${l.contact.company}` : ""}
                        </p>
                        {l.value != null && <p className="m-0 text-[0.8125rem] font-medium text-[var(--text)] tabular-nums">{f.money(l.value)}</p>}
                        <label className="mt-2 flex items-center gap-2 text-[0.75rem] text-[var(--text-mid)]">
                          {t.pipeline.moveTo}
                          <select
                            value={l.stage_id ?? ""}
                            onChange={(e) => move(l, e.target.value)}
                            className="flex-1 h-8 rounded-[8px] border border-[var(--line-control)] bg-[var(--surface-1)] text-[var(--text-hi)] px-2 text-[0.8125rem]"
                          >
                            {data.stages.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 px-1 text-[0.8125rem] text-[var(--text-low)]">{t.pipeline.empty}</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <DealDialog open={adding} stages={data.stages} onClose={() => setAdding(false)} onSaved={(id) => navigate(`/deals/${id}`)} />
    </>
  );
}
