import { motion } from "motion/react";
import { Search, Hammer, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Understand",
    description: "We deep-dive into your business, goals, and market to architect the perfect solution — no guesswork.",
  },
  {
    icon: Hammer,
    number: "02",
    title: "Build",
    description: "Our team crafts your solution with cutting-edge tech and meticulous attention to detail and performance.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Launch",
    description: "We deploy with zero drama — tested, monitored, and ready to handle real traffic from day one.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Scale",
    description: "Continuous optimisation, support, and iteration to keep your product ahead of the competition.",
  },
];

export default function Process() {
  return (
    <section className="relative py-24 md:py-36 bg-slate-50 dark:bg-[#06060a] overflow-hidden transition-colors duration-300">
      {/* Background glows — dark only */}
      <div className="hidden dark:block absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00C6FF]/[0.05] rounded-full blur-[130px] pointer-events-none" />
      <div className="hidden dark:block absolute right-0 top-1/3 w-[400px] h-[400px] bg-[#0022FF]/[0.05] rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
            <span className="w-1 h-1 rounded-full bg-[#0022FF]" />
            How we work
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
            Our Process
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            A proven methodology that delivers results, every single time.
          </p>
        </motion.div>

        {/* Desktop: Horizontal */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/[0.10] to-transparent" />

            <div className="grid grid-cols-4 gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.12 }}
                    className="group relative flex flex-col items-center"
                  >
                    {/* Gradient ring badge — Deev brand */}
                    <div className="relative w-[104px] h-[104px] rounded-full p-[2px] bg-gradient-to-br from-[#0022FF] to-[#00C6FF] mb-8 z-10">
                      <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#0a0a12] flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-white dark:group-hover:bg-[#0e0e18]">
                        <Icon className="w-6 h-6 text-[#0022FF] dark:text-[#00C6FF] mb-1" />
                        <span className="text-xs font-bold text-slate-400 dark:text-white/30 tracking-wider">{step.number}</span>
                      </div>
                    </div>

                    {/* Card */}
                    <div className="relative w-full rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] overflow-hidden transition-all duration-500 hover:border-[#0022FF]/25 dark:hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,34,255,0.08)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] shadow-sm dark:shadow-none">
                      <div className="h-[2px] w-full bg-gradient-to-r from-[#0022FF] to-[#00C6FF]" />
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-[#0022FF] dark:group-hover:text-[#00C6FF] transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Vertical */}
        <div className="lg:hidden space-y-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] overflow-hidden transition-all duration-300 hover:border-[#0022FF]/25 dark:hover:border-white/[0.15] shadow-sm dark:shadow-none">
                  <div className="h-[2px] w-full bg-gradient-to-r from-[#0022FF] to-[#00C6FF]" />
                  <div className="p-6 flex items-start gap-5">
                    <div className="shrink-0 w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-[#0022FF] to-[#00C6FF]">
                      <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#0a0a12] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#0022FF] dark:text-[#00C6FF]" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300 dark:text-white/25 tracking-widest uppercase mb-1">{step.number}</div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-[#0022FF] dark:group-hover:text-[#00C6FF] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
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
