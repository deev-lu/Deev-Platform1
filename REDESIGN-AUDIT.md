# REDESIGN AUDIT — Phase 0

Findings against `DEEV-REDESIGN-BRIEF.md`. Every number below was measured from
the repo, not estimated. **Checkpoint: no redesign code has been written.**

---

## 0 — One blocking discrepancy, before anything else

**The brief says "Keep the existing Next.js app". There is no Next.js app.**

```
vite 6.3.5 · @vitejs/plugin-react 4.7.0 · react-router 7.13.0 · tailwindcss 4.1.12
no next.config.*  ·  no app/  ·  no pages/  ·  "build": "vite build && node scripts/prerender-routes.mjs"
```

This is a client-rendered Vite SPA. Everything in the brief that names a Next.js
API has no equivalent here and needs a decision:

| Brief asks for | Status on Vite | Options |
|---|---|---|
| `next-intl`, locale-prefixed routes | n/a | `react-i18next` + route prefixes, hand-rolled |
| `next/og` per-route OG images | n/a | `@vercel/og` as an edge function (works on this stack) |
| `next/image`, AVIF/WebP, `sizes` | n/a | `vite-imagetools`, or hand-authored `<picture>` |
| `/work/[slug]`, `/services/[slug]` | n/a as file routes | `react-router` params + the existing prerender script |
| **"Hero renders fully visible in server HTML"** (§6A, §10) | **impossible as-is** | see §5 below — this is the one that forces a real decision |

The last row matters most. Acceptance criterion *"Hero headline and lead are
present and fully opaque in the server-rendered HTML"* cannot be met by a CSR
SPA: `dist/index.html` ships an empty `#root`. Three ways forward:

1. **Extend the existing prerender step** to render React to static HTML per
   route (`react-dom/server` + `StaticRouter`). Moderate work, keeps the stack,
   satisfies the criterion. **Recommended.**
2. **Migrate to Next.js**, as the brief assumes. Satisfies every Next-specific
   line but is a separate project from a visual redesign, and it would throw
   away the routing/prerender/SEO work already shipped this week.
3. **Drop the SSR criterion** and accept a JS-gated hero. Cheapest, but it
   leaves the LCP/SEO problem the brief correctly identifies.

I need your call before Phase 1.

---

## 1 — Repo map

**Framework** Vite 6 SPA, React 18, TypeScript, react-router 7. No SSR.
**Styling** Tailwind v4 via `@tailwindcss/vite`. No `tailwind.config` file —
theme lives in CSS. Four stylesheets:

| File | Role |
|---|---|
| `src/styles/theme.css` | 125 CSS custom properties — but they are the **shadcn/ui** set (`--background`, `--popover`, `--ring`…), not a brand token layer. Declares `@custom-variant dark (&:is(.dark *))`. |
| `src/styles/fonts.css` | `@font-face` for Typold + JetBrains Mono, plus `.glass`, `.eyebrow-mono`, `.stat-outline`, `.animate-drift`, mobile perf overrides |
| `src/styles/tailwind.css` | Tailwind entry |
| `src/styles/index.css` | misc |

**Type** Display = **Typold Bold** (self-hosted woff2, subset, weight 700 only).
Mono = **JetBrains Mono**. Body = **Inter**, loaded from Google Fonts CDN
(`fonts.googleapis.com`), *not* self-hosted — this violates the brief's zero-CLS
font requirement and adds a third-party connection.

**Animation** `motion` 12.23.24 (Framer). Used in essentially every component.
**Icons** `lucide-react`. **Images** 27 static ESM imports from `src/assets/`;
no responsive `srcset` anywhere; 5 `loading="lazy"` in total.
**i18n** none. **CMS** none — all copy hardcoded in components.
**Routes** exactly three: `/`, `/legal`, `/contact`.

**Components** 36 in `src/app/components/` + 46 unused shadcn/ui primitives in
`components/ui/`.

**Nine components are built but never rendered** (dead inventory, ~2,400 lines):
`AIShowcase` · `CaseStudies` · `DigitalMarketing` · `FoundersNote` ·
`HeroDashboard` · `HeroShowcase` · `NeuralBackground` · `Process` · `ThemeToggle`

(`FoundersNote` is documented in CLAUDE.md as intentionally unwired pending real
photos. The other eight look like abandoned iterations. `Process` is orphaned
even though the brief's §6E wants a process section — the rendered one lives
inside `ValueProposition`.)

