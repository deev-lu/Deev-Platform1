import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";

interface PortfolioItem {
  title: string;
  year: number;
  category: string;
  filter: string;
  link?: string;
}

const portfolioItems: PortfolioItem[] = [
  { title: "Bureau Immobilier Feltes", year: 2024, category: "Real Estate Web-App", filter: "Web App",    link: "https://www.feltes-immobilier.lu/" },
  { title: "Flenting",                 year: 2026, category: "Finance Website",      filter: "Website",   link: "https://flenting.framer.website/" },
  { title: "Oscar's Bar",              year: 2025, category: "Bar & Nightlife",       filter: "Website",   link: "https://oscarsbar.lu/" },
  { title: "Melly's",                  year: 2025, category: "Candy E-commerce",      filter: "E-commerce",link: "https://www.mellys.lu" },
  { title: "Aurora Experience",        year: 2025, category: "Luxury Travel",         filter: "Website",   link: "https://www.auroraexp.eu" },
  { title: "Bach Vereenegung Lëtzebuerg", year: 2025, category: "Musical Arts",      filter: "Website" },
  { title: "Net & Clean",              year: 2025, category: "Cleaning Services",     filter: "Website",   link: "https://www.net-clean.lu/" },
  { title: "Feine Jong",               year: 2025, category: "Pet Care",              filter: "Website" },
  { title: "Supa Saya Gin",            year: 2025, category: "Spirits Brand",         filter: "Website" },
  { title: "Geoplus 3D",              year: 2025, category: "3D Scanning Tech",      filter: "Website",   link: "https://geoplus3d.lu/" },
  { title: "Vino Amore",              year: 2025, category: "Wine E-commerce",        filter: "E-commerce",link: "https://vinoamoreandmore.de/" },
  { title: "ëGen Pro",                year: 2025, category: "Water Filter Brand",     filter: "Website" },
  { title: "Angolodoro",              year: 2024, category: "Restaurant",             filter: "Website" },
  { title: "AMD Cars",                year: 2024, category: "Car Rental",             filter: "Website" },
  { title: "Florian Blencke",         year: 2023, category: "Personal Brand",         filter: "Website" },
];

const filters = ["All", "Website", "E-commerce", "Web App"];

const countFor = (f: string) =>
  f === "All" ? portfolioItems.length : portfolioItems.filter((i) => i.filter === f).length;

// Two-letter monogram from the project name
const monogram = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.filter === activeFilter);

  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-white dark:bg-[#050509] overflow-hidden border-t border-slate-100 dark:border-white/5">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#00C6FF]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#0022FF]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.10] text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
            <span className="w-1 h-1 rounded-full bg-[#00C6FF]" />
            Our Work
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
            Projects we're{" "}
            <span className="bg-gradient-to-r from-[#00C6FF] to-[#0022FF] bg-clip-text text-transparent">
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
                style={active ? { background: "linear-gradient(135deg, #00C6FF, #0044ff)" } : {}}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  active
                    ? "text-white shadow-[0_0_30px_rgba(0,198,255,0.35)]"
                    : "border border-slate-200 dark:border-white/[0.12] text-slate-500 dark:text-slate-400 hover:border-[#0022FF] hover:text-[#0022FF] dark:hover:border-white/25 dark:hover:text-white bg-transparent"
                }`}
              >
                {filter}
                <span
                  className={`text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded-full ${
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

        {/* Project cards */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => {
              const Card = item.link ? "a" : "div";
              const linkProps = item.link
                ? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <motion.div
                  key={item.title}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                >
                  <Card
                    {...(linkProps as Record<string, string>)}
                    className={`group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border bg-white dark:bg-white/[0.03] transition-all duration-300 ${
                      item.link
                        ? "border-slate-200 dark:border-white/[0.09] hover:border-[#0022FF]/30 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,34,255,0.10)] dark:hover:shadow-[0_12px_40px_rgba(0,198,255,0.07)] cursor-pointer shadow-sm dark:shadow-none"
                        : "border-slate-200/70 dark:border-white/[0.06] shadow-sm dark:shadow-none"
                    }`}
                  >
                    {/* Monogram tile */}
                    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#0022FF] to-[#00C6FF] flex items-center justify-center text-white font-extrabold text-base sm:text-lg tracking-tight shadow-[0_6px_20px_rgba(0,34,255,0.25)] transition-transform duration-300 group-hover:scale-105">
                      {monogram(item.title)}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-base sm:text-lg font-bold tracking-tight leading-snug transition-colors duration-300 ${
                          item.link
                            ? "text-slate-900 dark:text-white group-hover:text-[#0022FF] dark:group-hover:text-[#00C6FF]"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <span>{item.category}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                        <span className="font-mono tabular-nums shrink-0">{item.year}</span>
                      </div>
                    </div>

                    {/* Arrow / live tag */}
                    {item.link ? (
                      <span className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/[0.06] text-slate-400 dark:text-slate-500 group-hover:bg-[#00C6FF] group-hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10">
                        Case study
                      </span>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Count + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-slate-100 dark:border-white/10"
        >
          <p className="text-sm text-slate-400 dark:text-slate-500">
            <span className="font-bold text-slate-700 dark:text-white text-lg">
              {portfolioItems.length}+
            </span>{" "}
            projects delivered across Europe
          </p>
          <a
            href="https://www.deev.lu/website-projects"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#00C6FF] text-[#00C6FF] font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-[#00C6FF] hover:text-white hover:shadow-[0_0_30px_rgba(0,198,255,0.35)]"
          >
            See Full Portfolio
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
