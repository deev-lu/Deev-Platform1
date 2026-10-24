import { ArrowRight } from "lucide-react";
import L from "./L";
import { TwoTone } from "./Plate";
import { useT } from "../../lib/useT";
import photo from "../../assets/photos/gelle-fra-900.webp";

/**
 * 02 auf der Startseite: Workshops und Beratung, als eigene Leistung.
 *
 * Der Einstieg in fast jedes Projekt und eine Leistung, die fuer sich verkauft
 * wird - deshalb ein eigener, betonter Abschnitt direkt nach "Was wir tun":
 * eine eingelassene Flaeche mit tiefblauem Verlauf, links das Angebot (drei
 * Formate, ein aktuelles Konzept als Beleg, der Foerderweg), rechts die Gëlle
 * Fra hochkant.
 *
 * Inhalt: nur, was die KI-Seite schon sagt (home.ai) - Methode, das Konzept
 * fuer die Immobilienverwaltungsgruppe, die SME Packages. Keine Preise und
 * keine Dauer: die stehen nirgends und gehoeren ins Gespraech.
 *
 * In beiden Themen dunkel (`dark`, data-surface).
 */
export default function HomeWorkshops() {
  const t = useT();
  const w = t.home.workshops;

  return (
    <section id="workshops" aria-labelledby="workshops-title" className="bg-[var(--surface-0)] md:px-2 lg:px-3">
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

        <div
          className="relative mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-12"
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
        >
          <div className="lg:col-span-7 min-w-0">
            <div
              className="flex items-center gap-4 eyebrow-mono uppercase text-[#c7dcff]/80"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="h-px w-10 bg-white/25" />
              <span>
                <span className="text-[#7faeff]">02</span> / {w.eyebrow}
              </span>
            </div>
            <h2
              id="workshops-title"
              className="text-[var(--text-hi)] font-medium mt-8"
              style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "16ch" }}
            >
              <TwoTone text={w.title} />
            </h2>
            <p className="text-[var(--text)] mt-7 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.5, maxWidth: "52ch" }}>
              {w.lead}
            </p>

            <ol className="mt-12 border-t border-white/12">
              {w.offers.map((o, i) => (
                <li key={o.title} className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 py-6 border-b border-white/12">
                  <span className="eyebrow-mono text-[#7faeff] pt-1.5" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="display text-white m-0" style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.015em" }}>
                      {o.title}
                    </h3>
                    <p className="text-[var(--text-mid)] mt-2 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "58ch" }}>
                      {o.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-10">
              <L
                to="/contact?interest=workshop"
                className="m-arrow inline-flex items-center justify-center gap-2.5 px-6 text-white font-semibold hover:brightness-110 transition-[filter] duration-[var(--dur-1)]"
                style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)", background: "linear-gradient(100deg, #4c8dff, #2563f6)" }}
              >
                {w.primary}
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </L>
              <L
                to="/workshops"
                className="inline-flex items-center justify-center px-6 border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium transition-colors duration-[var(--dur-1)]"
                style={{ height: 52, fontSize: "var(--t-small)", borderRadius: "var(--radius-pill)" }}
              >
                {w.secondary}
              </L>
            </div>
          </div>

          <div className="lg:col-span-5 min-w-0 flex flex-col gap-4">
            <div className="relative overflow-hidden aspect-[4/5] lg:aspect-auto lg:flex-1 lg:min-h-[420px]" style={{ borderRadius: "var(--radius-2)" }}>
              <img
                src={photo}
                alt={w.photoAlt}
                width={900}
                height={1350}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-[50%_45%]"
              />
            </div>
            <div className="p-6 border border-white/12 bg-white/[0.05]" style={{ borderRadius: "var(--radius-2)" }}>
              <div className="eyebrow-mono uppercase text-[#7faeff]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                {w.proofLabel}
              </div>
              <p className="text-white mt-3 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
                {w.proof}
              </p>
              <p className="text-[var(--text-mid)] mt-4 pt-4 mb-0 border-t border-white/10" style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}>
                {w.funding}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
