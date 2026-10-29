/**
 * DEEV look for the Klar Access menu. The widget's own files stay as the
 * owner ships them; this sheet is appended to its shadow root after them
 * (loadKlarAccess), so it wins by order at equal specificity.
 *
 * It only restyles: brand fonts, the site's surfaces and ink, Electric Blue
 * fills, the measured radii (12 / 20). Geometry the rest of the site relies
 * on stays the widget's: the 56px button, 24px from the corner (20px on
 * phones), the dialog's insets.
 *
 * Follows the site theme through data-deev-theme on the <klar-access> host.
 * Text pairs hold 4.5:1, switch and segment outlines 3:1, in both themes.
 * Under forced colours the widget's own rules apply untouched.
 */
export const KLAR_ACCESS_THEME = `
@media (forced-colors: none) {
  .ka-ui {
    --k-bg: #101426;
    --k-raise: #171c33;
    --k-raise-2: #1e2440;
    --k-line: rgba(255,255,255,.10);
    --k-line-strong: rgba(255,255,255,.18);
    --k-outline: #6b7386;
    --k-ink: #f2f4f6;
    --k-ink-mid: #c6cbd1;
    --k-ink-low: #8b929b;
    --k-sky: #4397f8;
    --k-focus: #4397f8;
    --k-backdrop: rgba(6,6,10,.55);
    --k-shadow: 0 30px 80px rgba(0,0,0,.55);
    font: 400 15px/1.5 "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--k-ink);
    color-scheme: dark;
  }
  :host([data-deev-theme="light"]) .ka-ui {
    --k-bg: #ffffff;
    --k-raise: #f6f7fb;
    --k-raise-2: #eef1f6;
    --k-line: rgba(11,21,48,.10);
    --k-line-strong: rgba(11,21,48,.18);
    --k-outline: #7f889c;
    --k-ink: #0b1530;
    --k-ink-mid: #2b3550;
    --k-ink-low: #5b6680;
    --k-sky: #1747c4;
    --k-focus: #2563f6;
    --k-backdrop: rgba(11,21,48,.22);
    --k-shadow: 0 30px 80px rgba(11,21,48,.18);
    color-scheme: light;
  }

  button:focus-visible, a:focus-visible, input:focus-visible + span {
    outline: 2px solid var(--k-focus);
    outline-offset: 3px;
  }

  /* The button: navy ink in both themes, so it never competes with the
     blue intro-call button; the ring is the one Electric Blue gesture. */
  .ka-launcher {
    background: #0b1530;
    border: 1px solid rgba(255,255,255,.24);
    color: #fff;
    box-shadow: 0 10px 28px rgba(6,10,30,.38);
  }
  .ka-launcher::after { inset: -5px; border: 2px solid #2563f6; }
  .ka-launcher:hover { background: #2563f6; }
  .ka-launcher svg { width: 27px; height: 27px; }

  dialog {
    background: var(--k-bg);
    color: var(--k-ink);
    border: 1px solid var(--k-line-strong);
    border-radius: 20px;
    box-shadow: var(--k-shadow);
  }
  dialog::backdrop { background: var(--k-backdrop); }

  .ka-header { border-bottom: 1px solid var(--k-line); padding: 22px 20px 18px 24px; }
  .ka-symbol { width: 42px; height: 42px; border-radius: 12px; background: rgba(37,99,246,.14); color: var(--k-sky); }
  .ka-symbol svg { width: 24px; height: 24px; }
  .ka-eyebrow {
    font: 500 10px/1.4 "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .2em;
    color: var(--k-sky);
    margin-bottom: 4px;
  }
  h2 { font: 700 20px/1.2 "Typold", "Inter", sans-serif; letter-spacing: -.01em; color: var(--k-ink); }

  .ka-icon-button {
    border: 1px solid var(--k-line-strong);
    border-radius: 12px;
    background: var(--k-raise);
    color: var(--k-ink);
  }
  .ka-close { border-color: transparent; background: var(--k-raise-2); }
  .ka-icon-button:hover:not(:disabled) { background: var(--k-raise-2); border-color: var(--k-line-strong); }
  .ka-icon-button:disabled { color: var(--k-ink-low); background: var(--k-raise); opacity: .6; }

  .ka-content { scrollbar-color: var(--k-line-strong) transparent; }
  .ka-intro { color: var(--k-ink-mid); font-size: 14px; }
  h3 {
    font: 500 10.5px/1.4 "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .18em;
    color: var(--k-ink-low);
    margin: 26px 0 12px;
  }
  .ka-size, legend, .ka-row-copy { font-weight: 500; color: var(--k-ink); }
  output { color: var(--k-ink); }

  .ka-segments { background: var(--k-raise); border: 1px solid var(--k-line); border-radius: 14px; }
  .ka-segments span { border-radius: 10px; color: var(--k-ink-mid); font-weight: 500; }
  .ka-segments input:checked + span {
    background: #2563f6;
    border-color: #2563f6;
    color: #fff;
    box-shadow: 0 4px 14px rgba(37,99,246,.28);
  }
  .ka-swatch { border-color: var(--k-outline); }
  .ka-segments input:checked + span .ka-swatch { border-color: #fff; }
  .ka-swatch.off { background: linear-gradient(90deg, #fff 50%, #0b1530 50%); }
  .ka-swatch.dark { background: #0b1530; }

  .ka-row { border-bottom: 1px solid var(--k-line); }
  .ka-row-icon { color: var(--k-sky); }
  small { color: var(--k-ink-low); }

  .ka-switch::before { background: var(--k-raise-2); border: 1px solid var(--k-outline); }
  .ka-switch > span { box-shadow: 0 1px 3px rgba(6,10,30,.35); }
  .ka-switch[aria-checked="true"]::before { background: #2563f6; border-color: #2563f6; }
  .ka-switch[aria-checked="true"] > span { color: #2563f6; }

  .ka-note { color: var(--k-ink-low); }
  .ka-statement { color: var(--k-sky); }

  footer { background: var(--k-raise); border-top: 1px solid var(--k-line); }
  .ka-reset {
    background: var(--k-bg);
    color: var(--k-ink);
    border: 1px solid var(--k-line-strong);
    border-radius: 12px;
    font-weight: 500;
  }
  .ka-reset:hover { background: var(--k-raise-2); }
  .ka-storage { color: var(--k-ink-low); }

  @media (max-width: 440px) {
    dialog, [data-side="left"] dialog { border-radius: 20px; }
    .ka-header { padding: 16px 16px 14px; }
  }
}

/* The site has its own "Skip to content" in the page language (SkipLink),
   present without the widget too; a second, German one right before it
   would only add a Tab stop. */
.ka-skip { display: none !important; }
`;
