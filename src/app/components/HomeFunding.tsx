import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { mark } from "../../lib/i18nMark";

/**
 * Das Foerderband auf der Startseite (seit dem 24.10.2026), direkt nach den
 * Workshops.
 *
 * Die meisten Luxemburger Anfragen beginnen mit der Foerderung, und sie war
 * nur noch im Footer verlinkt. Ein schmales Band, ohne Nummer im Eyebrow,
 * weil es kein eigener Abschnitt der Erzaehlung ist, sondern ein Weg dorthin:
 * die drei Zahlen der Foerderseite (dieselben Texte, t.grant.stats), dazu die
 * Pruefung und das Gespraech.
 */
export default function HomeFunding() {
  const t = useT();
  const g = t.grant;

  return (
    <section aria-labelledby="funding-title" className="bg-[var(--surface-0)]" style={{ paddingBlock: "calc(var(--section-pad) * 0.5)" }}>
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 items-center border-y border-[var(--line)] py-10"
        >
          <div className="lg:col-span-5">
            <div
              className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="h-px w-10 bg-[var(--line-strong)]" />
              <span>{g.eyebrow}</span>
            </div>
            <h2
              id="funding-title"
              className="text-[var(--text-hi)] font-medium mt-6 mb-0"
              style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: "22ch" }}
            >
              {mark(t.home.grant.title, "text-[var(--signal-text)]")}
            </h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
              <L
                to="/sme-packages"
                className="group inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--signal)] text-white font-medium"
                style={{ fontSize: "var(--t-small)" }}
              >
                {g.check.title}
                <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
              </L>
              <L
                to="/contact?interest=funding"
                className="text-[var(--text-mid)] hover:text-[var(--text-hi)] underline underline-offset-4 decoration-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
                style={{ fontSize: "var(--t-small)" }}
              >
                {g.ctaSecondary}
              </L>
            </div>
          </div>

          <dl className="lg:col-span-7 grid grid-cols-3 gap-4 m-0">
            {(["rate", "range", "cap"] as const).map((k) => (
              <div key={k} className="flex flex-col border-l border-[var(--line)] pl-4 sm:pl-6">
                <dt
                  className="order-2 eyebrow-mono uppercase text-[var(--text-low)] mt-3"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.12em", lineHeight: 1.5 }}
                >
                  {g.stats[k].label}
                </dt>
                <dd
                  className="m-0 text-[var(--text-hi)] font-medium tabular-nums"
                  style={{ fontSize: "clamp(1.5rem, 1rem + 2.2vw, 2.75rem)", lineHeight: 1, letterSpacing: "-0.03em" }}
                >
                  {g.stats[k].value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
