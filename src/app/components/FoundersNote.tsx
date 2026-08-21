import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import fabioPhoto from "../../assets/team/fabio.jpg";
import svenPhoto from "../../assets/team/sven.jpg";

const FOUNDERS = [
  { name: "Fabio Falchero", role: "Founder & CEO", photo: fabioPhoto },
  { name: "Sven Kettel", role: "Founder & CEO", photo: svenPhoto },
];

/**
 * "Who you'll work with" — the human counterweight to the system sections.
 * Two real faces, a direct note, and a straight line to a conversation.
 */
export default function FoundersNote() {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-[#08080c] py-16 sm:py-24 md:py-28 border-t border-slate-100 dark:border-white/5">

      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,420px)] gap-12 lg:gap-16 items-center">
        {/* ── The note ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow-mono flex items-center gap-3 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-[#3CE7FC]/70 to-transparent" />
            Who you'll work with
          </div>

          <p className="text-xl sm:text-2xl md:text-[1.65rem] font-medium text-slate-900 dark:text-white leading-[1.4] tracking-tight mb-6">
            “There's no sales team here. When you write to DEEV, you reach the
            two people who actually design and build your project — and you keep
            that line until launch day.”
          </p>

          <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-xl">
            We're a small, senior studio in Luxembourg. That's deliberate: fewer
            projects, run properly, by the people whose names are on them.
          </p>

          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 text-base font-medium text-[#2563F6] dark:text-[#3CE7FC] hover:opacity-70 transition-opacity"
          >
            Talk to us directly
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* ── The founders ─────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-5 sm:gap-6">
          {FOUNDERS.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <img
                src={f.photo}
                alt={`${f.name}, ${f.role} at DEEV`}
                loading="lazy"
                decoding="async"
                className="relative w-full aspect-[4/5] object-cover rounded-lg ring-1 ring-slate-200 dark:ring-white/10 "
              />
              <div className="relative mt-3.5">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {f.name}
                </div>
                <div className="eyebrow-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 mt-0.5">
                  {f.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
