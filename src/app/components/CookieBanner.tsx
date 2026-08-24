import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { Check, X } from "lucide-react";
import {
  CONSENT_MAX_AGE_DAYS,
  CONSENT_OPEN_EVENT,
  CONSENT_VERSION,
  type ConsentRecord,
  getConsent,
  onConsentChange,
  save,
  withdrawConsent,
} from "../../lib/consent";
import { pauseSmoothScroll, resumeSmoothScroll } from "../../lib/smoothScroll";

/**
 * Consent banner and preferences dialog.
 *
 * First-party: no third-party consent platform, so nothing about a visitor
 * leaves the site in order to ask them whether anything may leave the site.
 *
 * What it does, beyond the two buttons it replaces:
 *   - Accept and reject carry equal weight on the first layer, which is what
 *     the EDPB and the CNPD ask for. "Customise" is the third, quieter option.
 *   - Consent is stored per category, so a script can be gated on its own.
 *   - The record keeps a consent id and a timestamp: that is the proof of
 *     consent, and the dialog shows it back to the visitor.
 *   - It expires after twelve months, and a bump of CONSENT_VERSION re-asks,
 *     so a changed policy cannot ride on an old agreement.
 *   - Every cookie the site can set is named in the dialog, with its provider,
 *     purpose and lifetime. Nothing is described that we do not actually set.
 *
 * The dialog is reachable for the life of the site from the footer link and
 * from the policy page, which is the withdrawal route GDPR Article 7(3)
 * requires to be as easy as giving consent in the first place.
 */

type Row = { name: string; provider: string; purpose: string; life: string };

const NECESSARY: Row[] = [
  {
    name: "deev_consent",
    provider: "deev.lu",
    purpose: "Stores your cookie choices and the record of them (id and date).",
    life: "12 months",
  },
  {
    name: "theme",
    provider: "deev.lu",
    purpose: "Remembers whether you chose the light or the dark appearance.",
    life: "Until cleared",
  },
];

