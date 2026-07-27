import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useIsMobile } from "../../lib/useIsMobile";

import shotFeltes from "../../assets/work/feltes.jpg";
import shotAurora from "../../assets/work/aurora.jpg";
import shotOscars from "../../assets/work/oscarsbar.jpg";
import shotMellys from "../../assets/work/mellys.jpg";
import shotGeoplus from "../../assets/work/geoplus.jpg";

/** Real, shipped client work — cycled in a browser frame. */
const WORK = [
  { name: "Bureau Immobilier Feltes", domain: "feltes.lu",     category: "Real-estate web-app", year: 2024, href: "https://www.feltes.lu/",     image: shotFeltes },
  { name: "Aurora Experience",        domain: "auroraexp.eu",  category: "Luxury travel",       year: 2025, href: "https://www.auroraexp.eu",  image: shotAurora },
  { name: "Oscar's Bar",              domain: "oscarsbar.lu",  category: "Bar & nightlife",     year: 2025, href: "https://oscarsbar.lu/",     image: shotOscars },
  { name: "Melly's",                  domain: "mellys.lu",     category: "Candy e-commerce",    year: 2025, href: "https://www.mellys.lu",     image: shotMellys },
  { name: "Geoplus 3D",               domain: "geoplus3d.lu",  category: "3D scanning tech",    year: 2025, href: "https://geoplus3d.lu/",     image: shotGeoplus },
];

const INTERVAL = 4200;

export default function HeroShowcase() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % WORK.length), INTERVAL);
    return () => clearInterval(t);
  }, [reduce]);

  const item = WORK[i];
  // Highest index reached so far — later frames mount only once needed
  const [maxSeen, setMaxSeen] = useState(0);
  useEffect(() => setMaxSeen((m) => Math.max(m, i)), [i]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
    >
      {/* Ambient glow behind the frame */}
      <div className="absolute -inset-x-8 -bottom-8 top-8 bg-[#2563F6]/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative rounded-lg border border-white/[0.12] bg-[#0b0b14]/90 shadow-[0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-white/[0.08] bg-white/[0.03]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="flex-1 flex justify-center px-4">
            {/* Keyed remount (no exit wait) so it never lags behind the image */}
            <motion.span
              key={item.domain}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="eyebrow-mono text-[10px] tracking-[0.12em] text-slate-400 truncate"
            >
              {item.domain}
            </motion.span>
          </div>
          <span className="eyebrow-mono text-[9px] tracking-[0.14em] text-emerald-400 uppercase">
            live
          </span>
        </div>

        {/* Screenshot */}
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-[16/10] overflow-hidden bg-[#0b0b14]"
        >
          {/* Stacked crossfade — only mounts frames that have been reached,
              so later screenshots don't cost anything on first paint. */}
          {WORK.map((w, idx) =>
            idx <= maxSeen ? (
              <img
                key={w.domain}
                src={w.image}
                alt={`${w.name} — built by DEEV`}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ease-out ${
                  idx === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : null
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
        </a>

        {/* Caption */}
        <div className="flex items-center gap-4 px-4 sm:px-5 py-3.5 border-t border-white/[0.08] bg-white/[0.02]">
          <div className="flex-1 min-w-0">
            {/* Keyed remount (no exit wait) so it stays in sync with the image */}
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-sm font-medium text-white truncate">{item.name}</div>
              <div className="eyebrow-mono text-[10px] tracking-[0.14em] uppercase text-slate-500 truncate mt-0.5">
                {item.category} · {item.year}
              </div>
            </motion.div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            {WORK.map((w, idx) => (
              <button
                key={w.domain}
                onClick={() => setI(idx)}
                aria-label={`Show ${w.name}`}
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === i
                    ? "w-5 bg-gradient-to-r from-[#3CE7FC] to-[#2563F6]"
                    : "w-1 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-white/[0.06] text-slate-400 hover:bg-[#2563F6] hover:text-white transition-all duration-300"
            aria-label={`Visit ${item.name}`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Label under the frame */}
      {!isMobile && (
        <div className="eyebrow-mono mt-4 text-[10px] tracking-[0.2em] uppercase text-slate-500 text-center">
          Shipped by DEEV · {WORK.length} of 15+ projects
        </div>
      )}
    </motion.div>
  );
}
