import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useT } from "../../lib/useT";
import { clients } from "./ClientLogos";
import { useMotionPaused } from "../../lib/motionPref";

/**
 * Die Kundenreihe direkt unter dem Hero, seit dem 23.10.2026 als Laufband.
 *
 * Nur echte Logos aus ClientLogos (dort ist geklaert, welche Datei welchen
 * Filter braucht). Nur echte Kunden; ein neuer Kunde kommt mit seiner
 * Logodatei dort hinein, nicht als Name hier.
 *
 * Bewegung: das Band laeuft auf jeder Bildschirmgroesse (CSS, `.m-ticker`-
 * Prinzip, pausiert beim Darueberfahren); seit dem 25.10.2026 auch auf dem
 * Telefon, auf Wunsch des Inhabers. Reduzierte Bewegung: steht und laesst
 * sich wischen.
 */

type Client = (typeof clients)[number];

/** Tall marks (taller than wide) get more height so they read as large as the wide ones. */
const tall = (c: Client) => c.h > c.w * 0.9;

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex items-center shrink-0 m-0 p-0" aria-hidden={hidden || undefined}>
      {clients.map((c) => (
        <li key={c.name} className="shrink-0 flex items-center justify-center h-16 px-8 md:px-11" title={c.name}>
          <img
            src={c.src}
            alt={hidden ? "" : c.name}
            width={c.w}
            height={c.h}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`${tall(c) ? "h-12 md:h-14" : "h-8 md:h-10"} w-auto max-w-[130px] md:max-w-[150px] object-contain opacity-60 dark:opacity-70 ${c.filter}`}
          />
        </li>
      ))}
    </ul>
  );
}

export default function HomeClients() {
  const t = useT();
  // WCAG 2.2.2: anything that moves for more than five seconds needs a way to
  // stop it. Hover pauses too, but a phone and a keyboard have no hover.
  const [paused, setPaused] = useState(false);
  // Under the site-wide pause the band is already still (rows, no motion),
  // so its own button would do nothing.
  const allStill = useMotionPaused();

  return (
    <section aria-label={t.home.clients.label} className="bg-[var(--surface-0)] border-b border-[var(--line)] py-8 md:py-10">
      <div className="mx-auto flex items-center justify-between gap-4" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <span
          className="eyebrow-mono uppercase text-[var(--text-low)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          {t.home.clients.label}
        </span>
        {!allStill && <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? t.site.a11y.playLogos : t.site.a11y.pauseLogos}
          title={paused ? t.site.a11y.playLogos : t.site.a11y.pauseLogos}
          className="motion-reduce:hidden shrink-0 grid place-items-center w-8 h-8 rounded-full border border-[var(--line-strong)] text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors duration-[var(--dur-1)]"
        >
          {paused ? <Play className="w-3.5 h-3.5" strokeWidth={1.75} /> : <Pause className="w-3.5 h-3.5" strokeWidth={1.75} />}
        </button>}
      </div>

      {/* A marquee on every screen: two identical runs, the track moves by
          one of them. Edges fade into the page. */}
      <div
        className={`m-marquee ${paused ? "is-paused " : ""}relative mt-5 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div className="m-marquee-track flex w-max">
          <Run />
          <Run hidden />
        </div>
      </div>
    </section>
  );
}
