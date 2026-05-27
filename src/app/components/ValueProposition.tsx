import { motion } from "motion/react";
import { Globe, Brain, Zap, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Globe,
    title: "Websites that convert",
    description: "High-performance websites built to turn visitors into paying customers — fast, beautiful, and engineered to rank.",
  },
  {
    icon: Brain,
    title: "AI that works",
    description: "Custom AI agents and automations that solve real business problems, trained on your data, deployed in days.",
  },
  {
    icon: Zap,
    title: "Systems that scale",
    description: "Robust web applications and SaaS platforms built on modern infrastructure — designed to grow with you.",
  },
  {
    icon: TrendingUp,
    title: "Growth that performs",
    description: "Data-driven marketing systems, paid ads and SEO strategies that compound your results month over month.",
  },
];

export default function ValueProposition() {
  return (
    <section className="relative py-24 md:py-36 bg-slate-50 dark:bg-[#08080c] overflow-hidden transition-colors duration-300">
      {/* Background glow — dark only */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] dark:bg-[#0022FF]/[0.05] bg-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
            <span className="w-1 h-1 rounded-full bg-[#0022FF]" />
            What we do
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            Everything your business needs
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent"> to dominate online.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] overflow-hidden transition-all duration-300 hover:border-[#0022FF]/30 dark:hover:border-white/[0.15] hover:shadow-[0_8px_40px_rgba(0,34,255,0.08)] dark:hover:shadow-[0_0_40px_rgba(0,198,255,0.06)] hover:-translate-y-1 cursor-pointer h-full shadow-sm dark:shadow-none">

                  {/* Gradient top accent — Deev brand */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-[#0022FF] to-[#00C6FF]" />

                  <div className="p-7">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl mb-6 flex items-center justify-center bg-[#0022FF]/[0.07] dark:bg-[#00C6FF]/[0.10] transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-5 h-5 text-[#0022FF] dark:text-[#00C6FF]" />
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2.5 transition-colors duration-300 group-hover:text-[#0022FF] dark:group-hover:text-[#00C6FF] leading-snug">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
