import type { site as En } from "../en/site";

export const site: typeof En = {
  nav: {
    services: "Services",
    work: "Réalisations",
    pricing: "Tarifs",
    whyDeev: "Pourquoi Deev",
    about: "À propos",
    contact: "Contact",
    cta: "Demander un devis",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    toLight: "Passer en mode clair",
    toDark: "Passer en mode sombre",
    language: "Langue",
    languageOf: (name: string) => `Passer en ${name}`,
  },

  footer: {
    blurb:
      "Un studio indépendant, dirigé par ses fondateurs, au Luxembourg. Nous construisons des systèmes numériques qui rendent votre entreprise impossible à ignorer.",
    certified: "Label certifié",
    certifiedNote: "Conçu et développé au Luxembourg.",
    services: "Services",
    company: "Entreprise",
    legal: "Mentions légales",
    links: {
      webApps: "Applications web",
      aiAgents: "Agents IA",
      ecommerce: "Systèmes e-commerce",
      marketingSites: "Sites vitrines",
      portfolio: "Réalisations",
      terms: "Conditions et mentions légales",
      privacy: "Politique de confidentialité",
      cookies: "Politique de cookies",
      cookieSettings: "Paramètres des cookies",
    },
    rights: (year: number) => `© ${year} Deev / Lux VR States Sàrl-s. Tous droits réservés.`,
    madeIn: "Conçu avec précision au Luxembourg",
  },

  /** The certification mark's accessible name. */
  madeInLabel: "Made in Luxembourg, label certifié",

  deck: {
    prev: (label: string) => `${label} : précédent`,
    next: (label: string) => `${label} : suivant`,
  },

  notFound: {
    eyebrow: "404 / Page introuvable",
    title: "Cette page n'existe pas.",
    body:
      "Le lien est obsolète ou mal saisi. Tout ce que nous avons publié se trouve à un clic de la page d'accueil.",
    cta: "Retour à l'accueil",
    workLabel: "Réalisations",
  },
};
