/**
 * The lit ground behind every page (since 30 Oct 2026): a charcoal field
 * with slowly drifting orbs of Electric Blue, deep navy, Sky and a little
 * Cyan. Pure CSS (design.css): pre-blurred gradients moved by transforms,
 * still on phones, under reduced motion and when motion is paused.
 * Decorative, so hidden from assistive technology.
 *
 * With it, the reading progress: a 2px blue-to-cyan line along the top edge
 * that fills as the page scrolls (scroll-driven CSS, design.css).
 */
export default function OrbField() {
  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="orbs" aria-hidden="true">
        <div className="orbs__layer">
          <div className="orb orb--b" />
          <div className="orb orb--a" />
          <div className="orb orb--c" />
          <div className="orb orb--d" />
        </div>
      </div>
    </>
  );
}
