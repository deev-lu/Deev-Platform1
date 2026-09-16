import { forwardRef } from "react";
import { Link, useLocation, type LinkProps } from "react-router";
import { useLocalePath } from "../../lib/useT";

/**
 * A Link that stays in the language the visitor is reading.
 *
 * Write the English path — to="/contact" — and this resolves it to
 * /fr/contact or /de/contact as needed. Without it every internal link would
 * drop a French reader back onto the English site, which is the single most
 * common way a translated site leaks.
 *
 * External and hash-only targets pass through untouched.
 *
 * Zeigt ein Link auf die Seite, auf der er steht, bekommt er
 * `aria-current="page"`. Das ist Auditpunkt D-12, und es ist auch die
 * ehrliche Antwort auf etwas, das von aussen wie ein kaputter Link aussieht:
 * in Navigation und Fussbereich steht die aktuelle Seite mit in der Liste,
 * ein Klick darauf kann nichts bewirken. Ohne Kennzeichnung ist das für
 * niemanden erkennbar - für Screenreader gar nicht. Mit Kennzeichnung ist es
 * ein Zustand statt eines toten Klicks, und Stile können daran andocken.
 *
 * Nur ohne Fragment: `/services#marketing` auf `/services` scrollt, das ist
 * eine Wirkung und keine Sackgasse.
 */
const L = forwardRef<HTMLAnchorElement, LinkProps>(function L({ to, ...rest }, ref) {
  const localize = useLocalePath();
  const { pathname } = useLocation();
  const target = typeof to === "string" && to.startsWith("/") ? localize(to) : to;

  const isCurrent =
    typeof target === "string" &&
    !target.includes("#") &&
    trim(target) === trim(pathname) &&
    rest["aria-current"] === undefined;

  return <Link ref={ref} to={target} {...(isCurrent ? { "aria-current": "page" as const } : {})} {...rest} />;
});

/** "/de/work/" und "/de/work" sind dieselbe Seite. */
function trim(p: string): string {
  return p.split("?")[0].replace(/\/+$/, "") || "/";
}

export default L;
