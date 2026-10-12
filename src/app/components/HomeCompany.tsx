import { useRef } from "react";
import { useInView } from "motion/react";
import { useT } from "../../lib/useT";
import { FOUNDERS, TEAM_READY } from "../../lib/team";
import office from "../../assets/photos/office-night-1400.webp";

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
 * Das Foto ist ein Unsplash-Platzhalter (freie Lizenz) bis zum Shooting:
 * Buerofenster bei Nacht, die Menschen darin zu klein, um jemand zu sein.
 */
export default function HomeCompany() {
  const t = useT();
  const c = t.home.company;
  const ref = useRef<HTMLDListElement>(null);
  const near = useInView(ref, { once: true, margin: "600px" });

  const facts = [
    { label: c.labels.company, value: c.entity },
    { label: c.labels.office, value: c.office },
    { label: c.labels.languages, value: c.languages },
  ];

  return (
    <section id="about" className="bg-[var(--surface-0)]" style={{ paddingBlock: "var(--section-y-lg)" }}>
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-14"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <div className="lg:col-span-5">
          <div
            className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span>
              <span className="text-[var(--metal)]">05</span> / {c.eyebrow}
            </span>
          </div>
          <h2
            className="text-[var(--text-hi)] font-medium mt-8"
            style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.025em", maxWidth: "11ch" }}
          >
            {c.title}
          </h2>
          <p className="text-[var(--text-mid)] mt-7" style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "36ch" }}>
            {c.lead}
          </p>
        </div>

        <div className="lg:col-span-7 min-w-0">
          <div className="dark relative overflow-hidden border border-[var(--line)] bg-[var(--surface-1)] aspect-[16/9]">
            <img
              src={office}
              alt=""
              width={1400}
              height={526}
              loading="lazy"
              decoding="async"
              className="m-grade absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <dl ref={ref} className="mt-10 border-t border-[var(--line)]">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)] gap-x-6 gap-y-1 py-5 border-b border-[var(--line)]">
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

            {TEAM_READY && (
              <div className="grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)] gap-x-6 gap-y-3 py-5 border-b border-[var(--line)] sm:items-center">
                <dt
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {c.labels.leadership}
                </dt>
                <dd className="m-0 flex flex-wrap gap-x-8 gap-y-4">
                  {FOUNDERS.map((f) => (
                    <span key={f.key} className="inline-flex items-center gap-3">
                      <span className="w-11 h-11 shrink-0 overflow-hidden bg-[var(--surface-2)] flex items-end justify-center">
                        {near && (
                          <img
                            src={f.photo}
                            alt={t.home.founders.photoAlt(f.name, t.home.founders.role)}
                            width={800}
                            height={800}
                            decoding="async"
                            className="w-full h-full object-contain object-bottom"
                          />
                        )}
                      </span>
                      <span style={{ fontSize: "var(--t-small)", lineHeight: 1.35 }}>
                        <span className="block text-[var(--text-hi)]">{f.name}</span>
                        <span className="block text-[var(--text-mid)]">{t.home.founders.role}</span>
                      </span>
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
