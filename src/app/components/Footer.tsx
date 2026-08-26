import { Linkedin } from "lucide-react";
import logo from "../../assets/logo.png";
import MadeInLuxembourg from "./MadeInLuxembourg";
import L from "./L";
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
const NAV = {
  services: [
    { key: "webApps", href: "/#services" },
    { key: "aiAgents", href: "/#ai" },
    { key: "ecommerce", href: "/#services" },
    { key: "marketingSites", href: "/#marketing" },
  ],
  company: [
    { key: "services", href: "/services" },
    { key: "portfolio", href: "/work" },
    { key: "journal", href: "/blog" },
    { key: "pricing", href: "/#project-builder" },
    { key: "whyDeev", href: "/#why-deev" },
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
    "text-slate-600 dark:text-slate-400 hover:text-[#3CE7FC] dark:hover:text-[#3CE7FC] font-medium transition-colors duration-200";

  /** "/#services" has to become "/fr/#services", not "/#fr/services". */
  const href = (h: string) => {
    const [path, hash] = h.split("#");
    return localePath(path || "/") + (hash ? `#${hash}` : "");
  };

  const label = (k: string) =>
    (t.site.footer.links as Record<string, string>)[k] ??
    (t.site.nav as unknown as Record<string, string>)[k];

  return (
    <footer className="relative bg-white dark:bg-[#06060a] border-t border-slate-200 dark:border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="DEEV" width={256} height={256} className="h-9 w-auto object-contain" />
              <span className="text-xl font-brand tracking-[0.015em] text-[#0a0f2e] dark:text-white">
                DEEV
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
              {t.site.footer.blurb}
            </p>
            <div className="flex gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-[#2563F6] hover:border-[#2563F6] hover:text-white /30"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* Made in Luxembourg, certified label */}
            <div className="mt-8 flex items-center gap-3">
              <MadeInLuxembourg className="h-16 w-20 text-slate-800 dark:text-white/90 shrink-0" />
              <div className="text-xs leading-relaxed text-[var(--text-mid)]">
                <div className="font-semibold text-slate-700 dark:text-slate-300">{t.site.footer.certified}</div>
                {t.site.footer.certifiedNote}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-slate-900 dark:text-white font-medium mb-6">{t.site.footer.services}</h2>
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
          <div>
            <h2 className="text-slate-900 dark:text-white font-medium mb-6">{t.site.footer.company}</h2>
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
          <div>
            <h2 className="text-slate-900 dark:text-white font-medium mb-6">{t.site.footer.legal}</h2>
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
                  className={`${linkClass} cursor-pointer`}
                >
                  {t.site.footer.links.cookieSettings}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--text-mid)] text-sm font-medium">
              {t.site.footer.rights(new Date().getFullYear())}
            </p>
            <p className="text-[var(--text-mid)] text-sm font-medium">
              {t.site.footer.madeIn}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
