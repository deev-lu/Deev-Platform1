import { motion } from "motion/react";
import { ShieldCheck, Lock, Users, CalendarCheck } from "lucide-react";
import CountUp from "./CountUp";

const credentials = [
  { value: "50+", label: "Projects delivered" },
  { value: "100%", label: "On-time delivery" },
  { value: "EU 🇪🇺", label: "Based in Luxembourg" },
  { value: "Senior", label: "Only engineering" },
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "GDPR & data sovereignty",
    description:
      "EU-hosted infrastructure and GDPR-compliant by default. Your data stays in Europe, handled to the standard regulated industries demand.",
  },
  {
    icon: Lock,
    title: "Security-first engineering",
    description:
      "Secure-by-design architecture, dependency auditing, and least-privilege access on every project — not an afterthought bolted on later.",
  },
  {
    icon: Users,
    title: "Senior-only delivery",
    description:
      "You work directly with the engineers building your system. No juniors learning on your budget, no offshore handoffs, no account-manager wall.",
  },
  {
    icon: CalendarCheck,
    title: "Fixed scope, clear milestones",
    description:
      "Defined deliverables, transparent timelines, and milestone-based delivery. You always know what's shipping next — no surprises, no scope drift.",
  },
];

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
  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-white dark:bg-[#08080c] overflow-hidden transition-colors duration-300 border-t border-slate-100 dark:border-white/5">
      {/* Ambient aurora — both themes, so the clear glass has colour to refract */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#0022FF]/[0.07] dark:bg-[#0022FF]/[0.05] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#00C6FF]/[0.09] dark:bg-[#00C6FF]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
            <span className="w-1 h-1 rounded-full bg-[#0022FF]" />
            Why Deev
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
            Engineered to be trusted
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent">
              {" "}with what matters.
            </span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            High-stakes projects need more than good design. They need a partner
            who reduces your risk at every step.
          </p>
        </motion.div>

        {/* Credentials row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 sm:mb-16"
        >
          {credentials.map((c) => (
            <div
              key={c.label}
              className="glass glass-edge text-center rounded-2xl py-6 px-4"
            >
              <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent tracking-tight">
                <CountUp value={c.value} />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-semibold uppercase tracking-wider">
                {c.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Trust pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="glass glass-edge glass-sheen group relative rounded-3xl transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,34,255,0.10)] dark:hover:shadow-[0_0_40px_rgba(0,198,255,0.08)] hover:-translate-y-1"
              >
                <div className="h-[2px] w-full bg-gradient-to-r from-[#0022FF] to-[#00C6FF]" />
                <div className="p-7 flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#0022FF]/[0.07] dark:bg-[#00C6FF]/[0.10] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-6 h-6 text-[#0022FF] dark:text-[#00C6FF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-[#0022FF] dark:group-hover:text-[#00C6FF] transition-colors duration-300">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tech stack badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-5">
            Our production stack
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.10] text-slate-600 dark:text-slate-300"
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
