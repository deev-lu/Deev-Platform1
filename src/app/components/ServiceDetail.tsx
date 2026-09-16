import { Suspense, lazy, useEffect, type ComponentType } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import L from "./L";
import { useT, useLocale } from "../../lib/useT";
import { PROJECTS, sectorOf } from "../../lib/projects";
import { track } from "../../lib/analytics";

/**
 * Die drei Leistungsseiten, aus einer Vorlage.
 *
 * Gemeinsam ist ihnen der Aufbau: Problem, Umfang, passende Referenzen,
 * Anfrage. Unterschiedlich ist alles, was dazwischen steht, und genau darum
 * geht es: drei Seiten mit demselben Text unter verschiedenen Überschriften
 * wären austauschbare SEO-Masse, und ein Käufer merkt das sofort.
 *
 * Die ausgelagerten Startseitenblöcke hängen hier, wo sie hingehören: der
 * Workshop bei KI, die Systemschichten und Billovio bei individueller
 * Software. Sie sind lazy, damit eine Seite nicht den Code der anderen lädt.
 */

export type ServiceKey = "websites" | "ai" | "software" | "marketing";

const SystemStack = lazy(() => import("./SystemStack"));
const AiConcepts = lazy(() => import("./AiConcepts"));
const BillovioFeature = lazy(() => import("./BillovioFeature"));
const MarketingServices = lazy(() => import("./MarketingServices"));

/** Welcher ausgelagerte Block auf welcher Seite landet. */
const EXTRAS: Record<ServiceKey, ComponentType[]> = {
  websites: [],
  ai: [AiConcepts],
  software: [SystemStack, BillovioFeature],
  // Der Marketingblock stand auf /services zwischen drei anderen
  // Uebersichten. Hier ist er der Inhalt der Seite, nicht ein Abschnitt
  // unter vielen.
  marketing: [MarketingServices],
};

/** Welche Projekte als Beleg zu welchem Weg passen. */
const MATCHES: Record<ServiceKey, string[]> = {
  websites: ["website", "branding"],
  ai: ["platform"],
  software: ["platform"],
  marketing: ["website", "onlineStore"],
};

export default function ServiceDetail({ service }: { service: ServiceKey }) {
  const t = useT();
  const locale = useLocale();
  const s = t.pages.servicePages[service];

  // Belege aus dem echten Portfolio, nicht aus einer gepflegten Extraliste:
  // so kann eine Leistungsseite keine Referenz zeigen, die es nicht gibt.
  const related = PROJECTS.filter(
    (p) => p.image && p.scope?.some((sc) => MATCHES[service].includes(sc)),
  ).slice(0, 3);

  // Welcher der drei Wege wird tatsächlich geöffnet? Ohne diese Zahl ist die
  // Aufteilung in drei Seiten eine Behauptung über das Interesse der Besucher.
  useEffect(() => {
    track("service_view", { service, locale });
  }, [service, locale]);

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">
      <header
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
      >
        <div className="flex items-center gap-4 mb-9">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {s.eyebrow}
          </span>
        </div>

        <h1
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.06, letterSpacing: "-0.03em", maxWidth: "22ch" }}
        >
          {s.title}
        </h1>
        <p
          className="text-[var(--text-mid)] mt-6"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "58ch" }}
        >
          {s.lead}
        </p>

        {/* Das Problem in den Worten des Käufers, bevor irgendeine Leistung
            genannt wird. Wer sich nicht wiedererkennt, spart sich die Seite. */}
        <div className="mt-14">
          <div
            className="eyebrow-mono uppercase text-[var(--text-low)] pb-4 mb-7 border-b border-[var(--line)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.pages.servicePages.problemsLabel}
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {s.problems.map((problem) => (
              <li
                key={problem}
                className="border border-[var(--line)] bg-[var(--surface-1)] p-7 text-[var(--text-hi)]"
                style={{ borderRadius: "var(--radius-1)", fontSize: "var(--t-body)", lineHeight: 1.45 }}
              >
                {problem}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Die von der Startseite ausgelagerten Blöcke. */}
      {EXTRAS[service].map((Block, i) => (
        <Suspense key={i} fallback={<div style={{ minHeight: "40vh" }} />}>
          <Block />
        </Suspense>
      ))}

      {/* Belege aus dem Portfolio. */}
      {related.length > 0 && (
        <section
          className="mx-auto"
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBottom: "var(--section-y)" }}
        >
          <div
            className="eyebrow-mono uppercase text-[var(--text-low)] pb-4 mb-8 border-b border-[var(--line)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.pages.servicePages.workLabel}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((p) => (
              <L
                key={p.slug}
                to={`/work/${p.slug}`}
                className="group block border border-[var(--line)] bg-[var(--surface-1)] overflow-hidden hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-2)]"
                style={{ borderRadius: "var(--radius-1)" }}
              >
                <span className="block relative w-full" style={{ aspectRatio: "1000 / 583" }}>
                  <img
                    src={p.image}
                    alt={`${p.title}, ${sectorOf(p, locale)}`}
                    width={1000}
                    height={583}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </span>
                <span className="flex items-baseline justify-between gap-3 p-5">
                  <span className="min-w-0">
                    <span className="block text-[var(--text-hi)] font-medium truncate" style={{ fontSize: "var(--t-small)" }}>
                      {p.title}
                    </span>
                    <span
                      className="block eyebrow-mono uppercase text-[var(--text-low)] mt-1.5 truncate"
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      {sectorOf(p, locale)} / {p.year}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 shrink-0 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                    strokeWidth={1.5}
                  />
                </span>
              </L>
            ))}
          </div>
        </section>
      )}

      <section
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBottom: "var(--section-y)" }}
      >
        <div
          className="border border-[var(--line)] bg-[var(--surface-1)] p-8 sm:p-12 flex flex-wrap items-center justify-between gap-6"
          style={{ borderRadius: "var(--radius-1)" }}
        >
          <h2
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em", maxWidth: "24ch" }}
          >
            {t.pages.servicePages.cta}
          </h2>
          <L
            to="/contact"
            className="group inline-flex items-center gap-2 h-12 px-6 bg-[var(--signal)] text-white font-medium"
            style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
          >
            {t.home.hero.ctaPrimary}
            <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
          </L>
        </div>
      </section>
    </main>
  );
}
