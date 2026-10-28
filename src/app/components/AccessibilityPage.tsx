import { useT } from "../../lib/useT";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "../../lib/whatsapp";
import MotionToggle from "./MotionToggle";

/**
 * /accessibility - die Erklaerung zur Barrierefreiheit (seit dem 28.10.2026).
 *
 * Was der European Accessibility Act und EN 301 549 von einem Angebot
 * erwarten, ist eine nachvollziehbare Auskunft: welcher Standard, wie weit er
 * erfuellt ist, was nicht, und wie man ein Problem meldet. Der Text ist eine
 * Selbstbewertung und muss stimmen; aendert sich die Website wesentlich, wird
 * er mit geprueft (siehe CLAUDE.md, Barrierefreiheit).
 *
 * Bewusst schlicht: Ueberschriften in Reihenfolge, Listen als Listen, keine
 * Animation. Der Schalter "Bewegung anhalten" steht hier noch einmal, weil
 * die Seite ihn beschreibt.
 */
export default function AccessibilityPage() {
  const t = useT();
  const a = t.pages.accessibilityPage;
  const container = { maxWidth: "780px", paddingInline: "var(--gutter)" } as const;

  const h2 = "text-[var(--text-hi)] font-medium mt-14 mb-4";
  const h2Style = { fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" } as const;
  const p = "text-[var(--text)] m-0";
  const pStyle = { fontSize: "var(--t-body)", lineHeight: 1.65 } as const;

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">
      <article className="mx-auto" style={{ ...container, paddingBlock: "var(--section-pad)" }}>
        <div
          className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span>{a.eyebrow}</span>
        </div>
        <h1
          className="text-[var(--text-hi)] font-medium mt-8 mb-6"
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
        >
          {a.title}
        </h1>
        <p className="text-[var(--text-mid)] m-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.5 }}>
          {a.intro}
        </p>

        <h2 className={h2} style={h2Style}>{a.standardTitle}</h2>
        <p className={p} style={pStyle}>{a.standard}</p>

        <h2 className={h2} style={h2Style}>{a.statusTitle}</h2>
        <p className={p} style={pStyle}>{a.status}</p>

        <h2 className={h2} style={h2Style}>{a.measuresTitle}</h2>
        <ul className="m-0 pl-5 space-y-2.5 list-disc marker:text-[var(--signal-text)]">
          {a.measures.map((m) => (
            <li key={m} className="text-[var(--text)]" style={pStyle}>{m}</li>
          ))}
        </ul>
        <div className="mt-5">
          <MotionToggle
            variant="text"
            className="h-10 px-4 rounded-full border border-[var(--line-strong)] text-[var(--text-hi)] hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
          />
        </div>

        <h2 className={h2} style={h2Style}>{a.limitsTitle}</h2>
        <ul className="m-0 pl-5 space-y-2.5 list-disc marker:text-[var(--text-low)]">
          {a.limits.map((m) => (
            <li key={m} className="text-[var(--text)]" style={pStyle}>{m}</li>
          ))}
        </ul>

        <h2 className={h2} style={h2Style}>{a.feedbackTitle}</h2>
        <p className={p} style={pStyle}>{a.feedback}</p>
        <dl className="mt-6 border-t border-[var(--line)] m-0">
          {[
            { label: a.emailLabel, value: "contact@deev.lu", href: "mailto:contact@deev.lu" },
            { label: a.phoneLabel, value: WHATSAPP_DISPLAY, href: `tel:+${WHATSAPP_NUMBER}` },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-6 py-4 border-b border-[var(--line)]">
              <dt className="eyebrow-mono uppercase text-[var(--text-low)] pt-1" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                {row.label}
              </dt>
              <dd className="m-0">
                <a href={row.href} className="text-[var(--text-hi)] underline underline-offset-4 decoration-[var(--line-strong)] hover:decoration-[var(--signal-text)]" style={pStyle}>
                  {row.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>

        <h2 className={h2} style={h2Style}>{a.preparedTitle}</h2>
        <p className="text-[var(--text-mid)] m-0" style={pStyle}>{a.prepared}</p>
      </article>
    </main>
  );
}
