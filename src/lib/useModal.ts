import { useEffect, useRef, type RefObject } from "react";

/**
 * Keyboard behaviour of a modal dialog (WCAG 2.1.2, 2.4.3), in one place for
 * every modal on the site: the cookie preferences and the calculator's lead
 * form.
 *
 * While `open`:
 *   - focus moves into the dialog (its first field or button, or the element
 *     marked `data-autofocus`),
 *   - Tab and Shift+Tab stay inside it,
 *   - Escape calls `onClose`.
 * When it closes, focus goes back to whatever opened it. If that element is
 * gone by then (a banner that hid itself while the dialog was up), `fallback`
 * is asked for a replacement, so focus never drops to <body>.
 *
 * The dialog element itself carries role="dialog", aria-modal="true" and a
 * label; this hook only does the moving parts.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function focusablesIn(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => !el.closest("[hidden], [aria-hidden='true']") && el.getClientRects().length > 0,
  );
}

export function useModal(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
  fallback?: () => HTMLElement | null | undefined,
): void {
  // Latest callbacks without re-running the effect on every render.
  const close = useRef(onClose);
  const back = useRef(fallback);
  close.current = onClose;
  back.current = fallback;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      const root = ref.current;
      if (!root) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        close.current();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusablesIn(root);
      if (!list.length) {
        e.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (!root.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // After the enter animation's first frame, so the element exists.
    const t = window.setTimeout(() => {
      const root = ref.current;
      if (!root || root.contains(document.activeElement)) return;
      const target = root.querySelector<HTMLElement>("[data-autofocus]") ?? focusablesIn(root)[0] ?? root;
      if (target === root && !root.hasAttribute("tabindex")) root.setAttribute("tabindex", "-1");
      target.focus();
    }, 30);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      // Give the page a frame to re-render whatever replaces the dialog.
      window.setTimeout(() => {
        const target = opener?.isConnected ? opener : back.current?.();
        target?.focus?.();
      }, 60);
    };
  }, [open, ref]);
}
