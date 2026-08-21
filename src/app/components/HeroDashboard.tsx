import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles, TrendingUp, ArrowUpRight, Bot } from "lucide-react";
import CountUp from "./CountUp";
import { useIsMobile } from "../../lib/useIsMobile";

const PROMPTS = [
  "Qualify this inbound lead and draft a reply",
  "Summarise last week's conversion data",
  "Generate a landing-page variant to A/B test",
];

const RESPONSES = [
  "Lead scored 92/100 — high intent. Drafted a tailored reply and booked a follow-up call.",
  "Conversions up 38% WoW. Top driver: paid search. Reallocating budget automatically.",
  "New variant shipped to 50% of traffic. Predicted +14% conversion from prior tests.",
];

function useTypewriter(reduce: boolean) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "clearing">("typing");

  useEffect(() => {
    if (reduce) {
      setText(RESPONSES[0]);
      return;
    }
    const full = RESPONSES[idx];
    let t: number;

    if (phase === "typing") {
      if (text.length < full.length) {
        t = window.setTimeout(() => setText(full.slice(0, text.length + 1)), 26);
      } else {
        t = window.setTimeout(() => setPhase("holding"), 2400);
      }
    } else if (phase === "holding") {
      t = window.setTimeout(() => setPhase("clearing"), 200);
    } else {
      t = window.setTimeout(() => {
        setText("");
        setIdx((i) => (i + 1) % RESPONSES.length);
        setPhase("typing");
      }, 350);
    }
    return () => clearTimeout(t);
  }, [text, phase, idx, reduce]);

  return { idx, text, done: phase !== "typing" || text.length === RESPONSES[idx].length };
}

function MetricBars({ reduce }: { reduce: boolean }) {
  const heights = [38, 52, 44, 66, 58, 80, 72];
  return (
    <div className="flex items-end gap-1.5 h-16 mt-3">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-[#2563F6] to-[#3CE7FC]"
          initial={{ height: reduce ? `${h}%` : "8%", opacity: 0.5 }}
          whileInView={{ height: `${h}%`, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

export default function HeroDashboard() {
  // Treat mobile as reduced-motion: no per-frame typewriter re-renders, no bar animation
  const reduce = (useReducedMotion() ?? false) || useIsMobile();
  const { idx, text, done } = useTypewriter(reduce);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
    >
      {/* Glow under the panel */}

      <div className="glass-edge relative rounded-lg sm:rounded-lg border border-white/[0.14] bg-[#0b0b14]/85 overflow-hidden">
        {/* Window top bar */}
        <div className="flex items-center gap-2 px-4 sm:px-5 h-11 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <div className="flex-1 flex justify-center">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#3CE7FC]" />
              deev · ai engine
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-[2px] bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            LIVE
          </span>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Left — AI chat */}
          <div className="md:col-span-3 p-5 sm:p-6 border-b md:border-b-0 md:border-r border-white/[0.07] min-h-[230px] text-left">
            {/* User prompt */}
            <div className="flex justify-end mb-4">
              <div className="max-w-[80%] rounded-lg rounded-tr-sm bg-white/[0.06] border border-white/[0.08] px-3.5 py-2.5">
                <p className="text-[13px] text-slate-200 leading-snug">{PROMPTS[idx]}</p>
              </div>
            </div>
            {/* AI response */}
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[#3CE7FC] to-[#2563F6] flex items-center justify-center mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-gradient-to-br from-[#2563F6]/15 to-[#3CE7FC]/[0.06] border border-[#3CE7FC]/20 px-3.5 py-2.5">
                <p className="text-[13px] text-slate-100 leading-relaxed min-h-[2.6em]">
                  {text}
                  {!done && (
                    <span className="inline-block w-[2px] h-[1em] -mb-[2px] ml-0.5 bg-[#3CE7FC] animate-pulse" />
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right — live metrics */}
          <div className="md:col-span-2 p-5 sm:p-6 flex flex-col gap-4 bg-white/[0.015]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500">
                Live performance
              </span>
              <TrendingUp className="w-4 h-4 text-[#3CE7FC]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-white/[0.03] border border-white/[0.07] p-3">
                <div className="text-[10px] text-slate-500 font-medium mb-1">Conversions</div>
                <div className="flex items-end gap-1">
                  <CountUp value="38%" className="text-lg font-extrabold text-white" />
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                </div>
              </div>
              <div className="rounded-md bg-white/[0.03] border border-white/[0.07] p-3">
                <div className="text-[10px] text-slate-500 font-medium mb-1">Leads / mo</div>
                <CountUp value="1.2k" className="text-lg font-extrabold text-white" />
              </div>
            </div>

            <div className="rounded-md bg-white/[0.03] border border-white/[0.07] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">Pipeline value</span>
                <CountUp value="100%" className="text-xs font-medium text-[#3CE7FC]" />
              </div>
              <MetricBars reduce={reduce} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
