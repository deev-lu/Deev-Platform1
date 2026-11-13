import { ArrowRight, Check } from "lucide-react";
import L from "./L";
import { TwoTone } from "./Plate";
import { useT } from "../../lib/useT";
import shotDark from "../../assets/hub/hub-pipeline-dark.webp";
import shotLight from "../../assets/hub/hub-pipeline-light.webp";

/**
 * /business-hub - die oeffentliche Seite des Business Hub (seit dem
 * 13.11.2026): das CRM mit KI-Agenten fuer Immobilienmakler, die erste
 * Zielgruppe. Die App selbst liegt unter /hub (hub.html, eigenes Bundle);
 * deshalb fuehren die Knoepfe mit <a> dorthin, nicht ueber den Router der
 * Website.
 *
 * Inhalt: nur, was der Hub heute kann. Keine Preise (es gibt noch keine),
 * "frueher Zugang" so, wie die App es auch sagt. Das Bild ist ein echter
 * Screenshot der Demo, deren Beispieldaten erfunden sind (so beschriftet).
 */
export default function BusinessHubPage() {
  const t = useT();
  const h = t.pages.hubPage;
  const container = { maxWidth: "var(--container)", paddingInline: "var(--gutter)" } as const;

  const eyebrow = (text: string) => (
    <div className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
      <span className="h-px w-10 bg-[var(--line-strong)]" />
      <span>{text}</span>
    </div>
  );

  const buttons = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <a
        href="/hub/sign-up"
        className="btn-grad m-arrow inline-flex items-center justify-center gap-2.5 px-7 text-white font-semibold rounded-full"
        style={{ height: 54, fontSize: "var(--t-small)" }}
      >
        {h.signUp}
        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
      </a>
      <a
        href="/hub/demo"
        className="btn-ghost inline-flex items-center justify-center gap-2.5 px-7 rounded-full font-medium"
        style={{ height: 54, fontSize: "var(--t-small)" }}
      >
        {h.demo}
      </a>
    </div>
  );

  return (
    <main className="min-h-screen pt-[68px]">
      {/* Hero */}
      <section style={{ paddingBlock: "calc(var(--section-pad) * 1.25) var(--section-pad)" }}>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 items-center" style={container}>
          <div className="lg:col-span-6 min-w-0">
            {eyebrow(h.eyebrow)}
            <h1
              className="text-[var(--text-hi)] font-medium mt-8 mb-0"
              style={{ fontSize: "clamp(2.25rem, 1.3rem + 3.4vw, 4.25rem)", lineHeight: 1.03, letterSpacing: "-0.03em" }}
            >
              <TwoTone text={h.title} />
            </h1>
            <p className="text-[var(--text)] mt-7 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.55, maxWidth: "52ch" }}>
              {h.lead}
            </p>
            <div className="mt-9">{buttons}</div>
            <p className="mt-5 mb-0 text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)" }}>
              {h.early}{" "}
              <a href="/hub/sign-in" className="text-[var(--signal-text)] underline underline-offset-4">
                {h.signIn}
              </a>
            </p>
          </div>
          <div className="lg:col-span-6 min-w-0">
            <figure className="m-0 card-glow overflow-hidden p-2 sm:p-3">
              <img
                src={shotDark}
                alt=""
                width={1440}
                height={900}
                className="hidden dark:block w-full h-auto rounded-[14px] border border-[var(--line)]"
                decoding="async"
              />
              <img
                src={shotLight}
                alt=""
                width={1440}
                height={900}
                className="block dark:hidden w-full h-auto rounded-[14px] border border-[var(--line)]"
                decoding="async"
              />
              <figcaption className="sr-only">{h.eyebrow}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* The CRM */}
      <section style={{ paddingBlock: "var(--section-pad)" }}>
        <div className="mx-auto" style={container}>
          <h2 className="text-[var(--text-hi)] font-medium m-0" style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "24ch" }}>
            <TwoTone text={h.crmTitle} />
          </h2>
          <ul className="m-0 p-0 list-none grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {h.crm.map((c) => (
              <li key={c.title} className="card-glow p-6">
                <h3 className="m-0 text-[var(--text-hi)] font-medium" style={{ fontSize: "1.125rem" }}>
                  {c.title}
                </h3>
                <p className="mt-3 mb-0 text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}>
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The agents */}
      <section style={{ paddingBlock: "var(--section-pad)" }}>
        <div className="mx-auto" style={container}>
          <h2 className="text-[var(--text-hi)] font-medium m-0" style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "22ch" }}>
            <TwoTone text={h.aiTitle} />
          </h2>
          <p className="text-[var(--text)] mt-6 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.55, maxWidth: "60ch" }}>
            {h.aiLead}
          </p>
          <ul className="m-0 p-0 list-none grid sm:grid-cols-2 gap-4 mt-10">
            {h.ai.map((a, i) => (
              <li key={a.title} className="card-glow p-6 sm:p-7">
                <span className="eyebrow-mono text-[var(--signal-text)]" style={{ fontSize: "var(--t-label)" }} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 mb-0 text-[var(--text-hi)] font-medium" style={{ fontSize: "1.25rem" }}>
                  {a.title}
                </h3>
                <p className="mt-3 mb-0 text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}>
                  {a.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Data */}
      <section style={{ paddingBlock: "var(--section-pad)" }}>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8" style={container}>
          <h2 className="lg:col-span-5 text-[var(--text-hi)] font-medium m-0" style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            <TwoTone text={h.trustTitle} />
          </h2>
          <ul className="lg:col-span-7 m-0 p-0 list-none border-t border-[var(--line)]">
            {h.trust.map((line) => (
              <li key={line} className="flex gap-4 py-5 border-b border-[var(--line)] text-[var(--text)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
                <Check className="w-5 h-5 shrink-0 mt-0.5 text-[var(--signal-text)]" strokeWidth={2} aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Invitation */}
      <section style={{ paddingBlock: "var(--section-pad) calc(var(--section-pad) * 1.5)" }}>
        <div className="mx-auto" style={container}>
          <div className="card-glow p-8 sm:p-12">
            <h2 className="text-[var(--text-hi)] font-medium m-0" style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              {h.ctaTitle}
            </h2>
            <p className="text-[var(--text)] mt-4 mb-8" style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "60ch" }}>
              {h.ctaLead}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-4">
              {buttons}
              <L
                to="/contact?interest=software"
                className="text-[var(--text-mid)] hover:text-[var(--text-hi)] underline underline-offset-4 decoration-[var(--line-strong)]"
                style={{ fontSize: "var(--t-small)" }}
              >
                {h.talk}
              </L>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
