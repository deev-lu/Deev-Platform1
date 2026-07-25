import { motion } from "motion/react";
import { ArrowRight, FileSignature, Receipt, Sparkles, BarChart3 } from "lucide-react";
import billovioShot from "../../assets/work/billovio.jpg";

const FEATURES = [
  { icon: Sparkles, label: "AI proposals from a one-line brief" },
  { icon: FileSignature, label: "In-browser e-signature" },
  { icon: Receipt, label: "Auto-generated invoices + VAT" },
  { icon: BarChart3, label: "Win-rate & pipeline analytics" },
];

export default function BillovioFeature() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#050509] py-16 sm:py-24 md:py-32 border-t border-slate-100 dark:border-white/5">
      {/* Ambient */}
      <div className="absolute top-1/4 -right-40 w-[520px] h-[520px] bg-[#2563F6]/[0.08] dark:bg-[#2563F6]/[0.05] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-[#3CE7FC]/[0.07] dark:bg-[#3CE7FC]/[0.04] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* ── Copy ─────────────────────────────────────────── */}
        <div>
          <div className="eyebrow-mono flex items-center gap-3 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-[#3CE7FC]/70 to-transparent" />
            Our own product
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-slate-900 dark:text-white tracking-tight mb-3">
            We don't just build AI.
            <br />
            We ship it.
          </h2>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-2xl font-medium text-slate-900 dark:text-white">Billovio</span>
            <span className="eyebrow-mono text-[11px] uppercase text-[#2563F6] dark:text-[#3CE7FC]">
              by DEEV
            </span>
          </div>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed mb-8">
            Our own AI SaaS: describe a job in one sentence and Billovio writes
            the scope, prices the work, and takes it all the way to signature and
            invoice — in your brand, in about 30 seconds. Proof of what we build
            for ourselves, and for you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 mb-9">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-md bg-[#2563F6]/[0.08] dark:bg-[#3CE7FC]/[0.10] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#2563F6] dark:text-[#3CE7FC]" />
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{f.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <a
              href="https://www.billovio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-medium text-base text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(37,99,246,0.4)]"
              style={{ background: "linear-gradient(135deg, #2563F6 0%, #3CE7FC 100%)" }}
            >
              Try Billovio free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="https://www.billovio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium text-base text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/[0.12] hover:border-[#2563F6]/50 dark:hover:border-white/25 hover:text-[#2563F6] dark:hover:text-white transition-all duration-300"
            >
              billovio.com
            </a>
          </div>
        </div>

        {/* ── Screenshot ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-[#2563F6]/15 blur-[70px] rounded-full pointer-events-none" />
          <a
            href="https://www.billovio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-lg overflow-hidden border border-slate-200 dark:border-white/[0.10] shadow-[0_30px_80px_rgba(15,23,42,0.14)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          >
            <img
              src={billovioShot}
              alt="Billovio — AI proposal-to-paid platform by DEEV"
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
