# DEEV — marketing website

Live: **https://www.deev.lu** (Vercel). Single-page React app.

## Stack
- **React 18 + TypeScript + Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`, no tailwind.config — utilities only)
- **motion/react** (Framer Motion) for animation
- **react-router** — routes: `/`, `/work`, `/work/:slug`, `/blog`,
  `/blog/:slug`, `/contact`, `/legal`, each also under `/fr` and `/de`
- No backend. Lead emails go through a Vercel Edge Function (`api/lead.ts`) → Resend.

## Commands
```bash
npm install
npm run dev      # local dev on :5173
npm run build    # production build to dist/
```

## Deploying
```bash
npx vercel --prod --archive=tgz --yes
```
`--archive=tgz` matters: plain uploads have failed on flaky connections; the
tarball upload is reliable. Deploys alias to www.deev.lu automatically.

**Commit author must be a real GitHub account email** (e.g. contact@deev.lu).
Vercel blocks deploys when the commit email doesn't match a GitHub account.

## Layout of the page (src/app/App.tsx)
High-end positioning since October 2026: software and AI lead, websites are
design "by invitation". No project budget figure is shown publicly.
The homepage follows the brand book (DEEV-REDESIGN-BRIEF.md, tokens.css):
dark, hairlines instead of cards, one accent (Electric Blue fills, Sky for
accent type), real photography in full bleed or square corners, graded with
`.m-grade`.

Navbar → Hero (full-bleed photo) → HomeClients (real logos, one hairline row)
→ HomeDisciplines (01, three cards with plates) → HomeWorkshops (02,
workshops & consulting sold as a service of their own — the entry to most
projects; every claim repeats the AI page) → AiFilm ("AI at work") → SelectedWork (03, a bento of five projects: each
screenshot in a browser frame with its domain) → InMotion (04) → HomeOutro:
engagements (05, a photo and the flow plate; carries the #pricing /
#project-builder campaign anchors) · HomeCompany (06, #about) · closing
invitation (07) → Footer

The numbered `NN /` eyebrows follow that order. Moving a section means
renumbering the ones after it, or the sequence reads 01, 10, 02.
Homepage motion lives in `src/styles/motion.css` (CSS only; loops run from
768px up; reduced motion shows the finished state). The film is a coded
sequence, not a video file; its names and figures are invented and labelled.

**Photographs in `src/assets/photos`.** From the owner: `hero-adolphe-*`
(hero: the Adolphe bridge and the Spuerkeess tower), `adolphe-tram-*` (05, a
tram on the same bridge), `gelle-fra-*` (02, workshops), `philharmonie-*`
(06, the company) and `kirchberg-aerial-*` (the earlier hero, rooftop
lettering retouched out; kept, not used). They were sized and compressed at export
(WebP); keep any replacement under ~250KB for the hero and ~150KB elsewhere.

**Hero (since 13 Oct 2026):** a smaller title whose fill flows from
near-white into Electric Blue (`.m-flow` / `.m-flow-deep` in motion.css — the
owner asked for it, so the brief's "no gradient text" is lifted for the hero
title and, in the dark theme only, the claim of two-tone section headings via
`.m-flow-dark`). Full bleed on phones (only the bottom corners round), an
inset rounded panel from 768px.

**Card hover:** service (01) and portfolio (02) cards fill with a blue flow on
hover (`.m-flowcard`), text and pills turn white, the button turns white with
blue text.

Everything below the fold is `React.lazy` + `Suspense` for first-paint speed.

## Brand (from the brand book — do not drift)
- **Blue `#2563F6`**, **Cyan `#3CE7FC`**. Never purple (that's a competitor).
- **Typold Bold** — display headings + the DEEV wordmark (`.font-brand`)
- **JetBrains Mono** — small technical labels (`.eyebrow-mono`)
- **Inter** — body copy
- Fonts are self-hosted + subset in `public/fonts/`, preloaded in `index.html`.
- Wordmark is always **DEEV** (caps).

