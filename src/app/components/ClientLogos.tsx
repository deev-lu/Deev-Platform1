import { motion } from "motion/react";

// Client logos
import feltes      from "../../assets/clients/feltes.png";
import mellys      from "../../assets/clients/mellys.png";
import netclean    from "../../assets/clients/netclean.png";
import picadilly   from "../../assets/clients/picadilly.png";
import stoffel     from "../../assets/clients/stoffel.png";
import oscarsbar   from "../../assets/clients/oscarsbar.png";

const clients = [
  { name: "Bureau Immobilier Feltes", src: feltes,    invert: true  },
  { name: "Melly's",                  src: mellys,    invert: false },
  { name: "Net & Clean",              src: netclean,  invert: false },
  { name: "Picadilly",                src: picadilly, invert: true  },
  { name: "Oscar's Bar",              src: oscarsbar, invert: true  },
  { name: "Stoffel Immobilier",       src: stoffel,   invert: false },
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
            className={`h-8 sm:h-11 w-auto max-w-[130px] sm:max-w-[160px] object-contain transition-all duration-300
              ${client.invert
                /* White logos: black silhouette in light, show as white in dark */
                ? "brightness-0 opacity-65 dark:brightness-100 dark:opacity-85 hover:opacity-100 dark:hover:opacity-100"
                /* Colored logos: gray in light → invert to bright silhouette in dark */
                : "grayscale opacity-70 dark:invert dark:opacity-85 hover:grayscale-0 hover:opacity-100 dark:hover:invert-0 dark:hover:opacity-100"
              }
            `}
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

      {/* Infinite marquee — CSS-driven, pauses on hover, two equal groups for a perfect seam */}
      <div className="marquee-track flex overflow-hidden select-none">
        <div className="animate-marquee flex shrink-0">
          <LogoGroup />
          <LogoGroup ariaHidden />
        </div>
      </div>
    </section>
  );
}
