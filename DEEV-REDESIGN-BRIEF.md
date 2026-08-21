# DEEV.LU — REDESIGN BRIEF FOR CLAUDE CODE

> **How to use this file.** Drop it in the repo root as `DEEV-REDESIGN-BRIEF.md`, then open Claude Code in the project and paste the **Master Prompt** (Section 0). It instructs Claude to read the rest of this file as the spec. Everything from Section 1 onward is the spec itself — do not paste it, let Claude read it.

---

## 0 — MASTER PROMPT (paste this into Claude Code)

```
You are the lead design engineer on a full visual redesign of deev.lu — the site of DEEV,
an AI-native digital engineering studio in Luxembourg. The site is our single most important
sales asset: prospects judge whether we can build them a premium product by looking at ours.
Right now it does not clear that bar.

Read DEEV-REDESIGN-BRIEF.md in full before writing a single line of code. It is the
authoritative spec: current-state audit, target art direction, design tokens, section-by-section
direction, motion system, budgets, anti-patterns and acceptance criteria. Where the brief and
your instincts disagree, the brief wins. Where the brief is silent, choose the more restrained option.

Target: the confidence of porsche.com, the restraint of apple.com, the cinematic calm of
tesla.com — rebuilt as one coherent DEEV system, not a pastiche of the three.

Scope: redesign in place. Keep the existing Next.js app, routes, content, project data and the
live pricing simulator's logic. Replace the design system, layout architecture, typography,
color, motion and section composition. Do not rewrite business logic you were not asked to touch.

Work in this order and stop for my review at each checkpoint:

  PHASE 0 — AUDIT. Map the repo: framework version, styling approach, component inventory,
  where tokens/colors/fonts currently live, animation libraries in use, image pipeline, i18n setup,
  CMS or hardcoded content. Write findings to REDESIGN-AUDIT.md. List every file the redesign will
  touch and every hardcoded color/font/spacing value that must be tokenized. CHECKPOINT — wait.

  PHASE 1 — FOUNDATION. Create branch `redesign/v2`. Build the token layer exactly as specified
  in Section 4: color, type, space, radius, border, motion, z-index, as CSS custom properties
  wired into Tailwind theme config. Self-host the fonts. Set up a Playwright visual harness
  (Section 9) that screenshots any route at 390 / 768 / 1440 / 1920 in light and dark.
  Prove the tokens render with a single `/_design` route showing the full scale. CHECKPOINT — wait.

  PHASE 2 — SHELL. Nav, footer, page frame, grid, section primitives, button/link/eyebrow/rule
  primitives. Screenshot-verify at all four widths before moving on. CHECKPOINT — wait.

  PHASE 3 — SECTIONS. Rebuild the homepage section by section in the order given in Section 6.
  After each section: run the visual harness, look at the screenshots yourself, and fix what
  looks wrong before continuing. Do not batch four sections and check at the end.

  PHASE 4 — MOTION. Apply the motion system from Section 7 as a final pass, not inline as you go.
  Motion is the last 5% and it is where cheap sites give themselves away.

  PHASE 5 — QA. Run the full acceptance checklist in Section 10. Report pass/fail per line with
  evidence (Lighthouse JSON, axe output, screenshots). Fix every fail. Do not report done with
  known fails.

Rules of engagement:
- Take screenshots and actually look at them. Your judgment of your own output at 1440px wide is
  the primary quality gate, not whether the code compiles.
- Never invent content. Copy comes from the existing site or from me.
- Never ship a placeholder image, lorem text, or a `TODO` in a committed component.
- Commit per section with a clear message. Never commit to main.
- If a spec value in the brief produces a visibly worse result on screen, say so, show me the
  screenshot, and propose the alternative. Do not silently deviate.

Begin with PHASE 0.
```

---

## 1 — WHAT DEEV IS

An independent, founder-led digital engineering studio in Luxembourg (Lux VR States Sàrl-s). Builds AI-native web platforms, web apps, e-commerce and lead systems for companies across Europe. 14 delivered projects. Ships its own SaaS product, Billovio. Sells partly on the Luxembourg SME state grant (up to 70% funded, €3k–€25k envelopes). Production stack: Next.js, React, TypeScript, Node, OpenAI/Anthropic, Supabase, Postgres, Vercel, AWS.

**The strategic problem the design must solve.** DEEV sells senior-only, high-stakes engineering at a premium to European SMEs who could instead hire a cheap Wix shop or a big consultancy. The site is the proof. Every pixel is an argument that this studio is more precise, more considered and more expensive than the alternative. The current design argues the opposite.

