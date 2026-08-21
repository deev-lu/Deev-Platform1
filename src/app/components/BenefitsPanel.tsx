import { motion } from "motion/react";
import { Target, LineChart, BrainCircuit, Eye } from "lucide-react";

/**
 * Two-panel value block: a quiet statement on the left, a solid accent panel
 * of concrete benefits on the right. Deliberately square-cornered and
 * high-contrast — the accent carries a whole surface rather than a detail.
 */

const BENEFITS = [
  {
    icon: Target,
    title: "Predictable enquiries",
    copy: "Traffic is directed at a single goal and the path to it is designed, so qualified enquiries arrive steadily instead of by chance.",
  },
  {
    icon: LineChart,
    title: "Measurable outcomes",
    copy: "Every build ships with analytics wired in from day one, so you can see what the work returns rather than take it on faith.",
  },
  {
    icon: BrainCircuit,
    title: "AI where it earns its place",
    copy: "Automation and AI applied to the steps that actually cost you time — not bolted on because the word sells.",
  },
  {
    icon: Eye,
    title: "Full transparency",
    copy: "You talk to the people who design and build your project, and you always know what is being worked on and why.",
  },
];

export default function BenefitsPanel() {
  return (
    <section className="relative bg-white dark:bg-[#06060a] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">

          {/* Left — the statement */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate-100 dark:bg-[#111119] p-9 sm:p-12 flex flex-col justify-center"
          >
            <h2 className="text-[1.75rem] sm:text-[2.1rem] font-medium leading-[1.15] tracking-[-0.02em] text-slate-900 dark:text-white mb-5">
              Digital systems engineered for sustainable growth
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
              We build the whole system, not a single piece of it — the site, the
              product behind it, and the campaigns that feed it. The focus is on
              clear structure, decisions grounded in data, and work whose
              commercial effect can actually be measured.
            </p>
          </motion.div>

          {/* Right — the accent panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="p-9 sm:p-12"
            style={{ background: "var(--signal)" }}
          >
            <h3 className="text-[1.35rem] sm:text-[1.6rem] font-medium text-white mb-8 tracking-[-0.01em]">
              &ldquo;Your advantages at a glance&rdquo;
            </h3>

            <ul className="space-y-6">
              {BENEFITS.map(({ icon: Icon, title, copy }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="shrink-0 w-9 h-9 rounded-[2px] bg-white/15 flex items-center justify-center">
                    <Icon className="w-[18px] h-[18px] text-white" />
                  </span>
                  <div>
                    <div className="text-[15px] font-semibold text-white mb-1">{title}</div>
                    <p className="text-[13.5px] leading-relaxed text-white/80">{copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
