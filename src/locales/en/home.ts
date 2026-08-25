/**
 * The homepage, section by section, in the order the page renders them.
 * [[double brackets]] mark the accent word — see src/lib/i18nMark.tsx.
 */
export const home = {
  hero: {
    eyebrow: "AI-native digital engineering, Luxembourg",
    title: ["Platforms that [[convert]].", "Systems that scale.", "Built in Luxembourg."],
    lead:
      "AI-powered platforms, web apps and digital systems engineered to convert, automate and scale, built in Luxembourg for ambitious companies across Europe.",
    claims: [
      "AI-native web platforms, web apps and online stores",
      "Lead engines engineered to convert, not just to look good",
      "70% funded by the Luxembourg SME state grant",
    ],
    ctaPrimary: "Configure your project",
    ctaSecondary: "Book a strategy call",
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

  work: {
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
      "Luxembourg SMEs cover [[70%]] of eligible costs through Luxinnovation's SME Package AI & Digital, capped at €25,000 of grant per project.",
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
      { value: "50+", label: "Projects delivered" },
      { value: "100%", label: "On-time delivery" },
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
    role: "Founder & CEO",
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
