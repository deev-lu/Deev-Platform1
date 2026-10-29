import { motion, type MotionProps } from "motion/react";
import { ArrowRight } from "lucide-react";
import L from "./L";
import { TwoTone } from "./Plate";
import { useT } from "../../lib/useT";
import { TEAM } from "../../lib/team";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "../../lib/whatsapp";
import placeWide from "../../assets/photos/philharmonie-1200.webp";
import placeNarrow from "../../assets/photos/philharmonie-700.webp";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * /about - wer wir sind (seit dem 24.10.2026).
 *
 * Oben die Menschen, dann wie wir arbeiten, dann die Firma mit ihren Fakten.
 * Die Grundsaetze wiederholen nur, was die Seite schon verspricht (Startseite,
 * KI-Seite, Projektphasen); nichts Neues wird behauptet.
 *
 * Die Portraets sind Freisteller, also object-contain und unten ausgerichtet
 * auf einer Flaechenstufe, nie beschnitten (wie auf der Startseite). Fehlt ein
 * Foto - Noah, bis es da ist -, stehen dort seine Initialen: ein typografischer
 * Platzhalter, kein erfundenes Gesicht. Das Foto erscheint, sobald `noah.*` in
 * src/assets/team liegt (lib/team.ts).
 */
export default function AboutPage() {
  const t = useT();
  const reduce = useReduceMotion();
  const a = t.pages.aboutPage;
  const c = t.home.company;

  const rise = (i = 0) =>
    ({
      initial: { opacity: 0, y: reduce ? 0 : 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-60px" },
      transition: { duration: reduce ? 0 : 0.45, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
    }) satisfies MotionProps;

  const container = { maxWidth: "var(--container)", paddingInline: "var(--gutter)" } as const;
  const eyebrow = (text: string, n?: string) => (
    <div
      className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
    >
      <span className="h-px w-10 bg-[var(--line-strong)]" />
      <span>
        {n && <span className="text-[var(--metal)]">{n} / </span>}
        {text}
      </span>
    </div>
  );

  const facts = [
    { label: c.labels.company, value: c.entity },
    { label: c.labels.office, value: c.office },
    { label: c.labels.languages, value: c.languages },
    { label: a.phone, value: WHATSAPP_DISPLAY, href: `tel:+${WHATSAPP_NUMBER}` },
    { label: a.email, value: "contact@deev.lu", href: "mailto:contact@deev.lu" },
  ];

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">
      {/* ── Kopf ─────────────────────────────────────────────────────────── */}
      <header className="mx-auto" style={{ ...container, paddingTop: "var(--section-y)" }}>
        {eyebrow(a.eyebrow)}
        <h1
          className="text-[var(--text-hi)] font-medium mt-8"
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "18ch" }}
        >
          <TwoTone text={a.title} />
        </h1>
        <p className="text-[var(--text-mid)] mt-7 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "56ch" }}>
          {c.lead}
        </p>
      </header>

      {/* ── Das Team ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="team-title" className="mx-auto" style={{ ...container, paddingTop: "var(--section-y)" }}>
        {eyebrow(a.teamLabel, "01")}
        <h2
          id="team-title"
          className="text-[var(--text-hi)] font-medium mt-6"
          style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "20ch" }}
        >
          {a.teamTitle}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 m-0 p-0">
          {TEAM.map((m, i) => (
            <motion.li
              key={m.key}
              {...rise(i)}
              className="list-none overflow-hidden border border-[var(--line)] bg-[var(--surface-1)]"
              style={{ borderRadius: "var(--radius-2)" }}
            >
              <div className="relative aspect-[4/5] bg-[var(--surface-2)] flex items-end justify-center overflow-hidden">
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={`${m.name}, ${a.roles[m.role]}`}
                    width={800}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain object-bottom"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center font-brand text-[var(--text-low)]"
                    style={{ fontSize: "clamp(3.5rem, 2rem + 4vw, 6rem)", letterSpacing: "-0.04em" }}
                  >
                    {m.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                )}
              </div>
              <div className="px-6 py-5 border-t border-[var(--line)]">
                <div className="display text-[var(--text-hi)]" style={{ fontSize: "1.25rem", letterSpacing: "-0.01em" }}>
                  {m.name}
                </div>
                <div
                  className="eyebrow-mono uppercase text-[var(--text-low)] mt-1.5"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}
                >
                  {a.roles[m.role]}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* ── Wie wir arbeiten ─────────────────────────────────────────────── */}
      <section aria-labelledby="principles-title" className="mx-auto" style={{ ...container, paddingTop: "var(--section-y)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10">
          <div className="lg:col-span-5">
            {eyebrow(a.principlesLabel, "02")}
            <h2
              id="principles-title"
              className="text-[var(--text-hi)] font-medium mt-6"
              style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "14ch" }}
            >
              {a.principlesTitle}
            </h2>
          </div>
          <ol className="lg:col-span-7 border-t border-[var(--line)] m-0 p-0">
            {a.principles.map((p, i) => (
              <motion.li key={p.title} {...rise(i)} className="list-none grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 py-6 border-b border-[var(--line)]">
                <span className="eyebrow-mono text-[var(--signal-text)] pt-1" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  0{i + 1}
                </span>
                <div>
                  <h3 className="display text-[var(--text-hi)] m-0" style={{ fontSize: "1.25rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                    {p.title}
                  </h3>
                  <p className="text-[var(--text-mid)] mt-2 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "60ch" }}>
                    {p.copy}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Die Firma ────────────────────────────────────────────────────── */}
      <section aria-labelledby="company-title" className="mx-auto" style={{ ...container, paddingTop: "var(--section-y)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10 items-start">
          <div className="lg:col-span-5">
            {eyebrow(a.factsLabel, "03")}
            <h2
              id="company-title"
              className="text-[var(--text-hi)] font-medium mt-6"
              style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "14ch" }}
            >
              <TwoTone text={c.title} />
            </h2>
            <dl className="mt-10 border-t border-[var(--line)] m-0">
              {facts.map((f) => (
                <div key={f.label} className="grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)] gap-x-6 gap-y-1 py-4 border-b border-[var(--line)]">
                  <dt className="eyebrow-mono uppercase text-[var(--text-low)] sm:pt-1" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                    {f.label}
                  </dt>
                  <dd className="m-0 text-[var(--text-hi)]" style={{ fontSize: "var(--t-body)" }}>
                    {f.href ? (
                      <a href={f.href} className="hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]">
                        {f.value}
                      </a>
                    ) : (
                      f.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] aspect-[4/5] lg:aspect-[5/4]" style={{ borderRadius: "var(--radius-2)" }}>
              <img
                src={placeWide}
                srcSet={`${placeNarrow} 700w, ${placeWide} 1200w`}
                sizes="(min-width: 1024px) 55vw, 100vw"
                alt={c.photoAlt}
                width={1200}
                height={1476}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "saturate(0.8) contrast(1.04)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Einladung ────────────────────────────────────────────────────── */}
      <section className="mx-auto" style={{ ...container, paddingBlock: "var(--section-y)" }}>
        <div className="border-t border-[var(--line)] pt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <h2 className="text-[var(--text-hi)] font-medium m-0" style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              {t.home.closing.title}
            </h2>
            <p className="text-[var(--text-mid)] mt-4 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "52ch" }}>
              {t.home.closing.lead}
            </p>
          </div>
          <L
            to="/contact?interest=call"
            className="group shrink-0 inline-flex items-center gap-2 h-[52px] px-6 rounded-full bg-[var(--signal)] text-white font-medium"
            style={{ fontSize: "var(--t-small)" }}
          >
            {t.home.intro.primary}
            <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
          </L>
        </div>
      </section>
    </main>
  );
}
