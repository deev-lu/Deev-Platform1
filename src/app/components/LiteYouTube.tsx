import { useState } from "react";
import { Play } from "lucide-react";

/**
 * A YouTube embed that contacts Google only when someone presses play.
 *
 * A normal <iframe> embed loads several hundred kilobytes of Google script on
 * page load and sets third-party storage before a visitor has agreed to
 * anything, which would contradict both the consent banner and the cookie
 * policy. This renders a still frame with a play control; the first click
 * swaps in the real player, from youtube-nocookie.com, already playing.
 *
 * The still frame is a self-hosted file: drop <video-id>.jpg into
 * src/assets/marketing and it is picked up by name, the same convention the
 * work screenshots use. Without one, the frame is drawn from the design
 * system rather than pulled from Google's thumbnail servers, which would be
 * the same third-party contact through a different door.
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
  const poster = posterFor(id);

  return (
    <div
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
