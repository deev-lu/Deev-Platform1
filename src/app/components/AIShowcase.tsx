import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, Users, Bot, Workflow, Sparkles } from "lucide-react";
import AIFeatures3D from "./AIFeatures3D";

const useCases = [
  {
    icon: MessageSquare,
    title: "Intelligent Lead Qualification",
    description:
      "Enterprise-grade AI agents that engage prospects in real-time, qualifying high-value leads and seamlessly routing them to your closing team.",
    features: ["Natural language understanding", "CRM integration", "24/7 engagement"],
  },
  {
    icon: Workflow,
    title: "Autonomous Workflows",
    description:
      "End-to-end operational automation. We connect your entire tech stack to eliminate manual data entry and accelerate project delivery.",
    features: ["Cross-platform sync", "Custom logic rules", "Real-time updates"],
  },
  {
    icon: Users,
    title: "Hyper-Personalization",
    description:
      "Deploy AI models trained on your proprietary data to deliver tailored experiences that drive massive conversion rates for premium offerings.",
    features: ["Predictive analytics", "Dynamic content", "User behavior tracking"],
  },
  {
    icon: Bot,
    title: "Internal Co-Pilots",
    description:
      "Custom AI assistants built exclusively for your team, securely analyzing your internal documents to provide instant, accurate insights.",
    features: ["Secure data handling", "Document processing", "Instant retrieval"],
  },
];

export default function AIShowcase() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, #0b0b16 0%, #07070d 45%, #050509 100%)",
      }}
    >
      {/* Premium Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3CE7FC]/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      {/* Subtle dot grid for depth */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-white/[0.06] border border-white/[0.12] text-xs font-medium uppercase tracking-[0.2em] text-slate-400 mb-8"
          >
            <span className="w-1 h-1 rounded-full bg-[#3CE7FC] animate-pulse" />
            Next-Gen Intelligence
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
            AI that drives{" "}
            <span className="text-[var(--signal)] animate-gradient-x">
              Enterprise Growth
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            We build sophisticated AI systems for high-ticket businesses. 
            Automate your operations, scale your output, and deliver unparalleled client experiences.
          </p>
        </motion.div>

        {/* The new impressive 3D AI Features visualization */}
        <AIFeatures3D />

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 sm:mb-20 relative z-20 mt-10 sm:mt-20">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onMouseEnter={() => setActiveCard(index)}
                className="group relative cursor-pointer"
              >
                <div
                  className={`relative p-6 md:p-10 rounded-lg border transition-all duration-700 h-full ${ activeCard === index ? "bg-gradient-to-br from-[#2563F6]/40 to-black border-[#3CE7FC]/50 " : "bg-white/[0.04] border-white/[0.10] hover:border-white/25" }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-lg mb-5 md:mb-8 flex items-center justify-center transition-all duration-500 ${ activeCard === index ? "bg-[#3CE7FC] " : "bg-white/5 group-hover:bg-white/10" }`}
                  >
                    <Icon
                      className={`w-6 h-6 md:w-8 md:h-8 transition-colors duration-300 ${ activeCard === index ? "text-white" : "text-gray-400" }`}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-medium text-white mb-3 md:mb-4 tracking-tight">
                    {useCase.title}
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base mb-5 md:mb-8 leading-relaxed">
                    {useCase.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-4 mt-auto">
                    {useCase.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-base text-gray-200 font-medium"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${ activeCard === index ? "bg-[#3CE7FC]" : "bg-gray-600" } transition-colors duration-300`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Animated border glow effect */}
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br from-[#3CE7FC]/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 pointer-events-none ${ activeCard === index ? "opacity-100" : "" }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
