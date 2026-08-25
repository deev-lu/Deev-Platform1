import { useEffect } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import L from "./L";
import { getArticle, nextArticle, formatDate, type Block } from "../../lib/news";
import { useT, useLocale, useLocalePath } from "../../lib/useT";

/**
 * /news/:slug — one article.
 *
 * Held to a single readable column at roughly 68 characters. The blocks come
 * from news.data.json and render as elements, never as raw HTML, so nothing a
 * translator writes can break the page or inject markup.
 */
export default function NewsArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const t = useT();
  const locale = useLocale();
  const localePath = useLocalePath();
  const article = getArticle(slug);

  useEffect(() => {
    // An unknown slug goes back to the index, in the reader's language.
    if (!article) navigate(localePath("/news"), { replace: true });
  }, [article, navigate, localePath]);

  if (!article) return null;

  const text = article[locale];
  const next = nextArticle(article.slug);

  return (
    <main className="bg-[var(--surface-0)] min-h-screen pt-[68px]">
      <article
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
      >
        <L
          to="/news"
          className="group inline-flex items-center gap-2 text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)] mb-12"
          style={{ fontSize: "var(--t-small)" }}
        >
          <ArrowLeft
            className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:-translate-x-1"
            strokeWidth={1.5}
          />
          {t.news.back}
        </L>

        <div style={{ maxWidth: "68ch" }}>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-8">
            <span
              className="eyebrow-mono uppercase text-[var(--signal-text)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {t.news.topics[article.topic]}
            </span>
            <time
              dateTime={article.date}
              className="eyebrow-mono uppercase text-[var(--text-low)] tabular-nums"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {formatDate(article.date, locale)}
            </time>
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {t.news.readingTime(article.minutes)}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em" }}
          >
            {text.title}
          </motion.h1>

          <p
            className="text-[var(--text)] mt-8 pb-10 border-b border-[var(--line)]"
            style={{ fontSize: "var(--t-lead)", lineHeight: 1.45 }}
          >
            {text.excerpt}
          </p>

          <div className="mt-10">
            {text.body.map((block, i) => (
              <Rendered key={i} block={block} />
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-6">
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {t.news.share}
            </span>
            <L
              to="/contact"
              className="group inline-flex items-center gap-3 text-[var(--text-hi)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-small)" }}
            >
              {t.news.talk}
              <span className="inline-block transition-transform duration-[var(--dur-1)] group-hover:translate-x-1">
                &rarr;
              </span>
            </L>
          </div>
        </div>
      </article>

      <section className="border-t border-[var(--line)]">
        <L
          to={`/news/${next.slug}`}
          className="group block hover:bg-[var(--surface-1)] transition-colors duration-[240ms]"
        >
          <div
            className="mx-auto flex items-baseline justify-between gap-8"
            style={{
              maxWidth: "var(--container)",
              paddingInline: "var(--gutter)",
              paddingBlock: "clamp(56px, 7vw, 96px)",
            }}
          >
            <div>
              <span
                className="eyebrow-mono uppercase text-[var(--text-low)] block mb-4"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {t.news.next}
              </span>
              <span
                className="text-[var(--text-hi)] font-medium"
                style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.02em", maxWidth: "26ch", display: "block" }}
              >
                {next[locale].title}
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

/** One block of an article. Elements, never raw HTML. */
function Rendered({ block }: { block: Block }) {
  if ("h" in block) {
    return (
      <h2
        className="text-[var(--text-hi)] font-medium mt-12 mb-4 first:mt-0"
        style={{ fontSize: "var(--t-h3)", lineHeight: 1.25, letterSpacing: "-0.015em" }}
      >
        {block.h}
      </h2>
    );
  }
  if ("list" in block) {
    return (
      <ul className="my-6 border-t border-[var(--line)]">
        {block.list.map((item) => (
          <li key={item} className="grid grid-cols-[auto_1fr] gap-x-5 py-4 border-b border-[var(--line)]">
            <span className="mt-[11px] w-4 h-px bg-[var(--signal)] shrink-0" />
            <span className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  if ("code" in block) {
    return (
      <pre
        className="my-6 overflow-x-auto border border-[var(--line)] bg-[var(--surface-1)] p-5"
        style={{ borderRadius: "var(--radius-1)" }}
      >
        <code className="eyebrow-mono text-[var(--text-hi)]" style={{ fontSize: "var(--t-small)", letterSpacing: 0 }}>
          {block.code}
        </code>
      </pre>
    );
  }
  if ("note" in block) {
    return (
      <p
        className="mt-10 pl-5 border-l-2 border-[var(--line-strong)] text-[var(--text-low)]"
        style={{ fontSize: "var(--t-small)", lineHeight: 1.55 }}
      >
        {block.note}
      </p>
    );
  }
  return (
    <p className="text-[var(--text-mid)] mb-5" style={{ fontSize: "var(--t-body)", lineHeight: 1.7 }}>
      {block.p}
    </p>
  );
}
