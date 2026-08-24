# DEEV — marketing website

Live: **https://www.deev.lu** (Vercel). Single-page React app.

## Stack
- **React 18 + TypeScript + Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`, no tailwind.config — utilities only)
- **motion/react** (Framer Motion) for animation
- **react-router** — routes: `/`, `/contact`, `/legal`
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
Navbar → Hero → ClientLogos → SmeGrantBanner → Services (`ValueProposition`)
→ SystemStack → Portfolio → BillovioFeature → ProjectBuilder → EnterpriseTrust
("Why Deev") → FoundersNote ("About") → LuxembourgStrip → FinalCTA → Footer

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
- Corners are deliberately sharp: `rounded-lg` / `rounded-md`, not `rounded-3xl`
- Headings are `font-medium`, not bold — restrained/premium, not shouty

## Performance rules — please don't undo these
Mobile load was a real problem and these fixed it:
1. **No `backdrop-filter` below 768px.** It's the single biggest paint/scroll
   cost on iOS Safari. `fonts.css` force-disables it on mobile.
2. **Decorative blur radii are capped to 50px on mobile.**
3. **Continuous animations are disabled on mobile** via `useIsMobile()`.
4. **Images must be resized before committing.** Client logos were 200KB+ each
   until they were downscaled to display size.
5. Hero background video is **desktop-only** (poster image on phones),
   `preload="none"`.

## Theme
Dark is the default since the redesign; light is available via the navbar
toggle and the choice is stored in `localStorage` under `theme`. The theme is
applied before paint by an inline script in `index.html` to avoid a flash.
If you change the default, change it in **both** `index.html` and `App.tsx`.

## Content that needs real assets (do not invent)
- `src/app/components/FoundersNote.tsx` ("10 / Who you'll work with") is wired
  into App.tsx between Why Deev and the Luxembourg strip. It finds its photos by
  filename: drop `fabio.*` and `sven.*` into `src/assets/team` and they appear,
  no import needed. Until **both** files land the section is not in the page
  at all and the navbar drops its "About" link with it (`TEAM_READY` in
  `src/lib/team.ts`): one real portrait beside an empty frame reads worse than
  no section, and a stand-in silhouette would be inventing a person. The portraits are cutouts on a
  transparent ground, so they are `object-contain object-bottom` on a surface
  panel, never cropped into a square.
- Testimonials: not built. Only add **real** client quotes — never write
  placeholder testimonials with real names attached.

## Env vars (set in Vercel, not committed)
- `RESEND_API_KEY` — server-side, used by `api/lead.ts` to email contact@deev.lu
