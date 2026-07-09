import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

interface MetricCardProps {
  title: string;
  value: string;
  growth: string;
  data: number[];
  delay?: number;
  chartType?: "area" | "bar";
}

function MetricCard({
  title,
  value,
  growth,
  data,
  delay = 0,
  chartType = "area",
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const finalValue = parseInt(value.replace(/[^0-9]/g, ""));
      const duration = 2000;
      const steps = 60;
      const increment = finalValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          const formatted = Math.floor(current).toString();
          setDisplayValue(
            value.includes("%")
              ? `${formatted}%`
              : value.includes("+")
              ? `+${formatted}%`
              : formatted
          );
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  const chartData = data.map((value, index) => ({ name: index, value }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
      transition={{ duration: 0.6, delay }}
      className="group relative rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] overflow-hidden transition-all duration-300 hover:border-[#0022FF]/20 dark:hover:border-white/[0.15] hover:shadow-[0_8px_30px_rgba(0,34,255,0.07)] dark:hover:shadow-none hover:-translate-y-1 shadow-sm dark:shadow-none"
    >
      <div className="h-[2px] w-full bg-gradient-to-r from-[#00C6FF] to-[#0022FF]" />
      <div className="p-6">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
          {title}
        </div>
        <div className="text-4xl font-extrabold bg-gradient-to-r from-[#00C6FF] to-[#60a5ff] bg-clip-text text-transparent tracking-tight">
          {displayValue}
        </div>
        <div className="text-xs text-emerald-400 mt-1.5 font-semibold">{growth}</div>
      </div>

      <div className="h-20 -mx-2">
        <ResponsiveContainer width="100%" height={80} minWidth={100} minHeight={80}>
          {chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C6FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C6FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#00C6FF"
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
                animationDuration={2000}
                animationBegin={delay * 1000}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Bar
                dataKey="value"
                fill="#00C6FF"
                radius={[4, 4, 0, 0]}
                animationDuration={2000}
                animationBegin={delay * 1000}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      </div>
    </motion.div>
  );
}

export default function GrowingMetrics() {
  const metrics = [
    {
      title: "Conversion Rate",
      value: "+284%",
      growth: "↑ 42% this month",
      data: [20, 35, 45, 60, 75, 95, 120, 150],
      chartType: "area" as const,
    },
    {
      title: "ROI",
      value: "580%",
      growth: "↑ Average across clients",
      data: [100, 180, 240, 320, 420, 480, 550, 580],
      chartType: "area" as const,
    },
    {
      title: "Client Growth",
      value: "+150%",
      growth: "↑ Year over year",
      data: [30, 45, 55, 70, 90, 110, 130, 150],
      chartType: "bar" as const,
    },
    {
      title: "Cost Reduction",
      value: "65%",
      growth: "↓ Average savings",
      data: [10, 20, 30, 40, 48, 55, 62, 65],
      chartType: "bar" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} delay={index * 0.1} />
      ))}
    </div>
  );
}
