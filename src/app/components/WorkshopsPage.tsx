import { useEffect, useRef, useState } from "react";
import { motion, type MotionProps } from "motion/react";
import { ArrowRight, CheckCircle2, Loader2, AlertCircle, CalendarClock } from "lucide-react";
import L from "./L";
import { TwoTone } from "./Plate";
import { useT } from "../../lib/useT";
import { mark } from "../../lib/i18nMark";
import { newRequestId, sendLead } from "../../lib/leadEmail";
import { track } from "../../lib/analytics";
import { BOOKING_URL } from "../../lib/booking";
import { scrollToId } from "../../lib/smoothScroll";
import photo from "../../assets/photos/gelle-fra-900.webp";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * /workshops - Workshops und Beratung als eigene Seite (seit dem 24.10.2026).
 *
 * Der Workshop ist der Einstieg in die meisten Projekte und die Leistung, die
 * am leichtesten zu kaufen ist. Bisher fuehrte "Workshop buchen" auf das
 * allgemeine Kontaktformular, ohne passende Auswahl, und es gab keine Seite,
 * auf die eine Anzeige oder ein Beitrag zeigen konnte.
 *
 * Inhalt: nur, was die Startseite (home.workshops), die KI-Seite (home.ai)
 * und der Workshop-Artikel schon sagen. Keine Preise, keine Dauer: die stehen
 * nirgends und gehoeren ins Gespraech.
 *
 * Unten ein eigenes, kurzes Anfrageformular, damit niemand die Seite
 * verlassen muss. Gibt es einen Buchungslink (lib/booking.ts), steht daneben
 * "Termin waehlen".
 */
