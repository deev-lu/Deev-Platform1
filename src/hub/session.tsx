import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { hubConfigured, supabase, supabaseRepo } from "./supabase";
import { createDemoRepo, DEMO_USER } from "./demo";
import { HUB_DICTS, HUB_LANGS, type HubDict } from "./i18n";
import type { HubLang, Repo, Workspace } from "./types";
import { loadKlarAccess } from "../lib/klarAccess";

/**
 * Who is signed in, which agency they are working in, and in which language.
 *
 * Two sources of data behind one Repo interface: the real Hub (Supabase, the
 * person's own session) and the demo (in memory). The demo is entered on
 * purpose from the sign-in page and announced on every screen.
 */

interface HubState {
  status: "loading" | "signed-out" | "ready";
  demo: boolean;
  user: { id: string; email: string | null } | null;
  token: string | null;
  repo: Repo;
  workspaces: Workspace[];
  ws: Workspace | null;
  selectWorkspace: (id: string) => void;
  refreshWorkspaces: () => Promise<Workspace[]>;
  startDemo: () => void;
  signOut: () => Promise<void>;
  lang: HubLang;
  setLang: (l: HubLang) => void;
  t: HubDict;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Ctx = createContext<HubState | null>(null);

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* a preference that will not persist */
  }
};

function initialLang(): HubLang {
  const saved = read("hub-lang") as HubLang | null;
  if (saved && HUB_LANGS.includes(saved)) return saved;
  const nav = (typeof navigator !== "undefined" ? navigator.language : "en").slice(0, 2) as HubLang;
  return HUB_LANGS.includes(nav) ? nav : "en";
}

export function HubProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<HubLang>(initialLang);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [demoRepo, setDemoRepo] = useState<Repo | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!hubConfigured);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [wsLoaded, setWsLoaded] = useState(false);
  const [wsId, setWsId] = useState<string | null>(() => read("hub-ws"));

  const demo = Boolean(demoRepo);
  const repo = demoRepo ?? supabaseRepo;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  // The owner's accessibility menu, as on the website (lib/klarAccess.ts).
  useEffect(() => loadKlarAccess(), []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    write("theme", theme);
  }, [theme]);

  // The Supabase session: restored from storage, kept fresh, and followed
  // across tabs (signing out in one signs out everywhere).
  useEffect(() => {
    if (!hubConfigured) return;
    const db = supabase();
    db.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const user = demo ? DEMO_USER : session?.user ? { id: session.user.id, email: session.user.email ?? null } : null;

  const refreshWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([]);
      setWsLoaded(true);
      return [];
    }
    const list = await repo.myWorkspaces().catch(() => []);
    setWorkspaces(list);
    setWsLoaded(true);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, repo]);

  useEffect(() => {
    setWsLoaded(false);
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  const ws = workspaces.find((w) => w.id === wsId) ?? workspaces[0] ?? null;

  const value = useMemo<HubState>(
    () => ({
      status: !authReady || (user && !wsLoaded) ? "loading" : user ? "ready" : "signed-out",
      demo,
      user,
      token: session?.access_token ?? null,
      repo,
      workspaces,
      ws,
      selectWorkspace: (id) => {
        setWsId(id);
        write("hub-ws", id);
      },
      refreshWorkspaces,
      startDemo: () => setDemoRepo(createDemoRepo(lang)),
      signOut: async () => {
        if (demoRepo) {
          setDemoRepo(null);
          return;
        }
        if (hubConfigured) await supabase().auth.signOut();
      },
      lang,
      setLang: (l) => {
        setLangState(l);
        write("hub-lang", l);
      },
      t: HUB_DICTS[lang],
      theme,
      toggleTheme: () => setTheme((x) => (x === "dark" ? "light" : "dark")),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authReady, wsLoaded, user?.id, demo, session?.access_token, repo, workspaces, ws, lang, theme, refreshWorkspaces],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHub(): HubState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useHub outside HubProvider");
  return v;
}

/** The current workspace; screens behind the guard can rely on it. */
export function useWs(): Workspace {
  const { ws } = useHub();
  if (!ws) throw new Error("no workspace");
  return ws;
}
