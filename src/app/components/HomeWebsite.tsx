import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, BadgeEuro, Phone } from "lucide-react";
import L from "./L";
import { TwoTone } from "./Plate";
import { useT, useLocale } from "../../lib/useT";
import { getProject, sectorOf, type Project } from "../../lib/projects";
import { FOUNDERS, TEAM_READY } from "../../lib/team";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "../../lib/whatsapp";
import { domainOf } from "./Hero";
import WebsiteRequestForm from "./WebsiteRequestForm";
import { MORE_SERVICES } from "../../lib/serviceSections";

/**
 * Die Startseite seit dem 25.11.2026, nach dem Hero: drei Kundenprojekte
 * (01), der Ablauf (02), die Budgetorientierung (03), der persoenliche
 * Kontakt mit Sven und Fabio samt kurzer Anfrage (04), dann knapp die
 * weiteren Leistungen (05). Website-Projekte sind das Hauptgeschaeft; alles
 * andere hat eine eigene Seite und steht hier nur als Wegweiser.
 *
 * Die nummerierten Augenbrauen folgen dieser Reihenfolge (SectionTicks liest
 * sie). Alte Kampagnenanker bleiben erreichbar: #portfolio bei den
 * Projekten, #pricing und #project-builder beim Budget, #about beim Kontakt.
 */

const wrap = { maxWidth: "var(--container)", paddingInline: "var(--gutter)" } as const;

function Eyebrow({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
      <span className="h-px w-10 bg-[var(--line-strong)]" aria-hidden="true" />
      <span>
        <span className="text-[var(--metal)]">{n}</span> / {children}
      </span>
    </div>
  );
}

const h2Style = { fontSize: "var(--t-h2)", lineHeight: 1.06, letterSpacing: "-0.025em" } as const;

/* ── 01 Projekte ──────────────────────────────────────────────────────── */

/** The three projects, in this order. Facts and screenshots from projects.data.json. */
export const HOME_PROJECTS = ["bureau-immobilier-feltes", "fachinstitut-tierheilkunde", "vino-amore"] as const;

