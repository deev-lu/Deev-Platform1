import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon, Phone } from "lucide-react";
import logo from "../../assets/logo.png";
import { scrollToId, scrollToIdWhenReady, scrollToTop } from "../../lib/smoothScroll";
import { SERVICE_GROUPS, SERVICE_HREF } from "../../lib/serviceSections";
import L from "./L";
import { useT, useLocalePath } from "../../lib/useT";
import { stripLocale } from "../../lib/i18n";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "../../lib/whatsapp";
import LanguageSwitcher from "./LanguageSwitcher";
import MegaMenu, { type PanelId } from "./MegaMenu";
import { useLargeText } from "../../lib/klarAccess";
import { ChevronDown } from "lucide-react";

interface NavbarProps {}

/** The drawer's flat list. Desktop navigation lives in MegaMenu; this is the
 *  phone. "About" is a page of its own since 24 Oct 2026, so it sits here and
 *  is left out of the services accordion below. */
const DRAWER_LINKS = [
  { key: "workshops" as const, href: "/workshops" },
  { key: "funding" as const,   href: "/sme-packages" },
  { key: "work" as const,      href: "/work" },
  { key: "about" as const,     href: "/about" },
  { key: "journal" as const,   href: "/blog" },
  { key: "contact" as const,   href: "/contact" },
];

/** The same sections the Services panel holds, as an accordion on a phone.
 *  Read from the shared list so the phone and the desktop cannot disagree. */
