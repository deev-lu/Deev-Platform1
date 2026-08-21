import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";

const cases = [
  {
    title: "FinanceHub",
    client: "Luxembourg Fintech",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    tags: ["Website", "AI"],
    challenge: "Complex financial data needed to be accessible and engaging",
    solution: "Custom dashboard with AI-powered insights and real-time analytics",
    result: "165% increase in user engagement, 40% faster decision-making",
  },
  {
    title: "AutoFlow",
    client: "European Manufacturing",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tags: ["Automation", "AI"],
    challenge: "Manual processes causing delays and errors in production",
    solution: "End-to-end automation system with predictive maintenance",
    result: "80% reduction in manual tasks, €2M+ annual cost savings",
  },
  {
    title: "MedConnect",
    client: "Healthcare Network",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    tags: ["Website", "Custom Software"],
    challenge: "Patient booking system outdated and inefficient",
    solution: "Modern booking platform with automated reminders and telehealth",
    result: "3x booking capacity, 95% patient satisfaction score",
  },
  {
    title: "RetailAI",
    client: "E-commerce Platform",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
    tags: ["AI", "Automation"],
    challenge: "Customer support overwhelmed with repetitive inquiries",
    solution: "AI assistant handling 80% of common questions automatically",
    result: "70% reduction in support costs, 24/7 customer service",
  },
];

export default function CaseStudies() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f14] to-[#0a0a0f] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-medium text-white mb-6">
            Case Studies
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real projects, real results. See how we've helped businesses transform
            digitally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative rounded-lg overflow-hidden bg-white/5 border border-white/10 transition-all duration-500 hover:border-[#3CE7FC]/50 cursor-pointer">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />

                  {/* Tags */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-[2px] text-xs font-medium bg-[#3CE7FC]/20 border border-[#3CE7FC]/30 text-[#3CE7FC]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-medium text-white mb-2 transition-colors duration-300 group-hover:text-[#3CE7FC]">
                        {item.title}
                      </h3>
                      <p className="text-gray-400">{item.client}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 transition-all duration-300 group-hover:text-[#3CE7FC] group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  {/* Details - shown on hover */}
                  <div className="space-y-4 max-h-0 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-96 group-hover:opacity-100">
                    <div>
                      <div className="text-sm font-semibold text-[#3CE7FC] mb-1">
                        Challenge
                      </div>
                      <p className="text-sm text-gray-400">{item.challenge}</p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#3CE7FC] mb-1">
                        Solution
                      </div>
                      <p className="text-sm text-gray-400">{item.solution}</p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#3CE7FC] mb-1">
                        Result
                      </div>
                      <p className="text-sm text-white font-medium">{item.result}</p>
                    </div>
                  </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#3CE7FC]/0 via-[#3CE7FC]/0 to-[#3CE7FC]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
