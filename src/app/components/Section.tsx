import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Section primitive — brief §5.
 *
 * `tone` picks a surface step (elevation is a lighter surface, never a shadow),
 * `size` switches between a quiet section and one of the three big moments,
 * and content sits left on the grid by default. Centring is reserved.
 */

const TONE = ["bg-[var(--surface-0)]", "bg-[var(--surface-1)]", "bg-[var(--surface-2)]"] as const;

export function Section({
  index,
  eyebrow,
  tone = 0,
  size = "default",
  center = false,
  id,
  children,
}: {
  index?: string;
  eyebrow?: string;
  tone?: 0 | 1 | 2;
  size?: "default" | "lg";
  center?: boolean;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative ${TONE[tone]}`}
      style={{ paddingBlock: size === "lg" ? "var(--section-y-lg)" : "var(--section-y)" }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        {eyebrow && <Eyebrow index={index} center={center}>{eyebrow}</Eyebrow>}
        {children}
      </div>
    </section>
  );
}

/**
 * The numbered mono marker with its hairline lead-in. Kept from the previous
 * design — the brief calls it the one strong existing device.
 */
export function Eyebrow({
  index,
  center = false,
  children,
}: {
  index?: string;
  center?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-4 mb-10 ${center ? "justify-center" : ""}`}
    >
      <span className="h-px w-10 bg-[var(--line-strong)]" />
      <span
        className="eyebrow-mono uppercase text-[var(--text-low)]"
        style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
      >
        {index && <span className="text-[var(--metal)]">{index}</span>}
        {index && " / "}
        {children}
      </span>
    </motion.div>
  );
}

/** Headline at h2 scale, left by default. */
export function SectionTitle({
  children,
  center = false,
  className = "",
}: {
  children: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
      className={`text-[var(--text-hi)] font-medium ${center ? "text-center" : ""} ${className}`}
      style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em" }}
    >
      {children}
    </motion.h2>
  );
}

/** Body copy, held to a readable measure. */
export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.56, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`text-[var(--text-mid)] ${className}`}
      style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "48ch" }}
    >
      {children}
    </motion.p>
  );
}