export default function WorkshopsPage() {
  const t = useT();
  const reduce = useReduceMotion();
  const w = t.home.workshops;
  const ai = t.home.ai;
  const p = t.pages.workshopsPage;

  const rise = (i = 0) =>
    ({
      initial: { opacity: 0, y: reduce ? 0 : 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-60px" },
      transition: { duration: reduce ? 0 : 0.45, delay: reduce ? 0 : i * 0.05, ease: [0.16, 1, 0.3, 1] as const },
    }) satisfies MotionProps;

  const label = (text: string, n?: string) => (
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

  const container = { maxWidth: "var(--container)", paddingInline: "var(--gutter)" } as const;

  return (
    <main className="min-h-screen pt-[68px]">
      {/* ── Hero: dieselbe tiefblaue Flaeche wie auf der Startseite ───────── */}
      <section className="md:px-2 lg:px-3 md:pt-2">
        <div
          data-surface="dark"
          className="dark relative overflow-hidden md:rounded-[28px]"
          style={{ background: "radial-gradient(120% 90% at 0% 0%, #12307f 0%, #0b1a4a 38%, #070b1c 100%)" }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1.2px)", backgroundSize: "18px 18px" }}
          />
          <div className="relative mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-12 items-end" style={{ ...container, paddingBlock: "var(--section-y)" }}>
            <div className="lg:col-span-7 min-w-0">
              <div
                className="flex items-center gap-4 eyebrow-mono uppercase text-[#c7dcff]/80"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                <span className="h-px w-10 bg-white/25" />
                <span>{w.eyebrow}</span>
              </div>
              <h1
                className="text-[var(--text-hi)] font-medium mt-8"
                style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "16ch" }}
              >
                <TwoTone text={w.title} />
              </h1>
              <p className="text-[var(--text)] mt-7 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.5, maxWidth: "52ch" }}>
                {w.lead}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-10">
                <a
                  href="#request"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId("request");
                  }}
                  className="m-arrow inline-flex items-center justify-center gap-2.5 px-6 text-white font-semibold hover:brightness-110 transition-[filter] duration-[var(--dur-1)]"
                  style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)", background: "linear-gradient(100deg, #4c8dff, #2563f6)" }}
                >
                  {p.formLabel}
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </a>
                {BOOKING_URL && (
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium transition-colors duration-[var(--dur-1)]"
                    style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)" }}
                  >
                    <CalendarClock className="w-4 h-4" strokeWidth={1.5} />
                    {p.bookingCta}
                  </a>
                )}
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative overflow-hidden aspect-[4/5] border border-white/10" style={{ borderRadius: "var(--radius-2)" }}>
                <img
                  src={photo}
                  alt={w.photoAlt}
                  width={900}
                  height={1125}
                  decoding="async"
                  className="m-grade absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Drei Formate ─────────────────────────────────────────────────── */}
      <section className="mx-auto" style={{ ...container, paddingTop: "var(--section-y)" }}>
        {label(p.formatsLabel, "01")}
        <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 m-0 p-0">
          {w.offers.map((o, i) => (
            <motion.li
              key={o.title}
              {...rise(i)}
              className="card-glow list-none border border-[var(--line)] bg-[var(--surface-1)] p-7"
              style={{ borderRadius: "var(--radius-2)" }}
            >
              <span className="eyebrow-mono text-[var(--signal-text)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                0{i + 1}
              </span>
              <h2 className="display text-[var(--text-hi)] mt-4 mb-0" style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.015em" }}>
                {o.title}
              </h2>
              <p className="text-[var(--text-mid)] mt-3 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
                {o.copy}
              </p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ── Ablauf ───────────────────────────────────────────────────────── */}
      <section className="mx-auto" style={{ ...container, paddingTop: "var(--section-y)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10">
          <div className="lg:col-span-5">
            {label(p.methodLabel, "02")}
            <h2 className="text-[var(--text-hi)] font-medium mt-8" style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "16ch" }}>
              <TwoTone text={p.methodTitle} />
            </h2>
          </div>
          <ol className="lg:col-span-7 border-t border-[var(--line)] m-0 p-0">
            {ai.method.map((m, i) => (
              <motion.li key={m.title} {...rise(i)} className="list-none grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 py-6 border-b border-[var(--line)]">
                <span className="eyebrow-mono text-[var(--signal-text)] pt-1" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  0{i + 1}
                </span>
                <div>
                  <h3 className="display text-[var(--text-hi)] m-0" style={{ fontSize: "1.25rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                    {m.title}
                  </h3>
                  <p className="text-[var(--text-mid)] mt-2 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "60ch" }}>
                    {m.copy}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ergebnis und Beleg ───────────────────────────────────────────── */}
      <section className="mx-auto" style={{ ...container, paddingTop: "var(--section-y)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card-glow border border-[var(--line)] bg-[var(--surface-1)] p-7 sm:p-9" style={{ borderRadius: "var(--radius-2)" }}>
            {label(p.deliverablesLabel, "03")}
            <h2 className="text-[var(--text-hi)] font-medium mt-6" style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.015em" }}>
              {p.deliverablesTitle}
            </h2>
            <ul className="mt-6 space-y-3 m-0 p-0">
              {p.deliverables.map((d) => (
                <li key={d} className="list-none flex items-start gap-3 text-[var(--text-hi)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.5 }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[var(--signal-text)]" strokeWidth={1.5} />
                  {d}
                </li>
              ))}
            </ul>
            <p className="text-[var(--text-mid)] mt-6 mb-0" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
              {p.honest}
            </p>
          </div>
          <div className="border border-[var(--line)] p-7 sm:p-9 flex flex-col" style={{ borderRadius: "var(--radius-2)" }}>
            {label(ai.exampleLabel)}
            <p className="text-[var(--text-hi)] mt-6 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.45 }}>
              {ai.example}
            </p>
            <ul className="mt-6 space-y-2.5 m-0 p-0">
              {ai.exampleBullets.map((b) => (
                <li key={b} className="list-none flex items-start gap-3 text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.5 }}>
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--signal-text)] shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <div className="pt-6 border-t border-[var(--line)]">
                <div className="eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  {ai.fundingLabel}
                </div>
                <p className="text-[var(--text-mid)] mt-3 mb-0" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
                  {mark(ai.funding, "text-[var(--text-hi)] font-medium")}{" "}
                  <L to="/sme-packages" className="text-[var(--signal-text)] underline underline-offset-2">
                    {t.site.nav.funding}
                  </L>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fragen ───────────────────────────────────────────────────────── */}
      <section className="mx-auto" style={{ ...container, paddingTop: "var(--section-y)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8">
          <div className="lg:col-span-4">{label(p.faqLabel, "04")}</div>
          <dl className="lg:col-span-8 border-t border-[var(--line)] m-0">
            {p.faq.map((f) => (
              <div key={f.q} className="py-6 border-b border-[var(--line)]">
                <dt className="display text-[var(--text-hi)]" style={{ fontSize: "1.1875rem", lineHeight: 1.25 }}>
                  {f.q}
                </dt>
                <dd className="text-[var(--text-mid)] mt-2 mb-0 ml-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "62ch" }}>
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Anfrage ──────────────────────────────────────────────────────── */}
      <section id="request" className="mx-auto scroll-mt-24" style={{ ...container, paddingBlock: "var(--section-y)" }}>
        <WorkshopRequest />
      </section>
    </main>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-[var(--radius-1)] bg-[var(--surface-0)] border border-[var(--line-control)] text-[var(--text-hi)] placeholder:text-[var(--text-low)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-text)]";

/** Das kurze Anfrageformular. Dieselbe Strecke wie /contact (sendLead). */
function WorkshopRequest() {
  const t = useT();
  const p = t.pages.workshopsPage;
  const f = t.pages.contact.form;
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", processes: "", website: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const requestId = useRef<string | null>(null);
  // The form is replaced by the confirmation; focus follows it there instead
  // of dropping to the page (WCAG 2.4.3, 4.1.3).
  const done = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (status === "success") done.current?.focus();
  }, [status]);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return setStatus("success"); // Honeypot
    if (status === "submitting") return;
    setStatus("submitting");
    const id = requestId.current ?? (requestId.current = newRequestId());
    const result = await sendLead(
      {
        subject: `Workshop request${form.company ? `, ${form.company}` : ""}`,
        from_name: form.name || "Workshop request",
        replyto: form.email,
        name: form.name,
        email: form.email,
        company: form.company || "n/a",
        phone: form.phone || "n/a",
        interest: "Workshop / consulting",
        processes: form.processes || "n/a",
      },
      id,
    );
    setStatus(result.ok ? "success" : "error");
    if (result.ok) {
      track("lead_accepted", { source: "workshops" });
      requestId.current = null;
    } else track("lead_error", { source: "workshops", reason: result.status });
  };

  const mailto = () => {
    const body = encodeURIComponent(`${form.name}\n${form.email}\n${form.company}\n${form.phone}\n\n${form.processes}`);
    window.location.href = `mailto:contact@deev.lu?subject=${encodeURIComponent("Workshop request")}&body=${body}`;
  };

  return (
    <div className="card-glow grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10 border border-[var(--line)] bg-[var(--surface-1)] p-7 sm:p-10" style={{ borderRadius: "var(--radius-3)" }}>
      <div className="lg:col-span-5">
        <div className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span>{p.formLabel}</span>
        </div>
        <h2 className="text-[var(--text-hi)] font-medium mt-8" style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "14ch" }}>
          {p.formTitle}
        </h2>
        <p className="text-[var(--text-mid)] mt-5 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "40ch" }}>
          {p.formLead}
        </p>
        {BOOKING_URL && (
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[var(--line-strong)] text-[var(--text-hi)] hover:bg-[var(--surface-0)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)" }}
          >
            <CalendarClock className="w-4 h-4" strokeWidth={1.5} />
            {p.bookingCta}
          </a>
        )}
      </div>

      <div className="lg:col-span-7">
        {status === "success" ? (
          <div role="status" className="h-full flex flex-col items-start justify-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-[var(--positive)]" strokeWidth={1.5} />
            <h3 ref={done} tabIndex={-1} className="text-[var(--text-hi)] font-medium m-0 outline-none" style={{ fontSize: "var(--t-h3)" }}>{p.successTitle}</h3>
            <p className="text-[var(--text-mid)] m-0">{p.successBody}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p className="sm:col-span-2 text-xs text-[var(--text-mid)] m-0">{t.site.a11y.requiredNote}</p>
            <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden="true" />
            <Field label={f.name} required>
              <input required value={form.name} onChange={set("name")} placeholder={f.namePlaceholder} className={inputCls} autoComplete="name" />
            </Field>
            <Field label={f.email} required>
              <input required type="email" value={form.email} onChange={set("email")} placeholder={f.emailPlaceholder} className={inputCls} autoComplete="email" />
            </Field>
            <Field label={f.company}>
              <input value={form.company} onChange={set("company")} placeholder={f.companyPlaceholder} className={inputCls} autoComplete="organization" />
            </Field>
            <Field label={f.phone}>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder={f.phonePlaceholder} className={inputCls} autoComplete="tel" />
            </Field>
            <div className="sm:col-span-2">
              <Field label={p.processes}>
                <textarea rows={3} value={form.processes} onChange={set("processes")} placeholder={p.processesPlaceholder} className={`${inputCls} resize-y`} />
              </Field>
            </div>

            {status === "error" && (
              <div role="alert" className="sm:col-span-2 flex items-start gap-3 p-4 rounded-[var(--radius-1)] bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700 dark:text-amber-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  {f.errorLead}{" "}
                  <button type="button" onClick={mailto} className="underline font-semibold">
                    {f.errorAction}
                  </button>
                  .
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full inline-flex items-center justify-center gap-2 h-[52px] px-6 text-white font-semibold disabled:opacity-60"
                style={{ borderRadius: "var(--radius-pill)", background: "var(--signal)", fontSize: "var(--t-small)" }}
              >
                {status === "submitting" ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {status === "submitting" ? f.submitting : p.submit}
              </button>
              <p className="text-xs text-[var(--text-mid)] mt-3 mb-0">
                {f.consent}{" "}
                <L to="/legal#data-protection" className="underline underline-offset-2 hover:text-[var(--text-hi)]">
                  {f.consentLink}
                </L>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[var(--text-hi)] mb-2">
        {label}
        {required && <span className="text-[var(--signal-text)]" aria-hidden="true"> *</span>}
      </span>
      {children}
    </label>
  );
}
