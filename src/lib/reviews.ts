/**
 * Our Google rating, shown under the hero buttons.
 *
 * `null` until the owner supplies the real figures from the Google Business
 * Profile: the average rating, the number of reviews and the link to the
 * profile. While it is null nothing is shown. Never fill it with estimates:
 * a rating is a factual claim anyone can check against Google.
 *
 * Static, not fetched: a live call would need a Places API key and would
 * send every visitor's request to Google. Update the two numbers when the
 * rating changes, and `asOf` with them.
 */
export interface GoogleReviews {
  /** Average rating as Google shows it, e.g. 4.9. */
  rating: number;
  /** Number of reviews as Google shows it. */
  count: number;
  /** The public Google Business Profile or Maps link. */
  url: string;
  /** When the figures were copied from Google (YYYY-MM-DD). */
  asOf: string;
}

export const GOOGLE_REVIEWS: GoogleReviews | null = null;
