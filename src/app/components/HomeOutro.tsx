import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import L from "./L";
import { ArrowRight } from "lucide-react";
import { useT } from "../../lib/useT";
import meeting from "../../assets/photos/meeting-room-1400.webp";
import screen from "../../assets/photos/code-screen-900.webp";
import wall from "../../assets/photos/process-wall-900.webp";

/**
 * Der Schluss der Startseite: wie Projekte laufen (04), das Unternehmen (05,
 * von aussen eingesetzt) und die Einladung zum Gespraech (06).
 *
 * 04 zeigt zuerst die Arbeit - drei Bilder: die Besprechung, der Bildschirm,
 * die Wand nach dem Workshop - und darunter die Phasen als Diagramm: eine
 * Linie, vier Knoten, die erste Phase in Electric Blue. Die Bilder sind
 * Unsplash-Platzhalter (freie Lizenz) bis zum eigenen Shooting.
 *
 * Die alten Kampagnenanker bleiben erreichbar: #pricing und
 * #project-builder stehen in Kampagnen und fremden Links und landen bei den
 * Projektphasen. #about liegt auf dem Unternehmen (05).
 */

const eyebrow = "flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]";
const eyebrowStyle = { fontSize: "var(--t-label)", letterSpacing: "0.16em" } as const;
const wrap = { maxWidth: "var(--container)", paddingInline: "var(--gutter)" } as const;

function Photo({ src, w, h, className = "" }: { src: string; w: number; h: number; className?: string }) {
  return (
    <div className={`m-zoom relative overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] ${className}`}>
      <img
        src={src}
        alt=""
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        className="m-grade absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

/** `company` wird nach den Projektphasen eingesetzt (05), vor der Einladung. */
export default function HomeOutro({ company }: { company?: ReactNode }) {
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8 items-end">
            <div className="lg:col-span-7 min-w-0">
              <div className={eyebrow} style={eyebrowStyle}>
                <span className="h-px w-10 bg-[var(--line-strong)]" />
                <span>
                  <span className="text-[var(--metal)]">04</span> / {e.eyebrow}
                </span>
              </div>
              <h2
                className="text-[var(--text-hi)] font-medium mt-8"
                style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.025em", maxWidth: "15ch" }}
              >
                {e.title}
              </h2>
            </div>
            <p className="lg:col-span-5 text-[var(--text-mid)] m-0" style={{ maxWidth: "46ch", fontSize: "var(--t-lead)", lineHeight: 1.45 }}>
              {e.lead}
            </p>
          </div>

          {/* Die Arbeit, bevor das Diagramm sie ordnet */}
          <div className="dark grid grid-cols-1 md:grid-cols-12 gap-4 mt-16 lg:mt-20">
            <Photo src={meeting} w={1400} h={933} className="md:col-span-7 aspect-[16/9]" />
            <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
              <Photo src={screen} w={900} h={600} className="aspect-[4/3] md:aspect-auto" />
              <Photo src={wall} w={900} h={596} className="aspect-[4/3] md:aspect-auto" />
            </div>
          </div>

          {/* Eine Linie, vier Knoten */}
          <div ref={lineRef} className="relative mt-16 lg:mt-20 h-px bg-[var(--line-strong)]">
            <div className="m-draw absolute left-0 top-0 w-full lg:w-1/4" data-on={lineOn ? "true" : "false"} />
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {e.phases.map((p, i) => (
              <li key={p.title} className="relative min-w-0 pt-9 pb-4">
                <span
                  aria-hidden="true"
                  className={`hidden lg:block absolute left-0 w-[9px] h-[9px] ${i === 0 ? "bg-[var(--signal)]" : "bg-[var(--surface-1)] border border-[var(--line-strong)]"}`}
                  style={{ top: -4 }}
                />
                <div className={`eyebrow-mono uppercase ${i === 0 ? "text-[var(--signal-text)]" : "text-[var(--text-low)]"}`} style={eyebrowStyle}>
                  {e.phase} 0{i + 1}
                </div>
                <h3
                  className="display text-[var(--text-hi)] mt-4"
                  style={{ fontSize: "clamp(1.25rem, 1.1rem + 0.4vw, 1.5rem)", letterSpacing: "-0.01em", lineHeight: 1.2 }}
                >
                  {p.title}
                </h3>
                <p className="text-[var(--text-mid)] mt-3" style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}>
                  {p.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {company}

      {/* 06 · Einladung. Fast leer: die Sicherheit liegt im Weglassen. */}
      <section className="bg-[var(--surface-0)] border-t border-[var(--line)]" style={{ paddingBlock: "calc(var(--section-y-lg) * 0.9)" }}>
        <div className="mx-auto" style={wrap}>
          <div className={eyebrow} style={eyebrowStyle}>
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span>
              <span className="text-[var(--metal)]">06</span> / {c.eyebrow}
            </span>
          </div>
          <h2
            className="text-[var(--text-hi)] font-medium mt-8"
            style={{ fontSize: "clamp(2.75rem, 1.2rem + 5.6vw, 7.5rem)", lineHeight: 0.94, letterSpacing: "-0.035em", maxWidth: "12ch" }}
          >
            {c.title}
          </h2>
          <p className="text-[var(--text-mid)] mt-8" style={{ maxWidth: "48ch", fontSize: "var(--t-lead)", lineHeight: 1.45 }}>
            {c.lead}
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-10">
            <L
              to="/contact"
              className="inline-flex items-center px-6 bg-[var(--signal)] hover:bg-[#1747c4] text-white font-medium transition-colors duration-[var(--dur-1)]"
              style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-2)" }}
            >
              {t.home.intro.primary}
            </L>
            <a
              href="mailto:contact@deev.lu"
              className="m-arrow inline-flex items-center gap-2.5 text-[var(--text-hi)] font-medium"
              style={{ fontSize: "var(--t-small)" }}
            >
              contact@deev.lu
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
