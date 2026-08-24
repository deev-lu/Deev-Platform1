import type { consent as En } from "../en/consent";

export const consent: typeof En = {
  banner: {
    eyebrow: "Cookies",
    title: "Votre choix, consigné.",
    body: "Nous déposons ce dont le site a besoin pour fonctionner. Avec votre accord, nous mesurons aussi son utilisation afin de l'améliorer. Vous pouvez modifier ou retirer ce choix à tout moment.",
    policyLink: "Politique de cookies et de confidentialité",
    reject: "Refuser les cookies non essentiels",
    accept: "Tout accepter",
    customise: "Personnaliser",
  },
  prefs: {
    eyebrow: "Préférences de cookies",
    title: "Ce que vous autorisez, catégorie par catégorie.",
    close: "Fermer les préférences de cookies",
    necessary: {
      title: "Strictement nécessaires",
      copy: "Nécessaires au fonctionnement du site et à la mémorisation de ce choix précis. Ils ne peuvent pas être désactivés et ne servent jamais à vous profiler.",
    },
    analytics: {
      title: "Mesure d'audience",
      copy: "Google Analytics 4, utilisé pour compter les visites et voir quelles pages sont lues. Tant que vous ne l'autorisez pas, la balise fonctionne en mode consentement refusé : aucun cookie, aucun identifiant, seulement un signal agrégé.",
    },
    always: "Toujours actifs",
    table: { name: "Cookie", provider: "Fournisseur", purpose: "Finalité", life: "Conservation" },
    recordLabel: "Votre preuve de consentement",
    given: "Donné le",
    reference: "Référence",
    expires: "Expire le",
    none: "Rien d'enregistré pour l'instant. La mesure d'audience reste refusée tant que vous n'avez pas choisi.",
    version: (v: number) =>
      `Version ${v} de la politique. Nous vous redemanderons dans douze mois, ou plus tôt si la politique change. Détail complet dans la`,
    policyLink: "politique de cookies et de confidentialité",
    save: "Enregistrer mes choix",
    withdraw: "Retirer",
  },
  cookies: {
    consent: "Conserve vos choix de cookies et leur preuve (identifiant et date).",
    theme: "Retient si vous avez choisi l'apparence claire ou sombre.",
    ga: "Distingue un visiteur d'un autre afin de pouvoir compter les visites.",
    gaProperty: "Conserve l'état de la visite en cours pour cette propriété.",
    months12: "12 mois",
    untilCleared: "Jusqu'à effacement",
    years2: "2 ans",
  },
};
