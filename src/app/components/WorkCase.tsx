import { useEffect } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import L from "./L";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  Cpu,
  Lightbulb,
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

      {/* ── Kopf ────────────────────────────────────────────────
          Vorher lag die Aufnahme als ganzflächiges Band über die halbe
          Bildschirmhöhe, mit einem Farbverlauf darüber und dem Titel darauf.
          Das war aus zwei Gründen falsch: `object-cover` schneidet bei jedem
          Seitenverhältnis anders zu, und je höher die Aufnahme, desto mehr
          Seite fiel weg — bei FIT blieb vom Auftritt ein Streifen übrig. Und
          wer auf einer Referenzseite landet, will die Arbeit sehen, nicht
          einen zugeschnittenen Ausschnitt davon.

          Jetzt steht die Aufnahme in einem Browserfenster, wie im Hero der
          Startseite: vollständig, nichts beschnitten, und scrollbar, wenn sie
          höher ist als der Rahmen. Ein Klick öffnet die echte Seite. */}
      <header className="relative">
        <div
          className="mx-auto pt-16"
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
        >
          <L
            to="/work"
            className="group inline-flex items-center gap-2 text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)] mb-10"
            style={{ fontSize: "var(--t-small)" }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:-translate-x-1" strokeWidth={1.5} />
            {t.pages.workCase.back}
          </L>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.025em", maxWidth: "16ch" }}
          >
            {project.title}
          </motion.h1>

          {/* Billovio ist unser eigenes Produkt, kein Kundenauftrag. Das muss
              dranstehen: in einer Referenzliste liest es sich sonst wie ein
              Kunde, den es nicht gibt. */}
          {project.ownProduct && (
            <span
              className="eyebrow-mono uppercase inline-flex items-center h-7 px-3 mt-6 border border-[var(--line-strong)] text-[var(--text-mid)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", borderRadius: "var(--radius-1)" }}
            >
              {t.pages.workCase.ownProduct}
            </span>
          )}

          {project.image && <SitePreview project={project} locale={locale} t={t} />}
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
        <dl className="flex flex-wrap gap-x-12 gap-y-6 mt-14 pt-10 border-t border-[var(--line)]">
          {facts.map(({ label, value }) => (
            <div key={label} className="min-w-0">
              <dt
                className="eyebrow-mono uppercase text-[var(--text-low)]"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {label}
              </dt>
              <dd className="text-[var(--text-hi)] mt-2" style={{ fontSize: "var(--t-body)" }}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

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
 * Drei Entscheidungen, die den Unterschied zum vorherigen Vollbild-Band
 * ausmachen:
 *
 *   Nichts wird beschnitten. Die Aufnahme läuft in voller Breite und
 *   natürlicher Höhe; ist sie höher als der Rahmen, wird sie scrollbar, statt
 *   dass der untere Teil der Seite verschwindet. Bei einer Aufnahme über die
 *   ganze Seitenlänge kann man so den kompletten Auftritt durchsehen.
 *
 *   Der Rahmen hat ein festes Verhältnis. Die Höhe der Aufnahme bestimmt damit
 *   nicht mehr, wie viel Bildschirm die Seite belegt - vorher entschied das
 *   Seitenverhältnis der Datei über das Layout.
 *
 *   Ein Klick öffnet die echte Seite. Der Rahmen ist ein Link, kein Bild mit
 *   Klickhandler: er lässt sich mit der Tastatur erreichen, in einem neuen Tab
 *   öffnen und von Suchmaschinen lesen. Scrollen und Klicken stören einander
 *   nicht - gescrollt wird mit dem Rad, navigiert wird mit dem Klick.
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
  const domain = project.link?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const frame = (
    <div
      className="border border-[var(--line)] bg-[var(--surface-1)] overflow-hidden"
      style={{ borderRadius: "var(--radius-1)" }}
    >
      {/* Die Leiste sagt „Website", ohne die Aufnahme in ein Gerät zu stecken. */}
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
        {project.link && (
          <span
            className="ml-auto shrink-0 inline-flex items-center gap-1.5 text-[var(--text-mid)] group-hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-label)" }}
          >
            {t.pages.workCase.visit}
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </span>
        )}
      </div>

      {/* Der Fensterinhalt. `overscroll-contain` verhindert, dass das Scrollen
          am Ende der Aufnahme auf die Seite durchschlägt. */}
      {/* Eine Obergrenze, keine feste Höhe.
          Mit einem Seitenverhältnis richtete sich die Höhe nach der Datei: eine
          hohe Aufnahme belegte den halben Bildschirm, und weil sie dann genau
          hineinpasste, gab es nichts zu scrollen. Eine feste Höhe wiederum
          hinterließ auf dem Telefon leere Fläche, weil die Aufnahme dort auf
          390px Breite nur noch gut 240px hoch ist.

          Eine Obergrenze löst beides: ist die Aufnahme höher, wird gedeckelt
          und scrollbar; ist sie kürzer, endet der Rahmen mit ihr. */}
      <div
        className="overflow-y-auto overscroll-contain bg-[var(--surface-0)] site-preview"
        style={{ maxHeight: "clamp(280px, 52vh, 600px)" }}
        /* Lenis faengt das Mausrad seitenweit ab und bewegt damit das Fenster.
           Ohne diese Markierung scrollte ueber dem Rahmen also die Seite
           weiter, und der Rahmen blieb stehen - nachgemessen: Seite 233 auf
           430, Rahmen 0. `data-lenis-prevent` gibt das Rad ueber diesem
           Element wieder an den Browser zurueck. */
        data-lenis-prevent
      >
        <img
          src={project.image}
          alt={`${project.title}, ${sectorOf(project, locale)}`}
          width={1200}
          height={748}
          // Das ist das LCP-Bild dieser Seite.
          loading="eager"
          {...({ fetchpriority: "high" } as Record<string, string>)}
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
    </div>
  );

  if (!project.link) return <div className="mt-12">{frame}</div>;

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block mt-12"
      aria-label={`${project.title} — ${t.pages.workCase.visit}`}
    >
      {frame}
    </a>
  );
}
