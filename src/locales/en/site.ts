/**
 * Site chrome: navigation, footer, the 404 page and the consent dialog.
 * English is the source. fr.ts and de.ts are typed against this shape, so a
 * missing key is a build error rather than a blank space on a live page.
 *
 * Deliberately not `as const`: that would make every English sentence its own
 * literal type, and no translation could ever satisfy it. The shape is what
 * the other locales have to match, not the words.
 */
export const site = {
  nav: {
    home: "DEEV, back to the homepage",
    services: "Services",
    work: "Work",
    pricing: "Pricing",
    journal: "Blog",
    whyDeev: "Why Deev",
    about: "About",
    contact: "Contact",
    cta: "Get a quote",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
    language: "Language",
    languageOf: (name: string) => `Switch to ${name}`,
  },

  footer: {
    blurb:
      "An independent, founder-led studio in Luxembourg. We build digital systems that make your business impossible to ignore.",
    certified: "Certified label",
    certifiedNote: "Proudly designed & engineered in Luxembourg.",
    services: "Services",
    company: "Company",
    legal: "Legal",
    links: {
      webApps: "Web Applications",
      aiAgents: "AI Agents",
      ecommerce: "E-Commerce Systems",
      marketingSites: "Marketing Websites",
      portfolio: "Portfolio",
      terms: "Terms & Legal",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      cookieSettings: "Cookie settings",
    },
    rights: (year: number) => `© ${year} Deev / Lux VR States Sàrl-s. All rights reserved.`,
    madeIn: "Engineered with precision in Luxembourg",
  },

  /** The certification mark's accessible name. */
  madeInLabel: "Made in Luxembourg, certified label",

  /** The mega panels. Structure lives in MegaMenu.tsx; every word is here. */
  mega: {
    toggle: (label: string) => `Open the ${label} menu`,
    close: "Close menu",
    columns: { build: "Build", grow: "Grow", studio: "Studio" },
    items: {
      "what-we-build": { label: "What we build", desc: "Websites, platforms, online stores and AI products" },
      "how-it-runs": { label: "How it runs", desc: "Interface, intelligence and EU-hosted infrastructure" },
      "pricing": { label: "Pricing", desc: "Configure a project and see the price update live" },
      "marketing": { label: "Marketing", desc: "Ads, SEO and the measurement that proves them" },
      "ai": { label: "AI workshops", desc: "Where AI pays, costed from your own volumes" },
      "billovio": { label: "Billovio", desc: "Our own product: a quote written from one sentence" },
      "why-it-works": { label: "Why it works", desc: "Predictable enquiries and outcomes you can measure" },
      "why-deev": { label: "Why Deev", desc: "GDPR, security and delivery you can hold us to" },
      "about": { label: "Who you'll work with", desc: "Two founders, both of them on your project" },
    },
    feature: {
      badge: "Government-backed funding",
      title: "70% funded by the state",
      body: "Luxembourg SMEs claim 70% of an eligible digital or AI project. See what yours would actually cost.",
      cta: "See your net price",
    },
    work: { browse: "Browse", all: "All work", recent: "Recent projects" },
    journal: { browse: "Topics", all: "Read the blog", latest: "Latest articles" },
  },

  deck: {
    prev: (label: string) => `${label}: previous`,
    next: (label: string) => `${label}: next`,
  },

  notFound: {
    eyebrow: "404 / Page not found",
    title: "That page does not exist.",
    body:
      "The link is either out of date or mistyped. Everything we have published is one click from the homepage.",
    cta: "Back to the homepage",
    workLabel: "Selected work",
  },
};
