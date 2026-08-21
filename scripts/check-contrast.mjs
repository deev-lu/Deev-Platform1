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

// Both themes, each token in the role it is actually used in.
const DARK_0 = "#08090b", DARK_2 = "#121519", DARK_PRODUCT = "#0d1421";
const LIGHT_0 = "#ffffff", LIGHT_1 = "#f4f5f7", LIGHT_PRODUCT = "#e7ecf3";
const checks = [
  // ── dark ──
  ["dark  --text-hi     on surface-0", "#f2f4f6", DARK_0, 7],
  ["dark  --text        on surface-0", "#c6cbd1", DARK_0, 4.5],
  ["dark  --text-mid    on surface-0", "#8b929b", DARK_0, 4.5],
  ["dark  --text-low    on surface-0", "#767d87", DARK_0, 4.5],
  ["dark  --signal-text on surface-0", "#6e9bff", DARK_0, 7],
  ["dark  --positive    on surface-0", "#3dbe7a", DARK_0, 4.5],
  ["dark  --metal       on surface-0", "#9aa3ad", DARK_0, 4.5],
  ["dark  --text-hi     on surface-2", "#f2f4f6", DARK_2, 7],
  ["dark  --text-hi  on product",     "#f2f4f6", DARK_PRODUCT, 7],
  ["dark  --text     on product",     "#c6cbd1", DARK_PRODUCT, 4.5],
  ["dark  --text-mid on product",     "#8b929b", DARK_PRODUCT, 4.5],
  ["dark  white on --signal fill",     "#ffffff", "#2e6bff", 4.5],
  // ── light ──
  ["light --text-hi     on surface-0", "#0a0b0d", LIGHT_0, 7],
  ["light --text        on surface-0", "#33383f", LIGHT_0, 4.5],
  ["light --text-mid    on surface-0", "#565c64", LIGHT_0, 4.5],
  ["light --text-low    on surface-1", "#6b7178", LIGHT_1, 4.5],
  ["light --signal-text on surface-1", "#1747c4", LIGHT_1, 7],
  ["light --positive    on surface-0", "#1f7a4d", LIGHT_0, 4.5],
  ["light --metal       on surface-1", "#6b7178", LIGHT_1, 4.5],
  ["light --text-hi  on product",     "#0a0b0d", LIGHT_PRODUCT, 7],
  ["light --text     on product",     "#33383f", LIGHT_PRODUCT, 4.5],
  ["light --text-mid on product",     "#565c64", LIGHT_PRODUCT, 4.5],
  ["light white on --signal fill",     "#ffffff", "#2563f6", 4.5],
];
let fails = 0;
for (const [label, fg, bg, floor] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= floor;
  if (!ok) fails++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label.padEnd(28)} ${r.toFixed(2)}:1  (floor ${floor})`);
}
console.log(fails ? `\n${fails} check(s) below floor` : "\nall contrast floors met");
