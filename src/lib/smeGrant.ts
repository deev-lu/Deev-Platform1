/**
 * The Luxembourg SME Packages rules, in one place.
 *
 * The rate and the bounds were written into ProjectBuilder.tsx and repeated in
 * prose across the homepage, the contact page, two articles and the navigation
 * panel. Programme terms change; a rate that lives in six places changes in
 * five of them and quietly contradicts itself in the sixth.
 *
 * Sources: guichet.public.lu (SME Packages) and Luxinnovation. These figures
 * were correct when written and are not ours to guarantee — the page that uses
 * them says so, and every quote we send is checked against the current terms.
 */

/** 70% of eligible cost. Always 70%, never "up to 70%". */
export const GRANT_RATE = 0.7;

/** A project below this is not eligible at all. */
export const GRANT_MIN = 3_000;

/** Eligible cost is capped here, so the aid is capped with it. */
export const GRANT_MAX = 25_000;

/** The most one package can return: 70% of 25,000. */
export const GRANT_CAP = Math.round(GRANT_MAX * GRANT_RATE); // 17,500

/**
 * Marketing is not separately funded, but it can ride inside a Digital package
 * alongside a website or web-app project, at the same rate.
 */
export const MARKETING_SHARE = 0.15;

/** What one project of a given size returns, and what is left to pay. */
export function grantFor(amount: number): { eligible: boolean; grant: number; net: number } {
  if (amount < GRANT_MIN) return { eligible: false, grant: 0, net: amount };
  const grant = Math.round(Math.min(amount, GRANT_MAX) * GRANT_RATE);
  return { eligible: true, grant, net: Math.max(0, amount - grant) };
}
