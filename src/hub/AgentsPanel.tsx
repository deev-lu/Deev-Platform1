import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useHub, useWs } from "./session";
import { agentErrorKey, callAgent } from "./agent";
import { Badge, Button, Card, CopyButton, Status, TextArea, useFmt } from "./ui";
import { scoreTone } from "./widgets";
import type { Lead } from "./types";

interface Brief {
  score: number;
  score_reason: string;
  summary: string;
  missing_info: string[];
  next_step: string;
  email: { subject: string; body: string };
}
interface Match {
  property_id: string;
  fit: number;
  reasons: string[];
  concerns: string[];
  property?: { title: string; price: number | null; city: string | null; deal: string };
}

/**
 * The AI agents for one lead. Each result appears below its button and is
 * announced; the brief also lands on the lead (score, summary) and in its
 * timeline. Drafts are drafts: the panel says to check them.
 */
export default function AgentsPanel({ lead, onBrief }: { lead: Lead; onBrief: () => void }) {
  const { t, lang, token, demo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const [busy, setBusy] = useState<null | "brief" | "matches" | "email">(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [purpose, setPurpose] = useState("");
  const [email, setEmail] = useState<{ subject: string; body: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBrief(null);
    setMatches(null);
    setEmail(null);
    setMsg(null);
  }, [lead.id]);

  async function run<T>(which: "brief" | "matches" | "email", agent: "lead_brief" | "matches" | "email", extra: Record<string, unknown>) {
    if (demo) {
      setMsg(t.demo.ai);
      return null;
    }
    setBusy(which);
    setMsg(t.agents.running);
    const r = await callAgent<T>(token, { agent, workspace_id: ws.id, lang, lead_id: lead.id, ...extra });
    setBusy(null);
    if (!r.ok) {
      const k = agentErrorKey(r.error);
      setMsg(k === "forbidden" ? t.forbidden : t.agents[k]);
      return null;
    }
    setMsg(null);
    requestAnimationFrame(() => resultRef.current?.focus());
    return r.data;
  }

  return (
    <Card title={t.agents.title}>
      <p className="m-0 mb-4 text-[0.8125rem] text-[var(--text-mid)]">{t.agents.review}</p>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            disabled={busy !== null}
            onClick={async () => {
              const d = await run<Brief>("brief", "lead_brief", {});
              if (d) {
                setBrief(d);
                onBrief();
              }
            }}
          >
            ✦ {busy === "brief" ? t.agents.running : t.agents.brief}
          </Button>
          <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.agents.briefHint}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            disabled={busy !== null}
            onClick={async () => {
              const d = await run<{ matches: Match[] }>("matches", "matches", {});
              if (d) setMatches(d.matches);
            }}
          >
            ⌂ {busy === "matches" ? t.agents.running : t.agents.matches}
          </Button>
          <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.agents.matchesHint}</p>
        </div>
        <form
          className="flex flex-col gap-2"
          noValidate
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            if (!purpose.trim()) return;
            const d = await run<{ subject: string; body: string }>("email", "email", { purpose: purpose.trim() });
            if (d) setEmail(d);
          }}
        >
          <TextArea label={t.agents.emailPurpose} placeholder={t.agents.emailPurposePh} rows={2} maxLength={1500} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <Button type="submit" disabled={busy !== null || !purpose.trim()}>
            ✉ {busy === "email" ? t.agents.running : t.agents.email}
          </Button>
        </form>

        <Status message={msg} />

        <div ref={resultRef} tabIndex={-1} className="flex flex-col gap-5 outline-none">
          {brief && (
            <div className="flex flex-col gap-3 rounded-[var(--radius-1)] border border-[var(--line)] p-4">
              <div className="flex items-center gap-2">
                <Badge tone={scoreTone(brief.score)}>
                  {t.lead.score} {brief.score}/100
                </Badge>
              </div>
              <p className="m-0 text-[0.875rem] text-[var(--text-mid)]">{brief.score_reason}</p>
              <p className="m-0 text-[0.9375rem] text-[var(--text-hi)]">{brief.summary}</p>
              <div>
                <h3 className="m-0 text-[0.8125rem] font-semibold text-[var(--text-hi)]">{t.agents.nextStep}</h3>
                <p className="m-0 mt-1 text-[0.9375rem] text-[var(--text)]">{brief.next_step}</p>
              </div>
              {brief.missing_info.length > 0 && (
                <div>
                  <h3 className="m-0 text-[0.8125rem] font-semibold text-[var(--text-hi)]">{t.agents.missing}</h3>
                  <ul className="m-0 mt-1 pl-5 text-[0.9375rem] text-[var(--text)]">
                    {brief.missing_info.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
              <EmailBox title={t.agents.draft} email={brief.email} />
            </div>
          )}
          {matches && (
            <div className="flex flex-col gap-3">
              {matches.length === 0 && <p className="m-0 text-[var(--text-mid)]">{t.agents.matchesNone}</p>}
              <ol className="m-0 p-0 list-none flex flex-col gap-3">
                {matches.map((m) => (
                  <li key={m.property_id} className="rounded-[var(--radius-1)] border border-[var(--line)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <Link to={`/properties/${m.property_id}`} className="font-medium text-[var(--text-hi)] underline underline-offset-2">
                        {m.property?.title}
                      </Link>
                      <Badge tone={scoreTone(m.fit)}>
                        {t.agents.fit} {m.fit}
                      </Badge>
                    </div>
                    <p className="m-0 mt-1 text-[0.8125rem] text-[var(--text-mid)]">
                      {f.money(m.property?.price)} · {m.property?.city ?? "–"}
                    </p>
                    {m.reasons.length > 0 && (
                      <p className="m-0 mt-2 text-[0.875rem] text-[var(--text)]">
                        <strong className="font-semibold">{t.agents.why}:</strong> {m.reasons.join(" · ")}
                      </p>
                    )}
                    {m.concerns.length > 0 && (
                      <p className="m-0 mt-1 text-[0.875rem] text-[var(--text)]">
                        <strong className="font-semibold">{t.agents.concerns}:</strong> {m.concerns.join(" · ")}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {email && <EmailBox title={t.agents.draft} email={email} />}
        </div>
      </div>
    </Card>
  );
}

function EmailBox({ title, email }: { title: string; email: { subject: string; body: string } }) {
  const { t } = useHub();
  const text = `${t.agents.subject}: ${email.subject}\n\n${email.body}`;
  return (
    <div className="rounded-[var(--radius-1)] bg-[var(--surface-2)] p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="m-0 text-[0.8125rem] font-semibold text-[var(--text-hi)]">{title}</h3>
        <CopyButton text={text} />
      </div>
      <p className="m-0 text-[0.875rem] text-[var(--text-hi)]">
        <span className="text-[var(--text-mid)]">{t.agents.subject}:</span> {email.subject}
      </p>
      <p className="m-0 mt-2 text-[0.875rem] text-[var(--text)] whitespace-pre-wrap">{email.body}</p>
    </div>
  );
}

export type { Brief };
