/** /sme-packages — la page sur les aides. */
export const grant = {
  eyebrow: "SME Packages Luxembourg",
  title: "L'État paie [[70 %]]. Vous payez le reste.",
  lead:
    "Les PME luxembourgeoises récupèrent 70 % d'un projet numérique ou IA éligible via les SME Packages. Sur le plus grand projet éligible, cela représente 17 500 EUR restitués. Voici exactement comment cela fonctionne, ce que cela couvre et ce qu'il vous resterait à payer.",
  ctaPrimary: "Chiffrer votre projet",
  ctaSecondary: "En parler d'abord",

  stats: {
    rate: { value: "70 %", label: "du coût éligible", note: "Pas jusqu'à 70 %. Le taux est fixe." },
    range: { value: "3k–25k", label: "projet éligible, EUR, HT", note: "En dessous de 3 000, aucune aide." },
    cap: { value: "17 500", label: "maximum restitué, EUR", note: "70 % du plafond de 25 000." },
  },

  check: {
    eyebrow: "Avant tout le reste",
    title: "Votre entreprise est-elle éligible ?",
    lead: "Quatre conditions en décident. Cochez celles qui sont vraies.",
    items: {
      sme: "Nous sommes une PME : moins de 250 salariés, et un chiffre d'affaires inférieur à 50 M EUR ou un bilan inférieur à 43 M EUR.",
      seat: "Le siège social de l'entreprise est au Luxembourg.",
      auth: "Nous disposons d'une autorisation d'établissement valide.",
      size: "Le projet envisagé vaut au moins 3 000 EUR hors TVA.",
    },
    all: "Les quatre correspondent. Sur cette base, votre projet semble éligible, et le rendez-vous de pré-analyse est l'étape suivante.",
    some: (n) =>
      `${n} sur 4. Ce qui n'est pas coché devrait changer avant une demande. Dites-nous lequel et nous vous dirons si c'est jouable.`,
    none: "Rien de coché pour l'instant.",
    caveat:
      "Ceci est une indication, pas une décision. L'éligibilité est confirmée lors du rendez-vous de pré-analyse, et c'est le ministère de l'Économie qui tranche la demande.",
  },

  calc: {
    eyebrow: "Le calcul",
    title: "Ce que vous récupéreriez.",
    lead: "Faites glisser la valeur du projet. Les chiffres sont les règles du programme appliquées à celle-ci, rien de plus.",
    project: "Valeur du projet, HT",
    grant: "L'État rembourse",
    net: "Votre coût net",
    capped: "Au-delà de 25 000, le coût éligible est plafonné : l'aide s'arrête à 17 500.",
    below: "En dessous de 3 000, un projet n'ouvre pas droit à un package.",
    cta: "Configurer un vrai projet",
  },

  scope: {
    eyebrow: "Ce que cela couvre",
    title: "Ce que nous construisons dans un package.",
    lead: "Les volets Digital et IA couvrent ensemble l'essentiel de ce dont une entreprise a besoin en ligne. Voici ce que nous livrons.",
    items: {
      website: { title: "Sites web", body: "Un site pensé pour être trouvé et pour convertir, pas une brochure." },
      store: { title: "Boutiques en ligne", body: "Paiements, catalogue, stock et le flux de commandes derrière." },
      app: { title: "Applications et plateformes", body: "Tableaux de bord, portails, réservation et facturation, outils internes." },
      ai: { title: "IA et automatisation", body: "Assistants, recherche dans vos propres documents, tâches administratives répétitives." },
      marketing: {
        title: "Marketing, intégré",
        body: "Pas financé séparément, mais jusqu'à 15 % de marketing et 15 % de budget publicitaire peuvent être intégrés à un package Digital aux côtés d'un projet de site ou d'application, au même taux de 70 %.",
      },
      brand: { title: "Marque et identité", body: "Quand un projet a besoin de l'apparence autant que de la construction." },
    },
  },

  steps: {
    eyebrow: "Comment ça se passe",
    title: "Six étapes, dans cet ordre.",
    lead: "L'ordre compte : un travail commencé avant l'accord n'est pas couvert.",
    items: [
      { title: "Pré-analyse", body: "Vous prenez rendez-vous avec la House of Entrepreneurship, ou avec eHandwierk à la Chambre des Métiers si vous êtes une entreprise artisanale. Ils vérifient l'éligibilité et aident à remplir le formulaire." },
      { title: "Périmètre et devis", body: "Nous rédigeons le périmètre et un devis adapté au package. C'est là que se joue notre travail : un périmètre aligné sur les catégories du programme fait la différence entre un accord et une réécriture." },
      { title: "Demande", body: "Le dossier part au ministère de l'Économie, devis à l'appui." },
      { title: "Accord", body: "Vous attendez la décision avant que quoi que ce soit ne commence." },
      { title: "Nous construisons", body: "Le projet se déroule. Vous obtenez le site, la plateforme ou le système." },
      { title: "Remboursement", body: "Vous nous payez intégralement, puis vous réclamez. L'aide arrive après la livraison, pas avant." },
    ],
    cashflow: {
      title: "Un point à anticiper",
      body: "Il s'agit d'un remboursement, pas d'une remise en caisse. Vous payez la facture en entier et l'État vous rembourse après la livraison : la trésorerie doit donc être disponible entre les deux. Mieux vaut le savoir maintenant qu'au moment de la facture.",
    },
  },

  faq: {
    eyebrow: "Questions",
    title: "Celles qu'on nous pose vraiment.",
    items: [
      {
        q: "C'est vraiment 70 %, ou jusqu'à 70 % ?",
        a: "C'est 70 % du coût éligible. Ce que les gens désignent par jusqu'à, c'est le plafond : le coût éligible s'arrête à 25 000 EUR, donc l'aide s'arrête à 17 500 EUR. Le taux, lui, ne varie pas.",
      },
      {
        q: "Quand est-ce que je reçois l'argent ?",
        a: "Après la livraison du projet. Vous payez le prestataire intégralement et demandez le remboursement ensuite. Prévoyez le montant complet au départ et considérez l'aide comme de l'argent qui revient.",
      },
      {
        q: "Puis-je commencer avant l'accord ?",
        a: "Non. Un travail commencé avant l'accord n'est pas couvert. La pré-analyse d'abord, puis la demande, puis la décision, puis la construction.",
      },
      {
        q: "Et si mon projet dépasse 25 000 ?",
        a: "Vous pouvez tout à fait le construire. Le coût éligible est plafonné à 25 000 EUR, l'aide à 17 500 EUR, et vous portez le reste. Nous vous dirons clairement ce qui entre dans le package et ce qui n'y entre pas.",
      },
      {
        q: "Le marketing est-il éligible ?",
        a: "Pas seul. Jusqu'à 15 % de marketing et 15 % de budget publicitaire peuvent être intégrés à un package Digital aux côtés d'un projet de site ou d'application, au même taux.",
      },
      {
        q: "Vous occupez-vous des démarches ?",
        a: "Nous rédigeons le périmètre et le devis pour qu'ils correspondent au programme, et nous vous accompagnons sur le formulaire. Le rendez-vous de pré-analyse vous revient et la décision appartient au ministère. Personne ne peut vous promettre un accord, et méfiez-vous de qui le prétend.",
      },
      {
        q: "Combien de temps cela prend-il ?",
        a: "Le programme ne publie pas de calendrier fixe, et les délais comme la liste des pièces sont confirmés lors de la pré-analyse plutôt qu'annoncés à l'avance. Posez la question à ce rendez-vous et calez le projet sur la réponse.",
      },
    ],
  },

  source: {
    body: "Les chiffres de cette page proviennent de guichet.public.lu et de Luxinnovation et étaient exacts à la rédaction. Les conditions du programme évoluent : vérifiez-les avant de vous y fier, et confirmez tout lors de votre pré-analyse.",
    link: "SME Packages sur guichet.public.lu",
  },

  cta: {
    title: "Envie de savoir ce que coûterait le vôtre ?",
    body: "Dites-nous ce que vous cherchez à construire. Nous vous dirons ce que cela demande, ce que cela coûte, ce qui entre dans un package et quel serait votre prix net.",
    action: "Entamer la conversation",
    secondary: "Ou le chiffrer vous-même",
  },
};
