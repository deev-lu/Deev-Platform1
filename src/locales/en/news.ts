/** The journal: the index, an article, and the homepage teaser. */
export const news = {
  eyebrow: "Journal",
  title: "Notes from the work.",
  lead:
    "What we learn building systems in Luxembourg: funding that is worth claiming, engineering that turned out to be worth the argument, and the parts of an AI project nobody puts in the brochure.",
  topics: {
    funding: "Funding",
    engineering: "Engineering",
    ai: "AI",
  },
  all: "All",
  readingTime: (n: number) => `${n} min read`,
  count: (n: number) => `${n} ${n === 1 ? "article" : "articles"}`,
  /** Homepage teaser. */
  teaserEyebrow: "From the journal",
  teaserTitle: "What we have been working out.",
  teaserCta: "Read the journal",
  /** Article page. */
  back: "All articles",
  published: "Published",
  next: "Next article",
  share: "Written by DEEV",
  talk: "Got a project this touches? Talk to us.",
};
