import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useHub, useWs } from "./session";
import { Badge, Button, Empty, Select, Status, TextArea, useFmt } from "./ui";
import type { Activity, Links, Task } from "./types";

/** Open and done tasks with a checkbox each; overdue ones say so. */
export function TaskList({ tasks, onChange, showLinks = false }: { tasks: Task[]; onChange: () => void; showLinks?: boolean }) {
  const { t, repo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const [msg, setMsg] = useState<string | null>(null);
  if (!tasks.length) return <Empty>{t.tasks.empty}</Empty>;
  const now = Date.now();
  return (
    <>
      <ul className="m-0 p-0 list-none divide-y divide-[var(--line)]">
        {tasks.map((task) => {
          const overdue = !task.done && task.due_at && new Date(task.due_at).getTime() < now;
          return (
            <li key={task.id} className="flex items-center gap-3 py-2.5">
              <input
                type="checkbox"
                checked={task.done}
                aria-label={task.done ? t.tasks.markOpen(task.title) : t.tasks.markDone(task.title)}
                onChange={async () => {
                  try {
                    await repo.saveTask(ws.id, { id: task.id, done: !task.done });
                    setMsg(null);
                    onChange();
                  } catch {
                    setMsg(t.error);
                  }
                }}
                className="w-[18px] h-[18px] shrink-0 accent-[var(--signal)]"
              />
              <div className="flex-1 min-w-0">
                <p className={`m-0 text-[0.9375rem] ${task.done ? "line-through text-[var(--text-low)]" : "text-[var(--text-hi)]"}`}>{task.title}</p>
                {showLinks && (task.deal_id || task.contact_id) && (
                  <p className="m-0 mt-0.5 text-[0.75rem]">
                    {task.deal_id && (
                      <Link to={`/deals/${task.deal_id}`} className="text-[var(--signal-text)] underline underline-offset-2">
                        {t.deal.title}
                      </Link>
                    )}
                    {task.contact_id && (
                      <Link to={`/contacts/${task.contact_id}`} className="ml-2 text-[var(--signal-text)] underline underline-offset-2">
                        {t.deal.contact}
                      </Link>
                    )}
                  </p>
                )}
              </div>
              {task.due_at && (overdue ? <Badge tone="bad">{t.tasks.overdue} · {f.day(task.due_at)}</Badge> : <Badge>{f.day(task.due_at)}</Badge>)}
            </li>
          );
        })}
      </ul>
      <Status message={msg} tone="bad" />
    </>
  );
}

/** The record's history, newest first, with a form to log something. */
export function Timeline({ items, links, onChange }: { items: Activity[]; links: Links; onChange: () => void }) {
  const { t, repo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const [kind, setKind] = useState<Activity["kind"]>("note");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    try {
      await repo.addActivity(ws.id, { kind, body: body.trim(), ...links });
      setBody("");
      setErr(null);
      onChange();
    } catch {
      setErr(t.error);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
        <div className="grid sm:grid-cols-[180px_1fr] gap-3">
          <Select
            label={t.deal.log}
            value={kind}
            onChange={(e) => setKind(e.target.value as Activity["kind"])}
            options={(["note", "call", "email", "meeting"] as const).map((k) => ({ value: k, label: t.deal.logKinds[k] }))}
          />
          <TextArea label={t.deal.logPh} rows={2} maxLength={10000} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="flex items-center justify-end gap-3">
          <Status message={err} tone="bad" />
          <Button type="submit" variant="primary" size="sm" disabled={busy || !body.trim()}>
            {t.deal.addLog}
          </Button>
        </div>
      </form>
      {items.length ? (
        <ol className="m-0 p-0 list-none flex flex-col gap-4">
          {items.map((a) => (
            <li key={a.id} className="grid grid-cols-[auto_1fr] gap-3">
              <Badge tone={a.kind === "ai" ? "signal" : "neutral"}>{t.deal.logKinds[a.kind]}</Badge>
              <div className="min-w-0">
                <p className="m-0 text-[0.9375rem] text-[var(--text-hi)] whitespace-pre-wrap break-words">{a.body}</p>
                <p className="m-0 mt-0.5 text-[0.75rem] text-[var(--text-low)]">
                  <time dateTime={a.created_at}>{f.dateTime(a.created_at)}</time>
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <Empty>{t.deal.noTimeline}</Empty>
      )}
    </div>
  );
}

export function scoreTone(score: number | null): "neutral" | "good" | "warn" | "bad" {
  if (score == null) return "neutral";
  if (score >= 70) return "good";
  if (score >= 40) return "warn";
  return "bad";
}
