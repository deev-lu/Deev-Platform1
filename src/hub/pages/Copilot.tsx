import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router";
import { useHub, useWs } from "../session";
import { agentErrorKey, callAgent } from "../agent";
import { Button, PageHeader, Status } from "../ui";

interface Turn {
  role: "user" | "assistant";
  content: string;
  actions?: { type: "task" | "note"; id: string; label: string }[];
}

/**
 * The copilot: a conversation over the agency's CRM. The conversation lives in
 * this page only (it is not stored); each question sends the recent turns so
 * follow-ups make sense. Replies are announced to screen readers as they come.
 */
export default function Copilot() {
  const { t, lang, token, demo } = useHub();
  const ws = useWs();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [turns, busy]);

  useEffect(() => {
    setTurns([]);
  }, [ws.id]);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    if (demo) {
      setTurns((x) => [...x, { role: "user", content: q }, { role: "assistant", content: t.demo.ai }]);
      setInput("");
      return;
    }
    const next: Turn[] = [...turns, { role: "user", content: q }];
    setTurns(next);
    setInput("");
    setBusy(true);
    setMsg(t.agents.running);
    const r = await callAgent<{ reply: string; actions: Turn["actions"] }>(token, {
      agent: "copilot",
      workspace_id: ws.id,
      lang,
      // The last 20 turns are enough context; older ones only cost tokens.
      messages: next.slice(-20).map(({ role, content }) => ({ role, content: content.slice(0, 8000) })),
    });
    setBusy(false);
    if (!r.ok) {
      const k = agentErrorKey(r.error);
      setMsg(k === "forbidden" ? t.forbidden : t.agents[k]);
      // Leave the question in the box so it can be sent again.
      setTurns(turns);
      setInput(q);
      return;
    }
    setMsg(null);
    setTurns([...next, { role: "assistant", content: r.data.reply || "…", actions: r.data.actions }]);
    inputRef.current?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };
  // Enter sends, Shift+Enter makes a new line.
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      ask(input);
    }
  };

  return (
    <>
      <PageHeader
        title={t.copilot.title}
        actions={
          turns.length > 0 && (
            <Button onClick={() => setTurns([])} disabled={busy}>
              {t.copilot.clear}
            </Button>
          )
        }
      />
      <div className="flex flex-col rounded-[var(--radius-2)] border border-[var(--line)] bg-[var(--surface-1)] min-h-[60vh]">
        <div className="flex-1 p-4 sm:p-6 flex flex-col gap-5" aria-live="polite" aria-busy={busy}>
          {turns.length === 0 && (
            <div className="flex flex-col gap-4 max-w-2xl">
              <p className="m-0 text-[var(--text)]">{t.copilot.intro}</p>
              <p className="m-0 text-[0.8125rem] font-semibold text-[var(--text-hi)]">{t.copilot.examples}</p>
              <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                {t.copilot.ex.map((ex) => (
                  <li key={ex}>
                    <button
                      type="button"
                      onClick={() => ask(ex)}
                      className="text-left px-3.5 py-2 rounded-[var(--radius-1)] border border-[var(--line-control)] text-[0.875rem] text-[var(--text-hi)] hover:bg-[var(--surface-2)]"
                    >
                      {ex}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {turns.map((turn, i) => (
            <div key={i} className={`flex flex-col gap-1 max-w-[46rem] ${turn.role === "user" ? "self-end items-end" : "self-start"}`}>
              <span className="text-[0.75rem] text-[var(--text-low)]">{turn.role === "user" ? t.copilot.you : `✦ ${t.copilot.ai}`}</span>
              <div
                className={`rounded-[var(--radius-1)] px-4 py-3 text-[0.9375rem] leading-relaxed whitespace-pre-wrap break-words ${
                  turn.role === "user" ? "bg-[var(--signal)] text-white" : "bg-[var(--surface-2)] text-[var(--text-hi)]"
                }`}
              >
                {turn.content}
              </div>
              {turn.actions && turn.actions.length > 0 && (
                <div className="text-[0.8125rem] text-[var(--text-mid)]">
                  {t.copilot.did}:{" "}
                  {turn.actions.map((a, n) => (
                    <span key={a.id}>
                      {n > 0 && " · "}
                      {a.type === "task" ? (
                        <Link to="/tasks" className="text-[var(--signal-text)] underline underline-offset-2">
                          {a.label}
                        </Link>
                      ) : (
                        a.label
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={onSubmit} className="border-t border-[var(--line)] p-3 sm:p-4 flex flex-col gap-2">
          <Status message={msg} />
          <div className="flex items-end gap-2">
            <label htmlFor="copilot-input" className="sr-only">
              {t.copilot.title}
            </label>
            <textarea
              id="copilot-input"
              ref={inputRef}
              rows={2}
              maxLength={4000}
              value={input}
              placeholder={t.copilot.placeholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              className="flex-1 resize-none rounded-[var(--radius-1)] border border-[var(--line-control)] bg-[var(--surface-1)] text-[var(--text-hi)] px-3.5 py-2.5 text-[0.9375rem] placeholder:text-[var(--text-low)]"
            />
            <Button type="submit" variant="primary" disabled={busy || !input.trim()}>
              {busy ? t.agents.running : t.copilot.send}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
