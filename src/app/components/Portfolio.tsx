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
    <section className="relative bg-[var(--surface-0)] border-t border-[var(--line)]" style={{ paddingBlock: "var(--section-y)" }}>

      <div className="relative z-10 mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="text-[var(--metal)]">03</span> / Selected work
            </span>
          </div>
          <h2
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em", maxWidth: "18ch" }}
          >
            Projects we&rsquo;re proud of.
          </h2>
          <p
            className="text-[var(--text-mid)] mt-6"
            style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "48ch" }}
          >
            From luxury travel to artisan spirits — every project is built with
            the same commitment to craft, performance, and results.
          </p>
        </motion.div>

        {/* Filter Tabs (with counts) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`eyebrow-mono inline-flex items-center gap-1.5 px-4 h-9 uppercase border transition-colors duration-[var(--dur-1)] ${
                  active
                    ? "text-white"
                    : "border-[var(--line)] text-[var(--text-mid)] hover:border-[var(--line-strong)] hover:text-[var(--text-hi)]"
                }`}
                style={active
                  ? { background: "var(--signal)", borderColor: "var(--signal)", fontSize: "var(--t-label)", letterSpacing: "0.16em" }
                  : { fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
              >
                {filter}
                <sup
                  className={`tabular-nums ${active ? "text-white/70" : "text-[var(--text-low)]"}`}
                  style={{ fontSize: "0.625em" }}
                >
                  {countFor(filter)}
                </sup>
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
                    className="group relative block cursor-pointer border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors duration-[240ms] bg-[var(--surface-1)]"
                  >
                    {/* Live site screenshot */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={item.image}
                        alt={`${item.title} — live website`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top transition-transform duration-[640ms] ease-[cubic-bezier(0.16,1,0.30,1)] group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-50 group-hover:opacity-25 transition-opacity duration-500" />
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 px-5 py-5 border-t border-[var(--line)]">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-[var(--text-hi)] font-medium truncate"
                          style={{ fontSize: "var(--t-body)", letterSpacing: "-0.01em" }}
                        >
                          {item.title}
                        </h3>
                        <div
                          className="eyebrow-mono uppercase text-[var(--text-low)] truncate mt-1.5"
                          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                        >
                          {item.category} · {item.year}
                        </div>
                      </div>
                      <ArrowUpRight
                        className="shrink-0 w-4 h-4 text-[var(--text-low)] group-hover:text-[var(--signal-text)] transition-all duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={1.25}
                      />
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
                        className="glass glass-edge glass-sheen group relative flex items-center gap-3.5 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 dark:"
                      >
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#2563F6] to-[#3CE7FC] flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
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
