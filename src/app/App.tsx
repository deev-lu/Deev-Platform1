import { useState, useEffect, lazy, Suspense, Fragment, type ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { LOCALES, DEFAULT_LOCALE } from "../lib/i18n";
import { WORK_CATEGORIES } from "../lib/workCategories";

// Critical above-the-fold — eager loaded
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ClientLogos from "./components/ClientLogos";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import RouteMeta from "./components/RouteMeta";
// Eager: as a lazy route its Suspense fallback was a 200px spinner between the
// navbar and the footer, so every case study shifted its layout by 0.52 the
// moment the real page arrived. 1.7KB gzipped is cheaper than that.
import WorkCase from "./components/WorkCase";
const WorkIndex         = lazy(() => import("./components/WorkIndex"));
const ServicesIndex     = lazy(() => import("./components/ServicesIndex"));
const GrantPage         = lazy(() => import("./components/GrantPage"));
const ServiceDetail     = lazy(() => import("./components/ServiceDetail"));
const ProjectPage       = lazy(() => import("./components/ProjectPage"));
const SelectedWork      = lazy(() => import("./components/SelectedWork"));
const ServicePaths      = lazy(() => import("./components/ServicePaths"));
import { initAnalytics } from "../lib/analytics";
import { initSmoothScroll } from "../lib/smoothScroll";
import ScrollReset from "./components/ScrollReset";

// Below-the-fold — lazy loaded for faster initial paint
const BudgetTeaser      = lazy(() => import("./components/BudgetTeaser"));
const FoundersNote      = lazy(() => import("./components/FoundersNote"));
const HowWeWork         = lazy(() => import("./components/HowWeWork"));
const NewsTeaser        = lazy(() => import("./components/NewsTeaser"));
const LuxembourgStrip   = lazy(() => import("./components/LuxembourgStrip"));
const NewsIndex         = lazy(() => import("./components/NewsIndex"));
const NewsArticle       = lazy(() => import("./components/NewsArticle"));
const FinalCTA          = lazy(() => import("./components/FinalCTA"));
const Legal             = lazy(() => import("./components/Legal"));
const Contact           = lazy(() => import("./components/Contact"));
const NotFound          = lazy(() => import("./components/NotFound"));
// The floating WhatsApp button. Lazy: it does not appear until the visitor
// has scrolled past the first screen, so it never competes for the load.
const WhatsAppButton    = lazy(() => import("./components/WhatsAppButton"));

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
    <div className="min-h-screen bg-slate-50 dark:bg-[var(--surface-0)] overflow-x-clip transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* 1. Angebot und naechster Schritt, mit einer echten Arbeitsprobe. */}
      <Hero />
      <ClientLogos />

      <Suspense fallback={<SectionSkeleton />}>
        {/* 2. Die Arbeit zuerst. Besucher kommen, um herauszufinden, ob wir
            ihre Sache bauen koennen; jedes Argument darueber, wie wir arbeiten,
            landet besser, nachdem sie gesehen haben, dass wir liefern. */}
        <div id="portfolio"><SelectedWork /></div>

        {/* 3. Drei Leistungswege, jeder mit dem Problem in den Worten des
            Kaeufers und einem Ziel, das eine eigene Seite ist. */}
        <ServicePaths />

        {/* 4. Die zwei Menschen, die es machen. Direkt hinter dem Beleg: die
            Arbeit und die Namen gehoeren nebeneinander. */}
        <div id="about"><FoundersNote /></div>

        {/* 4b. Was passiert, wenn ich mich melde? Der Brief verlangt Gründer
            UND Ablauf; die Gründer standen da, der Ablauf fehlte. */}
        <HowWeWork />

        {/* 5. Budget und moeglicher Zuschuss, beides kompakt und verlinkt.
            Traegt weiterhin die alten Kampagnenanker #pricing und
            #project-builder, weil ein Fragment den Server nie erreicht und
            sich nicht per Weiterleitung auffangen laesst. */}
        <div id="pricing"><BudgetTeaser /></div>

        {/* 5b. Die drei neuesten Artikel. Beim Entschlacken herausgeflogen,
            und damit auch der einzige Grund, ueber den Budgetblock hinaus
            weiterzulesen. Es sind echte Artikel, keine Fuellung. */}
        <NewsTeaser />

        {/* 5c. Ein Bild, das die Seite atmen laesst. Echte Fotografie aus
            Luxemburg, langsam bewegt - der einzige grosse visuelle Moment der
            Seite, und er behauptet nichts. */}
        <LuxembourgStrip />

        {/* 6. Ein Abschluss, keine vierte Zusammenfassung. */}
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
      <SiteTree theme={theme} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}

/**
 * Everything inside the router.
 *
 * Split out so the prerender can render the same tree under StaticRouter and
 * write real HTML into each document. There is exactly one page definition;
 * the server and the browser cannot drift.
 */
export function SiteTree({ theme, toggleTheme }: ThemeProps) {
  return (
    <>
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
        <WhatsAppButton />
      </Suspense>
    </>
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
      {/* The funding page. Most Luxembourg enquiries start with the grant,
          so it gets a URL of its own to advertise and to be found by. */}
      {/* Der Rechner als eigene Seite. Die Startseite zeigt nur noch
          einen Budget-Teaser, der hierher fuehrt. */}
      {/* Ein Leistungsweg, eine Seite. Unterschiedliche Leistungen brauchen
          unterschiedliche Argumente; ein Anker kann ausserdem nicht ranken. */}
      {([["websites", "websites"], ["ai-automation", "ai"], ["custom-software", "software"]] as const).map(
        ([slug, key]) => (
          <Route
            key={slug}
            path={`services/${slug}`}
            element={chrome(
              <Suspense fallback={<SectionSkeleton />}>
                <ServiceDetail service={key} />
              </Suspense>,
            )}
          />
        ),
      )}
      <Route path="project" element={chrome(<Suspense fallback={<SectionSkeleton />}><ProjectPage /></Suspense>)} />
      <Route path="sme-packages" element={chrome(<Suspense fallback={<SectionSkeleton />}><GrantPage /></Suspense>)} />
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
