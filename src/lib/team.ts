/**
 * The founders, and whether we can actually show them.
 *
 * Photos are discovered by filename: drop `fabio.*` and `sven.*` into
 * src/assets/team and they appear. No import, no map entry.
 *
 * `TEAM_READY` is false until both files exist, and the About section and its
 * navigation link both key off it. A founders section is two people or it is
 * nothing: one real portrait beside an empty frame reads worse than no section
 * at all, and a stand-in silhouette would be inventing a person. So the
 * section stays out of the page, and the moment both files land it is there.
 */

const FILES = import.meta.glob("../assets/team/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byBasename: Record<string, string> = {};
for (const [path, url] of Object.entries(FILES)) {
  byBasename[path.split("/").pop()!.replace(/\.[a-z]+$/i, "").toLowerCase()] = url;
}

export interface Founder {
  key: string;
  name: string;
  role: string;
  photo?: string;
}

export const FOUNDERS: Founder[] = [
  { key: "fabio", name: "Fabio Falchero", role: "Founder & CEO" },
  { key: "sven", name: "Sven Kettel", role: "Founder & CEO" },
].map((f) => ({ ...f, photo: byBasename[f.key] }));

export const TEAM_READY = FOUNDERS.every((f) => Boolean(f.photo));