---

## 2 — Anti-pattern inventory (measured, `src/` excluding `components/ui/`)

Every one of these is on the brief's §11 rejection list or §10 checklist.

| Pattern | Count | Brief requires |
|---|---:|---|
| Raw hex colours | **537** | 0 — tokens only |
| Tailwind arbitrary values (`[13.5px]`, `[#0a0a0a]`) | **673** | 0 |
| `rounded-full` | **118** | status dots + one badge only |
| `bg-gradient-*` | **85** | no decorative gradients |
| `box-shadow` / `shadow-[…]` | **68** | 0 outside one hero glow |
| Decorative blur orbs `blur-[Npx]` | **41** | 0 — explicitly rejected |
| `backdrop-blur` (glassmorphism) | **28** | 0 — explicitly rejected |
| Gradient text fills (`bg-clip-text`) | **16** | 0 |
| Emoji rendered as UI | **13 lines** | 0 |
| `rounded-3xl/2xl/xl` | 0 | — already clean |

Emoji locations: `Footer.tsx:172`, `SmeGrantBanner.tsx:26`,
`EnterpriseTrust.tsx:8`, `Contact.tsx:155`, `ProjectBuilder.tsx` ×6 (446, 953,
1044, 1089, 1107, 1115), `FloatingTech3D.tsx:4` (an entire icon set of
`⚡🚀🤖💎⚙️📊🎯✨`), `CountUp.tsx` (comments only).

---

## 3 — The brief's audit claims, verified

I checked each one rather than accepting it. Most hold; four need correcting.

**Confirmed:**

- **Zeros in the stat block.** Real, and slightly worse than described.
  `CountUp.tsx:39` sets the display to `0` whenever the element is *not* in
  view — so `50+` renders as `0+` and `100%` as `0%` until it scrolls in. It is
  not a race with hydration; it is deliberate.
- **Hero depends on JS to become visible.** `Hero.tsx` has five `initial={{ opacity: 0 }}`
  motion wrappers covering the eyebrow, headline, lead, claims and CTAs.
- **Theme toggle still present** (`Navbar.tsx:150`).
- **Only three routes.**
- **English only.**
- **Everything is `motion` scroll-reveal on opacity.**

**Needs correcting:**

1. **The display face is not Poppins/Quicksand — it is Typold Bold**, the DEEV
   brand face, self-hosted and subset. The brief's *diagnosis* (a geometric sans
   whose roundness reads friendly rather than engineered) is defensible, but
   §4.2 tells me to swap in Geist while `CLAUDE.md` says Typold is the brand
   wordmark face and must not drift. **Direct conflict — your call, see §6.**
2. **"Trust bar with no logos beneath it."** There are six real client logos
   (`feltes`, `mellys`, `netclean`, `picadilly`, `oscarsbar`, `stoffel`) in a
   marquee. They were at 45–50% opacity, which may be why they read as absent;
   I raised them to 65–70% earlier this week. Two further logos exist in
   `src/assets/clients/` but are **not** displayed: `alphagest`, `foyer`.
3. **"Light mode is the weaker of the two."** Agreed, and already actioned —
   the site now defaults to dark. The toggle still exists; the brief wants it
   gone entirely.
4. **"14 delivered projects" (§1) vs the site's "50+ Projects delivered"**
   (`EnterpriseTrust.tsx:6`). `Portfolio.tsx` holds ~15 entries and its filter
   chip reads `ALL 14`. The brief's §8 rule — *one claim, one proof* — makes
   this a blocker: **which number is true?** I will not pick one for you.

**Already passing** (worth knowing before Phase 1 sets budgets):

- First-load JS is **138.2 KB gzipped** (111.3 JS + 26.9 CSS) against the
  brief's <180 KB budget. Headroom exists, but a token layer plus SSR will eat
  into it.
- Per-route canonical/title/description shipped this week; `/contact` and
  `/legal` already serve their own prerendered documents.

---

## 4 — Files the redesign will touch

**Rewritten from scratch** (13): `Hero` `Navbar` `Footer` `ValueProposition`
`SystemStack` `Portfolio` `BillovioFeature` `EnterpriseTrust` `FinalCTA`
`ClientLogos` `SmeGrantBanner` `BenefitsPanel` `LuxembourgStrip`

