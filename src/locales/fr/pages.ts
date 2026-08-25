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
