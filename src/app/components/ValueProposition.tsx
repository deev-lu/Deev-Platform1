import { motion } from "motion/react";
import { Globe, Brain, Zap, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "AI-native products",
    description: "AI agents and assistants that actually know your business — answering customers, qualifying leads and handling the busywork your team shouldn't be stuck with.",
  },
  {
    icon: Zap,
    title: "Platforms that scale",
    description: "Web apps and platforms that handle real customers from day one — and keep working just as well when you're ten times busier.",
  },
  {
    icon: Globe,
    title: "Websites that convert",
    description: "Fast, beautiful websites that turn visitors into customers — and that Google actually rewards.",
  },
  {
    icon: TrendingUp,
    title: "Growth that performs",
    description: "Ads, SEO and campaigns that bring you qualified leads — measured properly, so you always know what's working.",
  },
];

const steps = [
  { number: "01", title: "Understand", description: "We start by understanding your business, your goals and what you're up against." },
  { number: "02", title: "Build", description: "We build it ourselves. No handoffs, no outsourcing, no juniors learning on your budget." },
  { number: "03", title: "Launch", description: "Tested and monitored, ready for real customers from the first day it's live." },
  { number: "04", title: "Scale", description: "We stick around — improving, supporting and keeping you ahead." },
];

export default function ValueProposition() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-slate-50 dark:bg-[#08080c] overflow-hidden transition-colors duration-300">
      {/* Ambient aurora — gives the clear glass colour to refract */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2563F6]/[0.07] dark:bg-[#2563F6]/[0.05] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-[#3CE7FC]/[0.09] dark:bg-[#3CE7FC]/[0.04] rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-[#7c3aed]/[0.06] dark:bg-[#7c3aed]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="eyebrow-mono flex items-center justify-center gap-3 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#3CE7FC]/70" />
            01 / What we build
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#3CE7FC]/70" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white tracking-tight">
            Everything your business needs
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#3CE7FC] to-[#2563F6] bg-clip-text text-transparent"> to dominate online.</span>
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
                <div className="glass glass-edge glass-sheen relative rounded-lg transition-all duration-300 hover:shadow-[0_16px_48px_rgba(37,99,246,0.12)] dark:hover:shadow-[0_0_40px_rgba(60,231,252,0.10)] hover:-translate-y-1 cursor-pointer h-full">

                  {/* Gradient top accent — Deev brand */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-[#2563F6] to-[#3CE7FC]" />

                  <div className="p-7">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-md mb-6 flex items-center justify-center bg-[#2563F6]/[0.07] dark:bg-[#3CE7FC]/[0.10] transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-5 h-5 text-[#2563F6] dark:text-[#3CE7FC]" />
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2.5 transition-colors duration-300 group-hover:text-[#2563F6] dark:group-hover:text-[#3CE7FC] leading-snug">
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
          <div className="text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-8">
            How we deliver
          </div>
          <div className="glass glass-edge relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-lg overflow-hidden">
            {steps.map((step) => (
              <div
                key={step.number}
                className="p-7 transition-colors duration-300 hover:bg-white/40 dark:hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-sm font-extrabold bg-gradient-to-r from-[#3CE7FC] to-[#2563F6] bg-clip-text text-transparent tracking-tight">
                    {step.number}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-[#2563F6]/30 to-transparent" />
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
