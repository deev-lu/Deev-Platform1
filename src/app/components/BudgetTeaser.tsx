import { ArrowRight, BadgeEuro } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";

/**
 * Abschnitt 5 der Startseite: Budget und mögliche Förderung.
 *
 * Er ersetzt den vollständigen Rechner, der hier in ganzer Länge stand. Das
 * hatte zwei Kosten: er belegte einen großen Teil der Startseite, bevor der
 * Besucher wusste, was DEEV überhaupt macht, und er lud seinen kompletten
 * Code auf einer Seite, auf der die meisten ihn nie öffnen.
 *
 * Die beiden alten Anker bleiben hier liegen, absichtlich. `#project-builder`
 * und `#pricing` stehen in Kampagnen und in fremden Links, und ein Fragment
 * erreicht den Server nie, lässt sich also nicht per Weiterleitungsregel
 * auffangen. Wer mit einem solchen Link kommt, landet jetzt auf einem
 * sichtbaren Übergang statt an einer Stelle, an der nichts mehr ist.
 */
export default function BudgetTeaser() {
  const t = useT();
  const b = t.home.budget;

  return (
    <section
      className="bg-[var(--surface-0)]"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      {/* Zweiter Ankername, gleiche Stelle. */}
      <span id="project-builder" aria-hidden="true" />

      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <div className="flex items-center gap-4 mb-7">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {b.eyebrow}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div
            className="border border-[var(--line)] bg-[var(--surface-1)] p-8 sm:p-10 flex flex-col"
            style={{ borderRadius: "var(--radius-1)" }}
          >
            <h2
              className="text-[var(--text-hi)] font-medium"
              style={{ fontSize: "var(--t-h2)", lineHeight: 1.12, letterSpacing: "-0.025em", maxWidth: "16ch" }}
            >
              {b.title}
            </h2>
            <p
              className="text-[var(--text-mid)] mt-5 mb-9"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              {b.lead}
            </p>
            <L
              to="/project"
              className="group mt-auto inline-flex items-center gap-2 h-12 px-6 bg-[var(--signal)] text-white font-medium self-start"
              style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
            >
              {b.cta}
              <ArrowRight
                className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </L>
          </div>

          {/* Die Förderung: ein qualifizierter Hinweis, keine Zusage. */}
          <div
            className="border border-[var(--positive)]/35 bg-[var(--surface-1)] p-8 sm:p-10 flex flex-col"
            style={{ borderRadius: "var(--radius-1)" }}
          >
            <BadgeEuro className="w-5 h-5 text-[var(--positive)] mb-6" strokeWidth={1.5} />
            <h3
              className="text-[var(--text-hi)] font-medium"
              style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
            >
              {b.grantTitle}
            </h3>
            <p
              className="text-[var(--text-mid)] mt-4 mb-9"
              style={{ fontSize: "var(--t-small)", lineHeight: 1.6, maxWidth: "46ch" }}
            >
              {b.grantBody}
            </p>
            <L
              to="/sme-packages"
              className="group mt-auto inline-flex items-center gap-2 text-[var(--positive)] font-medium self-start"
              style={{ fontSize: "var(--t-small)" }}
            >
              {b.grantCta}
              <ArrowRight
                className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </L>
          </div>
        </div>
      </div>
    </section>
  );
}
