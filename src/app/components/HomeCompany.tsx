import { useRef } from "react";
import { useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import L from "./L";
import { useT } from "../../lib/useT";
import { FOUNDERS, TEAM_READY } from "../../lib/team";
import { TwoTone } from "./Plate";
import placeWide from "../../assets/photos/philharmonie-1200.webp";
import placeNarrow from "../../assets/photos/philharmonie-700.webp";

/**
 * 05 auf der Startseite: das Unternehmen.
 *
 * Wir zeigen uns als Firma, nicht als Zwei-Mann-Betrieb: ein Bild vom
 * Arbeiten, darunter die Fakten auf Haarlinien - Gesellschaft, Buero,
 * Sprachen - und die Leitung als eine Zeile. Die beiden Gruender stehen mit
 * Namen und Rolle da, klein, als Teil des Unternehmens.
 *
 * Die Portraets sind Freisteller auf transparentem Grund, also object-contain
 * und unten ausgerichtet auf einer Flaechenstufe (siehe CLAUDE.md). Geladen
 * werden sie erst in der Naehe des Abschnitts; loading="lazy" allein greift
 * hier nicht, siehe FoundersNote. Fehlt eine der beiden Dateien, entfaellt
 * die Zeile (TEAM_READY).
 *
 * Das Foto ist unser eigenes: der Kirchberg mit der Philharmonie und den
 * bemalten Stufen, hochkant, so wie aufgenommen. Die Gruender stehen seit
 * dem 13.10.2026 als zwei Portraetkarten da statt als Avatare.
 */
export default function HomeCompany() {
  const t = useT();
  const c = t.home.company;
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "600px" });

  const facts = [
    { label: c.labels.company, value: c.entity },
    { label: c.labels.office, value: c.office },
    { label: c.labels.languages, value: c.languages },
  ];

  return (
    <section id="about" style={{ paddingBlock: "var(--section-pad)" }}>
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-14"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <div className="lg:col-span-5 min-w-0">
          <div
            className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span>
              <span className="text-[var(--metal)]">07</span> / {c.eyebrow}
            </span>
          </div>
          <h2
            className="text-[var(--text-hi)] font-medium mt-8"
            style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.025em", maxWidth: "13ch" }}
          >
            <TwoTone text={c.title} />
          </h2>
          <p className="text-[var(--text-mid)] mt-7" style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "40ch" }}>
            {c.lead}
          </p>

          <dl className="mt-10 border-t border-[var(--line)]">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)] gap-x-6 gap-y-1 py-4 border-b border-[var(--line)]">
                <dt
                  className="eyebrow-mono uppercase text-[var(--text-low)] sm:pt-1"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {f.label}
                </dt>
                <dd className="m-0 text-[var(--text-hi)]" style={{ fontSize: "var(--t-body)" }}>
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Die Leitung: zwei Portraetkarten. Freisteller, also contain und
              unten ausgerichtet auf einer Flaechenstufe - nie beschnitten. */}
          {TEAM_READY && (
            <div ref={ref} className="mt-12">
              <div
                className="eyebrow-mono uppercase text-[var(--text-low)]"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {c.labels.leadership}
              </div>
              <ul className="grid grid-cols-2 gap-4 mt-5">
                {FOUNDERS.map((f) => (
                  <li
                    key={f.key}
                    className="card-glow overflow-hidden border border-[var(--line)] bg-[var(--surface-1)]"
                    style={{ borderRadius: "var(--radius-2)" }}
                  >
                    <div className="relative aspect-square bg-[var(--surface-2)] flex items-end justify-center overflow-hidden">
                      {/* Zwei abgerundete Verlaufs-Formen hinter dem
                          Freisteller, wie bei nvision (dort violett, hier
                          Electric Blue und Cyan). Dekorativ. */}
                      <span
                        aria-hidden="true"
                        className="absolute w-[46%] h-[92%] rounded-full -rotate-[32deg] left-[22%] top-[2%] opacity-90"
                        style={{ background: "linear-gradient(160deg, #2563f6, #1747c4)" }}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute w-[28%] h-[52%] rounded-full -rotate-[32deg] left-[58%] top-[30%] opacity-80"
                        style={{ background: "linear-gradient(160deg, #3ce7fc, #2563f6)" }}
                      />
                      {near && (
                        <img
                          src={f.photo}
                          alt={t.home.founders.photoAlt(f.name, t.home.founders.role)}
                          width={800}
                          height={800}
                          decoding="async"
                          className="relative w-full h-full object-contain object-bottom"
                        />
                      )}
                    </div>
                    <div className="px-4 sm:px-5 py-4">
                      <div className="display text-[var(--text-hi)]" style={{ fontSize: "clamp(1rem, 0.9rem + 0.4vw, 1.25rem)", letterSpacing: "-0.01em" }}>
                        {f.name}
                      </div>
                      <div
                        className="eyebrow-mono uppercase text-[var(--text-low)] mt-1.5"
                        style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}
                      >
                        {t.home.founders.role}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Die ganze Mannschaft und wie wir arbeiten: /about. */}
          <L
            to="/about"
            className="group mt-10 inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[var(--line-strong)] text-[var(--text-hi)] font-medium hover:bg-[var(--surface-1)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)" }}
          >
            {c.teamLink}
            <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
          </L>
        </div>

        <div className="lg:col-span-7 min-w-0">
          <div
            className="relative overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] aspect-[4/5] lg:sticky lg:top-24"
            style={{ borderRadius: "var(--radius-2)" }}
          >
            <img
              src={placeWide}
              srcSet={`${placeNarrow} 700w, ${placeWide} 1200w`}
              sizes="(min-width: 1024px) 55vw, 100vw"
              alt={c.photoAlt}
              width={1200}
              height={1476}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "saturate(0.8) contrast(1.04)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
