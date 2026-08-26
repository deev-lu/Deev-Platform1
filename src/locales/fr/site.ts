import type { site as En } from "../en/site";

export const site: typeof En = {
  nav: {
    home: "DEEV, retour à l'accueil",
    services: "Services",
    work: "Réalisations",
    pricing: "Tarifs",
    journal: "Blog",
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

  /** Le bouton WhatsApp flottant. */
  whatsapp: {
    label: "Discuter sur WhatsApp",
    tooltip: "Une question ? Écrivez-nous",
    message: "Bonjour Deev, j'ai une question à propos de",
    dismiss: "Masquer",
  },

  mega: {
    toggle: (label: string) => `Ouvrir le menu ${label}`,
    close: "Fermer le menu",
    columns: { build: "Construire", grow: "Développer", studio: "Le studio" },
    items: {
      "what-we-build": { label: "Ce que nous construisons", desc: "Sites, plateformes, boutiques en ligne et produits IA" },
      "how-it-runs": { label: "Comment ça tourne", desc: "Interface, intelligence et infrastructure hébergée dans l'UE" },
      "pricing": { label: "Tarifs", desc: "Configurez un projet et voyez le prix évoluer en direct" },
      "marketing": { label: "Marketing", desc: "Publicité, SEO et la mesure qui les prouve" },
      "ai": { label: "Ateliers IA", desc: "Là où l'IA rapporte, chiffré sur vos propres volumes" },
      "billovio": { label: "Billovio", desc: "Notre produit : un devis rédigé à partir d'une phrase" },
      "why-it-works": { label: "Pourquoi ça marche", desc: "Des demandes prévisibles et des résultats mesurables" },
      "why-deev": { label: "Pourquoi Deev", desc: "RGPD, sécurité et des engagements que vous pouvez tenir" },
      "about": { label: "Avec qui vous travaillez", desc: "Deux fondateurs, tous les deux sur votre projet" },
    },
    feature: {
      badge: "Financement public",
      title: "70% financés par l'État",
      body: "Les PME luxembourgeoises obtiennent 70% d'un projet numérique ou d'IA éligible. Voyez ce que le vôtre coûterait réellement.",
      cta: "Voir votre prix net",
    },
    work: { browse: "Parcourir", all: "Toutes les réalisations", recent: "Projets récents" },
    journal: { browse: "Thèmes", all: "Lire le blog", latest: "Derniers articles" },
  },

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
