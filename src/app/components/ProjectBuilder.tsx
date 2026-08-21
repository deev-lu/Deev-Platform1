import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { useNavigate } from "react-router";
import { sendLeadEmail } from "../../lib/leadEmail";
import NoiseOverlay from "./NoiseOverlay";
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

type CoreSystem = "webapp" | "ai-agent" | "website" | "ecommerce" | "marketing" | null;
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
  {
    id: "marketing" as const,
    label: "Lead Campaigns & Marketing",
    icon: Megaphone,
    description: "Paid ads, SEO & funnels that generate qualified leads.",
  },
];

// ── Scale tiers ────────────────────────────────────────────────────────────────
const SCALE_LEVELS = [
  {
    id: "mvp" as const,
    label: "Starter",
    description: "Core features, fast launch, validate your idea.",
    badge: "Best to start",
    multiplier: 1,
  },
  {
    id: "growth" as const,
    label: "Professional",
    description: "Scalable architecture, premium design & integrations.",
    badge: "Most popular",
    multiplier: 2,
  },
  {
    id: "enterprise" as const,
    label: "Enterprise",
    description: "Custom security, compliance, SLA & dedicated support.",
    badge: "Full power",
    multiplier: 3.5,
  },
];

// ── Per-capability add-on pricing (from Deev Services PDF 2026) ───────────────
const CAP_PRICE: Record<string, { min: number; max: number }> = {
  // Website add-ons
  animations:    { min: 800,  max: 1200 },
  blog:          { min: 450,  max: 750  },
  i18n:          { min: 400,  max: 650  },
  lead_forms:    { min: 350,  max: 550  },
  seo:           { min: 900,  max: 1400 },
  gdpr:          { min: 500,  max: 750  },
  live_chat:     { min: 400,  max: 600  },
  analytics:     { min: 350,  max: 550  },
  // E-Commerce add-ons
  payments:      { min: 1200, max: 1700 },
  catalog:       { min: 900,  max: 1350 },
  accounts:      { min: 700,  max: 1050 },
  inventory:     { min: 1000, max: 1450 },
  order_mgmt:    { min: 900,  max: 1300 },
  discounts:     { min: 500,  max: 750  },
  cart_recovery: { min: 700,  max: 1000 },
  multicurrency: { min: 1000, max: 1450 },
  // Web App add-ons
  auth:          { min: 1000, max: 1450 },
  dashboard:     { min: 1200, max: 1800 },
  realtime:      { min: 1200, max: 1700 },
  file_upload:   { min: 700,  max: 1000 },
  email_notif:   { min: 500,  max: 750  },
  api_integr:    { min: 1000, max: 1500 },
  cron_jobs:     { min: 700,  max: 1000 },
  billing:       { min: 1500, max: 2100 },
  // AI & Automation add-ons
  chatbot:       { min: 1800, max: 2600 },
  rag:           { min: 2500, max: 3600 },
  lead_bot:      { min: 1800, max: 2500 },
  email_seq:     { min: 1200, max: 1700 },
  scraping:      { min: 1500, max: 2100 },
  crm_integr:    { min: 1000, max: 1500 },
  voice:         { min: 2000, max: 2800 },
  finetune:      { min: 3000, max: 4200 },
  // Lead Campaigns & Marketing add-ons (campaign build / setup fees, ad spend separate)
  google_ads:      { min: 800,  max: 1200 },
  meta_ads:        { min: 700,  max: 1100 },
  seo_campaign:    { min: 900,  max: 1400 },
  content:         { min: 600,  max: 950  },
  email_marketing: { min: 500,  max: 800  },
  social_mgmt:     { min: 800,  max: 1200 },
  funnel:          { min: 700,  max: 1100 },
  cro:             { min: 900,  max: 1350 },
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
  marketing: [
    { id: "google_ads",      label: "Google Ads (Search/PPC)",  sublabel: "Campaign setup, keywords & bidding",       icon: Search },
    { id: "meta_ads",        label: "Meta Ads (FB / Instagram)", sublabel: "Creative, audiences & retargeting",       icon: Megaphone },
    { id: "seo_campaign",    label: "SEO Campaign",             sublabel: "Technical SEO, content & backlinks",       icon: BarChart3 },
    { id: "content",         label: "Content & Copywriting",    sublabel: "Landing copy, blogs, ad creatives",        icon: FileText },
    { id: "email_marketing", label: "Email & Newsletters",      sublabel: "Sequences, automation, Brevo/Mailchimp",   icon: Mail },
    { id: "social_mgmt",     label: "Social Media Management",  sublabel: "Content calendar, posting & community",    icon: MessageSquare },
    { id: "funnel",          label: "Landing Pages & Funnels",  sublabel: "High-converting pages + tracking",         icon: Globe },
    { id: "cro",             label: "CRO & A/B Testing",        sublabel: "Optimise conversion rate, test variants",  icon: Zap },
  ],
};

