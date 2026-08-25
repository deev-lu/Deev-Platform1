import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import L from "./L";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "../../lib/projects";
import { useIsMobile } from "../../lib/useIsMobile";
import { useT } from "../../lib/useT";

/**
 * §01 — Selected work.
 *
 * This section replaced the tiled portfolio grid. One project at a time, at
 * full scale, rotating every ten seconds through every project we have a real
 * screenshot of.
 *
 * The screenshot sits in a frame with our type beside it rather than under it:
 * a screenshot carries the client's own typography, so a title laid over it
 * prints the project name twice.
 *
 * All sixteen projects are in the cycle. Six of them have a screenshot; the
 * other eight have none we can ship, so the frame shows a typeset plate with
 * that project's own name, sector, year and live domain. It is real data set
 * in the site's own type, not a placeholder, and it is replaced the moment a
 * screenshot lands in src/assets/work and is mapped in projects.ts.
 *
 * Rotation rules:
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

const SLIDES = PROJECTS;

/** The longest strings in the set. They size the invisible block that reserves
 *  room for the title, so the link and the controls below it never move when a
 *  two-line name is replaced by a one-line name. */
const LONGEST_TITLE = SLIDES.reduce((a, p) => (p.title.length > a.length ? p.title : a), "");
const LONGEST_META = SLIDES.reduce((a, p) => {
  const m = `${p.category} / ${p.year}`;
  return m.length > a.length ? m : a;
}, "");

const domainOf = (link?: string) =>
  link ? link.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") : "";


