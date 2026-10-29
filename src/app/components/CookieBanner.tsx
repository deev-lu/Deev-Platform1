import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import L from "./L";
import { useT, useLocale } from "../../lib/useT";
import type { Dict } from "../../locales";
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
import { useReduceMotion } from "../../lib/motionPref";
import { focusablesIn, useModal } from "../../lib/useModal";

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

/** Names, providers and ids are facts and never translate; what a cookie is
 *  for and how long it lives are copy and do. */
const rowsFor = (t: Dict) => ({
  necessary: [
    { name: "deev_consent", provider: "deev.lu", purpose: t.consent.cookies.consent, life: t.consent.cookies.months12 },
    { name: "theme", provider: "deev.lu", purpose: t.consent.cookies.theme, life: t.consent.cookies.untilCleared },
    // Klar Access, the accessibility menu (public/klar-access/): only written
    // once a visitor changes a setting there.
    { name: "klar-access:v1", provider: "deev.lu", purpose: t.consent.cookies.klar, life: t.consent.cookies.untilCleared },
  ] as Row[],
  analytics: [
    { name: "_ga", provider: "Google Ireland Limited", purpose: t.consent.cookies.ga, life: t.consent.cookies.years2 },
    { name: "_ga_K0T15PZHMN", provider: "Google Ireland Limited", purpose: t.consent.cookies.gaProperty, life: t.consent.cookies.years2 },
  ] as Row[],
});

