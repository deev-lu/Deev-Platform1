import { useState, type FormEvent } from "react";
import { useHub } from "../session";
import { Brand, LangSelect, ThemeButton } from "../Shell";
import { Button, Field, Select, Status } from "../ui";
import { RepoError } from "../supabase";
import { HUB_LANGS, HUB_LANG_NAMES } from "../i18n";
import type { HubLang } from "../types";

/** Sign-up, step two: name the agency. The database makes the person its owner. */
export default function Welcome() {
  const { t, lang, repo, refreshWorkspaces, selectWorkspace, signOut } = useHub();
  const [name, setName] = useState("");
  const [owner, setOwner] = useState(() => {
    try {
      return sessionStorage.getItem("hub-owner-name") ?? "";
    } catch {
      return "";
    }
  });
  const [stageLang, setStageLang] = useState<HubLang>(lang);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const id = await repo.createWorkspace(name.trim(), stageLang, owner.trim());
      selectWorkspace(id);
      await refreshWorkspaces();
    } catch (x) {
      setErr(x instanceof RepoError && x.code === "workspace-limit" ? t.welcome.limit : t.error);
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between gap-3 h-16 px-4 sm:px-8">
        <Brand />
        <div className="flex items-center gap-2">
          <LangSelect />
          <ThemeButton />
          <Button size="sm" onClick={() => signOut()}>
            {t.nav.signOut}
          </Button>
        </div>
      </header>
      <main id="main" className="flex-1 grid place-items-center px-4 py-10">
        <div className="w-full max-w-lg rounded-[var(--radius-2)] border border-[var(--line)] bg-[var(--surface-1)] p-6 sm:p-8">
          <h1 className="m-0 font-brand text-[1.75rem] text-[var(--text-hi)]">{t.welcome.title}</h1>
          <p className="mt-2 mb-6 text-[var(--text-mid)]">{t.welcome.lead}</p>
          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.required}</p>
            <Field label={t.welcome.agency} required autoComplete="organization" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
            <Field label={t.auth.name} required autoComplete="name" maxLength={120} value={owner} onChange={(e) => setOwner(e.target.value)} />
            <Select
              label={t.welcome.lang}
              value={stageLang}
              onChange={(e) => setStageLang(e.target.value as HubLang)}
              options={HUB_LANGS.map((l) => ({ value: l, label: HUB_LANG_NAMES[l] }))}
            />
            <Status message={err} tone="bad" />
            <Button type="submit" variant="primary" disabled={busy || !name.trim() || !owner.trim()}>
              {busy ? t.saving : t.welcome.create}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
