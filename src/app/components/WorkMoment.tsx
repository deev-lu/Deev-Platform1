import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { getProject } from "../../lib/projects";

/**
 * One project at full scale.
 *
 * The first version bled the screenshot edge to edge with the title over it.
 * That does not work: a screenshot carries its own typography, so the client's
 * centred headline sat directly behind ours and printed the project name
 * twice. Recropping only moved the collision. A screenshot is a screenshot —
 * it belongs in a frame, with our type beside it rather than on top.
 *
 * The image is real client work we already ship. Nothing decorative is added.
 */

const FEATURED_SLUG = "aurora-experience";

export default function WorkMoment() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const project = getProject(FEATURED_SLUG);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  if (!project?.image) return null;

  const domain = project.link
    ? project.link.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")
    : "";

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--surface-1)] border-y border-[var(--line)]"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      {/* The one ambient glow the brief allows, behind the product. */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-10%",
          top: "10%",
          width: "70%",
          height: "70%",
          background: "radial-gradient(closest-side, var(--signal-dim), transparent)",
        }}
      />

      <div
        className="relative mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-14 items-center"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4"
        >
          <div className="flex items-center gap-4 mb-9">
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              In focus
            </span>
          </div>

          <h2
            className="text-[var(--text-hi)] font-medium mb-5"
            style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em" }}
          >
            {project.title}
          </h2>

          <p
            className="eyebrow-mono uppercase text-[var(--text-low)] mb-10"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {project.category} / {project.year}
          </p>

          <Link
            to={`/work/${project.slug}`}
            className="group inline-flex items-center gap-3 text-[var(--text-hi)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)" }}
          >
            See the project
            <span
              className="w-9 h-9 flex items-center justify-center border border-[var(--line)] group-hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
              style={{ borderRadius: "var(--radius-1)" }}
            >
              <ArrowUpRight className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </span>
          </Link>
        </motion.div>

        {/* The work, framed and large. */}
        <motion.div
          className="lg:col-span-8"
          style={reduce ? undefined : { y }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.56, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="border border-[var(--line)] bg-[var(--surface-2)] overflow-hidden">
            <div className="flex items-center gap-3 px-4 h-10 border-b border-[var(--line)] bg-[var(--surface-1)]">
              <span className="flex gap-1.5 shrink-0" aria-hidden="true">
                <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
                <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
                <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
              </span>
              <span
                className="eyebrow-mono lowercase text-[var(--text-low)] truncate"
                style={{ fontSize: "var(--t-label)", letterSpacing: "0.08em" }}
              >
                {domain}
              </span>
            </div>
            <img
              src={project.image}
              alt={`${project.title}, ${project.category}`}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
