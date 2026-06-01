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

      <div className="max-w-5xl mx-auto px-6 relative z-10">
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

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={activeFilter === filter ? { background: "linear-gradient(135deg, #00C6FF, #0044ff)" } : {}}
            className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === filter
                  ? "text-white shadow-[0_0_30px_rgba(0,198,255,0.35)]"
                  : "border border-slate-200 dark:border-white/[0.12] text-slate-500 dark:text-slate-400 hover:border-[#0022FF] hover:text-[#0022FF] dark:hover:border-white/25 dark:hover:text-white bg-transparent"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Client roster list */}
        <motion.div layout className="relative">
          {/* Top border */}
          <div className="h-px bg-slate-200 dark:bg-white/10 mb-0" />

          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => {
              const Row = item.link ? "a" : "div";
              const linkProps = item.link
                ? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
                : {};

              return (
                <motion.div
                  key={item.title}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <Row
                    {...(linkProps as any)}
                    className={`group flex items-center justify-between gap-4 py-5 border-b border-slate-100 dark:border-white/8 transition-all duration-300 ${
                      item.link
                        ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.03] -mx-4 px-4 rounded-xl"
                        : "-mx-4 px-4"
                    }`}
                  >
                    {/* Index + name */}
                    <div className="flex items-center gap-5 min-w-0">
                      <span className="hidden sm:block text-xs font-mono text-slate-300 dark:text-white/25 w-6 shrink-0 tabular-nums font-bold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={`text-lg sm:text-xl font-bold tracking-tight truncate transition-colors duration-300 ${
                          item.link
                            ? "text-slate-900 dark:text-white group-hover:text-[#00C6FF]"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Right side: category + year + arrow */}
                    <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                      <span className="hidden md:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-500 dark:text-slate-300 uppercase tracking-wider border border-slate-200 dark:border-white/[0.14]">
                        {item.category}
                      </span>
                      <span className="text-sm text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                        {item.year}
                      </span>
                      {item.link ? (
                        <span className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/8 text-slate-400 dark:text-slate-500 group-hover:bg-[#00C6FF] group-hover:text-white transition-all duration-300 shrink-0">
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      ) : (
                        <span className="w-8 h-8 shrink-0" />
                      )}
                    </div>
                  </Row>
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
