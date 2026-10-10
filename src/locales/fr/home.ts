import type { home as En } from "../en/home";

export const home: typeof En = {
  hero: {
    eyebrow: "Sites web · IA · logiciel sur mesure — Luxembourg",
    title: ["Plus de demandes.", "Moins de tâches répétitives."],
    lead:
      "Nous créons des sites web, des solutions d’IA et des applications sur mesure pour les entreprises au Luxembourg. Pour faciliter l’acquisition de clients et simplifier le quotidien.",
    ctaPrimary: "Parlons de votre projet",
    ctaSecondary: "Estimer mon budget",
    founders: "En direct avec Sven et Fabio.",
    sampleLabel: "Réalisation récente",
    positioning: "Ingénierie numérique AI-native",
  },

  logos: { label: "La confiance d'entreprises de premier plan au Luxembourg et au-delà" },

  grant: {
    badge: "Financement public",
    title: "PME luxembourgeoises : [[70% financés]] par l'État.",
    body:
      "Les sites web, applications web et projets IA sont éligibles aux programmes SME Digital et SME AI : 70% des investissements de 3 000 € à 25 000 € (HT), dont jusqu'à 15% de marketing et 15% de budget publicitaire.",
    strong: "programmes SME Digital et SME AI",
    cta: "Voir votre prix net",
  },

  explore: {
    label: "Par où voulez-vous commencer\u00a0?",
    cta: "Découvrir",
    areas: {
      web: { title: "Web", line: "Des sites et boutiques en ligne qui transforment les visiteurs en demandes." },
      software: { title: "Logiciel", line: "Applications web, portails et outils internes, construits autour de vos processus." },
      data: { title: "IA & Données", line: "RAG sur mesure, agents IA et analyse de données pour des projets exigeants." },
    },
  },

  paths: {
    eyebrow: "Ce que nous faisons",
    title: "Trois façons de travailler.",
    lead: "Des problèmes différents demandent un travail différent. Ce ne sont pas trois noms pour le même projet.",
    items: {
      websites: {
        title: "Sites web",
        problem: "Notre site n’explique pas assez bien ce que nous proposons.",
        body: "Un site qui rend votre offre compréhensible et garde l’étape suivante simple. Sites d’entreprise, refontes, boutiques en ligne.",
        cta: "Sites web",
      },
      ai: {
        title: "IA & Données",
        problem: "Notre savoir et nos données devraient travailler pour nous, et ce n’est pas le cas.",
        body: "Un RAG sur mesure sur vos documents, des agents IA qui prennent en charge des processus entiers, et une analyse de données sur laquelle fonder vos décisions. Conçus pour la production, pas pour une démo.",
        cta: "IA & Données",
      },
      software: {
        title: "Logiciel sur mesure",
        problem: "Les outils standards ne correspondent plus à notre façon de travailler.",
        body: "Applications web, portails, interfaces et la logique métier derrière, conçus autour de votre processus plutôt que contre lui.",
        cta: "Logiciel sur mesure",
      },
    },
  },

  budget: {
    eyebrow: "Budget",
    title: "Combien cela coûterait-il ?",
    lead: "Configurez un projet et voyez une fourchette indicative en une minute. Sans adresse e-mail, sans engagement.",
    cta: "Estimer mon budget",
    grantTitle: "SME Packages Luxembourg",
    grantBody: "L’État rembourse 70 % des coûts éligibles sur un projet de 3 000 à 25 000 € HT, soit au maximum 17 500 € par package. L’éligibilité se décide lors de la pré-analyse.",
    grantCta: "Comment fonctionne l’aide",
  },

  selected: {
    eyebrow: "Réalisations",
    title: "Des projets que nous avons livrés.",
    lead: () => "Une sélection de notre travail. Chaque projet est en ligne, et chacun renvoie à ce que nous avons réellement livré.",
    all: "Voir toutes les réalisations",
    view: "Voir l’étude de cas",
  },

  work: {
    scrollbar: "Faire défiler les projets",
    eyebrow: "Réalisations",
    title: "Des projets dont nous sommes fiers.",
    lead:
      "Du voyage de luxe aux spiritueux artisanaux, chaque projet est construit avec la même exigence de savoir-faire, de performance et de résultats.",
    counter: (n: number) => `${n} projets livrés à travers l'Europe`,
    seeProject: "Voir le projet",
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
    deckLabel: "Ce que nous construisons",
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

  inMotion: {
    eyebrow: "En mouvement",
    title: "Conçu pour bouger.",
    lead: "Du travail réel, pas seulement des images fixes.",
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
    deckLabel: "Services marketing",
    videosEyebrow: "En mouvement",
    videoTitle: (n: number, total: number) => `Vidéo marketing Deev, ${n} sur ${total}`,
    playLabel: (title: string) => `Lire : ${title}`,
  },

  ai: {
    eyebrow: "Ateliers et concepts IA",
    title: "Avant de construire quoi que ce soit, nous cartographions là où l'IA rapporte vraiment.",
    lead:
      "Nous animons des ateliers de découverte IA avec les équipes opérationnelles et les transformons en concept exécutif : les goulets d'étranglement, ce que chacun coûte par an, l'architecture qui les supprime, et un plan par phases pour y arriver. Un document présentable à un conseil d'administration, pas une plaquette commerciale.",
    deckLabel: "Comment se déroule l'atelier",
    fundingLabel: "Financement",
    funding:
      "Via les SME Packages Digital et AI, l'État rembourse [[70%]] des coûts éligibles sur un projet de 3 000 à 25 000 € HT, soit au maximum 17 500 € par package. L'éligibilité se décide lors de la pré-analyse, pas par le prix.",
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

  dataFlow: {
    eyebrow: "Analyse de données",
    title: "Vos données connaissent déjà la réponse. Elle est juste à cinq endroits.",
    lead:
      "La plupart des entreprises ne manquent pas de données. Il leur manque un socle fiable. Avant que l’IA ne vaille quoi que ce soit, les données doivent concorder. Voici comment nous y arrivons.",
    steps: [
      {
        title: "Connecter chaque source",
        copy: "ERP, CRM, tableurs, boîtes mail, PDF et API. Des pipelines puisent dans les systèmes que vous utilisez déjà, à intervalles réguliers ou en temps réel, sans en remplacer aucun.",
      },
      {
        title: "Nettoyer et modéliser",
        copy: "Doublons fusionnés, formats harmonisés, et une définition commune de ce qu’est un client ou une vente. Le résultat\u00a0: un socle de données versionné où chaque chiffre reste traçable jusqu’à sa source.",
      },
      {
        title: "Analyser et prévoir",
        copy: "Des tableaux de bord construits autour des décisions que vous prenez vraiment, avec des prévisions et une détection d’anomalies sur votre propre historique. Vous voyez ce qui arrive, pas seulement ce qui s’est passé.",
      },
      {
        title: "Agir avec l’IA",
        copy: "Sur ce socle, assistants RAG et agents IA travaillent de façon fiable\u00a0: ils répondent à partir de votre savoir, rédigent, comptabilisent, signalent. Ce qui compte passe toujours par une personne.",
      },
    ],
    labels: {
      duplicates: "doublons fusionnés",
      trend: "Tendance",
      anomaly: "Anomalie",
      forecast: "Prévision",
      model: "IA",
      outReply: "Brouillon",
      outBook: "Comptabilisé",
      outReview: "À vérifier",
    },
  },

  aiCapabilities: {
    eyebrow: "Ce que nous construisons",
    title: "Une IA haut de gamme, construite pour durer des années.",
    lead: "Nous prenons moins de projets d’IA, mais de plus grande envergure\u00a0: des systèmes intégrés au fonctionnement de votre organisation, sur vos propres données, avec quelqu’un qui en répond après la mise en service.",
    items: [
      { title: "RAG sur mesure et assistants de connaissances", copy: "Des réponses issues de vos propres documents et systèmes, sourcées, dans le respect des droits d’accès. Évaluées sur vos vraies questions." },
      { title: "Agents IA et automatisation des processus", copy: "Des agents qui portent une tâche de la boîte mail jusqu’au système\u00a0: lire, décider selon vos règles, agir, et confier les exceptions à une personne." },
      { title: "Plateformes et pipelines de données", copy: "Vos sources reliées en un socle de données propre et versionné, sur lequel l’analyse et l’IA peuvent compter." },
      { title: "Analyse et prévisions", copy: "Des tableaux de bord construits autour de vos décisions, avec prévisions et détection d’anomalies sur votre propre historique." },
      { title: "Intelligence documentaire", copy: "Factures, contrats et formulaires lus, extraits, contrôlés et inscrits dans le système auquel ils appartiennent." },
      { title: "Architecture, sécurité et conformité", copy: "Choix des modèles, hébergement, contrôle d’accès, RGPD et AI Act européen pris en compte dès le premier jour, pas ajoutés juste avant le lancement." },
    ],
  },

  rag: {
    eyebrow: "RAG sur mesure",
    title: "Interrogez votre propre savoir. Obtenez des réponses sourcées.",
    lead: "La génération augmentée par récupération (RAG) relie un modèle de langage à ce que sait votre organisation\u00a0: contrats, manuels, tickets, wikis, rapports. Au lieu de deviner, il retrouve d’abord les passages pertinents et répond à partir d’eux, en indiquant d’où vient chaque affirmation.",
    pointsLabel: "Ce qui rend les nôtres sur mesure",
    points: [
      { title: "Vos sources, toujours à jour", copy: "Nous indexons les systèmes que vous utilisez déjà et maintenons l’index à jour quand les documents changent." },
      { title: "Les droits d’accès respectés", copy: "Chacun n’obtient des réponses qu’à partir des documents qu’il a le droit d’ouvrir." },
      { title: "Chaque réponse cite ses sources", copy: "Chaque affirmation renvoie au passage d’où elle vient, vérifiable en un clic." },
      { title: "Mesuré avant la mise en service", copy: "La qualité des réponses est testée sur un ensemble de vos vraies questions, avant la mise en production et après chaque modification." },
      { title: "Un hébergement adapté à vos données", copy: "Dans l’UE, ou sur votre propre infrastructure lorsque les données ne doivent pas sortir." },
    ],
    demo: {
      label: "Exemple illustratif",
      askLabel: "Question",
      indexLabel: "Votre base de connaissances",
      answerLabel: "Réponse",
      locked: "Sans accès",
      question: "Quel préavis s’applique à nos contrats fournisseurs\u00a0?",
      sources: [
        "Modèle contrat fournisseur.pdf",
        "Politique d’achats 2025.docx",
        "Contrat-cadre.pdf",
        "PV conseil T2.pdf",
        "SLA de service.pdf",
        "Wiki d’accueil",
        "Ticket #4821",
      ],
      answer: [
        { text: "Les contrats fournisseurs standard se résilient avec trois mois de préavis pour la fin d’un trimestre", cite: 1 },
        { text: ". Les contrats-cadres font exception\u00a0: six mois, par écrit", cite: 3 },
        { text: ". Tout délai plus court requiert l’accord du service juridique", cite: 2 },
        { text: "." },
      ],
      status: {
        typing: "Question",
        searching: "Recherche dans 7 sources",
        found: "3 passages pertinents \u00b7 1 source sans accès",
        answering: "Rédaction de la réponse",
        done: "Réponse sourcée",
      },
    },
  },

  docAi: {
    eyebrow: "Des documents aux données",
    title: "Un document arrive. Personne ne le ressaisit.",
    lead:
      "Factures, bons de livraison, formulaires et contrats sont lus, leurs champs extraits et contrôlés, et le résultat est écrit directement dans le système auquel il appartient.",
    points: [
      "Lit les PDF, les scans et le papier photographié.",
      "Chaque champ extrait porte un indice de fiabilité.",
      "Les champs incertains passent par une personne avant toute comptabilisation.",
    ],
    demoLabel: "Exemple illustratif",
    recordLabel: "Fiche extraite",
    confidence: "Fiabilité",
    doc: {
      kind: "Facture",
      supplier: "Fournisseur Exemple Sàrl",
      address: "L-1234 Luxembourg",
      lines: [
        { label: "Conseil, septembre", amount: "1 120,00" },
        { label: "Frais de déplacement", amount: "120,00" },
      ],
    },
    fields: {
      supplier: "Fournisseur",
      number: "N° de facture",
      date: "Date",
      net: "Total HT",
      vat: "TVA 17 %",
      total: "Total TTC",
      iban: "IBAN",
    },
    values: {
      number: "2026-0412",
      date: "14/09/2026",
      net: "1 240,00 €",
      vat: "210,80 €",
      total: "1 450,80 €",
    },
    status: {
      reading: "Lecture du document",
      review: "1 champ envoyé en vérification",
      approved: "Vérifié par une personne",
      done: "Prêt à comptabiliser",
    },
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
      { value: "2", label: "Fondateurs, tous deux sur votre projet" },
      { value: "3", label: "Langues, entièrement maintenues" },
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
