import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase, supabaseReady } from "../../lib/supabase";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Code,
  Brain,
  Globe,
  ShoppingCart,
  Database,
  Zap,
  CreditCard,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Layers,
  FileText,
  Languages,
  Search,
  Cookie,
  Package,
  Tag,
  RefreshCw,
  DollarSign,
  LayoutDashboard,
  Upload,
  Mail,
  Link,
  Clock,
  Bot,
  FileSearch,
  UserCheck,
  Workflow,
  Mic,
  Cpu,
  Megaphone,
  BookOpen,
  BadgeEuro,
  TrendingDown,
  ExternalLink,
} from "lucide-react";

// ── Luxembourg SME government grant rules ─────────────────────────────────────
const SME_GRANT_RATE   = 0.70;   // 70% subsidy
const SME_GRANT_MIN    = 3_000;  // minimum eligible investment
const SME_GRANT_MAX    = 25_000; // maximum eligible investment cap

function getSmePackage(system: NonNullable<CoreSystem>) {
  return system === "ai-agent" ? "SME AI Package" : "SME Digital Package";
}

function calcSmeGrant(rawMin: number, rawMax: number) {
  // Only applies when the range overlaps [SME_GRANT_MIN, SME_GRANT_MAX]
  if (rawMax < SME_GRANT_MIN) return null;

  // Each endpoint is calculated independently (min with min, max with max)
  const capAmount = (v: number) => Math.min(v, SME_GRANT_MAX);

  const subsidyMin = Math.round(capAmount(rawMin) * SME_GRANT_RATE);
  const subsidyMax = Math.round(capAmount(rawMax) * SME_GRANT_RATE);

  const netMin = Math.round(rawMin - subsidyMin);
  const netMax = Math.round(rawMax - subsidyMax);

  return { subsidyMin, subsidyMax, netMin: Math.max(0, netMin), netMax: Math.max(0, netMax) };
}

type CoreSystem = "webapp" | "ai-agent" | "website" | "ecommerce" | null;
type ScaleLevel = "mvp" | "growth" | "enterprise" | null;
type Capability = string;

// ── Core system cards ──────────────────────────────────────────────────────────
const CORE_SYSTEMS = [
  {
    id: "website" as const,
    label: "Marketing Website",
    icon: Globe,
    description: "High-end, conversion-focused sites that win clients.",
  },
  {
    id: "ecommerce" as const,
    label: "E-Commerce Store",
    icon: ShoppingCart,
    description: "Online stores with seamless payments & inventory.",
  },
  {
    id: "webapp" as const,
    label: "Web Application",
    icon: Code,
    description: "SaaS, dashboards, portals & complex product logic.",
  },
  {
    id: "ai-agent" as const,
    label: "AI & Automations",
    icon: Brain,
    description: "Custom AI agents, chatbots & smart workflows.",
  },
];

// ── Scale tiers ────────────────────────────────────────────────────────────────
const SCALE_LEVELS = [
  {
    id: "mvp" as const,
    label: "Starter / MVP",
    description: "Core features, fast launch, validate your idea.",
    badge: "Best to start",
    multiplier: 1,
  },
  {
    id: "growth" as const,
    label: "Growth / Pro",
    description: "Scalable architecture, premium design & integrations.",
    badge: "Most popular",
    multiplier: 2,
  },
  {
    id: "enterprise" as const,
    label: "Enterprise",
    description: "Custom security, compliance, SLA & dedicated support.",
    badge: "Full power",
    multiplier: 3.8,
  },
];

