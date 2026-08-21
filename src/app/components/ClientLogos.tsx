import { motion } from "motion/react";

// Client logos
import feltes      from "../../assets/clients/feltes.png";
import mellys      from "../../assets/clients/mellys.png";
import netclean    from "../../assets/clients/netclean.png";
import picadilly   from "../../assets/clients/picadilly.png";
import stoffel     from "../../assets/clients/stoffel.png";

/**
 * Logos are single-tone silhouettes: black on light, white on dark. That is
 * the one treatment that works whatever colour the artwork is, and the old
 * per-file invert flags did not manage it — Melly's is near-white artwork
 * flagged as coloured, so it was greyed to nothing on white and inverted to
 * black on black.
 *
 * Melly's is the exception: it is an outlined bubble wordmark on near-white
 * artwork, so a flat silhouette fills the counters and the letters vanish into
 * a blob. It gets inverted on light backgrounds and left alone on dark ones,
 * which is the pair that keeps it readable. All five were compared in both
 * themes across five filter combinations before this was settled.
 *
 * assets/clients/oscarsbar.png is not Oscar's Bar: the file holds the MBM
 * Group Real Estate mark, and the strip was showing it labelled Oscar's Bar.
 * Rather than caption someone else's logo with the wrong name, it is out
 * until we know whose it is and whether they belong on the wall.
 */
/** Black silhouette on light, white silhouette on dark. */
const MONO = "brightness-0 dark:brightness-0 dark:invert";

const clients = [
  { name: "Bureau Immobilier Feltes", src: feltes, filter: MONO },
  { name: "Melly's", src: mellys, filter: "grayscale invert dark:grayscale-0 dark:invert-0" },
  { name: "Net & Clean", src: netclean, filter: MONO },
  { name: "Picadilly", src: picadilly, filter: MONO },
  { name: "Stoffel Immobilier", src: stoffel, filter: MONO },
];

function LogoGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex gap-12 sm:gap-16 items-center shrink-0 pr-12 sm:pr-16"
      aria-hidden={ariaHidden}
    >
      {clients.map((client) => (
        <div
          key={client.name}
          className="flex-shrink-0 flex items-center justify-center h-12 px-2"
          title={client.name}
        >
          <img
            src={client.src}
            alt={client.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`h-8 sm:h-11 w-auto max-w-[130px] sm:max-w-[160px] object-contain opacity-60 dark:opacity-75 hover:opacity-100 dark:hover:opacity-100 transition-opacity duration-300 ${client.filter}`}
          />
        </div>
      ))}
    </div>
  );
}

export default function ClientLogos() {
  return (
    <section className="relative py-14 bg-white dark:bg-[#06060a] border-y border-slate-100 dark:border-white/[0.06] overflow-hidden">
      {/* Fade masks left & right */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-r from-white dark:from-[#06060a] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-l from-white dark:from-[#06060a] to-transparent pointer-events-none" />

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-10"
      >
        Trusted by leading businesses in Luxembourg &amp; beyond
      </motion.p>

      {/* Infinite marquee, CSS-driven, pauses on hover, two equal groups for a perfect seam */}
      <div className="marquee-track flex overflow-hidden select-none">
        <div className="animate-marquee flex shrink-0">
          <LogoGroup />
          <LogoGroup ariaHidden />
        </div>
      </div>
    </section>
  );
}
