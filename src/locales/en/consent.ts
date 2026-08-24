/** The consent dialog. Legally load-bearing, so it is translated in full. */
export const consent = {
  banner: {
    eyebrow: "Cookies",
    title: "Your choice, on the record.",
    body: "We set what the site needs to work. With your consent we also measure how it is used, so we can improve it. You can change or withdraw this at any time.",
    policyLink: "Cookie & privacy policy",
    reject: "Reject non-essential",
    accept: "Accept all",
    customise: "Customise",
  },
  prefs: {
    eyebrow: "Cookie preferences",
    title: "What you allow, category by category.",
    close: "Close cookie preferences",
    necessary: {
      title: "Strictly necessary",
      copy: "Needed for the site to work and to remember this very choice. These cannot be switched off, and they are never used to profile you.",
    },
    analytics: {
      title: "Analytics",
      copy: "Google Analytics 4, used to count visits and see which pages are read. Until you allow it, the tag runs in a consent-denied state: no cookies, no identifier, only an aggregate signal.",
    },
    always: "Always on",
    table: { name: "Cookie", provider: "Provider", purpose: "Purpose", life: "Retention" },
    recordLabel: "Your consent record",
    given: "Given",
    reference: "Reference",
    expires: "Expires",
    none: "Nothing recorded yet. Analytics stays denied until you choose.",
    version: (v: number) =>
      `Policy version ${v}. We ask again after twelve months, or sooner if the policy changes. Full detail in the`,
    policyLink: "cookie & privacy policy",
    save: "Save my choices",
    withdraw: "Withdraw",
  },
  cookies: {
    consent: "Stores your cookie choices and the record of them (id and date).",
    theme: "Remembers whether you chose the light or the dark appearance.",
    ga: "Distinguishes one visitor from another so visits can be counted.",
    gaProperty: "Keeps the state of the current visit for this property.",
    months12: "12 months",
    untilCleared: "Until cleared",
    years2: "2 years",
  },
};
