import { motion } from "motion/react";
import { ArrowLeft, Cookie } from "lucide-react";
import L from "./L";
import { openCookieSettings } from "../../lib/consent";
import { useT, useLocale } from "../../lib/useT";

export default function Legal() {
  const t = useT();
  const g = t.legal;
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06060a] transition-colors duration-300 pt-[68px]">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
              {g.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-slate-900 dark:text-white mb-4 tracking-tight">
              {g.title}{" "}
              <span className=" text-[var(--signal)]">
                {g.titleAccent}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              {g.updated}
            </p>
          </div>

          {/* Company Info Card */}
          <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] overflow-hidden mb-10 dark:shadow-none">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#3CE7FC] to-[#2563F6]" />
            <div className="p-8">
              <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-6">{g.company.heading}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  { label: g.company.tradeName, value: "Deev" },
                  { label: g.company.legalEntity, value: "Lux VR States Sàrl-s." },
                  { label: g.company.directors, value: "FALCHERO Fabio & KETTEL Sven" },
                  { label: g.company.address, value: "17, rue de Sélange, L-4965 Clemency, Luxembourg" },
                  { label: g.company.email, value: "contact@deev.lu" },
                  { label: g.company.phone, value: "+352 691 786 002 / +352 691 388 887" },
                  { label: g.company.vat, value: "LU33936811" },
                  { label: g.company.register, value: "B266033" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-mid)]">
                      {item.label}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

            <Section title={g.s1.title}>
              <p>{g.s1.body}</p>
            </Section>

            <Section title={g.s2.title}>
              <p>{g.s2.body}</p>
            </Section>

            <Section title={g.s3.title}>
              <p>{g.s3.body}</p>
            </Section>

            <Section title={g.s4.title}>
              <p>{g.s4.body}</p>
            </Section>

            <Section title={g.s5.title}>
              <p>{g.s5.body}</p>
            </Section>

            <Section title={g.s6.title}>
              <p>{g.s6.body}</p>
            </Section>

            <Section id="cookies" title={g.cookies.title}>
              <p>{g.cookies.intro}</p>

              <p className="mt-4 font-medium text-slate-900 dark:text-white">{g.cookies.necessaryHead}</p>
              <p className="mt-1">{g.cookies.necessaryBody}</p>
              <CookieTable
                rows={[
                  ["deev_consent", "deev.lu", g.cookies.rowConsent, g.cookies.lifeConsent],
                  ["theme", "deev.lu (local storage)", g.cookies.rowTheme, g.cookies.lifeTheme],
                ]}
              />

              <p className="mt-6 font-medium text-slate-900 dark:text-white">{g.cookies.analyticsHead}</p>
              <p className="mt-1">{g.cookies.analyticsBody}</p>
              <CookieTable
                rows={[
                  ["_ga", "Google Ireland Limited", g.cookies.rowGa, g.cookies.lifeGa],
                  ["_ga_K0T15PZHMN", "Google Ireland Limited", g.cookies.rowGaProperty, g.cookies.lifeGa],
                ]}
              />
              {/* The narrow truth behind Google's user-data acknowledgement:
                  nothing identifying is sent, and nothing is joined to it. */}
              <p className="mt-3">{g.cookies.linking}</p>
              <p className="mt-3">{g.cookies.advertising}</p>

              <p className="mt-6 font-medium text-slate-900 dark:text-white">{g.cookies.videoHead}</p>
              <p className="mt-1">{g.cookies.videoBody}</p>

              <p className="mt-6 font-medium text-slate-900 dark:text-white">{g.cookies.recordHead}</p>
              <p className="mt-1">
                {g.cookies.recordBody1} <code>deev_consent</code> {g.cookies.recordBody2}
              </p>

              <p className="mt-6 font-medium text-slate-900 dark:text-white">{g.cookies.withdrawHead}</p>
              <p className="mt-1">{g.cookies.withdrawBody}</p>
              <button
                type="button"
                onClick={openCookieSettings}
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-md font-medium text-white transition-opacity duration-200 hover:opacity-90 cursor-pointer"
                style={{ background: "var(--signal)" }}
              >
                <Cookie className="w-4 h-4" />
                {g.cookies.manage}
              </button>
            </Section>

            <Section id="data-protection" title={g.gdpr.title}>
              <p>{g.gdpr.body1}</p>
              <p className="mt-3">
                {g.gdpr.body2a}{" "}
                <a href="mailto:contact@deev.lu" className="text-[#2563F6] dark:text-[#3CE7FC] underline underline-offset-2 decoration-[#2563F6]/40 dark:decoration-[#3CE7FC]/40 hover:decoration-current font-medium">
                  contact@deev.lu
                </a>
                {g.gdpr.body2b}
              </p>
            </Section>

            <Section title={g.s9.title}>
              <p>{g.s9.body}</p>
            </Section>

            <Section title={g.s10.title}>
              <p>{g.s10.body}</p>
            </Section>

            <Section title={g.s11.title}>
              <p>{g.s11.body}</p>
              <div className="mt-3 pl-4 border-l-2 border-[#3CE7FC]/50 text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-semibold">Lux VR States Sàrl-s. (Deev)</p>
                <p>17, rue de Sélange, L-4965 Clemency</p>
                <p>Grand Duchy of Luxembourg</p>
                <p>
                  <a href="mailto:contact@deev.lu" className="text-[#2563F6] dark:text-[#3CE7FC] underline underline-offset-2 decoration-[#2563F6]/40 dark:decoration-[#3CE7FC]/40 hover:decoration-current font-medium">
                    contact@deev.lu
                  </a>
                </p>
                <p>+352 691 786 002</p>
              </div>
            </Section>

            {/* A translation is offered for comprehension; the binding text
                stays the one the terms were drafted in. Only rendered on the
                translated versions, where the question actually arises. */}
            {locale !== "en" && (
              <Section title={g.prevails.title}>
                <p>{g.prevails.body}</p>
              </Section>
            )}

          </div>

          {/* Back button */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/[0.07]">
            <L
              to="/"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-md font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--signal)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              {g.back}
            </L>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** name, provider, purpose, lifetime — the four columns a cookie policy owes. */
function CookieTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <ul className="mt-4 border-t border-slate-200 dark:border-white/[0.07]">
      {rows.map(([name, provider, purpose, life]) => (
        <li
          key={name}
          className="grid grid-cols-1 sm:grid-cols-[minmax(0,11rem)_1fr_minmax(0,9rem)] gap-x-6 gap-y-1 py-4 border-b border-slate-200 dark:border-white/[0.07]"
        >
          <code className="text-[0.8rem] text-slate-900 dark:text-white break-all">{name}</code>
          <span className="text-[0.9rem]">
            {purpose}
            <span className="text-[var(--text-mid)]"> · {provider}</span>
          </span>
          <span className="text-[0.8rem] uppercase tracking-wider text-[var(--text-mid)] sm:text-right">
            {life}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] p-8 dark:shadow-none">
      <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h2>
      <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-[0.95rem]">{children}</div>
    </div>
  );
}
