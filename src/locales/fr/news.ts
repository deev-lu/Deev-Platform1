import type { news as En } from "../en/news";

export const news: typeof En = {
  eyebrow: "Journal",
  title: "Notes de terrain.",
  lead:
    "Ce que nous apprenons en construisant des systèmes au Luxembourg : les aides qui valent la peine d'être demandées, les choix techniques qui méritaient la discussion, et les parties d'un projet d'IA que personne ne met dans la plaquette.",
  topics: {
    funding: "Financement",
    engineering: "Ingénierie",
    ai: "IA",
  },
  all: "Tout",
  readingTime: (n: number) => `${n} min de lecture`,
  count: (n: number) => `${n} ${n === 1 ? "article" : "articles"}`,
  teaserEyebrow: "Extrait du journal",
  teaserTitle: "Ce que nous avons démêlé récemment.",
  teaserCta: "Lire le journal",
  back: "Tous les articles",
  published: "Publié le",
  next: "Article suivant",
  share: "Écrit par DEEV",
  talk: "Un projet que cela concerne ? Parlons-en.",
};
