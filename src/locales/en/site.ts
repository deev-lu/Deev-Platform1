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
    workshops: "Workshops",
    funding: "SME funding",
    contact: "Contact",
    cta: "Free intro call",
    call: "Call us",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
    language: "Language",
    languageOf: (name: string) => `Switch to ${name}`,
  },

  /** Accessibility labels (WCAG 2.1 AA): skip link, pause controls. */
  a11y: {
    skip: "Skip to content",
    pauseLogos: "Pause the client logos",
    playLogos: "Play the client logos",
    pauseVideo: "Pause the background video",
    playVideo: "Play the background video",
    pauseFilm: "Pause the animation",
    playFilm: "Play the animation",
    newTab: "(opens in a new tab)",
    pauseMotion: "Pause motion",
    playMotion: "Play motion",
    motionLabel: "Animations",
  },

  footer: {
    blurb:
      "Software and AI engineering from Luxembourg. We build the systems your business runs on, and stay accountable after launch.",
    certified: "Certified label",
    certifiedNote: "Proudly designed & engineered in Luxembourg.",
    services: "Services",
    company: "Company",
    legal: "Legal",
    links: {
      grant: "SME Packages",
      webApps: "Custom software",
      aiAgents: "AI and data",
      ecommerce: "Websites, by invitation",
      marketingSites: "Marketing",
      portfolio: "Portfolio",
      terms: "Legal Information",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      cookieSettings: "Cookie settings",
      accessibility: "Accessibility",
    },
    rights: (year: number) => `© ${year} Deev / Lux VR States Sàrl-s. All rights reserved.`,
    madeIn: "Engineered with precision in Luxembourg",
  },

  /** The certification mark's accessible name. */
  madeInLabel: "Made in Luxembourg, certified label",

  /** The floating WhatsApp button. */
  whatsapp: {
    label: "Chat on WhatsApp",
    tooltip: "Questions? Message us",
    /** Prefilled first line. The sender can delete it before sending. */
    message: "Hello Deev, I have a question about",
    dismiss: "Hide",
  },

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
      "why-deev": { label: "Why Deev", desc: "How we work and what we stand behind" },
      "about": { label: "Who you'll work with", desc: "Two founders, both of them on your project" },
    },
    feature: {
      badge: "Government-backed funding",
      title: "70% funded by the state",
      body: "Luxembourg SMEs claim 70% of an eligible digital or AI project. See what yours would actually cost.",
      cta: "See your net price",
    },
    work: { browse: "Browse", all: "All work", recent: "Projects we're happy about" },
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
