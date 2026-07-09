import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "cookie-consent"; // "accepted" | "rejected"

/**
 * Lightweight GDPR cookie-consent banner.
 * Stores the user's choice in localStorage under `cookie-consent`.
 * Other code can read it to enable/disable non-essential scripts:
 *   localStorage.getItem("cookie-consent") === "accepted"
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Small delay so it doesn't fight the hero entrance
        const t = setTimeout(() => setVisible(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          className="fixed z-[60] bottom-4 left-4 right-4 sm:right-auto sm:max-w-md"
        >
          <div className="glass-edge relative overflow-hidden rounded-lg border border-white/60 dark:border-white/[0.12] bg-white/60 dark:bg-[#0e0e18]/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_20px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#0022FF] to-[#00C6FF]" />
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3.5 mb-4">
                <div className="shrink-0 w-10 h-10 rounded-md bg-[#0022FF]/[0.07] dark:bg-[#00C6FF]/[0.10] flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-[#0022FF] dark:text-[#00C6FF]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                    We value your privacy
                  </h3>
                  <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                    We use only essential cookies to run this site. With your
                    consent we may also use analytics cookies to improve it. Read
                    our{" "}
                    <Link
                      to="/legal"
                      className="font-semibold text-[#0022FF] dark:text-[#00C6FF] hover:underline"
                    >
                      cookie &amp; privacy policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5">
                <button
                  onClick={() => choose("rejected")}
                  className="flex-1 px-5 py-2.5 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.10] transition-colors duration-200"
                >
                  Reject non-essential
                </button>
                <button
                  onClick={() => choose("accepted")}
                  className="flex-1 px-5 py-2.5 rounded-md text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_24px_rgba(0,34,255,0.4)]"
                  style={{ background: "linear-gradient(135deg, #0022FF 0%, #00C6FF 100%)" }}
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
