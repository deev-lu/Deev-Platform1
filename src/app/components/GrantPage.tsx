import { useMemo, useState } from "react";
import { motion, useReducedMotion, type MotionProps } from "motion/react";
import {
  ArrowRight,
  BadgeEuro,
  Check,
  ExternalLink,
  Globe,
  LayoutDashboard,
  Megaphone,
  Palette,
  ShoppingCart,
  Sparkles,
  Wallet,
} from "lucide-react";
import L from "./L";
import { useT, useLocalePath } from "../../lib/useT";
import { mark } from "../../lib/i18nMark";
import {
  GRANT_CAP,
  GRANT_MAX,
  GRANT_MIN,
  GRANT_RATE,
  grantFor,
} from "../../lib/smeGrant";

/**
 * /sme-packages — the funding page.
 *
 * The single most common reason a Luxembourg SME talks to us is the grant, and
 * until now the only thing the site said about it was a banner and a line in
 * the simulator. This is the page that answers the question properly.
 *
 * Two decisions shape it:
 *
 *   It says the unwelcome things. That the aid is a reimbursement and not a
 *   discount, so the cash has to be there in between. That work started before
 *   approval is not covered. That nobody can promise an approval. A page that
 *   only lists the upside reads like every other agency's, and the first
 *   invoice is a bad moment to learn how the money actually moves.
 *
 *   The numbers are computed, never typed. Every figure on the page comes from
 *   lib/smeGrant.ts, the same module the project simulator uses, so the page
 *   explaining the rules and the tool applying them cannot disagree.
 */

const SCOPE_ICONS = {
  website: Globe,
  store: ShoppingCart,
  app: LayoutDashboard,
  ai: Sparkles,
  marketing: Megaphone,
  brand: Palette,
} as const;

const CHECKS = ["sme", "seat", "auth", "size"] as const;

