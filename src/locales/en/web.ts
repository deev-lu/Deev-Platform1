/**
 * Website projects (since 25 Nov 2026): the homepage, the main button and
 * the website request form. Website projects are DEEV's main business, and a
 * visitor has to see that in the first five seconds.
 *
 * Every claim here repeats something the site already says or a case study
 * documents: the three project lines come from projects.data.json, the
 * process repeats what the services pages promise (free first call, design
 * and build in house, measurement built in, errors within the agreed scope
 * fixed after launch). The owner confirms the process wording before launch.
 */
export const web = {
  hero: {
    eyebrow: "Web design from Luxembourg",
    title: "A website that turns visitors [[into customers.]]",
    lead:
      "We design multilingual company websites and online shops, so your customers quickly find what they are looking for and can enquire, book or buy right away.",
    primary: "Request a website project",
    secondary: "See our projects",
    previewLabel: "Client project",
    previewCta: "Read the case study",
  },

  projects: {
    eyebrow: "Projects",
    title: "Three websites we built. Live and in use.",
    lead: "Every one is online, and every case study shows what we actually delivered.",
    /** One sentence per project: what it does for the client. Keyed by slug. */
    items: {
      "bureau-immobilier-feltes":
        "Listings are maintained in Apimo. New and updated properties appear on the multilingual website automatically.",
      "fachinstitut-tierheilkunde":
        "Prospective students find the course, start date and location on one page, and can register right there.",
      "vino-amore": "Brand identity and online shop from one team. This is the shop itself.",
    } as Record<string, string>,
    caseCta: "Read the case study",
    all: "See all projects",
  },

  process: {
    eyebrow: "How it works",
    title: "From the first call to launch. At every step you know what you get.",
    steps: [
      {
        title: "Free first call",
        copy: "You talk to Sven or Fabio about your business and your goals, and receive an offer with scope, price and timeline.",
      },
      {
        title: "Concept and design",
        copy: "You see the design of your key pages before anything is built, and your feedback goes into it.",
      },
      {
        title: "Build and review",
        copy: "We build the site in your languages and for phones; you check it on a test address and approve it before it goes live.",
      },
      {
        title: "Launch and after",
        copy: "Your website goes live with measurement in place, and we remain your contact afterwards, fixing any errors within the agreed scope.",
      },
    ],
  },

  budget: {
    eyebrow: "Budget",
    title: "A price range in about a minute.",
    lead:
      "Choose what your website needs and see an indicative range straight away, without an email address. The regular project price comes first; a possible grant is shown separately.",
    cta: "What will my website cost?",
  },

  contact: {
    eyebrow: "Contact",
    title: "Talk to Sven and Fabio directly.",
    lead:
      "No sales layer: the two founders read your enquiry themselves, and whoever plans your website also builds it.",
    call: "Rather call?",
    formTitle: "Your website project",
  },

  more: {
    eyebrow: "More services",
    title: "Not only websites.",
    lead: "Besides websites and online shops, we build custom software and AI solutions, run workshops, take care of marketing and train your team in cybersecurity.",
    items: {
      software: { title: "Custom software", line: "Web apps, portals and internal systems" },
      ai: { title: "AI solutions", line: "Agents and assistants that work on your data" },
      workshops: { title: "Workshops and consulting", line: "Where software and AI really pay off" },
      marketing: { title: "Marketing", line: "Ads, SEO and the measurement behind them" },
      security: { title: "Cybersecurity and NIS2", line: "Awareness training for teams and management" },
    },
  },

  /** The website request form: /contact?interest=website and the homepage. */
  form: {
    pageTitle: "Tell us about your",
    pageAccent: "new website.",
    pageLead: "Tell us in a few words what your new website should do. That is enough for a first answer.",
    need: "What should your new website do?",
    needPlaceholder: "We want to renew our current website and get more appointment requests.",
    callback: "Please call me back",
    phone: "Phone number",
    more: "Add company and current website (optional)",
    company: "Company",
    currentSite: "Current website",
    submit: "Request website project",
    reply: "We reply personally, usually within one working day.",
    reference: "Your enquiry refers to",
    configuration: "Your configuration is attached",
    similar: "Request a similar website project",
  },
};
