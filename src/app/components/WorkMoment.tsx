import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "../../lib/projects";
import { useIsMobile } from "../../lib/useIsMobile";

/**
 * The work at full scale, one project at a time, rotating every ten seconds.
 *
 * The first version bled the screenshot edge to edge with the title over it.
 * That does not work: a screenshot carries its own typography, so the client's
 * centred headline sat directly behind ours and printed the project name
 * twice. Recropping only moved the collision. A screenshot is a screenshot:
 * it belongs in a frame, with our type beside it rather than on top.
 *
 * Rotation rules:
 *   - Only projects we actually have a screenshot for are in the cycle. The
 *     other eight would rotate an empty frame into view.
 *   - The timer runs only while the section is on screen and the tab is
 *     visible, so a page left open in a background tab is not repainting a
 *     600px image every ten seconds.
 *   - The next image is preloaded during the current slot, so the crossfade
 *     never lands on a blank frame.
 *   - prefers-reduced-motion stops the rotation entirely. The ticks still
 *     work, so the whole set is reachable by hand.
 *   - The ten-second progress fill is a continuous animation, so it is off on
 *     mobile per the performance rules. The rotation itself, a single opacity
 *     crossfade, stays.
 */

const ROTATION_MS = 10_000;

/** Every screenshot in the cycle is 1000x583, so the frame never resizes. */
const FRAME_RATIO = "1000 / 583";

const FEATURED = PROJECTS.filter((p) => p.image);

/** The longest strings in the set. They size the invisible block that reserves
 *  room for the title, so the link and the ticks below it never move when a
 *  three-line name is replaced by a one-line name. */
const LONGEST_TITLE = FEATURED.reduce((a, p) => (p.title.length > a.length ? p.title : a), "");
const LONGEST_META = FEATURED.reduce(
  (a, p) => {
    const m = `${p.category} / ${p.year}`;
    return m.length > a.length ? m : a;
  },
  "",
);

const domainOf = (link?: string) =>
  link ? link.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") : "";

const pad = (n: number) => String(n).padStart(2, "0");

export default function WorkMoment() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px" });

  const [index, setIndex] = useState(0);
  // Bumped on every change of project. Keys the progress fill so it remounts
  // and restarts in step with the timer, including after a manual pick.
  const [cycle, setCycle] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  const running = !reduce && inView && tabVisible && FEATURED.length > 1;

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % FEATURED.length);
      setCycle((c) => c + 1);
    }, ROTATION_MS);
    return () => window.clearTimeout(t);
  }, [running, index, cycle]);

  // Warm the next frame while the current one is being read.
  useEffect(() => {
    const next = FEATURED[(index + 1) % FEATURED.length];
    if (!next?.image) return;
    const img = new Image();
    img.src = next.image;
  }, [index]);

  if (FEATURED.length === 0) return null;

  const project = FEATURED[index];
  const select = (i: number) => {
    setIndex(i);
    setCycle((c) => c + 1);
  };

  const fade = { duration: 0.56, ease: [0.16, 1, 0.3, 1] as const };

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
          transition={fade}
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

          {/* Title and meta swap with the image. mode="wait" keeps two titles
              from overlapping at different lengths mid-fade, and the invisible
              sizer holds the tallest of them open so nothing below jumps. */}
          <div className="relative">
            {/* A div, not an h2: this is a spacer, and the page should have
                exactly one heading here. */}
            <div aria-hidden="true" className="invisible pointer-events-none">
              <div
                className="font-medium mb-5"
                style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em" }}
              >
                {LONGEST_TITLE}
              </div>
              <div className="eyebrow-mono uppercase" style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}>
                {LONGEST_META}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={project.slug}
                className="absolute inset-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2
                  className="text-[var(--text-hi)] font-medium mb-5"
                  style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em" }}
                >
                  {project.title}
                </h2>
                <p
                  className="eyebrow-mono uppercase text-[var(--text-low)]"
                  style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                >
                  {project.category} / {project.year}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <Link
            to={`/work/${project.slug}`}
            className="group inline-flex items-center gap-3 mt-10 text-[var(--text-hi)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)" }}
          >
            See the project
            <span
              className="w-9 h-9 flex items-center justify-center border border-[var(--line)] group-hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
              style={{ borderRadius: "var(--radius-1)" }}
            >
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </span>
          </Link>

          {/* One tick per project: where we are, and a way to steer. */}
          <div className="flex items-center gap-2 mt-12">
            {FEATURED.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show ${p.title}`}
                aria-current={i === index}
                className="group py-3 cursor-pointer"
              >
                <span className="block relative h-px w-8 sm:w-10 bg-[var(--line-strong)] group-hover:bg-[var(--text-low)] transition-colors duration-[var(--dur-1)]">
                  {i === index && (
                    <motion.span
                      key={`${cycle}-${running && !isMobile}`}
                      className="absolute inset-0 origin-left bg-[var(--signal)]"
                      initial={{ scaleX: running && !isMobile ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: running && !isMobile ? ROTATION_MS / 1000 : 0.24,
                        ease: "linear",
                      }}
                    />
                  )}
                </span>
              </button>
            ))}
            <span
              className="eyebrow-mono text-[var(--text-low)] ml-3 tabular-nums"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              {pad(index + 1)} / {pad(FEATURED.length)}
            </span>
          </div>
        </motion.div>

        {/* The work, framed and large. */}
        <motion.div
          className="lg:col-span-8"
          style={reduce ? undefined : { y }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...fade, delay: 0.08 }}
        >
          <Link to={`/work/${project.slug}`} tabIndex={-1} aria-hidden="true" className="block">
            <div className="border border-[var(--line)] bg-[var(--surface-2)] overflow-hidden">
              <div className="flex items-center gap-3 px-4 h-10 border-b border-[var(--line)] bg-[var(--surface-1)]">
                <span className="flex gap-1.5 shrink-0" aria-hidden="true">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--line-strong)]" />
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={project.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="eyebrow-mono lowercase text-[var(--text-low)] truncate"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.08em" }}
                  >
                    {domainOf(project.link)}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Fixed ratio: the frame must not resize under the crossfade. */}
              <div className="relative w-full" style={{ aspectRatio: FRAME_RATIO }}>
                <AnimatePresence initial={false}>
                  <motion.img
                    key={project.slug}
                    src={project.image}
                    alt={`${project.title}, ${project.category}`}
                    loading="lazy"
                    decoding="async"
                    width={1000}
                    height={583}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fade}
                  />
                </AnimatePresence>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