const ANALYTICS: Row[] = [
  {
    name: "_ga",
    provider: "Google Ireland Limited",
    purpose: "Distinguishes one visitor from another so visits can be counted.",
    life: "2 years",
  },
  {
    name: "_ga_K0T15PZHMN",
    provider: "Google Ireland Limited",
    purpose: "Keeps the state of the current visit for this property.",
    life: "2 years",
  },
];

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export default function CookieBanner() {
  const reduce = useReducedMotion();
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  // ── initial read ────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = getConsent();
    setRecord(stored);
    setAnalytics(stored?.categories.analytics ?? false);
    if (!stored) {
      const t = setTimeout(() => setShowBanner(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  // ── open from anywhere: footer link, policy page ────────────────────────
  useEffect(() => {
    const open = () => {
      restoreFocusTo.current = document.activeElement as HTMLElement | null;
      const stored = getConsent();
      setRecord(stored);
      setAnalytics(stored?.categories.analytics ?? false);
      setShowPrefs(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  // ── follow the record if something else changes it ───────────────────────
  useEffect(
    () =>
      onConsentChange((r) => {
        setRecord(r);
        setAnalytics(r?.categories.analytics ?? false);
        if (!r) setShowBanner(true);
      }),
    [],
  );

  // ── dialog: scroll lock, escape, focus trap ─────────────────────────────
  useEffect(() => {
    if (!showPrefs) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pauseSmoothScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPrefs(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("button")?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.body.style.overflow = previousOverflow;
      resumeSmoothScroll();
      restoreFocusTo.current?.focus?.();
    };
  }, [showPrefs]);

  const decide = useCallback((allowAnalytics: boolean, method: "accept-all" | "reject-all" | "custom") => {
    const r = save(allowAnalytics, method);
    setRecord(r);
    setAnalytics(allowAnalytics);
    setShowBanner(false);
    setShowPrefs(false);
  }, []);

  const openPrefs = () => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    setShowPrefs(true);
  };

  const fade = { duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <>
      {/* ── Layer 1: the banner ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showBanner && !showPrefs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={fade}
            role="dialog"
            aria-modal="false"
            aria-labelledby="consent-title"
            className="fixed z-[60] bottom-5 left-5 right-5 sm:right-auto sm:max-w-[440px]"
          >
            <div
              className="border border-[var(--line-strong)] bg-[var(--surface-1)] p-7"
              style={{ borderRadius: "var(--radius-1)" }}
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="h-px w-8 bg-[var(--line-strong)]" />
                <span
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  Cookies
                </span>
              </div>

              <h2
                id="consent-title"
                className="text-[var(--text-hi)] font-medium mb-3"
                style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
              >
                Your choice, on the record.
              </h2>

              <p
                className="text-[var(--text-mid)] mb-7"
                style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
              >
                We set what the site needs to work. With your consent we also
                measure how it is used, so we can improve it. You can change or
                withdraw this at any time.{" "}
                <Link to="/legal" className="text-[var(--signal-text)] underline underline-offset-2 decoration-[var(--signal-text)]/40 hover:decoration-[var(--signal-text)]">
                  Cookie &amp; privacy policy
                </Link>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => decide(false, "reject-all")}
                  className="h-11 px-5 border border-[var(--line-strong)] text-[var(--text-hi)] hover:border-[var(--text-low)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  Reject non-essential
                </button>
                <button
                  type="button"
                  onClick={() => decide(true, "accept-all")}
                  className="h-11 px-5 bg-[var(--signal)] text-white hover:opacity-90 transition-opacity duration-[var(--dur-1)] cursor-pointer"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  Accept all
                </button>
              </div>

              <button
                type="button"
                onClick={openPrefs}
                className="eyebrow-mono uppercase mt-5 text-[var(--text-low)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                Customise
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Layer 2: preferences ────────────────────────────────────────── */}
      <AnimatePresence>
        {showPrefs && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.24 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowPrefs(false)}
              aria-hidden="true"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="consent-prefs-title"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : 24 }}
              transition={fade}
              className="relative w-full sm:max-w-[720px] max-h-[92vh] overflow-y-auto border border-[var(--line-strong)] bg-[var(--surface-0)]"
              style={{ borderRadius: "var(--radius-1)" }}
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-6 px-7 sm:px-9 pt-8 pb-6 bg-[var(--surface-0)] border-b border-[var(--line)]">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="h-px w-8 bg-[var(--line-strong)]" />
                    <span
                      className="eyebrow-mono uppercase text-[var(--text-low)]"
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      Cookie preferences
                    </span>
                  </div>
                  <h2
                    id="consent-prefs-title"
                    className="text-[var(--text-hi)] font-medium"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
                  >
                    What you allow, category by category.
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrefs(false)}
                  aria-label="Close cookie preferences"
                  className="shrink-0 w-10 h-10 flex items-center justify-center border border-[var(--line)] text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                  style={{ borderRadius: "var(--radius-1)" }}
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              <div className="px-7 sm:px-9 py-8">
                <Category
                  title="Strictly necessary"
                  copy="Needed for the site to work and to remember this very choice. These cannot be switched off, and they are never used to profile you."
                  rows={NECESSARY}
                  locked
                  on
                />
                <Category
                  title="Analytics"
                  copy="Google Analytics 4, used to count visits and see which pages are read. Until you allow it, the tag runs in a consent-denied state: no cookies, no identifier, only an aggregate signal."
                  rows={ANALYTICS}
                  on={analytics}
                  onChange={setAnalytics}
                />

                {/* The record itself, shown back to the person who gave it. */}
                <div className="mt-10 pt-7 border-t border-[var(--line)]">
                  <div
                    className="eyebrow-mono uppercase text-[var(--text-low)] mb-4"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    Your consent record
                  </div>
                  {record ? (
                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3">
                      <Field label="Given" value={fmtDate(record.at)} />
                      <Field label="Reference" value={record.id} mono />
                      <Field
                        label="Expires"
                        value={fmtDate(
                          new Date(new Date(record.at).getTime() + CONSENT_MAX_AGE_DAYS * 864e5).toISOString(),
                        )}
                      />
                    </dl>
                  ) : (
                    <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)" }}>
                      Nothing recorded yet. Analytics stays denied until you choose.
                    </p>
                  )}
                  <p
                    className="text-[var(--text-low)] mt-4"
                    style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
                  >
                    Policy version {CONSENT_VERSION}. We ask again after twelve
                    months, or sooner if the policy changes. Full detail in the{" "}
                    <Link to="/legal" className="text-[var(--signal-text)] underline underline-offset-2 decoration-[var(--signal-text)]/40 hover:decoration-[var(--signal-text)]">
                      cookie &amp; privacy policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 flex flex-col sm:flex-row gap-3 px-7 sm:px-9 py-6 bg-[var(--surface-0)] border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => decide(false, "reject-all")}
                  className="h-11 px-5 border border-[var(--line-strong)] text-[var(--text-hi)] hover:border-[var(--text-low)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  Reject non-essential
                </button>
                <button
                  type="button"
                  onClick={() => decide(analytics, "custom")}
                  className="h-11 px-5 border border-[var(--line-strong)] text-[var(--text-hi)] hover:border-[var(--text-low)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  Save my choices
                </button>
                <button
                  type="button"
                  onClick={() => decide(true, "accept-all")}
                  className="h-11 px-5 sm:ml-auto bg-[var(--signal)] text-white hover:opacity-90 transition-opacity duration-[var(--dur-1)] cursor-pointer"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  Accept all
                </button>
                {record && (
                  <button
                    type="button"
                    onClick={() => {
                      withdrawConsent();
                      setShowPrefs(false);
                      setShowBanner(true);
                    }}
                    className="eyebrow-mono uppercase h-11 px-2 text-[var(--text-low)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt
        className="eyebrow-mono uppercase text-[var(--text-low)] mb-1"
        style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
      >
        {label}
      </dt>
      <dd
        className={`text-[var(--text-mid)] break-all ${mono ? "eyebrow-mono" : ""}`}
        style={{ fontSize: "var(--t-small)" }}
      >
        {value}
      </dd>
    </div>
  );
}

function Category({
  title,
  copy,
  rows,
  on,
  locked,
  onChange,
}: {
  title: string;
  copy: string;
  rows: Row[];
  on: boolean;
  locked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <section className="border-t border-[var(--line)] pt-7 mt-7 first:mt-0 first:border-0 first:pt-0">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3
            className="text-[var(--text-hi)] font-medium mb-2"
            style={{ fontSize: "var(--t-body)", letterSpacing: "-0.01em" }}
          >
            {title}
          </h3>
          <p
            className="text-[var(--text-mid)]"
            style={{ fontSize: "var(--t-small)", lineHeight: 1.55, maxWidth: "62ch" }}
          >
            {copy}
          </p>
        </div>

        {locked ? (
          <span
            className="shrink-0 eyebrow-mono uppercase inline-flex items-center gap-2 h-8 px-3 border border-[var(--line)] text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", borderRadius: "var(--radius-1)" }}
          >
            <Check className="w-3.5 h-3.5" strokeWidth={2} />
            Always on
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={`${title} cookies`}
            onClick={() => onChange?.(!on)}
            className="shrink-0 relative w-[52px] h-8 border transition-colors duration-[var(--dur-1)] cursor-pointer"
            style={{
              borderRadius: "var(--radius-1)",
              borderColor: on ? "var(--signal)" : "var(--line-strong)",
              background: on ? "var(--signal)" : "transparent",
            }}
          >
            <span
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-[var(--dur-1)]"
              style={{
                left: on ? 26 : 4,
                borderRadius: "var(--radius-1)",
                background: on ? "#ffffff" : "var(--line-strong)",
              }}
            />
          </button>
        )}
      </div>

      <ul className="mt-6 border-t border-[var(--line)]">
        {rows.map((r) => (
          <li
            key={r.name}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,10rem)_1fr_minmax(0,9rem)] gap-x-6 gap-y-1 py-4 border-b border-[var(--line)]"
          >
            <span
              className="eyebrow-mono text-[var(--text-hi)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.06em" }}
            >
              {r.name}
            </span>
            <span className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.5 }}>
              {r.purpose}
              <span className="text-[var(--text-low)]"> · {r.provider}</span>
            </span>
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)] sm:text-right"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {r.life}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
