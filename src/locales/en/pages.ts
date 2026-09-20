/** /work, /work/:slug and /contact. */
export const pages = {
  work: {
    eyebrow: "Selected work",
    title: "A selection of our work.",
    lead: "Websites, online stores and web apps, built in Luxembourg for companies across Europe.",
    filters: {
      all: "All",
      website: "Websites",
      webapp: "Web apps & software",
      ecommerce: "E-commerce",
      ai: "AI & automation",
    },
  },

  workCase: {
    back: "All work",
    spec: { client: "Client", sector: "Sector", type: "Type", year: "Year", stack: "Stack" },
    scope: "What we did",
    scopeItems: {
      website: "Website",
      onlineStore: "Online store",
      platform: "Web platform",
      branding: "Brand and visual identity",
    },
    visit: "Visit the live site",
    brief: "The brief",
    built: "What we built",
    outcome: "The outcome",
    chapters: { context: "Context", challenge: "The brief", approach: "The approach", execution: "Execution", outcome: "The outcome" },
    services: "Services",
    deliverables: "What we delivered",
    technical: "Under the surface",
    ownProduct: "Own product",
    snapshot: { industry: "Industry", audience: "Audience", location: "Location" },
    livePreview: "Live",
    specOnly: "For this project the key facts and the live site are documented; the full case study is not written yet. We only write one once the brief, the scope and the outcome are confirmed with the client.",
    next: "Next project",
  },

  /**
   * /services — the hub the "Services" trigger in the navigation points at.
   *
   * The nine service areas themselves are not repeated here: their names and
   * one-line descriptions live in site.mega.items and are read from there, so
   * the menu and the page can never drift apart. Only the page's own framing
   * is below.
   */
  services: {
    eyebrow: "What we do",
    title: "Everything we build and run.",
    lead:
      "Websites, platforms, online stores, AI and the marketing that feeds them. Engineered in Luxembourg, funded at 70% for Luxembourg SMEs.",
    cta: {
      title: "Not sure which one you need?",
      body:
        "Tell us what you are trying to fix. We will say what it takes, what it costs and what the state covers.",
      action: "Talk to us",
    },
  },

  servicesNav: {
    eyebrow: "Services",
    title: "What do you need to move forward?",
    lead: "Websites, AI, custom software and growth. Choose the problem you need solved.",
    bestFor: "Best for",
    includes: "Includes",
    cta: (name: string) => `Explore ${name}`,
    paths: {
      websites: {
        title: "Websites and e-commerce",
        line: "Sites and online stores built to turn attention into a next step.",
        cue: "I need a new website or online shop.",
        caps: ["Websites", "E-commerce", "CMS and integrations", "SEO and performance"],
      },
      ai: {
        title: "AI and automation",
        line: "Agents, assistants and workflows built around the work that actually costs your team time.",
        cue: "The same routine eats hours every week.",
        caps: ["AI agents", "Process automation", "Assistants", "System integration"],
      },
      software: {
        title: "Custom software",
        line: "Platforms, portals and web applications designed around how your business works.",
        cue: "Off-the-shelf software no longer fits.",
        caps: ["Web applications", "Customer portals", "Internal platforms", "Custom integrations"],
      },
      marketing: {
        title: "Marketing and growth",
        line: "Paid advertising, SEO and conversion, aimed at qualified demand.",
        cue: "We need more of the right customers.",
        caps: ["Paid advertising", "SEO", "Conversion", "Analytics"],
      },
    },
  },
  servicesTrust: {
    title: "Built properly from the start.",
    points: [
      { title: "Understand first, then build", copy: "We start with your business, not with a layout." },
      { title: "Design and engineering in-house", copy: "No outsourcing, no chain with nobody accountable at the end." },
      { title: "Measurement is built in", copy: "You see what the work returns instead of having to believe it." },
      { title: "Still here after launch", copy: "Faults within the agreed scope we fix. Later work runs on maintenance or effort." },
    ],
  },
  servicesCta: {
    title: "Not sure which path fits?",
    lead: "Tell us what you are trying to achieve. We will work out with you what actually needs to be built.",
    primary: "Book a call",
    secondary: "Configure your project",
  },
  servicePages: {
    websites: {
      eyebrow: "Websites",
      title: "A site that explains your offer and keeps the next step simple.",
      lead: "Company sites, relaunches and online stores. Built to be found, understood and acted on.",
      problems: [
        "Visitors arrive and still cannot tell what you actually do.",
        "The site looks fine but produces no enquiries.",
        "Nobody can change a price or a text without calling an agency.",
      ],
    },
    ai: {
      eyebrow: "AI and automation",
      title: "Less manual routine, with solutions that fit how you work.",
      lead: "We start by looking at where the time actually goes. Not every company needs AI, and we will say so.",
      problems: [
        "The same enquiries get answered by hand every week.",
        "Documents are read, sorted and retyped by a person.",
        "Data lives in three systems and is copied between them.",
      ],
    },
    software: {
      eyebrow: "Custom software",
      title: "When standard tools no longer fit how you work.",
      lead: "Web applications, portals, interfaces and the business logic behind them.",
      problems: [
        "A spreadsheet has quietly become a business-critical system.",
        "Off-the-shelf software forces a process that does not match yours.",
        "Two systems need to talk and nobody has made them.",
      ],
    },
    marketing: {
      eyebrow: "Marketing and growth",
      title: "Demand that matches what you sell, not reach for its own sake.",
      lead: "Paid advertising, SEO and the measurement behind them. We run the campaigns that feed the systems we build.",
      problems: [
        "The website is good, but nobody arrives.",
        "Enquiries come in, but the wrong ones.",
        "Nobody can say which channel brings the customers.",
      ],
    },
    problemsLabel: "Sounds familiar?",
    workLabel: "Related work",
    cta: "Discuss a project like this",
  },

  project: {
    title: "What would your project cost?",
    lead: "Configure a build and see an indicative range. It is an orientation, not a quote, and it asks for no email address.",
  },

  contact: {
    badge: "Get in touch",
    title: "Let's talk about",
    titleAccent: "your project.",
    lead:
      "Tell us what you're building. We read every message and reply personally, usually within one business day.",
    grant: {
      badge: "70% funded",
      body:
        "Luxembourg SMEs recover 70% on websites, web-apps, AI and bundled marketing through the SME Digital & SME AI packages. Mention it and we'll structure your project to maximise the grant.",
      cta: "Estimate your net price",
    },
    details: {
      email: "Email",
      whatsapp: "WhatsApp",
      office: "Office",
      responseTime: "Response time",
      responseValue: "Within 1 business day",
    },
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Work email",
      emailPlaceholder: "you@company.com",
      company: "Company",
      companyPlaceholder: "Company name",
      phone: "Phone",
      phonePlaceholder: "+352 …",
      interest: "What can we help with?",
      message: "Message",
      messagePlaceholder: "Tell us about your project, goals and timeline…",
      submit: "Send message",
      submitting: "Sending…",
      consent: "We use the information you provide to handle your enquiry and contact you about it. We use service providers for website operation and email processing.",
      consentLink: "Learn more in our Privacy Policy.",
      errorLead: "We couldn't submit the form right now.",
      errorAction: "Send it by email instead",
    },
    interests: [
      "General enquiry",
      "New website",
      "Web app / SaaS platform",
      "AI project / automation",
      "Lead campaigns / Marketing",
      "Other",
    ],
    success: {
      title: "Message received.",
      body: (firstName: string) =>
        `Thanks${firstName ? `, ${firstName}` : ""}. We've logged your enquiry and will get back to you within one business day.`,
      cta: "Back to homepage",
    },
  },
};
