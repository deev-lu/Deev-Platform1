import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BadgeEuro } from "lucide-react";
import L from "./L";
import ServiceStage from "./ServiceStage";
import { useT } from "../../lib/useT";

/**
 * /services — der Wegweiser, nicht der Inhalt.
 *
 * Vorher stand hier ein Menü aus neun Kacheln, darunter vier lange
 * Übersichtsblöcke, die teils dasselbe noch einmal erklärten. Gemessen:
 * 5.887 Zeichen auf 9,5 Bildschirmen, und nur vier der neun Kacheln zeigten
 * überhaupt auf diese Seite. Wer wissen wollte, wo er hingehört, musste die
 * ganze Seite lesen.
 *
 * Jetzt beantwortet die Seite eine einzige Frage: welcher der vier Wege ist
 * meiner? Die Tiefe liegt auf den vier Leistungsseiten, wo sie hingehört.
 *
 * Marketing ist dabei bewusst ein gleichwertiger vierter Weg und kein
 * Unterpunkt: Nachfrage zu erzeugen ist ein eigener Bedarf, mit dem jemand
 * herkommt, ohne eine Website zu wollen.
 *
 * Die Bühne rechts steht still und wechselt mit dem aktiven Weg. Aktiv wird
 * ein Weg durch Zeigen, Tastaturfokus oder schlicht dadurch, dass man ihn
 * anklickt - nie muss man etwas überfahren, um die Seite zu verstehen, und
 * jede Zeile ist von sich aus ein Link.
 */
export type PathKey = "websites" | "ai" | "software" | "marketing";

const PATHS: { key: PathKey; to: string }[] = [
  { key: "websites", to: "/services/websites" },
  { key: "ai", to: "/services/ai-automation" },
  { key: "software", to: "/services/custom-software" },
  { key: "marketing", to: "/services/marketing" },
];

