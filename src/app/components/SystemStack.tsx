import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import NoiseOverlay from "./NoiseOverlay";
import { useIsMobile } from "../../lib/useIsMobile";

/**
 * §6F — System layers.
 *
 * Three isometric hairline planes light up in turn as the section is read.
 *
 * Three things were wrong before and are fixed here:
 *   1. Plane and row colours were interpolated between hardcoded dark values,
 *      so on a white ground the inactive planes and the dimmed rows were
 *      invisible. State now drives class names and every colour is a token.
 *   2. The pin ran for 300vh — three screens of scrolling for three lines of
 *      copy, which reads as the page having stalled. It is 190vh now.
 *   3. The planes were `hidden lg:block`, so a phone got the full 190vh pin
 *      with nothing at all to look at: two screens of dead scroll around
 *      forty-seven words. Phones now get the diagram at a size that fits the
 *      gutter, no pin, and the layers still light in turn — driven by the
 *      section's own scroll progress rather than by a sticky viewport.
 */

const LAYERS = [
  {
    n: "01",
    name: "Interface",
    desc: "The websites and products your customers touch: fast, precise, engineered to convert.",
  },
  {
    n: "02",
    name: "Intelligence",
    desc: "AI agents and automations working inside your operations: qualifying, answering, executing.",
  },
  {
    n: "03",
    name: "Infrastructure",
    desc: "EU-hosted, GDPR-native foundations built to scale without drama.",
  },
];

export default function SystemStack() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Pinned: progress runs start-to-end of the tall section.
  // Unpinned (phones): progress runs as the section crosses the viewport, so
  // the layers still light in turn without stealing two screens of scroll.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: isMobile ? ["start 85%", "end 40%"] : ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
    setActive((prev) => (prev === i ? prev : i));
  });

  const body = (allActive: boolean, compact: boolean) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div
        className={compact ? "relative h-[240px] lg:hidden" : "relative h-[380px] hidden lg:block"}
        style={{ perspective: 1200 }}
        aria-hidden="true"
      >
        {LAYERS.map((_, i) => (
          <Plane key={i} i={i} on={allActive || active === i} size={compact ? 196 : 300} />
        ))}
      </div>

      <div>
        <Header />
        <ul className="mt-10 lg:mt-12">
          {LAYERS.map((l, i) => (
            <Row key={l.n} layer={l} on={allActive || active === i} />
          ))}
        </ul>
      </div>
    </div>
  );

  const shell = (children: React.ReactNode) => (
    <section className="relative bg-[var(--surface-0)] border-y border-[var(--line)]">
      <NoiseOverlay opacity={0.035} />
      <div
        className="relative mx-auto"
        style={{
          maxWidth: "var(--container)",
          paddingInline: "var(--gutter)",
          paddingBlock: "var(--section-y)",
        }}
      >
        {children}
      </div>
    </section>
  );

  // Reduced motion: no pin, no transforms, everything active.
  if (reduce) return shell(body(true, false));

  // Phones: no pin. The diagram renders at gutter width and the layers light
  // in turn from the section's own progress across the viewport.
  if (isMobile) {
    return (
      <div ref={ref}>
        {shell(
          <>
            {body(false, true)}
          </>,
        )}
      </div>
    );
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative bg-[var(--surface-0)] border-y border-[var(--line)]"
      style={{ height: "190vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <NoiseOverlay opacity={0.035} />
        <div
          className="relative w-full mx-auto"
          style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
        >
          {body(false, false)}
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <>
      <div className="flex items-center gap-4 mb-8 lg:mb-10">
        <span className="h-px w-10 bg-[var(--line-strong)]" />
        <span
          className="eyebrow-mono uppercase text-[var(--text-low)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          <span className="text-[var(--metal)]">04</span> / How it runs
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

/** rotateX/rotateZ must be motion values — motion composes `transform` from
 *  its own style keys and would overwrite a raw transform string. */
function Plane({ i, on, size }: { i: number; on: boolean; size: number }) {
  // The rotated square is size*√2 wide, so 196 fits inside a 390px gutter.
  const step = size * 0.28;
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 border"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        // Interface on top, infrastructure underneath — the stack should read
        // the way the system is actually built.
        marginTop: -size / 2 + (i - 1) * step,
        rotateX: 58,
        rotateZ: 45,
        borderColor: on ? "var(--signal)" : "var(--line-strong)",
        background: on ? "var(--signal-dim)" : "var(--surface-2)",
        transition: "border-color 320ms var(--ease-out), background 320ms var(--ease-out)",
      }}
      animate={{ y: on ? -12 : 0, opacity: on ? 1 : 0.55 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

function Row({ layer, on }: { layer: (typeof LAYERS)[number]; on: boolean }) {
  return (
    <li className="relative grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-8 py-6 lg:py-7 border-t border-[var(--line)]">
      <span
        className="absolute left-0 top-0 h-px w-16 transition-colors duration-[var(--dur-2)]"
        style={{ background: on ? "var(--signal)" : "transparent" }}
      />
      <span
        className="eyebrow-mono text-[var(--metal)] pt-1"
        style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
      >
        {layer.n}
      </span>
      <div>
        <h3
          className={`font-medium mb-2 transition-colors duration-[var(--dur-2)] ${
            on ? "text-[var(--text-hi)]" : "text-[var(--text-low)]"
          }`}
          style={{ fontSize: "var(--t-h3)", letterSpacing: "-0.01em" }}
        >
          {layer.name}
        </h3>
        <p
          className={`transition-colors duration-[var(--dur-2)] ${
            on ? "text-[var(--text-mid)]" : "text-[var(--text-low)]"
          }`}
          style={{ fontSize: "var(--t-body)", lineHeight: 1.55, maxWidth: "48ch" }}
        >
          {layer.desc}
        </p>
      </div>
    </li>
  );
}
