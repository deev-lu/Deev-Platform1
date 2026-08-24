import { motion } from "motion/react";
import { Section, SectionTitle } from "./Section";
import LiteYouTube from "./LiteYouTube";

/**
 * Marketing services — a short section, not a second homepage.
 *
 * Copy is lifted verbatim from the DigitalMarketing component that was built
 * but never rendered, so these are DEEV's own words rather than new claims.
 * Treatment matches §6C: hairline rows, mono indices, no cards.
 *
 * The two vertical videos are our own YouTube shorts. They load from Google
 * only once someone presses play (see LiteYouTube), so the section costs
 * nothing on first paint and sets no third-party storage on a visitor who
 * never asked to watch anything.
 */

/** Titles are the accessible names for the players. Replace them with the real
 *  video titles, and drop <id>.jpg into src/assets/marketing to give each one
 *  its own still frame. */
const VIDEOS = [
  { id: "LeAYeRih-_Y", title: "Deev marketing video, one of three" },
  { id: "zURSJEqZO2E", title: "Deev marketing video, two of three" },
  { id: "j9zL-hiTnF4", title: "Deev marketing video, three of three" },
];

const SERVICES = [
  {
    index: "01",
    title: "Paid advertising",
    description: "Google Ads, Meta Ads and LinkedIn: optimised for return, not for impressions.",
    detail: ["Campaign strategy", "A/B testing", "Conversion tracking"],
  },
  {
    index: "02",
    title: "SEO & content",
    description: "Rank higher and attract qualified leads organically, on foundations that hold.",
    detail: ["Technical SEO", "Content strategy", "Link building"],
  },
  {
    index: "03",
    title: "Conversion optimisation",
    description: "Turn more of the visitors you already have into customers, decided by data.",
    detail: ["Landing pages", "User testing", "Analytics"],
  },
  {
    index: "04",
    title: "Analytics & reporting",
    description: "Clear insight and transparent reporting on the numbers that actually matter.",
    detail: ["Custom dashboards", "ROI tracking", "Performance reports"],
  },
];

export default function MarketingServices() {
  return (
    <Section index="05" eyebrow="Marketing" tone={1}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12">

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionTitle>Building it is half the job. Being found is the other half.</SectionTitle>
            <p
              className="mt-6 text-[var(--text-mid)]"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              We run the campaigns that feed the systems we build, so the traffic,
              the site and the measurement are designed together rather than
              handed between three suppliers.
            </p>
          </div>
        </div>

        <ul className="lg:col-span-7 border-t border-[var(--line)]">
          {SERVICES.map((s, i) => (
            <motion.li
              key={s.index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.56, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10 py-8 border-b border-[var(--line)]"
            >
              <span
                className="eyebrow-mono text-[var(--metal)] pt-1"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {s.index}
              </span>
              <div>
                <h3
                  className="text-[var(--text-hi)] font-medium mb-2"
                  style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.01em" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[var(--text-mid)] mb-4"
                  style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "56ch" }}
                >
                  {s.description}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {s.detail.map((d) => (
                    <span
                      key={d}
                      className="eyebrow-mono uppercase text-[var(--text-low)]"
                      style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

      </div>

      {/* Two shorts, at the ratio they were shot in. */}
      <div className="mt-20 pt-10 border-t border-[var(--line)]">
        <div className="flex items-center gap-4 mb-8">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span className="text-[var(--metal)]">05.1</span> / In motion
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-[1040px]">
          {VIDEOS.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.56, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <LiteYouTube id={v.id} title={v.title} />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