**Primary conversion goals**, in order: (1) start the live project simulator, (2) book a strategy call, (3) trigger the grant-eligibility conversation.

---

## 2 — CURRENT-STATE AUDIT (what is wrong, specifically)

This is not a taste disagreement. These are the concrete signals that read as "template" to a buyer with money.

**Typography.** The headline face is a rounded geometric sans (Poppins/Quicksand family). Rounded terminals read friendly, startup-ish, cheap. It is the single loudest downgrade signal on the page and it must go first. There is also no typographic hierarchy beyond "big blue" and "big grey" — no editorial rhythm, no scale contrast, no technical/mono register to carry the engineering claim.

**Color.** A pastel blue→cyan gradient over near-white. Baby blue on white fails contrast and reads as generic 2021 SaaS. The gradient is applied decoratively (mesh blobs, gradient text) rather than structurally. Premium marques do not use decorative gradients; they use one material, one light source, and one signal color.

**Contrast and legibility.** Hero headline sets light blue on a near-white gradient. Body copy sits in low-contrast grey. The most valuable words on the site are the hardest to read.

**Shape language.** Pill-shaped nav items, rounded cards, rounded icon tiles in tinted squares, soft drop shadows. Every corner is rounded and every surface floats. Precision brands use hairlines, hard edges, and near-zero radii.

**Section architecture.** Eleven homepage sections, each a centered eyebrow + centered headline + a grid of 3–4 cards. The whole page is one repeating rhythm, so nothing feels important. There is no crescendo, no full-bleed moment, no scale change, no editorial break.

**Motion.** Everything is scroll-reveal-on-opacity. Screenshots taken mid-scroll show large blocks of the page at partial opacity, including the hero. That is both an aesthetic tell and a real LCP/SEO risk — hero copy should never depend on JS to become visible.

**Broken trust signals.** The stat block renders `0+ PROJECTS DELIVERED` and `0% ON-TIME DELIVERY` before the count-up fires, while the work section three screens earlier says 14 projects. A visitor who lands on that stat sees zeros. "Trusted by leading businesses in Luxembourg & beyond" appears with no logos beneath it — an empty trust claim is worse than none. Emoji (🇱🇺, 🇪🇺) are used as UI elements.

**Theme.** A light/dark toggle in the nav dilutes the identity — the brand has no single memorable look, and the light mode is the weaker of the two. The dark sections shown lower on the page are markedly stronger than the light ones.

**Depth.** Only three routes exist (`/`, `/contact`, `/legal`). Everything is stacked on one very long homepage. There is no case-study depth, no service pages, no proof — which caps both SEO surface and sales credibility.

**Market fit.** English only, in a market that transacts in French, German and Luxembourgish.

---

## 3 — TARGET ART DIRECTION

Three references, one system. Take the *principle* from each; do not copy any of them.

| Reference | What we take | What we do NOT take |
|---|---|---|
| **Apple** | Ruthless subtraction. Enormous negative space. One idea per viewport. Scroll-pinned product moments where the visual does the talking and copy is 6 words. | Their softness, their consumer warmth, their rounded UI chrome. |
| **Porsche** | Typographic precision and confidence. Tight, disciplined grid. Technical labels and numeric indices treated as design elements. Metal, not plastic. Restraint in motion. | Their heritage/nostalgia register. |
| **Tesla** | Full-bleed cinema. Near-invisible UI chrome. Hard black. The willingness to give one section the entire screen and nothing else. | Their sparseness of proof — we need proof; and their flatness. |

**The synthesis, in one line:** *a dark, engineered, editorial site — hairlines instead of shadows, one accent used like a warning light, typography doing 80% of the work, and three full-bleed moments that stop the scroll.*

**Committed decisions:**

1. **Dark-first, and only dark.** Remove the theme toggle. One look, memorable, consistently premium. The dark sections already on the site are the strongest thing there.
2. **Kill the gradient as decoration.** Light is allowed as a *source* (a single directional glow behind a product shot), never as a colored blob or gradient text fill.
3. **One accent color, under 5% of pixels.** Used for: the primary CTA, one word per hero, active states, and the grant/pricing numbers. Nowhere else. Restraint is the entire effect.
4. **Grotesk display + mono technical register.** The mono carries the engineering claim through eyebrows, indices, coordinates, stack labels and numbers.
5. **Hairlines, not cards.** Structure comes from 1px rules at 8–12% opacity and from surface elevation via near-black steps — not from borders + radius + shadow.
6. **Three scroll-stopping moments** on the homepage, and only three: the hero, the system-layers sequence, and the simulator. Everything else is quiet.

