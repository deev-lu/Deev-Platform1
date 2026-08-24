import { useCallback } from "react";
import { useLocation } from "react-router";
import { DICTS, type Dict } from "../locales";
import { localeFromPath, withLocale, type Locale } from "./i18n";

/**
 * The locale comes from the URL, so these are derived state rather than stored
 * state: nothing to keep in sync, nothing to hydrate wrong, and a shared link
 * always opens in the language it was shared in.
 */
export function useLocale(): Locale {
  return localeFromPath(useLocation().pathname);
}

export function useT(): Dict {
  return DICTS[useLocale()];
}

/** ("/contact") -> "/fr/contact" while the visitor is reading French. */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return useCallback((path: string) => withLocale(path, locale), [locale]);
}
