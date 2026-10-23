import { useT } from "../../lib/useT";
import { clients } from "./ClientLogos";

/**
 * Die Kundenreihe direkt unter dem Hero, seit dem 23.10.2026 als Laufband.
 *
 * Nur echte Logos aus ClientLogos (dort ist geklaert, welche Datei welchen
 * Filter braucht). Nur echte Kunden; ein neuer Kunde kommt mit seiner
 * Logodatei dort hinein, nicht als Name hier.
 *
 * Bewegung: ab 768px laeuft das Band (CSS, `.m-ticker`-Prinzip, pausiert beim
 * Darueberfahren); darunter laesst es sich wischen, nach den Leistungsregeln
 * laeuft auf dem Telefon nichts dauerhaft. Reduzierte Bewegung: steht.
 */

type Client = (typeof clients)[number];

/** Tall marks (taller than wide) get more height so they read as large as the wide ones. */
const tall = (c: Client) => c.h > c.w * 0.9;

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex items-center shrink-0 m-0 p-0" aria-hidden={hidden || undefined}>
      {clients.map((c) => (
        <li key={c.name} className="shrink-0 flex items-center justify-center h-16 px-8 md:px-11 snap-start" title={c.name}>
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

  return (
    <section aria-label={t.home.clients.label} className="bg-[var(--surface-0)] border-b border-[var(--line)] py-8 md:py-10">
      <div className="mx-auto" style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}>
        <span
          className="eyebrow-mono uppercase text-[var(--text-low)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          {t.home.clients.label}
        </span>
      </div>

      {/* Phone: swipe. From 768px: a marquee, two identical runs, the track
          moves by one of them. Edges fade into the page. */}
      <div
        className="m-marquee relative mt-5 overflow-x-auto md:overflow-hidden snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
