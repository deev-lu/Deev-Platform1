import type { pages as En } from "../en/pages";

export const pages: typeof En = {
  work: {
    eyebrow: "Réalisations",
    title: "Tous les projets que nous livrons.",
    lead: "Sites web, boutiques en ligne et applications web, conçus au Luxembourg pour des entreprises de toute l'Europe.",
    filters: {
      all: "Tout",
      website: "Sites web",
      ecommerce: "Boutiques en ligne",
      webapp: "Applications web",
    },
    count: (n: number, filterLabel?: string) =>
      `${n} ${n === 1 ? "projet" : "projets"}${filterLabel ? ` en ${filterLabel.toLowerCase()}` : ""}`,
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
      consent: "En envoyant ce formulaire, vous acceptez que nous vous contactions à propos de votre demande. Nous ne partageons jamais vos coordonnées.",
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
