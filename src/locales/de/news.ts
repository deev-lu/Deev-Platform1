import type { news as En } from "../en/news";

export const news: typeof En = {
  eyebrow: "Blog",
  title: "Notizen aus der Arbeit.",
  lead:
    "Was wir beim Bauen von Systemen in Luxemburg lernen: Förderungen, die sich zu beantragen lohnen, technische Entscheidungen, über die zu streiten sich gelohnt hat, und die Teile eines KI-Projekts, die niemand in die Broschüre schreibt.",
  topics: {
    funding: "Förderung",
    engineering: "Technik",
    ai: "KI",
  },
  all: "Alle",
  readingTime: (n: number) => `${n} Min. Lesezeit`,
  count: (n: number) => `${n} ${n === 1 ? "Artikel" : "Artikel"}`,
  teaserEyebrow: "Aus dem Blog",
  teaserTitle: "Woran wir zuletzt gearbeitet haben.",
  teaserCta: "Blog lesen",
  back: "Alle Artikel",
  published: "Veröffentlicht am",
  next: "Nächster Artikel",
  share: "Geschrieben von DEEV",
  talk: "Ein Projekt, das das betrifft? Sprechen Sie uns an.",
};
