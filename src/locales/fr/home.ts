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

  intro: {
    kicker: "Ingénierie logicielle et IA · Luxembourg",
    lines: ["Nous construisons", "les systèmes qui", "font tourner votre"],
    accent: "entreprise.",
    lead: "Logiciels sur mesure, IA et plateformes de données pour les organisations aux ambitions sérieuses. Et, pour quelques-unes, des sites web conçus à la hauteur de la marque qu’ils représentent.",
    primary: "Demander un échange gratuit",
    film: "Voir l’IA à l’œuvre",
    specs: ["Conçu au Luxembourg", "Hébergement UE ou sur site", "Design et ingénierie en interne"],
    visual: {
      illustrative: "Exemple",
      product: "Billovio · notre propre produit",
      agent: "Exécution d\u2019agent",
      steps: ["E-mail classé", "Contrat C-2041 vérifié", "Réponse rédigée"],
      waiting: "En attente de validation",
      rag: "Assistant de connaissances",
      question: "Préavis des contrats fournisseurs\u00a0?",
      answer: "Trois mois pour la fin d\u2019un trimestre\u00a0; six pour les contrats-cadres.",
      sources: "3 sources",
      forecast: "Prises de commande · prévision",
    },
  },

  ticker: ["Logiciels sur mesure", "Agents IA", "RAG sur mesure", "Plateformes de données", "Prévisions", "IA documentaire", "Portails clients", "Sites de marque"],

  film: {
    eyebrow: "L’IA à l’œuvre",
    title: "Seize secondes d’un agent qui fait un vrai travail.",
    lead: "Un e-mail arrive, un document est lu, un contrat est vérifié, une personne valide, le système est mis à jour. C’est ce que nous construisons : une IA qui travaille dans vos opérations, avec des personnes là où ça compte.",
    frame: "DEEV · Exécution d’agent · Exemple",
    live: "Direct",
    play: "Lire",
    pause: "Pause",
    chapters: ["Réception", "Lecture", "Raisonnement", "Action"],
    intake: {
      head: "01 · Réception · 3 nouveaux messages",
      mails: [
        { subject: "Liste de prix T4 mise à jour", from: "Fournisseur Exemple Sàrl", tag: "Hausse de prix" },
        { subject: "Facture 4471", from: "Logistique Exemple SA", tag: "Facture" },
        { subject: "Renouvellement de contrat", from: "Partenaire Exemple SA", tag: "Contrat" },
      ],
    },
    read: {
      head: "02 · Lecture · extraction des champs",
      docTitle: "Fournisseur Exemple Sàrl",
      docSub: "Liste de prix · T4",
      rows: [
        { doc: "Prix unitaire, nouveau", key: "Nouveau prix", value: "42,60 €", conf: "99 %" },
        { doc: "Prix unitaire, actuel", key: "Actuel", value: "40,00 €", conf: "99 %" },
        { doc: "Valable dès", key: "Valable dès", value: "01/10/2026", conf: "98 %" },
      ],
    },
    reason: {
      head: "03 · Raisonnement · vérification du contrat",
      lines: [
        "récupérer contrat C-2041 · §7.2 révision de prix",
        "plafond convenu   +5,0 % par an",
        "demandé           +6,5 %",
        "au-delà du plafond  →  objection, transmise aux Achats",
      ],
    },
    act: {
      head: "04 · Action · avec une personne dans la boucle",
      requested: "Validation demandée",
      task: "Réponse à Fournisseur Exemple Sàrl citant le §7.2",
      approved: "Validé par les Achats",
      done: ["Réponse envoyée", "Grille tarifaire de l’ERP inchangée", "Chaque étape journalisée"],
    },
  },

  disciplines: {
    eyebrow: "Ce que nous faisons",
    title: "L’ingénierie d’abord. Le design là où il compte.",
    core: "Cœur",
    invitation: "Sur invitation",
    software: {
      title: "Logiciels sur mesure",
      copy: "Plateformes, portails et systèmes internes construits autour de la façon dont votre organisation fonctionne vraiment, et conçus pour être maintenus pendant des années.",
      list: ["Plateformes web et SaaS", "Portails clients et partenaires", "Outils et processus internes", "Intégrations ERP et CRM"],
      cta: "Découvrir le logiciel",
    },
    ai: {
      title: "IA et données",
      copy: "RAG sur mesure, agents IA et plateformes de données qui tournent en production sur vos propres données, avec évaluation et gouvernance dès le premier jour.",
      list: ["RAG sur mesure et assistants de connaissances", "Agents IA et automatisation des processus", "Plateformes et pipelines de données", "Analyse et prévisions"],
      cta: "Découvrir l’IA et les données",
    },
    design: {
      title: "Design",
      copy: "Sites web et identités numériques pour un nombre limité de clients, conçus à la hauteur de la marque qu’ils représentent.",
      list: ["Sites de marque", "Identité numérique", "E-commerce premium"],
      cta: "Demander un projet de design",
    },
  },

  workshops: {
    eyebrow: "Ateliers & conseil",
    title: "Commencez par un atelier. Repartez avec un plan.",
    lead:
      "Avant de construire quoi que ce soit, nous nous asseyons avec ceux qui font tourner vos processus et établissons où le logiciel et l'IA rapportent vraiment. Vous repartez avec des chiffres et une feuille de route, pas une présentation commerciale.",
    offers: [
      {
        title: "Atelier de découverte",
        copy: "Une séance de travail sur place avec votre équipe opérationnelle. Nous parcourons chaque flux avec la personne qui le vit et notons où le travail bloque.",
      },
      {
        title: "Concept exécutif",
        copy: "Chaque goulot chiffré à partir de vos propres volumes, une architecture posée sur vos systèmes existants et une feuille de route par phases. Un document à présenter à un conseil d'administration.",
      },
      {
        title: "Architecture & feuille de route",
        copy: "Un conseil indépendant sur ce qu'il faut construire, acheter ou laisser de côté, et dans quel ordre, pour que chaque phase livre quelque chose d'utilisable en production.",
      },
    ],
    proofLabel: "Un concept récent",
    proof:
      "Pour un groupe luxembourgeois de gestion immobilière : sept processus cartographiés de bout en bout, sept goulots chiffrés un à un, un concept exécutif de trente pages.",
    funding: "Peut relever du SME Package AI : l'État rembourse 70 % des coûts éligibles sur un projet de 3 000 à 25 000 € HT, soit au maximum 17 500 €. L'éligibilité est décidée lors de la pré-analyse.",
    primary: "Réserver un atelier",
    secondary: "Le déroulé de l'atelier",
    photoAlt: "La Gëlle Fra à Luxembourg-Ville sur un ciel bleu profond",
  },

  engage: {
    eyebrow: "Comment se déroulent nos projets",
    title: "De grands programmes. Livrés par phases.",
    lead: "Les grands systèmes ne se construisent pas d’un seul bond. Chaque phase a son propre périmètre, son budget et son résultat, et la première se termine par quelque chose qui tourne en production.",
    phase: "Phase",
    phases: [
      { title: "Découverte et architecture", copy: "Sur place avec les personnes qui font tourner les processus. Goulots chiffrés, architecture et feuille de route validées." },
      { title: "Première version en production", copy: "Un processus, de vrais utilisateurs, de vraies données, mesuré par rapport au point de départ." },
      { title: "Montée en charge", copy: "D’autres modules et processus sur le même socle, chacun moins coûteux que le précédent." },
      { title: "Exploitation et évolution", copy: "Supervision, maintenance et une équipe qui reste responsable après le lancement." },
    ],
    photos: [
      { label: "Sur place", caption: "Avec ceux qui font tourner le processus." },
      { label: "Livraison", caption: "De nombreuses entrées, quatre phases, une mise en production." },
    ],
  },

  clients: { label: "Ils nous font confiance au Luxembourg" },

  company: {
    eyebrow: "L'entreprise",
    title: "Conçu au Luxembourg. Proche de votre équipe.",
    lead: "Nous vous rencontrons en personne, en luxembourgeois, en français, en allemand ou en anglais, et ceux qui cadrent votre projet sont ceux qui le réalisent.",
    labels: { company: "Entreprise", office: "Bureau", languages: "Langues", leadership: "Direction" },
    entity: "DEEV, une marque de Lux VR States Sàrl-s",
    office: "17 rue de Sélange, L-4965 Clemency",
    languages: "Lëtzebuergesch · Français · Deutsch · English",
    teamLink: "Découvrir l'équipe",
    photoAlt: "Kirchberg, Luxembourg : tours de bureaux et la Philharmonie au-dessus des marches peintes",
  },

  closing: {
    eyebrow: "Contact",
    title: "Dites-nous ce que vous construisez.",
    lead: "Un premier échange ne coûte rien et ne vous engage à rien. Si nous ne sommes pas la bonne équipe, nous vous le dirons.",
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
    title: "Livrés. En ligne et utilisés.",
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

  aiHero: {
    kicker: "Pour les organisations qui mettent l’IA en production",
    title: "Une IA qui tourne sur vos opérations.",
    lead: "Nous relions vos données, votre savoir et vos processus en une couche opérationnelle, puis nous construisons dessus les systèmes RAG, les agents et les analyses qui travaillent avec. Conçu pour tourner des années, pas pour impressionner en démo.",
    primary: "Réserver une session de découverte",
    secondary: "Voir l’architecture",
    strip: "RAG · Agents · Plateformes de données · Analyse",
    layer: {
      label: "La couche opérationnelle",
      note: "Vos systèmes restent. Nous construisons par-dessus.",
      bands: [
        { name: "Action", sub: "Retour dans vos systèmes", items: ["Écriture dans l’ERP et le CRM", "Validation humaine", "Notifications et tâches", "Journal d’audit"], note: "" },
        { name: "Intelligence", sub: "Ce que nous construisons", items: ["RAG sur mesure", "Agents IA", "Prévisions", "IA documentaire"], note: "Évalué · gouverné · choix du modèle ouvert" },
        { name: "Socle", sub: "Un modèle de votre entreprise", items: ["Client", "Contrat", "Commande", "Facture", "Actif"], note: "Objets · relations · droits · historique" },
        { name: "Sources", sub: "Ce que vous utilisez déjà", items: ["ERP", "CRM", "SharePoint", "Boîtes mail", "PDF et scans", "Tableurs", "API"], note: "" },
      ],
    },
    cta: "Apportez-nous le processus qui vous coûte le plus.",
  },

  aiFoundation: {
    eyebrow: "Le socle",
    title: "Vos données, modélisées comme fonctionne votre entreprise.",
    lead: "Avant que l’IA ne vaille quoi que ce soit, elle doit savoir ce qu’est un client, un contrat ou une commande chez vous, et comment ils sont liés. Nous construisons ce modèle commun une fois. Chaque assistant, agent et tableau de bord travaille ensuite sur les mêmes faits, avec les mêmes droits.",
    points: [
      { title: "Objets et relations", copy: "Clients, contrats, actifs et commandes, liés comme dans la réalité." },
      { title: "Des actions encadrées", copy: "Ce qui peut changer, qui peut le changer et ce qui requiert une validation." },
      { title: "Traçabilité", copy: "Chaque chiffre remonte au système et à l’enregistrement dont il provient." },
    ],
    panel: {
      label: "Objet · Contrat",
      illustrative: "Exemple",
      name: "C-2041 · Contrat d’approvisionnement",
      party: "Fournisseur Exemple Sàrl",
      status: "Actif",
      fields: [
        { k: "Préavis", v: "3 mois · fin de trimestre" },
        { k: "Renouvellement", v: "Automatique, annuel" },
        { k: "Plafond de prix", v: "+5 % par an" },
        { k: "Responsable", v: "Achats" },
      ],
      linkedLabel: "Liés",
      linked: ["Fournisseur · 1", "Commandes · 3", "Factures · 2", "PDF source · 1"],
      actionsLabel: "Actions",
      actions: ["Renouveler", "Ajuster le prix"],
      gated: "Résilier · validation requise",
    },
  },

  aiAgents: {
    eyebrow: "Agents et processus",
    title: "Des agents qui finissent le travail. Des personnes là où ça compte.",
    lead: "Un agent lit ce qui arrive, cherche ce dont il a besoin dans votre socle et vos documents, applique vos règles et agit dans vos systèmes. Tout ce qui sort de ses règles s’arrête et attend une personne.",
    points: ["Chaque étape journalisée et rejouable", "Des règles que vous fixez, pas des prompts qu’on espère", "Une validation avant tout ce qui est irréversible"],
    panel: {
      label: "Exécution d’agent · Hausse de prix fournisseur",
      illustrative: "Exemple",
      steps: [
        { kind: "Déclencheur", text: "E-mail reçu : « Liste de prix T4 mise à jour »" },
        { kind: "Classer", text: "Hausse de prix fournisseur · Fournisseur Exemple Sàrl" },
        { kind: "Récupérer", text: "Contrat C-2041 · clause 7.2, plafond de prix" },
        { kind: "Vérifier", text: "Hausse de 6,5 % au-delà du plafond convenu de 5 %" },
        { kind: "Rédiger", text: "Réponse au fournisseur citant la clause 7.2" },
        { kind: "Validation", text: "En attente de : responsable des achats" },
        { kind: "Écrire", text: "Envoyer la réponse · ne pas modifier la grille tarifaire dans l’ERP" },
      ],
      approve: "Valider et envoyer",
      edit: "Modifier le brouillon",
      reject: "Refuser",
    },
  },

  aiGovernance: {
    eyebrow: "Évaluation et gouvernance",
    title: "Mesuré avant la mise en service. Gouverné ensuite.",
    evalLabel: "Jeu de tests · vos vraies questions",
    illustrative: "Exemple",
    running: "En cours",
    cols: ["Question", "Source attendue", "Résultat"],
    rows: [
      { q: "Préavis des contrats fournisseurs ?", src: "Modèle de contrat §7", result: "Réussi · cité" },
      { q: "Qui valide les commandes au-delà du plafond ?", src: "Politique d’achats §3", result: "Réussi · cité" },
      { q: "Qu’a décidé le conseil au T2 ?", src: "PV du conseil · restreint", result: "Réussi · non divulgué" },
      { q: "Congés des salariés à temps partiel ?", src: "Non indexé", result: "Réussi · « introuvable »" },
      { q: "Délai de réponse pour un incident prioritaire ?", src: "SLA de service §2", result: "À revoir · mauvaise section" },
    ],
    points: [
      { title: "Droits hérités", copy: "Les rôles et droits viennent de vos systèmes existants." },
      { title: "Tout est journalisé", copy: "Chaque réponse, décision et action est traçable." },
      { title: "RGPD et AI Act dès la conception", copy: "Pris en compte dès le premier jour, pas ajoutés juste avant le lancement." },
      { title: "Choix du modèle ouvert", copy: "Changer de modèle sans reconstruire le système autour." },
    ],
  },

  rag: {
    eyebrow: "RAG sur mesure",
    title: "Des réponses fondées sur vos documents. Chaque source visible.",
    lead: "La génération augmentée par récupération (RAG) relie un modèle de langage à ce que sait votre organisation\u00a0: contrats, manuels, tickets, wikis, rapports. Elle retrouve d’abord les passages pertinents et ne répond qu’à partir d’eux, en indiquant d’où vient chaque affirmation. Quand rien de pertinent n’existe, elle le dit au lieu de deviner.",
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
    role: "Cofondateur",
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
