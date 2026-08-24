import { motion } from "motion/react";
import { ShieldCheck, Lock, Users, CalendarCheck } from "lucide-react";
import CountUp from "./CountUp";
import { useT } from "../../lib/useT";

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "OpenAI",
  "Anthropic",
  "Supabase",
  "PostgreSQL",
  "Vercel",
  "AWS",
];

export default function EnterpriseTrust() {
  const t = useT();
  // The icons are structural and stay here; every word comes from the dictionary.
  const ICONS = [ShieldCheck, Lock, Users, CalendarCheck];
  const pillars = t.home.trust.pillars.map((p, i) => ({ ...p, icon: ICONS[i] }));

  return (
    <section className="relative bg-[var(--surface-1)] border-t border-[var(--line)]" style={{ paddingBlock: "var(--section-y)" }}>
      {/* Ambient aurora, both themes, so the clear glass has colour to refract */}

      <div className="relative z-10 mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="text-[var(--metal)]">10</span> / {t.home.trust.eyebrow}
            </span>
          </div>
          <h2
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em", maxWidth: "20ch" }}
          >
            {t.home.trust.title}
          </h2>
          <p
            className="text-[var(--text-mid)] mt-6"
            style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "48ch" }}
          >
            {t.home.trust.lead}
          </p>
        </motion.div>

        {/* Credentials row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10 mb-20"
        >
          {t.home.trust.credentials.map((c) => (
            <div
              key={c.label}
              className="border-t border-[var(--line)] pt-6"
            >
              <div
                className="eyebrow-mono text-[var(--text-hi)]"
                style={{ fontSize: "var(--t-h2)", lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
              >
                <CountUp value={c.value} />
              </div>
              <div
                className="eyebrow-mono uppercase text-[var(--text-low)] mt-4"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {c.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Trust pillars, hairline rows, same treatment as the advantages */}
        <ul className="border-t border-[var(--line)] mb-16">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.li
                key={pillar.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.56, delay: Math.min(index, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="relative grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10 py-7 sm:py-8 border-b border-[var(--line)]"
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 bottom-[-1px] h-px w-full origin-left bg-[var(--signal)]"
                  initial={{ scaleX: 0, opacity: 0.9 }}
                  whileInView={{ scaleX: 1, opacity: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, delay: Math.min(index, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                />
                <Icon className="w-5 h-5 mt-1 text-[var(--metal)]" strokeWidth={1} />
                <div>
                  <h3
                    className="text-[var(--text-hi)] font-medium mb-2"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.01em" }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="text-[var(--text-mid)]"
                    style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "62ch" }}
                  >
                    {pillar.copy}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>

        {/* Tech stack badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-mid)] mb-5">
            {t.home.trust.stackLabel}
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-[2px] text-sm font-semibold bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.10] text-slate-600 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
