import { ArrowRight } from "lucide-react";
import L from "./L";
import { TwoTone } from "./Plate";
import { useT } from "../../lib/useT";

/**
 * 01 auf der Startseite: Workshops und Beratung, als eigene Leistung.
 *
 * Seit dem 27.10.2026 der erste Abschnitt nach den Kundenlogos und
 * hochwertiger inszeniert (Wunsch des Inhabers): der Workshop ist der
 * Einstieg in die meisten Projekte und die Leistung, die sich am leichtesten
 * kaufen laesst.
 *
 * Aufbau auf der tiefblauen, eingelassenen Flaeche:
 *   - links Titel, Text und die zwei Knoepfe; rechts das Ergebnis als
 *     Dokument (das Executive-Konzept, als Beispiel gekennzeichnet: Titel und
 *     Inhaltsverzeichnis sagen nur, was home.ai ohnehin verspricht);
 *   - darunter die drei Formate auf Haarlinien statt als Karten;
 *   - zuletzt der Beleg in grossen Zahlen: 7 Prozesse, 7 Engpaesse, 30 Seiten,
 *     genau wie home.ai.example es fuer die Immobilienverwaltung sagt, und
 *     die Foerderung.
 *
 * Keine Preise und keine Dauer: die stehen nirgends und gehoeren ins
 * Gespraech. In beiden Themen dunkel (`dark`, data-surface).
 */
