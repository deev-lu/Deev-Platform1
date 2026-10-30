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
**Design language since 30 Oct 2026: like nvision.lu, in DEEV's colours**
(the owner's request; `src/styles/design.css`, which overrides the older
brand-book bans in tokens.css on purpose): a charcoal ground (`--surface-0`
#121319) lit by slowly drifting orbs of Electric Blue, deep navy, Sky and a
little Cyan (`OrbField.tsx`, fixed behind every page — so page and section
wrappers carry no opaque background); huge Typold headlines whose second
sentence / highlight runs in a moving blue-to-cyan gradient (`.g-text`);
gradient pill buttons with a glow (`.btn-grad`, also applied automatically
to pills filled with `var(--signal)`), hairline pills that fill on hover
(`.btn-ghost`); dark rounded cards that lift, glow and draw a blue-to-cyan
bottom edge on hover (`.card-glow`, `.card-arrow`); headings and cards rise
in on scroll and dim as they leave (scroll-driven CSS, `reveal`); floating
glass-pill navigation. **Never purple or magenta** — that is nvision's
colour and a competitor's. Text contrast is measured against the brightest
orb glow, so keep orb alphas where they are (design.css, tokens.css).

Navbar (two floating glass pills: the mark + DEEV, which folds to the mark
on scroll; navigation, language, theme, phone and the intro-call button) →
Hero (no photo: the orbs, "We build / <rotating word> / for Luxembourg
businesses." with the real <h1> sr-only, lead, buttons, offer card, "scroll
to explore") → HomeClients (a 3D coverflow carousel of real client logos
only, arrows, dots, swipe, auto-advance every 3s with its own pause; the list
and each logo's filter live in `clients` in ClientLogos.tsx — a new client
comes with its file)
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
(the hero until 30 Oct 2026, now unused: the Adolphe bridge and the
Spuerkeess tower), `adolphe-tram-*` (05, a
tram on the same bridge), `gelle-fra-*` (02, workshops), `philharmonie-*`
(06, the company) and `kirchberg-aerial-*` (the earlier hero, rooftop
lettering retouched out; kept, not used). They were sized and compressed at export
(WebP); keep any replacement under ~250KB for the hero and ~150KB elsewhere.

**Hero (since 30 Oct 2026):** the visible title is decorative
(aria-hidden): "We build", one of `home.intro.rotate` (words taken from the
lead, never new claims) rolling every 2.6s in `.g-text`, then the accent
line; it stands still under reduced motion and "Pause motion" (top right).
The real <h1> is the old sentence, sr-only.

**Section ticks** (`SectionTicks.tsx`, homepage, from 1024px): one line per
`main section[id]` that has an eyebrow, the current one long and in the
gradient, its name on hover/focus; real links in a named nav.

**Card hover:** service (02) and portfolio (04) cards fill with a blue flow on
hover (`.m-flowcard`) and glow (`.card-glow`); other cards glow and draw the
edge. Founders' cutouts stand in front of two blue/cyan rounded shapes.

**Effects added 30 Oct 2026** (design.css, "More motion"; all off under
reduced motion, "Pause motion" and Klar Access): a pointer light that follows
the mouse across every `.card-glow` and a slight tilt of the portfolio
screenshots (`[data-tilt]`), both fed by `lib/pointerFx.ts` (one listener,
mouse/pen only); the main `.btn-grad` leans a few px towards the pointer and
a band of light crosses it on hover; a 2px reading-progress line along the
top (`.scroll-progress` in OrbField, scroll-driven); from 768px section
headings sharpen from a slight blur as they rise and the eyebrow rule draws
in; the hero's "We build" and accent lines rise out of a mask once on load;
`HeroNetwork.tsx` (from 1024px) draws nodes and links behind the hero with
packets of light running along them; the workshop proof figures and the
funding figures count up (`CountUp`, never from zero).

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
- **The DEEV look** (`src/lib/klarAccessTheme.ts`) is a stylesheet appended to
  the widget's shadow root on `klar-access:ready`, after its own sheet: brand
  fonts, the site's surfaces and ink, Electric Blue fills, radii 12/20, a navy
  button with the blue ring. `data-deev-theme` on the host follows the site
  theme. It restyles only; the button's size and corner offsets stay the
  widget's, and under forced colours the widget's own rules apply.
- **The bottom-right corner belongs to its button** (56px, 24px from the
  edge; 20px on phones). Floating UI keeps clear of it: the WhatsApp button
  sits at `right-[96px]`, the phone contact bar reserves `pr-[92px]` and is
  tall enough to hold it, the cookie bar and dialog footer reserve the corner.
- Its "Bewegung reduzieren" sets `html[data-ka-motion]` and pauses CSS
  animations; it is the same state as the site's own "Pause motion"
  (`lib/motionPref.ts`, see Accessibility below): motion.css runs every
  animation to its end instead of freezing fade-ins invisible, and
  `useMotionPaused()` stops the hero's YouTube film and puts motion
  components into reduced motion (MotionConfig in App).
- Its "Textgröße" scales the root font size. Under `html[data-ka-size]`
  Tailwind's `--spacing` is pinned to 4px (fonts.css) so gaps do not grow
  off the screen, and the navbar switches to its compact form
  (`useLargeText()`).
- Its own "skip to main content" button is hidden by the theme sheet: the
  site's SkipLink does that job, in the page language and without the
  widget.
- It stores `klar-access:v1` in localStorage; the cookie dialog lists it.
- Never present the widget as making the site accessible or compliant.

## Accessibility (target: WCAG 2.2 AA, since 29 Oct 2026)
The site has to be accessible as it is; Klar Access is a comfort on top,
never the reason something passes. ACCESSIBILITY.md holds the audit: what
was checked, fixed and tested, and what is still open (a screen-reader pass
among them). Do not claim conformance on the site; no statement page exists,
that is the owner's call.
- **Contrast:** text 4.5:1 on every surface it sits on, both themes;
  `--text-low` is the quietest text colour. Dim by colour, never by opacity.
  Form fields, switches and checkboxes outline in `--line-control` (3:1,
  WCAG 1.4.11); `--line`/`--line-strong` are decorative hairlines only.
  Focus ring: Electric Blue on light, Cyan on dark (`:focus-visible`).
- **Landmarks and keyboard:** every page has `<header>`, one `<main>`,
  `<footer>`. SkipLink (first in the site's tab order) lands on `#main`;
  after a route change RouteAnnouncer moves focus there and announces the
  title. `html` carries `scroll-padding` so the navbar, the cookie bar and
  the phone contact bar never cover the focused element (`--fixed-bottom`).
- **Menus:** desktop panels open from their chevron button only (never on
  focus), sit in the DOM right after it, close on Escape with focus back on
  the button. The phone drawer is a disclosure (`aria-expanded`, Escape).
  Pages in menus are links, not buttons.
- **Modals** use `lib/useModal.ts` (focus in, Tab trapped, Escape, focus
  back): the cookie preferences and the calculator's lead form. New modals
  use it too, with role="dialog", aria-modal and a label.
- **Forms:** a visible `<label>` for every field (placeholders are examples,
  never the label), `autoComplete`, "* required" explained above the form
  (`site.a11y.requiredNote`), errors in `role="alert"`, and focus moves to
  the confirmation when a form is replaced by it.
- **Motion (2.2.2):** anything that moves by itself for more than five
  seconds stops with "Pause motion" (MotionToggle: hero top right and
  footer; `motion-paused` on <html>, applied before paint in index.html).
  Components use `useReduceMotion()` from motionPref, never motion's
  `useReducedMotion()` directly.
- **Names (2.5.3):** an `aria-label` starts with the visible text, or the
  visible text is the name. A `<dl>` holds only dt/dd groups.
- **Tests:** `npm run build && npm run test:a11y` (Playwright + axe-core,
  tests/e2e, desktop and phone; first time `npx playwright install
  chromium`). Zero violations is the bar; it is not a conformance proof.

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
3. **Continuous animations are disabled on mobile** via `useIsMobile()`
   and the `min-width: 768px` guards in design.css (orbs, gradient shift,
   scroll cue). The client carousel advances on phones too (an interval, not
   a loop; it replaced the marquee the owner wanted moving on phones).
4. **Images must be resized before committing.** Client logos were 200KB+ each
   until they were downscaled to display size.
5. The hero has had **no photo and no film since 30 Oct 2026** (the
   nvision-style redesign); `HeroVideo.tsx` is gone and the cookie policy's
   "Embedded video" no longer mentions an autoplaying film (only the
   click-to-play videos in "In motion"). If a film ever comes back, the
   policy has to say so again in all three languages. The orbs are
   pre-blurred radial gradients moved by transforms (no filter, no canvas),
   still below 768px.

## Theme
Dark is the default since the redesign; light is available via the navbar
toggle and the choice is stored in `localStorage` under `theme`. The theme is
applied before paint by an inline script in `index.html` to avoid a flash.
If you change the default, change it in **both** `index.html` and `App.tsx`.
Dark (since 30 Oct 2026): charcoal #121319 with cards #1a1c24, text-low
#a6adb7 and accent type #6cb8ff, both chosen to keep 4.5:1 over the brightest
orb glow. Light (reworked 29 Oct 2026): a cool paper ground (`--surface-0`
#f6f7fb) under white cards, navy ink (`--text-hi` #0b1530), paler orbs, and
gradients running navy → Electric Blue → deep teal (`.g-text`). The page
colour sits on <html>; <body> stays transparent, or it would paint over the
orbs. Dark panels on a light page (`data-surface="dark"` plus `.dark`) keep
the dark rules. The navbar reads the surface under it at y=34, skipping
itself, so its pills turn dark over a dark panel only.

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
