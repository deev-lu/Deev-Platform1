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
    workshops: "Ateliers",
    funding: "Aides PME",
    contact: "Contact",
    cta: "Échange gratuit",
    call: "Appelez-nous",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    toLight: "Passer en mode clair",
    toDark: "Passer en mode sombre",
    language: "Langue",
    languageOf: (name: string) => `Passer en ${name}`,
    mainNav: "Principale",
  },

  /** Accessibility labels (WCAG 2.2 AA): skip link, pause controls. */
  a11y: {
    skip: "Aller au contenu",
    pauseLogos: "Mettre en pause les logos clients",
    playLogos: "Relancer les logos clients",
    prevLogo: "Client précédent",
    nextLogo: "Client suivant",
    showLogo: (name: string) => `Afficher ${name}`,
    slideOf: (n: number, total: number) => `${n} sur ${total}`,
    sections: "Sur cette page",
    pauseVideo: "Mettre en pause la vidéo d’arrière-plan",
    playVideo: "Lire la vidéo d’arrière-plan",
    pauseFilm: "Mettre l’animation en pause",
    playFilm: "Relancer l’animation",
    newTab: "(s’ouvre dans un nouvel onglet)",
    pauseMotion: "Mettre les animations en pause",
    playMotion: "Relancer les animations",
    motionLabel: "Animations",
    requiredNote: "Les champs marqués * sont obligatoires.",
  },

  footer: {
    blurb:
      "Ingénierie logicielle et IA au Luxembourg. Nous construisons les systèmes sur lesquels repose votre entreprise, et nous en restons responsables après la mise en ligne.",
    certified: "Label certifié",
    certifiedNote: "Conçu et développé au Luxembourg.",
    services: "Services",
    company: "Entreprise",
    legal: "Mentions légales",
    links: {
      grant: "SME Packages",
      webApps: "Logiciel sur mesure",
      aiAgents: "IA et données",
      ecommerce: "Sites web, sur invitation",
      marketingSites: "Marketing",
      portfolio: "Réalisations",
      terms: "Informations légales",
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
      "why-deev": { label: "Pourquoi Deev", desc: "Notre façon de travailler et ce que nous assumons" },
      "about": { label: "Avec qui vous travaillez", desc: "Deux fondateurs, tous les deux sur votre projet" },
    },
    feature: {
      badge: "Financement public",
      title: "70% financés par l'État",
      body: "Les PME luxembourgeoises obtiennent 70% d'un projet numérique ou d'IA éligible. Voyez ce que le vôtre coûterait réellement.",
      cta: "Voir votre prix net",
    },
    work: { browse: "Parcourir", all: "Toutes les réalisations", recent: "Des projets que nous aimons montrer" },
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
