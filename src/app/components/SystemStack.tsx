import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import NoiseOverlay from "./NoiseOverlay";

/**
 * §6F — System layers. Full-bleed moment #2.
 *
 * The section pins for ~200vh. Three isometric hairline planes sit on the
 * left; as the visitor scrolls, each plane in turn illuminates and rises 12px
 * while its text block on the right becomes active and the other two fall
 * back to --text-low. No other content on screen.
 *
 * prefers-reduced-motion: no pin, no transforms — a static three-row layout
 * with every layer active, which still reads as designed.
 *
 * Copy unchanged.
 */

const LAYERS = [
  {
    n: "01",
    name: "Interface",
    desc: "The websites and products your customers touch — fast, precise, engineered to convert.",
  },
  {
    n: "02",
    name: "Intelligence",
    desc: "AI agents and automations working inside your operations — qualifying, answering, executing.",
  },
  {
    n: "03",
    name: "Infrastructure",
    desc: "EU-hosted, GDPR-native foundations built to scale without drama.",
  },
];

export default function SystemStack() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // 0 → 1 across the pin maps to layer 0, 1, 2
  const activeIndex = useTransform(scrollYProgress, (p) =>
    p < 0.34 ? 0 : p < 0.67 ? 1 : 2
  );

  // Reduced motion: a plain three-row layout, everything active.
  if (reduce) {
    return (
      <section className="relative bg-[var(--surface-0)] border-y border-[var(--line)]">
        <NoiseOverlay opacity={0.035} />
        <div
          className="relative mx-auto"
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)", paddingBlock: "var(--section-y)" }}
        >
          <Header />
          <ul className="mt-16 border-t border-[var(--line)]">
            {LAYERS.map((l) => (
              <li key={l.n} className="grid grid-cols-[auto_1fr] gap-x-8 py-8 border-b border-[var(--line)]">
                <span className="eyebrow-mono text-[var(--metal)] pt-1" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                  {l.n}
                </span>
                <div>
                  <h3 className="text-[var(--text-hi)] font-medium mb-2" style={{ fontSize: "var(--t-h3)" }}>
                    {l.name}
                  </h3>
                  <p className="text-[var(--text-mid)]" style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "56ch" }}>
                    {l.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative bg-[var(--surface-0)] border-y border-[var(--line)]" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <NoiseOverlay opacity={0.035} />
        <div
          className="relative w-full mx-auto"
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Planes */}
            <div className="relative h-[420px] hidden lg:block" style={{ perspective: 1200 }}>
              {LAYERS.map((_, i) => (
                <ActivePlane key={i} i={i} activeIndex={activeIndex} reduce={reduce} />
              ))}
            </div>

            {/* Copy */}
            <div>
              <Header />
              <ul className="mt-12">
                {LAYERS.map((l, i) => (
                  <ActiveRow key={l.n} layer={l} i={i} activeIndex={activeIndex} />
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <>
      <div className="flex items-center gap-4 mb-10">
        <span className="h-px w-10 bg-[var(--line-strong)]" />
        <span
          className="eyebrow-mono uppercase text-[var(--text-low)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          <span className="text-[var(--metal)]">02</span> / How it runs
        </span>
      </div>
      <h2
        className="text-[var(--text-hi)] font-medium"
        style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em", maxWidth: "16ch" }}
      >
        One system. Every layer engineered.
      </h2>
    </>
  );
}

/** Subscribes to the pinned scroll position without re-rendering the section. */
function ActivePlane({
  i,
  activeIndex,
  reduce,
}: {
  i: number;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
  reduce: boolean | null;
}) {
  const isActive = useTransform(activeIndex, (v) => (v === i ? 1 : 0));
  const opacity = useTransform(isActive, [0, 1], [0.45, 1]);
  const y = useTransform(isActive, [0, 1], [0, -12]);
  const borderColor = useTransform(isActive, [0, 1], ["rgba(255,255,255,0.18)", "#2e6bff"]);
  const background = useTransform(isActive, [0, 1], ["rgba(255,255,255,0.015)", "rgba(46,107,255,0.10)"]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: 300,
        height: 300,
        marginLeft: -150,
        marginTop: -150 + (1 - i) * 84,
        // These must be motion values, not a raw `transform` string: motion
        // composes transform from its own style keys and would overwrite it,
        // flattening the isometric planes into stacked rectangles.
        rotateX: 58,
        rotateZ: 45,
        opacity: reduce ? 1 : opacity,
        y: reduce ? 0 : y,
      }}
    >
      <motion.div className="w-full h-full border" style={{ borderColor, background }} />
    </motion.div>
  );
}

function ActiveRow({
  layer,
  i,
  activeIndex,
}: {
  layer: (typeof LAYERS)[number];
  i: number;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
}) {
  const isActive = useTransform(activeIndex, (v) => (v === i ? 1 : 0));
  const titleColor = useTransform(isActive, [0, 1], ["#5e656e", "#f2f4f6"]);
  const bodyColor = useTransform(isActive, [0, 1], ["#3a4048", "#8b929b"]);
  const ruleColor = useTransform(isActive, [0, 1], ["rgba(255,255,255,0.10)", "#2e6bff"]);

  return (
    <li className="relative grid grid-cols-[auto_1fr] gap-x-8 py-7 border-t border-[var(--line)]">
      <motion.span className="absolute left-0 top-0 h-px w-16" style={{ background: ruleColor }} />
      <span
        className="eyebrow-mono text-[var(--metal)] pt-1"
        style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
      >
        {layer.n}
      </span>
      <div>
        <motion.h3
          className="font-medium mb-2"
          style={{ fontSize: "var(--t-h3)", color: titleColor, letterSpacing: "-0.01em" }}
        >
          {layer.name}
        </motion.h3>
        <motion.p style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "48ch", color: bodyColor }}>
          {layer.desc}
        </motion.p>
      </div>
    </li>
  );
}
