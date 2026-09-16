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

/**
 * Wie eine Preisspanne zur Förderung steht.
 *
 * Ein Preis allein sagt nichts darüber, ob ein Unternehmen förderfähig ist.
 * Diese Funktion beantwortet nur die engere Frage: liegt der genannte Betrag
 * überhaupt im Programmrahmen?
 *
 * Der Grund für den eigenen Typ statt einer Zahl: Der Rechner arbeitet mit
 * Spannen, und eine Spanne kann eine Programmgrenze schneiden. 2.200–3.800 €
 * hat einen nicht förderfähigen unteren Endpunkt. Vorher wurde daraus eine
 * durchgehende Nettospanne „660–1.140 €" gebildet, also ein Zuschuss auf einen
 * Betrag, der die Mindestgrenze gar nicht erreicht. Solche Fälle bekommen jetzt
 * `status: "partial"` und keine Nettospanne, sondern einen Hinweis.
 */
export type GrantStatus =
  /** Die ganze Spanne liegt unter 3.000 €: kein Package möglich. */
  | "below"
  /** Die Spanne schneidet 3.000 €: nur der obere Teil käme in Frage. */
  | "partial"
  /** Die ganze Spanne liegt im Rahmen. */
  | "eligible";

export interface RangeGrant {
  status: GrantStatus;
  /** Zuschuss für die Spannenenden. Nur bei `eligible` gesetzt. */
  grantMin: number;
  grantMax: number;
  /** Eigenanteil nach Erstattung. Nur bei `eligible` gesetzt. */
  netMin: number;
  netMax: number;
  /** Der obere Endpunkt übersteigt 25.000 €, der Zuschuss ist gedeckelt. */
  capped: boolean;
  /** Ab diesem Betrag wäre das Projekt im Rahmen. Nur bei `partial`. */
  threshold: number;
}

export function grantForRange(min: number, max: number): RangeGrant {
  const empty = { grantMin: 0, grantMax: 0, netMin: min, netMax: max, threshold: GRANT_MIN };

  // Selbst das obere Ende erreicht die Mindestgrenze nicht.
  if (max < GRANT_MIN) return { ...empty, status: "below", capped: false };

  // Die Spanne schneidet die Mindestgrenze. Keine Nettospanne bilden: sie
  // würde für den unteren Endpunkt eine Förderung behaupten, die es nicht gibt.
  if (min < GRANT_MIN) return { ...empty, status: "partial", capped: max > GRANT_MAX };

  const a = grantFor(min);
  const b = grantFor(max);
  return {
    status: "eligible",
    grantMin: a.grant,
    grantMax: b.grant,
    netMin: a.net,
    netMax: b.net,
    capped: max > GRANT_MAX,
    threshold: GRANT_MIN,
  };
}
