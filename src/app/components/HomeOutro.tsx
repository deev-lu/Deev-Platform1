import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";

/**
 * Der Schluss der Startseite: wie Projekte laufen (04), die Gruender (05,
 * von aussen eingesetzt) und die Einladung zum Gespraech.
 *
 * Die alten Kampagnenanker bleiben erreichbar: #pricing und
 * #project-builder stehen in Kampagnen und fremden Links und landen jetzt bei
 * den Projektphasen. #about liegt auf den Gruendern (05).
 */

const eyebrow = "flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]";
const eyebrowStyle = { fontSize: "var(--t-label)", letterSpacing: "0.16em" } as const;
const h2Style = { fontSize: "clamp(2.5rem, 1.3rem + 3.8vw, 5.25rem)", lineHeight: 0.98, letterSpacing: "-0.04em" } as const;
const wrap = { maxWidth: "var(--container)", paddingInline: "var(--gutter)" } as const;

/** `founders` wird nach den Projektphasen eingesetzt (05), vor der Einladung. */
export default function HomeOutro({ founders }: { founders?: ReactNode }) {
  const t = useT();
  const e = t.home.engage;
  const c = t.home.closing;
  const lineRef = useRef<HTMLDivElement>(null);
  const lineOn = useInView(lineRef, { once: true, amount: 1 });

  return (
    <>
      {/* 04 · Wie Projekte laufen */}
      <section id="pricing" className="relative bg-[var(--surface-1)] border-y border-[var(--line)]" style={{ paddingBlock: "var(--section-y-lg)" }}>
        <span id="project-builder" className="absolute top-0" aria-hidden="true" />
        <div className="mx-auto" style={wrap}>
          <div className="flex flex-wrap items-end gap-x-20 gap-y-10">
            <div className="min-w-0" style={{ flex: "1 1 560px" }}>
              <div className={eyebrow} style={eyebrowStyle}>
                <span className="h-px w-10 bg-[var(--line-strong)]" />
                <span>
                  <span className="text-[var(--signal-text)]">04</span> / {e.eyebrow}
                </span>
              </div>
              <h2 className="text-[var(--text-hi)] font-medium mt-9" style={{ ...h2Style, maxWidth: "14ch" }}>
                {e.title}
              </h2>
            </div>
            <p className="text-[var(--text-mid)] m-0" style={{ flex: "1 1 340px", maxWidth: "44ch", fontSize: "var(--t-body)", lineHeight: 1.6 }}>
              {e.lead}
            </p>
          </div>

          <div ref={lineRef} className="mt-20 lg:mt-24 h-px bg-[var(--line)]">
            <div className="m-draw" data-on={lineOn ? "true" : "false"} />
          </div>
          <ol className="flex flex-wrap">
            {e.phases.map((p, i) => (
              <li key={p.title} className="min-w-0 pt-8 pr-8 pb-2" style={{ flex: "1 1 240px" }}>
                <div className="eyebrow-mono uppercase text-[var(--signal-text)]" style={eyebrowStyle}>
                  {e.phase} 0{i + 1}
                </div>
                <h3 className="display text-[var(--text-hi)] mt-5" style={{ fontSize: "clamp(1.5rem, 1.2rem + 0.6vw, 1.75rem)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                  {p.title}
                </h3>
                <p className="text-[var(--text-low)] mt-3" style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}>
                  {p.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {founders}

      {/* Einladung */}
      <section className="relative overflow-hidden bg-[var(--surface-0)] border-t border-[var(--line)]">
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "40%",
            width: 900,
            height: 900,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(closest-side, color-mix(in srgb, var(--signal) 16%, transparent), transparent)",
          }}
        />
        <div className="relative mx-auto" style={{ ...wrap, paddingTop: "var(--section-y-lg)", paddingBottom: "var(--section-y)" }}>
          <h2
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "clamp(2.75rem, 1.3rem + 5.4vw, 7.5rem)", lineHeight: 0.94, letterSpacing: "-0.045em", maxWidth: "13ch" }}
          >
            {c.title}
          </h2>
          <div className="flex flex-wrap items-end justify-between gap-10 mt-14 lg:mt-16">
            <p className="text-[var(--text-mid)] m-0" style={{ maxWidth: "48ch", fontSize: "var(--t-lead)", lineHeight: 1.5 }}>
              {c.lead}
            </p>
            <div className="flex flex-wrap gap-3">
              <L
                to="/contact"
                className="m-arrow inline-flex items-center gap-3 px-7 bg-[var(--signal)] text-white font-medium"
                style={{ height: 56, fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                {t.home.intro.primary}
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </L>
              <a
                href="mailto:contact@deev.lu"
                className="inline-flex items-center px-6 border border-[var(--line-strong)] text-[var(--text-hi)] font-medium hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
                style={{ height: 56, fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
              >
                contact@deev.lu
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
