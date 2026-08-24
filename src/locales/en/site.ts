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
    services: "Services",
    work: "Work",
    pricing: "Pricing",
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

  notFound: {
    eyebrow: "404 / Page not found",
    title: "That page does not exist.",
    body:
      "The link is either out of date or mistyped. Everything we have published is one click from the homepage.",
    cta: "Back to the homepage",
    workLabel: "Selected work",
  },
};
