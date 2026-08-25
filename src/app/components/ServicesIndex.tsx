import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, BadgeEuro } from "lucide-react";
import L from "./L";
import { SERVICE_GROUPS, SERVICE_HREF } from "../../lib/serviceSections";
import { useT, useLocalePath } from "../../lib/useT";

/**
 * /services — the page behind the "Services" item in the navigation.
 *
 * The nav item used to be a switch that only opened a panel, so there was no
 * services URL to link to, share or index. This is that URL. It is a hub
 * rather than a second copy of the homepage: each area links to the section
 * that already explains it, which keeps one description of each service on
 * the site instead of two that drift apart.
 *
 * Every word comes from the same dictionary the panel reads, so adding or
 * renaming a service is still one edit in one place.
 */
export default function ServicesIndex() {
  const t = useT();
  const localePath = useLocalePath();
  const reduce = useReducedMotion();
  const home = localePath("/");

  const groups = Object.keys(SERVICE_GROUPS) as (keyof typeof SERVICE_GROUPS)[];

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">
      <header
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
      >
        <div className="flex items-center gap-4 mb-10">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.pages.services.eyebrow}
          </span>
        </div>

        <h1
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "16ch" }}
        >
          {t.pages.services.title}
        </h1>

        <p
          className="text-[var(--text-mid)] mt-6"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "56ch" }}
        >
          {t.pages.services.lead}
        </p>
      </header>

      <div
        className="mx-auto pb-[var(--section-y)]"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        {groups.map((group, gi) => (
          <section key={group} className={gi ? "mt-20" : ""}>
            <div
              className="eyebrow-mono uppercase text-[var(--text-low)] pb-4 mb-8 border-b border-[var(--line)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {t.site.mega.columns[group]}
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SERVICE_GROUPS[group].map((id, i) => (
                <motion.li
                  key={id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* A real navigation, not a router hop: the target is a
                      section of another document, and the browser's own
                      fragment handling puts the reader on it. */}
                  <a
                    href={`${home}${SERVICE_HREF[id]}`}
                    className="group flex h-full flex-col border border-[var(--line)] bg-[var(--surface-1)] p-7 hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
                    style={{ borderRadius: "var(--radius-1)" }}
                  >
                    <span
                      className="text-[var(--text-hi)] font-medium flex items-start justify-between gap-4"
                      style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
                    >
                      {t.site.mega.items[id].label}
                      <ArrowUpRight
                        className="w-5 h-5 shrink-0 mt-1 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
                        strokeWidth={1.5}
                      />
                    </span>
                    <span
                      className="block text-[var(--text-mid)] mt-3"
                      style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
                    >
                      {t.site.mega.items[id].desc}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </section>
        ))}

        {/* The funding is the first question every Luxembourg SME asks, so it
            gets the same card here that it gets in the navigation panel. */}
        <div
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            className="border border-[var(--positive)]/35 bg-[var(--surface-1)] p-8 flex flex-col"
            style={{ borderRadius: "var(--radius-1)" }}
          >
            <BadgeEuro className="w-5 h-5 text-[var(--positive)] mb-5" strokeWidth={1.5} />
            <div
              className="eyebrow-mono uppercase text-[var(--positive)] mb-3"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {t.site.mega.feature.badge}
            </div>
            <div
              className="text-[var(--text-hi)] font-medium mb-3"
              style={{ fontSize: "var(--t-h2)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
            >
              {t.site.mega.feature.title}
            </div>
            <p className="text-[var(--text-mid)] mb-8" style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
              {t.site.mega.feature.body}
            </p>
            <a
              href={`${home}#pricing`}
              className="group mt-auto inline-flex items-center gap-2 text-[var(--positive)] font-medium"
              style={{ fontSize: "var(--t-small)" }}
            >
              {t.site.mega.feature.cta}
              <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
            </a>
          </div>

          <div
            className="border border-[var(--line)] bg-[var(--surface-1)] p-8 flex flex-col"
            style={{ borderRadius: "var(--radius-1)" }}
          >
            <div
              className="text-[var(--text-hi)] font-medium mb-3"
              style={{ fontSize: "var(--t-h2)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
            >
              {t.pages.services.cta.title}
            </div>
            <p className="text-[var(--text-mid)] mb-8" style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
              {t.pages.services.cta.body}
            </p>
            <L
              to="/contact"
              className="group mt-auto inline-flex items-center gap-2 h-12 px-6 bg-[var(--signal)] text-white font-medium self-start"
              style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
            >
              {t.pages.services.cta.action}
              <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-1" strokeWidth={1.5} />
            </L>
          </div>
        </div>
      </div>
    </main>
  );
}
