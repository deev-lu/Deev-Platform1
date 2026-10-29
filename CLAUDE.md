# DEEV — marketing website

Live: **https://www.deev.lu** (Vercel). Single-page React app.

## Stack
- **React 18 + TypeScript + Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`, no tailwind.config — utilities only)
- **motion/react** (Framer Motion) for animation
- **react-router** — routes: `/`, `/services/*`, `/workshops`, `/about`, `/sme-packages`,
  `/project`, `/work`, `/work/:slug`, `/blog`, `/blog/:slug`, `/contact`,
  `/legal`, each also under `/fr` and `/de`
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

Navbar (with phone number and a Contact button) → Hero (full-bleed photo) →
HomeClients (a marquee of real client logos only; the list and each logo's
filter live in `clients` in ClientLogos.tsx — a new client comes with its file)
→ HomeWorkshops (01, since 27 Oct 2026 the first section: workshops &
consulting sold as a service of their own and the entry to most projects —
an inset blue panel with the executive concept drawn as a document, the
three formats on hairlines and the property-management concept as 7 / 7 / 30;
every claim repeats the AI page) → HomeDisciplines (02, three cards with
plates) → HomeSecurity (03, #cybersecurity: awareness training for teams and
management and a first NIS2 check, led by Noah Stelmes; NIS2 is cited by
article from Directive (EU) 2022/2555 only — no Luxembourg dates, deadlines
or authorities, the sources disagreed when it was written) → HomeFunding (an
unnumbered band with the three SME Package figures, linking to /sme-packages)
→ AiFilm ("AI at work") → SelectedWork (04, a bento of five projects: each
screenshot in a browser frame with its domain) → InMotion (05) → HomeOutro:
engagements (06, a photo and the flow plate; carries the #pricing /
#project-builder campaign anchors) · HomeCompany (07, #about) · closing
invitation (08) → Footer

The numbered `NN /` eyebrows follow that order. Moving a section means
renumbering the ones after it, or the sequence reads 01, 10, 02.
Homepage motion lives in `src/styles/motion.css` (CSS only; loops run from
768px up, except the client marquee, which runs everywhere; reduced motion
shows the finished state). The film is a coded
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

## Leads (since 24 Oct 2026, "a lead machine")
- **One main button everywhere: the free intro call** (`nav.cta`, hero), to
  `/contact?interest=call`. Every other contact button opens the form on its
  own option: `?interest=workshop|ai|software|funding|website|marketing|security`
  (`INTEREST_KEYS` in Contact.tsx maps a key to `pages.contact.interests` by
  position — keep the arrays in the same order in all three languages).
- **`/workshops`** (WorkshopsPage.tsx) is the landing page for the workshop
  offer, with its own request form. Only claims the homepage, the AI page and
  the workshop article already make; no price or duration until the owner
  gives them.
- **`BOOKING_URL`** in `src/lib/booking.ts`: empty until the owner creates a
  Cal.com/Calendly link; set it and "pick a time" buttons appear on /workshops.
- **Every enquiry reports its origin** (`src/lib/leadSource.ts`, added inside
  `sendLead`): the page it was sent from, the landing page, the outside
  referrer and UTM tags. Held in memory only, no storage, no consent needed;
  the form notice and the privacy policy say so.
- **Clicks on phone, WhatsApp and email links** are a GA event
  (`contact_click`), consent permitting, from one listener in analytics.ts.
- The `/sme-packages` eligibility check ends in a "send me the result" form.
- **Phones get a contact bar along the bottom** (`MobileActionBar.tsx`):
  call, WhatsApp and the free intro call, after about one screen of
  scrolling and once the cookie choice is made; not on /contact. It replaces
  the floating WhatsApp button below 768px, and an 84px spacer under the
  footer keeps the last links clear of it.
- The contact form autofills on phones, and a call-back request needs no
  message.
- The cookie banner's first layer is a slim bottom bar: the old card covered
  the hero headline and buttons on every first visit.

## Klar Access (accessibility menu, the owner's own tool, since 29 Oct 2026)
- The four files live in `public/klar-access/` (served at `/klar-access/`).
  They are the owner's tool: replace them as a set, don't edit them here.
- Loaded once, after hydration, from App's first effect (`loadKlarAccess` in
  `src/lib/klarAccess.ts`): German menu (`data-lang="de"`), bottom right,
  decorative accent Electric Blue (`data-color`). It mounts outside #root and
  guards itself via `window.KlarAccess`.
- **The bottom-right corner belongs to its button** (56px, 24px from the
  edge; 20px on phones). Floating UI keeps clear of it: the WhatsApp button
  sits at `right-[96px]`, the phone contact bar reserves `pr-[92px]` and is
  tall enough to hold it, the cookie bar and dialog footer reserve the corner.
- Its "Bewegung reduzieren" sets `html[data-ka-motion]` and pauses CSS
  animations; motion.css then shows finished states (fade-ins would otherwise
  freeze invisible), `useKlarMotion()` stops the hero's YouTube film and puts
  motion components into reduced motion (MotionConfig in App).
- It stores `klar-access:v1` in localStorage; the cookie dialog lists it.
- Never present the widget as making the site accessible or compliant.

## Brand (from the brand book — do not drift)
- **Blue `#2563F6`**, **Cyan `#3CE7FC`**. Never purple (that's a competitor).
- **Typold Bold** — display headings + the DEEV wordmark (`.font-brand`)
- **JetBrains Mono** — small technical labels (`.eyebrow-mono`)
- **Inter** — body copy
- Fonts are self-hosted + subset in `public/fonts/`, preloaded in `index.html`.
- Wordmark is always **DEEV** (caps).

## Design system (src/styles/fonts.css)
- `.glass` / `.glass-edge` / `.glass-sheen` — Apple-style clear glass surfaces
- **Homepage spacing:** every homepage section pads by `--section-pad`
  (tokens.css) above and below, so neighbours always sit the same distance
  apart; coloured panels use 1.25x inside, the funding band 0.5x. Don't put
  `--section-y-lg` back on homepage sections: two of them back to back made
  gaps of up to 560px.
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
   One exception, the owner's decision on 25 Oct 2026: the client marquee
   (`.m-marquee-track`) runs on phones too. It is a single CSS transform.
4. **Images must be resized before committing.** Client logos were 200KB+ each
   until they were downscaled to display size.
5. The hero photo ships a 900px WebP to phones (`srcSet`) and stays under
   the hero film as its poster. The film (`HeroVideo.tsx`, YouTube
   3j4eSVrLtmw, muted, 0:10 to 1:10 and then back to 0:10) plays on **every
   screen size** since 24 Oct 2026 — the owner's decision, which lifts the old
   desktop-only rule — and never under reduced motion. It autoplays for every
   visitor without consent (owner, 23 Oct 2026), and the cookie policy
   ("Embedded video", all three languages) says so. Change one, change both.

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
- **/about** (AboutPage.tsx) shows everyone in `TEAM` (`src/lib/team.ts`):
  Fabio Falchero and Sven Kettel (co-founders) and Noah Stelmes
  (cybersecurity and data). Same filename rule: `noah.*` in `src/assets/team`
  and his photo appears; until then his card shows his initials, a
  typographic placeholder rather than a stand-in face. The homepage company
  section (06) links to it ("Meet the team").
- **Google rating in the hero** (`HeroReviews` in Hero.tsx): stars, the
  average and the review count, linking to the Google profile. Shown only
  once `GOOGLE_REVIEWS` in `src/lib/reviews.ts` holds the real figures from
  the owner's Google Business Profile; never estimated. Static, so update it
  when the rating changes.
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