// ── Per-capability add-on pricing ─────────────────────────────────────────────
const CAP_PRICE: Record<string, { min: number; max: number }> = {
  // Website
  animations:    { min: 800,  max: 1500 },
  blog:          { min: 1200, max: 2000 },
  i18n:          { min: 1000, max: 1800 },
  lead_forms:    { min: 600,  max: 1200 },
  seo:           { min: 800,  max: 1400 },
  gdpr:          { min: 500,  max: 900  },
  live_chat:     { min: 500,  max: 800  },
  analytics:     { min: 600,  max: 1000 },
  // E-Commerce
  payments:      { min: 1500, max: 2500 },
  catalog:       { min: 1000, max: 1800 },
  accounts:      { min: 800,  max: 1400 },
  inventory:     { min: 1200, max: 2000 },
  order_mgmt:    { min: 1000, max: 1800 },
  discounts:     { min: 600,  max: 1200 },
  cart_recovery: { min: 800,  max: 1500 },
  multicurrency: { min: 1200, max: 2200 },
  // Web App
  auth:          { min: 1200, max: 2000 },
  dashboard:     { min: 1500, max: 2800 },
  realtime:      { min: 1500, max: 2500 },
  file_upload:   { min: 800,  max: 1400 },
  email_notif:   { min: 600,  max: 1000 },
  api_integr:    { min: 1200, max: 2200 },
  cron_jobs:     { min: 800,  max: 1400 },
  billing:       { min: 1800, max: 3000 },
  // AI
  chatbot:       { min: 2000, max: 3500 },
  rag:           { min: 2500, max: 4000 },
  lead_bot:      { min: 1800, max: 3000 },
  email_seq:     { min: 1200, max: 2200 },
  scraping:      { min: 1500, max: 2500 },
  crm_integr:    { min: 1000, max: 1800 },
  voice:         { min: 2000, max: 3500 },
  finetune:      { min: 3000, max: 5000 },
};

// ── Capabilities per system ───────────────────────────────────────────────────
type CapItem = { id: string; label: string; sublabel: string; icon: React.ElementType };

