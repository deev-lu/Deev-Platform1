import { motion } from "motion/react";
import { TrendingUp, Target, Zap, BarChart3 } from "lucide-react";
import GrowingMetrics from "./GrowingMetrics";
import FloatingTech3D from "./FloatingTech3D";

const services = [
  {
    icon: Target,
    title: "Paid Advertising",
    description: "Google Ads, Meta Ads, LinkedIn - optimized for maximum ROI",
    features: ["Campaign Strategy", "A/B Testing", "Conversion Tracking"],
  },
  {
    icon: TrendingUp,
    title: "SEO & Content",
    description: "Rank higher, attract more qualified leads organically",
    features: ["Technical SEO", "Content Strategy", "Link Building"],
  },
  {
    icon: Zap,
    title: "Conversion Optimization",
    description: "Turn more visitors into customers with data-driven CRO",
    features: ["Landing Pages", "User Testing", "Analytics"],
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Clear insights and transparent reporting on what matters",
    features: ["Custom Dashboards", "ROI Tracking", "Performance Reports"],
  },
];

export default function DigitalMarketing() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-white dark:bg-[#08080c] overflow-hidden transition-colors duration-300">
      {/* 3D Floating Elements */}
      <FloatingTech3D />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
            <span className="w-1 h-1 rounded-full bg-[#2563F6]" />
            Digital Growth
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white mb-6 tracking-tight">
            Drive Real Results with{" "}
            <span className=" text-[var(--signal)]">
              Data-Driven Marketing
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            We don't just run ads. We build high-performance marketing systems that
            scale your business profitably.
          </p>
        </motion.div>

        {/* Growing Metrics */}
        <div className="mb-12 sm:mb-20">
          <GrowingMetrics />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 sm:mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] overflow-hidden transition-all duration-500 hover:bg-slate-50 dark:hover:bg-white/[0.07] hover:border-[#2563F6]/20 dark:hover:border-white/[0.15] dark:hover:shadow-none hover:-translate-y-1 dark:shadow-none">
                  <div className="h-[2px] w-full bg-gradient-to-r from-[#2563F6] to-[#3CE7FC]" />
                  <div className="p-8">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#2563F6]/[0.08] to-[#3CE7FC]/[0.05] flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                      <Icon className="w-7 h-7 text-[#2563F6] dark:text-[#3CE7FC]" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-3 transition-colors duration-300 group-hover:text-[#2563F6] dark:group-hover:text-[#3CE7FC]">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2563F6]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center p-10 md:p-16 rounded-lg overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-transparent"
          style={{ background: undefined }}
        >
          {/* Glow */}
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Ready to scale your growth?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto text-lg">
              Let's audit your current marketing and show you exactly where we can move the needle.
            </p>
            <button
              onClick={() => document.getElementById("project-builder")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative inline-flex items-center gap-2 px-9 py-4 rounded-lg font-medium text-base text-white overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: "var(--signal)" }}
            >
              Get Free Marketing Audit
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3CE7FC] to-[#2563F6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
