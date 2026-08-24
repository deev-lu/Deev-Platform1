import type { home as En } from "../en/home";

export const home: typeof En = {
  hero: {
    eyebrow: "Ingénierie numérique AI-native, Luxembourg",
    title: ["Des plateformes qui [[convertissent]].", "Des systèmes qui grandissent.", "Conçus au Luxembourg."],
    lead:
      "Des plateformes, applications web et systèmes numériques propulsés par l'IA, conçus pour convertir, automatiser et grandir. Développés au Luxembourg pour des entreprises ambitieuses partout en Europe.",
    claims: [
      "Plateformes web, applications et boutiques en ligne AI-native",
      "Des moteurs à prospects conçus pour convertir, pas seulement pour plaire",
      "Jusqu'à 70% financés par l'aide d'État luxembourgeoise aux PME",
    ],
    ctaPrimary: "Configurer votre projet",
    ctaSecondary: "Réserver un appel stratégique",
  },

  logos: { label: "La confiance d'entreprises de premier plan au Luxembourg et au-delà" },

  grant: {
    badge: "Financement public",
    title: "PME luxembourgeoises : jusqu'à [[70% financés]] par l'État.",
    body:
      "Les sites web, applications web et projets IA sont éligibles aux programmes SME Digital et SME AI : 70% des investissements de 3 000 € à 25 000 € (HT), dont jusqu'à 15% de marketing et 15% de budget publicitaire.",
    strong: "programmes SME Digital et SME AI",
    cta: "Voir votre prix net",
  },

  work: {
    eyebrow: "Réalisations",
    title: "Des projets dont nous sommes fiers.",
    lead:
      "Du voyage de luxe aux spiritueux artisanaux, chaque projet est construit avec la même exigence de savoir-faire, de performance et de résultats.",
    counter: (n: number) => `${n} projets livrés à travers l'Europe`,
    seeAll: "Voir toutes les réalisations",
    prev: "Projet précédent",
    next: "Projet suivant",
  },

  benefits: {
    eyebrow: "Pourquoi ça marche",
    title: "Des systèmes numériques conçus pour une croissance durable",
    lead:
      "Nous construisons le système entier, pas une seule de ses pièces : le site, le produit derrière, et les campagnes qui l'alimentent. Une structure claire, des décisions fondées sur les données, et un travail dont l'effet commercial se mesure vraiment.",
    items: [
      {
        title: "Des demandes prévisibles",
        copy: "Le trafic est dirigé vers un objectif unique et le chemin qui y mène est conçu, pour que les demandes qualifiées arrivent régulièrement plutôt que par hasard.",
      },
      {
        title: "Des résultats mesurables",
        copy: "Chaque projet est livré avec l'analytique câblée dès le premier jour, pour que vous voyiez ce que le travail rapporte au lieu de le croire sur parole.",
      },
      {
        title: "L'IA là où elle est utile",
        copy: "De l'automatisation appliquée aux étapes qui vous coûtent réellement du temps, pas ajoutée parce que le mot fait vendre.",
      },
      {
        title: "Une transparence totale",
        copy: "Vous parlez aux personnes qui conçoivent et construisent votre projet, et vous savez toujours sur quoi elles travaillent et pourquoi.",
      },
    ],
  },

  values: {
    eyebrow: "Ce que nous construisons",
    title: "Tout ce qu'il faut à votre entreprise pour rivaliser en ligne",
    items: [
      {
        title: "Produits AI-native",
        copy: "Des agents et assistants IA qui connaissent vraiment votre activité : répondre aux clients, qualifier les prospects et absorber les tâches répétitives qui ne devraient pas occuper votre équipe.",
      },
      {
        title: "Des plateformes qui grandissent",
        copy: "Des applications et plateformes web qui gèrent de vrais clients dès le premier jour, et qui tiennent tout aussi bien quand votre activité est dix fois plus soutenue.",
      },
      {
        title: "Des sites qui convertissent",
        copy: "Des sites rapides et soignés qui transforment les visiteurs en clients, et que Google récompense vraiment.",
      },
      {
        title: "Une croissance qui performe",
        copy: "Publicité, SEO et campagnes qui vous apportent des prospects qualifiés, correctement mesurés, pour que vous sachiez toujours ce qui fonctionne.",
      },
    ],
    processEyebrow: "Notre façon de travailler",
    steps: [
      { title: "Comprendre", copy: "Nous commençons par comprendre votre activité, vos objectifs et ce à quoi vous faites face." },
      { title: "Construire", copy: "Nous le construisons nous-mêmes, en interne. Pas de sous-traitance, pas de projet qui descend une chaîne." },
      { title: "Lancer", copy: "Testé et surveillé, prêt pour de vrais clients dès le premier jour en ligne." },
      { title: "Faire grandir", copy: "Nous restons : améliorer, accompagner et vous garder devant." },
    ],
  },

  stack: {
    eyebrow: "Comment ça tourne",
    title: "Un système. Chaque couche pensée.",
    layers: [
      { name: "Interface", copy: "Les sites et produits que vos clients touchent : rapides, précis, conçus pour convertir." },
      { name: "Intelligence", copy: "Des agents IA et des automatisations au cœur de vos opérations : qualifier, répondre, exécuter." },
      { name: "Infrastructure", copy: "Des fondations hébergées dans l'UE, conformes au RGPD par nature, faites pour grandir sans drame." },
    ],
  },

  marketing: {
    eyebrow: "Marketing",
    title: "Le construire, c'est la moitié du travail. Être trouvé, c'est l'autre moitié.",
    lead:
      "Nous menons les campagnes qui alimentent les systèmes que nous construisons, pour que le trafic, le site et la mesure soient conçus ensemble plutôt que répartis entre trois prestataires.",
    items: [
      {
        title: "Publicité payante",
        copy: "Google Ads, Meta Ads et LinkedIn : optimisés pour le retour, pas pour les impressions.",
        detail: ["Stratégie de campagne", "Tests A/B", "Suivi des conversions"],
      },
      {
        title: "SEO et contenu",
        copy: "Mieux vous positionner et attirer des prospects qualifiés naturellement, sur des bases solides.",
        detail: ["SEO technique", "Stratégie de contenu", "Netlinking"],
      },
      {
        title: "Optimisation des conversions",
        copy: "Transformer en clients davantage de visiteurs que vous avez déjà, sur la base des données.",
        detail: ["Pages d'atterrissage", "Tests utilisateurs", "Analytique"],
      },
      {
        title: "Analytique et reporting",
        copy: "Une lecture claire et un reporting transparent sur les chiffres qui comptent vraiment.",
        detail: ["Tableaux de bord sur mesure", "Suivi du ROI", "Rapports de performance"],
      },
    ],
    videosEyebrow: "En mouvement",
    videoTitle: (n: number, total: number) => `Vidéo marketing Deev, ${n} sur ${total}`,
    playLabel: (title: string) => `Lire : ${title}`,
  },

  ai: {
    eyebrow: "Ateliers et concepts IA",
    title: "Avant de construire quoi que ce soit, nous cartographions là où l'IA rapporte vraiment.",
    lead:
      "Nous animons des ateliers de découverte IA avec les équipes opérationnelles et les transformons en concept exécutif : les goulets d'étranglement, ce que chacun coûte par an, l'architecture qui les supprime, et un plan par phases pour y arriver. Un document présentable à un conseil d'administration, pas une plaquette commerciale.",
    fundingLabel: "Financement",
    funding:
      "Les PME luxembourgeoises peuvent couvrir jusqu'à [[70%]] des coûts éligibles via le SME Package AI & Digital de Luxinnovation, plafonné à 25 000 € d'aide par projet.",
    method: [
      {
        title: "Découverte, sur site",
        copy: "Une session de travail avec les personnes qui font tourner les processus, pas un entretien de direction. Nous parcourons chaque flux avec celle ou celui qui le vit au quotidien et notons où il se bloque.",
      },
      {
        title: "Chaque flux, de bout en bout",
        copy: "Pour chaque processus majeur, nous reconstituons le trajet complet de l'information, du déclencheur à la résolution, en relevant chaque transmission manuelle, chaque outil impliqué et chaque point où le travail attend.",
      },
      {
        title: "Chiffré, pas affirmé",
        copy: "Chaque goulet d'étranglement est converti en coût annuel estimé à partir de vos propres volumes et d'un taux horaire chargé prudent, puis confronté à des entreprises comparables. Vous obtenez un calcul discutable, pas des adjectifs.",
      },
      {
        title: "Une architecture qui s'intègre",
        copy: "Les systèmes que vous utilisez déjà restent. La couche IA se pose par-dessus, ce qui protège l'investissement existant et permet une adoption progressive plutôt qu'une migration.",
      },
      {
        title: "Une feuille de route par phases",
        copy: "Douze mois, quatre phases, chacune livrant quelque chose d'utilisable en production. Aucun projet IA qui vaille la peine ne tient en un seul lancement, et les premiers gains concrets arrivent dans les deux premiers mois.",
      },
    ],
    exampleLabel: "Un concept récent",
    example:
      "Pour un groupe luxembourgeois de gestion immobilière, nous avons animé une session de découverte avec ses responsables opérations et processus, cartographié sept processus métier de bout en bout, et livré un concept exécutif de trente pages.",
    exampleBullets: [
      "Sept goulets d'étranglement identifiés et chiffrés individuellement",
      "Une architecture IA à quatre piliers posée sur les systèmes existants",
      "Une feuille de route de douze mois en quatre phases de production",
      "Coûts éligibles et parcours de subvention cartographiés par phase",
    ],
  },

  billovio: {
    eyebrow: "Notre propre produit",
    by: "par DEEV",
    statement: "Nous ne faisons pas que construire l'IA. Nous la livrons.",
    lead:
      "Décrivez une mission en une phrase et Billovio rédige le périmètre, chiffre le travail, et va jusqu'à la signature et la facture.",
    features: [
      "Un périmètre rédigé à partir d'une phrase",
      "Chiffré selon votre propre grille tarifaire",
      "Signature et facture dans un même flux",
      "À votre image, en une trentaine de secondes",
    ],
    cta: "Ouvrir billovio.com",
    shotAlt: "Billovio : un devis rédigé, chiffré et envoyé à partir d'une seule phrase",
  },

  trust: {
    eyebrow: "Pourquoi Deev",
    title: "Conçus pour qu'on nous confie l'essentiel.",
    lead:
      "Les projets à fort enjeu demandent plus qu'un bon design. Ils demandent un partenaire qui réduit votre risque à chaque étape.",
    credentials: [
      { value: "50+", label: "Projets livrés" },
      { value: "100%", label: "Livraisons dans les délais" },
      { value: "UE", label: "Basés au Luxembourg" },
      { value: "En interne", label: "Design et développement" },
    ],
    pillars: [
      {
        title: "RGPD et souveraineté des données",
        copy: "Une infrastructure hébergée dans l'UE et conforme au RGPD par défaut. Vos données restent en Europe, traitées au niveau qu'exigent les secteurs régulés.",
      },
      {
        title: "Une ingénierie orientée sécurité",
        copy: "Architecture sécurisée dès la conception, audit des dépendances et accès au moindre privilège sur chaque projet, pas une rustine ajoutée après coup.",
      },
      {
        title: "Livraison directe",
        copy: "Vous travaillez directement avec les personnes qui construisent votre système. Pas de sous-traitance lointaine, pas de mur de chargés de compte, personne pour relayer votre brief à une équipe que vous ne rencontrez jamais.",
      },
      {
        title: "Périmètre fixe, jalons clairs",
        copy: "Des livrables définis, des délais transparents et une livraison par jalons. Vous savez toujours ce qui arrive ensuite : pas de surprise, pas de dérive du périmètre.",
      },
    ],
    stackLabel: "Notre stack de production",
  },

  founders: {
    eyebrow: "Avec qui vous allez travailler",
    title: "Deux fondateurs. Tous les deux sur votre projet.",
    body1:
      "Il n'y a pas de couche commerciale ici. Quand vous écrivez à DEEV, vous nous joignez directement tous les deux, et vous gardez ce lien jusqu'au jour du lancement.",
    body2:
      "Un petit studio au Luxembourg, avec une équipe derrière. C'est délibéré : moins de projets, menés correctement, par les personnes dont le nom est dessus.",
    cta: "Parlez-nous directement",
    role: "Fondateur et CEO",
    photoAlt: (name: string, role: string) => `${name}, ${role} chez DEEV`,
  },

  luxembourg: {
    coords: "49.6117° N, 6.1300° E",
    title: "Conçu au Luxembourg.",
    titleMuted: "La confiance de toute l'Europe.",
    body:
      "Depuis le cœur de la capitale financière de l'Europe, nous construisons des systèmes numériques pour des entreprises qui se tiennent à un niveau d'exigence élevé.",
    photoAlt: "La ville de Luxembourg, le Grund et la vallée de l'Alzette",
  },

  finalCta: {
    title: "Construisons quelque chose d'exceptionnel.",
    body:
      "Pas de couche commerciale, pas de chargés de compte. Quand vous écrivez à DEEV, vous parlez directement aux personnes qui conçoivent, construisent et livrent votre projet.",
    primary: "Configurer votre projet",
    secondary: "Réserver un appel stratégique",
  },
};