---

## 4 — DESIGN TOKENS (implement exactly)

Ship these as CSS custom properties on `:root`, then map them into `tailwind.config.ts` theme. No component may use a raw hex, px font-size, or arbitrary duration.

### 4.1 Color

```css
/* Surfaces — near-black steps, cool-shifted. Elevation = lighter, never shadowed. */
--surface-0:  #08090B;  /* page ground */
--surface-1:  #0C0E11;  /* section alt */
--surface-2:  #121519;  /* card / panel */
--surface-3:  #191D22;  /* raised / hover */
--surface-inv:#F6F7F8;  /* rare inverted section */

/* Hairlines — structure lives here */
--line-faint: rgba(255,255,255,0.06);
--line:       rgba(255,255,255,0.10);
--line-strong:rgba(255,255,255,0.18);

/* Text */
--text-hi:    #F2F4F6;  /* headlines */
--text:       #C6CBD1;  /* body */
--text-mid:   #8B929B;  /* secondary */
--text-low:   #5E656E;  /* labels, meta — min 4.5:1 on surface-0, verify */
--text-inv:   #0A0B0D;

/* Signal — ONE accent. Under 5% of pixels. */
--signal:     #2E6BFF;
--signal-hi:  #558BFF;  /* hover only */
--signal-dim: rgba(46,107,255,0.12); /* fills, never large areas */

/* Technical metal — hairline highlights, spec labels */
--metal:      #9AA3AD;

/* Functional only. Never decorative. */
--positive:   #3DBE7A;  /* grant savings figure */
--warn:       #E0A33C;
```

Contrast floor: **7:1** for headlines, **4.5:1** for all body and label text, verified with a script, not by eye.

### 4.2 Type

Self-host as woff2, variable where available, `font-display: swap`, with a `size-adjust` local fallback so there is zero CLS.

```
--font-display: 'Geist', 'Inter Tight', system-ui, sans-serif;   /* headlines */
--font-body:    'Geist', system-ui, sans-serif;                   /* body */
--font-mono:    'Geist Mono', 'IBM Plex Mono', ui-monospace, monospace; /* technical */
```

> Geist / Geist Mono are free, variable, and read as engineered — correct for the brief. If a type budget exists, upgrade the display face to **PP Neue Montreal**, **Söhne**, or **ABC Diatype** and keep everything else. Do **not** substitute Poppins, Quicksand, Nunito, Montserrat, Raleway or any rounded geometric.

Fluid scale, `clamp()`, viewport 390 → 1920:

```
--t-display : clamp(3.25rem, 1.2rem + 8.6vw, 8.5rem);  /* hero only, 1–2 per page */
--t-h1      : clamp(2.5rem, 1.4rem + 4.6vw, 5rem);
--t-h2      : clamp(2rem, 1.3rem + 2.9vw, 3.5rem);
--t-h3      : clamp(1.375rem, 1.15rem + 0.95vw, 2rem);
--t-lead    : clamp(1.0625rem, 1rem + 0.35vw, 1.3125rem);
--t-body    : 1rem;
--t-small   : 0.875rem;
--t-label   : 0.6875rem;   /* mono, uppercase, tracking 0.16em */
```

Tracking: `-0.035em` on `--t-display`, `-0.025em` on h1/h2, `-0.01em` on h3, `0` on body, `+0.16em` on mono labels.
Leading: `0.92` on display, `1.02` on h1, `1.08` on h2, `1.55` on body, `1.45` on lead.
Weights: display 500–600 only. **Never 700+ on large sizes** — heavy weights at display size read cheap. Body 400. Labels 500.
Measure: body max `62ch`, lead max `48ch`, display max `16ch`.

### 4.3 Space, grid, shape

```
--space: 4px base. Scale: 4 8 12 16 24 32 48 64 96 128 160 200 256
--section-y: clamp(96px, 10vw, 200px)   /* quiet sections */
--section-y-lg: clamp(140px, 14vw, 280px) /* the three big moments */
--container: 1440px      /* content max */
--container-wide: 1720px /* full-bleed inner max */
--gutter: clamp(20px, 4vw, 64px)
--col: 12
--radius-0: 0px    /* default for sections, images, panels */
--radius-1: 2px    /* inputs, small controls */
--radius-2: 4px    /* buttons, cards — maximum permitted */
--radius-pill: 999px  /* ONLY for status dots and one badge type */
```

