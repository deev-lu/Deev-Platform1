import { Suspense, lazy } from "react";
import { useT } from "../../lib/useT";

const ProjectBuilder = lazy(() => import("./ProjectBuilder"));

/**
 * /project — der Rechner auf einer eigenen Seite.
 *
 * Er stand bisher in voller Länge auf der Startseite und hat dort einen großen
 * Teil der Höhe und des JavaScript belegt, obwohl die meisten Besucher zuerst
 * wissen wollen, was DEEV überhaupt macht. Hier hat er Platz, und die
 * Startseite verweist nur noch darauf.
 *
 * Die Rechenlogik selbst ist unverändert: Preise, Optionen und Stufen sind
 * kaufmännische Fakten und werden nicht nebenbei angepasst.
 */
export default function ProjectPage() {
  const t = useT();

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">
      <header
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingTop: "var(--section-y)" }}
      >
        <div className="flex items-center gap-4 mb-9">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.builder.eyebrow}
          </span>
        </div>
        <h1
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.04, letterSpacing: "-0.03em", maxWidth: "16ch" }}
        >
          {t.pages.project.title}
        </h1>
        <p
          className="text-[var(--text-mid)] mt-6"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "58ch" }}
        >
          {t.pages.project.lead}
        </p>
      </header>

      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <ProjectBuilder />
      </Suspense>
    </main>
  );
}