export function HomeProjects() {
  const t = useT();
  const p = t.web.projects;
  const projects = HOME_PROJECTS.map((slug) => getProject(slug)).filter((x): x is Project => Boolean(x?.image));

  return (
    <section id="projects" aria-labelledby="projects-title" style={{ paddingBlock: "var(--section-pad)", scrollMarginTop: 72 }}>
      {/* Alter Anker aus Kampagnen und fremden Links. */}
      <span id="portfolio" aria-hidden="true" />
      <div className="mx-auto" style={wrap}>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <Eyebrow n="01">{p.eyebrow}</Eyebrow>
            <h2 id="projects-title" className="text-[var(--text-hi)] font-medium mt-6 mb-0" style={{ ...h2Style, maxWidth: "20ch" }}>
              <TwoTone text={p.title} />
            </h2>
            <p className="text-[var(--text-mid)] mt-5 mb-0" style={{ fontSize: "var(--t-lead)", lineHeight: 1.5, maxWidth: "48ch" }}>
              {p.lead}
            </p>
          </div>
          <L
            to="/work"
            className="btn-ghost self-start lg:self-auto shrink-0 inline-flex items-center gap-2 h-11 px-5 rounded-full font-medium"
            style={{ fontSize: "var(--t-small)" }}
          >
            {p.all}
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
          </L>
        </div>

        <ul className="m-0 p-0 list-none flex flex-col gap-14 lg:gap-20 mt-10 lg:mt-16">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <ProjectRow project={project} flip={i % 2 === 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectRow({ project, flip }: { project: Project; flip: boolean }) {
  const t = useT();
  const locale = useLocale();
  const p = t.web.projects;
  const href = `/work/${project.slug}`;

  return (
    <article className="group grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6 items-center">
      {/* Das Bildschirmfoto gross, im Browserrahmen mit der echten Domain.
          Derselbe Link wie der Titel, deshalb fuer Tastatur und Screenreader
          ausgeblendet: ein Ziel, ein Tabstopp. */}
      <L to={href} tabIndex={-1} aria-hidden="true" className={`block min-w-0 lg:col-span-8 ${flip ? "lg:order-2" : ""}`}>
        <div
          data-tilt
          className="card-glow overflow-hidden border border-[var(--line-strong)] bg-[var(--surface-1)] transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5"
          style={{ borderRadius: "var(--radius-2)" }}
        >
          <div className="flex items-center gap-1.5 h-8 sm:h-9 px-3.5 border-b border-[var(--line)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-strong)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-strong)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-strong)]" />
            <span className="mx-auto px-3 h-5 inline-flex items-center rounded-full bg-[var(--surface-2)] eyebrow-mono text-[var(--text-low)]" style={{ fontSize: "0.6875rem", letterSpacing: "0.06em" }}>
              {domainOf(project.link)}
            </span>
          </div>
          <img
            src={project.image}
            alt=""
            width={1200}
            height={700}
            loading="lazy"
            decoding="async"
            className="block w-full object-cover object-top"
            style={{ aspectRatio: "1000 / 583" }}
          />
        </div>
      </L>

      <div className={`min-w-0 lg:col-span-4 ${flip ? "lg:order-1" : ""}`}>
        <div className="eyebrow-mono uppercase text-[var(--text-low)]" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
          {sectorOf(project, locale)} · {project.year}
        </div>
        <h3 className="display text-[var(--text-hi)] mt-3 mb-0" style={{ fontSize: "clamp(1.5rem, 1.1rem + 1.2vw, 2.25rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          <L to={href} className="hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]">
            {project.title}
          </L>
        </h3>
        <p className="text-[var(--text)] mt-4 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "44ch" }}>
          {p.items[project.slug]}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
          <L to={href} className="inline-flex items-center gap-2 font-medium text-[var(--signal-text)]" style={{ fontSize: "var(--t-small)" }}>
            {p.caseCta}
            <span className="sr-only">: {project.title}</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
          </L>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-[var(--text-mid)] hover:text-[var(--text-hi)] underline underline-offset-4 decoration-[var(--line-strong)]"
              style={{ fontSize: "var(--t-small)" }}
            >
              {domainOf(project.link)}
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">{t.site.a11y.newTab}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── 02 Ablauf ────────────────────────────────────────────────────────── */

export function HomeProcess() {
  const t = useT();
  const p = t.web.process;
  return (
    <section id="process" aria-labelledby="process-title" style={{ paddingBlock: "var(--section-pad)" }}>
      <div className="mx-auto" style={wrap}>
        <Eyebrow n="02">{p.eyebrow}</Eyebrow>
        <h2 id="process-title" className="text-[var(--text-hi)] font-medium mt-6 mb-0" style={{ ...h2Style, maxWidth: "24ch" }}>
          <TwoTone text={p.title} />
        </h2>
        {/* Eine Linie, vier Knoten: auf dem Desktop waagerecht, auf dem
            Telefon senkrecht. Ein Diagramm, keine vier Karten. */}
        <ol className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mt-12 lg:mt-16">
          {p.steps.map((s, i) => (
            <li key={s.title} className="relative pl-12 lg:pl-0 lg:pt-12">
              <span aria-hidden="true" className="absolute left-[15px] top-8 bottom-[-40px] w-px bg-[var(--line-strong)] lg:hidden" style={{ display: i === p.steps.length - 1 ? "none" : undefined }} />
              <span aria-hidden="true" className="hidden lg:block absolute left-8 right-[-32px] top-[15px] h-px bg-[var(--line-strong)]" style={{ display: i === p.steps.length - 1 ? "none" : undefined }} />
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center eyebrow-mono ${i === 0 ? "bg-[var(--signal)] text-white" : "border border-[var(--line-strong)] bg-[var(--surface-0)] text-[var(--text-hi)]"}`}
                style={{ fontSize: "0.75rem" }}
              >
                {i + 1}
              </span>
              <h3 className="text-[var(--text-hi)] font-medium m-0" style={{ fontSize: "1.25rem", lineHeight: 1.25 }}>
                {s.title}
              </h3>
              <p className="text-[var(--text-mid)] mt-3 mb-0" style={{ fontSize: "var(--t-small)", lineHeight: 1.6, maxWidth: "40ch" }}>
                {s.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── 03 Budget ────────────────────────────────────────────────────────── */

export function HomeBudget() {
  const t = useT();
  const b = t.web.budget;
  const g = t.home.budget;
  return (
    <section id="pricing" aria-labelledby="budget-title" style={{ paddingBlock: "var(--section-pad)" }}>
      <span id="project-builder" aria-hidden="true" />
      <div className="mx-auto" style={wrap}>
        <Eyebrow n="03">{b.eyebrow}</Eyebrow>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-8">
          <div className="lg:col-span-7 card-glow border border-[var(--line)] bg-[var(--surface-1)] p-8 sm:p-10 flex flex-col" style={{ borderRadius: "var(--radius-2)" }}>
            <h2 id="budget-title" className="text-[var(--text-hi)] font-medium m-0" style={{ ...h2Style, maxWidth: "18ch" }}>
              {b.title}
            </h2>
            <p className="text-[var(--text-mid)] mt-5 mb-9" style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "52ch" }}>
              {b.lead}
            </p>
            <L
              to="/project?type=website"
              data-cta="price_estimate"
              data-cta-at="home_budget"
              className="btn-grad m-arrow mt-auto self-start inline-flex items-center gap-2.5 px-7 text-white font-semibold rounded-full"
              style={{ height: 54, fontSize: "var(--t-small)" }}
            >
              {b.cta}
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
            </L>
          </div>
          {/* Die Foerderung: getrennt, und als Moeglichkeit, nicht als Zusage. */}
          <div className="lg:col-span-5 border border-[var(--positive)]/35 bg-[var(--surface-1)] p-8 sm:p-10 flex flex-col" style={{ borderRadius: "var(--radius-2)" }}>
            <BadgeEuro className="w-5 h-5 text-[var(--positive)] mb-6" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="text-[var(--text-hi)] font-medium m-0" style={{ fontSize: "var(--t-h3)", lineHeight: 1.2 }}>
              {g.grantTitle}
            </h3>
            <p className="text-[var(--text-mid)] mt-4 mb-8" style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}>
              {g.grantBody}
            </p>
            <L to="/sme-packages" className="group mt-auto inline-flex items-center gap-2 text-[var(--positive)] font-medium self-start" style={{ fontSize: "var(--t-small)" }}>
              {g.grantCta}
              <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
            </L>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 04 Kontakt ───────────────────────────────────────────────────────── */

export function HomeContact() {
  const t = useT();
  const c = t.web.contact;
  return (
    <section id="talk" aria-labelledby="talk-title" style={{ paddingBlock: "var(--section-pad)" }}>
      <span id="about" aria-hidden="true" />
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-10 items-start" style={wrap}>
        <div className="lg:col-span-5">
          <Eyebrow n="04">{c.eyebrow}</Eyebrow>
          <h2 id="talk-title" className="text-[var(--text-hi)] font-medium mt-6 mb-0" style={{ ...h2Style, maxWidth: "16ch" }}>
            {c.title}
          </h2>
          <p className="text-[var(--text-mid)] mt-5 mb-0" style={{ fontSize: "var(--t-body)", lineHeight: 1.6, maxWidth: "46ch" }}>
            {c.lead}
          </p>

          {TEAM_READY && (
            <ul className="m-0 p-0 list-none grid grid-cols-2 gap-4 mt-8 max-w-[420px]">
              {FOUNDERS.map((f) => (
                <li key={f.key} className="overflow-hidden border border-[var(--line)] bg-[var(--surface-1)]" style={{ borderRadius: "var(--radius-2)" }}>
                  <div className="relative aspect-square bg-[var(--surface-2)] flex items-end justify-center overflow-hidden">
                    <span aria-hidden="true" className="absolute w-[46%] h-[92%] rounded-full -rotate-[32deg] left-[22%] top-[2%] opacity-90" style={{ background: "linear-gradient(160deg, #2563f6, #1747c4)" }} />
                    <span aria-hidden="true" className="absolute w-[28%] h-[52%] rounded-full -rotate-[32deg] left-[58%] top-[30%] opacity-80" style={{ background: "linear-gradient(160deg, #3ce7fc, #2563f6)" }} />
                    <img
                      src={f.photo}
                      alt={t.home.founders.photoAlt(f.name, t.home.founders.role)}
                      width={400}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="relative w-full h-full object-contain object-bottom"
                    />
                  </div>
                  <div className="px-4 py-3">
                    <div className="text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-small)" }}>
                      {f.name}
                    </div>
                    <div className="eyebrow-mono uppercase text-[var(--text-low)] mt-1" style={{ fontSize: "var(--t-label)", letterSpacing: "0.14em" }}>
                      {t.home.founders.role}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-8 mb-0 text-[var(--text-mid)]" style={{ fontSize: "var(--t-small)" }}>
            {c.call}{" "}
            <a href={`tel:+${WHATSAPP_NUMBER}`} className="inline-flex items-center gap-1.5 font-medium text-[var(--text-hi)] underline underline-offset-4 decoration-[var(--line-strong)] hover:decoration-[var(--signal-text)]">
              <Phone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              {WHATSAPP_DISPLAY}
            </a>
          </p>
          <p className="mt-3 mb-0">
            <L to="/about" className="text-[var(--text-mid)] hover:text-[var(--text-hi)] underline underline-offset-4 decoration-[var(--line-strong)]" style={{ fontSize: "var(--t-small)" }}>
              {t.home.company.teamLink}
            </L>
          </p>
        </div>

        <div className="lg:col-span-7 border border-[var(--line)] bg-[var(--surface-1)] p-6 sm:p-9" style={{ borderRadius: "var(--radius-2)" }}>
          <WebsiteRequestForm
            at="home"
            heading={
              <h3 className="text-[var(--text-hi)] font-medium m-0" style={{ fontSize: "var(--t-h3)", lineHeight: 1.2 }}>
                {c.formTitle}
              </h3>
            }
          />
        </div>
      </div>
    </section>
  );
}

/* ── 05 Weitere Leistungen ────────────────────────────────────────────── */

export function HomeMore() {
  const t = useT();
  const m = t.web.more;
  return (
    <section id="more" aria-labelledby="more-title" style={{ paddingBlock: "var(--section-pad) calc(var(--section-pad) * 1.25)" }}>
      {/* Alte Anker (#cybersecurity, #film, #services) aus Links von
          aussen landen hier, beim Wegweiser auf die eigenen Seiten. */}
      <span id="cybersecurity" aria-hidden="true" />
      <span id="film" aria-hidden="true" />
      <span id="services" aria-hidden="true" />
      <div className="mx-auto" style={wrap}>
        <Eyebrow n="05">{m.eyebrow}</Eyebrow>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mt-6">
          <h2 id="more-title" className="text-[var(--text-hi)] font-medium m-0" style={{ fontSize: "var(--t-h3)", lineHeight: 1.15 }}>
            {m.title}
          </h2>
          <p className="text-[var(--text-mid)] m-0" style={{ fontSize: "var(--t-small)", maxWidth: "52ch" }}>
            {m.lead}
          </p>
        </div>
        <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-8">
          {MORE_SERVICES.map(([key, to]) => (
            <li key={key}>
              <L
                to={to}
                className="group card-glow h-full flex flex-col gap-1.5 p-5 border border-[var(--line)] bg-[var(--surface-1)] hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
                style={{ borderRadius: "var(--radius-1)" }}
              >
                <span className="flex items-center justify-between gap-3 text-[var(--text-hi)] font-medium" style={{ fontSize: "var(--t-small)" }}>
                  {m.items[key].title}
                  <ArrowRight className="w-4 h-4 shrink-0 text-[var(--text-low)] group-hover:text-[var(--signal-text)] group-hover:translate-x-0.5 transition-[color,transform] duration-[var(--dur-1)]" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-[var(--text-low)]" style={{ fontSize: "0.8125rem", lineHeight: 1.45 }}>
                  {m.items[key].line}
                </span>
              </L>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