export default function GrantPage() {
  const t = useT();
  const localePath = useLocalePath();
  const reduce = useReducedMotion();
  const g = t.grant;
  const home = localePath("/");

  // One reveal, reused. y stays in the shape under reduced motion and is just
  // zero, so the props keep a single type instead of a union motion rejects.
  const rise = (i = 0) =>
    ({
      initial: { opacity: 0, y: reduce ? 0 : 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-60px" },
      transition: {
        duration: reduce ? 0 : 0.45,
        delay: reduce ? 0 : i * 0.05,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }) satisfies MotionProps;

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
      >
        <div className="flex items-center gap-4 mb-10">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--positive)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {g.eyebrow}
          </span>
        </div>

        <h1
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "18ch" }}
        >
          {mark(g.title, "text-[var(--positive)]")}
        </h1>

        <p
          className="text-[var(--text-mid)] mt-6"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "60ch" }}
        >
          {g.lead}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`${home}#pricing`}
            className="group inline-flex items-center gap-2 h-12 px-6 bg-[var(--signal)] text-white font-medium"
            style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
          >
            {g.ctaPrimary}
            <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
          </a>
          <L
            to="/contact"
            className="inline-flex items-center h-12 px-6 border border-[var(--line)] text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] font-medium transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
          >
            {g.ctaSecondary}
          </L>
        </div>

        {/* The three numbers that decide everything. */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["rate", "range", "cap"] as const).map((k, i) => (
            <motion.div
              key={k}
              {...rise(i)}
              className="border border-[var(--line)] bg-[var(--surface-1)] p-7"
              style={{ borderRadius: "var(--radius-1)" }}
            >
              <div
                className="text-[var(--text-hi)] font-medium tabular-nums"
                style={{ fontSize: "var(--t-h1)", lineHeight: 1, letterSpacing: "-0.03em" }}
              >
                {g.stats[k].value}
              </div>
              <div
                className="eyebrow-mono uppercase text-[var(--text-low)] mt-4"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {g.stats[k].label}
              </div>
              <p className="text-[var(--text-mid)] mt-3" style={{ fontSize: "var(--t-small)", lineHeight: 1.5 }}>
                {g.stats[k].note}
              </p>
            </motion.div>
          ))}
        </div>
      </header>

      <EligibilityCheck />
      <GrantCalculator />

      {/* ── What a package covers ────────────────────────────────────────── */}
      <Section eyebrow={g.scope.eyebrow} title={g.scope.title} lead={g.scope.lead}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(SCOPE_ICONS) as (keyof typeof SCOPE_ICONS)[]).map((k, i) => {
            const Icon = SCOPE_ICONS[k];
            const item = g.scope.items[k];
            return (
              <motion.div
                key={k}
                {...rise(i)}
                className="border border-[var(--line)] bg-[var(--surface-1)] p-7 flex flex-col"
                style={{ borderRadius: "var(--radius-1)" }}
              >
                <Icon className="w-5 h-5 text-[var(--signal-text)] mb-5" strokeWidth={1.5} />
                <div
                  className="text-[var(--text-hi)] font-medium"
                  style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
                >
                  {item.title}
                </div>
                <p className="text-[var(--text-mid)] mt-3" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
                  {item.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ── The process ──────────────────────────────────────────────────── */}
      <Section eyebrow={g.steps.eyebrow} title={g.steps.title} lead={g.steps.lead}>
        <ol className="border-t border-[var(--line)]">
          {g.steps.items.map((step, i) => (
            <motion.li
              key={step.title}
              {...rise(i)}
              className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-2 py-7 border-b border-[var(--line)]"
            >
              <div
                className="eyebrow-mono uppercase text-[var(--text-low)] sm:col-span-2 tabular-nums"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className="text-[var(--text-hi)] font-medium sm:col-span-3"
                style={{ fontSize: "var(--t-body)", letterSpacing: "-0.01em" }}
              >
                {step.title}
              </div>
              <p
                className="text-[var(--text-mid)] sm:col-span-7"
                style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}
              >
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>

        {/* The part most pages leave out. */}
        <div
          className="mt-10 border border-[var(--line-strong)] bg-[var(--surface-1)] p-7 flex gap-5"
          style={{ borderRadius: "var(--radius-1)" }}
        >
          <Wallet className="w-5 h-5 shrink-0 mt-0.5 text-[var(--text-hi)]" strokeWidth={1.5} />
          <div>
            <div className="text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-body)" }}>
              {g.steps.cashflow.title}
            </div>
            <p className="text-[var(--text-mid)] mt-2" style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}>
              {g.steps.cashflow.body}
            </p>
          </div>
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section eyebrow={g.faq.eyebrow} title={g.faq.title}>
        <div className="border-t border-[var(--line)]">
          {g.faq.items.map((item, i) => (
            <motion.div
              key={item.q}
              {...rise(i)}
              className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-3 py-7 border-b border-[var(--line)]"
            >
              <h3
                className="text-[var(--text-hi)] font-medium md:col-span-5"
                style={{ fontSize: "var(--t-body)", lineHeight: 1.3, letterSpacing: "-0.01em" }}
              >
                {item.q}
              </h3>
              <p
                className="text-[var(--text-mid)] md:col-span-7"
                style={{ fontSize: "var(--t-small)", lineHeight: 1.65 }}
              >
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Where the numbers came from, and that they are not ours to promise. */}
        <p className="text-[var(--text-low)] mt-8" style={{ fontSize: "var(--t-label)", lineHeight: 1.6, maxWidth: "70ch" }}>
          {g.source.body}{" "}
          <a
            href="https://guichet.public.lu/en/entreprises/financement-aides/regime-sme-packages/soutien-pme/sme-packages-digital.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline hover:text-[var(--text-mid)]"
          >
            {g.source.link}
            <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
          </a>
        </p>
      </Section>

      {/* ── Close ────────────────────────────────────────────────────────── */}
      <div
        className="mx-auto pb-[var(--section-y)]"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <div
          className="border border-[var(--line)] bg-[var(--surface-1)] p-8 sm:p-12"
          style={{ borderRadius: "var(--radius-1)" }}
        >
          <h2
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h2)", lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: "20ch" }}
          >
            {g.cta.title}
          </h2>
          <p className="text-[var(--text-mid)] mt-4" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "58ch" }}>
            {g.cta.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <L
              to="/contact"
              className="group inline-flex items-center gap-2 h-12 px-6 bg-[var(--signal)] text-white font-medium"
              style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
            >
              {g.cta.action}
              <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
            </L>
            <a
              href={`${home}#pricing`}
              className="inline-flex items-center h-12 px-6 border border-[var(--line)] text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] font-medium transition-colors duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
            >
              {g.cta.secondary}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="mx-auto"
      style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBottom: "var(--section-y)" }}
    >
      <div className="flex items-center gap-4 mb-8">
        <span className="h-px w-10 bg-[var(--line-strong)]" />
        <span
          className="eyebrow-mono uppercase text-[var(--text-low)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        className="text-[var(--text-hi)] font-medium"
        style={{ fontSize: "var(--t-h2)", lineHeight: 1.1, letterSpacing: "-0.025em", maxWidth: "22ch" }}
      >
        {title}
      </h2>
      {lead && (
        <p className="text-[var(--text-mid)] mt-5 mb-12" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "62ch" }}>
          {lead}
        </p>
      )}
      {!lead && <div className="mb-12" />}
      {children}
    </section>
  );
}