export default function HomeWorkshops() {
  const t = useT();
  const w = t.home.workshops;

  return (
    <section id="workshops" aria-labelledby="workshops-title" className="md:px-2 lg:px-3">
      <div
        data-surface="dark"
        className="dark relative overflow-hidden md:rounded-[28px]"
        style={{ background: "radial-gradient(120% 90% at 0% 0%, #12307f 0%, #0b1a4a 38%, #070b1c 100%)" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1.2px)", backgroundSize: "18px 18px" }}
        />
        {/* Ein Lichtpunkt oben rechts, wie auf den Signal-Lumen-Tafeln. */}
        <div
          aria-hidden="true"
          className="absolute -top-40 right-[-10%] w-[640px] h-[640px] pointer-events-none"
          style={{ background: "radial-gradient(closest-side, rgba(60,231,252,0.16), rgba(60,231,252,0))" }}
        />

        <div
          className="relative mx-auto"
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "calc(var(--section-pad) * 1.25)" }}
        >
          {/* ── Kopf und Ergebnis ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-14 items-center">
            <div className="lg:col-span-7 min-w-0">
              <div
                className="flex items-center gap-4 eyebrow-mono uppercase text-[#c7dcff]/80"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                <span className="h-px w-10 bg-white/25" />
                <span>
                  <span className="text-[#7faeff]">01</span> / {w.eyebrow}
                </span>
              </div>
              <h2
                id="workshops-title"
                className="text-[var(--text-hi)] font-medium mt-8"
                style={{ fontSize: "clamp(2.5rem, 1.4rem + 3.4vw, 4.5rem)", lineHeight: 1, letterSpacing: "-0.035em", maxWidth: "14ch" }}
              >
                <TwoTone text={w.title} />
              </h2>
              <p className="text-[var(--text)] mt-8 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.5, maxWidth: "50ch" }}>
                {w.lead}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-10">
                <L
                  to="/contact?interest=workshop"
                  className="m-arrow inline-flex items-center justify-center gap-2.5 px-7 text-[#0b1a4a] bg-white font-semibold hover:bg-[#e8f0ff] transition-colors duration-[var(--dur-1)]"
                  style={{ height: 56, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)" }}
                >
                  {w.primary}
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </L>
                <L
                  to="/workshops"
                  className="inline-flex items-center justify-center px-7 border border-white/25 text-white font-medium hover:bg-white/[0.08] transition-colors duration-[var(--dur-1)]"
                  style={{ height: 56, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)" }}
                >
                  {w.secondary}
                </L>
              </div>
            </div>

            <div className="lg:col-span-5 min-w-0">
              <ConceptDocument />
            </div>
          </div>

          {/* ── Drei Formate, auf Haarlinien ─────────────────────────────── */}
          <ol className="mt-20 grid grid-cols-1 md:grid-cols-3 border-t border-white/15 m-0 p-0">
            {w.offers.map((o, i) => (
              <li
                key={o.title}
                className={`list-none pt-8 pb-2 md:pr-8 ${i > 0 ? "md:pl-8 md:border-l border-white/15 border-t md:border-t-0 mt-6 md:mt-0" : ""}`}
              >
                <span className="eyebrow-mono text-[#7faeff]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  0{i + 1}
                </span>
                <h3 className="display text-white mt-4 mb-0" style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.015em" }}>
                  {o.title}
                </h3>
                <p className="text-[var(--text-mid)] mt-3 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
                  {o.copy}
                </p>
              </li>
            ))}
          </ol>

          {/* ── Beleg und Foerderung ──────────────────────────────────────── */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-8 items-end">
            <div className="lg:col-span-8">
              <div className="eyebrow-mono uppercase text-[#7faeff]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                {w.proofLabel}
              </div>
              <dl className="grid grid-cols-3 gap-4 mt-6 m-0">
                {w.proofStats.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <dt className="order-2 text-[var(--text-mid)] mt-3" style={{ fontSize: "var(--t-small)", lineHeight: 1.4 }}>
                      {s.label}
                    </dt>
                    <dd
                      className="m-0 text-white font-medium tabular-nums"
                      style={{ fontSize: "clamp(3rem, 2rem + 4vw, 5.5rem)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
                    >
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-[var(--text-low)] mt-5 mb-0" style={{ fontSize: "var(--t-small)" }}>
                {w.proofCaption}
              </p>
            </div>
            <div className="lg:col-span-4">
              <L
                to="/sme-packages"
                className="group flex items-start gap-3 p-5 border border-white/15 hover:border-white/30 bg-white/[0.04] transition-colors duration-[var(--dur-1)]"
                style={{ borderRadius: "var(--radius-2)" }}
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3ce7fc] shrink-0" aria-hidden="true" />
                <span className="flex-1 text-[var(--text)]" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
                  {w.funding}
                </span>
                <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-[var(--text-mid)] group-hover:translate-x-0.5 transition-transform duration-[var(--dur-1)]" strokeWidth={1.5} />
              </L>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Das Ergebnis eines Workshops als Dokument: ein helles Blatt auf zwei
 * versetzten Lagen. Als Beispiel gekennzeichnet; Titel und Gliederung sagen
 * nur, was der Workshop laut home.ai liefert. Die Balken sind Grafik, keine
 * Zahlen.
 */
function ConceptDocument() {
  const t = useT();
  const w = t.home.workshops;
  const bars = [92, 74, 61, 43, 28];

  return (
    <figure className="relative m-0 mx-auto max-w-[460px] lg:max-w-none" aria-label={`${w.doc.kicker}: ${w.doc.title} (${w.illustrative})`}>
      <div className="eyebrow-mono uppercase text-[#c7dcff]/70 mb-5" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
        {w.conceptLabel}
      </div>
      <div className="relative">
        {/* Zwei Lagen dahinter */}
        <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rotate-[2.5deg] border border-white/10 bg-white/[0.05]" style={{ borderRadius: "var(--radius-2)" }} />
        <div aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-2 rotate-[1.2deg] border border-white/15 bg-white/[0.08]" style={{ borderRadius: "var(--radius-2)" }} />

        <div
          className="relative p-7 sm:p-9 text-[#0b1530] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          style={{ borderRadius: "var(--radius-2)", background: "linear-gradient(180deg, #f7f9fd 0%, #eaf0f9 100%)" }}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="eyebrow-mono uppercase text-[#2563f6]" style={{ fontSize: "0.625rem", letterSpacing: "0.18em" }}>
              DEEV · {w.doc.kicker}
            </span>
            <span
              className="eyebrow-mono uppercase px-2 py-0.5 border border-[#0b1530]/15 text-[#0b1530]/60"
              style={{ fontSize: "0.5625rem", letterSpacing: "0.14em", borderRadius: 999 }}
            >
              {w.illustrative}
            </span>
          </div>
          <div className="display mt-6" style={{ fontSize: "clamp(1.375rem, 1.1rem + 0.8vw, 1.75rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            {w.doc.title}
          </div>
          <div className="h-px bg-[#0b1530]/12 my-6" />
          <ol className="m-0 p-0 space-y-3">
            {w.doc.toc.map((item, i) => (
              <li key={item} className="list-none flex items-baseline gap-3" style={{ fontSize: "0.875rem", lineHeight: 1.4 }}>
                <span className="eyebrow-mono text-[#2563f6] shrink-0" style={{ fontSize: "0.625rem" }}>
                  0{i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <div aria-hidden="true" className="mt-7 space-y-1.5">
            {bars.map((b, i) => (
              <div key={i} className="h-1.5 rounded-full bg-[#0b1530]/[0.07]">
                <div className="h-full rounded-full" style={{ width: `${b}%`, background: i === 0 ? "#2563f6" : `rgba(37,99,246,${0.75 - i * 0.12})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
