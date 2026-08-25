import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import L from "./L";
import { ARTICLES, formatDate } from "../../lib/news";
import { useT, useLocale } from "../../lib/useT";

/**
 * §11 — the three most recent articles on the homepage.
 *
 * Section 11 rather than somewhere in the middle, so nothing renumbers: the
 * journal is the last thing before Luxembourg and the closing ask, which is
 * also where someone still reading is most likely to want it.
 */
export default function NewsTeaser() {
  const t = useT();
  const locale = useLocale();
  const latest = ARTICLES.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <Section index="11" eyebrow={t.news.teaserEyebrow} tone={0}>
      <div className="flex flex-wrap items-end justify-between gap-8 mb-14">
        <SectionTitle>{t.news.teaserTitle}</SectionTitle>

        <L
          to="/news"
          className="group inline-flex items-center gap-3 h-12 px-7 border border-[var(--line-strong)] text-[var(--text-hi)] hover:border-[var(--text-low)] transition-colors duration-[var(--dur-1)]"
          style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
        >
          {t.news.teaserCta}
          <ArrowUpRight
            className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </L>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[var(--line)]">
        {latest.map((a, i) => (
          <motion.li
            key={a.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.56, delay: Math.min(i, 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="border-r border-b border-[var(--line)]"
          >
            <L
              to={`/news/${a.slug}`}
              className="group flex flex-col h-full p-8 sm:p-10 bg-[var(--surface-1)] hover:bg-[var(--surface-2)] transition-colors duration-[240ms]"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-8">
                <span
                  className="eyebrow-mono uppercase text-[var(--signal-text)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {t.news.topics[a.topic]}
                </span>
                <time
                  dateTime={a.date}
                  className="eyebrow-mono uppercase text-[var(--text-low)] tabular-nums"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {formatDate(a.date, locale)}
                </time>
              </div>

              <h3
                className="text-[var(--text-hi)] font-medium mb-3 mt-auto"
                style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
              >
                {a[locale].title}
              </h3>

              <p
                className="text-[var(--text-mid)]"
                style={{ fontSize: "var(--t-small)", lineHeight: 1.6 }}
              >
                {a[locale].excerpt}
              </p>

              <span
                className="eyebrow-mono uppercase text-[var(--text-low)] mt-6"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {t.news.readingTime(a.minutes)}
              </span>
            </L>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
