import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon } from "lucide-react";
import logo from "../../assets/logo.png";
import { scrollToId, scrollToIdWhenReady, scrollToTop } from "../../lib/smoothScroll";
import { TEAM_READY } from "../../lib/team";
import L from "./L";
import { useT, useLocalePath } from "../../lib/useT";
import { stripLocale } from "../../lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {}

/** #about only exists while both founder portraits do. The labels come from
 *  the dictionary, the hrefs do not: an anchor is part of the page structure
 *  and is the same in every language. */
const NAV_HREFS = [
  { key: "services" as const,  href: "#services" },
  { key: "work" as const,      href: "/work" },
  { key: "journal" as const,   href: "/news" },
  { key: "pricing" as const,   href: "#project-builder" },
  { key: "whyDeev" as const,   href: "#why-deev" },
  { key: "about" as const,     href: "#about" },
  { key: "contact" as const,   href: "/contact" },
].filter((l) => l.href !== "#about" || TEAM_READY);

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
  const links = NAV_HREFS.map((l) => ({ ...l, label: t.site.nav[l.key] }));

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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="group relative px-1 py-2 text-sm font-medium text-slate-600 dark:text-[var(--text-mid)] hover:text-slate-900 dark:hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 bottom-1 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-[240ms] ease-[cubic-bezier(0.16,1,0.30,1)] group-hover:scale-x-100"
                />
              </button>
            ))}
          </nav>

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
              {links.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3.5 rounded-md text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  {link.label}
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
