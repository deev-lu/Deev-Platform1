import { useState, type FormEvent } from "react";
import { useHub, useWs } from "../session";
import { RepoError } from "../supabase";
import { Button, Card, Field, LoadError, Loading, PageHeader, Select, Status, useLoad } from "../ui";
import type { Role } from "../types";

export default function Settings() {
  const { t, repo, user, refreshWorkspaces, demo } = useHub();
  const ws = useWs();
  const admin = ws.role === "owner" || ws.role === "admin";
  const [name, setName] = useState(ws.name);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [msg, setMsg] = useState<{ text: string; bad: boolean } | null>(null);
  const [teamMsg, setTeamMsg] = useState<{ text: string; bad: boolean } | null>(null);

  const { data, error, loading, reload } = useLoad(
    async () => ({ members: await repo.members(ws.id), usage: await repo.aiUsage(ws.id).catch(() => null) }),
    [ws.id, repo],
  );

  const why = (x: unknown) =>
    x instanceof RepoError
      ? x.code === "no-account"
        ? t.settings.noAccount
        : x.code === "last-owner"
          ? t.settings.lastOwner
          : x.code === "forbidden"
            ? t.forbidden
            : t.error
      : t.error;

  const rename = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await repo.renameWorkspace(ws.id, name.trim());
      await refreshWorkspaces();
      setMsg({ text: t.saved, bad: false });
    } catch (x) {
      setMsg({ text: why(x), bad: true });
    }
  };

  const invite = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await repo.addMember(ws.id, email.trim(), role);
      setEmail("");
      setTeamMsg({ text: t.saved, bad: false });
      reload();
    } catch (x) {
      setTeamMsg({ text: demo ? t.demo.ai : why(x), bad: true });
    }
  };

  return (
    <>
      <PageHeader title={t.settings.title} />
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 items-start">
        <Card title={t.settings.agency}>
          <form onSubmit={rename} className="flex flex-col gap-4" noValidate>
            <Field label={t.settings.rename} maxLength={120} disabled={!admin} value={name} onChange={(e) => setName(e.target.value)} />
            <div className="flex items-center justify-end gap-3">
              <Status message={msg?.text ?? null} tone={msg?.bad ? "bad" : "neutral"} />
              {admin && (
                <Button type="submit" variant="primary" disabled={!name.trim() || name.trim() === ws.name}>
                  {t.save}
                </Button>
              )}
            </div>
          </form>
          <dl className="m-0 mt-5 grid grid-cols-2 gap-3">
            <div>
              <dt className="text-[0.75rem] text-[var(--text-low)]">{t.settings.plan}</dt>
              <dd className="m-0 text-[var(--text-hi)]">{t.settings.early}</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] text-[var(--text-low)]">{t.settings.usage}</dt>
              <dd className="m-0 text-[var(--text-hi)]">{data?.usage && data.usage.limit > 0 ? t.settings.usageText(data.usage.today, data.usage.limit) : "–"}</dd>
            </div>
          </dl>
        </Card>

        <Card title={t.settings.account}>
          <p className="m-0 text-[var(--text)]">{user?.email ? t.settings.signedInAs(user.email) : "–"}</p>
        </Card>

        <Card title={t.settings.members} className="lg:col-span-2">
          {loading && !data ? (
            <Loading />
          ) : error || !data ? (
            <LoadError retry={reload} />
          ) : (
            <ul className="m-0 p-0 list-none divide-y divide-[var(--line)]">
              {data.members.map((m) => {
                const label = m.full_name || m.email || "–";
                const self = m.user_id === user?.id;
                return (
                  <li key={m.user_id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="flex-1 min-w-[12rem]">
                      <p className="m-0 font-medium text-[var(--text-hi)]">
                        {label}
                        {self && <span className="text-[var(--text-mid)] font-normal"> ({t.settings.you})</span>}
                      </p>
                      {m.full_name && m.email && <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{m.email}</p>}
                    </div>
                    {admin && !self ? (
                      <>
                        <div className="w-40">
                          <Select
                            label={`${t.settings.role}: ${label}`}
                            value={m.role}
                            onChange={async (e) => {
                              try {
                                await repo.updateMemberRole(ws.id, m.user_id, e.target.value as Role);
                                setTeamMsg(null);
                                reload();
                              } catch (x) {
                                setTeamMsg({ text: why(x), bad: true });
                              }
                            }}
                            options={(["owner", "admin", "member"] as const).map((r) => ({ value: r, label: t.settings.roles[r] }))}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="danger"
                          className="self-end"
                          onClick={async () => {
                            if (!window.confirm(t.settings.remove(label) + "?")) return;
                            try {
                              await repo.removeMember(ws.id, m.user_id);
                              reload();
                            } catch (x) {
                              setTeamMsg({ text: why(x), bad: true });
                            }
                          }}
                        >
                          {t.settings.remove(label)}
                        </Button>
                      </>
                    ) : (
                      <span className="text-[0.875rem] text-[var(--text-mid)]">{t.settings.roles[m.role]}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {admin && (
            <form onSubmit={invite} className="mt-5 pt-5 border-t border-[var(--line)] flex flex-col gap-3" noValidate>
              <h3 className="m-0 text-[0.9375rem] font-semibold text-[var(--text-hi)]">{t.settings.invite}</h3>
              <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.settings.inviteHint}</p>
              <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <Field label={t.contacts.email} type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
                <div className="sm:w-40">
                  <Select
                    label={t.settings.role}
                    value={role}
                    onChange={(e) => setRole(e.target.value as "member" | "admin")}
                    options={(["member", "admin"] as const).map((r) => ({ value: r, label: t.settings.roles[r] }))}
                  />
                </div>
                <Button type="submit" variant="primary" disabled={!email.trim()}>
                  {t.add}
                </Button>
              </div>
            </form>
          )}
          <div className="mt-3">
            <Status message={teamMsg?.text ?? null} tone={teamMsg?.bad ? "bad" : "neutral"} />
          </div>
        </Card>
      </div>
    </>
  );
}
