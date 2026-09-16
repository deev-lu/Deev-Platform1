import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import L from "./L";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  Cpu,
  Layers,
  Lightbulb,
  MapPin,
  Play,
  Tag,
  Target,
  TrendingUp,
} from "lucide-react";
import { getProject, nextProject, sectorOf, type Project } from "../../lib/projects";
import { useT, useLocalePath, useLocale } from "../../lib/useT";
import type { Locale } from "../../lib/i18n";
import { track } from "../../lib/analytics";

/**
 * /work/:slug — a dedicated page per project.
 *
 * Opens full-bleed on the project's own image with the title over it, then a
 * mono specification table, then whatever narrative exists. Blocks with no
 * content simply do not render, so a project carrying only facts still reads
 * as a finished page rather than a page with holes in it.
 */
export default function WorkCase() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const t = useT();
  const locale = useLocale();
  const localePath = useLocalePath();
  const project = getProject(slug);

  useEffect(() => {
    // Stay in the reader's language when a bad slug bounces to the homepage.
    if (!project) navigate(localePath("/"), { replace: true });
  }, [project, navigate, localePath]);

  // Welche Referenz wird wirklich gelesen? Das entscheidet, welche drei auf
  // der Startseite stehen sollten - bisher war das eine Vermutung.
  useEffect(() => {
    if (project) track("case_view", { project: project.slug, locale });
  }, [project, locale]);

  if (!project) return null;

  const next = nextProject(project.slug);

  /* Die harten Angaben. Sie stehen jetzt als ruhige Zeile unter dem Titel
     statt in einer Tafel neben der Erzählung: eine Fallstudie wird gelesen,
     nicht abgeglichen, und eine Spalte Metadaten neben dem Fließtext zwingt
     das Auge bei jedem Absatz zurück nach links. */
  /* Die Eckdaten im Kopf: kurz, mit Symbol, und nur was belegt ist. */
  const keyFacts = [
    { icon: Calendar, label: t.pages.workCase.spec.year, value: String(project.year) },
    project.scope?.length
      ? {
          icon: Layers,
          label: t.pages.workCase.services,
          value: project.scope.map((k) => t.pages.workCase.scopeItems[k]).join(", "),
        }
      : null,
    project.location ? { icon: MapPin, label: t.pages.workCase.snapshot.location, value: project.location } : null,
    project.industry
      ? { icon: Building2, label: t.pages.workCase.snapshot.industry, value: project.industry[locale] }
      : null,
  ].filter((r): r is { icon: typeof Calendar; label: string; value: string } => r !== null);

  const facts = [
    { label: t.pages.workCase.spec.sector, value: sectorOf(project, locale) },
    project.industry ? { label: t.pages.workCase.snapshot.industry, value: project.industry[locale] } : null,
    project.audience ? { label: t.pages.workCase.snapshot.audience, value: project.audience[locale] } : null,
    project.location ? { label: t.pages.workCase.snapshot.location, value: project.location } : null,
    { label: t.pages.workCase.spec.year, value: String(project.year) },
    project.scope?.length
      ? {
          label: t.pages.workCase.services,
          value: project.scope.map((k) => t.pages.workCase.scopeItems[k]).join(", "),
        }
      : null,
    project.stack?.length
      ? { label: t.pages.workCase.spec.stack, value: project.stack.join(", ") }
      : null,
  ].filter((r): r is { label: string; value: string } => r !== null);

  /* Fünf Kapitel, in fester Reihenfolge, jedes einzeln optional. Die
     Nummerierung läuft über das, was tatsächlich da ist - eine Fallstudie mit
     drei Kapiteln zählt 01, 02, 03 und nicht 01, 03, 05. */
  const c = t.pages.workCase.chapters;
  const chapters = (
    [
      [c.context, project.context?.[locale]],
      [c.challenge, project.challenge?.[locale]],
      [c.approach, project.approach?.[locale]],
      [c.execution, project.execution?.[locale]],
      [c.outcome, project.outcome?.[locale]],
    ] as [string, string | undefined][]
  )
    .filter((r): r is [string, string] => Boolean(r[1]))
    .map(([heading, body], i) => ({ heading, body, n: String(i + 1).padStart(2, "0") }));

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">

      {/* ── Kopf: Name links, die Seite rechts ──────────────────
          Zweispaltig wie der Hero der Startseite. Vorher standen Titel und
          Vorschau untereinander, wodurch die Vorschau erst nach dem Scrollen
          begann und der Kopf leer wirkte. Nebeneinander sieht man in einem
          Blick, um welches Projekt es geht und wie es aussieht. */}
      <header className="relative">
        <div
          className="mx-auto pt-14"
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
        >
          <L
            to="/work"
            className="group inline-flex items-center gap-2 text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)] mb-12"
            style={{ fontSize: "var(--t-small)" }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:-translate-x-1" strokeWidth={1.5} />
            {t.pages.workCase.back}
          </L>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 items-start">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-text)]" aria-hidden="true" />
                <span
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {sectorOf(project, locale)}
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
                className="text-[var(--text-hi)] font-medium"
                style={{
                  fontSize: "clamp(2.25rem, 1rem + 3.2vw, 3.5rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.03em",
                }}
              >
                {project.title}
              </motion.h1>

              {project.ownProduct && (
                <span
                  className="eyebrow-mono uppercase inline-flex items-center h-7 px-3 mt-6 border border-[var(--line-strong)] text-[var(--text-mid)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", borderRadius: "var(--radius-1)" }}
                >
                  {t.pages.workCase.ownProduct}
                </span>
              )}

              {/* Eckdaten direkt unter dem Namen, mit Symbolen. Sie standen
                  vorher weit unten; hier beantworten sie in einem Blick, was
                  das Projekt ist - und das ist die erste Frage. */}
              {/* Untereinander, nicht nebeneinander.
                  Nebeneinander umbrachen die Angaben je nach Textlaenge in
                  unterschiedlich viele Zeilen, und es entstand ein unruhiger
                  Block. Untereinander hat jede Angabe dieselbe Zeile:
                  Beschriftung links in fester Breite, Wert rechts - das Auge
                  laeuft eine Kante entlang statt zu suchen. */}
              <dl className="mt-10 border-t border-[var(--line)]">
                {keyFacts.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-baseline gap-4 py-4 border-b border-[var(--line)]"
                  >
                    <Icon
                      className="w-4 h-4 shrink-0 translate-y-[3px] text-[var(--signal-text)]"
                      strokeWidth={1.5}
                    />
                    <dt
                      className="eyebrow-mono uppercase text-[var(--text-low)] shrink-0"
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", width: "9rem" }}
                    >
                      {label}
                    </dt>
                    <dd className="text-[var(--text-hi)] min-w-0" style={{ fontSize: "var(--t-small)" }}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-7">
              <SitePreview project={project} locale={locale} t={t} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Specification ───────────────────────────────────────── */}
      <section
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
      >
        {/* Eine Spalte, editorial gesetzt.
            Vorher standen Fakten und Erzählung als zwei Tafeln nebeneinander.
            Das liest sich wie ein Datenblatt; eine Fallstudie soll aber von
            oben nach unten erzählen. Jetzt: der Eröffnungssatz groß, darunter
            die Angaben als ruhige Zeile, dann die Kapitel. */}

        {project.summary?.[locale] && (
          <p
            className="text-[var(--text-hi)] font-medium"
            style={{
              fontSize: "clamp(1.5rem, 1rem + 1.6vw, 2.25rem)",
              lineHeight: 1.22,
              letterSpacing: "-0.02em",
              maxWidth: "26ch",
            }}
          >
            {project.summary[locale]}
          </p>
        )}

        {/* Die Angaben. Klein, einzeilig, am oberen Rand der Erzählung - sie
            beantworten "was war das", nicht "warum lesen". */}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 h-[52px] px-7 mt-12 bg-[var(--signal)] text-white font-medium"
            style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
          >
            {t.pages.workCase.visit}
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </a>
        )}

        {/* Die Kapitel. Links die Nummer und der Name, rechts der Text - ein
            Leser kann so überfliegen, wo er ist, ohne den Absatz zu lesen. Die
            Zeilenlänge bleibt bei 62 Zeichen; breiter wird Fließtext
            anstrengend, egal wie viel Platz daneben frei ist. */}
        {chapters.length > 0 ? (
          <div className="mt-24 border-t border-[var(--line)]">
            {chapters.map(({ heading, body, n }) => (
              <div
                key={heading}
                className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-5 py-14 border-b border-[var(--line)]"
              >
                <div className="lg:col-span-4">
                  <div className="flex items-baseline gap-4 lg:sticky lg:top-28">
                    <span
                      className="eyebrow-mono text-[var(--metal)]"
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      {n}
                    </span>
                    <h2
                      className="text-[var(--text-hi)] font-medium"
                      style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.015em" }}
                    >
                      {heading}
                    </h2>
                  </div>
                </div>
                <p
                  className="lg:col-span-8 text-[var(--text-mid)]"
                  style={{ fontSize: "var(--t-lead)", lineHeight: 1.6, maxWidth: "62ch" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p
            className="text-[var(--text-mid)] mt-20 pt-10 border-t border-[var(--line)]"
            style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "62ch" }}
          >
            {t.pages.workCase.specOnly}
          </p>
        )}

        {/* Belegte Kennzahlen. Fehlen sie, verschwindet der Abschnitt
            vollstaendig - es gibt hier absichtlich keinen Platzhalter. Eine
            erfundene Prozentzahl auf einer Referenzseite ist der teuerste
            Fehler, den diese Website machen kann. */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-10 mt-20 pt-14 border-t border-[var(--line)]">
            {project.metrics.map((m) => (
              <div key={m.value}>
                <div
                  className="text-[var(--text-hi)] font-medium"
                  style={{ fontSize: "clamp(2.5rem, 1.5rem + 3vw, 4rem)", lineHeight: 1, letterSpacing: "-0.03em" }}
                >
                  {m.value}
                </div>
                <div className="text-[var(--text-mid)] mt-3" style={{ fontSize: "var(--t-small)" }}>
                  {m.label[locale]}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Was geliefert wurde, projektspezifisch. Nummeriert statt als
            Symbolkarten: es ist eine Liste von Arbeit, kein Leistungskatalog. */}
        {project.deliverables?.[locale]?.length ? (
          <div className="mt-20 pt-14 border-t border-[var(--line)]">
            <h2
              className="text-[var(--text-hi)] font-medium"
              style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.015em" }}
            >
              {t.pages.workCase.deliverables}
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-0 mt-8">
              {project.deliverables[locale].map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 py-3.5 border-b border-[var(--line)]"
                  style={{ fontSize: "var(--t-body)" }}
                >
                  <span
                    className="eyebrow-mono text-[var(--metal)] shrink-0"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[var(--text)]">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {/* Die technischen Entscheidungen. Der Grund, warum dieser Abschnitt
            existiert: DEEV ist nicht nur eine Designagentur, und das sieht man
            einem Screenshot nicht an. */}
        {project.technical?.[locale]?.length ? (
          <div className="mt-20 pt-14 border-t border-[var(--line)]">
            <h2
              className="text-[var(--text-hi)] font-medium"
              style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.015em" }}
            >
              {t.pages.workCase.technical}
            </h2>
            <ul className="mt-8 space-y-4" style={{ maxWidth: "70ch" }}>
              {project.technical[locale].map((item) => (
                <li key={item} className="flex gap-4 text-[var(--text)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.5 }}>
                  <span className="mt-[0.62em] h-px w-4 shrink-0 bg-[var(--signal)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Nur mit echtem, freigegebenem Zitat. */}
        {project.testimonial && (
          <figure className="mt-20 pt-14 border-t border-[var(--line)]">
            <blockquote
              className="text-[var(--text-hi)] font-medium"
              style={{ fontSize: "clamp(1.375rem, 1rem + 1.2vw, 1.875rem)", lineHeight: 1.35, letterSpacing: "-0.015em", maxWidth: "30ch" }}
            >
              {project.testimonial.quote[locale]}
            </blockquote>
            <figcaption className="text-[var(--text-mid)] mt-6" style={{ fontSize: "var(--t-small)" }}>
              {project.testimonial.name}
              {project.testimonial.role ? ` \u00B7 ${project.testimonial.role[locale]}` : ""}
            </figcaption>
          </figure>
        )}
      </section>

      {/* ── Next project ────────────────────────────────────────── */}
      <section className="border-t border-[var(--line)]">
        <L
          to={`/work/${next.slug}`}
          className="group block hover:bg-[var(--surface-1)] transition-colors duration-[240ms]"
        >
          <div
            className="mx-auto flex items-baseline justify-between gap-8"
            style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "clamp(56px, 7vw, 96px)" }}
          >
            <div>
              <span
                className="eyebrow-mono uppercase text-[var(--text-low)] block mb-4"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {t.pages.workCase.next}
              </span>
              <span
                className="text-[var(--text-hi)] font-medium"
                style={{ fontSize: "var(--t-h2)", letterSpacing: "-0.025em" }}
              >
                {next.title}
              </span>
            </div>
            <ArrowUpRight
              className="w-7 h-7 shrink-0 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-all duration-[var(--dur-1)] group-hover:translate-x-1 group-hover:-translate-y-1"
              strokeWidth={1}
            />
          </div>
        </L>
      </section>
    </main>
  );
}

/**
 * Die ausgelieferte Seite in einem Browserfenster.
 *
 * Standardmäßig steht dort die Aufnahme. Ein Klick auf „Live" tauscht sie
 * gegen die echte Website in einem `<iframe>`, in dem man scrollen kann wie in
 * einem Browser.
 *
 * Warum nicht gleich live? Drei Gründe, jeder für sich ausreichend:
 *
 *   Manche Seiten verbieten das Einbetten (`X-Frame-Options`,
 *   `frame-ancestors`). Der Browser zeigt dann eine graue Fehlerseite - und
 *   die deckt die Aufnahme darunter zu. Auf einer Referenzseite ist ein
 *   graues Rechteck dort, wo die Arbeit stehen soll, schlimmer als gar keine
 *   Live-Ansicht. Ob eine Seite es erlaubt, lässt sich von hier aus nicht
 *   prüfen und aus dem Browser heraus auch nicht zuverlässig erkennen: ein
 *   blockierter Rahmen meldet trotzdem „geladen".
 *
 *   Eine fremde Website vollständig zu laden heißt, ihre Skripte und Cookies
 *   mitzuladen - ohne dass unser Einwilligungsbanner davon etwas weiß. Nach
 *   einem Klick ist das eine bewusste Handlung des Besuchers.
 *
 *   Es ist teuer. Eine komplette Fremdseite im ersten Seitenaufbau kostet
 *   mehr als alles andere auf dieser Seite zusammen.
 *
 *   `sandbox` erlaubt der eingebetteten Seite nur, sich selbst darzustellen:
 *   ohne `allow-top-navigation` kann sie unseren Tab nicht umleiten, ohne
 *   `allow-popups` kein Fenster öffnen.
 */
function SitePreview({
  project,
  locale,
  t,
}: {
  project: Project;
  locale: Locale;
  t: ReturnType<typeof useT>;
}) {
  const [live, setLive] = useState(false);
  const domain = project.link?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const canEmbed = Boolean(project.link) && !project.noEmbed;

  return (
    <div
      className="group border border-[var(--line)] bg-[var(--surface-1)] overflow-hidden"
      style={{ borderRadius: "var(--radius-1)" }}
    >
      <div className="flex items-center gap-3 px-4 h-11 border-b border-[var(--line)] bg-[var(--surface-2)]">
        <span className="flex gap-1.5 shrink-0" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-[var(--line-strong)]" />
          ))}
        </span>
        <span
          className="eyebrow-mono lowercase text-[var(--text-low)] truncate"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.08em" }}
        >
          {domain}
        </span>

        <span className="ml-auto shrink-0 flex items-center gap-4">
          {canEmbed && !live && (
            <button
              type="button"
              onClick={() => setLive(true)}
              className="eyebrow-mono uppercase inline-flex items-center gap-1.5 h-7 px-2.5 border border-[var(--line-strong)] text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", borderRadius: "var(--radius-1)" }}
            >
              <Play className="w-3 h-3" strokeWidth={2} />
              {t.pages.workCase.livePreview}
            </button>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-label)" }}
            >
              {t.pages.workCase.visit}
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          )}
        </span>
      </div>

      {/* Die Aufnahme bestimmt die Fensterhoehe.
          Mit einer festen Hoehe oder einem festen Seitenverhaeltnis passte sie
          nie genau: entweder wurde sie seitlich beschnitten, um zu fuellen,
          oder es blieb ein dunkles Band darunter. Steht sie im normalen Fluss,
          ist das Fenster exakt so hoch wie sie - unabhaengig davon, wie die
          Datei geschnitten ist.

          Die Obergrenze fasst nur sehr hohe Aufnahmen, also
          Ganzseiten-Screenshots. Bei denen ist Beschneiden richtig: ihren
          Verlauf sieht man in der Live-Ansicht. */}
      <div
        className="relative overflow-hidden bg-[var(--surface-0)]"
        style={{ maxHeight: "min(68vh, 700px)" }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title}, ${sectorOf(project, locale)}`}
            width={1200}
            height={748}
            loading="eager"
            {...({ fetchpriority: "high" } as Record<string, string>)}
            decoding="async"
            className="w-full h-auto block"
          />
        ) : (
          <div style={{ aspectRatio: "16 / 10" }} />
        )}

        {live && project.link && (
          <iframe
            src={project.link}
            title={`${project.title} \u2014 ${domain}`}
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full border-0"
            // Ohne diese Markierung bewegt Lenis beim Rad ueber dem Rahmen die
            // Seite statt der eingebetteten Website.
            data-lenis-prevent
          />
        )}
      </div>
    </div>
  );
}