const DRAWER_SECTIONS = Object.values(SERVICE_GROUPS)
  .flat()
  .map((key) => ({ key, href: SERVICE_HREF[key] }))
  .filter((l) => l.href !== "/about");

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
  const burger = useRef<HTMLButtonElement>(null);
  // Enlarged text (Klar Access): the compact bar at every width, so no
  // control is pushed off the screen.
  const compact = useLargeText();

  // The phone drawer is a disclosure: Escape closes it and hands focus back
  // to the button that opened it (WCAG 2.1.2, 2.4.3).
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      burger.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 20);
      // The page alternates light and dark acts, so a bar styled for light
      // surfaces ends up floating over black. Ask what is actually under the
      // bar and follow it. Hit-tested per animation frame, not per event.
      // Hit-tested behind the bar itself (its middle, 34px), skipping the bar.
      // Testing just below it (76px) misread pages whose dark panel starts
      // right under the bar: on /workshops in the light theme the links went
      // white on white (WCAG 1.4.3).
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 34)
        .find((el) => !el.closest("header"));
      setOverDark(Boolean(under?.closest('[data-surface="dark"]')));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    // Pages load lazily: measure again once the new page has painted.
    const late = window.setTimeout(measure, 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(late);
    };
  }, [pathname]);

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
      {/* Kein Einschweben mehr. Die Navigation ist das erste, was ein Besucher
          braucht, und sie stand im vorgerenderten HTML mit Deckkraft 0 - ohne
          JavaScript also gar nicht.
          Seit dem 30.10.2026 zwei schwebende Glas-Pillen (design.css,
          .glass-pill): links das Zeichen mit dem Schriftzug, der beim
          Scrollen einfaehrt, rechts Navigation, Sprache, Thema, Telefon und
          der Hauptknopf als Verlaufs-Ende. Die Leiste selbst ist
          durchsichtig; ueber dunklen Panels im hellen Thema werden die
          Pillen dunkel (overDark). */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 pt-3 ${ overDark ? "dark" : "" }`}
      >
        <div
          className="mx-auto h-14 flex items-center justify-between gap-3"
          style={{ maxWidth: "var(--container)", paddingInline: "clamp(12px, 2.4vw, 40px)" }}
        >

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
            className="glass-pill group h-14 shrink-0 flex items-center rounded-full pl-3 pr-3 md:pl-3.5 transition-[padding] duration-[var(--dur-3)]"
            style={{ paddingRight: scrolled ? 12 : 22 }}
          >
            <img
              src={logo}
              alt=""
              width={256}
              height={256}
              className="h-9 w-9 object-contain transition-transform duration-300 group-hover:rotate-[-8deg]"
            />
            {/* Beim Scrollen faehrt der Schriftzug ein: aus der Pille wird
                ein Kreis mit dem Zeichen (wie bei nvision die Logo-Karte). */}
            <span
              className="font-brand leading-none text-[#0a0f2e] dark:text-white overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-[var(--dur-3)]"
              style={{ fontSize: "1.25rem", letterSpacing: "0.015em", maxWidth: scrolled ? 0 : 80, opacity: scrolled ? 0 : 1, marginLeft: scrolled ? 0 : 8 }}
            >
              DEEV
            </span>
          </L>

          {/* Die rechte Pille: Navigation (MegaMenu), Sprache, Thema, Telefon,
              Hauptknopf. */}
          <div className="glass-pill h-14 flex items-center gap-1.5 md:gap-2 rounded-full pl-2 md:pl-3 pr-1.5 min-w-0">
          {/* Desktop navigation: three panels and a link. See MegaMenu. */}
          {!compact && <MegaMenu open={panel} setOpen={setPanel} onAnchor={scrollTo} />}

          {/* Right side: language, theme, CTA, burger */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className={compact ? "hidden" : "hidden sm:block"}>
              <LanguageSwitcher />
            </div>

            {toggleTheme && (
              <button
                onClick={toggleTheme}
                aria-label={theme === "dark" ? t.site.nav.toLight : t.site.nav.toDark}
                title={theme === "dark" ? t.site.nav.toLight : t.site.nav.toDark}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Moon className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            )}

            {/* Telefon: die Nummer ab 1280px, darunter nur das Symbol. Auf
                dem Telefon waehlt ein Tippen direkt. */}
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              aria-label={`${t.site.nav.call}: ${WHATSAPP_DISPLAY}`}
              className="inline-flex items-center justify-center gap-2 h-10 min-w-10 px-2.5 xl:px-3.5 rounded-full border border-[var(--line-strong)] text-[var(--text-hi)] hover:bg-[var(--surface-2)] transition-colors duration-[var(--dur-1)] whitespace-nowrap"
              style={{ fontSize: "0.8125rem" }}
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              <span className={compact ? "hidden" : "hidden xl:inline"}>{WHATSAPP_DISPLAY}</span>
            </a>

            {/* Ein Hauptknopf, ueberall derselbe (seit dem 24.10.2026): das
                kostenlose Erstgespraech. Der Preisrechner bleibt ueber die
                Leistungsseiten und den Footer erreichbar; "Kontakt" steht
                bereits als Textlink in der Navigation. */}
            <L
              to="/contact?interest=call"
              className={`btn-grad ${compact ? "hidden" : "hidden lg:inline-flex"} items-center gap-2 h-11 px-5 rounded-full whitespace-nowrap text-sm font-semibold text-white`}
            >
              {t.site.nav.cta}
            </L>

            {/* Mobile burger */}
            <button
              ref={burger}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`${compact ? "" : "md:hidden "}btn-grad w-11 h-11 flex items-center justify-center rounded-full text-white`}
              aria-label={menuOpen ? t.site.nav.closeMenu : t.site.nav.openMenu}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            id="mobile-menu"
            data-lenis-prevent
            className={`fixed top-[76px] left-3 right-3 z-30 max-h-[calc(100dvh-88px)] overflow-y-auto overscroll-contain rounded-[var(--radius-2)] bg-[var(--surface-1)] border border-[var(--line-strong)] ${compact ? "" : "md:hidden"}`}
          >
            <nav aria-label={t.site.nav.mainNav} className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1">
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
                  className="px-4 py-3.5 text-[var(--text-mid)] hover:text-slate-900 dark:hover:text-white transition-colors"
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
                      <L
                        to={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block w-full text-left py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        style={{ fontSize: "var(--t-small)" }}
                      >
                        {t.site.mega.items[item.key as keyof typeof t.site.mega.items].label}
                      </L>
                    </li>
                  ))}
                </ul>
              )}

              {/* Pages are links, so they announce as links and open in a new
                  tab like any other. */}
              {DRAWER_LINKS.map((link) => (
                <L
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-left px-4 py-3.5 rounded-md text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  {t.site.nav[link.key]}
                </L>
              ))}

              <L
                to="/contact?interest=call"
                onClick={() => setMenuOpen(false)}
                className="mt-2 w-full py-3.5 text-white font-medium rounded-md text-sm transition-all hover:opacity-90 text-center"
                style={{ background: "var(--signal)" }}
              >
                {t.site.nav.cta} &rarr;
              </L>

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
