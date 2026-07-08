import { motion } from "motion/react";
import { Globe, Brain, Zap, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "AI-native products",
    description: "Custom AI agents, copilots, and automations trained on your data — engineered to cut cost and unlock new revenue, not gimmicks.",
  },
  {
    icon: Zap,
    title: "Platforms that scale",
    description: "Robust web apps and SaaS platforms built on modern, production-grade infrastructure — architected to grow from launch to enterprise.",
  },
  {
    icon: Globe,
    title: "Websites that convert",
    description: "High-performance websites built to turn visitors into paying customers — fast, beautiful, and engineered to rank.",
  },
  {
    icon: TrendingUp,
    title: "Growth that performs",
    description: "Data-driven marketing systems, paid ads and SEO strategies that compound your results month over month.",
  },
];

const steps = [
  { number: "01", title: "Understand", description: "We map your business, goals, and market to architect the right solution." },
  { number: "02", title: "Build", description: "Senior engineers ship your product with modern, production-grade tech." },
  { number: "03", title: "Launch", description: "Tested, monitored, and ready to handle real traffic from day one." },
  { number: "04", title: "Scale", description: "Continuous optimisation and support to keep you ahead of the market." },
];

export default function ValueProposition() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-slate-50 dark:bg-[#08080c] overflow-hidden transition-colors duration-300">
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
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-5">
            One senior team across AI, product, web, and growth — so your whole
            digital system is built to work together.
          </p>
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
                <div className="glass glass-edge relative rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,34,255,0.12)] dark:hover:shadow-[0_0_40px_rgba(0,198,255,0.10)] hover:-translate-y-1 cursor-pointer h-full">

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

        {/* Process strip — how we deliver, kept compact */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 sm:mt-20"
        >
          <div className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-8">
            How we deliver
          </div>
          <div className="glass glass-edge relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden">
            {steps.map((step) => (
              <div
                key={step.number}
                className="p-7 transition-colors duration-300 hover:bg-white/40 dark:hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-sm font-extrabold bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent tracking-tight">
                    {step.number}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-[#0022FF]/30 to-transparent" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