**No `box-shadow` anywhere in the design system.** Elevation = surface step + hairline. The only exception is a single, very large, very low-opacity ambient glow behind the hero product visual.

---

## 5 — GLOBAL SHELL

**Navigation.** Kill the pill row. A 64px-tall bar, transparent over the hero, transitioning at 80px scroll to `--surface-0` at 88% with `backdrop-blur(12px)` and a 1px bottom hairline. Wordmark left at optical weight (the diamond mark stays, redrawn to hairline weight). Links center or right, `--t-small`, `--text-mid`, hover to `--text-hi` with a 1px underline that wipes in from left over 240ms. One primary CTA, right, solid `--signal`, `--radius-2`, no gradient, no shadow, 40px tall. Mobile: a full-screen overlay with links at `--t-h3`, staggered 40ms, not a hamburger drawer.

**Section primitive.** Every section is `<Section>` taking `tone` (0|1|2), `size` (default|lg), and `bleed` (bool). Eyebrow is always mono/uppercase/`--text-low` with the numeric index (`01 / WHAT WE BUILD`) and a 40px hairline lead-in rule — keep this from the current site, it is the one strong existing device. **Stop centering everything.** Default section alignment is left, on the grid. Center is reserved for the three big moments.

**Footer.** Near-black, tall (240px+), four columns on a hairline grid, mono labels, wordmark large and low-contrast as a graphic element. Include the coordinates line `49.6117° N — 6.1300° E` set in mono — it is the best detail on the current site. Legal row separated by a hairline, `--text-low`, `--t-small`.

---

## 6 — HOMEPAGE, SECTION BY SECTION

Rebuild in this order. Screenshot-verify each before starting the next.

**A. Hero — full-bleed moment #1 (100vh, min 720px).**
Ground `--surface-0`. Headline left-aligned on the grid at `--t-display`, weight 500, three lines, `--text-hi`, with exactly **one word** in `--signal`. Keep the copy: *Platforms that convert. / Systems that scale. / Built in Luxembourg.* Mono eyebrow above with the hairline rule. Lead paragraph max 48ch, `--text-mid`. Two CTAs: primary solid signal ("Configure your project"), secondary a text link with an arrow that translates 4px on hover ("Book a strategy call"). Kill the three feature bullets — they dilute the hero; they move to section B.
Behind it: a single, precise visual — the Luxembourg outline redrawn as a technical hairline wireframe (0.5px strokes at `--line`) with a slow, barely-perceptible parallax on scroll, plus one soft directional glow at 6% opacity. **Not** a gradient blob. **Not** a mesh.
**The hero renders fully visible in the server HTML.** No opacity-0 initial state. Motion is a subtle mask-reveal that runs on mount, never gated on scroll or hydration.

**B. Grant strip.**
Currently a rounded green card that floats. Make it a full-width band on `--surface-1` with hairlines top and bottom, 96px tall on desktop. Mono label `GOVERNMENT-BACKED FUNDING` left. Headline: `Up to 70% funded by the Luxembourg state.` with `70%` in `--positive`. Right: one text CTA. No emoji flags — if the flag stays, it is a 16px hairline SVG, not 🇱🇺.

**C. Positioning + advantages.**
Asymmetric two-column, 5/7 split. Left: the headline and paragraph, sticky through the scroll of the right column. Right: the four advantages as a hairline-separated list, not cards. Each is a mono index, a title at `--t-h3`, and two lines of body. No icons in tinted squares — if an icon is used it is a 20px 1px-stroke line icon in `--metal`, inline with the title.

**D. What we build (4 services).**
Not four equal cards. A 2×2 grid where each cell is a full hairline-bordered panel on `--surface-1`, 320px tall, containing a mono index, title, and body — and on hover the panel lifts to `--surface-2` with the hairline going to `--line-strong` over 240ms. No shadow, no scale, no color change. Cheap, precise, expensive-looking.

**E. Process (Understand / Build / Launch / Scale).**
A single horizontal rule with four nodes on it, numbered in mono. Desktop: four columns hung beneath the rule. Mobile: a vertical rule with the same nodes. This is a diagram, not four cards.

