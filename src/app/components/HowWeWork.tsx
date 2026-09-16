import L from "./L";
import { useT } from "../../lib/useT";

/**
 * Abschnitt 4b: wie ein Projekt abläuft.
 *
 * Der Brief verlangt „Sven und Fabio + Prozess". Die Gründer standen schon
 * da, der Ablauf nicht — und genau das ist die Frage, die vor einer Anfrage
 * im Weg steht: was passiert eigentlich, wenn ich mich melde?
 *
 * Die vier Schritte sind kein neuer Text. Sie liegen seit Langem in allen
 * drei Sprachen unter `home.value.steps` und wurden beim Entschlacken der
 * Startseite mit dem alten Abschnitt entfernt. Hier stehen sie wieder, ohne
 * das Beiwerk, das sie damals umgab.
 *
 * Bewusst ohne Zeitangaben. „In vier Wochen live" wäre eine Zusage, die von
 * Ausbaustufe und Zuarbeit abhängt, und der Audit führt genau das als
 * eigenen Punkt (D-35).
 */
export default function HowWeWork() {
  const t = useT();
  const v = t.home.values;

  return (
    <section
      id="how-we-work"
      className="bg-[var(--surface-0)] border-t border-[var(--line-faint)]"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <div className="flex items-center gap-4 mb-7">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span className="text-[var(--metal)]">04</span> / {v.processEyebrow}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mt-12">
          {v.steps.map((step, i) => (
            <div key={step.title} className="border-t border-[var(--line)] pt-6">
              <span
                className="eyebrow-mono text-[var(--text-low)]"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="text-[var(--text-hi)] font-medium mt-4"
                style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
              >
                {step.title}
              </h3>
              <p
                className="text-[var(--text-mid)] mt-3"
                style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}
              >
                {step.copy}
              </p>
            </div>
          ))}
        </div>

        <L
          to="/contact"
          className="inline-flex items-center justify-center h-[52px] px-7 mt-14 border border-[var(--line-strong)] text-[var(--text-hi)] font-medium hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
          style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
        >
          {t.home.hero.ctaPrimary}
        </L>
      </div>
    </section>
  );
}