const CAPABILITIES: Record<NonNullable<CoreSystem>, CapItem[]> = {
  website: [
    { id: "animations",  label: "Custom Animations",        sublabel: "Framer Motion / GSAP scroll effects",    icon: Sparkles },
    { id: "blog",        label: "Blog / News CMS",          sublabel: "Sanity or Contentful headless CMS",       icon: BookOpen },
    { id: "i18n",        label: "Multi-language (i18n)",    sublabel: "EN / FR / DE / LU support",              icon: Languages },
    { id: "lead_forms",  label: "Lead Forms & CRM Sync",    sublabel: "HubSpot, Pipedrive or custom",            icon: Megaphone },
    { id: "seo",         label: "Advanced SEO",             sublabel: "Schema.org, sitemap, Open Graph",         icon: Search },
    { id: "gdpr",        label: "GDPR & Cookie Banner",     sublabel: "Cookiebot or custom consent layer",       icon: Cookie },
    { id: "live_chat",   label: "Live Chat Integration",    sublabel: "Crisp, Intercom or Tawk",                 icon: MessageSquare },
    { id: "analytics",   label: "Analytics & GTM Setup",   sublabel: "GA4, Plausible or Matomo",                icon: BarChart3 },
  ],
  ecommerce: [
    { id: "payments",      label: "Payment Gateway",          sublabel: "Stripe, Mollie or Payconiq",              icon: CreditCard },
    { id: "catalog",       label: "Product Catalog & Search", sublabel: "Filters, faceted search, quick view",     icon: Package },
    { id: "accounts",      label: "Customer Accounts",        sublabel: "Wishlist, order history, saved addresses", icon: ShieldCheck },
    { id: "inventory",     label: "Inventory Management",     sublabel: "Stock alerts, variants, SKU tracking",    icon: Database },
    { id: "order_mgmt",    label: "Order Management",         sublabel: "Tracking, status updates, returns",        icon: RefreshCw },
    { id: "discounts",     label: "Discount Codes & Promos",  sublabel: "Coupon engine, BOGO, flash sales",         icon: Tag },
    { id: "cart_recovery", label: "Abandoned Cart Recovery",  sublabel: "Automated email reminders",               icon: Mail },
    { id: "multicurrency", label: "Multi-currency & VAT",     sublabel: "EU VAT rules, dynamic rates",             icon: DollarSign },
  ],
  webapp: [
    { id: "auth",        label: "Auth & Role Permissions",  sublabel: "Supabase, Clerk, SSO / OAuth",            icon: ShieldCheck },
    { id: "dashboard",   label: "Admin Dashboard",          sublabel: "Charts, tables, export to CSV/PDF",        icon: LayoutDashboard },
    { id: "realtime",    label: "Real-time Sync",           sublabel: "WebSockets, live cursors, notifications",  icon: Zap },
    { id: "file_upload", label: "File Uploads & Storage",   sublabel: "S3 / Supabase Storage, preview & resize", icon: Upload },
    { id: "email_notif", label: "Email Notifications",      sublabel: "Resend or SendGrid, templates",            icon: Mail },
    { id: "api_integr",  label: "Third-party API Integrations", sublabel: "REST / GraphQL, webhooks",            icon: Link },
    { id: "cron_jobs",   label: "Scheduled Jobs",           sublabel: "Background tasks, cron, queues",          icon: Clock },
    { id: "billing",     label: "SaaS Billing",             sublabel: "Stripe Subscriptions, usage-based billing",icon: CreditCard },
  ],
  "ai-agent": [
    { id: "chatbot",    label: "AI Chatbot (your data)",   sublabel: "Trained on your docs, website, FAQs",       icon: Bot },
    { id: "rag",        label: "Document Q&A (RAG)",       sublabel: "Chat with PDFs, contracts, knowledge bases", icon: FileSearch },
    { id: "lead_bot",   label: "Lead Qualification Bot",   sublabel: "Scores & routes leads automatically",        icon: UserCheck },
    { id: "email_seq",  label: "Automated Email Sequences", sublabel: "n8n / Make workflows, smart triggers",     icon: Workflow },
    { id: "scraping",   label: "Data Extraction",          sublabel: "Web scraping, parsing, structured outputs",  icon: Database },
    { id: "crm_integr", label: "CRM / Slack / Notion Sync", sublabel: "HubSpot, Pipedrive, Airtable, Notion",    icon: Link },
    { id: "voice",      label: "Voice Assistant",          sublabel: "ElevenLabs + Whisper speech I/O",           icon: Mic },
    { id: "finetune",   label: "Custom LLM Fine-tuning",   sublabel: "Domain-specific model training",            icon: Cpu },
  ],
};

// ── Base pricing per system ───────────────────────────────────────────────────
const BASE: Record<NonNullable<CoreSystem>, { min: number; max: number; weeks: string }> = {
  website:    { min: 3500,  max: 7000,  weeks: "3–5"  },
  ecommerce:  { min: 6000,  max: 10000, weeks: "5–7"  },
  webapp:     { min: 8000,  max: 15000, weeks: "7–10" },
  "ai-agent": { min: 5500,  max: 12000, weeks: "5–9"  },
};