export default function WorkMoment() {
  const t = useT();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px" });

  const [index, setIndex] = useState(0);
  // Bumped on every change of project. Keys the progress fill so it remounts
  // and restarts in step with the timer, including after a manual pick.
  const [cycle, setCycle] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);
  // Set once, when someone picks a project themselves. From then on the strip
  // is the only thing that changes what is on screen.
  const [chosen, setChosen] = useState(false);
  const activeThumb = useRef<HTMLButtonElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  const running = !reduce && !chosen && inView && tabVisible && SLIDES.length > 1;

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
      setCycle((c) => c + 1);
    }, ROTATION_MS);
    return () => window.clearTimeout(t);
  }, [running, index, cycle]);

  // Follow the rotation with the strip, so the highlighted thumbnail is never
  // off the side of the screen. Nearest, not centred: nudging by a few pixels
  // beats yanking the strip on every tick.
  useEffect(() => {
    activeThumb.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [index, reduce]);

  // Warm the next frame while the current one is being read.
  useEffect(() => {
    const next = SLIDES[(index + 1) % SLIDES.length];
    if (!next?.image) return;
    const img = new Image();
    img.src = next.image;
  }, [index]);

  if (SLIDES.length === 0) return null;

  const project = SLIDES[index];

  /** Choosing a project stops the rotation for good. */
  const pick = (i: number) => {
    setChosen(true);
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
        className="relative mx-auto"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={fade}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-10 bg-[var(--line-strong)]" />
            <span
              className="eyebrow-mono uppercase text-[var(--text-low)]"
              style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
            >
              <span className="text-[var(--metal)]">01</span> / {t.home.work.eyebrow}
            </span>
          </div>
          <h2
            className="text-[var(--text-hi)] font-medium"
            style={{ fontSize: "var(--t-h2)", lineHeight: 1.08, letterSpacing: "-0.025em", maxWidth: "18ch" }}
          >
            {t.home.work.title}
          </h2>
          <p
            className="text-[var(--text-mid)] mt-6"
            style={{ fontSize: "var(--t-lead)", lineHeight: 1.45, maxWidth: "48ch" }}
          >
            {t.home.work.lead}
          </p>
        </motion.div>

        {/* On a phone the screenshot comes first. Reading the client's name
            before you have seen anything is backwards on a narrow screen: the
            work is the proof, so it leads and the type follows it. From lg up
            the columns sit side by side and the order is irrelevant. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-9 lg:gap-y-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={fade}
            className="order-2 lg:order-1 lg:col-span-4 lg:pt-14"
          >
            {/* Title and meta swap with the image. mode="wait" keeps two titles
                from overlapping at different lengths mid-fade, and the invisible
                sizer holds the tallest of them open so nothing below jumps. */}
            <div className="relative">
              {/* A div, not a heading: this is a spacer. */}
              <div aria-hidden="true" className="invisible pointer-events-none">
                <div
                  className="font-medium mb-4"
                  style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.015em" }}
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
                  <h3
                    className="text-[var(--text-hi)] font-medium mb-4"
                    style={{ fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-0.015em" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="eyebrow-mono uppercase text-[var(--text-low)]"
                    style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
                  >
                    {project.category} / {project.year}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <L
              to={`/work/${project.slug}`}
              className="group inline-flex items-center gap-3 mt-9 text-[var(--text-hi)] hover:text-[var(--signal-text)] transition-colors duration-[var(--dur-1)]"
              style={{ fontSize: "var(--t-small)" }}
            >
              {t.home.work.seeProject}
              <span
                className="w-9 h-9 flex items-center justify-center border border-[var(--line)] group-hover:border-[var(--line-strong)] transition-colors duration-[var(--dur-1)]"
                style={{ borderRadius: "var(--radius-1)" }}
              >
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </span>
            </L>

          </motion.div>

          {/* The work, framed and large. */}
          <motion.div
            className="order-1 lg:order-2 lg:col-span-8"
            style={reduce ? undefined : { y }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...fade, delay: 0.08 }}
          >
            <L to={`/work/${project.slug}`} tabIndex={-1} aria-hidden="true" className="block">
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
                    <motion.div
                      key={project.slug}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={fade}
                    >
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={`${project.title}, ${project.category}`}
                          loading="lazy"
                          decoding="async"
                          width={1000}
                          height={583}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Plate project={project} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </L>
          </motion.div>
        </div>

        {/* One control instead of four.
            Arrows, a counter and a filling progress bar asked someone to step
            through sixteen projects blind and to work out what the bar meant.
            The strip shows what there is and goes straight to it, which is
            also the one gesture that already works on a phone: a thumb drag.
            Auto-advance stops for good the moment anyone touches it, because
            a carousel that keeps moving after you have chosen is fighting
            you. */}
        <div className="mt-10 -mx-[var(--gutter)] px-[var(--gutter)] overflow-x-auto no-scrollbar">
          <ul className="flex items-stretch gap-3 min-w-max pb-1" role="tablist" aria-label={t.home.work.eyebrow}>
            {SLIDES.map((p, i) => {
              const active = i === index;
              return (
                <li key={p.slug}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={p.title}
                    ref={active ? activeThumb : undefined}
                    onClick={() => pick(i)}
                    className={`block w-[132px] sm:w-[152px] border transition-all duration-[var(--dur-2)] cursor-pointer overflow-hidden ${
                      active
                        ? "border-[var(--signal)] opacity-100"
                        : "border-[var(--line)] opacity-55 hover:opacity-100 hover:border-[var(--line-strong)]"
                    }`}
                    style={{ borderRadius: "var(--radius-1)" }}
                  >
                    <span className="block relative w-full bg-[var(--surface-2)]" style={{ aspectRatio: "1000 / 583" }}>
                      {p.image ? (
                        <img
                          src={p.image}
                          alt=""
                          width={1000}
                          height={583}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span
                          className="absolute inset-0 flex items-center justify-center px-2 text-center eyebrow-mono uppercase text-[var(--text-low)]"
                          style={{ fontSize: "var(--t-label)", letterSpacing: "0.12em" }}
                        >
                          {p.title}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* The full list lives on /work now. One line here keeps every case
            study two clicks from the homepage without printing sixteen rows
            of text on a phone. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={fade}
          className="mt-16 pt-10 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-6"
        >
          <p
            className="eyebrow-mono uppercase text-[var(--text-low)]"
            style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
          >
            {t.home.work.counter(PROJECTS.length)}
          </p>

          <L
            to="/work"
            className="group inline-flex items-center gap-3 h-12 px-7 border border-[var(--line-strong)] text-[var(--text-hi)] hover:border-[var(--text-low)] transition-colors duration-[var(--dur-1)]"
            style={{ fontSize: "var(--t-small)", borderRadius: "var(--radius-1)" }}
          >
            {t.home.work.seeAll}
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-[var(--dur-1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </L>
        </motion.div>

      </div>
    </section>
  );
}

/**
 * The frame for a project we have not screenshotted yet.
 *
 * It shows that project's own name, sector, year and live domain, set in the
 * site's type over a hairline grid. No stock image, no mock-up, nothing
 * invented: the moment a real screenshot is added to src/assets/work and
 * mapped in projects.ts, the plate is replaced by it automatically.
 */
function Plate({ project }: { project: Project }) {
  return (
    <div
      className="w-full h-full flex flex-col justify-end gap-6 p-8 sm:p-12 bg-[var(--surface-2)]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to right, var(--line) 0 1px, transparent 1px 120px), repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px 120px)",
      }}
    >
      {/* The sector, not the name: the name is already set beside the frame,
          and one project should not print its title twice on one screen. */}
      <span
        className="text-[var(--text-hi)] font-medium"
        style={{ fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: "12ch" }}
      >
        {project.category}
      </span>

      <span
        className="eyebrow-mono text-[var(--text-low)] tabular-nums"
        style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
      >
        {project.year}
      </span>
    </div>
  );
}
