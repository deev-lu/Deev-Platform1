import { useState, useEffect, lazy, Suspense, Fragment, type ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { LOCALES, DEFAULT_LOCALE } from "../lib/i18n";
import { WORK_CATEGORIES } from "../lib/workCategories";

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
const ServicesIndex     = lazy(() => import("./components/ServicesIndex"));
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
const NewsTeaser        = lazy(() => import("./components/NewsTeaser"));
const NewsIndex         = lazy(() => import("./components/NewsIndex"));
const NewsArticle       = lazy(() => import("./components/NewsArticle"));
const FinalCTA          = lazy(() => import("./components/FinalCTA"));
const Legal             = lazy(() => import("./components/Legal"));
const Contact           = lazy(() => import("./components/Contact"));
const NotFound          = lazy(() => import("./components/NotFound"));
// The assistant. Lazy, and it removes itself when the route that answers
// it is not configured, so an unset key costs nothing but one 503.
const ChatWidget        = lazy(() => import("./components/ChatWidget"));

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

        {/* The work, then immediately the two people who did it. The proof and
            the names belong next to each other; nine sections of systems in
            between made the introduction read like an afterthought. */}
        <div id="about"><FoundersNote /></div>

        <div id="why-it-works"><BenefitsPanel /></div>
        <div id="services"><ValueProposition /></div>

        {/* ── Dark act I: how the system is built ────────────────────
            `dark` is scoped per-section (@custom-variant dark = .dark *),
            so these render in their dark treatment in both themes. The
            page is meant to breathe light → dark → light → dark rather
            than run eight near-identical pale sections in a row. */}
        <div data-surface="dark" id="how-it-runs">
          <SystemStack />
        </div>
        <div id="marketing"><MarketingServices /></div>
        <div id="ai"><AiConcepts /></div>
        <div id="billovio"><BillovioFeature /></div>
        <div id="pricing"><ProjectBuilder /></div>
        <div id="why-deev"><EnterpriseTrust /></div>
        <div id="journal"><NewsTeaser /></div>

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
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
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
      {/* Services, Work and Blog each own a URL, because each is a real
          destination in the navigation and not only a panel that opens. */}
      <Route path="services" element={chrome(<Suspense fallback={<SectionSkeleton />}><ServicesIndex /></Suspense>)} />
      <Route path="work" element={chrome(<Suspense fallback={<SectionSkeleton />}><WorkIndex /></Suspense>)} />
      {/* Each portfolio category is its own page, so it can be linked to,
          shared and indexed. Declared before work/:slug: a static segment
          outranks a dynamic one, and no project slug collides with these. */}
      {WORK_CATEGORIES.filter((c) => c.slug).map((c) => (
        <Route
          key={c.slug}
          path={`work/${c.slug}`}
          element={chrome(
            <Suspense fallback={<SectionSkeleton />}>
              <WorkIndex categorySlug={c.slug} />
            </Suspense>,
          )}
        />
      ))}
      <Route path="work/:slug" element={chrome(<WorkCase />)} />
      <Route path="blog" element={chrome(<Suspense fallback={<SectionSkeleton />}><NewsIndex /></Suspense>)} />
      {/* Eager would be better for CLS, but an article is 8KB of prose and the
          index is the common entry point, so the fallback is never the first
          thing a visitor sees here. */}
      <Route path="blog/:slug" element={chrome(<Suspense fallback={<SectionSkeleton />}><NewsArticle /></Suspense>)} />
      <Route path="contact" element={chrome(<Suspense fallback={<SectionSkeleton />}><Contact /></Suspense>)} />
      {/* Anything else. The server answers these with 404.html at a real 404
          status; this is what that document hydrates into. */}
      <Route path="*" element={chrome(<Suspense fallback={<SectionSkeleton />}><NotFound /></Suspense>)} />
    </Fragment>
  );
}
