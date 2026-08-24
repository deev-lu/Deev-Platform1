import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LOCALES, LOCALE_NAMES, LOCALE_SHORT, localeFromPath, stripLocale, withLocale, type Locale } from "../../lib/i18n";
import { useT } from "../../lib/useT";

/**
 * Language, in the site's own idiom: a mono two-letter label, a hairline
 * border, hard corners. Not a flag. Flags are countries, and there is no flag
 * that means "French" to a Belgian, a Swiss and a Luxembourger at once.
 *
 * Every option is a real anchor to a real URL, so the list is crawlable and
 * "open in a new tab" does what it says. The click is intercepted only to
 * route without a reload.
 */
export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const current = localeFromPath(pathname);
  const path = stripLocale(pathname);

  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (e: React.MouseEvent, locale: Locale) => {
    // Let a modified click open the real href in a new tab.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(false);
    navigate(withLocale(path, locale) + hash);
  };

  // On a phone the menu is already a list, so the languages are a plain row
  // in it rather than a dropdown inside a dropdown.
  if (compact) {
    return (
      <div className="flex items-center gap-2" role="group" aria-label={t.site.nav.language}>
        {LOCALES.map((l) => (
          <a
            key={l}
            href={withLocale(path, l)}
            onClick={(e) => go(e, l)}
            aria-current={l === current ? "true" : undefined}
            lang={l}
            className={`eyebrow-mono uppercase px-3 h-9 inline-flex items-center border transition-colors duration-[var(--dur-1)] ${
              l === current
                ? "border-[var(--line-strong)] text-[var(--text-hi)]"
                : "border-[var(--line)] text-[var(--text-low)] hover:text-[var(--text-hi)]"
            }`}
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em", borderRadius: "var(--radius-1)" }}
          >
            {LOCALE_SHORT[l]}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={wrap}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t.site.nav.language}
        title={t.site.nav.language}
        className="eyebrow-mono uppercase w-9 h-9 flex items-center justify-center border border-[var(--line)] text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
        style={{ fontSize: "var(--t-label)", letterSpacing: "0.1em", borderRadius: "var(--radius-1)" }}
      >
        {LOCALE_SHORT[current]}
      </button>

      {open && (
        <ul
          className="absolute right-0 top-full mt-2 min-w-[9.5rem] border border-[var(--line-strong)] bg-[var(--surface-1)] py-1 z-50"
          style={{ borderRadius: "var(--radius-1)" }}
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <a
                href={withLocale(path, l)}
                onClick={(e) => go(e, l)}
                lang={l}
                aria-current={l === current ? "true" : undefined}
                className={`flex items-center justify-between gap-4 px-4 py-2.5 transition-colors duration-[var(--dur-1)] ${
                  l === current
                    ? "text-[var(--text-hi)]"
                    : "text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:bg-[var(--surface-2)]"
                }`}
                style={{ fontSize: "var(--t-small)" }}
              >
                {LOCALE_NAMES[l]}
                <span
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {LOCALE_SHORT[l]}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
