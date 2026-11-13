import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router";
import { useHub } from "./session";
import { HUB_LANGS, HUB_LANG_NAMES } from "./i18n";
import type { HubLang } from "./types";
import logo from "../assets/logo.png";

const NAV = [
  ["/", "dashboard", "◧"],
  ["/pipeline", "pipeline", "▥"],
  ["/contacts", "contacts", "◉"],
  ["/catalog", "catalog", "▤"],
  ["/tasks", "tasks", "✓"],
  ["/copilot", "copilot", "✦"],
  ["/settings", "settings", "⚙"],
] as const;

/** The DEEV mark, the same file as the website's navbar. Decorative: the name follows it. */
export function Mark({ size = 30 }: { size?: number }) {
  return <img src={logo} alt="" width={size} height={size} className="object-contain" style={{ width: size, height: size }} />;
}

export function Brand() {
  const { t } = useHub();
  return (
    <span className="flex items-center gap-2.5">
      <Mark />
      <span className="flex flex-col leading-none">
        <span className="font-brand text-[1.0625rem] text-[var(--text-hi)] tracking-[-0.01em]">{t.brand}</span>
        <span className="text-[0.6875rem] text-[var(--text-low)] mt-1">{t.by}</span>
      </span>
    </span>
  );
}

export function LangSelect({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useHub();
  return (
    <label className={`flex items-center gap-2 text-[0.8125rem] text-[var(--text-mid)] ${className}`}>
      <span className="sr-only">{t.nav.language}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as HubLang)}
        className="h-9 rounded-full border border-[var(--line-control)] bg-[var(--surface-1)] text-[var(--text-hi)] px-3"
      >
        {HUB_LANGS.map((l) => (
          <option key={l} value={l}>
            {HUB_LANG_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ThemeButton() {
  const { theme, toggleTheme, t } = useHub();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t.nav.theme}
      title={t.nav.theme}
      aria-pressed={theme === "dark"}
      className="grid place-items-center w-9 h-9 rounded-full border border-[var(--line-control)] text-[var(--text-hi)] hover:bg-[var(--surface-2)]"
    >
      <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
    </button>
  );
}

export function DemoBanner() {
  const { demo, t, signOut } = useHub();
  if (!demo) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-[0.8125rem] bg-[var(--signal)] text-white">
      <span>{t.demo.banner}</span>
      <button type="button" onClick={() => signOut()} className="underline underline-offset-2 font-medium">
        {t.demo.leave}
      </button>
    </div>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const { t, ws, workspaces, selectWorkspace, user, signOut } = useHub();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  // A new screen: close the phone menu, move focus to the page so a screen
  // reader starts at its heading (the title is announced with it).
  useEffect(() => {
    setOpen(false);
    if (first.current) {
      first.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const nav = (
    <ul className="m-0 p-0 list-none flex flex-col gap-1">
      {NAV.map(([to, key, icon]) => (
        <li key={to}>
          <NavLink
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-3.5 rounded-[var(--radius-1)] text-[0.9375rem] transition-colors ${
                isActive
                  ? "bg-[var(--signal-dim)] text-[var(--text-hi)] font-semibold"
                  : "text-[var(--text)] hover:bg-[var(--surface-2)] hover:text-[var(--text-hi)]"
              }`
            }
          >
            <span aria-hidden="true" className="w-5 text-center text-[var(--signal-text)]">
              {icon}
            </span>
            {t.nav[key]}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-3 focus:left-3 focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[var(--signal)] focus:text-white">
        {t.skip}
      </a>
      <DemoBanner />
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 h-16 px-4 sm:px-6 border-b border-[var(--line)] bg-[var(--surface-0)]">
        <div className="flex items-center gap-4 min-w-0">
          <Brand />
          {ws && workspaces.length > 1 ? (
            <label className="hidden md:flex items-center gap-2 text-[0.8125rem] text-[var(--text-mid)]">
              {t.nav.workspace}
              <select
                value={ws.id}
                onChange={(e) => selectWorkspace(e.target.value)}
                className="h-9 rounded-full border border-[var(--line-control)] bg-[var(--surface-1)] text-[var(--text-hi)] px-3"
              >
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            ws && <span className="hidden md:inline text-[0.875rem] text-[var(--text-mid)] truncate">{ws.name}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LangSelect className="hidden sm:flex" />
          <ThemeButton />
          <button
            type="button"
            onClick={() => signOut()}
            className="hidden lg:inline-flex h-9 items-center px-3.5 rounded-full border border-[var(--line-control)] text-[0.8125rem] text-[var(--text-hi)] hover:bg-[var(--surface-2)]"
          >
            {t.nav.signOut}
          </button>
          <button
            type="button"
            className="lg:hidden h-9 px-3.5 rounded-full bg-[var(--signal)] text-white text-[0.8125rem] font-medium"
            aria-expanded={open}
            aria-controls="hub-mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {t.nav.menu}
          </button>
        </div>
      </header>

      {open && (
        <nav id="hub-mobile-nav" aria-label={t.nav.label} className="lg:hidden border-b border-[var(--line)] bg-[var(--surface-1)] p-3">
          {nav}
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-[var(--line)]">
            <LangSelect />
            {workspaces.length > 1 && ws && (
              <label className="flex items-center gap-2 text-[0.8125rem] text-[var(--text-mid)]">
                {t.nav.workspace}
                <select
                  value={ws.id}
                  onChange={(e) => selectWorkspace(e.target.value)}
                  className="h-9 rounded-full border border-[var(--line-control)] bg-[var(--surface-1)] text-[var(--text-hi)] px-3"
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button type="button" onClick={() => signOut()} className="h-9 px-3.5 rounded-full border border-[var(--line-control)] text-[0.8125rem] text-[var(--text-hi)]">
              {t.nav.signOut}
            </button>
          </div>
        </nav>
      )}

      <div className="flex-1 flex">
        <nav aria-label={t.nav.label} className="hidden lg:flex flex-col w-60 shrink-0 border-r border-[var(--line)] p-3 sticky top-16 h-[calc(100vh-4rem)]">
          {nav}
          {user?.email && <p className="mt-auto px-3 text-[0.75rem] text-[var(--text-low)] truncate">{user.email}</p>}
        </nav>
        <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 min-w-0 px-4 sm:px-8 py-6 sm:py-8 outline-none">
          <div className="mx-auto max-w-[1280px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
