import madeInLux from "../../assets/made-in-luxembourg.svg";

/**
 * Official "Made in Luxembourg" certification label.
 * Rendered as a CSS mask so it recolors via the current text color
 * (adapts to light/dark). Control size via className (set width + height).
 */
export default function MadeInLuxembourg({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Made in Luxembourg — certified label"
      className={className}
      style={{
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${madeInLux})`,
        maskImage: `url(${madeInLux})`,
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
