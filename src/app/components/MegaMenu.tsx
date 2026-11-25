import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router";
import { ArrowRight, ArrowUpRight, BadgeEuro, ChevronDown } from "lucide-react";
import L from "./L";
import { MENU_FEATURED, PROJECTS, sectorOf } from "../../lib/projects";
import { WORK_CATEGORIES, categoryPath, inCategory } from "../../lib/workCategories";
import { MORE_SERVICES } from "../../lib/serviceSections";
import { ARTICLES, formatDate } from "../../lib/news";
import { useT, useLocale, useLocalePath } from "../../lib/useT";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * The desktop navigation panels.
 *
 * Three triggers, each opening a full-width panel under the bar. The reason
 * they are worth the machinery is that each one has real content behind it:
 * Services holds the homepage's own numbered sections, which had no entry in
 * the navigation at all before this (Marketing, AI workshops and Billovio were
 * unreachable except by scrolling); Work holds the recent projects with their
 * screenshots; Journal holds the latest articles. No column exists to be
 * filled.
 *
 * Behaviour, in the order it matters:
 *   - Opens on hover after a short delay and on click, because a panel that
 *     opens the instant a cursor crosses it fires while someone is travelling
 *     to the button next to it. From the keyboard it opens only from its
 *     chevron button (Enter or Space), never on focus alone.
 *   - Each panel sits in the DOM straight after its chevron, so the next Tab
 *     goes into the panel, not past it to the next trigger.
 *   - Closes on Escape (focus returns to the chevron), on outside click, on
 *     route change and when focus leaves the trigger and its panel.
 *   - Every trigger is a link to a real page (/services, /work, /blog) with a
 *     separate chevron button carrying aria-expanded for the panel, so the
 *     menu is a shortcut into a destination rather than the only route to it.
 *   - Rendered only while open, so nothing inside it is fetched or decoded
 *     for a visitor who never opens it. That matters: the Work panel holds
 *     three screenshots.
 *
 * Below md this component renders nothing. A hover panel is unusable on
 * touch; the drawer in Navbar carries the same links as an accordion.
 */

export type PanelId = "services" | "work" | "journal";

