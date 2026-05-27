import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Brain, Database, Cpu, Globe, Activity, Code2, Server, Workflow } from "lucide-react";

export default function AIFeatures3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const nodes = [
    { icon: Globe, label: "Web App", sub: "Next.js • React", color: "border-slate-700/50", iconColor: "text-slate-300", bg: "bg-slate-900/80" },
    { icon: Server, label: "Cloud Infra", sub: "AWS • Scaling", color: "border-orange-500/50", iconColor: "text-orange-400", bg: "bg-orange-900/30" },
    { icon: Workflow, label: "Workflows", sub: "Logic • APIs", color: "border-[#00C6FF]/50", iconColor: "text-[#00C6FF]", bg: "bg-[#00C6FF]/10" },
    { icon: Database, label: "Knowledge Base", sub: "Vector DB", color: "border-[#0022FF]/50", iconColor: "text-[#0022FF]", bg: "bg-[#0022FF]/20" },
  ];

  const stats = [
    { icon: Cpu, label: "CPU", value: "12%", valueColor: "text-white" },
    { icon: Activity, label: "Latency", value: "45ms", valueColor: "text-white" },
    { icon: Globe, label: "CDN", value: "Active", valueColor: "text-green-400" },
    { icon: Code2, label: "RPS", value: "2,450", valueColor: "text-white" },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-10 mb-16 md:mt-20 md:mb-32 px-0 md:px-4">

      {/* ─── MOBILE LAYOUT (hidden on md+) ─── */}
      <div className="md:hidden">
        <div className="relative rounded-3xl bg-[#050508]/90 border border-white/10 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,198,255,0.1)] overflow-hidden mx-4">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="ml-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
                DEEV_AI_CORE_V2.0
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20 text-[10px] font-bold uppercase tracking-wider">
              <Activity className="w-3 h-3" /> Live
            </div>
          </div>

          <div className="p-5">
            {/* Brain center node */}
            <div className="flex flex-col items-center mb-6">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#0022FF]/40 border-[3px] border-[#00C6FF] flex items-center justify-center shadow-[0_0_50px_rgba(0,198,255,0.4)] relative">
                  <div className="absolute inset-0 rounded-full bg-[#00C6FF]/20 animate-ping opacity-20" />
                  <Brain className="w-11 h-11 text-white" />
                </div>
                <div className="mt-3 text-center bg-[#050508]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                  <div className="text-white font-bold text-sm">AI Core Engine</div>
                  <div className="text-[#00C6FF] font-mono text-[10px] mt-0.5">Python • ML Models</div>
                </div>
              </motion.div>

              {/* Vertical connector line */}
              <div className="w-px h-5 bg-gradient-to-b from-[#00C6FF]/50 to-transparent mt-3" />
            </div>

            {/* 2×2 node grid */}
            <div className="grid grid-cols-2 gap-3">
              {nodes.map((node, i) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`flex flex-col items-center p-3 rounded-2xl ${node.bg} border ${node.color} backdrop-blur-md`}
                  >
                    <Icon className={`w-6 h-6 ${node.iconColor} mb-2`} />
                    <div className="text-white font-bold text-xs text-center leading-tight">{node.label}</div>
                    <div className={`${node.iconColor} font-mono text-[9px] mt-0.5 text-center opacity-80`}>{node.sub}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Animated data pulse line */}
            <div className="relative h-px bg-white/5 my-5 overflow-hidden rounded-full">
              <motion.div
                className="absolute top-0 h-full w-16 bg-gradient-to-r from-transparent via-[#00C6FF] to-transparent"
                animate={{ left: ["-10%", "110%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Stats 2×2 */}
            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-400 text-xs">{stat.label}:</span>
                    <span className={`${stat.valueColor} text-xs font-bold`}>{stat.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT (hidden below md) ─── */}
      <div className="hidden md:block">
        <div className="relative w-full h-[600px] lg:h-[750px] flex items-center justify-center perspective-1000">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-[#00C6FF]/20 rounded-full blur-[150px] pointer-events-none" />

          <motion.div
            initial={{ rotateX: 20, rotateY: -10, scale: 0.9, opacity: 0 }}
            whileInView={{ rotateX: 10, rotateY: -5, scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative w-full h-full rounded-[40px] bg-[#050508]/90 border border-white/10 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,198,255,0.15)] flex flex-col p-8 lg:p-12 overflow-hidden preserve-3d"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0zOSAzOUgwVjFoMzl2MzhoLTF6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

            <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8 pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="ml-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                    DEEV_AI_CORE_V2.0
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20 text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4" /> Live Architecture
                </div>
              </div>

              {/* Cross layout */}
              <div className="flex-1 relative w-full h-full flex items-center justify-center pointer-events-auto">
                {/* Lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-[80%] h-px bg-white/10 absolute top-1/2 -translate-y-1/2" />
                  <div className="h-full max-h-[80%] w-px bg-white/10 absolute left-1/2 -translate-x-1/2" />
                  <motion.div className="absolute w-2 h-2 rounded-full bg-[#00C6FF] top-1/2 -translate-y-1/2 shadow-[0_0_10px_#00C6FF]" animate={{ left: ["10%", "50%", "90%"], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                  <motion.div className="absolute w-2 h-2 rounded-full bg-[#0022FF] top-1/2 -translate-y-1/2 shadow-[0_0_10px_#0022FF]" animate={{ left: ["90%", "50%", "10%"], opacity: [0, 1, 0] }} transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "linear" }} />
                  <motion.div className="absolute w-2 h-2 rounded-full bg-[#00C6FF] left-1/2 -translate-x-1/2 shadow-[0_0_10px_#00C6FF]" animate={{ top: ["10%", "50%", "90%"], opacity: [0, 1, 0] }} transition={{ duration: 3, delay: 0.7, repeat: Infinity, ease: "linear" }} />
                  <motion.div className="absolute w-2 h-2 rounded-full bg-[#0022FF] left-1/2 -translate-x-1/2 shadow-[0_0_10px_#0022FF]" animate={{ top: ["90%", "50%", "10%"], opacity: [0, 1, 0] }} transition={{ duration: 3, delay: 2.2, repeat: Infinity, ease: "linear" }} />
                </div>

                {/* Center Brain */}
                <motion.div className="absolute z-30 flex flex-col items-center" animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-[#0022FF]/40 border-[4px] border-[#00C6FF] flex items-center justify-center shadow-[0_0_80px_rgba(0,198,255,0.5)] relative">
                    <div className="absolute inset-0 rounded-full bg-[#00C6FF]/30 animate-ping opacity-20" />
                    <Brain className="w-14 h-14 lg:w-16 lg:h-16 text-white" />
                  </div>
                  <div className="mt-4 text-center bg-[#050508]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 shadow-xl">
                    <div className="text-white font-bold text-base">AI Core Engine</div>
                    <div className="text-[#00C6FF] font-mono text-xs mt-1">Python • ML Models</div>
                  </div>
                </motion.div>

                {/* Left: Web App */}
                <motion.div className="absolute left-[5%] top-1/2 -translate-y-1/2 z-20 flex flex-col items-center" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-md flex items-center justify-center shadow-xl">
                    <Globe className="w-8 h-8 lg:w-10 lg:h-10 text-slate-300" />
                  </div>
                  <div className="mt-3 text-center bg-[#050508]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                    <div className="text-white font-bold text-sm">Web App</div>
                    <div className="text-slate-400 font-mono text-[10px] mt-0.5">Next.js • React</div>
                  </div>
                </motion.div>

                {/* Right: Cloud Infra */}
                <motion.div className="absolute right-[5%] top-1/2 -translate-y-1/2 z-20 flex flex-col items-center" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-orange-900/30 border border-orange-500/50 backdrop-blur-md flex items-center justify-center shadow-xl">
                    <Server className="w-8 h-8 lg:w-10 lg:h-10 text-orange-400" />
                  </div>
                  <div className="mt-3 text-center bg-[#050508]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                    <div className="text-white font-bold text-sm">Cloud Infra</div>
                    <div className="text-orange-400 font-mono text-[10px] mt-0.5">AWS • Scaling</div>
                  </div>
                </motion.div>

                {/* Top: Workflows */}
                <motion.div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center" initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-[#00C6FF]/10 border border-[#00C6FF]/50 backdrop-blur-md flex items-center justify-center shadow-xl">
                    <Workflow className="w-8 h-8 lg:w-10 lg:h-10 text-[#00C6FF]" />
                  </div>
                  <div className="mt-3 text-center bg-[#050508]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 order-first mb-3">
                    <div className="text-white font-bold text-sm">Workflows</div>
                    <div className="text-[#00C6FF] font-mono text-[10px] mt-0.5">Logic • APIs</div>
                  </div>
                </motion.div>

                {/* Bottom: Knowledge Base */}
                <motion.div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}>
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-[#0022FF]/20 border border-[#0022FF]/50 backdrop-blur-md flex items-center justify-center shadow-xl">
                    <Database className="w-8 h-8 lg:w-10 lg:h-10 text-[#0022FF]" />
                  </div>
                  <div className="mt-3 text-center bg-[#050508]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                    <div className="text-white font-bold text-sm">Knowledge Base</div>
                    <div className="text-[#0022FF] font-mono text-[10px] mt-0.5">Vector DB • Retrieval</div>
                  </div>
                </motion.div>
              </div>

              {/* Stats row */}
              <div className="mt-auto pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4 text-sm font-mono z-30 bg-[#050508]/80 backdrop-blur-xl p-4 rounded-2xl pointer-events-auto shadow-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400"><Cpu className="w-4 h-4" /> CPU Load: <span className="text-white font-semibold">12%</span></div>
                <div className="flex items-center gap-2 text-slate-400"><Activity className="w-4 h-4" /> Inference Time: <span className="text-white font-semibold">45ms</span></div>
                <div className="flex items-center gap-2 text-slate-400"><Globe className="w-4 h-4" /> Global CDN: <span className="text-green-400 font-semibold">Active</span></div>
                <div className="flex items-center gap-2 text-slate-400"><Code2 className="w-4 h-4" /> Web Requests: <span className="text-white font-semibold">2,450/sec</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
