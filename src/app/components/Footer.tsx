import { Linkedin } from "lucide-react";
import logo from "../../assets/logo.png";
import MadeInLuxembourg from "./MadeInLuxembourg";
import L from "./L";
import MotionToggle from "./MotionToggle";
import { openCookieSettings } from "../../lib/consent";
import { useT, useLocalePath } from "../../lib/useT";
import WhatsAppIcon from "./WhatsAppIcon";
import { whatsappHref } from "../../lib/whatsapp";

// Each of these used to be href="#": four links that went nowhere, on every
// page of the site. They point at the section that actually describes them,
// and the three legal links land on the section each name promises rather
// than all three on the same page top.
//
// Structure here, wording in the dictionary: an anchor is the same in every
// language, its label is not.
// Diese fünf zeigten auf Startseitenanker, die es nach dem Entschlacken der
// Startseite nicht mehr gibt: #ai, #marketing und #why-deev sind auf die
// Leistungsseiten gewandert. Ein Anker ins Leere scrollt nirgendwohin und
// sieht für den Besucher aus wie ein kaputter Link - er ist es auch.
const NAV = {
  services: [
    { key: "webApps", href: "/services/custom-software" },
    { key: "aiAgents", href: "/services/ai-automation" },
    { key: "workshops", href: "/workshops" },
    { key: "ecommerce", href: "/services/websites" },
    { key: "marketingSites", href: "/services/marketing" },
  ],
  company: [
    { key: "services", href: "/services" },
    { key: "grant", href: "/sme-packages" },
    { key: "portfolio", href: "/work" },
    { key: "about", href: "/about" },
    { key: "journal", href: "/blog" },
    { key: "pricing", href: "/project" },
    { key: "contact", href: "/contact" },
  ],
  legal: [
    { key: "terms", href: "/legal" },
    { key: "privacy", href: "/legal#data-protection" },
    { key: "cookies", href: "/legal#cookies" },
  ],
} as const;

// Custom SVG icon components for platforms not in lucide
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.03-.07z" />
    </svg>
  );
}


function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const socials = [
  { name: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@deev.lu" },
  { name: "WhatsApp", icon: WhatsAppIcon, href: whatsappHref() },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/deev-lu/" },
  { name: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/deev.lu/" },
];

export default function Footer() {
  const t = useT();
  const localePath = useLocalePath();
  const linkClass =
    "text-[var(--text)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]";
  const colLabel = "eyebrow-mono uppercase text-[var(--text-low)] mb-5 font-normal";
  const colLabelStyle = { fontSize: "var(--t-label)", letterSpacing: "0.16em" } as const;
  const col = "py-8 md:py-10 md:px-8 border-t md:border-t-0 md:border-l border-[var(--line)] min-w-0";

  /** "/#services" has to become "/fr/#services", not "/#fr/services". */
  const href = (h: string) => {
    const [path, hash] = h.split("#");
    return localePath(path || "/") + (hash ? `#${hash}` : "");
  };

  const label = (k: string) =>
    (t.site.footer.links as Record<string, string>)[k] ??
    (t.site.nav as unknown as Record<string, string>)[k];

  // Brand Book: tief, Haarlinienraster, Mono-Beschriftungen, die Wortmarke
  // gross und kaum sichtbar als Grafik.
  return (
    <footer className="relative overflow-hidden bg-[var(--surface-0)] border-t border-[var(--line)]" style={{ fontSize: "var(--t-small)" }}>
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingTop: "clamp(56px, 7vw, 96px)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] border-t border-[var(--line)]">
          {/* Brand */}
          <div className="py-8 md:py-10 md:pr-8 min-w-0">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="DEEV" width={256} height={256} className="h-8 w-auto object-contain" />
              <span className="text-lg font-brand tracking-[0.04em] text-[var(--text-hi)]">DEEV</span>
            </div>
            <p className="text-[var(--text-mid)] mt-5 max-w-sm" style={{ lineHeight: 1.6 }}>
              {t.site.footer.blurb}
            </p>
            <div className="flex gap-2 mt-7">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
                    aria-label={social.name}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </a>
                );
              })}
            </div>

            {/* Made in Luxembourg, certified label */}
            <div className="mt-8 flex items-center gap-3">
              <MadeInLuxembourg className="h-14 w-[70px] text-[var(--text-hi)] shrink-0" />
              <div className="text-xs leading-relaxed text-[var(--text-mid)]">
                <div className="text-[var(--text)]">{t.site.footer.certified}</div>
                {t.site.footer.certifiedNote}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className={col}>
            <h2 className={colLabel} style={colLabelStyle}>{t.site.footer.services}</h2>
            <ul className="space-y-3">
              {NAV.services.map((item) => (
                <li key={item.key}>
                  <a href={href(item.href)} className={linkClass}>
                    {label(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className={col}>
            <h2 className={colLabel} style={colLabelStyle}>{t.site.footer.company}</h2>
            <ul className="space-y-3">
              {NAV.company.map((item) => {
                const isRoute = !item.href.includes("#");
                return (
                  <li key={item.key}>
                    {isRoute ? (
                      <L to={item.href} className={linkClass}>
                        {label(item.key)}
                      </L>
                    ) : (
                      <a href={href(item.href)} className={linkClass}>
                        {label(item.key)}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal */}
          <div className={col}>
            <h2 className={colLabel} style={colLabelStyle}>{t.site.footer.legal}</h2>
            <ul className="space-y-3">
              {NAV.legal.map((item) => (
                <li key={item.key}>
                  <L to={item.href} className={linkClass}>
                    {label(item.key)}
                  </L>
                </li>
              ))}
              {/* Withdrawal has to be as easy as consent (GDPR Art. 7(3)), so
                  the dialog is reachable from every page of the site. */}
              <li>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className={`${linkClass} cursor-pointer text-left`}
                  style={{ font: "inherit" }}
                >
                  {t.site.footer.links.cookieSettings}
                </button>
              </li>
              {/* Pause motion (WCAG 2.2.2), from every page. */}
              <li>
                <MotionToggle variant="text" className={linkClass} />
              </li>
              <li>
                <L to="/accessibility" className={linkClass}>
                  {t.site.footer.links.accessibility}
                </L>
              </li>
            </ul>
          </div>
        </div>

        {/* Die Wortmarke als Grafik: gross, kaum Kontrast, unten angeschnitten. */}
        <div aria-hidden="true" className="select-none pointer-events-none mt-8 overflow-hidden" style={{ height: "clamp(69px, 24.5vw, 360px)" }}>
          {/* Als CSS-Inhalt, nicht als Text: eine Wortmarke ist von der
              Kontrastregel ausgenommen (WCAG 1.4.3, "Logotypes"), aber Pruef-
              werkzeuge melden sie sonst trotzdem. Fuer Screenreader ohnehin
              verborgen. */}
          <span
            className="block font-brand text-[var(--text-hi)] whitespace-nowrap before:content-['DEEV']"
            style={{ fontSize: "clamp(96px, 34vw, 500px)", lineHeight: 0.82, letterSpacing: "-0.04em", opacity: 0.05, marginLeft: "-0.04em" }}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between gap-3 py-7 border-t border-[var(--line)] text-[var(--text-low)]">
          <span>{t.site.footer.rights(new Date().getFullYear())}</span>
          <span>{t.site.footer.madeIn}</span>
        </div>
      </div>
    </footer>
  );
}
