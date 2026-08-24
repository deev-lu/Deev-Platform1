import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { useNavigate } from "react-router";
import { sendLeadEmail } from "../../lib/leadEmail";
import NoiseOverlay from "./NoiseOverlay";
import { scrollToTop } from "../../lib/smoothScroll";
import { useT } from "../../lib/useT";
import { mark } from "../../lib/i18nMark";
import type { Dict } from "../../locales";
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

function getSmePackage(system: NonNullable<CoreSystem>, t: Dict) {
  return system === "ai-agent" ? t.builder.grant.packageAi : t.builder.grant.packageDigital;
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
const CORE_SYSTEM_IDS = [
  { id: "website" as const, icon: Globe },
  { id: "ecommerce" as const, icon: ShoppingCart },
  { id: "webapp" as const, icon: Code },
  { id: "ai-agent" as const, icon: Brain },
  { id: "marketing" as const, icon: Megaphone },
];

// ── Scale tiers ────────────────────────────────────────────────────────────────
// The multiplier is pricing and never translates; the label, the description
// and the badge are copy and always do.
const SCALE_IDS = [
  { id: "mvp" as const, multiplier: 1 },
  { id: "growth" as const, multiplier: 2 },
  { id: "enterprise" as const, multiplier: 3.5 },
];

// ── Per-capability add-on pricing (from Deev Services PDF 2026) ───────────────
const CAP_PRICE: Record<string, { min: number; max: number }> = {
  // Website add-ons
  animations:    { min: 800,  max: 1200 },
  blog: { min: 450,  max: 750  },
  i18n: { min: 400,  max: 650  },
  lead_forms:    { min: 350,  max: 550  },
  seo: { min: 900,  max: 1400 },
  gdpr: { min: 500,  max: 750  },
  live_chat:     { min: 400,  max: 600  },
  analytics:     { min: 350,  max: 550  },
  // E-Commerce add-ons
  payments: { min: 1200, max: 1700 },
  catalog: { min: 900,  max: 1350 },
  accounts: { min: 700,  max: 1050 },
  inventory:     { min: 1000, max: 1450 },
  order_mgmt:    { min: 900,  max: 1300 },
  discounts:     { min: 500,  max: 750  },
  cart_recovery: { min: 700,  max: 1000 },
  multicurrency: { min: 1000, max: 1450 },
  // Web App add-ons
  auth: { min: 1000, max: 1450 },
  dashboard:     { min: 1200, max: 1800 },
  realtime: { min: 1200, max: 1700 },
  file_upload:   { min: 700,  max: 1000 },
  email_notif:   { min: 500,  max: 750  },
  api_integr:    { min: 1000, max: 1500 },
  cron_jobs:     { min: 700,  max: 1000 },
  billing: { min: 1500, max: 2100 },
  // AI & Automation add-ons
  chatbot: { min: 1800, max: 2600 },
  rag: { min: 2500, max: 3600 },
  lead_bot: { min: 1800, max: 2500 },
  email_seq:     { min: 1200, max: 1700 },
  scraping: { min: 1500, max: 2100 },
  crm_integr:    { min: 1000, max: 1500 },
  voice: { min: 2000, max: 2800 },
  finetune: { min: 3000, max: 4200 },
  // Lead Campaigns & Marketing add-ons (campaign build / setup fees, ad spend separate)
  google_ads: { min: 800,  max: 1200 },
  meta_ads: { min: 700,  max: 1100 },
  seo_campaign:    { min: 900,  max: 1400 },
  content: { min: 600,  max: 950  },
  email_marketing: { min: 500,  max: 800  },
  social_mgmt:     { min: 800,  max: 1200 },
  funnel: { min: 700,  max: 1100 },
  cro: { min: 900,  max: 1350 },
};

// ── Capabilities per system ───────────────────────────────────────────────────
type CapItem = { id: string; icon: React.ElementType };

const CAPABILITIES: Record<NonNullable<CoreSystem>, CapItem[]> = {
  website: [
    { id: "animations",  icon: Sparkles },
    { id: "blog", icon: BookOpen },
    { id: "i18n", icon: Languages },
    { id: "lead_forms",  icon: Megaphone },
    { id: "seo", icon: Search },
    { id: "gdpr", icon: Cookie },
    { id: "live_chat",   icon: MessageSquare },
    { id: "analytics",   icon: BarChart3 },
  ],
  ecommerce: [
    { id: "payments", icon: CreditCard },
    { id: "catalog", icon: Package },
    { id: "accounts", icon: ShieldCheck },
    { id: "inventory",     icon: Database },
    { id: "order_mgmt",    icon: RefreshCw },
    { id: "discounts",     icon: Tag },
    { id: "cart_recovery", icon: Mail },
    { id: "multicurrency", icon: DollarSign },
  ],
  webapp: [
    { id: "auth", icon: ShieldCheck },
    { id: "dashboard",   icon: LayoutDashboard },
    { id: "realtime",    icon: Zap },
    { id: "file_upload", icon: Upload },
    { id: "email_notif", icon: Mail },
    { id: "api_integr",  icon: Link },
    { id: "cron_jobs",   icon: Clock },
    { id: "billing",     icon: CreditCard },
  ],
  "ai-agent": [
    { id: "chatbot",    icon: Bot },
    { id: "rag", icon: FileSearch },
    { id: "lead_bot",   icon: UserCheck },
    { id: "email_seq",  icon: Workflow },
    { id: "scraping",   icon: Database },
    { id: "crm_integr", icon: Link },
    { id: "voice", icon: Mic },
    { id: "finetune",   icon: Cpu },
  ],
  marketing: [
    { id: "google_ads", icon: Search },
    { id: "meta_ads", icon: Megaphone },
    { id: "seo_campaign",    icon: BarChart3 },
    { id: "content", icon: FileText },
    { id: "email_marketing", icon: Mail },
    { id: "social_mgmt",     icon: MessageSquare },
    { id: "funnel", icon: Globe },
    { id: "cro", icon: Zap },
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
  const t = useT();

  // Structure joins its words here: ids, icons and multipliers come from the
  // module, every string from the dictionary the reader is on.
  const CORE_SYSTEMS = CORE_SYSTEM_IDS.map((c) => ({ ...c, ...t.builder.systems[c.id] }));
  const SCALE_LEVELS = SCALE_IDS.map((l) => ({ ...l, ...t.builder.scale[l.id] }));
  const capText = (id: string) =>
    (t.builder.caps as Record<string, { label: string; sublabel: string }>)[id];
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
      return { min: "0", max: "0", weeks: "n/a", rawMin: 0, rawMax: 0, hasGrant: false, netMin: 0, netMax: 0 };

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
      scrollToTop(true);
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
      id="project-builder"
      className="relative overflow-hidden bg-[var(--surface-0)] border-y border-[var(--line)]"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      {/* One quiet texture, dark only. The studio radial, the cyan hairlines,
          the floor wash and the cursor-tracking spotlight that used to sit
          here were all colour fades: half of them stopped painting when the
          redesign killed gradient utilities, and the rest are the look we
          deliberately left behind. */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "var(--text-low)",
        }}
      />
      <NoiseOverlay className="hidden dark:block" opacity={0.03} />

      <div
        className="relative z-10 mx-auto w-full"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        {/* Header — same left edge, same type scale as every other section. */}
        <div className="mb-14 md:mb-16">
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="text-[var(--metal)]">09</span> / {t.builder.eyebrow}
            </span>
          </div>

          <h2
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em", maxWidth: "18ch" }}
          >
            {mark(t.builder.title, "text-[var(--signal-text)]")}
          </h2>

          <p
            className="text-[var(--text-mid)] mt-6"
            style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "52ch" }}
          >
            {mark(t.builder.lead, "text-[var(--positive)]")}
          </p>

          {/* The grant chip was a fixed h-9. On a phone its sentence wraps to two
              lines, so the text grew and the box did not: the second line sat on
              the border. It is padded now and grows with whatever it holds,
              with the icon aligned to the first line rather than to the middle
              of a two-line block. */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
            <span
              className="inline-flex items-start gap-2.5 px-4 py-2.5 border border-[var(--positive)]/35 text-[var(--positive)]"
              style={{ fontSize: "var(--t-small)", lineHeight: 1.45, borderRadius: "var(--radius-1)" }}
            >
              <BadgeEuro className="w-4 h-4 mt-[2px] shrink-0" />
              {t.builder.grantChip}
            </span>
            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-3 eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {t.builder.meta.time}</span>
              <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> {t.builder.meta.instant}</span>
              <span className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> {t.builder.meta.noCommitment}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── Left panel: cinematic build stage — the live preview leads ── */}
          <div className="hidden lg:block lg:col-span-5 lg:order-2 lg:sticky top-28">
            <motion.div
              layout
              className="relative w-full bg-[var(--surface-1)] border border-[var(--line)] overflow-hidden"
              style={{ borderRadius: "var(--radius-1)" }}
            >
              {/* Stage glows */}
              <div className="absolute inset-0 pointer-events-none">
              </div>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3CE7FC]/40 to-transparent" />

              {/* Build progress */}
              <div className="relative z-10 px-8 pt-7">
                <div className="flex items-center justify-between mb-2">
                  <span className="eyebrow-mono uppercase tracking-widest text-[var(--text-low)] text-[11px]">
                    {t.builder.stage.progress}
                  </span>
                  <span className="eyebrow-mono text-[var(--signal-text)] tabular-nums text-[11px]">{buildPct}%</span>
                </div>
                <div className="h-px bg-[var(--line)] overflow-hidden">
                  <motion.div
                    className="h-full bg-[var(--signal)]"
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
                      <Layers className="w-12 h-12 text-[var(--line-strong)] mx-auto mb-5" strokeWidth={1.25} />
                      <p className="text-[var(--text-low)]" style={{ fontSize: "var(--t-small)" }}>{t.builder.stage.empty}</p>
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
                          className="w-full h-full rounded-[2rem] bg-gradient-to-tr from-[#2563F6]/25 to-[#3CE7FC]/20 border border-[var(--signal)]/35 flex items-center justify-center relative"
                          style={{
                            boxShadow: `0 0 ${30 + (SCALE_LEVELS.find((s) => s.id === scale)?.multiplier ?? 1) * 18}px rgba(60,231,252,0.28)`,
                          }}
                          animate={{ rotateY: [0, 6, -6, 0], rotateX: [0, -6, 6, 0] }}
                          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {system === "ai-agent"  && <Brain        className="w-20 h-20 text-[var(--signal-text)]" />}
                          {system === "webapp"     && <Code         className="w-20 h-20 text-[var(--signal-text)]" />}
                          {system === "website"    && <Globe        className="w-20 h-20 text-[var(--signal-text)]" />}
                          {system === "ecommerce"  && <ShoppingCart className="w-20 h-20 text-[var(--signal-text)]" />}
                          {system === "marketing"  && <Megaphone    className="w-20 h-20 text-[var(--signal-text)]" />}

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
                                  <CapIcon className="w-4 h-4 text-[var(--signal-text)]" />
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </motion.div>

                        {/* Reflective floor pool */}
                        {/* One hairline under the chassis, in place of the
                            cyan light pool that used to sit here. */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-32 h-px bg-[var(--line-strong)]" />
                      </div>

                      {/* Spec readout */}
                      <div className="text-center w-full mt-2">
                        <div className="eyebrow-mono inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--surface-2)] border border-[var(--line)] text-[11px] text-[var(--signal-text)] mb-3 uppercase"
                          style={{ borderRadius: "var(--radius-1)", letterSpacing: "0.16em" }}>
                          {SCALE_LEVELS.find((s) => s.id === scale)?.label ?? t.builder.stage.chooseTrim}
                        </div>
                        <h3 className="text-2xl font-medium text-[var(--text-hi)] tracking-tight">
                          {CORE_SYSTEMS.find((s) => s.id === system)?.label}
                        </h3>
                        <div className="mt-3 flex items-center justify-center gap-4 text-sm font-medium text-[var(--text-low)]">
                          <span>{capabilities.size} feature{capabilities.size === 1 ? "" : "s"}</span>
                          <span className="w-1 h-1 bg-[var(--line-strong)] rounded-full" />
                          <span>~{BASE[system].weeks} weeks</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Persistent live price, the hero of the stage */}
              {system && scale && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 border-t border-[var(--line)] bg-black/30 px-8 py-7"
                >
                  {estimate.hasGrant ? (
                    <>
                      <div className="text-[11px] font-medium uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">
                        <BadgeEuro className="w-3.5 h-3.5" /> Your price after 70% grant
                      </div>
                      <div className="text-4xl xl:text-5xl leading-none font-medium text-[var(--text-hi)] tracking-tight tabular-nums">
                        €<AnimatedNumber value={estimate.netMin} />
                        <span className="text-[var(--text-low)] mx-2 font-light">–</span>
                        €<AnimatedNumber value={estimate.netMax} />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2.5">
                        <span className="text-sm text-[var(--text-low)] line-through tabular-nums">
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
                      <div className="text-[11px] font-medium uppercase tracking-widest text-[var(--signal-text)] mb-2">
                        {t.builder.stage.yourBuild}
                      </div>
                      <div className="text-4xl xl:text-5xl leading-none font-medium text-[var(--text-hi)] tracking-tight tabular-nums">
                        €<AnimatedNumber value={estimate.rawMin} />
                        <span className="text-[var(--text-low)] mx-2 font-light">–</span>
                        €<AnimatedNumber value={estimate.rawMax} />
                      </div>
                    </>
                  )}

                  {/* Spec row */}
                  <div className="mt-5 pt-5 border-t border-[var(--line)] flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-mid)]">
                      <Clock className="w-4 h-4 text-[var(--signal-text)]" />
                      <span className="font-semibold">{estimate.weeks}</span>
                      <span className="text-[var(--text-low)]">weeks</span>
                    </div>
                    <span className="w-px h-4 bg-white/15" />
                    <div className="flex items-center gap-2 text-[var(--text-mid)]">
                      <Layers className="w-4 h-4 text-[var(--signal-text)]" />
                      <span className="font-semibold">{capabilities.size}</span>
                      <span className="text-[var(--text-low)]">feature{capabilities.size === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* ── Right panel: steps ────────────────────────────────────────── */}
          <div className="lg:col-span-7 lg:order-1 flex flex-col justify-center min-w-0">
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
                      <div className="text-[10px] text-[var(--text-mid)] line-through tabular-nums">
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
            {/* Step indicators. The old row was a fixed 626px inside a 592px
                column, so "4 Estimate" was cut off at the exact width most
                laptops use. This one wraps and the rules flex. */}
            <div className="flex flex-wrap items-center gap-y-3 mb-8 sm:mb-10">
              {t.builder.steps.map((label, idx) => {
                const s = idx + 1;
                const isActive = s === step;
                const isPast = s < step;
                return (
                  <div key={s} className="flex items-center min-w-0">
                    <span
                      className={`flex items-center justify-center w-7 h-7 shrink-0 eyebrow-mono transition-colors ${
                        isActive
                          ? "bg-[var(--signal)] text-white"
                          : isPast
                          ? "border border-[var(--signal)]/45 text-[var(--signal-text)]"
                          : "border border-[var(--line)] text-[var(--text-low)]"
                      }`}
                      style={{ fontSize: "var(--t-label)", borderRadius: "var(--radius-1)" }}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : s}
                    </span>
                    <span
                      className={`eyebrow-mono uppercase ml-3 truncate ${
                        isActive ? "text-[var(--text-hi)]" : "text-[var(--text-low)]"
                      }`}
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      {label}
                    </span>
                    {s !== 4 && (
                      <span
                        className={`h-px w-6 lg:w-10 mx-3 shrink ${
                          isPast ? "bg-[var(--signal)]/50" : "bg-[var(--line)]"
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
                      {t.builder.q.system}
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
                            <h3
                              className={`text-lg font-medium ${ isSelected ? "text-[var(--text-hi)]" : "text-[var(--text-hi)]" }`}
                            >
                              {sys.label}
                            </h3>
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
                      {t.builder.q.scale}
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
                              <h3
                                className={`text-lg font-medium ${ isSelected ? "text-[var(--text-hi)]" : "text-[var(--text-hi)]" }`}
                              >
                                {lvl.label}
                              </h3>
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
                      {t.builder.q.features}
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
                                <h3
                                  className={`text-sm font-medium leading-tight ${ isSelected ? "text-[var(--text-hi)]" : "text-[var(--text-hi)]" }`}
                                >
                                  {capText(cap.id).label}
                                </h3>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-[#3CE7FC] flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {capText(cap.id).sublabel}
                              </p>
                              {price && (
                                <p
                                  className={`text-xs font-semibold mt-1 ${ isSelected ? "text-[#3CE7FC]" : "text-[var(--text-mid)]" }`}
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
                      {t.builder.estimate.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                      {t.builder.estimate.basedOnFull(
                        SCALE_LEVELS.find((s) => s.id === scale)?.label ?? "",
                        CORE_SYSTEMS.find((s) => s.id === system)?.label ?? "",
                        t.builder.estimate.features(capabilities.size),
                      )}
                    </p>

                    {/* Price result card, gross → grant → net */}
                    <div className="mb-8 rounded-lg bg-gradient-to-br from-[#11111f] to-[#0b0b16] border border-white/10 shadow-black/40 relative overflow-hidden">

                      <div className="relative z-10 p-7 sm:p-8">
                        {estimate.hasGrant ? (
                          <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                {t.builder.estimate.yourInvestment}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-emerald-500/15 text-emerald-400 text-[11px] font-medium uppercase tracking-wider">
                                {t.builder.estimate.grantApplied}
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

                            {/* Net, hero number */}
                            <div className="border-t border-white/10 pt-6">
                              <div className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-2.5">
                                {t.builder.estimate.youPay}
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
                                {t.builder.estimate.exVat}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-xs font-semibold text-[#3CE7FC] uppercase tracking-widest mb-2">
                              {t.builder.estimate.plain}
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
                                {t.builder.grant.bundleTitle}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                              {t.builder.grant.bundleBody}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {t.builder.grant.bundleCta}
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
                      const pkgName = getSmePackage(system, t);
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
                                  {t.builder.grant.government}
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                                {mark(t.builder.grant.qualifiesFull(pkgName), "font-semibold")}{" "}
                                {isPartial ? t.builder.grant.capped : t.builder.grant.uncapped}
                              </p>

                              {isDigital && (
                                <p className="text-xs text-emerald-700/90 dark:text-emerald-300/80 mb-3 leading-relaxed">
                                  {t.builder.grant.marketingBundle}
                                </p>
                              )}

                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                                {t.builder.grant.weApply}
                              </p>

                              <div className="flex flex-wrap items-center gap-4">
                                <a
                                  href={`mailto:contact@deev.lu?subject=${encodeURIComponent(
                                    `SME grant application, ${pkgName}`
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
                                  {t.builder.grant.learnMore}
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
                          {t.builder.estimate.included}
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
                                {capText(cap.id).label}
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
                        {t.builder.estimate.reconfigure}
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
                      ? t.builder.nav.toContact
                      : step === 3
                      ? t.builder.nav.calculate
                      : t.builder.nav.next}{" "}
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
                      {t.builder.leadForm.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {t.builder.leadForm.body}
                    </p>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmitting(true);

                      const featureLabels = Array.from(capabilities)
                        .map((id) => capText(id)?.label)
                        .filter(Boolean)
                        .join(", ");
                      const smeNote = system
                        ? system === "marketing"
                          ? t.builder.grant.bundleTitle
                          : getSmePackage(system, t)
                        : "";
                      const systemLabel =
                        CORE_SYSTEMS.find((s) => s.id === system)?.label ?? "n/a";
                      const scaleLabel =
                        SCALE_LEVELS.find((s) => s.id === scale)?.label ?? ", ";
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
                        subject: `New project from simulator, ${systemLabel} (${scaleLabel})`,
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
                        details: notes || "n/a",
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
                      placeholder={t.builder.leadForm.name}
                      required
                      className="w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC]"
                    />
                    <input
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder={t.builder.leadForm.email}
                      required
                      className="w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC]"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={leadForm.company}
                        onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                        placeholder={t.builder.leadForm.company}
                        className="w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC]"
                      />
                      <input
                        type="text"
                        value={leadForm.website}
                        onChange={(e) => setLeadForm({ ...leadForm, website: e.target.value })}
                        placeholder={t.builder.leadForm.website}
                        className="w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC]"
                      />
                    </div>
                    <select
                      value={leadForm.timeline}
                      onChange={(e) => setLeadForm({ ...leadForm, timeline: e.target.value })}
                      className={`w-full px-5 py-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#3CE7FC] ${ leadForm.timeline ? "text-[var(--text-hi)]" : "text-slate-400" }`}
                    >
                      <option value="">{t.builder.leadForm.timelinePlaceholder}</option>
                      <option value="ASAP">{t.builder.leadForm.timelines.asap}</option>
                      <option value="1-3 months">{t.builder.leadForm.timelines.m1_3}</option>
                      <option value="3-6 months">{t.builder.leadForm.timelines.m3_6}</option>
                      <option value="Just exploring">{t.builder.leadForm.timelines.exploring}</option>
                    </select>
                    <textarea
                      value={leadForm.goals}
                      onChange={(e) => setLeadForm({ ...leadForm, goals: e.target.value })}
                      placeholder={t.builder.leadForm.goals}
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
                    {t.builder.done.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {t.builder.done.body(leadForm.email)}
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
