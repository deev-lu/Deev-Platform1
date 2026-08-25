import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocation } from "react-router";
import { ArrowRight, ArrowUpRight, BadgeEuro } from "lucide-react";
import L from "./L";
import { PROJECTS } from "../../lib/projects";
import { WORK_CATEGORIES, categoryPath } from "../../lib/workCategories";
import { ARTICLES, formatDate } from "../../lib/news";
import { useT, useLocale, useLocalePath } from "../../lib/useT";

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
 *     to the button next to it.
 *   - Closes on Escape, on outside click, on route change and when focus
 *     leaves the panel.
 *   - Every trigger is a real button with aria-expanded, and the panel is
 *     labelled by it.
 *   - Rendered only while open, so nothing inside it is fetched or decoded
 *     for a visitor who never opens it. That matters: the Work panel holds
 *     three screenshots.
 *
 * Below md this component renders nothing. A hover panel is unusable on
 * touch; the drawer in Navbar carries the same links as an accordion.
 */

const SECTIONS = {
  build: ["what-we-build", "how-it-runs", "pricing"],
  grow: ["marketing", "ai", "billovio"],
  studio: ["why-it-works", "why-deev", "about"],
} as const;

const HREF: Record<string, string> = {
  "what-we-build": "#services",
  "how-it-runs": "#how-it-runs",
  pricing: "#pricing",
  marketing: "#marketing",
  ai: "#ai",
  billovio: "#billovio",
  "why-it-works": "#why-it-works",
  "why-deev": "#why-deev",
  about: "#about",
};

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
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const wrap = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const TRIGGERS: { id: PanelId; label: string }[] = [
    { id: "services", label: t.site.nav.services },
    { id: "work", label: t.site.nav.work },
    { id: "journal", label: t.site.nav.journal },
  ];

  // A route change means the visitor got where they were going.
  useEffect(() => setOpen(null), [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
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
      <nav className="flex items-center gap-1">
        {TRIGGERS.map((trigger) => (
          <button
            key={trigger.id}
            type="button"
            aria-expanded={open === trigger.id}
            aria-controls={`mega-${trigger.id}`}
            onMouseEnter={() => hoverOpen(trigger.id)}
            onFocus={() => setOpen(trigger.id)}
            onClick={() => setOpen(open === trigger.id ? null : trigger.id)}
            className={`group relative px-3 py-2 text-sm font-medium transition-colors duration-[var(--dur-1)] ${
              open === trigger.id
                ? "text-slate-900 dark:text-[var(--text-hi)]"
                : "text-slate-600 dark:text-[var(--text-mid)] hover:text-slate-900 dark:hover:text-[var(--text-hi)]"
            }`}
          >
            {trigger.label}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-3 right-3 bottom-1 h-px origin-left bg-current transition-transform duration-[240ms] ease-[cubic-bezier(0.16,1,0.30,1)] ${
                open === trigger.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </button>
        ))}

        <L
          to="/contact"
          className="group relative px-3 py-2 text-sm font-medium text-slate-600 dark:text-[var(--text-mid)] hover:text-slate-900 dark:hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
          onMouseEnter={hoverClose}
          onFocus={() => setOpen(null)}
        >
          {t.site.nav.contact}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 right-3 bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-[240ms] ease-[cubic-bezier(0.16,1,0.30,1)] group-hover:scale-x-100"
          />
        </L>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            id={`mega-${open}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 right-0 top-[68px] z-40 border-y border-[var(--line)] bg-[var(--surface-0)]"
          >
            <div
              className="mx-auto"
              style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "44px" }}
            >
              {open === "services" && <ServicesPanel onAnchor={onAnchor} />}
              {open === "work" && <WorkPanel />}
              {open === "journal" && <JournalPanel />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

function ServicesPanel({ onAnchor }: { onAnchor: (href: string) => void }) {
  const t = useT();
  const localePath = useLocalePath();

  return (
    <div className="grid grid-cols-12 gap-x-10 gap-y-10">
      {(Object.keys(SECTIONS) as (keyof typeof SECTIONS)[]).map((col) => (
        <div key={col} className="col-span-3">
          <ColumnHeading>{t.site.mega.columns[col]}</ColumnHeading>
          <ul className="flex flex-col gap-1">
            {SECTIONS[col].map((id) => {
              const item = t.site.mega.items[id];
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onAnchor(HREF[id])}
                    className="group block w-full text-left py-2.5 px-3 -mx-3 rounded-[var(--radius-1)] hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
                  >
                    <span className="flex items-center gap-2 text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-small)" }}>
                      {item.label}
                      <ArrowRight
                        className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[var(--dur-1)] text-[var(--signal-text)]"
                        strokeWidth={1.5}
                      />
                    </span>
                    <span className="block text-[var(--text-low)] mt-1" style={{ fontSize: "var(--t-label)", lineHeight: 1.5 }}>
                      {item.desc}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

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
          <a
            href={`${localePath("/")}#pricing`}
            className="group mt-auto inline-flex items-center gap-2 text-[var(--positive)] font-medium"
            style={{ fontSize: "var(--t-small)" }}
          >
            {t.site.mega.feature.cta}
            <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </div>
  );
}

function WorkPanel() {
  const t = useT();
  const recent = PROJECTS.slice(0, 3);

  return (
    <div className="grid grid-cols-12 gap-x-10 gap-y-8">
      {/* Each category is a real page, so this is a list of destinations
          rather than a set of switches that only work on /work. */}
      <div className="col-span-3">
        <ColumnHeading>{t.site.mega.work.browse}</ColumnHeading>
        <ul className="flex flex-col">
          {WORK_CATEGORIES.map((c) => {
            const n =
              c.filter === "All"
                ? PROJECTS.length
                : PROJECTS.filter((p) => p.filter === c.filter).length;
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
                      alt={`${p.title}, ${p.category}`}
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
                  {p.category}
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
