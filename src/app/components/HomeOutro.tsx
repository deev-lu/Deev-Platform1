import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import L from "./L";
import { ArrowRight } from "lucide-react";
import { useT } from "../../lib/useT";
import onSite from "../../assets/photos/adolphe-tram-1200.webp";
import Plate, { TwoTone } from "./Plate";

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

function Photo({
  src,
  plate,
  w,
  h,
  label,
  caption,
  small = false,
  className = "",
}: {
  src?: string;
  plate?: "flow";
  w?: number;
  h?: number;
  label: string;
  caption: string;
  small?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`m-zoom relative m-0 overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] ${className}`}
      style={{ borderRadius: "var(--radius-2)" }}
    >
      {plate ? (
        <div className="absolute inset-0 bg-[#0B0E1C] flex items-center justify-center">
          <Plate name={plate} className="w-full aspect-[4/3] max-h-full" />
        </div>
      ) : (
        <img
          src={src}
          alt=""
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[50%_62%]"
        />
      )}
      {/* Bildunterschrift auf dem Bild, ueber einem Verlauf nach Schwarz. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(6,6,10,0.85), rgba(6,6,10,0))" }}
      />
      <figcaption className={`absolute left-0 right-0 bottom-0 ${small ? "p-4 sm:p-5" : "p-5 sm:p-7"}`}>
        <span
          className="block eyebrow-mono uppercase text-[var(--text)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          {label}
        </span>
        <span
          className={`${small ? "hidden md:block" : "block"} mt-2 text-[var(--text-hi)]`}
          style={{ fontSize: small ? "var(--t-small)" : "var(--t-body)", lineHeight: 1.45, maxWidth: "40ch" }}
        >
          {caption}
        </span>
      </figcaption>
    </figure>
  );
}

/** `company` wird nach den Projektphasen eingesetzt (05), vor der Einladung. */
export default function HomeOutro({ company }: { company?: ReactNode }) {
  const t = useT();
  const e = t.home.engage;
  const c = t.home.closing;
  const lineRef = useRef<HTMLOListElement>(null);
  const lineOn = useInView(lineRef, { once: true, amount: 0.3 });

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
                  <span className="text-[var(--metal)]">05</span> / {e.eyebrow}
                </span>
              </div>
              <h2
                className="text-[var(--text-hi)] font-medium mt-8"
                style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.025em", maxWidth: "15ch" }}
              >
                <TwoTone text={e.title} />
              </h2>
            </div>
            <p className="lg:col-span-5 text-[var(--text-mid)] m-0" style={{ maxWidth: "46ch", fontSize: "var(--t-lead)", lineHeight: 1.45 }}>
              {e.lead}
            </p>
          </div>

          {/* Die Arbeit, bevor das Diagramm sie ordnet */}
          <div className="dark grid grid-cols-1 md:grid-cols-12 gap-4 mt-16 lg:mt-20">
            <Photo src={onSite} w={1100} h={1264} {...e.photos[0]} className="md:col-span-7 aspect-[16/9]" />
            <Photo plate="flow" {...e.photos[1]} className="md:col-span-5 aspect-[4/3] md:aspect-auto" />
          </div>

          {/* Eine Linie durch alle vier Phasen. Sie zeichnet sich Abschnitt fuer
              Abschnitt, und jede Phase leuchtet auf, wenn die Linie sie
              erreicht. Desktop waagrecht ueber den vier Spalten, darunter
              senkrecht an der linken Kante (Brief §6 E). Reduzierte
              Bewegung: alles steht fertig da. */}
          <ol
            ref={lineRef}
            data-on={lineOn ? "true" : "false"}
            className="m-phases relative grid grid-cols-1 lg:grid-cols-4 lg:gap-x-8 mt-16 lg:mt-20 lg:border-t border-[var(--line-strong)]"
          >
            {e.phases.map((p, i) => (
              <li
                key={p.title}
                className="relative min-w-0 pl-9 lg:pl-0 pt-1 lg:pt-10 pb-10 lg:pb-4"
                style={{ ["--i" as string]: i }}
              >
                {/* Grundlinie senkrecht (nur unter lg) und der blaue Abschnitt */}
                {i < e.phases.length - 1 && (
                  <span aria-hidden="true" className="lg:hidden absolute left-[4px] top-0 bottom-0 w-px bg-[var(--line-strong)]" />
                )}
                <span
                  aria-hidden="true"
                  className={`m-seg absolute left-[4px] top-0 bottom-0 w-px lg:left-0 lg:bottom-auto lg:w-auto lg:h-px lg:top-[-1px] ${i < e.phases.length - 1 ? "lg:-right-8" : "hidden lg:block lg:right-0"}`}
                />
                <span aria-hidden="true" className="m-node absolute left-0 top-0 lg:top-[-5px] w-[9px] h-[9px] rounded-full" />
                <div className="m-phase-label eyebrow-mono uppercase" style={eyebrowStyle}>
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
              <span className="text-[var(--metal)]">07</span> / {c.eyebrow}
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
              style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)" }}
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
