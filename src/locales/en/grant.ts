/** /sme-packages — the funding page. */
export const grant = {
  eyebrow: "Luxembourg SME Packages",
  title: "The state pays [[70%]]. You pay the rest.",
  lead:
    "Luxembourg SMEs recover 70% of an eligible digital or AI project through the SME Packages. On the largest eligible project that is EUR 17,500 back. Here is exactly how it works, what it covers, and what it would leave you to pay.",
  ctaPrimary: "Price your project",
  ctaSecondary: "Talk to us first",

  stats: {
    rate: { value: "70%", label: "of eligible cost", note: "Not up to 70%. The rate is fixed." },
    range: { value: "3k–25k", label: "eligible project, EUR, ex. VAT", note: "Below 3,000 there is no aid." },
    cap: { value: "17,500", label: "maximum back, EUR", note: "70% of the 25,000 ceiling." },
  },

  /** The eligibility checklist. */
  check: {
    eyebrow: "Before anything else",
    title: "Is your company eligible?",
    lead: "Four conditions decide it. Tick the ones that are true.",
    items: {
      sme: "We are an SME: under 250 staff, and turnover under EUR 50m or balance sheet under EUR 43m.",
      seat: "The company's registered office is in Luxembourg.",
      auth: "We hold a valid establishment authorisation (autorisation d'établissement).",
      size: "The project we have in mind is worth at least EUR 3,000 excluding VAT.",
    },
    all: "All four fit. On this basis your project looks eligible, and the pre-analysis appointment is the next step.",
    some: (n: number) =>
      `${n} of 4. Anything unticked would need to change before an application. Tell us which and we will say whether it is workable.`,
    none: "Nothing ticked yet.",
    caveat:
      "This is an indication, not a decision. Eligibility is confirmed at the pre-analysis appointment, and the Ministry of the Economy decides the application.",
  },

  /** The slider. */
  calc: {
    eyebrow: "The arithmetic",
    title: "What you would get back.",
    lead: "Drag the project value. The figures are the programme's own rules applied to it, nothing more.",
    project: "Project value, ex. VAT",
    grant: "The state pays back",
    net: "Your net cost",
    capped: "Above 25,000 the eligible cost is capped, so the aid stops at 17,500.",
    below: "Below 3,000 a project does not qualify for a package.",
    cta: "Configure a real project",
  },

  /** What can go in a package. */
  scope: {
    eyebrow: "What it covers",
    title: "What we can build inside a package.",
    lead: "The Digital and AI strands between them cover most of what a company needs online. These are the pieces we deliver.",
    items: {
      website: { title: "Websites", body: "A marketing site built to be found and to convert, not a brochure." },
      store: { title: "Online stores", body: "Payments, catalogue, stock and the order flow behind them." },
      app: { title: "Web apps and platforms", body: "Dashboards, portals, booking and billing, internal tools." },
      ai: { title: "AI and automation", body: "Assistants, retrieval over your own documents, repetitive back-office work." },
      marketing: {
        title: "Marketing, bundled",
        body: "Not separately funded, but up to 15% marketing and 15% ad spend can ride inside a Digital package alongside a website or web-app project, at the same 70% rate.",
      },
      brand: { title: "Brand and identity", body: "When a project needs the look as well as the build." },
    },
  },

  /** The process. */
  steps: {
    eyebrow: "How it runs",
    title: "Six steps, in this order.",
    lead: "The order matters: work started before approval is not covered.",
    items: [
      { title: "Pre-analysis", body: "You book an appointment with the House of Entrepreneurship, or with eHandwierk at the Chamber of Skilled Trades and Crafts if you are a craft business. They check eligibility and help with the form." },
      { title: "Scope and quote", body: "We write the scope and a quote that fits the package. This is where we do the work: a scope that matches the programme's categories is the difference between an approval and a rewrite." },
      { title: "Application", body: "The file goes to the Ministry of the Economy, with the quote attached." },
      { title: "Approval", body: "You wait for the decision before anything begins." },
      { title: "We build", body: "The project runs. You get the site, the platform or the system." },
      { title: "Reimbursement", body: "You pay us in full, then claim. The aid arrives after the project is delivered, not before." },
    ],
    cashflow: {
      title: "One thing worth planning for",
      body: "This is a reimbursement, not a discount at the till. You pay the invoice in full and the state pays you back after delivery, so the cash has to be available in between. We would rather you knew that now than at the invoice.",
    },
  },

  /** FAQ. Also emitted as structured data. */
  faq: {
    eyebrow: "Questions",
    title: "The ones we actually get asked.",
    items: [
      {
        q: "Is it really 70%, or up to 70%?",
        a: "It is 70% of the eligible cost. The figure people mean when they say up to is the cap: eligible cost stops at EUR 25,000, so the aid stops at EUR 17,500. The rate itself does not slide.",
      },
      {
        q: "When do I get the money?",
        a: "After the project is delivered. You pay the provider in full and claim reimbursement afterwards. Budget for the full amount up front and treat the aid as money coming back.",
      },
      {
        q: "Can I start before the application is approved?",
        a: "No. Work started before approval is not covered. The pre-analysis appointment comes first, then the application, then the decision, then the build.",
      },
      {
        q: "What if my project is bigger than 25,000?",
        a: "You can still build it. Eligible cost is capped at EUR 25,000, so the aid is capped at EUR 17,500 and you carry the rest. We will tell you plainly which parts sit inside the package and which do not.",
      },
      {
        q: "Does marketing qualify?",
        a: "Not on its own. Up to 15% marketing and 15% ad spend can be bundled into a Digital package alongside a website or web-app project, funded at the same rate.",
      },
      {
        q: "Do you handle the paperwork?",
        a: "We write the scope and the quote so they fit the programme, and we walk you through the form. The pre-analysis appointment is yours to book and the decision is the Ministry's. Nobody can promise you an approval, and you should be wary of anyone who does.",
      },
      {
        q: "How long does it take?",
        a: "The programme does not publish a fixed timeline, and deadlines and document lists are confirmed at the pre-analysis rather than published in advance. Ask at that appointment and plan the build around the answer.",
      },
    ],
  },

  /** Honest footnote. */
  source: {
    body: "Figures on this page come from guichet.public.lu and Luxinnovation and were correct when written. Programme terms change, so check the current conditions before you rely on them, and confirm everything at your pre-analysis.",
    link: "SME Packages on guichet.public.lu",
  },

  cta: {
    title: "Want to know what yours would cost?",
    body: "Tell us what you are trying to build. We will say what it takes, what it costs, what fits inside a package and what your net price would be.",
    action: "Start a conversation",
    secondary: "Or price it yourself",
  },
};
