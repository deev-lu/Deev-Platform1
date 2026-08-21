// Brief §4.1 / §10: headlines >= 7:1, body and labels >= 4.5:1, verified by
// script rather than by eye.
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const S0 = "#08090b";
// Each token is checked in the role it is actually used in: --signal is a
// fill (text sits on it), --signal-text is type on the page ground.
const checks = [
  ["--text-hi    on surface-0", "#f2f4f6", S0, 7],
  ["--text       on surface-0", "#c6cbd1", S0, 4.5],
  ["--text-mid   on surface-0", "#8b929b", S0, 4.5],
  ["--text-low   on surface-0", "#767d87", S0, 4.5],
  ["--signal-text on surface-0", "#6e9bff", S0, 7],
  ["--positive   on surface-0", "#3dbe7a", S0, 4.5],
  ["--metal      on surface-0", "#9aa3ad", S0, 4.5],
  ["white on --signal fill", "#ffffff", "#2e6bff", 4.5],
  ["--text-hi    on surface-2", "#f2f4f6", "#121519", 7],
  ["--text-mid   on surface-2", "#8b929b", "#121519", 4.5],
];
let fails = 0;
for (const [label, fg, bg, floor] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= floor;
  if (!ok) fails++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label.padEnd(28)} ${r.toFixed(2)}:1  (floor ${floor})`);
}
console.log(fails ? `\n${fails} check(s) below floor` : "\nall contrast floors met");
