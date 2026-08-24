import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router";
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
 */
const L = forwardRef<HTMLAnchorElement, LinkProps>(function L({ to, ...rest }, ref) {
  const localize = useLocalePath();
  const target = typeof to === "string" && to.startsWith("/") ? localize(to) : to;
  return <Link ref={ref} to={target} {...rest} />;
});

export default L;
