import { useState, useEffect, lazy, Suspense, Fragment, type ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { LOCALES, DEFAULT_LOCALE } from "../lib/i18n";

// Critical above-the-fold — eager loaded
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ClientLogos from "./components/ClientLogos";
import SmeGrantBanner from "./components/SmeGrantBanner";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import RouteMeta from "./components/RouteMeta";
import BenefitsPanel from "./components/BenefitsPanel";
// Eager: as a lazy route its Suspense fallback was a 200px spinner between the
// navbar and the footer, so every case study shifted its layout by 0.52 the
// moment the real page arrived. 1.7KB gzipped is cheaper than that.
import WorkCase from "./components/WorkCase";
const WorkIndex         = lazy(() => import("./components/WorkIndex"));
const MarketingServices = lazy(() => import("./components/MarketingServices"));
const AiConcepts        = lazy(() => import("./components/AiConcepts"));
const WorkMoment        = lazy(() => import("./components/WorkMoment"));
import { initAnalytics } from "../lib/analytics";
import { initSmoothScroll } from "../lib/smoothScroll";
import ScrollReset from "./components/ScrollReset";

// Below-the-fold — lazy loaded for faster initial paint
const ValueProposition  = lazy(() => import("./components/ValueProposition"));
const SystemStack       = lazy(() => import("./components/SystemStack"));
const LuxembourgStrip   = lazy(() => import("./components/LuxembourgStrip"));
const ProjectBuilder    = lazy(() => import("./components/ProjectBuilder"));
const BillovioFeature   = lazy(() => import("./components/BillovioFeature"));
const EnterpriseTrust   = lazy(() => import("./components/EnterpriseTrust"));
const FoundersNote      = lazy(() => import("./components/FoundersNote"));
const FinalCTA          = lazy(() => import("./components/FinalCTA"));
const Legal             = lazy(() => import("./components/Legal"));
const Contact           = lazy(() => import("./components/Contact"));
const NotFound          = lazy(() => import("./components/NotFound"));

// Minimal section skeleton while lazy chunks load
function SectionSkeleton() {
  return (
    <div className="w-full py-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#2563F6]/30 border-t-[#2563F6] rounded-[2px] animate-spin" />
    </div>
  );
}

function HomePage({ theme, toggleTheme }: ThemeProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06060a] overflow-x-clip transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <ClientLogos />
      <SmeGrantBanner />
      <Suspense fallback={<SectionSkeleton />}>
        {/* The work comes first among the numbered sections. Visitors arrive
            to find out whether we can build their thing; the argument for how
            we work lands better once they have seen that we do. */}
        <div id="portfolio"><WorkMoment /></div>

        <BenefitsPanel />
        <div id="services"><ValueProposition /></div>

        {/* ── Dark act I: how the system is built ────────────────────
            `dark` is scoped per-section (@custom-variant dark = .dark *),
            so these render in their dark treatment in both themes. The
            page is meant to breathe light → dark → light → dark rather
            than run eight near-identical pale sections in a row. */}
        <div data-surface="dark">
          <SystemStack />
        </div>
        <div id="marketing"><MarketingServices /></div>
        <div id="ai"><AiConcepts /></div>
        <div id="billovio"><BillovioFeature /></div>
        <ProjectBuilder />
        <div id="why-deev"><EnterpriseTrust /></div>
        {/* Nine sections of systems, then the two people behind them. */}
        <div id="about"><FoundersNote /></div>

        {/* ── Dark act II: close on Luxembourg, the ask, the footer ── */}
        <div data-surface="dark">
          <LuxembourgStrip />
        </div>
        <FinalCTA />
      </Suspense>
      <Footer />
    </div>
  );
}

export interface ThemeProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function App() {


  // Google Analytics — only after the cookie banner is accepted
  useEffect(() => initAnalytics(), []);

  // Weighted wheel scrolling. Pointer devices only, never under
  // prefers-reduced-motion; the module decides and returns a no-op teardown
  // when it declines to run.
  useEffect(() => initSmoothScroll(), []);


  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // localStorage throws outright in Safari with cookies blocked and inside
  // sandboxed embeds; an unguarded read here would blank the page on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme") as "light" | "dark" | null;
      if (saved) setTheme(saved);
    } catch {
      /* keep the default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* the preference just will not persist */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  return (
    <BrowserRouter>
      <ScrollReset />
      <RouteMeta />
      <Routes>
        {/* English at the root, then the same tree again under /fr and /de.
            One route table rendered three times: a page can never exist in
            one language and be missing in another, and the language is a
            property of the URL rather than of some state a reload would
            lose. src/lib/i18n.ts is where the prefixes are defined. */}
        {sitePages(theme, toggleTheme)}
        {LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((locale) => (
          <Route key={locale} path={locale}>
            {sitePages(theme, toggleTheme)}
          </Route>
        ))}
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  );
}

/** The site's pages, as routes relative to whatever language prefix wraps them. */
function sitePages(theme: "light" | "dark", toggleTheme: () => void) {
  const chrome = (children: ReactNode) => (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      {children}
      <Footer />
    </>
  );
  return (
    <Fragment>
      <Route index element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="legal" element={chrome(<Suspense fallback={<SectionSkeleton />}><Legal /></Suspense>)} />
      <Route path="work" element={chrome(<Suspense fallback={<SectionSkeleton />}><WorkIndex /></Suspense>)} />
      <Route path="work/:slug" element={chrome(<WorkCase />)} />
      <Route path="contact" element={chrome(<Suspense fallback={<SectionSkeleton />}><Contact /></Suspense>)} />
      {/* Anything else. The server answers these with 404.html at a real 404
          status; this is what that document hydrates into. */}
      <Route path="*" element={chrome(<Suspense fallback={<SectionSkeleton />}><NotFound /></Suspense>)} />
    </Fragment>
  );
}