// ── Base pricing per system (Deev Services PDF 2026) ─────────────────────────
// Starter Landing: 1500€ / Professional Website: 3000€ / scale multiplier applied
const BASE: Record<NonNullable<CoreSystem>, { min: number; max: number; weeks: string }> = {
  website:    { min: 1800,  max: 2900,  weeks: "2–5"  },
  ecommerce:  { min: 4500,  max: 6500,  weeks: "4–8"  },
  webapp:     { min: 7000,  max: 10000, weeks: "6–12" },
  "ai-agent": { min: 2200,  max: 3800,  weeks: "3–8"  },
  marketing:  { min: 1800,  max: 3000,  weeks: "2–6"  },
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

// Rolling odometer-style number — counts smoothly to its target value
function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const display = useTransform(mv, (v) => Math.round(v).toLocaleString("de-DE"));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [value]);
  return <motion.span>{display}</motion.span>;
}

export default function ProjectBuilder() {
  const [step, setStep] = useState(1);
  const [system, setSystem] = useState<CoreSystem>(null);
  const [scale, setScale] = useState<ScaleLevel>(null);
  const [capabilities, setCapabilities] = useState<Set<Capability>>(new Set());

  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    timeline: "",
    goals: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Cursor-tracking spotlight over the configurator stage
  const stageRef = useRef<HTMLDivElement>(null);
  const glowX = useMotionValue(-600);
  const glowY = useMotionValue(-600);
  const handleStageMove = (e: React.MouseEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const toggleCapability = (id: Capability) => {
    const next = new Set(capabilities);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCapabilities(next);
  };

  // Active capability list for the chosen system
  const activeCaps: CapItem[] = system ? CAPABILITIES[system] : [];

  const estimate = useMemo(() => {
    if (!system)
      return { min: "0", max: "0", weeks: "—", rawMin: 0, rawMax: 0, hasGrant: false, netMin: 0, netMax: 0 };

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

    // Net price after the 70% SME grant (not for standalone marketing)
    const grant = system !== "marketing" ? calcSmeGrant(rawMin, rawMax) : null;

    return {
      min: rawMin.toLocaleString("de-DE"),
      max: rawMax.toLocaleString("de-DE"),
      weeks: base.weeks,
      rawMin,
      rawMax,
      hasGrant: !!grant,
      netMin: grant?.netMin ?? rawMin,
      netMax: grant?.netMax ?? rawMax,
    };
  }, [system, scale, capabilities]);

  // Live "build progress" for the stage bar
  const configuredCount = (system ? 1 : 0) + (scale ? 1 : 0) + (step >= 3 ? 1 : 0);
  const buildPct = Math.round((configuredCount / 3) * 100);

  const navigate = useNavigate();

  const handleNext = () => {
    // Marketing isn't priced here — scope it personally on the contact form
    if (step === 1 && system === "marketing") {
      navigate("/contact");
      window.scrollTo({ top: 0 });
      return;
    }
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
      ref={stageRef}
      onMouseMove={handleStageMove}
      id="project-builder"
      className="relative py-20 sm:py-28 md:py-32 flex flex-col justify-center overflow-hidden bg-slate-50 dark:bg-[#050509] transition-colors duration-300"
    >
      {/* Dark studio gradient — dark only */}
      <div
        className="hidden dark:block absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(130% 80% at 50% -10%, #0c0c1a 0%, #08080f 45%, #050509 100%)",
        }}
      />
      {/* ── Studio stage decorations ─────────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3CE7FC]/50 to-transparent" />
      {/* Overhead spotlight */}
      {/* Reflective floor wash */}
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#2563F6]/[0.04] dark:from-[#2563F6]/[0.06] to-transparent pointer-events-none" />
      {/* Fine grid — dark dots in light, white dots in dark */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:hidden pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025] hidden dark:block pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Premium film grain — dark only */}
      <NoiseOverlay className="hidden dark:block" opacity={0.03} />
      {/* Cursor-tracking spotlight (desktop) */}
      <motion.div
        className="hidden lg:block absolute w-[500px] h-[500px] rounded-[2px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"
        style={{
          left: glowX,
          top: glowY,
          background:
            "radial-gradient(circle, rgba(60,231,252,0.10) 0%, rgba(37,99,246,0.05) 40%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-3xl">
          <div className="eyebrow-mono flex items-center justify-center gap-3 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#3CE7FC]/70" />
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CE7FC] animate-pulse" />
              04 / Live simulator
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#3CE7FC]/70" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white mb-5 tracking-tight">
            Build &amp; price your project,{" "}
            <span className=" text-[var(--signal)] animate-gradient-x">
              live.
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Spec your build like a high-performance machine and watch your price —
            and your <span className="text-emerald-400 font-semibold">net cost after the 70% SME grant</span> —
            update in real time. Then start it in one click.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-[2px] bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-sm font-semibold">
            <BadgeEuro className="w-4 h-4" />
            Luxembourg SMEs: up to 70% funded by the state SME grant
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#3CE7FC]" /> Takes ~30 seconds</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#3CE7FC]" /> Instant estimate</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#3CE7FC]" /> No commitment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── Left panel: cinematic build stage — the live preview leads ── */}
          <div className="hidden lg:block lg:col-span-6 lg:sticky top-24">
            <motion.div
              layout
              className="relative w-full rounded-lg bg-gradient-to-b from-[#13131f] to-[#0b0b14] border border-white/[0.10] overflow-hidden"
            >
              {/* Stage glows */}
              <div className="absolute inset-0 pointer-events-none">
              </div>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3CE7FC]/40 to-transparent" />

              {/* Build progress */}
              <div className="relative z-10 px-8 pt-7">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                    Build progress
                  </span>
                  <span className="text-[11px] font-medium text-[#3CE7FC] tabular-nums">{buildPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <motion.div
                    className="h-full rounded-[2px] bg-gradient-to-r from-[#3CE7FC] to-[#2563F6]"
                    animate={{ width: `${buildPct}%` }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                  />
                </div>
              </div>

              <div className="relative z-10 px-8 pt-8 pb-8 min-h-[320px] flex flex-col items-center justify-center">
                <AnimatePresence mode="popLayout">
                  {!system ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="text-center"
                    >
                      <Layers className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-400 font-medium">Select a platform to begin your build</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="system"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative z-10 w-full flex flex-col items-center justify-center"
                    >
                      {/* Chassis + orbiting capabilities */}
                      <div className="relative w-52 h-52 mb-6">
                        <motion.div
                          className="w-full h-full rounded-[2rem] bg-gradient-to-tr from-[#2563F6]/25 to-[#3CE7FC]/20 border border-[#3CE7FC]/30 flex items-center justify-center relative"
                          style={{
                            boxShadow: `0 0 ${30 + (SCALE_LEVELS.find((s) => s.id === scale)?.multiplier ?? 1) * 18}px rgba(60,231,252,0.28)`,
                          }}
                          animate={{ rotateY: [0, 6, -6, 0], rotateX: [0, -6, 6, 0] }}
                          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {system === "ai-agent"  && <Brain        className="w-20 h-20 text-[#3CE7FC]" />}
                          {system === "webapp"     && <Code         className="w-20 h-20 text-[#3CE7FC]" />}
                          {system === "website"    && <Globe        className="w-20 h-20 text-[#3CE7FC]" />}
                          {system === "ecommerce"  && <ShoppingCart className="w-20 h-20 text-[#3CE7FC]" />}
                          {system === "marketing"  && <Megaphone    className="w-20 h-20 text-[#3CE7FC]" />}

                          {/* Capability nodes orbiting the icon */}
                          <AnimatePresence>
                            {Array.from(capabilities).map((capId, index) => {
                              const total = capabilities.size;
                              const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
                              const radius = 112;
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
                                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                  className="absolute w-11 h-11 bg-[#0a0a14] rounded-[2px] border border-[#3CE7FC]/40 flex items-center justify-center top-1/2 left-1/2 -mt-[22px] -ml-[22px]"
                                >
                                  <CapIcon className="w-4 h-4 text-[#3CE7FC]" />
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </motion.div>

                        {/* Reflective floor pool */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-44 h-8 bg-[#3CE7FC]/25 rounded-[100%] blur-2xl" />
                      </div>

                      {/* Spec readout */}
                      <div className="text-center w-full mt-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-white/[0.06] border border-white/[0.10] text-[11px] font-medium text-[#3CE7FC] mb-3 uppercase tracking-widest">
                          {SCALE_LEVELS.find((s) => s.id === scale)?.label ?? "Choose your trim →"}
                        </div>
                        <h3 className="text-2xl font-medium text-white tracking-tight">
                          {CORE_SYSTEMS.find((s) => s.id === system)?.label}
                        </h3>
                        <div className="mt-3 flex items-center justify-center gap-4 text-sm font-medium text-slate-400">
                          <span>{capabilities.size} feature{capabilities.size === 1 ? "" : "s"}</span>
                          <span className="w-1 h-1 bg-slate-600 rounded-full" />
                          <span>~{BASE[system].weeks} weeks</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Persistent live price — the hero of the stage */}
              {system && scale && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 border-t border-white/10 bg-black/30 px-8 py-7"
                >
                  {estimate.hasGrant ? (
                    <>
                      <div className="text-[11px] font-medium uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">
                        <BadgeEuro className="w-3.5 h-3.5" /> Your price after 70% grant
                      </div>
                      <div className="text-4xl xl:text-5xl leading-none font-extrabold text-white tracking-tight tabular-nums">
                        €<AnimatedNumber value={estimate.netMin} />
                        <span className="text-white/30 mx-2 font-light">–</span>
                        €<AnimatedNumber value={estimate.netMax} />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2.5">
                        <span className="text-sm text-slate-500 line-through tabular-nums">
                          €{estimate.min} – €{estimate.max}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium tabular-nums">
                          <TrendingDown className="w-3 h-3" />
                          save €{(estimate.rawMin - estimate.netMin).toLocaleString("de-DE")}–{(estimate.rawMax - estimate.netMax).toLocaleString("de-DE")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[11px] font-medium uppercase tracking-widest text-[#3CE7FC] mb-2">
                        Your build
                      </div>
                      <div className="text-4xl xl:text-5xl leading-none font-extrabold text-white tracking-tight tabular-nums">
                        €<AnimatedNumber value={estimate.rawMin} />
                        <span className="text-white/30 mx-2 font-light">–</span>
                        €<AnimatedNumber value={estimate.rawMax} />
                      </div>
                    </>
                  )}

                  {/* Spec row */}
                  <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-[#3CE7FC]" />
                      <span className="font-semibold">{estimate.weeks}</span>
                      <span className="text-slate-500">weeks</span>
                    </div>
                    <span className="w-px h-4 bg-white/15" />
                    <div className="flex items-center gap-2 text-slate-300">
                      <Layers className="w-4 h-4 text-[#3CE7FC]" />
                      <span className="font-semibold">{capabilities.size}</span>
                      <span className="text-slate-500">feature{capabilities.size === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* ── Right panel: steps ────────────────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Mobile-only: compact rolling price bar */}
            {system && scale && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:hidden mb-5 px-4 py-3.5 rounded-lg bg-white dark:bg-white/[0.05] border border-[#3CE7FC]/30 flex items-center justify-between"
              >
                <div>
                  {estimate.hasGrant ? (
                    <>
                      <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                        <BadgeEuro className="w-3 h-3" /> After 70% grant
                      </div>
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                        €<AnimatedNumber value={estimate.netMin} /> – €<AnimatedNumber value={estimate.netMax} />
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 line-through tabular-nums">
                        €{estimate.min} – €{estimate.max}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[10px] font-medium text-[#2563F6] dark:text-[#3CE7FC] uppercase tracking-widest mb-0.5">Your build</div>
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                        €<AnimatedNumber value={estimate.rawMin} /> – €<AnimatedNumber value={estimate.rawMax} />
                      </div>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Timeline</div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{estimate.weeks} weeks</div>
                </div>
              </motion.div>
            )}
            {/* Step indicators */}
            <div className="flex items-center gap-1 sm:gap-2 mb-8 sm:mb-10">
              {["Product", "Scale", "Features", "Estimate"].map((label, idx) => {
                const s = idx + 1;
                const isActive = s === step;
                const isPast = s < step;
                return (
                  <div key={s} className="flex items-center shrink-0">
                    <div
                      className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] text-xs sm:text-sm font-medium transition-colors ${ isActive ? "bg-[#2563F6] text-white /30" : isPast ? "bg-[#2563F6]/10 dark:bg-[#2563F6]/20 text-[#2563F6]" : "bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-500" }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : s}
                    </div>
                    <span
                      className={`ml-1.5 sm:ml-3 mr-2 sm:mr-4 text-xs sm:text-sm font-semibold tracking-wide hidden xs:inline sm:inline ${ isActive ? "text-[var(--text-hi)]" : "text-slate-400 dark:text-slate-500" }`}
                    >
                      {label}
                    </span>
                    {s !== 4 && (
                      <div
                        className={`w-4 sm:w-8 h-px mr-1 sm:mr-4 ${ isPast ? "bg-[#2563F6]/50" : "bg-slate-200 dark:bg-white/10" }`}
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
                          className={`group w-full flex items-center p-5 border text-left transition-all duration-300 ${ isSelected ? "border-[var(--line-strong)] border-l-2 border-l-[var(--signal)] bg-[var(--surface-2)]" : "border-[var(--line)] border-l-2 border-l-transparent bg-[var(--surface-1)] hover:bg-[var(--surface-2)] hover:border-[var(--line-strong)]" }`}
                        >
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center mr-5 transition-colors duration-[var(--dur-1)] ${ isSelected ? "text-[var(--signal-text)]" : "text-[var(--metal)]" }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`text-lg font-medium ${ isSelected ? "text-[var(--text-hi)]" : "text-[var(--text-hi)]" }`}
                            >
                              {sys.label}
                            </h4>
                            <p
                              className={`mt-0.5 text-sm ${ isSelected ? "text-[var(--text-mid)]" : "text-[var(--text-mid)]" }`}
                            >
                              {sys.description}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-[#2563F6] dark:text-[#3CE7FC] ml-4 flex-shrink-0" />
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
                          className={`w-full flex items-center justify-between p-5 border text-left transition-all duration-300 ${ isSelected ? "border-[var(--line-strong)] border-l-2 border-l-[var(--signal)] bg-[var(--surface-2)]" : "border-[var(--line)] border-l-2 border-l-transparent bg-[var(--surface-1)] hover:bg-[var(--surface-2)] hover:border-[var(--line-strong)]" }`}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4
                                className={`text-lg font-medium ${ isSelected ? "text-[var(--text-hi)]" : "text-[var(--text-hi)]" }`}
                              >
                                {lvl.label}
                              </h4>
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-[2px] ${ isSelected ? "bg-[#2563F6]/10 text-[#2563F6] dark:bg-[#3CE7FC]/10 dark:text-[#3CE7FC]" : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400" }`}
                              >
                                {lvl.badge}
                              </span>
                            </div>
                            <p
                              className={`text-sm ${ isSelected ? "text-[var(--text-mid)]" : "text-[var(--text-mid)]" }`}
                            >
                              {lvl.description}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-[#2563F6] dark:text-[#3CE7FC] ml-4 flex-shrink-0" />
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
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                      {activeCaps.map((cap) => {
                        const Icon = cap.icon;
                        const isSelected = capabilities.has(cap.id);
                        const price = CAP_PRICE[cap.id];
                        return (
                          <button
                            key={cap.id}
                            onClick={() => toggleCapability(cap.id)}
                            className={`group flex items-start p-4 border text-left transition-all duration-300 ${ isSelected ? "border-[var(--line-strong)] border-l-2 border-l-[var(--signal)] bg-[var(--surface-2)]" : "border-[var(--line)] border-l-2 border-l-transparent bg-[var(--surface-1)] hover:bg-[var(--surface-2)] hover:border-[var(--line-strong)]" }`}
                          >
                            <div
                              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mr-3 mt-0.5 transition-colors duration-[var(--dur-1)] ${ isSelected ? "text-[var(--signal-text)]" : "text-[var(--metal)]" }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4
                                  className={`text-sm font-medium leading-tight ${ isSelected ? "text-[var(--text-hi)]" : "text-[var(--text-hi)]" }`}
                                >
                                  {cap.label}
                                </h4>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-[#3CE7FC] flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {cap.sublabel}
                              </p>
                              {price && (
                                <p
                                  className={`text-xs font-semibold mt-1 ${ isSelected ? "text-[#3CE7FC]" : "text-slate-400 dark:text-slate-500" }`}
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

                    {/* Price result card — gross → grant → net */}
                    <div className="mb-8 rounded-lg bg-gradient-to-br from-[#11111f] to-[#0b0b16] border border-white/10 shadow-black/40 relative overflow-hidden">

                      <div className="relative z-10 p-7 sm:p-8">
                        {estimate.hasGrant ? (
                          <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                Your investment
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-emerald-500/15 text-emerald-400 text-[11px] font-medium uppercase tracking-wider">
                                SME grant applied
                              </span>
                            </div>

                            {/* Waterfall */}
                            <div className="space-y-2.5 mb-5">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Project total</span>
                                <span className="text-base font-semibold text-slate-400 tabular-nums line-through decoration-slate-600">
                                  €{estimate.min} – €{estimate.max}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-emerald-400">
                                <span className="text-sm font-medium flex items-center gap-1.5">
                                  <TrendingDown className="w-4 h-4" /> SME grant (−70%)
                                </span>
                                <span className="text-base font-semibold tabular-nums">
                                  −€{(estimate.rawMin - estimate.netMin).toLocaleString("de-DE")} to −€{(estimate.rawMax - estimate.netMax).toLocaleString("de-DE")}
                                </span>
                              </div>
                            </div>

                            {/* Net — hero number */}
                            <div className="border-t border-white/10 pt-6">
                              <div className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-2.5">
                                You pay after grant
                              </div>
                              <div className="text-4xl sm:text-5xl md:text-[3.4rem] font-extrabold text-white tracking-tight tabular-nums leading-none">
                                €<AnimatedNumber value={estimate.netMin} />
                                <span className="text-white/30 mx-2 font-light">–</span>
                                €<AnimatedNumber value={estimate.netMax} />
                              </div>
                              <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                                <Sparkles className="w-4 h-4" />
                                You save €{(estimate.rawMin - estimate.netMin).toLocaleString("de-DE")} – €{(estimate.rawMax - estimate.netMax).toLocaleString("de-DE")}
                              </div>
                              <p className="text-white/40 text-xs mt-3.5">
                                Ex. VAT · final grant amount confirmed on application
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-xs font-semibold text-[#3CE7FC] uppercase tracking-widest mb-2">
                              Estimated investment
                            </div>
                            <div className="text-4xl sm:text-5xl md:text-[3.4rem] font-extrabold text-white mb-2 tracking-tight tabular-nums leading-none">
                              €<AnimatedNumber value={estimate.rawMin} />
                              <span className="text-white/30 mx-2 font-light">–</span>
                              €<AnimatedNumber value={estimate.rawMax} />
                            </div>
                            <p className="text-white/50 text-xs">Ex. VAT</p>
                          </>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 mt-6 pt-5">
                          <div>
                            <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Timeline</div>
                            <div className="font-medium text-lg text-white">{estimate.weeks} weeks</div>
                          </div>
                          <div>
                            <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Add-ons</div>
                            <div className="font-medium text-lg text-white">{capabilities.size} features</div>
                          </div>
                          <div>
                            <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Quality</div>
                            <div className="font-medium text-lg text-white flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-[#3CE7FC]" /> Top tier
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Marketing: bundling note (not independently 70%-funded) ── */}
                    {system === "marketing" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-8 p-6 rounded-lg bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-400/50 dark:border-sky-500/40 relative overflow-hidden"
                      >
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="flex-shrink-0 w-11 h-11 rounded-md bg-sky-500 flex items-center justify-center shadow-sky-500/30">
                            <BadgeEuro className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-sm font-extrabold text-sky-700 dark:text-sky-400 uppercase tracking-widest">
                                Bundle into SME Digital Package
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                              Marketing isn't separately state-funded, but it can be{" "}
                              <strong>co-funded inside an SME Digital Package</strong> when
                              paired with a website or web-app project — up to{" "}
                              <strong>15% marketing services</strong> and{" "}
                              <strong>15% ad spend</strong> of the eligible investment, at the
                              same <strong>70%</strong> subsidy rate.
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Tell us about your wider project and we'll structure it to
                              maximise your grant.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ── SME Grant callout (Digital / AI) ──────────────── */}
                    {(() => {
                      if (!system || system === "marketing") return null;
                      const grant = calcSmeGrant(estimate.rawMin, estimate.rawMax);
                      if (!grant) return null;
                      const pkgName = getSmePackage(system);
                      const isPartial = estimate.rawMin > SME_GRANT_MAX;
                      const isDigital = system !== "ai-agent";
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="mb-8 p-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400/60 dark:border-emerald-500/40 relative overflow-hidden"
                        >
                          {/* Background shimmer */}

                          <div className="flex items-start gap-4 relative z-10">
                            <div className="flex-shrink-0 w-11 h-11 rounded-md bg-emerald-500 flex items-center justify-center shadow-emerald-500/30">
                              <BadgeEuro className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                                  {pkgName}
                                </span>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-[2px] bg-emerald-500 text-white">
                                  Gouvernement luxembourgeois
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                                Your project qualifies for the{" "}
                                <strong>{pkgName}</strong> — the Luxembourg government
                                covers <strong>70%</strong> of your eligible investment
                                (up to €25,000).{" "}
                                {isPartial
                                  ? "The first €25,000 of your investment qualifies."
                                  : "Your full investment may be eligible."}
                              </p>

                              {isDigital && (
                                <p className="text-xs text-emerald-700/90 dark:text-emerald-300/80 mb-3 leading-relaxed">
                                  You can also bundle up to <strong>15% marketing</strong>{" "}
                                  and <strong>15% ad spend</strong> into this package — funded
                                  at the same 70% rate.
                                </p>
                              )}

                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                                We prepare and submit the grant application for you — you
                                just sign. 
                              </p>

                              <div className="flex flex-wrap items-center gap-4">
                                <a
                                  href={`mailto:contact@deev.lu?subject=${encodeURIComponent(
                                    `SME grant application — ${pkgName}`
                                  )}&body=${encodeURIComponent(
                                    `Hi Deev team,\n\nI'd like to apply for the ${pkgName} and start my project.\n\nProject: ${
                                      CORE_SYSTEMS.find((s) => s.id === system)?.label ?? ""
                                    }\nEstimated net (after 70% grant): €${grant.netMin.toLocaleString(
                                      "de-DE"
                                    )} – €${grant.netMax.toLocaleString("de-DE")}\n\n`
                                  )}`}
                                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-md font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 hover:-translate-y-0.5 "
                                >
                                  Apply for my 70% grant
                                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>
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
                          </div>
                        </motion.div>
                      );
                    })()}

                    {/* Selected features breakdown */}
                    {capabilities.size > 0 && (
                      <div className="mb-8 p-5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
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
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[2px] bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
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
                        href="mailto:contact@deev.lu?subject=Start%20my%20project%20%E2%80%94%20Deev%20simulator&body=Hi%20Deev%20team%2C%0D%0A%0D%0AI%27ve%20configured%20my%20project%20in%20the%20simulator%20and%20I%27d%20like%20to%20start.%0D%0A"
                        className="flex-1 py-4 text-white font-medium text-base transition-colors duration-[var(--dur-1)] hover:bg-[var(--signal-hi)] flex items-center justify-center gap-2" style={{ background: "var(--signal)", borderRadius: "var(--radius-2)" }}
                      >
                        Start my project <ArrowRight className="w-5 h-5" />
                      </a>
                      <button
                        onClick={reset}
                        className="px-7 py-4 bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white rounded-md font-medium text-base hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
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
              <div className="mt-8 sm:mt-10 border-t border-slate-200 dark:border-white/10 pt-5 sm:pt-6">
                {/* Mobile: stacked; Desktop: side by side */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3">
                  <button
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1}
                    className={`flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-md transition-colors text-sm ${ step === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10" }`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={(step === 1 && !system) || (step === 2 && !scale)}
                    className={`flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-md font-medium text-white text-sm transition-all ${ (step === 1 && !system) || (step === 2 && !scale) ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed" : "bg-[#2563F6] hover:bg-[#2563F6]/90 /30 active:scale-[0.98]" }`}
                  >
                    {step === 1 && system === "marketing"
                      ? "Continue on contact form"
                      : step === 3
                      ? "Calculate Estimate"
                      : "Continue"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 "
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md p-8 rounded-lg bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10"
            >
              {!submitted ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-[#3CE7FC]/10 dark:bg-[#3CE7FC]/20 rounded-[2px] flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-7 h-7 text-[#3CE7FC]" />
                    </div>
                    <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-2">
                      One last step
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      A few details so we can send an accurate estimate and project
                      blueprint — the more you share, the better we scope it.
                    </p>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmitting(true);

                      const featureLabels = Array.from(capabilities)
                        .map((id) => activeCaps.find((c) => c.id === id)?.label)
                        .filter(Boolean)
                        .join(", ");
                      const smeNote = system
                        ? system === "marketing"
                          ? "Bundle into SME Digital Package"
                          : getSmePackage(system)
                        : "";
                      const systemLabel =
                        CORE_SYSTEMS.find((s) => s.id === system)?.label ?? "—";
                      const scaleLabel =
                        SCALE_LEVELS.find((s) => s.id === scale)?.label ?? "—";
                      const notes = [
                        leadForm.company && `Company: ${leadForm.company}`,
                        leadForm.website && `Website: ${leadForm.website}`,
                        leadForm.timeline && `Timeline preference: ${leadForm.timeline}`,
                        leadForm.goals && `Goals: ${leadForm.goals}`,
                        featureLabels && `Features: ${featureLabels}`,
                        smeNote && `SME grant: ${smeNote}`,
                      ]
                        .filter(Boolean)
                        .join("\n");

                      // 1) Email the configured project to contact@deev.lu
                      await sendLeadEmail({
                        subject: `New project from simulator — ${systemLabel} (${scaleLabel})`,
                        from_name: leadForm.name || "Project simulator",
                        replyto: leadForm.email,
                        name: leadForm.name,
                        email: leadForm.email,
                        product: systemLabel,
                        scale: scaleLabel,
                        estimate: `€${estimate.min} – €${estimate.max} (gross)`,
                        net_after_grant: estimate.hasGrant
                          ? `€${estimate.netMin.toLocaleString("de-DE")} – €${estimate.netMax.toLocaleString("de-DE")}`
                          : "n/a",
                        timeline: `${estimate.weeks} weeks`,
                        details: notes || "—",
                      });

                      setSubmitting(false);
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
                      className="w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC]"
                    />
                    <input
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="Work email"
                      required
                      className="w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC]"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={leadForm.company}
                        onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                        placeholder="Company (optional)"
                        className="w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC]"
                      />
                      <input
                        type="text"
                        value={leadForm.website}
                        onChange={(e) => setLeadForm({ ...leadForm, website: e.target.value })}
                        placeholder="Current website (optional)"
                        className="w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC]"
                      />
                    </div>
                    <select
                      value={leadForm.timeline}
                      onChange={(e) => setLeadForm({ ...leadForm, timeline: e.target.value })}
                      className={`w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC] ${ leadForm.timeline ? "text-[var(--text-hi)]" : "text-slate-400" }`}
                    >
                      <option value="">When do you want to start?</option>
                      <option value="ASAP">As soon as possible</option>
                      <option value="1-3 months">In 1–3 months</option>
                      <option value="3-6 months">In 3–6 months</option>
                      <option value="Just exploring">Just exploring</option>
                    </select>
                    <textarea
                      value={leadForm.goals}
                      onChange={(e) => setLeadForm({ ...leadForm, goals: e.target.value })}
                      placeholder="What does success look like? Goals, must-haves, links… (optional)"
                      rows={3}
                      className="w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC] resize-none"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-[#2563F6] hover:bg-[#2563F6]/90 text-white rounded-md font-medium transition-all /30 disabled:opacity-60 disabled:cursor-not-allowed"
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
                  <div className="w-14 h-14 bg-green-500/10 rounded-[2px] flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-2">
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
