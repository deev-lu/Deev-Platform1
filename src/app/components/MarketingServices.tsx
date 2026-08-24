import { motion } from "motion/react";
import { Section, SectionTitle } from "./Section";
import LiteYouTube from "./LiteYouTube";
import { useT } from "../../lib/useT";
import { Deck, CARD_BASE } from "./Deck";

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


/** The three shorts are our own. Their ids are data; their accessible names
 *  are copy, so they come from the dictionary in the reader's language. */
const VIDEO_IDS = ["LeAYeRih-_Y", "zURSJEqZO2E", "j9zL-hiTnF4"];

export default function MarketingServices() {
  const t = useT();
  const SERVICES = t.home.marketing.items.map((s, i) => ({ ...s, index: String(i + 1).padStart(2, "0") }));
  const VIDEOS = VIDEO_IDS.map((id, i) => ({
    id,
    title: t.home.marketing.videoTitle(i + 1, VIDEO_IDS.length),
  }));

  return (
    <Section index="05" eyebrow={t.home.marketing.eyebrow} tone={1}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12">

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionTitle>{t.home.marketing.title}</SectionTitle>
            <p
              className="mt-6 text-[var(--text-mid)]"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "46ch" }}
            >
              {t.home.marketing.lead}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
        <Deck label={t.home.marketing.deckLabel} className="md:block md:border-t md:border-[var(--line)]">
          {SERVICES.map((s, i) => (
            <motion.li
              key={s.index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.56, delay: Math.min(i, 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`${CARD_BASE} border border-[var(--line)] bg-[var(--surface-2)] p-7
                          md:bg-transparent md:p-0 md:border-0 md:border-b
                          md:grid md:grid-cols-[auto_1fr] md:gap-x-10 md:py-8`}
            >
              <span
                className="eyebrow-mono text-[var(--metal)] block mb-6 md:mb-0 md:pt-1"
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
                  {s.copy}
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
        </Deck>
        </div>

      </div>

      {/* Two shorts, at the ratio they were shot in. */}
      <div className="mt-20 pt-10 border-t border-[var(--line)]">
        <div className="flex items-center gap-4 mb-8">
          <span className="h-px w-10 bg-[var(--line-strong)]" />
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            <span className="text-[var(--metal)]">05.1</span> / {t.home.marketing.videosEyebrow}
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
