import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Building2,
  LineChart,
  Wine,
  Candy,
  Plane,
  Music,
  Sparkles,
  PawPrint,
  Martini,
  Box,
  Grape,
  UtensilsCrossed,
  Car,
  UserRound,
} from "lucide-react";

// Real screenshots of shipped client work
import shotFeltes from "../../assets/work/feltes.jpg";
import shotOscars from "../../assets/work/oscarsbar.jpg";
import shotMellys from "../../assets/work/mellys.jpg";
import shotAurora from "../../assets/work/aurora.jpg";
import shotGeoplus from "../../assets/work/geoplus.jpg";
import shotVino from "../../assets/work/vinoamore.jpg";

interface PortfolioItem {
  title: string;
  year: number;
  category: string;
  filter: string;
  icon: React.ElementType;
  link?: string;
  image?: string;
}

const portfolioItems: PortfolioItem[] = [
  { title: "Bureau Immobilier Feltes", year: 2024, category: "Real Estate Web-App", filter: "Web App",    icon: Building2,       link: "https://www.feltes.lu/",            image: shotFeltes },
  { title: "Aurora Experience",        year: 2025, category: "Luxury Travel",         filter: "Website",   icon: Plane,           link: "https://www.auroraexp.eu",          image: shotAurora },
  { title: "Oscar's Bar",              year: 2025, category: "Bar & Nightlife",       filter: "Website",   icon: Martini,         link: "https://oscarsbar.lu/",             image: shotOscars },
  { title: "Melly's",                  year: 2025, category: "Candy E-commerce",      filter: "E-commerce",icon: Candy,           link: "https://www.mellys.lu",             image: shotMellys },
  { title: "Geoplus 3D",              year: 2025, category: "3D Scanning Tech",      filter: "Website",   icon: Box,             link: "https://geoplus3d.lu/",             image: shotGeoplus },
  { title: "Vino Amore",              year: 2025, category: "Wine E-commerce",        filter: "E-commerce",icon: Grape,           link: "https://vinoamoreandmore.de/",      image: shotVino },
  { title: "Flenting",                 year: 2026, category: "Finance Website",      filter: "Website",   icon: LineChart,       link: "https://flenting.framer.website/" },
  { title: "Bach Vereenegung Lëtzebuerg", year: 2025, category: "Musical Arts",      filter: "Website",   icon: Music,           link: "https://bachvereenegung.lu/" },
  { title: "Net & Clean",              year: 2025, category: "Cleaning Services",     filter: "Website",   icon: Sparkles,        link: "https://www.net-clean.lu/" },
  { title: "Feine Jong",               year: 2025, category: "Pet Care",              filter: "Website",   icon: PawPrint,        link: "https://www.feinejong.com/" },
  { title: "Supa Saya Gin",            year: 2025, category: "Spirits Brand",         filter: "Website",   icon: Wine,            link: "https://supasayagin.lu/" },
  { title: "Angolodoro",              year: 2024, category: "Restaurant",             filter: "Website",   icon: UtensilsCrossed, link: "https://www.langolodoro.lu/" },
  { title: "AMD Cars",                year: 2024, category: "Car Rental",             filter: "Website",   icon: Car,             link: "https://www.amdcars.lu/" },
  { title: "Florian Blencke",         year: 2023, category: "Personal Brand",         filter: "Website",   icon: UserRound,       link: "https://www.florianblencke.com/" },
];

const filters = ["All", "Website", "E-commerce", "Web App"];

