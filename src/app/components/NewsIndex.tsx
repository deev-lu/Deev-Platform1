import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import L from "./L";
import { ARTICLES, formatDate, type Article } from "../../lib/news";
import { useT, useLocale } from "../../lib/useT";

/**
 * /news — the journal.
 *
 * Text is the whole product here, so the list is typography rather than cards
 * with pictures: an article that has to borrow a stock photograph to look
 * worth reading usually is not. Each row leads with what the piece is about
 * and how long it takes, which is what someone deciding whether to read it
 * actually wants.
 */

const TOPICS = ["all", "funding", "engineering", "ai"] as const;
type Topic = (typeof TOPICS)[number];

export default function NewsIndex() {
  const t = useT();
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [topic, setTopic] = useState<Topic>("all");

  const all = useMemo(() => ARTICLES, []);
  const shown = topic === "all" ? all : all.filter((a) => a.topic === topic);
  const label = (k: Topic) => (k === "all" ? t.news.all : t.news.topics[k]);
  const countFor = (k: Topic) => (k === "all" ? all.length : all.filter((a) => a.topic === k).length);

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
            {t.news.eyebrow}
          </span>
        </div>

        <h1
          className="text-[var(--text-hi)] font-medium"
          style={{ fontSize: "var(--t-h1)", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: "14ch" }}
        >
          {t.news.title}
        </h1>

        <p
          className="text-[var(--text-mid)] mt-6"
          style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "52ch" }}
        >
          {t.news.lead}
        </p>

        {/* A rail, not a wrapped block, so it scrolls with the thumb on a
            phone instead of stacking into rows of chips. */}
        <div className="mt-12 -mx-[var(--gutter)] px-[var(--gutter)] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {TOPICS.filter((k) => countFor(k) > 0).map((k) => {
              const on = k === topic;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTopic(k)}
                  aria-pressed={on}
                  className={`eyebrow-mono uppercase inline-flex items-center gap-2 h-10 px-4 border transition-colors duration-[var(--dur-1)] ${
                    on
                      ? "border-[var(--signal)] bg-[var(--signal)] text-white"
                      : "border-[var(--line)] text-[var(--text-mid)] hover:border-[var(--line-strong)] hover:text-[var(--text-hi)]"
                  }`}
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", borderRadius: "var(--radius-1)" }}
                >
                  {label(k)}
                  <span className={on ? "text-white/70" : "text-[var(--text-low)]"}>{countFor(k)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBottom: "var(--section-y)" }}
      >
        <ul className="border-t border-[var(--line)]">
          {shown.map((a, i) => (
            <Row key={a.slug} article={a} index={i} reduce={!!reduce} locale={locale} />
          ))}
        </ul>

        <p
          className="eyebrow-mono uppercase text-[var(--text-low)] mt-12"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          {t.news.count(shown.length)}
        </p>
      </div>
    </main>
  );
}

function Row({
  article,
  index,
  reduce,
  locale,
}: {
  article: Article;
  index: number;
  reduce: boolean;
  locale: ReturnType<typeof useLocale>;
}) {
  const t = useT();
  const text = article[locale];

  return (
    <motion.li
      initial={reduce ? undefined : { opacity: 0, y: 14 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-[var(--line)]"
    >
      <L
        to={`/news/${article.slug}`}
        className="group grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 py-9 sm:py-11 transition-colors duration-[var(--dur-1)] hover:bg-[var(--surface-1)] -mx-[var(--gutter)] px-[var(--gutter)]"
      >
        <div className="lg:col-span-3 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <time
            dateTime={article.date}
            className="eyebrow-mono uppercase text-[var(--text-low)] tabular-nums"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {formatDate(article.date, locale)}
          </time>
          <span
            className="eyebrow-mono uppercase text-[var(--signal-text)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.news.topics[article.topic]}
          </span>
        </div>

        <div className="lg:col-span-8">
          <h2
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h3)", lineHeight: 1.2, letterSpacing: "-0.015em", maxWidth: "28ch" }}
          >
            {text.title}
          </h2>
          <p
            className="text-[var(--text-mid)] mt-3"
            style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "62ch" }}
          >
            {text.excerpt}
          </p>
          <span
            className="eyebrow-mono uppercase text-[var(--text-low)] inline-block mt-4"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.news.readingTime(article.minutes)}
          </span>
        </div>

        <div className="lg:col-span-1 lg:justify-self-end">
          <ArrowUpRight
            className="w-5 h-5 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </div>
      </L>
    </motion.li>
  );
}
