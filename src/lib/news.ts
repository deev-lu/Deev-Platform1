/**
 * The journal.
 *
 * Articles live in news.data.json with all three languages side by side, the
 * same shape as routeMeta.json, so a piece cannot exist in one language and be
 * missing in another: the type below requires every locale, and the build
 * fails rather than serving a French reader an English article.
 *
 * Bodies are blocks rather than markdown or HTML. A block is one of a
 * paragraph, a heading, a list, a code line or a footnote, which is every
 * shape these pieces actually use. No parser, no dangerouslySetInnerHTML, and
 * a translator cannot accidentally break the markup.
 */

import data from "./news.data.json";
import type { Locale } from "./i18n";

export type Block =
  | { p: string }
  | { h: string }
  | { list: string[] }
  | { code: string }
  | { note: string };

export interface ArticleText {
  title: string;
  excerpt: string;
  body: Block[];
}

export interface Article extends Record<Locale, ArticleText> {
  slug: string;
  /** ISO date, used for sorting, <time> and the article's structured data. */
  date: string;
  minutes: number;
  /** Key into t.news.topics, so the label follows the reader's language. */
  topic: "funding" | "engineering" | "ai";
}

export const ARTICLES: Article[] = (data as unknown as Article[])
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getArticle = (slug?: string) => ARTICLES.find((a) => a.slug === slug);

/** Wraps around, so the foot of an article always has somewhere to go. */
export const nextArticle = (slug: string) => {
  const i = ARTICLES.findIndex((a) => a.slug === slug);
  return ARTICLES[(i + 1) % ARTICLES.length];
};

/** "2026-07-14" in the reader's language, e.g. "14 July 2026". */
export const formatDate = (iso: string, locale: Locale) => {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};