export default function ServicesIndex() {
  const t = useT();
  const reduce = useReducedMotion();
  const n = t.pages.servicesNav;
  const [active, setActive] = useState<PathKey>("websites");

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">
      {/* ── 01 Hero. Kurz gehalten, damit der erste Weg noch im ersten
             Bildausschnitt beginnt. ───────────────────────────────────── */}
      <header
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingTop: "clamp(56px, 7vw, 96px)" }}
      >
        <div className="flex items-center gap-4 mb-8">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {n.eyebrow}
          </span>
        </div>

        <h1
          className="text-[var(--text-hi)] font-medium"
          style={{
            fontSize: "clamp(2.25rem, 1rem + 3.4vw, 3.75rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.032em",
            maxWidth: "18ch",
          }}
        >
          {n.title}
        </h1>

        <p
          className="text-[var(--text-mid)] mt-6"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "52ch" }}
        >
          {n.lead}
        </p>
      </header>

      {/* ── 02 Der Navigator ──────────────────────────────────────────── */}
      <div
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingTop: "clamp(48px, 6vw, 80px)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16">
          <ol className="lg:col-span-7 border-t border-[var(--line)]">
            {PATHS.map(({ key, to }, i) => {
              const p = n.paths[key];
              const on = active === key;
              return (
                <li key={key} className="border-b border-[var(--line)]">
                  <L
                    to={to}
                    onMouseEnter={() => setActive(key)}
                    onFocus={() => setActive(key)}
                    className="group block py-9 outline-none"
                    aria-describedby={`svc-${key}-cue`}
                  >
                    <div className="flex items-baseline gap-5">
                      <span
                        className="eyebrow-mono shrink-0 transition-colors duration-[var(--dur-2)]"
                        style={{
                          fontSize: "var(--t-label)",
                          letterSpacing: "0.16em",
                          color: on ? "var(--signal-text)" : "var(--metal)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2
                        className="text-[var(--text-hi)] font-medium"
                        style={{
                          fontSize: "clamp(1.5rem, 1rem + 1.4vw, 2.125rem)",
                          lineHeight: 1.15,
                          letterSpacing: "-0.022em",
                        }}
                      >
                        {p.title}
                      </h2>
                    </div>

                    <div className="pl-[calc(var(--t-label)+1.25rem)]">
                      <p
                        className="text-[var(--text-mid)] mt-3"
                        style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
                      >
                        {p.line}
                      </p>

                      {/* Der Satz, an dem sich jemand wiedererkennt. Er steht
                          fest da und nicht erst nach einer Bewegung: wer die
                          Seite nur überfliegt, soll ihn sehen. */}
                      <p
                        id={`svc-${key}-cue`}
                        className="mt-4 text-[var(--text-low)]"
                        style={{ fontSize: "var(--t-small)" }}
                      >
                        <span className="text-[var(--text-mid)]">{n.bestFor}:</span> {p.cue}
                      </p>

                      <ul className="flex flex-wrap gap-x-2 gap-y-2 mt-5">
                        {p.caps.map((c) => (
                          <li
                            key={c}
                            className="eyebrow-mono uppercase inline-flex items-center h-7 px-2.5 border transition-colors duration-[var(--dur-2)]"
                            style={{
                              fontSize: "var(--t-label)",
                              letterSpacing: "0.14em",
                              borderRadius: "var(--radius-1)",
                              borderColor: on ? "var(--line-strong)" : "var(--line)",
                              color: on ? "var(--text-mid)" : "var(--text-low)",
                            }}
                          >
                            {c}
                          </li>
                        ))}
                      </ul>

                      <span
                        className="inline-flex items-center gap-2 mt-6 text-[var(--signal-text)] font-medium"
                        style={{ fontSize: "var(--t-small)" }}
                      >
                        {n.cta(p.title)}
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1 group-focus-visible:translate-x-1"
                          strokeWidth={1.5}
                        />
                      </span>
                    </div>
                  </L>
                </li>
              );
            })}
          </ol>

          {/* Die Bühne. Nur ab der Breite, auf der sie neben den Wegen Platz
              hat - darunter ist sie Beiwerk, das Scrollweg kostet. */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-32">
              <ServiceStage active={active} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 03 Vertrauen, kompakt ───────────────────────────────────────
             Traegt den Anker #why-deev: der Menuepunkt "Warum Deev" zeigte
             auf einen Abschnitt, den es nach dem Umbau nicht mehr gab, und
             landete auf dem Seitenkopf. Inhaltlich ist genau dieser Block die
             Antwort auf die Frage, also zeigt der Punkt jetzt hierher. */}
      <section
        id="why-deev"
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
      >
        <h2
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h2)", lineHeight: 1.1, letterSpacing: "-0.026em", maxWidth: "16ch" }}
        >
          {t.pages.servicesTrust.title}
        </h2>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 mt-12">
          {t.pages.servicesTrust.points.map((pt, i) => (
            <motion.li
              key={pt.title}
              className="border-t border-[var(--line)] pt-6"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="eyebrow-mono text-[var(--metal)]"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="text-[var(--text-hi)] font-medium mt-4"
                style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
              >
                {pt.title}
              </h3>
              <p className="text-[var(--text-mid)] mt-3" style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}>
                {pt.copy}
              </p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ── 04 Abschluss. Bewusst ohne Leistungsbezug: wer bis hierher
             gescrollt hat, hat sich gerade NICHT entschieden. ─────────── */}
      <section
        className="border-t border-[var(--line)]"
        style={{ paddingBlock: "var(--section-y)" }}
      >
        <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8 items-end">
            <div className="lg:col-span-7">
              <h2
                className="text-[var(--text-hi)] font-medium"
                style={{ fontSize: "var(--t-h2)", lineHeight: 1.1, letterSpacing: "-0.026em", maxWidth: "16ch" }}
              >
                {t.pages.servicesCta.title}
              </h2>
              <p
                className="text-[var(--text-mid)] mt-5"
                style={{ fontSize: "var(--t-lead)", lineHeight: 1.5, maxWidth: "46ch" }}
              >
                {t.pages.servicesCta.lead}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
              <L
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 h-[52px] px-7 bg-[var(--signal)] text-white font-medium"
                style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                {t.pages.servicesCta.primary}
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </L>
              <L
                to="/project"
                className="inline-flex items-center justify-center h-[52px] px-7 border border-[var(--line-strong)] text-[var(--text-hi)] font-medium hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
                style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                {t.pages.servicesCta.secondary}
              </L>
            </div>
          </div>

          {/* Die Förderung ist die erste Frage jedes luxemburgischen KMU und
              bleibt deshalb als eine ruhige Zeile stehen, nicht als Block. */}
          <L
            to="/sme-packages"
            className="group inline-flex items-center gap-3 mt-14 pt-8 border-t border-[var(--line)] w-full text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)" }}
          >
            <BadgeEuro className="w-4 h-4 text-[var(--positive)] shrink-0" strokeWidth={1.5} />
            {t.site.mega.feature.title}
            <ArrowRight
              className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </L>
        </div>
      </section>
    </main>
  );
}
