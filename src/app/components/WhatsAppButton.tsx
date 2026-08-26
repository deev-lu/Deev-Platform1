import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { whatsappHref } from "../../lib/whatsapp";
import { useT } from "../../lib/useT";
import { useIsMobile } from "../../lib/useIsMobile";
import { getConsent, onConsentChange } from "../../lib/consent";

/**
 * The floating WhatsApp button.
 *
 * Fixed to the bottom right, present on every page, opening a chat with the
 * business number with a first line already written.
 *
 * The behaviour that is not just "position: fixed":
 *
 *   It stays out of the hero. Appearing over the first screen competes with
 *   the two calls to action that are already there, so it waits until the
 *   visitor has scrolled past roughly one screen and has therefore chosen to
 *   keep reading. It leaves again if they scroll back to the top.
 *
 *   It waits for the cookie banner. That banner owns the bottom of the screen
 *   on a first visit and spans the full width on a phone; stacking a second
 *   floating control on it is a bad first impression and, on a narrow screen,
 *   an unreachable button.
 *
 *   It can be dismissed. A permanent element a visitor cannot get rid of is
 *   the thing people complain about with these buttons. The X closes it for
 *   the rest of the tab.
 *
 *   The label expands on hover on a pointer device, and after a short pause
 *   on a phone, where there is no hover to expand it with. Under
 *   prefers-reduced-motion the label is simply there, without the expansion.
 */

const DISMISSED_KEY = "deev_wa_hidden";
/** Roughly one screen. Past this the visitor is reading, not landing. */
const SHOW_AFTER = 0.8;

export default function WhatsAppButton() {
  const t = useT();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();

  const [consented, setConsented] = useState(() => Boolean(getConsent()));
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const nudge = useRef<number | undefined>(undefined);

  useEffect(() => onConsentChange((r) => setConsented(Boolean(r))), []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) setHidden(true);
    } catch {
      /* private mode: the button simply comes back next page */
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = consented && scrolled && !hidden;

  // On a phone there is no hover, so the label introduces itself once and
  // then gets out of the way.
  useEffect(() => {
    if (!visible || !isMobile || reduce) return;
    nudge.current = window.setTimeout(() => {
      setExpanded(true);
      nudge.current = window.setTimeout(() => setExpanded(false), 3600);
    }, 900);
    return () => window.clearTimeout(nudge.current);
  }, [visible, isMobile, reduce]);

  const dismiss = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* as above */
    }
  };

  // Worth measuring, and it only measures at all once analytics has consent:
  // gtag is not defined before the tag loads, and the tag stays in a denied
  // state until the visitor accepts.
  const track = () => {
    (window as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "whatsapp_click", {
      event_category: "contact",
      event_label: "floating_button",
    });
  };

  const showLabel = expanded || reduce;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-50 bottom-5 right-5 flex items-center gap-2"
          onMouseEnter={() => !isMobile && setExpanded(true)}
          onMouseLeave={() => !isMobile && setExpanded(false)}
        >
          {/* Dismiss. Small, quiet, and only offered once the button is
              actually on screen. */}
          <button
            type="button"
            onClick={dismiss}
            aria-label={t.site.whatsapp.dismiss}
            title={t.site.whatsapp.dismiss}
            className="grid place-items-center w-7 h-7 border border-[var(--line)] bg-[var(--surface-1)] text-[var(--text-low)] hover:text-[var(--text-hi)] hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
            style={{ borderRadius: "var(--radius-1)" }}
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>

          {/* WhatsApp's own green, deliberately. The point of this control is
              that it is recognised in a glance; a version of it in the site's
              blue would be a mystery button. Everything else about it, the
              radius and the motion, follows the design system. */}
          <a
            href={whatsappHref(t.site.whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={track}
            aria-label={t.site.whatsapp.label}
            className="group flex items-center gap-2.5 h-12 pl-3.5 pr-3.5 text-white shadow-lg hover:shadow-xl transition-shadow duration-[var(--dur-2)]"
            style={{ background: "#25D366", borderRadius: "var(--radius-1)" }}
          >
            <WhatsAppIcon className="w-6 h-6 shrink-0" />
            <motion.span
              initial={false}
              animate={{
                width: showLabel ? "auto" : 0,
                opacity: showLabel ? 1 : 0,
              }}
              transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden whitespace-nowrap font-medium"
              style={{ fontSize: "var(--t-small)" }}
            >
              <span className="pr-1">{t.site.whatsapp.tooltip}</span>
            </motion.span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