**F. System layers — full-bleed moment #2.**
The best idea on the current site, currently underplayed. Make it a **scroll-pinned sequence**: the section pins for ~200vh; on the left, three isometric hairline planes (Interface / Intelligence / Infrastructure); as the user scrolls, each plane in turn illuminates and rises 12px while its text block on the right becomes active and the other two fall to `--text-low`. Full dark, no other content on screen. This is the Apple product moment. Reduced-motion fallback: a static three-row layout, all active.

**G. Selected work.**
The current filter chips are fine in structure, wrong in shape — make them mono, uppercase, hairline-bordered, `--radius-2`, with the count as a superscript in `--text-low`. Grid: a deliberately irregular editorial layout (a 12-col grid where featured projects span 7 and others span 5), 4:3 imagery, `--radius-0`. Overlay on hover: image scales to 1.03 over 640ms with a `--surface-0`/40% wash and the client name + sector + year in mono sliding up 8px. Add a real case-study route (`/work/[slug]`) even if v1 is a single scroll page per project — the depth is worth more than the polish.

**H. Billovio.**
Own product, so give it a distinct treatment: an inverted section on `--surface-inv` with `--text-inv`. This is the only light section on the site and it should feel like walking into a different room. Product UI shot at `--radius-0` with a 1px `rgba(0,0,0,0.08)` hairline. Four feature lines in mono. One CTA out to billovio.com.

**I. Live simulator — full-bleed moment #3.**
Keep all the logic. Redesign the chrome completely: full-bleed dark, the configurator as a single hairline-framed panel centered at max 1080px. Progress as a 1px rule that fills in `--signal`, with mono step labels `1 PRODUCT / 2 SCALE / 3 FEATURES / 4 ESTIMATE`. Options are hairline-bordered rows that fill to `--surface-2` when selected with a 2px `--signal` left edge — not cards with icons. The price is the hero of this section: `--t-h1` in mono tabular figures, animating between values with a 320ms digit roll, with the post-grant net price beneath in `--positive`. This section should feel like configuring a car.

**J. Why DEEV + stats.**
Fix the zeros: **render the final values in the HTML** and animate from a value close to the target only when in view, so a visitor never sees `0+`. Set stats in mono tabular figures at `--t-h1`. The four trust pillars as a hairline list, same treatment as C. Stack strip stays but as mono wordmarks at `--text-low` on one hairline row — no logos in boxes.

**K. Closing CTA + footer.**
Near-empty. `--t-h1` headline, one paragraph, one primary CTA, one text link. 240px of vertical space above and below. The confidence is in the emptiness.

**Trust bar.** Either put real client logos in (single-color, `--text-low`, hairline row, no marquee) or delete the section entirely. An empty trust claim actively costs credibility.

---

## 7 — MOTION SYSTEM

Motion is applied as a final pass. Three primitives only — anything not on this list needs my sign-off.

```
--ease-out:  cubic-bezier(0.16, 1, 0.30, 1);    /* entrances */
--ease-inout:cubic-bezier(0.65, 0, 0.35, 1);    /* transforms, pins */
--dur-1: 180ms;  /* micro: hover, focus */
--dur-2: 320ms;  /* state change */
--dur-3: 560ms;  /* entrance */
--dur-4: 900ms;  /* hero, pinned */
```

1. **Mask reveal** — headlines only. `clip-path` inset from bottom, `--dur-4`, `--ease-out`. Never opacity-only fades on type.
2. **Rise + fade** — body, list items, panels. `translateY(12px) → 0`, opacity `0 → 1`, `--dur-3`.
3. **Scale drift** — images only. `1.0 → 1.03` on hover over 640ms, or a 4% parallax on scroll.

Rules: stagger never exceeds **60ms** per item and never more than **5 items**. No bounce, no spring, no elastic, no rotation, no blur-in, no letter-by-letter text animation, no number counters outside the two places specified. Hero and above-the-fold content **never** animate in from invisible. Full `prefers-reduced-motion: reduce` support — all transforms become instant, pinned sections become static stacks, and the site must be fully usable and still look designed.

---

## 8 — CONTENT, IA AND MARKET

Do not rewrite copy without asking, but do apply these structural changes:

