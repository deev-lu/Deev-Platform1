import { useEffect, useState } from "react";
import { useT } from "../../lib/useT";
import { scrollToId } from "../../lib/smoothScroll";

/**
 * The section ticks at the right edge of the homepage (since 30 Oct 2026,
 * after nvision.lu): one short line per section, the current one long and in
 * the blue-to-cyan gradient, its name on hover or keyboard focus. From
 * 1024px; on smaller screens there is no room beside the content.
 *
 * The sections are read from the page (main section[id] that carry an
 * eyebrow), so a section that is added, renamed or moved needs no change
 * here. Real links to #id, in a named navigation, so they work from the
 * keyboard and a screen reader lists them.
 */
type Item = { id: string; label: string };

function readSections(): Item[] {
  return [...document.querySelectorAll<HTMLElement>("main section[id]")]
    .map((s) => {
      const eyebrow = s.querySelector(".eyebrow-mono")?.textContent ?? "";
      const label = eyebrow.replace(/^\s*\d+\s*\/\s*/, "").trim();
      return { id: s.id, label };
    })
    .filter((i) => i.label && i.label.length < 48);
}

export default function SectionTicks() {
  const t = useT();
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string | null>(null);

  // Sections mount lazily; read them again while the page fills in.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setItems((prev) => {
          const next = readSections();
          return next.map((n) => n.id).join() === prev.map((p) => p.id).join() ? prev : next;
        });
      });
    };
    read();
    const main = document.querySelector("main");
    const mo = new MutationObserver(read);
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // The current section is the one across the middle of the screen.
  useEffect(() => {
    if (!items.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const i of items) {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label={t.site.a11y.sections} className="ticks">
      {items.map((i) => (
        <a
          key={i.id}
          href={`#${i.id}`}
          aria-current={active === i.id ? "true" : undefined}
          onClick={(e) => {
            e.preventDefault();
            scrollToId(i.id);
          }}
        >
          <span className="ticks__label">{i.label}</span>
          <span aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
