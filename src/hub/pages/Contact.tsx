import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useHub, useWs } from "../session";
import { Badge, Button, Card, Empty, LoadError, Loading, PageHeader, Status, fullName, useFmt, useLoad } from "../ui";
import { ContactDialog, DealDialog, TaskQuickAdd } from "../forms";
import { TaskList, Timeline } from "../widgets";

export default function ContactPage() {
  const { id = "" } = useParams();
  const { t, repo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [addingDeal, setAddingDeal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const { data, error, loading, reload } = useLoad(async () => {
    const [contact, deals, stages, tasks, timeline] = await Promise.all([
      repo.contact(ws.id, id),
      repo.dealsOfContact(ws.id, id),
      repo.stages(ws.id),
      repo.tasks(ws.id, { contact_id: id }),
      repo.activities(ws.id, { contact_id: id }),
    ]);
    return { contact, deals, stages, tasks, timeline };
  }, [ws.id, id, repo]);

  if (loading && !data) return <Loading />;
  if (error || !data) return <LoadError retry={reload} />;
  const c = data.contact;
  if (!c) return <p className="text-[var(--text-mid)]">{t.notFound}</p>;

  // GDPR access request: everything the Hub holds about this person, as a file.
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ contact: c, deals: data.deals, tasks: data.tasks, timeline: data.timeline }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fullName(c).replace(/\s+/g, "-").toLowerCase()}-data.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const rows: [string, string][] = [
    [t.contacts.company, c.company ?? "–"],
    [t.contacts.jobTitle, c.job_title ?? "–"],
    [t.contacts.email, c.email ?? "–"],
    [t.contacts.phone, c.phone ?? "–"],
    [t.contacts.language, c.language ? t.contacts.langs[c.language as keyof typeof t.contacts.langs] : "–"],
    [t.contacts.source, c.source ?? "–"],
  ];

  return (
    <>
      <p className="m-0 mb-3 text-[0.875rem]">
        <Link to="/contacts" className="text-[var(--signal-text)] underline underline-offset-2">
          ← {t.contacts.title}
        </Link>
      </p>
      <PageHeader
        title={fullName(c)}
        sub={<Badge>{t.contacts.kinds[c.kind]}</Badge>}
        actions={
          <>
            <Button onClick={() => setEditing(true)}>{t.edit}</Button>
            <Button variant="primary" onClick={() => setAddingDeal(true)}>
              + {t.contacts.newDeal}
            </Button>
          </>
        }
      />
      <div className="grid xl:grid-cols-[1fr_380px] gap-4 sm:gap-6 items-start">
        <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
          <Card title={t.contacts.deals}>
            {data.deals.length ? (
              <ul className="m-0 p-0 list-none divide-y divide-[var(--line)]">
                {data.deals.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                    <Link to={`/deals/${l.id}`} className="font-medium text-[var(--text-hi)] underline underline-offset-2">
                      {l.title}
                      {l.value != null ? ` · ${f.money(l.value)}` : ""}
                    </Link>
                    <Badge>{data.stages.find((s) => s.id === l.stage_id)?.name ?? "–"}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>{t.dash.noDeals}</Empty>
            )}
          </Card>
          <Card title={t.deal.tasks}>
            <div className="flex flex-col gap-4">
              <TaskQuickAdd links={{ contact_id: c.id }} onSaved={reload} />
              <TaskList tasks={data.tasks} onChange={reload} />
            </div>
          </Card>
          <Card title={t.deal.timelineTitle}>
            <Timeline items={data.timeline} links={{ contact_id: c.id }} onChange={reload} />
          </Card>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <Card title={t.deal.contact}>
            <dl className="m-0 flex flex-col gap-3">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.75rem] text-[var(--text-low)]">{k}</dt>
                  <dd className="m-0 text-[0.9375rem] text-[var(--text-hi)] break-all">{v}</dd>
                </div>
              ))}
            </dl>
            {c.notes && <p className="mt-4 mb-0 text-[0.9375rem] text-[var(--text)] whitespace-pre-wrap">{c.notes}</p>}
          </Card>
          <Card title={t.contacts.gdpr}>
            <p className="m-0 text-[0.875rem] text-[var(--text)]">
              {c.marketing_consent ? `✓ ${t.contacts.consent}` : `✕ ${t.contacts.consent}`}
            </p>
            {c.consent_at && <p className="m-0 mt-1 text-[0.75rem] text-[var(--text-low)]">{t.contacts.consentAt(f.date(c.consent_at))}</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button size="sm" onClick={exportData}>
                {t.contacts.export}
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={async () => {
                  if (!window.confirm(`${t.confirmDelete(fullName(c))}\n\n${t.contacts.deleteWarn}`)) return;
                  try {
                    await repo.deleteContact(ws.id, c.id);
                    navigate("/contacts");
                  } catch {
                    setMsg(t.error);
                  }
                }}
              >
                {t.contacts.deleteContact}
              </Button>
            </div>
            <p className="m-0 mt-2 text-[0.75rem] text-[var(--text-low)]">{t.contacts.deleteWarn}</p>
            <Status message={msg} tone="bad" />
          </Card>
        </div>
      </div>
      <ContactDialog open={editing} initial={c} onClose={() => setEditing(false)} onSaved={() => reload()} />
      <DealDialog open={addingDeal} stages={data.stages} contactId={c.id} onClose={() => setAddingDeal(false)} onSaved={(did) => navigate(`/deals/${did}`)} />
    </>
  );
}