export default function MegaMenu({
  open,
  setOpen,
  onAnchor,
}: {
  open: PanelId | null;
  setOpen: (id: PanelId | null) => void;
  /** Navigates to a homepage anchor from wherever the visitor currently is. */
  onAnchor: (href: string) => void;
}) {
  const t = useT();
  const reduce = useReduceMotion();
  const { pathname } = useLocation();
  const wrap = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // Each trigger is a destination first and a panel second: the panel is a
  // shortcut into the page, never the only way to reach it.
  // Seit dem 25.11.2026 knapp: Websites, Projekte, Weitere Leistungen,
  // Ueber uns (dazu der Hauptknopf in Navbar). Blog, Kontakt, Workshops und
  // Foerderung stehen im Footer und im Panel "Weitere Leistungen".
  const TRIGGERS: { id: PanelId; label: string; to: string }[] = [
    { id: "work", label: t.site.nav.projects, to: "/work" },
    { id: "services", label: t.site.nav.more, to: "/services" },
  ];
  const plainLink = (key: "websites" | "about", to: string) => (
    <L
      key={key}
      to={to}
      className="group relative px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-600 dark:text-[var(--text-mid)] hover:text-slate-900 dark:hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
      onMouseEnter={hoverClose}
    >
      {t.site.nav[key]}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 right-3 bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-[240ms] ease-[cubic-bezier(0.16,1,0.30,1)] group-hover:scale-x-100"
      />
    </L>
  );

  // A route change means the visitor got where they were going.
  useEffect(() => setOpen(null), [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Focus inside the panel would fall to <body> when it unmounts.
      const panel = document.getElementById(`mega-${open}`);
      if (panel?.contains(document.activeElement)) {
        document.querySelector<HTMLButtonElement>(`[aria-controls="mega-${open}"]`)?.focus();
      }
      setOpen(null);
    };
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, setOpen]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hoverOpen = (id: PanelId) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(id), 90);
  };
  const hoverClose = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(null), 160);
  };

  return (
    <div
      ref={wrap}
      className="hidden md:block"
      onMouseLeave={hoverClose}
      onMouseEnter={() => window.clearTimeout(timer.current)}
    >
      <nav aria-label={t.site.nav.mainNav} className="flex items-center gap-1">
        {plainLink("websites", "/services/websites")}
        {TRIGGERS.map((trigger) => {
          const on = open === trigger.id;
          return (
            <div
              key={trigger.id}
              className="group/trigger relative flex items-center"
              onMouseEnter={() => hoverOpen(trigger.id)}
              onBlur={(e) => {
                if (on && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(null);
              }}
            >
              {/* The label navigates. Clicking "Blog" goes to the blog; it
                  does not merely open a panel about it, and a crawler now
                  finds a real href where there used to be a bare button. */}
              <L
                to={trigger.to}
                className={`relative pl-3 pr-1 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-[var(--dur-1)] ${
                  on
                    ? "text-slate-900 dark:text-[var(--text-hi)]"
                    : "text-slate-600 dark:text-[var(--text-mid)] hover:text-slate-900 dark:hover:text-[var(--text-hi)]"
                }`}
              >
                {trigger.label}
              </L>

              {/* The panel keeps its own control, so it can still be opened
                  and closed from the keyboard without leaving the page. */}
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`mega-${trigger.id}`}
                aria-label={t.site.mega.toggle(trigger.label)}
                onClick={() => setOpen(on ? null : trigger.id)}
                className={`relative pr-3 pl-0.5 py-2 transition-colors duration-[var(--dur-1)] ${
                  on
                    ? "text-slate-900 dark:text-[var(--text-hi)]"
                    : "text-slate-500 dark:text-[var(--text-low)] hover:text-slate-900 dark:hover:text-[var(--text-hi)]"
                }`}
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-[var(--dur-1)] ${on ? "rotate-180" : ""}`}
                  strokeWidth={1.75}
                />
              </button>

              <span
                aria-hidden="true"
                className={`pointer-events-none absolute left-3 right-3 bottom-1 h-px origin-left bg-current transition-transform duration-[240ms] ease-[cubic-bezier(0.16,1,0.30,1)] ${
                  on ? "scale-x-100" : "scale-x-0 group-hover/trigger:scale-x-100"
                }`}
              />

              <AnimatePresence>
                {on && (
                  <motion.div
                    key={trigger.id}
                    id={`mega-${trigger.id}`}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed left-0 right-0 top-[76px] z-40"
                    style={{ paddingInline: "clamp(12px, 2.4vw, 40px)" }}
                  >
                    <div
                      className="mx-auto rounded-[var(--radius-2)] border border-[var(--line-strong)] bg-[var(--surface-1)] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]"
                      style={{ maxWidth: "calc(var(--container) - 2 * clamp(12px, 2.4vw, 40px))", paddingInline: "clamp(24px, 3vw, 48px)", paddingBlock: "40px" }}
                    >
                      {trigger.id === "services" && <MorePanel />}
                      {trigger.id === "work" && <WorkPanel />}
                      {trigger.id === "journal" && <JournalPanel />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {plainLink("about", "/about")}
      </nav>

    </div>
  );
}

function ColumnHeading({ children }: { children: ReactNode }) {
  return (
    <div
      className="eyebrow-mono uppercase text-[var(--text-low)] pb-4 mb-5 border-b border-[var(--line)]"
      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
    >
      {children}
    </div>
  );
}

function MorePanel() {
  const t = useT();
  const m = t.web.more;

  return (
    <div className="grid grid-cols-12 gap-x-10 gap-y-10">
      <div className="col-span-9">
        <ColumnHeading>{t.site.nav.more}</ColumnHeading>
        <ul className="grid grid-cols-3 gap-x-8 gap-y-2">
          {MORE_SERVICES.map(([key, to]) => (
            <li key={key}>
              <L
                to={to}
                className="group block w-full text-left py-2.5 px-3 -mx-3 rounded-[var(--radius-1)] hover:bg-[var(--surface-2)] transition-colors duration-[var(--dur-1)]"
              >
                <span className="flex items-center gap-2 text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-small)" }}>
                  {m.items[key].title}
                  <ArrowRight
                    className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[var(--dur-1)] text-[var(--signal-text)]"
                    strokeWidth={1.5}
                  />
                </span>
                <span className="block text-[var(--text-low)] mt-1" style={{ fontSize: "var(--t-label)", lineHeight: 1.5 }}>
                  {m.items[key].line}
                </span>
              </L>
            </li>
          ))}
        </ul>
        {/* Was nicht mehr in der Leiste steht, bleibt einen Klick entfernt. */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 pt-5 border-t border-[var(--line)]" style={{ fontSize: "var(--t-small)" }}>
          {([
            [t.site.footer.links.grant, "/sme-packages"],
            [t.site.nav.journal, "/blog"],
            [t.site.nav.contact, "/contact"],
          ] as const).map(([label, to]) => (
            <L key={to} to={to} className="text-[var(--text-mid)] hover:text-[var(--text-hi)] underline underline-offset-4 decoration-[var(--line)] hover:decoration-[var(--line-strong)]">
              {label}
            </L>
          ))}
        </div>
      </div>

      {/* The one thing most visitors are actually here to find out. */}
      <div className="col-span-3">
        <div className="h-full border border-[var(--positive)]/35 bg-[var(--surface-1)] p-7 flex flex-col" style={{ borderRadius: "var(--radius-1)" }}>
          <BadgeEuro className="w-5 h-5 text-[var(--positive)] mb-5" strokeWidth={1.5} />
          <div
            className="eyebrow-mono uppercase text-[var(--positive)] mb-3"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.site.mega.feature.badge}
          </div>
          <div className="text-[var(--text-hi)] font-medium mb-3" style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}>
            {t.site.mega.feature.title}
          </div>
          <p className="text-[var(--text-mid)] mb-6" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
            {t.site.mega.feature.body}
          </p>
          <L
            to="/sme-packages"
            className="group mt-auto inline-flex items-center gap-2 text-[var(--positive)] font-medium"
            style={{ fontSize: "var(--t-small)" }}
          >
            {t.site.mega.feature.cta}
            <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
          </L>
        </div>
      </div>
    </div>
  );
}

function WorkPanel() {
  const t = useT();
  const locale = useLocale();
  // Kuratiert statt "die ersten drei", siehe MENU_FEATURED.
  const recent = MENU_FEATURED;

  return (
    <div className="grid grid-cols-12 gap-x-10 gap-y-8">
      {/* Each category is a real page, so this is a list of destinations
          rather than a set of switches that only work on /work. */}
      <div className="col-span-3">
        <ColumnHeading>{t.site.mega.work.browse}</ColumnHeading>
        <ul className="flex flex-col">
          {WORK_CATEGORIES.filter((c) => PROJECTS.some((p) => inCategory(p, c.tag))).map((c) => {
            // Mehrfachzuordnung: ein Projekt zaehlt in jeder Kategorie, zu der
            // es gehoert. Leere Kategorien erscheinen gar nicht erst.
            const n = PROJECTS.filter((p) => inCategory(p, c.tag)).length;
            return (
              <li key={c.key}>
                <L
                  to={categoryPath(c.slug)}
                  className="group flex items-baseline justify-between gap-4 py-2.5 px-3 -mx-3 rounded-[var(--radius-1)] hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
                >
                  <span
                    className="flex items-center gap-2 text-[var(--text-hi)] font-medium"
                    style={{ fontSize: "var(--t-small)" }}
                  >
                    {c.slug ? t.pages.work.filters[c.key] : t.site.mega.work.all}
                    <ArrowRight
                      className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[var(--dur-1)] text-[var(--signal-text)]"
                      strokeWidth={1.5}
                    />
                  </span>
                  <span
                    className="eyebrow-mono text-[var(--text-low)] tabular-nums shrink-0"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {n}
                  </span>
                </L>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="col-span-9">
        <ColumnHeading>{t.site.mega.work.recent}</ColumnHeading>
        <ul className="grid grid-cols-3 gap-6">
          {recent.map((p) => (
            <li key={p.slug}>
              <L to={`/work/${p.slug}`} className="group block">
                <div
                  className="relative w-full overflow-hidden border border-[var(--line)] bg-[var(--surface-2)]"
                  style={{ aspectRatio: "1000 / 583", borderRadius: "var(--radius-1)" }}
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={`${p.title}, ${sectorOf(p, locale)}`}
                      width={1000}
                      height={583}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[var(--dur-4)] group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="mt-3 text-[var(--text-hi)] font-medium truncate" style={{ fontSize: "var(--t-small)" }}>
                  {p.title}
                </div>
                <div
                  className="eyebrow-mono uppercase text-[var(--text-low)] mt-1 truncate"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {sectorOf(p, locale)}
                </div>
              </L>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function JournalPanel() {
  const t = useT();
  const locale = useLocale();
  const latest = ARTICLES.slice(0, 3);

  return (
    <div className="grid grid-cols-12 gap-x-10 gap-y-8">
      <div className="col-span-3">
        <ColumnHeading>{t.site.mega.journal.browse}</ColumnHeading>
        <ul className="flex flex-col gap-2.5">
          {(["funding", "engineering", "ai"] as const).map((k) => (
            <li key={k}>
              <L
                to="/blog"
                className="text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
                style={{ fontSize: "var(--t-small)" }}
              >
                {t.news.topics[k]}
              </L>
            </li>
          ))}
        </ul>
        <L
          to="/blog"
          className="group inline-flex items-center gap-3 text-[var(--text-hi)] font-medium mt-6"
          style={{ fontSize: "var(--t-small)" }}
        >
          {t.site.mega.journal.all}
          <ArrowUpRight
            className="w-4 h-4 text-[var(--signal-text)] transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </L>
      </div>

      <div className="col-span-9">
        <ColumnHeading>{t.site.mega.journal.latest}</ColumnHeading>
        <ul className="grid grid-cols-3 gap-8">
          {latest.map((a) => (
            <li key={a.slug}>
              <L to={`/blog/${a.slug}`} className="group block">
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    className="eyebrow-mono uppercase text-[var(--signal-text)]"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {t.news.topics[a.topic]}
                  </span>
                  <time
                    dateTime={a.date}
                    className="eyebrow-mono uppercase text-[var(--text-low)] tabular-nums"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {formatDate(a.date, locale)}
                  </time>
                </div>
                <div
                  className="text-[var(--text-hi)] font-medium group-hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                  style={{ fontSize: "var(--t-small)", lineHeight: 1.4 }}
                >
                  {a[locale].title}
                </div>
                <div
                  className="eyebrow-mono uppercase text-[var(--text-low)] mt-2"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {t.news.readingTime(a.minutes)}
                </div>
              </L>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
