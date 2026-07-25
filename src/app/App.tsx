import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

// Critical above-the-fold — eager loaded
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ClientLogos from "./components/ClientLogos";
import SmeGrantBanner from "./components/SmeGrantBanner";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";

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
        <SystemStack />
        <div id="portfolio"><Portfolio /></div>
        <div id="billovio"><BillovioFeature /></div>
        <ProjectBuilder />
        <div id="why-deev"><EnterpriseTrust /></div>
        <LuxembourgStrip />
        <FinalCTA />
      </Suspense>
      <Footer />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

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
