import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
  BadgeEuro,
  ArrowRight,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { supabase, supabaseReady } from "../../lib/supabase";
import { sendLeadEmail } from "../../lib/leadEmail";

const INTERESTS = [
  "General enquiry",
  "New website",
  "Web app / SaaS platform",
  "AI project / automation",
  "Lead campaigns / Marketing",
  "Other",
];

const CONTACT_EMAIL = "contact@deev.lu";

type Status = "idle" | "submitting" | "success" | "error";

const initialForm = {
  name: "",
  email: "",
  company: "",
  phone: "",
  interest: INTERESTS[0],
  message: "",
  website: "", // honeypot — humans never see this
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const buildNotes = () =>
    `Source: Contact page\nCompany: ${form.company || "—"}\nPhone: ${
      form.phone || "—"
    }\n\nMessage:\n${form.message}`;

  const mailtoFallback = () => {
    const subject = encodeURIComponent(`Contact — ${form.interest}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${
        form.company || "—"
      }\nPhone: ${form.phone || "—"}\nInterest: ${form.interest}\n\n${
        form.message
      }`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: a filled "website" field means a bot — pretend success, store nothing.
    if (form.website) {
      setStatus("success");
      return;
    }
    setStatus("submitting");

    // 1) Email the submission to contact@deev.lu (primary delivery)
    const emailed = await sendLeadEmail({
      subject: `New contact enquiry — ${form.interest}`,
      from_name: form.name || "Website contact form",
      replyto: form.email,
      name: form.name,
      email: form.email,
      company: form.company || "—",
      phone: form.phone || "—",
      interest: form.interest,
      message: form.message,
    });

    // 2) Best-effort store in Supabase as well
    let stored = false;
    try {
      if (supabaseReady) {
        const { error } = await supabase.from("client_leads").insert({
          name: form.name,
          email: form.email,
          project_type: form.interest,
          notes: buildNotes(),
        });
        stored = !error;
      }
    } catch {
      stored = false;
    }

    if (emailed || stored) {
      setStatus("success");
    } else {
      // Nothing worked — offer the mailto fallback so the lead is never lost.
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06060a] transition-colors duration-300">
      {/* Simple top nav */}
      <div className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/[0.07] bg-white/90 dark:bg-[#06060a]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#0022FF] dark:hover:text-[#00C6FF] transition-colors duration-200 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Deev
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <img src={logo} alt="Deev" className="h-7 w-auto object-contain" />
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent">
              Deev
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
            <span className="w-1 h-1 rounded-full bg-[#0022FF]" />
            Get in touch
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
            Let's talk about
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent">
              {" "}your project.
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Tell us what you're building. We read every message and reply
            personally — usually within one business day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: contact details */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* SME grant card */}
            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-[#08080c] border border-emerald-300/60 dark:border-emerald-500/30">
              <div className="absolute -top-10 -right-8 w-40 h-40 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <BadgeEuro className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider leading-tight">
                    🇱🇺 Up to 70% funded
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Luxembourg SMEs can recover up to <strong>70%</strong> on websites,
                  web-apps, AI and bundled marketing through the{" "}
                  <strong>SME Digital &amp; SME AI</strong> packages. Mention it and
                  we'll structure your project to maximise the grant.
                </p>
                <a
                  href="/#project-builder"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:gap-2.5 transition-all"
                >
                  Estimate your net price
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {[
              {
                icon: Mail,
                label: "Email",
                value: CONTACT_EMAIL,
                href: `mailto:${CONTACT_EMAIL}`,
              },
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: "+352 691 388 887",
                href: "https://api.whatsapp.com/send/?phone=352691388887",
              },
              {
                icon: MapPin,
                label: "Office",
                value: "17, rue de Sélange, L-4965 Clemency, Luxembourg",
              },
              {
                icon: Clock,
                label: "Response time",
                value: "Within 1 business day",
              },
            ].map((item) => {
              const Icon = item.icon;
              const inner = (
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] shadow-sm dark:shadow-none transition-all duration-300 hover:border-[#0022FF]/20 dark:hover:border-white/[0.15]">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-[#0022FF]/[0.07] dark:bg-[#00C6FF]/[0.10] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0022FF] dark:text-[#00C6FF]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      {item.label}
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">
                      {item.value}
                    </div>
                  </div>
                </div>
              );
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block"
                >
                  {inner}
                </a>
              ) : (
                <div key={item.label}>{inner}</div>
              );
            })}
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] overflow-hidden shadow-sm dark:shadow-none">
              <div className="h-[2px] w-full bg-gradient-to-r from-[#0022FF] to-[#00C6FF]" />

              {status === "success" ? (
                <div className="p-10 md:p-14 text-center">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-emerald-500/10 items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Message received.
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
                    Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}. We've
                    logged your enquiry and will get back to you within one
                    business day.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #0022FF 0%, #00C6FF 100%)" }}
                  >
                    Back to homepage
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-7 md:p-9 space-y-5">
                  {/* Honeypot — hidden from users */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Name" required>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your name"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Work email" required>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@company.com"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Company">
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder="Company name"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Phone">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+352 …"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="What can we help with?">
                    <select
                      value={form.interest}
                      onChange={(e) => update("interest", e.target.value)}
                      className={inputCls}
                    >
                      {INTERESTS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Message" required>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell us about your project, goals and timeline…"
                      className={`${inputCls} resize-y min-h-[120px]`}
                    />
                  </Field>

                  {status === "error" && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700 dark:text-amber-300">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        We couldn't submit the form right now.{" "}
                        <button
                          type="button"
                          onClick={mailtoFallback}
                          className="underline font-semibold hover:opacity-80"
                        >
                          Send it by email instead
                        </button>
                        .
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group relative w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,198,255,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    style={{ background: "linear-gradient(135deg, #0022FF 0%, #00C6FF 100%)" }}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                    By submitting, you agree we may contact you about your
                    enquiry. We never share your details.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00C6FF] transition-shadow";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {label}
        {required && <span className="text-[#0022FF] dark:text-[#00C6FF]"> *</span>}
      </span>
      {children}
    </label>
  );
}
