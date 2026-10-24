/**
 * The homepage, section by section, in the order the page renders them.
 * [[double brackets]] mark the accent word — see src/lib/i18nMark.tsx.
 */
export const home = {
  hero: {
    eyebrow: "Websites · AI · custom software — Luxembourg",
    title: ["More enquiries.", "Less repetitive work."],
    lead:
      "We build websites, AI solutions and custom web applications for businesses in Luxembourg. Designed to support customer acquisition and simplify everyday work.",
    ctaPrimary: "Let’s discuss your project",
    ctaSecondary: "Estimate my budget",
    founders: "Work directly with Sven and Fabio.",
    /** Bildunterschrift am echten Projektbeispiel im Hero. */
    sampleLabel: "Recent work",
    positioning: "AI-native digital engineering",
  },

  logos: { label: "Trusted by leading businesses in Luxembourg & beyond" },

  grant: {
    badge: "Government-backed funding",
    title: "Luxembourg SMEs: [[70% funded]] by the state.",
    body:
      "Websites, web-apps and AI projects qualify for the SME Digital & SME AI packages: 70% of investments from €3k–€25k (ex. VAT), with up to 15% marketing and 15% ad spend bundled in.",
    strong: "SME Digital & SME AI packages",
    cta: "See your net price",
  },

  /** The chooser directly under the hero. */
  explore: {
    label: "Where do you want to start?",
    cta: "Explore",
    areas: {
      web: { title: "Web", line: "Websites and online stores that turn visitors into enquiries." },
      software: { title: "Software", line: "Web applications, portals and internal tools built around your process." },
      data: { title: "AI & Data", line: "Custom RAG, AI agents and data analysis for serious projects." },
    },
  },

  /** The homepage's opening, since the high-end redesign. The last title line
   *  carries the accent. */
  intro: {
    kicker: "Software and AI engineering · Luxembourg",
    lines: ["We build the", "systems your", "business"],
    accent: "runs on.",
    lead: "Custom software, AI and data platforms for organisations with serious ambitions. And, for a select few, websites designed to the standard of the brand behind them.",
    primary: "Request a free intro call",
    film: "Watch AI at work",
    reviews: (rating: string, count: number) => `${rating} · ${count} Google reviews`,
    reviewsAria: (rating: string, count: number) => `Rated ${rating} out of 5 from ${count} Google reviews`,
    specs: ["Built in Luxembourg", "EU or on-premise hosting", "Design and engineering in-house"],
    visual: {
      illustrative: "Illustrative",
      product: "Billovio · our own product",
      agent: "Agent run",
      steps: ["Email classified", "Contract C-2041 checked", "Reply drafted"],
      waiting: "Waiting for approval",
      rag: "Knowledge assistant",
      question: "Notice period for supplier contracts?",
      answer: "Three months to the end of a quarter; six for framework agreements.",
      sources: "3 sources",
      forecast: "Order intake · forecast",
    },
  },

  ticker: ["Custom software", "AI agents", "Custom RAG", "Data platforms", "Forecasting", "Document AI", "Customer portals", "Brand websites"],

  /** The "AI at work" film. Every name and figure in it is invented and the
   *  frame says so. */
  film: {
    eyebrow: "AI at work",
    title: "Sixteen seconds of an agent doing real work.",
    lead: "An email arrives, a document is read, a contract is checked, a person approves, the system is updated. This is what we build: AI that runs inside your operations, with people where it matters.",
    frame: "DEEV · Agent run · Illustrative",
    live: "Live",
    play: "Play",
    pause: "Pause",
    chapters: ["Intake", "Read", "Reason", "Act"],
    intake: {
      head: "01 · Intake · 3 new messages",
      mails: [
        { subject: "Updated price list Q4", from: "Sample Supplier Sàrl", tag: "Price change" },
        { subject: "Invoice 4471", from: "Sample Logistics SA", tag: "Invoice" },
        { subject: "Contract renewal", from: "Sample Partner SA", tag: "Contract" },
      ],
    },
    read: {
      head: "02 · Read · extracting fields",
      docTitle: "Sample Supplier Sàrl",
      docSub: "Price list · Q4",
      rows: [
        { doc: "Unit price, new", key: "New price", value: "€42.60", conf: "99%" },
        { doc: "Unit price, current", key: "Current", value: "€40.00", conf: "99%" },
        { doc: "Valid from", key: "Valid from", value: "01.10.2026", conf: "98%" },
      ],
    },
    reason: {
      head: "03 · Reason · checking against the contract",
      lines: [
        "retrieve  contract C-2041 · §7.2 price adjustment",
        "agreed cap        +5.0 % per year",
        "requested         +6.5 %",
        "exceeds cap  →  draft objection, route to Purchasing",
      ],
    },
    act: {
      head: "04 · Act · with a person in the loop",
      requested: "Approval requested",
      task: "Reply to Sample Supplier Sàrl, citing §7.2",
      approved: "Approved by Purchasing",
      done: ["Reply sent", "ERP price table left unchanged", "Every step logged"],
    },
  },

  disciplines: {
    eyebrow: "What we do",
    title: "Engineering first. Design where it counts.",
    core: "Core",
    invitation: "By invitation",
    software: {
      title: "Custom software",
      copy: "Platforms, portals and internal systems built around how your organisation actually works, and engineered to be maintained for years.",
      list: ["Web platforms and SaaS", "Customer and partner portals", "Internal tools and workflows", "Integrations with ERP and CRM"],
      cta: "Explore software",
    },
    ai: {
      title: "AI and data",
      copy: "Custom RAG, AI agents and data platforms that run in production on your own data, with evaluation and governance from the first day.",
      list: ["Custom RAG and knowledge assistants", "AI agents and workflow automation", "Data platforms and pipelines", "Analytics and forecasting"],
      cta: "Explore AI and data",
    },
    design: {
      title: "Design",
      copy: "Websites and digital identities for a limited number of clients, designed to the standard of the brand behind them.",
      list: ["Brand websites", "Digital identity", "Premium e-commerce"],
      cta: "Request a design commission",
    },
  },

  /** 02 on the homepage: workshops and consulting, sold as a service in their
   *  own right. Every claim here repeats the AI page (home.ai): the method,
   *  the recent concept and the funding path. */
  workshops: {
    eyebrow: "Workshops & consulting",
    title: "Start with a workshop. Leave with a plan.",
    lead:
      "Before anything is built, we sit down with the people who run your processes and work out where software and AI actually pay. You leave with arithmetic and a roadmap, not a pitch deck.",
    offers: [
      {
        title: "Discovery workshop",
        copy: "A working session on site with your operations team. We walk every workflow with the person who lives in it and record where work stalls.",
      },
      {
        title: "Executive concept",
        copy: "Each bottleneck costed from your own volumes, an architecture that sits on your existing systems, and a phased roadmap. A document you can take to a board.",
      },
      {
        title: "Architecture & roadmap",
        copy: "Independent advice on what to build, buy or leave alone, and in which order, so each phase ships something usable in production.",
      },
    ],
    proofLabel: "A recent concept",
    proof:
      "For a Luxembourg property-management group: seven business processes mapped end to end, seven bottlenecks individually costed, a thirty-page executive concept.",
    funding: "Can qualify for the SME AI package: the state reimburses 70% of eligible costs on a project of €3,000 to €25,000 ex. VAT, so at most €17,500. Eligibility is decided at the pre-analysis.",
    primary: "Book a workshop",
    secondary: "How the workshop runs",
    photoAlt: "The Gëlle Fra in Luxembourg City against a deep blue sky",
  },

  engage: {
    eyebrow: "How engagements run",
    title: "Large programmes. Delivered in phases.",
    lead: "Large systems are not built in one leap. Every phase has its own scope, budget and outcome, and the first one ends with something running in production.",
    phase: "Phase",
    phases: [
      { title: "Discovery and architecture", copy: "On site with the people who run the processes. Bottlenecks costed, architecture and roadmap agreed." },
      { title: "First release in production", copy: "One workflow, real users, real data, measured against where you started." },
      { title: "Scale", copy: "More modules and workflows on the same foundation, each one cheaper than the last." },
      { title: "Operate and evolve", copy: "Monitoring, maintenance and a team that stays accountable after launch." },
    ],
    /** Captions on the three photographs above the phases. */
    photos: [
      { label: "On site", caption: "With the people who run the process." },
      { label: "Delivery", caption: "Many inputs, four phases, one release." },
    ],
  },

  /** The client row under the hero: real logos, one hairline row. */
  clients: { label: "Trusted in Luxembourg" },

  /** 05 on the homepage: the company, with its leadership as one line. */
  company: {
    eyebrow: "The company",
    title: "Built in Luxembourg. Close to your team.",
    lead: "We meet you in person, in Luxembourgish, French, German or English, and the people who scope your project are the people who build it.",
    labels: { company: "Company", office: "Office", languages: "Languages", leadership: "Leadership" },
    entity: "DEEV, a brand of Lux VR States Sàrl-s",
    office: "17 rue de Sélange, L-4965 Clemency",
    languages: "Lëtzebuergesch · Français · Deutsch · English",
    teamLink: "Meet the team",
    photoAlt: "Kirchberg, Luxembourg: office towers and the Philharmonie above the painted steps",
  },

  closing: {
    eyebrow: "Contact",
    title: "Tell us what you are building.",
    lead: "A first conversation costs nothing and commits you to nothing. If we are not the right team for it, we will say so.",
  },

  paths: {
    eyebrow: "What we do",
    title: "Three ways we work.",
    lead: "Different problems need different work. These are not three names for the same project.",
    items: {
      websites: {
        title: "Websites",
        problem: "Our site does not explain or sell what we offer well enough.",
        body: "A site that makes your offer understandable and keeps the next step simple. Company sites, relaunches, online stores.",
        cta: "Websites",
      },
      ai: {
        title: "AI & Data",
        problem: "Our knowledge and data should be working for us, and they are not.",
        body: "Custom RAG over your documents, AI agents that take over whole workflows, and data analysis you can base decisions on. Built for production, not for a demo.",
        cta: "AI & Data",
      },
      software: {
        title: "Custom software",
        problem: "Standard tools no longer fit how we work.",
        body: "Web applications, portals, interfaces and the business logic behind them, built around your process rather than against it.",
        cta: "Custom software",
      },
    },
  },

  budget: {
    eyebrow: "Budget",
    title: "What would it cost?",
    lead: "Configure a build and see an indicative range in about a minute. No email address, no commitment.",
    cta: "Estimate my budget",
    grantTitle: "Luxembourg SME packages",
    grantBody: "The state reimburses 70% of eligible costs on a project of €3,000 to €25,000 ex. VAT, so at most €17,500 per package. Eligibility is decided at the pre-analysis.",
    grantCta: "How the funding works",
  },

  selected: {
    eyebrow: "Selected work",
    title: "Work we have shipped. Live, and in use.",
    lead: () => "A selection of our work. Every project is live, and each links to what we actually delivered.",
    all: "See all work",
    view: "View case study",
  },

  work: {
    scrollbar: "Scroll through the projects",
    eyebrow: "Selected work",
    title: "Projects we're proud of.",
    lead:
      "From luxury travel to artisan spirits, every project is built with the same commitment to craft, performance, and results.",
    counter: (n: number) => `${n} projects delivered across Europe`,
    seeProject: "See the project",
    seeAll: "See all work",
    prev: "Previous project",
    next: "Next project",
  },

  benefits: {
    eyebrow: "Why it works",
    title: "Digital systems engineered for sustainable growth",
    lead:
      "We build the whole system, not a single piece of it: the site, the product behind it, and the campaigns that feed it. Clear structure, decisions grounded in data, and work whose commercial effect can actually be measured.",
    items: [
      {
        title: "Predictable enquiries",
        copy: "Traffic is directed at a single goal and the path to it is designed, so qualified enquiries arrive steadily instead of by chance.",
      },
      {
        title: "Measurable outcomes",
        copy: "Every build ships with analytics wired in from day one, so you can see what the work returns rather than take it on faith.",
      },
      {
        title: "AI where it earns its place",
        copy: "Automation applied to the steps that actually cost you time, not bolted on because the word sells.",
      },
      {
        title: "Full transparency",
        copy: "You talk to the people who design and build your project, and you always know what is being worked on and why.",
      },
    ],
  },

  values: {
    eyebrow: "What we build",
    title: "Everything your business needs to compete online",
    items: [
      {
        title: "AI-native products",
        copy: "AI agents and assistants that actually know your business: answering customers, qualifying leads and handling the busywork your team shouldn't be stuck with.",
      },
      {
        title: "Platforms that scale",
        copy: "Web apps and platforms that handle real customers from day one, and keep working just as well when you're ten times busier.",
      },
      {
        title: "Websites that convert",
        copy: "Fast, beautiful websites that turn visitors into customers, and that Google actually rewards.",
      },
      {
        title: "Growth that performs",
        copy: "Ads, SEO and campaigns that bring you qualified leads, measured properly, so you always know what's working.",
      },
    ],
    deckLabel: "What we build",
    processEyebrow: "How we work",
    steps: [
      { title: "Understand", copy: "We start by understanding your business, your goals and what you're up against." },
      { title: "Build", copy: "We build it ourselves, in-house. No outsourcing, no passing your project down a chain." },
      { title: "Launch", copy: "Tested and monitored, ready for real customers from the first day it's live." },
      { title: "Scale", copy: "We stick around: improving, supporting and keeping you ahead." },
    ],
  },

  stack: {
    eyebrow: "How it runs",
    title: "One system. Every layer engineered.",
    layers: [
      { name: "Interface", copy: "The websites and products your customers touch: fast, precise, engineered to convert." },
      { name: "Intelligence", copy: "AI agents and automations working inside your operations: qualifying, answering, executing." },
      { name: "Infrastructure", copy: "EU-hosted, GDPR-native foundations built to scale without drama." },
    ],
  },

  inMotion: {
    eyebrow: "In motion",
    title: "Built to move.",
    lead: "Real work, not just stills.",
  },
  marketing: {
    eyebrow: "Marketing",
    title: "Building it is half the job. Being found is the other half.",
    lead:
      "We run the campaigns that feed the systems we build, so the traffic, the site and the measurement are designed together rather than handed between three suppliers.",
    items: [
      {
        title: "Paid advertising",
        copy: "Google Ads, Meta Ads and LinkedIn: optimised for return, not for impressions.",
        detail: ["Campaign strategy", "A/B testing", "Conversion tracking"],
      },
      {
        title: "SEO & content",
        copy: "Rank higher and attract qualified leads organically, on foundations that hold.",
        detail: ["Technical SEO", "Content strategy", "Link building"],
      },
      {
        title: "Conversion optimisation",
        copy: "Turn more of the visitors you already have into customers, decided by data.",
        detail: ["Landing pages", "User testing", "Analytics"],
      },
      {
        title: "Analytics & reporting",
        copy: "Clear insight and transparent reporting on the numbers that actually matter.",
        detail: ["Custom dashboards", "ROI tracking", "Performance reports"],
      },
    ],
    deckLabel: "Marketing services",
    videosEyebrow: "In motion",
    videoTitle: (n: number, total: number) => `Deev marketing video, ${n} of ${total}`,
    playLabel: (title: string) => `Play: ${title}`,
  },

  ai: {
    eyebrow: "AI workshops & concepts",
    title: "Before we build anything, we map where AI actually pays.",
    lead:
      "We run AI discovery workshops with operations teams and turn them into an executive concept: the bottlenecks, what each one costs a year, the architecture that removes them, and a phased plan to get there. It is a document you can take to a board, not a pitch deck.",
    deckLabel: "How the workshop runs",
    fundingLabel: "Funding",
    funding:
      "Through the SME Package Digital and SME Package AI, the state reimburses [[70%]] of eligible costs on a project of €3,000 to €25,000 ex. VAT, so at most €17,500 per package. Eligibility is decided at the pre-analysis, not by the price.",
    method: [
      {
        title: "Discovery, on site",
        copy: "A working session with the people who actually run the processes, not a management interview. We walk each workflow with the person who lives in it and record where it stalls.",
      },
      {
        title: "Every flow, end to end",
        copy: "For each major process we reconstruct the full path of information, from the trigger to the resolution, noting every manual handoff, every tool involved and every point where work waits.",
      },
      {
        title: "Costed, not asserted",
        copy: "Each bottleneck is converted into an estimated annual cost from your own volumes and a conservative loaded hourly rate, then sanity-checked against comparable firms. You get arithmetic you can argue with, not adjectives.",
      },
      {
        title: "An architecture that integrates",
        copy: "The systems you already run stay. The AI layer sits on top of them, so the existing investment is protected and adoption can be gradual instead of a migration.",
      },
      {
        title: "A phased roadmap",
        copy: "Twelve months, four phases, each one shipping something usable in production. No AI project worth doing runs as a single launch, and the first tangible gains land inside the first two months.",
      },
    ],
    exampleLabel: "A recent concept",
    example:
      "For a Luxembourg property-management group we ran a discovery session with its operations and process leads, mapped seven business processes end to end, and delivered a thirty-page executive concept.",
    exampleBullets: [
      "Seven operational bottlenecks identified and individually costed",
      "A four-pillar AI architecture layered over the existing systems",
      "A twelve-month roadmap in four production phases",
      "Eligible cost and grant path mapped per phase",
    ],
  },

  /** The animated pipeline on the AI page. Method, not results: nothing here
   *  claims a figure for any client. */
  dataFlow: {
    eyebrow: "Data analysis",
    title: "Your data already knows the answer. It is just in five places.",
    lead:
      "Most companies do not lack data. They lack a foundation they can trust. Before AI is worth anything, the data has to agree with itself. This is how we get there.",
    steps: [
      {
        title: "Connect every source",
        copy: "ERP, CRM, spreadsheets, inboxes, PDFs and APIs. Pipelines pull from the systems you already run, on a schedule or in real time, without replacing any of them.",
      },
      {
        title: "Clean and model",
        copy: "Duplicates merged, formats aligned, and one agreed definition of what a customer or a sale is. The result is a versioned data foundation where every figure traces back to its source.",
      },
      {
        title: "Analyse and forecast",
        copy: "Dashboards built around the decisions you actually make, plus forecasting and anomaly detection on your own history. You see what is coming, not only what happened.",
      },
      {
        title: "Act with AI",
        copy: "On that foundation, RAG assistants and AI agents can work reliably: answering from your knowledge, drafting, booking, flagging. Anything that matters still goes to a person.",
      },
    ],
    labels: {
      duplicates: "duplicates merged",
      trend: "Trend",
      anomaly: "Anomaly",
      forecast: "Forecast",
      model: "AI",
      outReply: "Draft reply",
      outBook: "Booked",
      outReview: "To review",
    },
  },

  /** The AI page's own hero and the operational-layer diagram under it. */
  aiHero: {
    kicker: "For organisations taking AI into production",
    title: "AI that runs on your operations.",
    lead: "We connect your data, your knowledge and your processes into one operational layer, then build the RAG systems, agents and analytics that work on top of it. Built to run for years, not to impress in a demo.",
    primary: "Book a discovery session",
    secondary: "See the architecture",
    strip: "RAG · Agents · Data platforms · Analytics",
    layer: {
      label: "The operational layer",
      note: "Your systems stay. We build on top.",
      bands: [
        { name: "Action", sub: "Back into your systems", items: ["Write-back to ERP and CRM", "Human approval", "Notifications and tasks", "Audit log"], note: "" },
        { name: "Intelligence", sub: "What we build", items: ["Custom RAG", "AI agents", "Forecasting", "Document AI"], note: "Evaluated · governed · model choice stays open" },
        { name: "Foundation", sub: "A model of your business", items: ["Customer", "Contract", "Order", "Invoice", "Asset"], note: "Objects · relationships · permissions · history" },
        { name: "Sources", sub: "What you already run", items: ["ERP", "CRM", "SharePoint", "Mailboxes", "PDF and scans", "Spreadsheets", "APIs"], note: "" },
      ],
    },
    cta: "Bring us the process that costs you most.",
  },

  /** 01 on the AI page. The contract shown is invented and labelled so. */
  aiFoundation: {
    eyebrow: "The foundation",
    title: "Your data, modelled the way your business works.",
    lead: "Before AI is worth anything, it needs to know what a customer, a contract or an order is in your company, and how they connect. We build that shared model once. Every assistant, agent and dashboard then works on the same facts, with the same permissions.",
    points: [
      { title: "Objects and relationships", copy: "Customers, contracts, assets and orders, linked as they are in reality." },
      { title: "Actions with rules", copy: "What may change, who may change it, and what needs approval." },
      { title: "Lineage", copy: "Every figure traces back to the system and the record it came from." },
    ],
    panel: {
      label: "Object · Contract",
      illustrative: "Illustrative",
      name: "C-2041 · Supply agreement",
      party: "Sample Supplier Sàrl",
      status: "Active",
      fields: [
        { k: "Notice period", v: "3 months · end of quarter" },
        { k: "Renewal", v: "Automatic, yearly" },
        { k: "Price cap", v: "+5% per year" },
        { k: "Owner", v: "Purchasing" },
      ],
      linkedLabel: "Linked",
      linked: ["Supplier · 1", "Orders · 3", "Invoices · 2", "Source PDF · 1"],
      actionsLabel: "Actions",
      actions: ["Renew", "Adjust price"],
      gated: "Terminate · needs approval",
    },
  },

  /** 03 on the AI page. The run is invented and labelled so. */
  aiAgents: {
    eyebrow: "Agents and workflows",
    title: "Agents that finish the work. People where it matters.",
    lead: "An agent reads what comes in, looks up what it needs in your foundation and your documents, applies your rules, and acts in your systems. Anything outside its rules stops and waits for a person.",
    points: ["Every step logged and replayable", "Rules you set, not prompts you hope for", "Approval gates on anything irreversible"],
    panel: {
      label: "Agent run · Supplier price change",
      illustrative: "Illustrative",
      steps: [
        { kind: "Trigger", text: "Email received: “Updated price list Q4”" },
        { kind: "Classify", text: "Supplier price change · Sample Supplier Sàrl" },
        { kind: "Retrieve", text: "Contract C-2041 · clause 7.2, price cap" },
        { kind: "Check", text: "Increase of 6.5% exceeds the agreed 5% cap" },
        { kind: "Draft", text: "Reply to supplier citing clause 7.2" },
        { kind: "Approval", text: "Waiting for: Head of Purchasing" },
        { kind: "Write", text: "Send reply · keep price table unchanged in ERP" },
      ],
      approve: "Approve and send",
      edit: "Edit draft",
      reject: "Reject",
    },
  },

  /** 06 on the AI page. The evaluation rows are invented and labelled so. */
  aiGovernance: {
    eyebrow: "Evaluation and governance",
    title: "Measured before it ships. Governed after.",
    evalLabel: "Evaluation set · your real questions",
    illustrative: "Illustrative",
    running: "Running",
    cols: ["Question", "Expected source", "Result"],
    rows: [
      { q: "Notice period for supplier contracts?", src: "Contract template §7", result: "Pass · cited" },
      { q: "Who approves orders above the limit?", src: "Purchasing policy §3", result: "Pass · cited" },
      { q: "What did the board decide in Q2?", src: "Board minutes · restricted", result: "Pass · withheld" },
      { q: "Holiday entitlement for part-time staff?", src: "Not indexed", result: "Pass · said “not found”" },
      { q: "Response time for priority 1 incidents?", src: "Service SLA §2", result: "Review · wrong section" },
    ],
    points: [
      { title: "Access inherited", copy: "Roles and rights come from your existing systems." },
      { title: "Everything logged", copy: "Every answer, decision and action can be traced." },
      { title: "GDPR and EU AI Act by design", copy: "Considered from the first day, not bolted on before launch." },
      { title: "Model choice stays open", copy: "Change the model without rebuilding the system around it." },
    ],
  },

  /** The RAG demo. The question, the sources and the answer are invented and
   *  the panel says so. */
  rag: {
    eyebrow: "Custom RAG",
    title: "Answers grounded in your documents. Every source shown.",
    lead: "Retrieval-augmented generation connects a language model to what your organisation knows: contracts, manuals, tickets, wikis, reports. It finds the relevant passages first and answers from them only, citing where every statement comes from. When nothing relevant exists, it says so instead of guessing.",
    pointsLabel: "What makes ours custom",
    points: [
      { title: "Your sources, kept in sync", copy: "We index the systems you already use and keep the index current as documents change." },
      { title: "Access rights carried through", copy: "People only get answers from documents they are allowed to open." },
      { title: "Every answer cites its sources", copy: "Each statement links back to the passage it came from, so it can be checked in one click." },
      { title: "Measured before launch", copy: "Answer quality is tested against a set of your real questions, before go-live and after every change." },
      { title: "Hosting that fits your data", copy: "In the EU, or on your own infrastructure where the data must not leave." },
    ],
    demo: {
      label: "Illustrative example",
      askLabel: "Question",
      indexLabel: "Your knowledge base",
      answerLabel: "Answer",
      locked: "No access",
      question: "What notice period applies to our supplier contracts?",
      sources: [
        "Supplier contract template.pdf",
        "Purchasing policy 2025.docx",
        "Framework agreement.pdf",
        "Board minutes Q2.pdf",
        "Service SLA.pdf",
        "Onboarding wiki",
        "Ticket #4821",
      ],
      answer: [
        { text: "Standard supplier contracts end with three months’ notice to the end of a quarter", cite: 1 },
        { text: ". Framework agreements are the exception: six months, in writing", cite: 3 },
        { text: ". Any shorter period needs approval from legal", cite: 2 },
        { text: "." },
      ],
      status: {
        typing: "Question",
        searching: "Searching 7 sources",
        found: "3 relevant passages · 1 source without access",
        answering: "Writing the answer",
        done: "Answer with sources",
      },
    },
  },

  /** The self-playing extraction demo. Every value in it is invented and the
   *  panel says so; the confidence figures illustrate the mechanism. */
  docAi: {
    eyebrow: "Documents to data",
    title: "A document arrives. Nobody retypes it.",
    lead:
      "Invoices, delivery notes, forms and contracts are read, their fields extracted and checked, and the result written straight into the system it belongs in.",
    points: [
      "Reads PDFs, scans and photographed paper.",
      "Every extracted field carries a confidence score.",
      "Uncertain fields go to a person before anything is booked.",
    ],
    demoLabel: "Illustrative example",
    recordLabel: "Extracted record",
    confidence: "Confidence",
    doc: {
      kind: "Invoice",
      supplier: "Sample Supplier Sàrl",
      address: "L-1234 Luxembourg",
      lines: [
        { label: "Consulting, September", amount: "1,120.00" },
        { label: "Travel expenses", amount: "120.00" },
      ],
    },
    fields: {
      supplier: "Supplier",
      number: "Invoice no.",
      date: "Date",
      net: "Net",
      vat: "VAT 17%",
      total: "Total",
      iban: "IBAN",
    },
    values: {
      number: "2026-0412",
      date: "14/09/2026",
      net: "€1,240.00",
      vat: "€210.80",
      total: "€1,450.80",
    },
    status: {
      reading: "Reading document",
      review: "1 field sent to review",
      approved: "Checked by a person",
      done: "Ready to book",
    },
  },

  billovio: {
    eyebrow: "Our own product",
    by: "by DEEV",
    statement: "We don't just build AI. We ship it.",
    lead:
      "Describe a job in one sentence and Billovio writes the scope, prices the work, and takes it all the way to signature and invoice.",
    features: [
      "Scope written from one sentence",
      "Priced to your own rate card",
      "Signature and invoice in one flow",
      "In your brand, in about 30 seconds",
    ],
    cta: "Open billovio.com",
    shotAlt: "Billovio, a quote written, priced and sent from a single sentence",
  },

  trust: {
    eyebrow: "Why Deev",
    title: "Engineered to be trusted with what matters.",
    lead:
      "High-stakes projects need more than good design. They need a partner who reduces your risk at every step.",
    credentials: [
      { value: "2", label: "Founders, both on your project" },
      { value: "3", label: "Languages, fully maintained" },
      { value: "EU", label: "Based in Luxembourg" },
      { value: "In-house", label: "Design and engineering" },
    ],
    pillars: [
      {
        title: "GDPR & data sovereignty",
        copy: "EU-hosted infrastructure and GDPR-compliant by default. Your data stays in Europe, handled to the standard regulated industries demand.",
      },
      {
        title: "Security-first engineering",
        copy: "Secure-by-design architecture, dependency auditing, and least-privilege access on every project, not an afterthought bolted on later.",
      },
      {
        title: "Direct delivery",
        copy: "You work directly with the people building your system. No offshore handoffs, no account-manager wall, and nobody relaying your brief to a team you never meet.",
      },
      {
        title: "Fixed scope, clear milestones",
        copy: "Defined deliverables, transparent timelines, and milestone-based delivery. You always know what's shipping next: no surprises, no scope drift.",
      },
    ],
    stackLabel: "Our production stack",
  },

  founders: {
    eyebrow: "Who you'll work with",
    title: "Two founders. Both of them on your project.",
    body1:
      "There is no sales layer here. When you write to DEEV you reach the two of us directly, and you keep that line until launch day.",
    body2:
      "A small studio in Luxembourg with a team behind it. That is deliberate: fewer projects, run properly, by the people whose names are on them.",
    cta: "Talk to us directly",
    role: "Co-founder",
    photoAlt: (name: string, role: string) => `${name}, ${role} at DEEV`,
  },

  luxembourg: {
    coords: "49.6117° N, 6.1300° E",
    title: "Engineered in Luxembourg.",
    titleMuted: "Trusted across Europe.",
    body:
      "From the heart of Europe's financial capital, we build digital systems for companies that hold themselves to a higher standard.",
    photoAlt: "Luxembourg City, the Grund and the Alzette valley",
  },

  finalCta: {
    title: "Let's build something extraordinary.",
    body:
      "No sales layer, no account managers. When you write to DEEV, you talk directly to the people who design, build and ship your project.",
    primary: "Configure your project",
    secondary: "Book a strategy call",
  },
};
