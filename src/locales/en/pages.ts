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
    previewNotice:
      "Loading the live preview embeds the client's website in this page. Your browser connects to it directly, so data — including your IP address — can be transmitted to its operator and to any services it uses.",
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
        title: "AI & Data",
        line: "Custom RAG, AI agents and data analysis, built on your own data and made for production.",
        cue: "We want AI that works on our data, not a demo.",
        caps: ["Custom RAG", "AI agents", "Data analysis", "Forecasting"],
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
      eyebrow: "AI & Data",
      title: "AI systems built on your data, made for production.",
      lead: "Custom RAG, AI agents and data analysis for organisations that want more than a chatbot. We focus on substantial projects that run in production, on your own data, for years. And we will still tell you where AI does not pay.",
      problems: [
        "Knowledge is spread across thousands of documents, and the right answer takes hours to find.",
        "Years of data, and still no reliable answer to simple business questions.",
        "Off-the-shelf AI tools cannot be trusted with our data or our processes.",
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
        "Through the SME Digital and SME AI packages the state reimburses Luxembourg SMEs 70% of eligible costs, at most €17,500 per project. Mention it and we will scope the project to fit the programme.",
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
      callback: "Call me back instead of replying by email",
      submit: "Send message",
      submitting: "Sending…",
      consent: "We use the information you provide to handle your enquiry and contact you about it. We use service providers for website operation and email processing. With your message we also receive the page you sent it from and, if you arrived through a campaign link, the campaign's name.",
      consentLink: "Learn more in our Privacy Policy.",
      errorLead: "We couldn't submit the form right now.",
      errorAction: "Send it by email instead",
    },
    // Same order in every language: Contact.tsx maps ?interest=<key> by position.
    interests: [
      "General enquiry",
      "Free intro call",
      "Workshop / consulting",
      "AI project / automation",
      "Custom software / web app",
      "SME package / funding",
      "New website",
      "Lead campaigns / Marketing",
      "Cybersecurity / NIS2 awareness",
      "Other",
    ],
    success: {
      title: "Message received.",
      body: (firstName: string) =>
        `Thanks${firstName ? `, ${firstName}` : ""}. We've logged your enquiry and will get back to you within one business day.`,
      cta: "Back to homepage",
    },
  },

  /** /workshops: the workshop as its own page and the way into most projects.
   *  Only what home.workshops, home.ai and the workshop article already claim;
   *  no price and no duration, those belong in the conversation. */
  workshopsPage: {
    formatsLabel: "Three ways in",
    methodLabel: "How the workshop runs",
    methodTitle: "From where the work stalls. To a plan with dates.",
    deliverablesLabel: "What you leave with",
    deliverablesTitle: "A document you can take to a board.",
    deliverables: ["Each bottleneck identified and individually costed", "An architecture layered over the existing systems", "A phased roadmap with what ships in each phase", "Eligible cost and the grant path mapped per phase"],
    honest: "If the conclusion is that AI does not pay for a given process, that is in the document too, and it is worth the same money as a yes.",
    faqLabel: "Questions",
    faq: [
      { q: "Who should be in the room?", a: "The people who run the processes, not only management. The person who lives inside a workflow knows which step everyone quietly works around, and that step is rarely the one on the org chart." },
      { q: "Where does it take place?", a: "On site, with your operations team. We walk each workflow with the person who lives in it and record where it stalls." },
      { q: "What if AI does not pay for a process?", a: "Then the concept says so. That conclusion is in the document, and it is worth the same money as a yes." },
      { q: "Can it be funded?", a: "It can qualify for the SME AI package: the state reimburses 70% of eligible costs on a project of €3,000 to €25,000 ex. VAT. Work started before approval is not covered, so the pre-analysis comes first." },
      { q: "What happens after the workshop?", a: "If you go ahead, the roadmap becomes the project. Every phase has its own scope, budget and outcome, and the first one ends with something running in production." },
    ],
    formLabel: "Request a workshop",
    formTitle: "Tell us where your work stalls.",
    formLead: "We reply within one business day to agree a date and who should take part.",
    processes: "Which processes cost you the most time?",
    processesPlaceholder: "For example incoming invoices, supplier emails, contract checks",
    submit: "Request a workshop",
    bookingCta: "Or pick a time directly",
    successTitle: "Request received.",
    successBody: "Thank you. We will be in touch within one business day to agree a date.",
  },

  /** /about: the team and how we work. Names and roles are facts; the
   *  principles repeat what the rest of the site already promises. */
  aboutPage: {
    eyebrow: "About us",
    title: "The people behind DEEV. And how we work.",
    teamLabel: "The team",
    teamTitle: "The people you will actually work with.",
    roles: { founder: "Co-founder", securityData: "Cybersecurity & Data" },
    principlesLabel: "How we work",
    principlesTitle: "Five things we hold to.",
    principles: [
      { title: "The people who scope it build it.", copy: "No hand-off between the conversation and the delivery: the people who scope your project are the people who build it." },
      { title: "Design and engineering in-house.", copy: "Both sit in the same team in Luxembourg, so the system you are shown is the system that gets built." },
      { title: "Your data stays where it must.", copy: "Hosting in the EU, or on your own infrastructure where the data must not leave. Access rights carried through to every answer." },
      { title: "Arithmetic before technology.", copy: "Each bottleneck is costed from your own volumes before anything is proposed. If AI does not pay for a process, we say so." },
      { title: "Accountable after launch.", copy: "Monitoring, maintenance and a team that stays accountable once the system is live." },
    ],
    factsLabel: "The company",
    phone: "Phone",
    email: "Email",
  },
};
