import { useT } from "../../lib/useT";
import { clients } from "./ClientLogos";

/**
 * Die Kundenreihe direkt unter dem Hero, seit dem 23.10.2026 als Laufband.
 *
 * Echte Logos, wo wir die Datei haben (dieselben Dateien und Filter wie
 * ClientLogos, dort ist geklaert, welche Datei welchen Filter braucht). Fuer
 * Kunden ohne Logodatei steht ihr Name als Wortmarke in einheitlicher Schrift,
 * bis die Datei da ist: dann wandert der Eintrag von WORDMARKS nach
 * ClientLogos. Nur echte Kunden - Projekte aus dem Portfolio und die, die der
 * Inhaber nennt.
 *
 * Bewegung: ab 768px laeuft das Band (CSS, `.m-ticker`-Prinzip, pausiert beim
 * Darueberfahren); darunter laesst es sich wischen, nach den Leistungsregeln
 * laeuft auf dem Telefon nichts dauerhaft. Reduzierte Bewegung: steht.
 */

/** Clients without a logo file yet. Real names only. */
const WORDMARKS = [
  "F.I.T. Fachinstitut für Tierheilkunde",
  "Loredana Candles & Co",
  "UCClervaux",
  "Vino Amore",
  "Supa Saya Gin",
  "Aurora Experience",
  "Laser Center",
  "Geoplus 3D",
];

type Item = { kind: "logo"; c: (typeof clients)[number] } | { kind: "name"; name: string };

/** Alternate logos and wordmarks so neither clumps. */
function interleave(): Item[] {
  const a: Item[] = clients.map((c) => ({ kind: "logo", c }));
  const b: Item[] = WORDMARKS.map((name) => ({ kind: "name", name }));
  const out: Item[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

function Run({ items, hidden }: { items: Item[]; hidden?: boolean }) {
  return (
    <ul className="flex items-center shrink-0 m-0 p-0" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li
          key={it.kind === "logo" ? it.c.name : it.name}
          className="shrink-0 flex items-center justify-center h-16 px-8 md:px-11 snap-start"
          title={it.kind === "logo" ? it.c.name : it.name}
        >
          {it.kind === "logo" ? (
            <img
              src={it.c.src}
              alt={hidden ? "" : it.c.name}
              width={it.c.w}
              height={it.c.h}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={`h-8 md:h-10 w-auto max-w-[130px] md:max-w-[150px] object-contain opacity-60 dark:opacity-70 ${it.c.filter}`}
            />
          ) : (
            <span
              className="font-brand whitespace-nowrap text-[var(--text-hi)] opacity-55 dark:opacity-65"
              style={{ fontSize: "1.0625rem", letterSpacing: "-0.01em" }}
            >
              {it.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function HomeClients() {
  const t = useT();
  const items = interleave();

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
          <Run items={items} />
          <Run items={items} hidden />
        </div>
      </div>
    </section>
  );
}
