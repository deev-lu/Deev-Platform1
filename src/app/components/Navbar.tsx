import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon } from "lucide-react";
import logo from "../../assets/logo.png";

interface NavbarProps {
  theme?: "light" | "dark";
  toggleTheme?: () => void;
}

const NAV_LINKS = [
  { label: "Services",  href: "#value-proposition" },
  { label: "AI",        href: "#ai-showcase" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Process",   href: "#process" },
  { label: "Pricing",   href: "#project-builder" },
];

function ThemePillToggle({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex items-center w-[68px] h-[32px] rounded-full p-[3px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0022FF] ${
        isDark
          ? "bg-[#1a1a2e] border border-white/[0.12] shadow-inner"
          : "bg-slate-100 border border-slate-200 shadow-inner"
      }`}
    >
      {/* Sliding knob */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`absolute w-[26px] h-[26px] rounded-full flex items-center justify-center shadow-md ${
          isDark
            ? "right-[3px] bg-[#0022FF]"
            : "left-[3px] bg-white shadow-slate-200"
        }`}
      >
        {isDark
          ? <Moon className="w-3.5 h-3.5 text-white" />
          : <Sun className="w-3.5 h-3.5 text-yellow-500" />
        }
      </motion.div>

      {/* Background icons (stationary) */}
      <Sun className={`absolute left-[7px] w-3 h-3 transition-opacity duration-200 ${isDark ? "opacity-30 text-slate-400" : "opacity-0"}`} />
      <Moon className={`absolute right-[7px] w-3 h-3 transition-opacity duration-200 ${isDark ? "opacity-0" : "opacity-30 text-slate-500"}`} />
    </button>
  );
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/85 dark:bg-[#06060a]/92 backdrop-blur-2xl border-b border-slate-200/70 dark:border-white/[0.07]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 shrink-0 group"
          >
            <img
              src={logo}
              alt="Deev"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className={`text-[1.35rem] font-extrabold tracking-tight leading-none transition-colors duration-300 ${
              scrolled ? "text-slate-900 dark:text-white" : "text-white"
            }`}>
              Deev
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled
                    ? "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                    : "text-white/75 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side: theme toggle + CTA + burger */}
          <div className="flex items-center gap-3">
            {/* Premium pill theme toggle */}
            {toggleTheme && (
              <ThemePillToggle theme={theme ?? "dark"} onToggle={toggleTheme} />
            )}

            {/* CTA */}
            <button
              onClick={() => scrollTo("#project-builder")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_24px_rgba(0,34,255,0.45)]"
              style={{ background: "linear-gradient(135deg, #0022FF 0%, #00C6FF 100%)" }}
            >
              Get a quote
            </button>

            {/* Mobile burger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                scrolled
                  ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                  : "text-white/80 hover:bg-white/[0.08]"
              }`}
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
            className="fixed top-[68px] left-0 right-0 z-30 bg-white/97 dark:bg-[#08080c]/97 backdrop-blur-2xl border-b border-slate-200 dark:border-white/[0.08] md:hidden shadow-2xl"
          >
            <nav className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  {link.label}
                </button>
              ))}

              {/* Mobile theme toggle row */}
              {toggleTheme && (
                <div className="flex items-center justify-between px-4 py-3.5 rounded-xl">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </span>
                  <ThemePillToggle theme={theme ?? "dark"} onToggle={toggleTheme} />
                </div>
              )}

              <button
                onClick={() => scrollTo("#project-builder")}
                className="mt-2 w-full py-3.5 text-white font-bold rounded-xl text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0022FF 0%, #00C6FF 100%)" }}
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
