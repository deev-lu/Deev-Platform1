import { useEffect, useRef, useState } from "react";

/**
 * The hero's background film, from YouTube (owner's decision, 23 Oct 2026:
 * plays for every visitor, without asking first; the cookie policy says so
 * under "Embedded video").
 *
 * - Desktop and tablet only (>= 768px) and never under reduced motion, per
 *   the performance rules: a phone keeps the photograph and loads nothing
 *   from YouTube. Decided after mount, so the prerendered page is the photo.
 * - Muted, no controls, from youtube-nocookie.com, starting at 0:10. YouTube's
 *   own loop would restart at 0:00, so the end is caught over the iframe API's
 *   postMessage channel (no API script loaded) and the film seeks back to 10.
 * - The photo stays underneath; the film fades in only once YouTube reports
 *   it is playing, so there is never a black frame or a player UI flash. If
 *   YouTube never answers (blocked network, ad blocker), the photo simply
 *   stays. The film is scaled a little past the frame to keep YouTube's
 *   corner chrome out.
 */

const ID = "3j4eSVrLtmw";
const START = 10;
const ORIGIN_RE = /^https:\/\/www\.youtube(-nocookie)?\.com$/;

export default function HeroVideo() {
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (wide.matches && !still.matches) setOn(true);
  }, []);

  useEffect(() => {
    if (!on) return;
    const post = (msg: object) => ref.current?.contentWindow?.postMessage(JSON.stringify(msg), "*");
    const command = (func: string, args: unknown[] = []) => post({ event: "command", func, args });

    let heard = false;
    const onMessage = (e: MessageEvent) => {
      if (!ORIGIN_RE.test(e.origin)) return;
      let data: { event?: string; info?: { playerState?: number } } | null = null;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      heard = true;
      const state = data?.info?.playerState;
      if (state === 1) setPlaying(true);
      if (state === 0) {
        command("seekTo", [START, true]);
        command("playVideo");
      }
    };
    window.addEventListener("message", onMessage);

    // Ask the player to report its state; repeat until it answers.
    let tries = 0;
    const listen = window.setInterval(() => {
      if (heard || ++tries > 40) return window.clearInterval(listen);
      post({ event: "listening", id: "deev-hero" });
    }, 250);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(listen);
    };
  }, [on]);

  if (!on) return null;

  const src =
    `https://www.youtube-nocookie.com/embed/${ID}?autoplay=1&mute=1&controls=0&start=${START}` +
    `&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1` +
    `&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-[1200ms] ease-out"
      style={{ opacity: playing ? 1 : 0, containerType: "size" } as React.CSSProperties}
    >
      <iframe
        ref={ref}
        src={src}
        title="DEEV"
        tabIndex={-1}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute left-1/2 top-1/2 border-0"
        style={{
          // Cover the frame at 16:9, then a little more to crop YouTube's chrome.
          width: "max(100cqw, 177.78cqh)",
          height: "max(100cqh, 56.25cqw)",
          transform: "translate(-50%, -50%) scale(1.18)",
          filter: "saturate(0.92) contrast(1.02)",
        }}
      />
    </div>
  );
}
