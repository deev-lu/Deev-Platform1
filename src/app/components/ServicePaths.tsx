import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Globe, LayoutDashboard, Sparkles } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";

/**
 * Abschnitt 3: die drei Leistungswege.
 *
 * Der Unterschied zu drei Werbekarten ist die erste Zeile jeder Karte. Sie
 * nennt das Problem in den Worten des Käufers, nicht die Leistung in unseren.
 * Wer sich in einem der drei Sätze wiedererkennt, weiß sofort, welcher Weg
 * seiner ist; wer sich in keinem wiedererkennt, ist hier vermutlich falsch,
 * und auch das ist ein nützliches Ergebnis.
 *
 * Die Ziele sind eigene Seiten, keine Startseitenanker. Unterschiedliche
 * Leistungen brauchen unterschiedliche Argumente, und ein Anker kann nicht
 * ranken.
 */

const PATHS = [
  { key: "websites" as const, icon: Globe, to: "/services/websites" },
  { key: "ai" as const, icon: Sparkles, to: "/services/ai-automation" },
  { key: "software" as const, icon: LayoutDashboard, to: "/services/custom-software" },
];

export default function ServicePaths() {
  const t = useT();
  const reduce = useReducedMotion();
  const p = t.home.paths;

  return (
    <section id="services" className="bg-[var(--surface-0)]" style={{ paddingBlock: "var(--section-y)" }}>
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <div className="flex items-center gap-4 mb-7">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span className="text-[var(--metal)]">03</span> / {p.eyebrow}
          </span>
        </div>

        <h2
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.028em", maxWidth: "16ch" }}
        >
          {p.title}
        </h2>
        <p
          className="text-[var(--text-mid)] mt-5 mb-12"
          style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "54ch" }}
        >
          {p.lead}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PATHS.map(({ key, icon: Icon, to }, i) => {
            const item = p.items[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <L
                  to={to}
                  className="group flex h-full flex-col border border-[var(--line)] bg-[var(--surface-1)] p-8 hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-2)]"
                  style={{ borderRadius: "var(--radius-1)" }}
                >
                  <Icon className="w-5 h-5 text-[var(--signal-text)] mb-7" strokeWidth={1.5} />

                  {/* Das Problem zuerst, in seinen Worten. */}
                  <p
                    className="text-[var(--text-hi)] font-medium"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.25, letterSpacing: "-0.015em" }}
                  >
                    {item.problem}
                  </p>

                  <p
                    className="text-[var(--text-mid)] mt-4"
                    style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}
                  >
                    {item.body}
                  </p>

                  {/* Drei Sätze, in denen sich jemand wiedererkennt oder eben
                      nicht. Sie stehen schon auf der jeweiligen Leistungsseite;
                      hier zu wiederholen ist kein Duplikat, sondern der Grund,
                      warum jemand überhaupt dorthin klickt. */}
                  <ul className="mt-6 mb-8 space-y-2.5">
                    {t.pages.servicePages[key].problems.map((line) => (
                      <li
                        key={line}
                        className="flex gap-2.5 text-[var(--text-low)]"
                        style={{ fontSize: "var(--t-small)", lineHeight: 1.5 }}
                      >
                        <span
                          className="mt-[0.55em] h-px w-2.5 shrink-0 bg-[var(--line-strong)]"
                          aria-hidden="true"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <span
                    className="mt-auto inline-flex items-center gap-2 text-[var(--signal-text)] font-medium"
                    style={{ fontSize: "var(--t-small)" }}
                  >
                    {item.cta}
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </span>
                </L>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
