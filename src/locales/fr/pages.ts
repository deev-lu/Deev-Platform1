import type { pages as En } from "../en/pages";

export const pages: typeof En = {
  work: {
    eyebrow: "Réalisations",
    title: "Une sélection de notre travail.",
    lead: "Sites web, boutiques en ligne et applications web, conçus au Luxembourg pour des entreprises de toute l'Europe.",
    filters: {
      all: "Tout",
      website: "Sites web",
      webapp: "Applications web et logiciels",
      ecommerce: "E-commerce",
      ai: "IA et automatisation",
    },
  },

  workCase: {
    back: "Toutes les réalisations",
    spec: { client: "Client", sector: "Secteur", type: "Type", year: "Année", stack: "Technologies" },
    scope: "Ce que nous avons fait",
    scopeItems: {
      website: "Site web",
      onlineStore: "Boutique en ligne",
      platform: "Plateforme web",
      branding: "Identité de marque et visuelle",
    },
    visit: "Voir le site en ligne",
    brief: "Le brief",
    built: "Ce que nous avons construit",
    outcome: "Le résultat",
    chapters: { context: "Contexte", challenge: "La mission", approach: "L\u2019approche", execution: "La réalisation", outcome: "Le résultat" },
    services: "Prestations",
    deliverables: "Ce que nous avons livré",
    technical: "Sous la surface",
    ownProduct: "Produit propre",
    snapshot: { industry: "Secteur", audience: "Public", location: "Lieu" },
    livePreview: "Live",
    specOnly: "Pour ce projet, les données clés et le site livré sont documentés ; l\u2019étude de cas détaillée ne l\u2019est pas encore. Nous ne la rédigeons qu\u2019une fois la mission, le périmètre et le résultat validés avec le client.",
    next: "Projet suivant",
  },

  /**
   * /services — la page vers laquelle pointe le bouton "Services" de la
   * navigation. Les neuf domaines eux-mêmes viennent de site.mega.items :
   * le menu et la page ne peuvent donc pas diverger.
   */
  services: {
    eyebrow: "Ce que nous faisons",
    title: "Tout ce que nous construisons et faisons tourner.",
    lead:
      "Sites, plateformes, boutiques en ligne, IA et le marketing qui les alimente. Conçu au Luxembourg, financé à 70 % pour les PME luxembourgeoises.",
    cta: {
      title: "Vous ne savez pas ce qu'il vous faut ?",
      body:
        "Dites-nous ce que vous cherchez à régler. Nous vous dirons ce que cela demande, ce que cela coûte et ce que l'État couvre.",
      action: "Parlons-en",
    },
  },

  servicesNav: {
    eyebrow: "Prestations",
    title: "De quoi avez-vous besoin pour avancer ?",
    lead: "Sites web, IA, logiciel sur mesure et croissance. Choisissez le problème à résoudre.",
    bestFor: "Adapté si",
    includes: "Comprend",
    cta: (name: string) => `Découvrir ${name}`,
    paths: {
      websites: {
        title: "Sites web et e-commerce",
        line: "Des sites et boutiques conçus pour transformer l'attention en action.",
        cue: "J'ai besoin d'un nouveau site ou d'une boutique.",
        caps: ["Sites web", "E-commerce", "CMS et intégrations", "SEO et performance"],
      },
      ai: {
        title: "IA et automatisation",
        line: "Agents, assistants et flux conçus autour du travail qui coûte vraiment du temps à votre équipe.",
        cue: "La même routine dévore des heures chaque semaine.",
        caps: ["Agents IA", "Automatisation", "Assistants", "Intégration"],
      },
      software: {
        title: "Logiciel sur mesure",
        line: "Plateformes, portails et applications web conçus autour de votre fonctionnement.",
        cue: "Les logiciels standards ne conviennent plus.",
        caps: ["Applications web", "Portails clients", "Plateformes internes", "Intégrations"],
      },
      marketing: {
        title: "Marketing et croissance",
        line: "Publicité payante, SEO et conversion, orientés vers une demande qualifiée.",
        cue: "Il nous faut plus de clients pertinents.",
        caps: ["Publicité payante", "SEO", "Conversion", "Analytique"],
      },
    },
  },
  servicesTrust: {
    title: "Bien construit dès le départ.",
    points: [
      { title: "Comprendre avant de construire", copy: "Nous partons de votre activité, pas d'une maquette." },
      { title: "Design et développement en interne", copy: "Pas de sous-traitance, pas de chaîne sans responsable." },
      { title: "La mesure est intégrée", copy: "Vous voyez ce que le travail rapporte au lieu de devoir y croire." },
      { title: "Présents après le lancement", copy: "Les défauts dans le périmètre convenu sont corrigés. Le reste passe par la maintenance ou au temps passé." },
    ],
  },
  servicesCta: {
    title: "Pas sûr du chemin à prendre ?",
    lead: "Dites-nous ce que vous voulez atteindre. Nous déterminerons avec vous ce qu'il faut réellement construire.",
    primary: "Prendre rendez-vous",
    secondary: "Configurer votre projet",
  },
  servicePages: {
    websites: {
      eyebrow: "Sites web",
      title: "Un site qui explique votre offre et garde l’étape suivante simple.",
      lead: "Sites d’entreprise, refontes et boutiques en ligne. Conçus pour être trouvés, compris et suivis d’une action.",
      problems: [
        "Les visiteurs arrivent et ne comprennent toujours pas ce que vous faites.",
        "Le site est correct mais ne génère aucune demande.",
        "Personne ne peut changer un prix ou un texte sans appeler une agence.",
      ],
    },
    ai: {
      eyebrow: "IA et automatisation",
      title: "Moins de routine manuelle, avec des solutions adaptées à vos processus.",
      lead: "Nous commençons par regarder où le temps part réellement. Toutes les entreprises n’ont pas besoin d’IA, et nous le dirons.",
      problems: [
        "Les mêmes demandes reçoivent une réponse manuelle chaque semaine.",
        "Des documents sont lus, triés et ressaisis par une personne.",
        "Les données vivent dans trois systèmes et sont recopiées entre eux.",
      ],
    },
    software: {
      eyebrow: "Logiciel sur mesure",
      title: "Quand les outils standards ne correspondent plus à votre façon de travailler.",
      lead: "Applications web, portails, interfaces et la logique métier derrière.",
      problems: [
        "Un tableur est devenu un système critique sans que personne l’ait décidé.",
        "Un logiciel du marché impose un processus qui n’est pas le vôtre.",
        "Deux systèmes doivent se parler et personne ne les a reliés.",
      ],
    },
    marketing: {
      eyebrow: "Marketing et croissance",
      title: "De la demande qui correspond à votre offre, pas de la portée.",
      lead: "Publicité payante, SEO et la mesure derrière. Nous menons les campagnes qui alimentent les systèmes que nous construisons.",
      problems: [
        "Le site est bon, mais personne n'arrive.",
        "Des demandes arrivent, mais les mauvaises.",
        "Personne ne peut dire quel canal amène les clients.",
      ],
    },
    problemsLabel: "Ça vous parle ?",
    workLabel: "Réalisations liées",
    cta: "Parler d’un projet comme celui-ci",
  },

  project: {
    title: "Combien coûterait votre projet ?",
    lead: "Configurez un projet et voyez une fourchette indicative. C’est une orientation, pas un devis, et aucune adresse e-mail n’est demandée.",
  },

  contact: {
    badge: "Nous contacter",
    title: "Parlons de",
    titleAccent: "votre projet.",
    lead:
      "Dites-nous ce que vous construisez. Nous lisons chaque message et répondons personnellement, en général sous un jour ouvré.",
    grant: {
      badge: "70% financés",
      body:
        "Les PME luxembourgeoises récupèrent 70% sur les sites web, applications web, projets IA et le marketing associé via les programmes SME Digital et SME AI. Signalez-le et nous structurerons votre projet pour maximiser l'aide.",
      cta: "Estimer votre prix net",
    },
    details: {
      email: "E-mail",
      whatsapp: "WhatsApp",
      office: "Bureau",
      responseTime: "Délai de réponse",
      responseValue: "Sous 1 jour ouvré",
    },
    form: {
      name: "Nom",
      namePlaceholder: "Votre nom",
      email: "E-mail professionnel",
      emailPlaceholder: "vous@entreprise.com",
      company: "Entreprise",
      companyPlaceholder: "Nom de l'entreprise",
      phone: "Téléphone",
      phonePlaceholder: "+352 …",
      interest: "Comment pouvons-nous vous aider ?",
      message: "Message",
      messagePlaceholder: "Parlez-nous de votre projet, de vos objectifs et de vos délais…",
      submit: "Envoyer le message",
      submitting: "Envoi…",
      consent: "Nous utilisons les informations que vous nous transmettez afin de traiter votre demande et de vous contacter à ce sujet. Nous faisons appel à des prestataires pour l'exploitation du site web et le traitement des e-mails.",
      consentLink: "Plus d'informations dans notre politique de confidentialité.",
      errorLead: "Nous n'avons pas pu envoyer le formulaire pour le moment.",
      errorAction: "Envoyez-le par e-mail",
    },
    interests: [
      "Demande générale",
      "Nouveau site web",
      "Application web / plateforme SaaS",
      "Projet IA / automatisation",
      "Campagnes de prospection / marketing",
      "Autre",
    ],
    success: {
      title: "Message bien reçu.",
      body: (firstName: string) =>
        `Merci${firstName ? ` ${firstName}` : ""}. Nous avons enregistré votre demande et reviendrons vers vous sous un jour ouvré.`,
      cta: "Retour à l'accueil",
    },
  },
};
