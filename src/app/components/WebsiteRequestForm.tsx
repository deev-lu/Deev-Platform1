import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { newRequestId, sendLead } from "../../lib/leadEmail";
import { track } from "../../lib/analytics";
import { INTEREST_KEYS, type InterestKey } from "../../lib/interests";

const CONTACT_EMAIL = "contact@deev.lu";

/**
 * Die Website-Anfrage (seit dem 25.11.2026): drei Felder statt einer
 * Leistungsliste. Wer "Website-Projekt anfragen" klickt, hat sein Anliegen
 * schon gewaehlt und soll es nicht noch einmal aus einem Menue aussuchen.
 *
 * Sichtbar: Name, E-Mail, "Was soll Ihre neue Website koennen?". Der
 * Rueckruf ist eine Option; wer sie waehlt, bekommt das Telefonfeld (dann
 * Pflicht) und muss nichts schreiben. Unternehmen und aktuelle Website
 * stehen hinter einer Ausklappzeile, freiwillig.
 *
 * Zustellung wie im allgemeinen Formular: lib/leadEmail -> /api/lead ->
 * Resend. Erfolg erscheint erst, wenn der Server die Anfrage angenommen
 * hat; vorher bleibt das Formular mit allen Eingaben stehen.
 *
 * Messung (nur mit Einwilligung, lib/analytics): `form_start` bei der
 * ersten Eingabe, `lead_accepted` nach angenommener Uebermittlung,
 * `lead_error` mit dem Grund. Nie Name, Adresse oder Freitext.
 *
 * Seit dem 26.11.2026 (Wunsch des Inhabers) laesst sich trotzdem jede
 * andere Leistung waehlen: "Wobei koennen wir helfen?" steht auf "Neue
 * Website", wenn nichts anderes uebergeben wird. Bei einer anderen Wahl
 * heisst das Textfeld wieder "Nachricht".
 *
 * `reference` ist das Referenzprojekt, von dessen Fallstudie jemand kommt
 * (/contact?interest=website&ref=<slug>); es geht als eigene Zeile mit.
 */
