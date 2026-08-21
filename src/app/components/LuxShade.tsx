import luxMap from "../../assets/luxembourg-map.svg";

/**
 * Faint Luxembourg-silhouette shade — a recurring brand motif.
 * Renders the accurate country outline as a gradient-filled mask.
 * Purely decorative; control size/position/opacity via className.
 */
export default function LuxShade({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{
        background: "var(--signal)",
        WebkitMaskImage: `url(${luxMap})`,
        maskImage: `url(${luxMap})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