// ─────────────────────────────────────────────────────────────────────────────

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function ProjectBuilder() {
  const [step, setStep] = useState(1);
  const [system, setSystem] = useState<CoreSystem>(null);
  const [scale, setScale] = useState<ScaleLevel>(null);
  const [capabilities, setCapabilities] = useState<Set<Capability>>(new Set());

  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleCapability = (id: Capability) => {
    const next = new Set(capabilities);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCapabilities(next);
  };

  // Active capability list for the chosen system
  const activeCaps: CapItem[] = system ? CAPABILITIES[system] : [];

  const estimate = useMemo(() => {
    if (!system) return { min: "0", max: "0", weeks: "—", rawMin: 0, rawMax: 0 };

    const base = BASE[system];
    const mult = SCALE_LEVELS.find((s) => s.id === scale)?.multiplier ?? 1;

    let addMin = 0;
    let addMax = 0;
    for (const capId of capabilities) {
      const p = CAP_PRICE[capId];
      if (p) { addMin += p.min; addMax += p.max; }
    }

    const rawMin = Math.round(base.min * mult + addMin);
    const rawMax = Math.round(base.max * mult + addMax);

    return {
      min: rawMin.toLocaleString("de-DE"),
      max: rawMax.toLocaleString("de-DE"),
      weeks: base.weeks,
      rawMin,
      rawMax,
    };
  }, [system, scale, capabilities]);

  const handleNext = () => {
    if (step === 3) setShowLeadCapture(true);
    else setStep((s) => s + 1);
  };

  const reset = () => {
    setStep(1);
    setSystem(null);
    setScale(null);
    setCapabilities(new Set());
    setShowLeadCapture(false);
    setSubmitted(false);
  };

  return (
    <section
      id="project-builder"
      className="relative bg-slate-50 dark:bg-[#08080c] py-24 min-h-screen flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
            <span className="w-1 h-1 rounded-full bg-[#0022FF]" />
            Instant Estimate
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
            Configure Your{" "}
            <span className="bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent">
              Project
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Pick your product, choose a scale, add the features you need — get an instant estimate tailored to you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* ── Left panel: live preview card ─────────────────────────────── */}
          <div className="lg:col-span-5 lg:sticky top-32 order-last lg:order-first">
            <motion.div
              layout
              className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-3xl bg-white dark:bg-[#0e0e16] border border-slate-200 dark:border-white/[0.10] shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8"
            >
              {/* Background glows */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0022FF]/10 rounded-full blur-[100px] opacity-50" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00C6FF]/10 rounded-full blur-[100px] opacity-50" />
              </div>

              <AnimatePresence mode="popLayout">
                {!system ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <Layers className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Select a product type to begin</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="system"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 w-full h-full flex flex-col items-center justify-center"
                  >
                    {/* Animated chassis icon */}
                    <div className="relative w-44 h-44 md:w-52 md:h-52 mb-8">
                      <motion.div
                        className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#0022FF]/20 to-[#00C6FF]/20 border border-[#0022FF]/30 flex items-center justify-center shadow-[0_0_50px_rgba(0,34,255,0.2)] relative"
                        animate={{ rotateY: [0, 5, -5, 0], rotateX: [0, -5, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {system === "ai-agent"  && <Brain       className="w-20 h-20 text-[#0022FF]" />}
                        {system === "webapp"     && <Code        className="w-20 h-20 text-[#0022FF]" />}
                        {system === "website"    && <Globe       className="w-20 h-20 text-[#0022FF]" />}
                        {system === "ecommerce"  && <ShoppingCart className="w-20 h-20 text-[#0022FF]" />}

                        {/* Capability nodes orbiting the icon */}
                        <AnimatePresence>
                          {Array.from(capabilities).map((capId, index) => {
                            const total = capabilities.size;
                            const angle = (index / total) * Math.PI * 2;
                            const radius = 105;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            const CapIcon =
                              activeCaps.find((c) => c.id === capId)?.icon ?? Zap;
                            return (
                              <motion.div
                                key={capId}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1, x, y }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute w-10 h-10 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-[#00C6FF]/30 flex items-center justify-center top-1/2 left-1/2 -mt-5 -ml-5"
                              >
                                <CapIcon className="w-4 h-4 text-[#00C6FF]" />
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    <div className="text-center w-full">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3 uppercase tracking-widest">
                        {SCALE_LEVELS.find((s) => s.id === scale)?.label ?? "Choose scale →"}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {CORE_SYSTEMS.find((s) => s.id === system)?.label}
                      </h3>

                      {/* Live estimate preview */}
                      {scale && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 px-6 py-3 rounded-2xl bg-[#0022FF]/8 dark:bg-[#0022FF]/15 border border-[#0022FF]/20"
                        >
                          <div className="text-xs text-[#0022FF] dark:text-[#00C6FF] uppercase tracking-widest mb-1 font-semibold">
                            Live estimate
                          </div>
                          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                            €{estimate.min}
                            <span className="text-base font-normal text-slate-400 mx-1">–</span>
                            €{estimate.max}
                          </div>
                        </motion.div>
                      )}

                      <div className="mt-4 flex items-center justify-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10 pt-4">
                        <span>{capabilities.size} add-ons</span>
                        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                        <span>~{BASE[system].weeks} weeks</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Right panel: steps ────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col justify-center min-h-[500px]">
            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
              {["Product", "Scale", "Features", "Estimate"].map((label, idx) => {
                const s = idx + 1;
                const isActive = s === step;
                const isPast = s < step;
                return (
                  <div key={s} className="flex items-center shrink-0">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                        isActive
                          ? "bg-[#0022FF] text-white shadow-lg shadow-[#0022FF]/30"
                          : isPast
                          ? "bg-[#0022FF]/10 dark:bg-[#0022FF]/20 text-[#0022FF]"
                          : "bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {isPast ? <Check className="w-4 h-4" /> : s}
                    </div>
                    <span
                      className={`ml-3 mr-4 text-sm font-semibold tracking-wide ${
                        isActive
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                    {s !== 4 && (
                      <div
                        className={`w-8 h-px mr-4 ${
                          isPast ? "bg-[#0022FF]/50" : "bg-slate-200 dark:bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Steps */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {/* ── STEP 1: Product type ───────────────────────────────── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
                      What are we building?
                    </p>
                    {CORE_SYSTEMS.map((sys) => {
                      const Icon = sys.icon;
                      const isSelected = system === sys.id;
                      return (
                        <button
                          key={sys.id}
                          onClick={() => {
                            setSystem(sys.id);
                            // Reset capabilities when system changes
                            setCapabilities(new Set());
                          }}
                          className={`w-full flex items-center p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#0022FF] bg-[#0022FF]/5 dark:bg-[#0022FF]/10 shadow-md"
                              : "border-slate-200 dark:border-white/[0.10] bg-white dark:bg-white/5 hover:border-[#00C6FF]/50 dark:hover:border-white/20"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-5 ${
                              isSelected
                                ? "bg-[#0022FF] text-white"
                                : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`text-lg font-bold ${
                                isSelected
                                  ? "text-[#0022FF] dark:text-[#00C6FF]"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {sys.label}
                            </h4>
                            <p
                              className={`mt-0.5 text-sm ${
                                isSelected
                                  ? "text-[#0022FF]/80 dark:text-[#00C6FF]/80"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {sys.description}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-[#0022FF] dark:text-[#00C6FF] ml-4 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* ── STEP 2: Scale ──────────────────────────────────────── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
                      What scale are you aiming for?
                    </p>
                    {SCALE_LEVELS.map((lvl) => {
                      const isSelected = scale === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          onClick={() => setScale(lvl.id)}
                          className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#0022FF] bg-[#0022FF]/5 dark:bg-[#0022FF]/10 shadow-md"
                              : "border-slate-200 dark:border-white/[0.10] bg-white dark:bg-white/5 hover:border-[#00C6FF]/50 dark:hover:border-white/20"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4
                                className={`text-lg font-bold ${
                                  isSelected
                                    ? "text-[#0022FF] dark:text-[#00C6FF]"
                                    : "text-slate-900 dark:text-white"
                                }`}
                              >
                                {lvl.label}
                              </h4>
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  isSelected
                                    ? "bg-[#0022FF]/10 text-[#0022FF] dark:bg-[#00C6FF]/10 dark:text-[#00C6FF]"
                                    : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                                }`}
                              >
                                {lvl.badge}
                              </span>
                            </div>
                            <p
                              className={`text-sm ${
                                isSelected
                                  ? "text-[#0022FF]/80 dark:text-[#00C6FF]/80"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {lvl.description}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-[#0022FF] dark:text-[#00C6FF] ml-4 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* ── STEP 3: Features ───────────────────────────────────── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
                      Which features do you need? (optional)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeCaps.map((cap) => {
                        const Icon = cap.icon;
                        const isSelected = capabilities.has(cap.id);
                        const price = CAP_PRICE[cap.id];
                        return (
                          <button
                            key={cap.id}
                            onClick={() => toggleCapability(cap.id)}
                            className={`flex items-start p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                              isSelected
                                ? "border-[#00C6FF] bg-[#00C6FF]/5 dark:bg-[#00C6FF]/10 shadow-sm"
                                : "border-slate-200 dark:border-white/[0.10] bg-white dark:bg-white/5 hover:border-[#0022FF]/30 dark:hover:border-white/20"
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mr-3 mt-0.5 ${
                                isSelected
                                  ? "bg-[#00C6FF] text-white"
                                  : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4
                                  className={`text-sm font-bold leading-tight ${
                                    isSelected
                                      ? "text-[#0022FF] dark:text-[#00C6FF]"
                                      : "text-slate-900 dark:text-white"
                                  }`}
                                >
                                  {cap.label}
                                </h4>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-[#00C6FF] flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {cap.sublabel}
                              </p>
                              {price && (
                                <p
                                  className={`text-xs font-semibold mt-1 ${
                                    isSelected
                                      ? "text-[#00C6FF]"
                                      : "text-slate-400 dark:text-slate-500"
                                  }`}
                                >
                                  +€{price.min.toLocaleString("de-DE")} – €{price.max.toLocaleString("de-DE")}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 4: Estimate result ────────────────────────────── */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-left"
                  >
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
                      Your Estimated Investment
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                      Based on your{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {SCALE_LEVELS.find((s) => s.id === scale)?.label}
                      </span>{" "}
                      {CORE_SYSTEMS.find((s) => s.id === system)?.label.toLowerCase()} with{" "}
                      {capabilities.size > 0
                        ? `${capabilities.size} selected feature${capabilities.size > 1 ? "s" : ""}.`
                        : "no extra features."}
                    </p>

                    {/* Price card */}
                    <div className="mb-8 p-7 rounded-3xl bg-[#0022FF] text-white shadow-xl shadow-[#0022FF]/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[50px] -mr-20 -mt-20 pointer-events-none" />
                      <div className="text-xs font-semibold text-[#00C6FF] uppercase tracking-widest mb-2">
                        Total Range
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1 tracking-tight">
                        €{estimate.min}
                        <span className="text-2xl text-white/50 font-normal mx-2">–</span>
                        €{estimate.max}
                      </div>
                      <p className="text-white/60 text-sm mb-6">All prices ex. VAT</p>

                      <div className="flex flex-wrap items-center gap-6 border-t border-white/20 pt-5">
                        <div>
                          <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Timeline</div>
                          <div className="font-bold text-lg">{estimate.weeks} Weeks</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Add-ons</div>
                          <div className="font-bold text-lg">{capabilities.size} features</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Quality</div>
                          <div className="font-bold text-lg flex items-center gap-1">
                            <Sparkles className="w-4 h-4" /> Top Tier
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── SME Grant callout ─────────────────────────────── */}
                    {(() => {
                      if (!system) return null;
                      const grant = calcSmeGrant(estimate.rawMin, estimate.rawMax);
                      if (!grant) return null;
                      const pkgName = getSmePackage(system);
                      const isPartial = estimate.rawMin > SME_GRANT_MAX;
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="mb-8 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400/60 dark:border-emerald-500/40 relative overflow-hidden"
                        >
                          {/* Background shimmer */}
                          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none" />

                          <div className="flex items-start gap-4 relative z-10">
                            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                              <BadgeEuro className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                                  🇱🇺 {pkgName}
                                </span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                                  Gouvernement luxembourgeois
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                                Your project qualifies for the{" "}
                                <strong>{pkgName}</strong>. The Luxembourg government
                                covers <strong>70%</strong> of your eligible investment
                                (up to €25,000).{" "}
                                {isPartial
                                  ? "The first €25,000 of your investment qualifies."
                                  : "Your full investment may be eligible."}
                              </p>

                              {/* Grant breakdown */}
                              <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-emerald-200 dark:border-emerald-800/50">
                                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total cost</div>
                                  <div className="text-sm font-bold text-slate-800 dark:text-white">
                                    €{estimate.min} – €{estimate.max}
                                  </div>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-600/50">
                                  <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Gov. grant (–70%)</div>
                                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                    –€{grant.subsidyMin.toLocaleString("de-DE")} to –€{grant.subsidyMax.toLocaleString("de-DE")}
                                  </div>
                                </div>
                                <div className="p-3 rounded-xl bg-white dark:bg-white/5 border-2 border-emerald-400 dark:border-emerald-500/60">
                                  <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1 font-semibold flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3" /> You pay
                                  </div>
                                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                                    €{grant.netMin.toLocaleString("de-DE")} – €{grant.netMax.toLocaleString("de-DE")}
                                  </div>
                                </div>
                              </div>

                              <a
                                href="https://guichet.public.lu/en/entreprises/soutien-financement/aides-pme/cheques-numeriques.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                              >
                                Learn about the programme
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })()}

                    {/* Selected features breakdown */}
                    {capabilities.size > 0 && (
                      <div className="mb-8 p-5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                          Included features
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(capabilities).map((capId) => {
                            const cap = activeCaps.find((c) => c.id === capId);
                            if (!cap) return null;
                            return (
                              <span
                                key={capId}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                              >
                                <cap.icon className="w-3 h-3" />
                                {cap.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="mailto:contact@deev.lu?subject=Project%20Proposal%20Request"
                        className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-base hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        Get a Detailed Proposal <ArrowRight className="w-5 h-5" />
                      </a>
                      <button
                        onClick={reset}
                        className="px-7 py-4 bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white rounded-xl font-bold text-base hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
                      >
                        Reconfigure
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation footer */}
            {step < 4 && (
              <div className="mt-10 flex justify-between items-center border-t border-slate-200 dark:border-white/10 pt-6">
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg transition-colors ${
                    step === 1
                      ? "opacity-0 pointer-events-none"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={(step === 1 && !system) || (step === 2 && !scale)}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all ${
                    (step === 1 && !system) || (step === 2 && !scale)
                      ? "bg-slate-300 dark:bg-slate-800 cursor-not-allowed"
                      : "bg-[#0022FF] hover:bg-[#0022FF]/90 shadow-lg shadow-[#0022FF]/30"
                  }`}
                >
                  {step === 3 ? "Calculate Estimate" : "Next"}{" "}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Lead capture modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLeadCapture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#0a0a0f] shadow-2xl border border-slate-200 dark:border-white/10"
            >
              {!submitted ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-[#00C6FF]/10 dark:bg-[#00C6FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-7 h-7 text-[#00C6FF]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      One last step
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Tell us where to send your full estimate and project blueprint.
                    </p>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmitting(true);
                      try {
                        if (supabaseReady) {
                          await supabase.from("client_leads").insert({
                            name: leadForm.name,
                            email: leadForm.email,
                            project_type: system,
                            scale: scale,
                            capabilities: Array.from(capabilities),
                            estimated_min: parseInt(
                              estimate.min.replace(/\./g, "").replace(/,/g, "")
                            ),
                            estimated_max: parseInt(
                              estimate.max.replace(/\./g, "").replace(/,/g, "")
                            ),
                            timeline_weeks: estimate.weeks,
                          });
                        }
                      } catch {
                        // silent fail – still proceed
                      } finally {
                        setSubmitting(false);
                      }
                      setStep(4);
                      setShowLeadCapture(false);
                    }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C6FF]"
                    />
                    <input
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="Work email"
                      required
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C6FF]"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-[#0022FF] hover:bg-[#0022FF]/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-[#0022FF]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Sending…" : "Reveal My Estimate →"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLeadCapture(false)}
                      className="w-full py-3 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    You're all set!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    We'll send your estimate to{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {leadForm.email}
                    </span>{" "}
                    within 24 hours.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
