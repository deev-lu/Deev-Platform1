import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon } from "lucide-react";
import logo from "../../assets/logo.png";
import { scrollToId, scrollToIdWhenReady, scrollToTop } from "../../lib/smoothScroll";
import { SERVICE_GROUPS, SERVICE_HREF } from "../../lib/serviceSections";
import { TEAM_READY } from "../../lib/team";
import L from "./L";
import { useT, useLocalePath } from "../../lib/useT";
import { stripLocale } from "../../lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import MegaMenu, { type PanelId } from "./MegaMenu";
import { ChevronDown } from "lucide-react";

interface NavbarProps {}

/** The drawer's flat list. #about only exists while both founder portraits do.
 *  Desktop navigation lives in MegaMenu; this is the phone. */
const DRAWER_LINKS = [
  { key: "work" as const,    href: "/work" },
  { key: "journal" as const, href: "/blog" },
  { key: "contact" as const, href: "/contact" },
];

/** The same sections the Services panel holds, as an accordion on a phone.
 *  Read from the shared list so the phone and the desktop cannot disagree. */
const DRAWER_SECTIONS = Object.values(SERVICE_GROUPS)
  .flat()
  .map((key) => ({ key, href: SERVICE_HREF[key] }))
  .filter((l) => l.href !== "#about" || TEAM_READY);

interface NavbarProps {
  theme?: "light" | "dark";
  toggleTheme?: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const t = useT();
  const localePath = useLocalePath();
  const { pathname } = useLocation();
  const atHome = stripLocale(pathname) === "/";
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 20);
      // The page alternates light and dark acts, so a bar styled for light
      // surfaces ends up floating over black. Ask what is actually under the
      // bar and follow it. Hit-tested per animation frame, not per event.
      const under = document.elementFromPoint(window.innerWidth / 2, 76);
      setOverDark(Boolean(under?.closest('[data-surface="dark"]')));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    // An anchor on the page you are already on is not a route change, so the
    // panel's route listener never fires and it would sit open over the
    // section it just sent you to.
    setPanel(null);
    // Route links (e.g. "/contact") navigate via the router
    if (href.startsWith("/")) {
      navigate(localePath(href));
      scrollToTop(true);
      return;
    }
    // The section links now also appear on /legal, /contact and the case
    // studies, where the target does not exist. Go home first, then scroll
    // once the section has mounted: they are lazy, so it is not there on the
    // first frame after navigation.
    const id = href.replace("#", "");
    if (document.getElementById(id)) {
      scrollToId(id);
      return;
    }
    navigate("/");
    scrollToIdWhenReady(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${ overDark ? "dark " : "" }${ scrolled ? overDark ? "bg-[#06060a]/90 md:bg-[#06060a]/75 border-b border-white/[0.09] " : "bg-white/90 md:bg-white/60 dark:bg-[#06060a]/90 md:dark:bg-[#06060a]/75 border-b border-white/50 dark:border-white/[0.09] " : "bg-transparent" }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

          {/* The wordmark goes home from anywhere, and it is a real anchor.
              As a <button> it only scrolled: on /work, /legal or an article it
              did nothing at all, it could not be opened in a new tab, and
              crawlers never saw the logo-to-homepage link every site is
              expected to have. On the homepage itself there is nowhere to
              navigate, so it scrolls to the top instead. */}
          <L
            to="/"
            onClick={(e) => {
              if (atHome) {
                e.preventDefault();
                scrollToTop();
              }
              setMenuOpen(false);
            }}
            aria-label={t.site.nav.home}
            className="flex items-center gap-1.5 shrink-0 group -ml-1"
          >
            <img
              src={logo}
              alt="DEEV"
              width={256}
              height={256}
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-[1.3rem] font-brand tracking-[0.015em] leading-none text-[#0a0f2e] dark:text-white">
              DEEV
            </span>
          </L>

          {/* Desktop navigation: three panels and a link. See MegaMenu. */}
          <MegaMenu open={panel} setOpen={setPanel} onAnchor={scrollTo} />

          {/* Right side: language, theme, CTA, burger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {toggleTheme && (
              <button
                onClick={toggleTheme}
                aria-label={theme === "dark" ? t.site.nav.toLight : t.site.nav.toDark}
                title={theme === "dark" ? t.site.nav.toLight : t.site.nav.toDark}
                className="w-9 h-9 flex items-center justify-center border border-[var(--line)] text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
                style={{ borderRadius: "var(--radius-1)" }}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Moon className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            )}

            {/* CTA */}
            <button
              onClick={() => scrollTo("#project-builder")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px "
              style={{ background: "var(--signal)" }}
            >
              {t.site.nav.cta}
            </button>

            {/* Mobile burger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${ scrolled ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]" : "text-slate-700 hover:bg-slate-200/60 dark:text-white/80 dark:hover:bg-white/[0.08]" }`}
              aria-label={menuOpen ? t.site.nav.closeMenu : t.site.nav.openMenu}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-0 right-0 z-30 bg-white/97 dark:bg-[#08080c]/97 border-b border-slate-200 dark:border-white/[0.08] md:hidden "
          >
            <nav className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1">
              {/* A hover panel is unusable on touch, so the same sections are
                  an accordion here rather than a second dropdown. */}
              <div className="flex items-center rounded-md text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all">
                {/* The row is a link to the services page; only the chevron
                    expands the list. Tapping the word goes somewhere. */}
                <L
                  to="/services"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 px-4 py-3.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t.site.nav.services}
                </L>
                <button
                  type="button"
                  onClick={() => setSectionsOpen((v) => !v)}
                  aria-expanded={sectionsOpen}
                  aria-label={t.site.mega.toggle(t.site.nav.services)}
                  className="px-4 py-3.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-[var(--dur-1)] ${sectionsOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {sectionsOpen && (
                <ul className="mb-1 ml-4 pl-4 border-l border-[var(--line)] flex flex-col">
                  {DRAWER_SECTIONS.map((item) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => scrollTo(item.href)}
                        className="block w-full text-left py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        style={{ fontSize: "var(--t-small)" }}
                      >
                        {t.site.mega.items[item.key as keyof typeof t.site.mega.items].label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {DRAWER_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3.5 rounded-md text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  {t.site.nav[link.key]}
                </button>
              ))}

              <button
                onClick={() => scrollTo("#project-builder")}
                className="mt-2 w-full py-3.5 text-white font-medium rounded-md text-sm transition-all hover:opacity-90"
                style={{ background: "var(--signal)" }}
              >
                {t.site.nav.cta} &rarr;
              </button>

              {/* A dropdown inside a drawer is a trap on a phone. Three
                  buttons in a row is the whole control. */}
              <div className="mt-5 pt-5 border-t border-[var(--line)] flex items-center justify-between gap-4">
                <span
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {t.site.nav.language}
                </span>
                <LanguageSwitcher compact />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
