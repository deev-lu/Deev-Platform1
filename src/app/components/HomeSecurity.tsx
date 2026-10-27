import { ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import L from "./L";
import { TwoTone } from "./Plate";
import { useT } from "../../lib/useT";

/**
 * 03 auf der Startseite: Cybersecurity und NIS2 (seit dem 27.10.2026).
 *
 * Eine Leistung im Bereich Awareness: Schulungen fuer Teams und
 * Geschaeftsleitung und ein erster NIS2-Check, verantwortet von Noah Stelmes.
 *
 * Was hier ueber NIS2 steht, steht in der Richtlinie selbst (EU 2022/2555,
 * Art. 20 Abs. 2, Art. 21 Abs. 2 lit. d und g) und wird mit Artikel zitiert.
 * Bewusst nichts zur luxemburgischen Umsetzung: Daten, Fristen und
 * Zustaendigkeiten waren beim Schreiben in den Quellen widerspruechlich, und
 * eine falsche Frist auf einer Sicherheitsseite waere der teuerste Fehler.
 * Der Hinweis "keine Rechtsberatung" steht unter der Uebersicht.
 *
 * Die Phishing-Mail ist erfunden und als Beispiel gekennzeichnet; die Domain
 * ist absichtlich eine Faelschung (eine Null statt eines o).
 */
export default function HomeSecurity() {
  const t = useT();
  const s = t.home.security;

  return (
    <section
      id="cybersecurity"
      aria-labelledby="security-title"
      className="bg-[var(--surface-0)]"
      style={{ paddingBlock: "var(--section-pad)" }}
    >
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-14"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <div className="lg:col-span-7 min-w-0">
          <div
            className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span>
              <span className="text-[var(--metal)]">03</span> / {s.eyebrow}
            </span>
          </div>
          <h2
            id="security-title"
            className="text-[var(--text-hi)] font-medium mt-8"
            style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "16ch" }}
          >
            <TwoTone text={s.title} />
          </h2>
          <p className="text-[var(--text-mid)] mt-7 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "52ch" }}>
            {s.lead}
          </p>

          <ol className="mt-10 border-t border-[var(--line)] m-0 p-0">
            {s.offers.map((o, i) => (
              <li key={o.title} className="list-none grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 py-6 border-b border-[var(--line)]">
                <span className="eyebrow-mono text-[var(--signal-text)] pt-1" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  0{i + 1}
                </span>
                <div>
                  <h3 className="display text-[var(--text-hi)] m-0" style={{ fontSize: "1.25rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                    {o.title}
                  </h3>
                  <p className="text-[var(--text-mid)] mt-2 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "60ch" }}>
                    {o.copy}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-10">
            <L
              to="/contact?interest=security"
              className="group inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-full bg-[var(--signal)] text-white font-medium"
              style={{ fontSize: "var(--t-small)" }}
            >
              {s.primary}
              <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
            </L>
            <L
              to="/about"
              className="inline-flex items-center justify-center h-[52px] px-6 rounded-full border border-[var(--line-strong)] text-[var(--text-hi)] font-medium hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-small)" }}
            >
              {s.secondary}
            </L>
          </div>
          <p className="eyebrow-mono uppercase text-[var(--text-low)] mt-5 mb-0" style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}>
            {s.ledBy}
          </p>
        </div>

        <div className="lg:col-span-5 min-w-0 flex flex-col gap-4">
          <PhishingExample />

          {/* NIS2 auf einen Blick: nur die Richtlinie, mit Artikel. */}
          <div
            data-surface="dark"
            className="dark p-7 border border-[var(--line)]"
            style={{ borderRadius: "var(--radius-2)", background: "linear-gradient(160deg, #0d1733 0%, #070b1c 100%)" }}
          >
            <div className="flex items-center gap-2.5 eyebrow-mono uppercase text-[#7faeff]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              {s.glanceLabel}
            </div>
            <dl className="mt-5 m-0">
              {s.glance.map((g) => (
                <div key={g.ref} className="py-4 border-t border-white/10 first:border-t-0 first:pt-2">
                  <dt className="eyebrow-mono text-[#3ce7fc]" style={{ fontSize: "0.6875rem", letterSpacing: "0.08em" }}>
                    {g.ref}
                  </dt>
                  <dd className="m-0 mt-1.5 text-[var(--text-hi)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.5 }}>
                    {g.text}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-[var(--text-low)] mt-4 pt-4 mb-0 border-t border-white/10" style={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
              {s.glanceSource}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Eine erfundene Phishing-Mail mit den drei Warnzeichen, als Beispiel gekennzeichnet. */
function PhishingExample() {
  const t = useT();
  const m = t.home.security.mock;
  return (
    <div className="border border-[var(--line)] bg-[var(--surface-1)] p-5" style={{ borderRadius: "var(--radius-2)" }}>
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
          {m.label}
        </span>
        <span
          className="eyebrow-mono uppercase px-2 py-0.5 border border-[var(--line)] text-[var(--text-low)]"
          style={{ fontSize: "0.5625rem", letterSpacing: "0.14em", borderRadius: 999 }}
        >
          {t.home.workshops.illustrative}
        </span>
      </div>
      <div className="mt-4 p-4 border border-[var(--line)] bg-[var(--surface-0)]" style={{ borderRadius: "var(--radius-1)" }}>
        <div className="eyebrow-mono text-[var(--text-mid)] truncate" style={{ fontSize: "0.6875rem" }}>
          {m.from}
        </div>
        <div className="text-[var(--text-hi)] font-medium mt-1.5" style={{ fontSize: "0.9375rem" }}>
          {m.subject}
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2 m-0 p-0">
        {m.flags.map((f) => (
          <li
            key={f}
            className="list-none inline-flex items-center gap-1.5 px-2.5 py-1 border border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300"
            style={{ fontSize: "0.75rem", borderRadius: 999 }}
          >
            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