- **Add routes.** `/work/[slug]` (case studies), `/services/[slug]` (4 pages, one per pillar), `/pricing`, `/about`. This is both SEO surface and sales depth; three routes is not a platform.
- **i18n.** Add `next-intl` with `en` (default), `fr`, `de` and locale-prefixed routes with `hreflang`. Luxembourg buys in French and German. Ship EN complete and scaffold the others with real translations for nav, hero, services and CTA at minimum.
- **Schema.** `Organization`, `ProfessionalService`, `BreadcrumbList`, and `CreativeWork` per case study. Localized OG images generated per route via `next/og`.
- **Remove every emoji from UI.** Replace with hairline SVG or nothing.
- **One claim, one proof.** Every quantitative claim on the page (14 projects, on-time %, senior-only) must be backed by something on the page or on a linked page. If it can't be, cut it.

---

## 9 — VISUAL VERIFICATION HARNESS (build in Phase 1, use every phase)

```
scripts/shoot.ts — Playwright. For each route in a config list:
  viewports: 390×844, 768×1024, 1440×900, 1920×1080
  states: top of page, and each section scrolled into view and settled
  also: prefers-reduced-motion enabled
  writes to .screens/<route>/<viewport>-<section>.png
```

After every section you build: run it, **open the PNGs and look at them**, and write one line per screenshot saying whether it meets the brief. Fix before moving on. Code that compiles but looks like a template is a failed task.

---

## 10 — ACCEPTANCE CRITERIA (report pass/fail with evidence)

**Craft**
- [ ] Zero rounded-geometric typefaces anywhere. Display face is a grotesk.
- [ ] Zero `box-shadow` declarations outside the single hero ambient glow.
- [ ] Zero decorative gradients: no mesh, no blobs, no gradient text fills.
- [ ] Signal color occupies < 5% of pixels on a full-page screenshot at 1440px.
- [ ] No border-radius above 4px except status dots.
- [ ] No component uses a raw hex, raw px font-size, or raw ms duration. All tokens.
- [ ] No emoji rendered as UI.
- [ ] Every section aligns to the 12-column grid; ≤ 3 sections are center-aligned.

**Correctness**
- [ ] Hero headline and lead are present and fully opaque in the server-rendered HTML.
- [ ] Stats never display 0 at any point in their lifecycle.
- [ ] Trust bar contains real logos or does not exist.
- [ ] Simulator produces identical prices to the current implementation (write a test that asserts this against the old logic).

**Performance** (Lighthouse mobile, throttled, production build)
- [ ] LCP < 1.5s · CLS < 0.02 · INP < 200ms · TBT < 150ms
- [ ] Performance ≥ 95, Best Practices = 100, SEO = 100
- [ ] First-load JS < 180KB gzipped on `/`
- [ ] All fonts self-hosted woff2, subset, with size-adjusted fallback — zero font CLS
- [ ] All imagery AVIF/WebP via `next/image`, correct `sizes`, LCP image priority-loaded

**Accessibility**
- [ ] axe-core: zero violations on every route
- [ ] Headline text ≥ 7:1, body and labels ≥ 4.5:1 — verified by script, output included
- [ ] Full keyboard path through nav, filters, simulator and forms; visible 2px `--signal` focus ring on every interactive element
- [ ] `prefers-reduced-motion` produces a static site that still looks designed
- [ ] Semantic landmarks, one `h1` per route, logical heading order

---

## 11 — ANTI-PATTERNS (automatic rejection)

Do not produce, at any point, for any reason:

- Purple/blue gradient meshes, aurora backgrounds, floating blurred orbs, animated grid backgrounds with glowing dots
- Glassmorphism panels, frosted cards, neon borders, `box-shadow: 0 25px 50px rgba(0,0,0,.25)`
- Rounded pill navigation, tinted rounded icon tiles, colored icon squares
- Gradient text fills on headlines
- Three equal cards with an icon, a title and two lines of grey text, centered, repeated for every section
- Emoji as iconography
- Number counters that start at zero, marquee logo strips, fake testimonial carousels
- Letter-by-letter or word-by-word text animation, typewriter effects, blur-in reveals
- Any use of the word "revolutionize", "unlock", "elevate", "seamlessly", "cutting-edge" in new copy
- Above-the-fold content that requires JavaScript to become visible
- Tailwind arbitrary values (`text-[13.5px]`, `bg-[#0a0a0a]`) — everything through tokens

---

## 12 — DEFINITION OF DONE

The redesign is done when a Luxembourg CFO with a €40k budget lands on the homepage on a 1440px MacBook, scrolls once, and forms the impression — before reading a word — that this studio is more expensive and more competent than whoever they were about to call. Everything above is in service of that single test. When in doubt, remove something.
