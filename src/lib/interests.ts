/**
 * The interest options of the contact forms, in the order of
 * `pages.contact.interests` (the same in every language). A button elsewhere
 * links to `/contact?interest=<key>` and the form opens on the matching
 * option. Shared by Contact.tsx and WebsiteRequestForm.tsx.
 */
export const INTEREST_KEYS = ["general", "call", "workshop", "ai", "software", "funding", "website", "marketing", "security", "other"] as const;
export type InterestKey = (typeof INTEREST_KEYS)[number];
