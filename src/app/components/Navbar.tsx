import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon } from "lucide-react";
import logo from "../../assets/logo.png";

interface NavbarProps {}

const NAV_LINKS = [
  { label: "Services",  href: "#services" },
  { label: "Work",      href: "#portfolio" },
  { label: "Pricing",   href: "#project-builder" },
  { label: "Why Deev",  href: "#why-deev" },
  { label: "Contact",   href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
      navigate(href);
      window.scrollTo({ top: 0 });
      return;
    }
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 shrink-0 group -ml-1"
          >
            <img
              src={logo}
              alt="DEEV"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-[1.3rem] font-brand tracking-[0.015em] leading-none text-[#0a0f2e] dark:text-white">
              DEEV
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
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

          {/* Right side: CTA + burger */}
          <div className="flex items-center gap-3">

            {/* CTA */}
            <button
              onClick={() => scrollTo("#project-builder")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px "
              style={{ background: "var(--signal)" }}
            >
              Get a quote
            </button>

            {/* Mobile burger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${ scrolled ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]" : "text-slate-700 hover:bg-slate-200/60 dark:text-white/80 dark:hover:bg-white/[0.08]" }`}
              aria-label="Toggle menu"
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
              {NAV_LINKS.map((link) => (
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
                Get a quote →
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
