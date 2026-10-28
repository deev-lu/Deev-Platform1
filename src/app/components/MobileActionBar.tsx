import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Phone, ArrowRight } from "lucide-react";
import L from "./L";
import WhatsAppIcon from "./WhatsAppIcon";
import { useT } from "../../lib/useT";
import { useIsMobile } from "../../lib/useIsMobile";
import { getConsent, onConsentChange } from "../../lib/consent";
import { whatsappHref, WHATSAPP_NUMBER } from "../../lib/whatsapp";
import { useReduceMotion } from "../../lib/motionPref";

/**
 * Die Kontaktleiste am unteren Rand, nur auf dem Telefon (seit dem 25.10.2026).
 *
 * Auf dem Telefon ist die Navigation hinter dem Menue versteckt und der
 * Hauptknopf nach dem ersten Bildschirm weg. Diese Leiste haelt die drei Wege
 * in Daumenreichweite: anrufen, WhatsApp, Erstgespraech anfragen. Sie
 * ersetzt dort den schwebenden WhatsApp-Knopf (der bleibt ab 768px).
 *
 * Wie der WhatsApp-Knopf: erst nach etwa einem Bildschirm, damit sie nicht
 * mit dem Hero konkurriert, und erst nach der Cookie-Entscheidung, weil der
 * Hinweis denselben Rand belegt. Auf /contact nicht, dort steht das Formular.
 * Klicks auf Telefon und WhatsApp misst der Listener in analytics.ts.
 */
const SHOW_AFTER = 0.8;

export function useActionBarVisible(): boolean {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const [consented, setConsented] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setConsented(Boolean(getConsent()));
    return onConsentChange((r) => setConsented(Boolean(r)));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const onContact = /\/contact\/?$/.test(pathname);
  return isMobile && consented && scrolled && !onContact;
}

export default function MobileActionBar() {
  const t = useT();
  const reduce = useReduceMotion();
  const visible = useActionBarVisible();

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label={t.site.nav.cta}
          initial={reduce ? { opacity: 0 } : { y: "100%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="md:hidden fixed z-50 inset-x-0 bottom-0 border-t border-[var(--line-strong)] bg-[var(--surface-1)] shadow-[0_-10px_30px_rgba(0,0,0,0.25)]"
          style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-2.5 px-4 pt-2.5">
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              aria-label={t.site.nav.call}
              className="shrink-0 grid place-items-center w-12 h-12 rounded-full border border-[var(--line-strong)] text-[var(--text-hi)]"
            >
              <Phone className="w-5 h-5" strokeWidth={1.75} />
            </a>
            <a
              href={whatsappHref(t.site.whatsapp.message)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.site.whatsapp.label}
              className="shrink-0 grid place-items-center w-12 h-12 rounded-full text-white"
              style={{ background: "#25D366" }}
            >
              <WhatsAppIcon className="w-6 h-6" />
            </a>
            <L
              to="/contact?interest=call"
              className="flex-1 min-w-0 inline-flex items-center justify-center gap-2 h-12 px-4 rounded-full text-white font-semibold whitespace-nowrap"
              style={{ background: "var(--signal)", fontSize: "0.9375rem" }}
            >
              {t.site.nav.cta}
              {/* Der Pfeil weicht auf schmalen Telefonen dem deutschen Text. */}
              <ArrowRight className="hidden min-[400px]:block w-4 h-4 shrink-0" strokeWidth={1.75} />
            </L>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
