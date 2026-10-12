import { useT } from "../../lib/useT";
import { clients } from "./ClientLogos";

/**
 * Die Kundenreihe direkt unter dem Hero: echte Logos auf einer Haarlinie.
 *
 * Kein Laufband (Brief §11), keine Kaesten, eine Tonart: dieselben Dateien und
 * Filter wie ClientLogos, weil dort geklaert ist, welche Datei welchen Filter
 * braucht, damit sie in beiden Themen lesbar bleibt.
 */
export default function HomeClients() {
  const t = useT();

  return (
    <section aria-label={t.home.clients.label} className="bg-[var(--surface-0)] border-b border-[var(--line)]">
      <div
        className="mx-auto grid grid-cols-3 md:grid-cols-[200px_repeat(5,minmax(0,1fr))] items-center gap-y-8 py-10 md:py-0 md:h-28"
        style={{ maxWidth: "var(--container)", paddingInline: "var(--gutter)" }}
      >
        <span
          className="col-span-3 md:col-span-1 eyebrow-mono uppercase text-[var(--text-low)]"
          style={{ fontSize: "var(--t-label)", letterSpacing: "0.16em" }}
        >
          {t.home.clients.label}
        </span>
        {clients.map((c) => (
          <span key={c.name} className="flex justify-center" title={c.name}>
            <img
              src={c.src}
              alt={c.name}
              width={c.w}
              height={c.h}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={`h-8 md:h-10 w-auto max-w-[120px] md:max-w-[140px] object-contain opacity-60 dark:opacity-70 ${c.filter}`}
            />
          </span>
        ))}
      </div>
    </section>
  );
}