## Design system (src/styles/fonts.css)
- `.glass` / `.glass-edge` / `.glass-sheen` — Apple-style clear glass surfaces
- `.eyebrow-mono` — numbered section markers (`01 / What we build`)
- `.stat-outline` — big hollow outlined numerals
- `.animate-drift` — slow Ken Burns motion for full-bleed photography
- Corners are **soft and measured** since 13 Oct 2026 (the owner retired the
  brief's 4px cap): `--radius-1` 12px for buttons and inputs, `--radius-2`
  20px for cards and images, `--radius-3` 28px for full-width panels (the hero
  and the workshops band are inset panels). Main CTAs are pills. `tokens.css`
  maps `rounded-md` / `rounded-lg` / `rounded-sm` onto the same scale.
- **Signal Lumen plates** (`src/assets/visuals/*.svg`, rendered by
  `Plate.tsx`): four drawings made by rule — strata (software), retrieval (AI
  and data), proportion (design), flow (delivery) — each with one point of
  light. They are drawn for a dark ground; keep the panel around them dark in
  both themes. Inlined, not `<img>`, so their mono labels use the site font.
- Headlines of two sentences are two-tone (`TwoTone` in `Plate.tsx`): the
  claim in full white, the rest a step quieter. `h1`–`h3` use
  `text-wrap: balance`.
- Headings are `font-medium`, not bold — restrained/premium, not shouty

## Performance rules — please don't undo these
Mobile load was a real problem and these fixed it:
1. **No `backdrop-filter` below 768px.** It's the single biggest paint/scroll
   cost on iOS Safari. `fonts.css` force-disables it on mobile.
2. **Decorative blur radii are capped to 50px on mobile.**
3. **Continuous animations are disabled on mobile** via `useIsMobile()`.
4. **Images must be resized before committing.** Client logos were 200KB+ each
   until they were downscaled to display size.
5. The hero photo ships a 900px WebP to phones (`srcSet`). If it becomes a
   video, the video is **desktop-only** (poster image on phones),
   `preload="none"`.

## Theme
Dark is the default since the redesign; light is available via the navbar
toggle and the choice is stored in `localStorage` under `theme`. The theme is
applied before paint by an inline script in `index.html` to avoid a flash.
If you change the default, change it in **both** `index.html` and `App.tsx`.

## Content that needs real assets (do not invent)
- The founders appear as two portrait cards under "Leadership" in
  `HomeCompany.tsx` (05), beside the company facts: a company, not a
  two-person show, but with real faces. `FoundersNote.tsx` is no longer
  on the homepage. The portraits are found by filename: drop `fabio.*` and
  `sven.*` into `src/assets/team` and they appear, no import needed. Until
  **both** files land the row is left out and the navbar drops its "About"
  link (`TEAM_READY` in `src/lib/team.ts`): one real portrait beside an empty frame reads worse than
  no section, and a stand-in silhouette would be inventing a person. The portraits are cutouts on a
  transparent ground, so they are `object-contain object-bottom` on a surface
  panel, never cropped into a square.
- Testimonials: not built. Only add **real** client quotes — never write
  placeholder testimonials with real names attached.

## Env vars (set in Vercel, not committed)
- `RESEND_API_KEY` — server-side, used by `api/lead.ts` to email contact@deev.lu

## The blog (`/blog`)

Articles live in `src/lib/news.data.json`, all three languages side by side.
The `Article` type requires every locale, so a piece cannot ship in one
language and be missing in another — the build fails instead.

Bodies are **blocks**, not markdown or HTML: `{p}`, `{h}`, `{list}`, `{code}`,
`{note}`. They render as elements, so nothing a translator writes can break the
page or inject markup, and there is no parser to maintain. Add a block type in
`src/lib/news.ts` and `NewsArticle.tsx` if a piece genuinely needs one.

Adding an article is one entry in that file. It appears in `/blog`, in the
homepage teaser (the three most recent), in the sitemap and as its own
prerendered document per language, with `BlogPosting` structured data carrying
its publication date. No code change.

The components and data files keep the `news` name (`news.data.json`,
`NewsIndex`, `NewsArticle`, `NewsTeaser`) while the route and every label say
Blog. Renaming them buys nothing and would churn the diff; the user-facing
name is the one that matters. `/news` redirects to `/blog` in all three
languages.

**Article content is the studio's own claims.** Funding figures repeat what the
rest of the site says about the SME packages; those terms change, so check them
against Luxinnovation before relying on them. Never write an article asserting
a client's numbers, or a third party's, without a source.
