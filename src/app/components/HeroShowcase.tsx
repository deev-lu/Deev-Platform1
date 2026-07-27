import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import shotFeltes from "../../assets/work/feltes.jpg";
import shotAurora from "../../assets/work/aurora.jpg";
import shotOscars from "../../assets/work/oscarsbar.jpg";
import shotMellys from "../../assets/work/mellys.jpg";
import shotGeoplus from "../../assets/work/geoplus.jpg";

/** Real, shipped client work — presented as one clean, large visual. */
const WORK = [
  { name: "Bureau Immobilier Feltes", href: "https://www.feltes.lu/",    image: shotFeltes },
  { name: "Aurora Experience",        href: "https://www.auroraexp.eu",  image: shotAurora },
  { name: "Oscar's Bar",              href: "https://oscarsbar.lu/",     image: shotOscars },
  { name: "Melly's",                  href: "https://www.mellys.lu",     image: shotMellys },
  { name: "Geoplus 3D",               href: "https://geoplus3d.lu/",     image: shotGeoplus },
];

const INTERVAL = 4500;

export default function HeroShowcase() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [maxSeen, setMaxSeen] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % WORK.length), INTERVAL);
    return () => clearInterval(t);
  }, [reduce]);

  useEffect(() => setMaxSeen((m) => Math.max(m, i)), [i]);

  const item = WORK[i];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Soft floor shadow — the visual sits on the page, no chrome */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-10 -bottom-6 h-24 bg-[#2563F6]/12 blur-[60px] rounded-full pointer-events-none"
      />

      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0b0b14] ring-1 ring-slate-900/[0.06] dark:ring-white/[0.08] shadow-[0_30px_80px_-20px_rgba(15,23,42,0.25)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
      >
        {WORK.map((w, idx) =>
          idx <= maxSeen ? (
            <img
              key={w.name}
              src={w.image}
              alt={`${w.name} — built by DEEV`}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-[900ms] ease-out ${
                idx === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null
        )}
      </a>

      {/* Quiet caption — one line, centred */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <motion.span
          key={item.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-slate-500 dark:text-slate-500"
        >
          {item.name}
        </motion.span>
        <span className="flex items-center gap-1.5">
          {WORK.map((w, idx) => (
            <button
              key={w.name}
              onClick={() => setI(idx)}
              aria-label={`Show ${w.name}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === i
                  ? "w-1.5 bg-slate-400 dark:bg-slate-500"
                  : "w-1.5 bg-slate-300/70 dark:bg-white/15 hover:bg-slate-400"
              }`}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}