/**
 * The eligibility checklist.
 *
 * Four real conditions, ticked by the visitor, with a running answer. It is
 * deliberately not a form: nothing is submitted, nothing is stored, and the
 * result is phrased as an indication because the pre-analysis appointment is
 * what actually decides.
 */
function EligibilityCheck() {
  const t = useT();
  const c = t.grant.check;
  const [ticked, setTicked] = useState<Record<string, boolean>>({});
  const count = CHECKS.filter((k) => ticked[k]).length;

  const verdict =
    count === CHECKS.length ? c.all : count === 0 ? c.none : c.some(count);

  return (
    <Section eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <ul className="lg:col-span-7 flex flex-col gap-3">
          {CHECKS.map((k) => {
            const on = !!ticked[k];
            return (
              <li key={k}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTicked((p) => ({ ...p, [k]: !p[k] }))}
                  className={`group flex w-full items-start gap-4 text-left p-5 border transition-colors duration-[var(--dur-1)] ${
                    on
                      ? "border-[var(--positive)]/45 bg-[var(--surface-1)]"
                      : "border-[var(--line)] hover:border-[var(--line-strong)]"
                  }`}
                  style={{ borderRadius: "var(--radius-1)" }}
                >
                  <span
                    aria-hidden="true"
                    className={`grid place-items-center w-5 h-5 shrink-0 mt-0.5 border transition-colors duration-[var(--dur-1)] ${
                      on
                        ? "border-[var(--positive)] bg-[var(--positive)] text-white"
                        : "border-[var(--line-strong)] text-transparent"
                    }`}
                    style={{ borderRadius: "4px" }}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                  <span
                    className={on ? "text-[var(--text-hi)]" : "text-[var(--text-mid)]"}
                    style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
                  >
                    {c.items[k]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className={`lg:col-span-5 p-7 border flex flex-col ${
            count === CHECKS.length
              ? "border-[var(--positive)]/45 bg-[var(--surface-1)]"
              : "border-[var(--line)] bg-[var(--surface-1)]"
          }`}
          style={{ borderRadius: "var(--radius-1)" }}
        >
          <div
            className="eyebrow-mono uppercase text-[var(--text-low)] tabular-nums"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {count} / {CHECKS.length}
          </div>
          <p
            role="status"
            className="text-[var(--text-hi)] mt-4"
            style={{ fontSize: "var(--t-body)", lineHeight: 1.5 }}
          >
            {verdict}
          </p>
          <p className="text-[var(--text-low)] mt-auto pt-6" style={{ fontSize: "var(--t-label)", lineHeight: 1.55 }}>
            {c.caveat}
          </p>
        </div>
      </div>
    </Section>
  );
}

/**
 * The grant slider.
 *
 * Drag a project value, see what comes back and what is left. It is arithmetic
 * on the programme's published rules, not an estimate of anyone's project, so
 * the two edges of the range are labelled rather than hidden: below the floor
 * nothing is due, above the ceiling the aid stops climbing.
 */
function GrantCalculator() {
  const t = useT();
  const localePath = useLocalePath();
  const c = t.grant.calc;
  const [amount, setAmount] = useState(15_000);

  const { grant, net } = useMemo(() => grantFor(amount), [amount]);
  const money = (n: number) => `${n.toLocaleString("de-DE")} €`;

  // A little headroom past the ceiling, so the cap is something you can drag
  // into rather than a number in a footnote.
  const sliderMax = GRANT_MAX + 10_000;
  const filled = ((amount - GRANT_MIN) / (sliderMax - GRANT_MIN)) * 100;

  return (
    <Section eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
      <div
        className="border border-[var(--line)] bg-[var(--surface-1)] p-7 sm:p-10"
        style={{ borderRadius: "var(--radius-1)" }}
      >
        <label className="block">
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {c.project}
          </span>
          <span
            className="block text-[var(--text-hi)] font-medium tabular-nums mt-3"
            style={{ fontSize: "var(--t-h1)", lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            {money(amount)}
          </span>
          <input
            type="range"
            min={GRANT_MIN}
            max={sliderMax}
            step={500}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            aria-label={c.project}
            aria-valuetext={money(amount)}
            className="mt-7 w-full h-1.5 appearance-none cursor-pointer rounded-full bg-[var(--line)] accent-[var(--signal)]"
            style={{
              background: `linear-gradient(to right, var(--signal) ${filled}%, var(--line) ${filled}%)`,
            }}
          />
          <span
            className="flex justify-between eyebrow-mono text-[var(--text-low)] tabular-nums mt-3"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span>{money(GRANT_MIN)}</span>
            <span>{money(sliderMax)}</span>
          </span>
        </label>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="border border-[var(--positive)]/35 p-6"
            style={{ borderRadius: "var(--radius-1)" }}
          >
            <div className="flex items-center gap-2">
              <BadgeEuro className="w-4 h-4 text-[var(--positive)]" strokeWidth={1.5} />
              <span
                className="eyebrow-mono uppercase text-[var(--positive)]"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {c.grant}
              </span>
            </div>
            <div
              className="text-[var(--positive)] font-medium tabular-nums mt-4"
              style={{ fontSize: "var(--t-h1)", lineHeight: 1, letterSpacing: "-0.03em" }}
            >
              {money(grant)}
            </div>
          </div>

          <div className="border border-[var(--line)] p-6" style={{ borderRadius: "var(--radius-1)" }}>
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {c.net}
            </span>
            <div
              className="text-[var(--text-hi)] font-medium tabular-nums mt-4"
              style={{ fontSize: "var(--t-h1)", lineHeight: 1, letterSpacing: "-0.03em" }}
            >
              {money(net)}
            </div>
          </div>
        </div>

        {amount > GRANT_MAX && (
          <p role="status" className="text-[var(--text-mid)] mt-6" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
            {c.capped}
          </p>
        )}

        <a
          href={`${localePath("/")}#pricing`}
          className="group mt-8 inline-flex items-center gap-2 text-[var(--signal-text)] font-medium"
          style={{ fontSize: "var(--t-small)" }}
        >
          {c.cta}
          <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
        </a>
      </div>
    </Section>
  );
}

/** Exported so the prerender can emit FAQPage data from the same strings. */
export { GRANT_CAP, GRANT_RATE };