export default function WebsiteRequestForm({
  at,
  reference,
  heading,
  interest: initialInterest = "website",
}: {
  /** The option preselected in "How can we help?". */
  interest?: InterestKey;
  /** Where the form sits, for the measurement: "contact" or "home". */
  at: "contact" | "home";
  reference?: { slug: string; title: string };
  /** Optional visible heading above the fields. */
  heading?: ReactNode;
}) {
  const t = useT();
  const f = t.web.form;
  const c = t.pages.contact.form;
  const uid = useId();
  const [form, setForm] = useState({ name: "", email: "", need: "", phone: "", company: "", site: "", callback: false, website: "", interest: initialInterest as string });
  const interests = t.pages.contact.interests;
  const isWebsite = form.interest === "website";
  const interestLabel = interests[INTEREST_KEYS.indexOf(form.interest as InterestKey)] ?? interests[0];
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const started = useRef(false);
  const requestId = useRef<string | null>(null);
  const done = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") done.current?.focus();
  }, [status]);

  const update = (key: keyof typeof form, value: string | boolean) => {
    if (!started.current && key !== "website") {
      started.current = true;
      track("form_start", { form: "project_request", at, ...(reference ? { ref: reference.slug } : {}) });
    }
    setForm((s) => ({ ...s, [key]: value }));
  };

  const mailtoFallback = () => {
    const subject = encodeURIComponent(`${interestLabel}${reference ? `, ${reference.title}` : ""}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "n/a"}\n${reference ? `Reference: ${reference.title}\n` : ""}\n${form.need}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: Bots bekommen Erfolg und es wird nichts gesendet.
    if (form.website) {
      setStatus("success");
      return;
    }
    if (status === "submitting") return;
    setStatus("submitting");
    const id = requestId.current ?? (requestId.current = newRequestId());
    const result = await sendLead(
      {
        subject: `New project enquiry, ${interestLabel}${reference ? `, like ${reference.title}` : ""}${form.callback ? " (call back)" : ""}`,
        from_name: form.name || "Project request",
        replyto: form.email,
        name: form.name,
        email: form.email,
        phone: form.phone || "n/a",
        company: form.company || "n/a",
        current_website: form.site || "n/a",
        interest: interestLabel,
        ...(reference ? { reference_project: reference.title } : {}),
        ...(form.callback ? { call_back: "Yes, please call back" } : {}),
        message: form.need || "n/a",
      },
      id,
    );
    if (result.ok) {
      requestId.current = null;
      track("lead_accepted", { source: "project_form", interest: form.interest, at, ...(reference ? { ref: reference.slug } : {}) });
      setStatus("success");
    } else {
      track("lead_error", { source: "project_form", interest: form.interest, at, reason: result.status });
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="py-6 text-center">
        <div className="inline-flex w-14 h-14 rounded-full bg-[var(--signal-dim)] items-center justify-center mb-5">
          <CheckCircle2 className="w-7 h-7 text-[var(--signal-text)]" aria-hidden="true" />
        </div>
        <h3 ref={done} tabIndex={-1} className="text-[var(--text-hi)] font-medium outline-none m-0" style={{ fontSize: "var(--t-h3)" }}>
          {t.pages.contact.success.title}
        </h3>
        <p className="text-[var(--text-mid)] mt-3 mb-0 mx-auto" style={{ maxWidth: "40ch" }}>
          {t.pages.contact.success.body(form.name.trim().split(" ")[0] ?? "")}
        </p>
      </div>
    );
  }

  const id = (k: string) => `${uid}-${k}`;

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate={false}>
      {heading}
      <p className="text-xs text-[var(--text-mid)] m-0">{t.site.a11y.requiredNote}</p>

      {reference && (
        <p className="m-0 px-4 py-3 rounded-[var(--radius-1)] bg-[var(--signal-dim)] text-[var(--text-hi)]" style={{ fontSize: "var(--t-small)" }}>
          {f.reference}: <strong className="font-semibold">{reference.title}</strong>
        </p>
      )}

      {/* Honeypot, für Menschen unsichtbar */}
      <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id={id("name")} label={c.name} required>
          <input id={id("name")} type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" placeholder={c.namePlaceholder} className={inputCls} />
        </Field>
        <Field id={id("email")} label={c.email} required>
          <input id={id("email")} type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" inputMode="email" placeholder={c.emailPlaceholder} className={inputCls} />
        </Field>
      </div>

      <Field id={id("interest")} label={c.interest}>
        <select id={id("interest")} value={form.interest} onChange={(e) => update("interest", e.target.value)} className={inputCls}>
          {INTEREST_KEYS.map((k, i) => (
            <option key={k} value={k}>
              {interests[i]}
            </option>
          ))}
        </select>
      </Field>

      <Field id={id("need")} label={isWebsite ? f.need : c.message} required={!form.callback}>
        <textarea
          id={id("need")}
          required={!form.callback}
          rows={4}
          value={form.need}
          onChange={(e) => update("need", e.target.value)}
          placeholder={isWebsite ? f.needPlaceholder : c.messagePlaceholder}
          className={`${inputCls} resize-y min-h-[112px]`}
        />
      </Field>

      <div className="flex flex-col gap-4">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.callback} onChange={(e) => update("callback", e.target.checked)} className="mt-1 w-4 h-4 accent-[#2563F6]" />
          <span className="text-[var(--text)]" style={{ fontSize: "var(--t-small)" }}>{f.callback}</span>
        </label>
        {form.callback && (
          <Field id={id("phone")} label={f.phone} required>
            <input id={id("phone")} type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" inputMode="tel" placeholder={c.phonePlaceholder} className={inputCls} />
          </Field>
        )}
      </div>

      <details className="group">
        <summary className="cursor-pointer text-[var(--text-mid)] hover:text-[var(--text-hi)] underline underline-offset-4 decoration-[var(--line-strong)]" style={{ fontSize: "var(--t-small)" }}>
          {f.more}
        </summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
          <Field id={id("company")} label={f.company}>
            <input id={id("company")} type="text" value={form.company} onChange={(e) => update("company", e.target.value)} autoComplete="organization" className={inputCls} />
          </Field>
          <Field id={id("site")} label={f.currentSite}>
            <input id={id("site")} type="text" value={form.site} onChange={(e) => update("site", e.target.value)} autoComplete="url" inputMode="url" placeholder="www." className={inputCls} />
          </Field>
        </div>
      </details>

      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 p-4 rounded-[var(--radius-1)] bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700 dark:text-amber-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            {c.errorLead}{" "}
            <button type="button" onClick={mailtoFallback} className="underline font-semibold hover:opacity-80">
              {c.errorAction}
            </button>
            .
          </div>
        </div>
      )}

      {/* Knopf und Antwortzeit gehoeren zusammen: wer absendet, soll wissen,
          wann er etwas hoert. */}
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-grad inline-flex items-center justify-center gap-2.5 w-full px-7 text-white font-semibold rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ height: 56, fontSize: "var(--t-body)" }}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              {c.submitting}
            </>
          ) : (
            <>
              {f.submit}
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="m-0 text-center text-[var(--text)]" style={{ fontSize: "var(--t-small)" }}>
          {f.reply}
        </p>
      </div>

      <p className="m-0 text-xs text-center text-[var(--text-mid)]">
        {c.consent}{" "}
        <L to="/legal#data-protection" className="underline underline-offset-2 hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]">
          {c.consentLink}
        </L>
      </p>
    </form>
  );
}

const inputCls =
  "w-full px-4 py-3.5 rounded-[var(--radius-1)] bg-[var(--surface-0)] border border-[var(--line-control)] text-[var(--text-hi)] placeholder:text-[var(--text-low)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-text)] transition-shadow";

function Field({ id, label, required, children }: { id: string; label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-[var(--text-hi)] mb-2" style={{ fontSize: "var(--t-small)" }}>
        {label}
        {required && (
          <span className="text-[var(--signal-text)]" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
