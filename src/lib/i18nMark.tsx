import type { ReactNode } from "react";

/**
 * Accent words, marked inline in the translation rather than split across
 * three dictionary keys.
 *
 *   "Platforms that [[convert]]."      -> Platforms that <span>convert</span>.
 *   "Des plateformes qui [[convertissent]]."
 *
 * Splitting a sentence into before/accent/after keys only works while every
 * language keeps English word order, and none of them do: the accent lands at
 * the end in French, and German moves the verb again. A marker travels with
 * the sentence, so a translator can put the emphasis wherever the sentence
 * actually wants it, or leave it out entirely.
 */
const MARK = /\[\[(.+?)\]\]/g;

export function mark(text: string, className: string): ReactNode {
  if (!text.includes("[[")) return text;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  MARK.lastIndex = 0;
  while ((m = MARK.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <span key={m.index} className={className}>
        {m[1]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** The same string with the markers removed, for alt text, titles and meta. */
export const plain = (text: string) => text.replace(MARK, "$1");
