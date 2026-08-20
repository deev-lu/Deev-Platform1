import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

// Critical above-the-fold — eager loaded
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ClientLogos from "./components/ClientLogos";
import SmeGrantBanner from "./components/SmeGrantBanner";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import { initAnalytics } from "../lib/analytics";

// Below-the-fold — lazy loaded for faster initial paint
const ValueProposition  = lazy(() => import("./components/ValueProposition"));
const SystemStack       = lazy(() => import("./components/SystemStack"));
const LuxembourgStrip   = lazy(() => import("./components/LuxembourgStrip"));
const ProjectBuilder    = lazy(() => import("./components/ProjectBuilder"));
const Portfolio         = lazy(() => import("./components/Portfolio"));
const BillovioFeature   = lazy(() => import("./components/BillovioFeature"));
const EnterpriseTrust   = lazy(() => import("./components/EnterpriseTrust"));
const FinalCTA          = lazy(() => import("./components/FinalCTA"));
const Legal             = lazy(() => import("./components/Legal"));
const Contact           = lazy(() => import("./components/Contact"));

// Minimal section skeleton while lazy chunks load
function SectionSkeleton() {
  return (
    <div className="w-full py-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#2563F6]/30 border-t-[#2563F6] rounded-full animate-spin" />
    </div>
  );
}

function HomePage({ theme, toggleTheme }: { theme: "light" | "dark"; toggleTheme: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06060a] overflow-x-hidden transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <ClientLogos />
      <SmeGrantBanner />
      <Suspense fallback={<SectionSkeleton />}>
        <div id="services"><ValueProposition /></div>

        {/* ── Dark act I: the system, then the work ──────────────────
            `dark` is scoped per-section (@custom-variant dark = .dark *),
            so these render in their dark treatment in both themes. The
            page is meant to breathe light → dark → light → dark rather
            than run eight near-identical pale sections in a row. */}
        <div data-surface="dark">
          <SystemStack />
        </div>
        <div data-surface="dark" className="dark bg-[#050509]">
          <div id="portfolio"><Portfolio /></div>
        </div>

        <div id="billovio"><BillovioFeature /></div>
        <ProjectBuilder />
        <div id="why-deev"><EnterpriseTrust /></div>

        {/* ── Dark act II: close on Luxembourg, the ask, the footer ── */}
        <div data-surface="dark">
          <LuxembourgStrip />
        </div>
        <div data-surface="dark" className="dark bg-[#06060a]">
          <FinalCTA />
        </div>
      </Suspense>
      <div data-surface="dark" className="dark bg-[#06060a]">
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // localStorage throws outright in Safari with cookies blocked and inside
  // sandboxed embeds. The pre-paint script in index.html already guards for
  // this; an unguarded read here would throw during mount and blank the page.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme") as "light" | "dark" | null;
      if (saved) setTheme(saved);
    } catch {
      /* keep the default theme */
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* preference just won't persist */
    }
  }, [theme]);

  // Google Analytics — only after the cookie banner is accepted
  useEffect(() => initAnalytics(), []);

  const toggleTheme = () => setTheme(p => p === "dark" ? "light" : "dark");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/legal" element={
          <Suspense fallback={<SectionSkeleton />}>
            <Legal />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<SectionSkeleton />}>
            <Contact />
          </Suspense>
        } />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  );
}
