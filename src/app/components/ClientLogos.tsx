import { motion } from "motion/react";

// Client logos
import feltes      from "../../assets/clients/feltes.png";
import mellys      from "../../assets/clients/mellys.png";
import netclean    from "../../assets/clients/netclean.png";
import picadilly   from "../../assets/clients/picadilly.png";
import stoffel     from "../../assets/clients/stoffel.png";

const clients = [
  { name: "Bureau Immobilier Feltes", src: feltes,    invert: true  },
  { name: "Melly's",                  src: mellys,    invert: false },
  { name: "Net & Clean",              src: netclean,  invert: false },
  { name: "Picadilly",                src: picadilly, invert: true  },
  { name: "Stoffel Immobilier",       src: stoffel,   invert: false },
];

// Duplicate for seamless loop
const loopClients = [...clients, ...clients];

export default function ClientLogos() {
  return (
    <section className="relative py-14 bg-white dark:bg-[#06060a] border-y border-slate-100 dark:border-white/[0.06] overflow-hidden">
      {/* Fade masks left & right */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white dark:from-[#06060a] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white dark:from-[#06060a] to-transparent pointer-events-none" />

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400 mb-10"
      >
        Trusted by businesses in Luxembourg
      </motion.p>

      {/* Infinite marquee */}
      <div className="flex overflow-hidden select-none">
        <motion.div
          className="flex gap-14 items-center shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {loopClients.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center h-10 px-2"
              title={client.name}
            >
              <img
                src={client.src}
                alt={client.name}
                className={`h-8 sm:h-10 w-auto max-w-[130px] object-contain transition-all duration-300
                  ${client.invert
                    /* White logos: black silhouette in light, show as white in dark */
                    ? "brightness-0 opacity-45 dark:brightness-100 dark:opacity-70 hover:opacity-75 dark:hover:opacity-100"
                    /* Colored logos: gray in light → invert to bright silhouette in dark */
                    : "grayscale opacity-50 dark:invert dark:opacity-70 hover:grayscale-0 hover:opacity-90 dark:hover:invert-0 dark:hover:opacity-100"
                  }
                `}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
