import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { Play } from "lucide-react";

/**
 * A YouTube embed that loads the player only when someone presses play.
 *
 * A normal <iframe> embed pulls several hundred kilobytes of Google script on
 * page load and sets third-party storage before a visitor has agreed to
 * anything. This renders the video's own still frame with a play control; the
 * first click swaps in the real player, from youtube-nocookie.com, already
 * playing.
 *
 * The still frame comes from Google's thumbnail host, lazily, so it is
 * fetched when the section is nearly in view rather than on page load. That
 * request carries no cookies, but it does tell Google that a browser loaded
 * this page, which is why the cookie policy says so. Shorts are vertical, so
 * the original-aspect thumbnail is tried first and the 16:9 sizes are
 * fallbacks; object-cover crops those to the middle, which is the frame.
 *
 * A self-hosted still always wins: drop <video-id>.jpg into
 * src/assets/marketing and it is used instead, with no third-party request at
 * all. Same convention as the work screenshots.
 */

const POSTERS = import.meta.glob("../../assets/marketing/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const posterFor = (id: string) => {
  const hit = Object.entries(POSTERS).find(([path]) =>
    path.split("/").pop()?.replace(/\.[a-z]+$/i, "") === id,
  );
  return hit?.[1];
};

/** Original aspect ratio first (Shorts are 9:16), then the 16:9 sizes. */
const remoteThumbs = (id: string) => [
  `https://i.ytimg.com/vi/${id}/oardefault.jpg`,
  `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
];

export default function LiteYouTube({
  id,
  title,
  className = "",
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // loading="lazy" is not enough here: the section mounts before the page has
  // laid out, so the browser sees the card near the viewport and fetches
  // immediately. Ask directly whether it is close instead.
  const near = useInView(ref, { once: true, margin: "600px" });
  const local = posterFor(id);
  // Walk the fallback chain in the browser: not every video has every size,
  // and a missing one 404s rather than redirecting.
  const [thumbIndex, setThumbIndex] = useState(0);
  const remote = remoteThumbs(id);
  const poster = local ?? (near && thumbIndex < remote.length ? remote[thumbIndex] : undefined);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] ${className}`}
      style={{ aspectRatio: "9 / 16", borderRadius: "var(--radius-1)" }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 w-full h-full cursor-pointer"
        >
          {poster ? (
            <img
              src={poster}
              alt=""
              loading="lazy"
              decoding="async"
              width={720}
              height={1280}
              onError={() => !local && setThumbIndex((i) => i + 1)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <span
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, var(--line) 0 1px, transparent 1px 72px), repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px 72px)",
              }}
            />
          )}

          {/* The scrim exists to keep the control legible over a photograph.
              With no poster there is nothing to darken, and dimming the plate
              just turns it into a grey slab in the light theme. */}
          {poster && (
            <span className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-[var(--dur-2)]" />
          )}

          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center border transition-transform duration-[var(--dur-2)] group-hover:scale-105 ${
              poster
                ? "border-white/70 bg-black/35 text-white"
                : "border-[var(--line-strong)] bg-[var(--surface-1)] text-[var(--text-hi)]"
            }`}
            style={{ borderRadius: "var(--radius-1)" }}
          >
            <Play className="w-6 h-6 translate-x-[1px]" strokeWidth={1.5} fill="currentColor" />
          </span>

          {/* No caption on the face: the same words under both videos read as
              a placeholder. The description lives in the accessible name. */}
        </button>
      )}
    </div>
  );
}