const fmtDate = (iso: string, locale: string) => {
  try {
    return new Date(iso).toLocaleString(locale, {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export default function CookieBanner() {
  const t = useT();
  const locale = useLocale();
  const ROWS = rowsFor(t);
  const fmt = (iso: string) => fmtDate(iso, locale);
  const reduce = useReduceMotion();
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

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

  // ── dialog: scroll lock; focus in, trapped, Escape, focus back (useModal) ──
  useEffect(() => {
    if (!showPrefs) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pauseSmoothScroll();
    return () => {
      document.body.style.overflow = previousOverflow;
      resumeSmoothScroll();
    };
  }, [showPrefs]);
  // Opened from the banner, the dialog hides the banner's "Customise" button.
  // If that is not back when the dialog closes, focus goes to the banner's
  // first visible button, or to the start of the page once a choice is made,
  // instead of falling to <body>.
  useModal(dialogRef, showPrefs, () => setShowPrefs(false), () => {
    const banner = document.querySelector<HTMLElement>('[aria-labelledby="consent-title"]');
    return (banner && focusablesIn(banner)[0]) || document.getElementById("main");
  });

  // While the bar shows, focused elements scroll into view above it rather
  // than behind it (WCAG 2.4.11; fonts.css reads --fixed-bottom).
  useEffect(() => {
    const el = bannerRef.current;
    if (!showBanner || showPrefs || !el) return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => root.style.setProperty("--fixed-bottom", `${el.offsetHeight + 24}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--fixed-bottom");
    };
  }, [showBanner, showPrefs]);

  const decide = useCallback((allowAnalytics: boolean, method: "accept-all" | "reject-all" | "custom") => {
    const r = save(allowAnalytics, method);
    setRecord(r);
    setAnalytics(allowAnalytics);
    setShowBanner(false);
    setShowPrefs(false);
  }, []);

  const openPrefs = () => setShowPrefs(true);

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
            ref={bannerRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="consent-title"
            className="fixed z-[60] bottom-0 inset-x-0 sm:bottom-4 sm:left-4 sm:right-[96px]"
          >
            {/* Seit dem 24.10.2026 eine schmale Leiste statt einer Karte: die
                Karte lag beim ersten Besuch ueber Titel und Knoepfen des Hero,
                also ueber dem Angebot selbst. Die Leiste belegt nur den
                unteren Rand. Ablehnen und Annehmen bleiben gleich gewichtet. */}
            <div
              className="mx-auto max-w-[1180px] border-t sm:border border-[var(--line-strong)] bg-[var(--surface-1)] pl-5 pr-[96px] py-4 sm:px-6 sm:py-4 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] rounded-t-[20px] sm:rounded-[20px]"
            >
              <p
                id="consent-title"
                className="m-0 flex-1 text-[var(--text-mid)]"
                style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}
              >
                <span className="text-[var(--text-hi)] font-medium">{t.consent.banner.title}</span>{" "}
                {t.consent.banner.body}{" "}
                <L to="/legal" className="text-[var(--signal-text)] underline underline-offset-2 decoration-[var(--signal-text)]/40 hover:decoration-[var(--signal-text)]">
                  {t.consent.banner.policyLink}
                </L>
              </p>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={openPrefs}
                  className="hidden sm:inline-flex eyebrow-mono uppercase h-10 px-2 items-center text-[var(--text-low)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}
                >
                  {t.consent.banner.customise}
                </button>
                <button
                  type="button"
                  onClick={() => decide(false, "reject-all")}
                  className="flex-1 sm:flex-none h-10 px-4 border border-[var(--line-strong)] text-[var(--text-hi)] hover:border-[var(--text-low)] transition-colors duration-[var(--dur-1)] cursor-pointer whitespace-nowrap"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)" }}
                >
                  {t.consent.banner.reject}
                </button>
                <button
                  type="button"
                  onClick={() => decide(true, "accept-all")}
                  className="flex-1 sm:flex-none h-10 px-5 bg-[var(--signal)] text-white hover:opacity-90 transition-opacity duration-[var(--dur-1)] cursor-pointer whitespace-nowrap"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)" }}
                >
                  {t.consent.banner.accept}
                </button>
              </div>
              <button
                type="button"
                onClick={openPrefs}
                className="sm:hidden self-start eyebrow-mono uppercase text-[var(--text-low)] hover:text-[var(--text-hi)] cursor-pointer"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}
              >
                {t.consent.banner.customise}
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
              className="relative w-full sm:max-w-[720px] max-h-[92vh] overflow-y-auto overscroll-contain border border-[var(--line-strong)] bg-[var(--surface-0)]"
              style={{ borderRadius: "var(--radius-1)" }}
              // Lenis ist waehrend des Dialogs gestoppt, und ein gestopptes
              // Lenis verwirft jedes Radereignis per preventDefault - auch
              // das, mit dem jemand diesen Kasten scrollen will. Die Markierung
              // wird vorher geprueft, also scrollt der Browser hier wieder
              // selbst, waehrend die Seite dahinter weiter stillsteht.
              data-lenis-prevent
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-6 px-7 sm:px-9 pt-8 pb-6 bg-[var(--surface-0)] border-b border-[var(--line)]">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="h-px w-8 bg-[var(--line-strong)]" />
                    <span
                      className="eyebrow-mono uppercase text-[var(--text-low)]"
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      {t.consent.prefs.eyebrow}
                    </span>
                  </div>
                  <h2
                    id="consent-prefs-title"
                    className="text-[var(--text-hi)] font-medium"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
                  >
                    {t.consent.prefs.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrefs(false)}
                  aria-label={t.consent.prefs.close}
                  className="shrink-0 w-10 h-10 flex items-center justify-center border border-[var(--line)] text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                  style={{ borderRadius: "var(--radius-1)" }}
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              <div className="px-7 sm:px-9 py-8">
                <Category
                  title={t.consent.prefs.necessary.title}
                  copy={t.consent.prefs.necessary.copy}
                  rows={ROWS.necessary}
                  locked
                  on
                  alwaysOn={t.consent.prefs.always}
                  switchLabel={t.consent.prefs.necessary.title}
                />
                <Category
                  title={t.consent.prefs.analytics.title}
                  copy={t.consent.prefs.analytics.copy}
                  rows={ROWS.analytics}
                  on={analytics}
                  onChange={setAnalytics}
                  alwaysOn={t.consent.prefs.always}
                  switchLabel={t.consent.prefs.analytics.title}
                />

                {/* The record itself, shown back to the person who gave it. */}
                <div className="mt-10 pt-7 border-t border-[var(--line)]">
                  <div
                    className="eyebrow-mono uppercase text-[var(--text-low)] mb-4"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {t.consent.prefs.recordLabel}
                  </div>
                  {record ? (
                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3">
                      <Field label={t.consent.prefs.given} value={fmt(record.at)} />
                      <Field label={t.consent.prefs.reference} value={record.id} mono />
                      <Field
                        label={t.consent.prefs.expires}
                        value={fmt(
                          new Date(new Date(record.at).getTime() + CONSENT_MAX_AGE_DAYS * 864e5).toISOString(),
                        )}
                      />
                    </dl>
                  ) : (
                    <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)" }}>
                      {t.consent.prefs.none}
                    </p>
                  )}
                  <p
                    className="text-[var(--text-low)] mt-4"
                    style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
                  >
                    {t.consent.prefs.version(CONSENT_VERSION)}{" "}
                    <L to="/legal" className="text-[var(--signal-text)] underline underline-offset-2 decoration-[var(--signal-text)]/40 hover:decoration-[var(--signal-text)]">
                      {t.consent.prefs.policyLink}
                    </L>
                    .
                  </p>
                </div>
              </div>

              {/* Rechts frei fuer den Knopf von Klar Access unten rechts, solange der
                  Dialog bis in diese Ecke reicht (unter 1024px). */}
              <div className="sticky bottom-0 flex flex-col sm:flex-row gap-3 pl-7 sm:pl-9 pr-[96px] lg:pr-9 py-6 bg-[var(--surface-0)] border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => decide(false, "reject-all")}
                  className="h-11 px-5 border border-[var(--line-strong)] text-[var(--text-hi)] hover:border-[var(--text-low)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  {t.consent.banner.reject}
                </button>
                <button
                  type="button"
                  onClick={() => decide(analytics, "custom")}
                  className="h-11 px-5 border border-[var(--line-strong)] text-[var(--text-hi)] hover:border-[var(--text-low)] transition-colors duration-[var(--dur-1)] cursor-pointer"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  {t.consent.prefs.save}
                </button>
                <button
                  type="button"
                  onClick={() => decide(true, "accept-all")}
                  className="h-11 px-5 sm:ml-auto bg-[var(--signal)] text-white hover:opacity-90 transition-opacity duration-[var(--dur-1)] cursor-pointer"
                  style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
                >
                  {t.consent.banner.accept}
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
                    {t.consent.prefs.withdraw}
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
  alwaysOn,
  switchLabel,
}: {
  title: string;
  copy: string;
  rows: Row[];
  on: boolean;
  locked?: boolean;
  onChange?: (v: boolean) => void;
  alwaysOn: string;
  switchLabel: string;
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
            {alwaysOn}
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={switchLabel}
            onClick={() => onChange?.(!on)}
            className="shrink-0 relative w-[52px] h-8 border transition-colors duration-[var(--dur-1)] cursor-pointer"
            style={{
              borderRadius: "var(--radius-1)",
              borderColor: on ? "var(--signal)" : "var(--line-control)",
              background: on ? "var(--signal)" : "transparent",
            }}
          >
            <span
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-[var(--dur-1)]"
              style={{
                left: on ? 26 : 4,
                borderRadius: "var(--radius-1)",
                background: on ? "#ffffff" : "var(--line-control)",
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
