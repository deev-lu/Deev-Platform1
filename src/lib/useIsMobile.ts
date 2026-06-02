import { useEffect, useState } from "react";

/**
 * Returns true on small screens. Used to disable heavy continuous animations
 * on mobile, where they tax the main thread and hurt perceived performance.
 */
export function useIsMobile(query = "(max-width: 767px)") {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [query]);

  return isMobile;
}
