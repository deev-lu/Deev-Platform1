import { useEffect, useRef, useState, type FormEvent } from "react";
import { useHub, useWs } from "./session";
import { agentErrorKey, callAgent } from "./agent";
import { Badge, Button, Card, CopyButton, Status, TextArea, useFmt } from "./ui";
import { scoreTone } from "./widgets";
import type { Deal } from "./types";

interface Brief {
  score: number;
  score_reason: string;
  summary: string;
  missing_info: string[];
  next_step: string;
  email: { subject: string; body: string };
}
interface ProposalLine {
  catalog_id: string;
  name: string;
  unit: string;
  quantity: number;
  unit_price: number | null;
  total: number | null;
  why: string;
}
interface Proposal {
  subject: string;
  intro: string;
  closing: string;
  open_questions: string[];
  lines: ProposalLine[];
  total: number | null;
}

/**
 * The AI agents for one deal. Each result appears below the agents and gets
 * focus, so a screen reader reads it; the brief also lands on the deal (score,
 * summary) and in its timeline. Drafts are drafts: the panel says to check them.
 */
export default function AgentsPanel({ deal, onBrief }: { deal: Deal; onBrief: () => void }) {
  const { t, lang, token, demo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const [busy, setBusy] = useState<null | "brief" | "proposal" | "email">(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [notes, setNotes] = useState("");
  const [purpose, setPurpose] = useState("");
  const [email, setEmail] = useState<{ subject: string; body: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBrief(null);
    setProposal(null);
    setEmail(null);
    setMsg(null);
  }, [deal.id]);

  async function run<T>(which: "brief" | "proposal" | "email", agent: "deal_brief" | "proposal" | "email", extra: Record<string, unknown>) {
    if (demo) {
      setMsg(t.demo.ai);
      return null;
    }
    setBusy(which);
    setMsg(t.agents.running);
    const r = await callAgent<T>(token, { agent, workspace_id: ws.id, lang, deal_id: deal.id, ...extra });
    setBusy(null);
    if (!r.ok) {
      const k = agentErrorKey(r.error ?? "");
      setMsg(k === "forbidden" ? t.forbidden : t.agents[k]);
      return null;
    }
    setMsg(null);
    requestAnimationFrame(() => resultRef.current?.focus());
    return r.data;
  }

  const unit = (u: string) => t.catalog.units[u as keyof typeof t.catalog.units] ?? u;
  const proposalText = (p: Proposal) =>
    [
      `${t.agents.subject}: ${p.subject}`,
      "",
      p.intro,
      "",
      ...p.lines.map((l) => `- ${l.name}: ${f.num(l.quantity)} × ${l.unit_price == null ? t.agents.toBePriced : f.money(l.unit_price)} / ${unit(l.unit)} = ${l.total == null ? t.agents.toBePriced : f.money(l.total)}`),
      p.lines.length ? `${t.agents.total}: ${p.total == null ? t.agents.toBePriced : f.money(p.total)}` : "",
      "",
      p.closing,
    ].join("\n");

  return (
    <Card title={t.agents.title}>
      <p className="m-0 mb-4 text-[0.8125rem] text-[var(--text-mid)]">{t.agents.review}</p>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            disabled={busy !== null}
            onClick={async () => {
              const d = await run<Brief>("brief", "deal_brief", {});
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

        <form
          className="flex flex-col gap-2"
          noValidate
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            const d = await run<Proposal>("proposal", "proposal", { notes: notes.trim() });
            if (d) setProposal(d);
          }}
        >
          <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.agents.proposalHint}</p>
          <TextArea label={t.agents.proposalNotes} placeholder={t.agents.proposalNotesPh} rows={2} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button type="submit" disabled={busy !== null}>
            ▤ {busy === "proposal" ? t.agents.running : t.agents.proposal}
          </Button>
        </form>

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
              <div>
                <Badge tone={scoreTone(brief.score)}>
                  {t.deal.score} {brief.score}/100
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

          {proposal && (
            <div className="flex flex-col gap-3 rounded-[var(--radius-1)] border border-[var(--line)] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="m-0 text-[0.875rem] font-semibold text-[var(--text-hi)]">{proposal.subject}</h3>
                <CopyButton text={proposalText(proposal)} />
              </div>
              <p className="m-0 text-[0.875rem] text-[var(--text)] whitespace-pre-wrap">{proposal.intro}</p>
              {proposal.lines.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[0.8125rem]">
                    <caption className="sr-only">{t.agents.proposal}</caption>
                    <thead>
                      <tr className="text-[var(--text-low)]">
                        <th scope="col" className="font-medium py-1.5 pr-2">{t.agents.item}</th>
                        <th scope="col" className="font-medium py-1.5 pr-2 text-right">{t.agents.qty}</th>
                        <th scope="col" className="font-medium py-1.5 pr-2 text-right">{t.agents.unitPrice}</th>
                        <th scope="col" className="font-medium py-1.5 text-right">{t.agents.lineTotal}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposal.lines.map((l) => (
                        <tr key={l.catalog_id} className="border-t border-[var(--line)] align-top">
                          <td className="py-2 pr-2">
                            <span className="text-[var(--text-hi)]">{l.name}</span>
                            <span className="block text-[var(--text-mid)]">{l.why}</span>
                          </td>
                          <td className="py-2 pr-2 text-right tabular-nums whitespace-nowrap">
                            {f.num(l.quantity)} {unit(l.unit)}
                          </td>
                          <td className="py-2 pr-2 text-right tabular-nums whitespace-nowrap">{l.unit_price == null ? t.agents.toBePriced : f.money(l.unit_price)}</td>
                          <td className="py-2 text-right tabular-nums whitespace-nowrap">{l.total == null ? t.agents.toBePriced : f.money(l.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-[var(--line-strong)]">
                        <th scope="row" colSpan={3} className="py-2 pr-2 text-right font-semibold text-[var(--text-hi)]">
                          {t.agents.total}
                        </th>
                        <td className="py-2 text-right font-semibold text-[var(--text-hi)] tabular-nums whitespace-nowrap">
                          {proposal.total == null ? t.agents.toBePriced : f.money(proposal.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="m-0 text-[0.875rem] text-[var(--warn)]">{t.agents.noLines}</p>
              )}
              <p className="m-0 text-[0.875rem] text-[var(--text)] whitespace-pre-wrap">{proposal.closing}</p>
              {proposal.open_questions.length > 0 && (
                <div>
                  <h3 className="m-0 text-[0.8125rem] font-semibold text-[var(--text-hi)]">{t.agents.openQuestions}</h3>
                  <ul className="m-0 mt-1 pl-5 text-[0.875rem] text-[var(--text)]">
                    {proposal.open_questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
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