const countFor = (f: string) =>
  f === "All" ? portfolioItems.length : portfolioItems.filter((i) => i.filter === f).length;

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.filter === activeFilter);

  const featured = filtered.filter((i) => i.image);
  const rest = filtered.filter((i) => !i.image);

  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-white dark:bg-[#050509] overflow-hidden border-t border-slate-100 dark:border-white/5">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#3CE7FC]/[0.10] dark:bg-[#3CE7FC]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#2563F6]/[0.08] dark:bg-[#2563F6]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#7c3aed]/[0.05] dark:bg-[#7c3aed]/[0.03] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="eyebrow-mono flex items-center justify-center gap-3 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-6">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#3CE7FC]/70" />
            03 / Selected work
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#3CE7FC]/70" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white mb-5 tracking-tight">
            Projects we're{" "}
            <span className="bg-gradient-to-r from-[#3CE7FC] to-[#2563F6] bg-clip-text text-transparent">
              proud of.
            </span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            From luxury travel to artisan spirits — every project is built with
            the same commitment to craft, performance, and results.
          </p>
        </motion.div>

        {/* Filter Tabs (with counts) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-10"
        >
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={active ? { background: "linear-gradient(135deg, #3CE7FC, #2563F6)" } : {}}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                  active
                    ? "text-white shadow-[0_0_30px_rgba(60,231,252,0.35)]"
                    : "border border-slate-200 dark:border-white/[0.12] text-slate-500 dark:text-slate-400 hover:border-[#2563F6] hover:text-[#2563F6] dark:hover:border-white/25 dark:hover:text-white bg-transparent"
                }`}
              >
                {filter}
                <span
                  className={`text-[11px] font-medium tabular-nums px-1.5 py-0.5 rounded-full ${
                    active
                      ? "bg-white/25 text-white"
                      : "bg-slate-100 dark:bg-white/[0.08] text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {countFor(filter)}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Featured — real screenshots of shipped work */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <AnimatePresence mode="popLayout">
            {featured.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass glass-edge glass-sheen group relative block rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(37,99,246,0.16)] dark:hover:shadow-[0_20px_60px_rgba(60,231,252,0.12)]"
                  >
                    {/* Live site screenshot */}
                    <div className="relative m-2 mb-0 rounded-md overflow-hidden aspect-[16/10]">
                      <img
                        src={item.image}
                        alt={`${item.title} — live website`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-50 group-hover:opacity-25 transition-opacity duration-500" />
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 p-4">
                      <div className="shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#2563F6] to-[#3CE7FC] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(37,99,246,0.25)]">
                        <Icon className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-medium tracking-tight text-slate-900 dark:text-white group-hover:text-[#2563F6] dark:group-hover:text-[#3CE7FC] transition-colors duration-300 truncate">
                          {item.title}
                        </h3>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.category} · {item.year}
                        </div>
                      </div>
                      <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100/70 dark:bg-white/[0.06] text-slate-400 dark:text-slate-500 group-hover:bg-[#3CE7FC] group-hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* More work — compact rows */}
        {rest.length > 0 && (
          <>
            <div className="eyebrow-mono text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500 mb-4">
              More work
            </div>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {rest.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass glass-edge glass-sheen group relative flex items-center gap-3.5 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(37,99,246,0.14)] dark:hover:shadow-[0_12px_40px_rgba(60,231,252,0.10)]"
                      >
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#2563F6] to-[#3CE7FC] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(37,99,246,0.22)] transition-transform duration-300 group-hover:scale-105">
                          <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium tracking-tight leading-snug text-slate-900 dark:text-white group-hover:text-[#2563F6] dark:group-hover:text-[#3CE7FC] transition-colors duration-300">
                            {item.title}
                          </h3>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {item.category} · {item.year}
                          </div>
                        </div>
                        <ArrowUpRight className="shrink-0 w-4 h-4 text-slate-400 dark:text-slate-500 transition-all duration-300 group-hover:text-[#3CE7FC] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* Count */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-slate-100 dark:border-white/10"
        >
          <p className="text-sm text-slate-400 dark:text-slate-500">
            <span className="font-medium text-slate-700 dark:text-white text-lg">
              {portfolioItems.length}+
            </span>{" "}
            projects delivered across Europe
          </p>
        </motion.div>
      </div>
    </section>
  );
}
