import { en } from "./en";
import { fr } from "./fr";
import { de } from "./de";
import type { Locale } from "../lib/i18n";

export type { Dict } from "./en";

/** Every locale resolves to a complete dictionary, so no key can be missing. */
export const DICTS = { en, fr, de } as const satisfies Record<Locale, unknown>;