**Chrome replaced, logic untouched** (1): `ProjectBuilder.tsx` — 1,100+ lines
and the brief's §6I is explicit that pricing logic is preserved. This is the
highest-risk file in the redesign; §10 wants a test asserting identical prices
against the current implementation, which I'd write *before* touching it.

**Restyled** (4): `Contact` `Legal` `CookieBanner` `RouteMeta` (unchanged logic)

**Replaced by the token layer** (4): `theme.css` `fonts.css` `tailwind.css`
`index.css`

**Deleted** (9 orphans + `FloatingTech3D` + likely most of `components/ui/`)

**Config** `index.html` (fonts, theme script), `vercel.json`,
`scripts/prerender-routes.mjs` (extends to new routes),
`src/lib/routeMeta.json`, `public/sitemap.xml`

**Untouched** `api/lead.ts`, `src/lib/analytics.ts`, `src/lib/supabase.ts`

---

## 5 — Values to tokenize

Grouped by what they become, not listed individually — 537 hexes collapse to a
much smaller real palette:

- **Blues** `#2563F6` `#3CE7FC` `#2F6FF8` `#1747C4` `#1B4FD8` `#558BFF` →
  `--signal` / `--signal-hi` / `--signal-dim`. Note the brief specifies
  `--signal: #2E6BFF`, which is *not* the brand book's `#2563F6`. Close, but a
  deliberate change I want confirmed.
- **Near-blacks** `#06060a` `#050509` `#08080c` `#0e0e18` `#111119` `#04040c` →
  `--surface-0…3`. Six ad-hoc values doing the job of four steps.
- **Slate scale** Tailwind `slate-*` throughout → `--text-hi/…/--text-low`
- **Functional** `#3DBE7A`-equivalent greens in the grant banner → `--positive`;
  the Luxembourg flag reds/blues stay as brand assets, not tokens.
- **Spacing/type** 673 arbitrary values → the §4.2/§4.3 scales.

---

## 6 — Decisions I need from you before Phase 1

1. **Stack.** SSR-prerender the existing Vite app (recommended), migrate to
   Next.js, or drop the server-HTML criterion?
2. **Typeface.** Brief says Geist; `CLAUDE.md` says Typold is the brand and must
   not drift. Which wins? (If Typold stays, §10's "zero rounded-geometric
   typefaces" needs rewording, and I'd still self-host Inter to kill the Google
   Fonts dependency.)
3. **Accent hex.** Brief's `#2E6BFF` or the brand book's `#2563F6`?
4. **Theme toggle.** Brief says delete it and ship dark-only. `CLAUDE.md`
   documents the toggle as a feature. Confirm removal?
5. **Projects: 14 or 50+?** Every downstream proof element depends on this.
6. **Branch.** The brief says `redesign/v2`; my standing instruction for this
   session is `claude/website-connection-status-kziv3w`. I'll use the latter
   unless you say otherwise — it is what your Vercel previews are wired to.
7. **Scope.** §8 adds `/work/[slug]`, `/services/[slug]` (×4), `/pricing`,
   `/about`, plus three locales — roughly ten new routes and a translation pass
   on top of a full visual rebuild. Ship the homepage redesign first and treat
   routes + i18n as a second project? (The blog you asked for slots in here too.)

---

## 7 — Proposed plan, adapted

Unchanged from the brief except where Vite forces it. Phases 2–5 as written.

- **Phase 1** — token layer as CSS custom properties consumed via Tailwind v4's
  `@theme`; self-host Inter (or the chosen display face); Playwright harness at
  390/768/1440/1920 writing to `.screens/`; a `/_design` route proving the scale.
  The harness is a small extension of the screenshot scripts already in use.
- **Phase 5** — Lighthouse and axe both run headless here, so the §10 evidence
  is producible in-session. Contrast will be verified by script per §4.1.

**Standing constraint the brief does not mention:** `CLAUDE.md` documents mobile
performance rules won the hard way — no `backdrop-filter` below 768px, blur
radii capped at 50px on mobile, continuous animation disabled on mobile. These
survive the redesign; they mostly align with the brief anyway, since it deletes
glassmorphism and blur orbs outright.

---

**Phase 0 complete. Awaiting your answers to §6 before creating the token layer.**
