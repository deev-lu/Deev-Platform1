# DEEV Business Hub

The CRM with AI agents for real-estate agents. Presented publicly as
**Business Hub** at `/business-hub` (EN/FR/DE); the app itself runs at `/hub`.
Built from scratch in this repository (13 Nov 2026); it shares no code with the
MBM CRM.

## What it is

| Part | Where | What |
|---|---|---|
| Public page | `src/app/components/BusinessHubPage.tsx`, copy in `pages.hubPage` | Part of the website: prerendered, in the sitemap, linked from the footer |
| App | `hub.html` → `src/hub/` | Its own Vite entry and bundle (the website never loads it). Vercel rewrites `/hub/*` to `hub.html` |
| Database | `supabase/migrations/20261113000000_business_hub.sql` | Supabase (Postgres + Auth), one project, many agencies |
| AI agents | `api/hub/agent.ts` + `api/_hub/` | One Vercel function, Claude via the Anthropic SDK |

### In the app
- Sign up, sign in, password reset (Supabase Auth); step two names the agency
  (`create_workspace()`), which also writes a starting pipeline in EN/FR/DE.
- **Overview** (open leads, new this week, listings, tasks due, AI calls left),
  **Pipeline** board (drag, or a "Move to" menu on every card for keyboard and
  screen readers), **Lead** page, **Contacts** (with dated marketing consent,
  JSON export and delete for GDPR requests), **Listings** with listing texts in
  three languages, **Tasks**, **Timeline** on every record, **Settings** (rename
  the agency, team and roles: owner, admin, agent).
- Interface in English, French and German; light and dark (the website's
  `theme` key); Klar Access loads as on the website.
- **Demo** (`/hub/demo`, or the button on the sign-in page): the whole app in
  memory with invented sample data, announced on every screen; a reload ends it.
  The AI agents do not run in the demo.

### The AI agents (`api/_hub/agents.ts`)
| Agent | Does | Writes to the CRM |
|---|---|---|
| `lead_brief` | Scores a lead 0-100, summary, missing info, next step, follow-up email in the client's language | score, summary and date on the lead; one "AI" line on its timeline |
| `matches` | Rules shortlist the agency's available listings (`prefilter`), Claude ranks up to 5 and explains | nothing |
| `listing` | Listing texts in EN/FR/DE from the facts entered | nothing (the agent reviews and saves) |
| `email` | An email for a stated purpose | nothing |
| `copilot` | Chat over the CRM with tools (`api/_hub/tools.ts`): search contacts, list/get leads, search listings, list tasks; create a task, add a note when asked | tasks and notes, reported back in the reply |

- Every call runs **as the signed-in user**: the function passes the person's
  Supabase token to every query, so Row Level Security limits the agents to
  that one agency. There is no service-role key anywhere.
- Order of checks: signed in → member of the workspace → calls left today →
  run → count it (`ai_runs`, tokens only, no prompt text). Daily limit per
  agency: `workspaces.ai_daily_limit` (150 by default).
- Model: `claude-opus-5-5` (override with `HUB_MODEL`), adaptive thinking,
  effort medium (low for listing texts and emails), structured JSON output
  checked against a schema for the four task agents, the SDK's tool runner
  (max 8 steps) for the copilot. Server-side refusal fallback is on
  (`fallbacks: "default"`).
- Prompts forbid inventing facts: missing data is called missing, and emails
  leave `[placeholders]`. The UI labels every result as a draft to check.

## Going live (the owner's steps)

1. **Supabase project.** Create `deev-business-hub` in **Frankfurt
   (eu-central-1)** — the public page says the data is stored in the EU. In the
   SQL editor, run `supabase/migrations/20261113000000_business_hub.sql`.
2. **Auth settings** (Supabase → Authentication → URL configuration): Site URL
   `https://www.deev.lu/hub/`; redirect URLs `https://www.deev.lu/hub/**` and,
   for previews, `https://*-deevagency.vercel.app/hub/**`. Keep "Confirm email"
   on. For real volumes, set your own SMTP (e.g. Resend) so confirmation mails
   come from deev.lu.
3. **Vercel env vars** (Production and Preview): `VITE_HUB_SUPABASE_URL`,
   `VITE_HUB_SUPABASE_ANON_KEY` (Supabase → Settings → API), and
   `ANTHROPIC_API_KEY` (server only). Redeploy: the `VITE_` values are read at
   build time.
4. **Privacy policy.** The Hub processes account data and agencies' client data,
   and sends CRM excerpts to Anthropic (Claude) when an agent runs. The
   website's privacy policy does not cover this yet; it needs a section (and a
   data processing agreement for agencies) written or checked by whoever owns
   the legal texts. Not written here on purpose.
5. **Pricing.** None exists. The app and the page say "early access, nothing
   charged without your agreement". Billing (Stripe) comes when plans are set.

Until step 3, `/hub` shows "sign-in is not connected yet" and offers the demo;
`/api/hub/agent` answers 503.

## Tests
```bash
npm test                      # includes api/__tests__/hub.test.ts
scripts/test-hub-db.sh        # migration + 24 RLS checks on a local Postgres 15+
npm run build && npm run test:a11y
```
`supabase/tests/supabase_stub.sql` fakes just enough of Supabase (roles,
`auth.users`, `auth.uid()`) to run the migration on plain Postgres; never apply
it to Supabase. The RLS checks cover: agencies isolated both ways, no writes
into a foreign agency, no cross-agency references, agents cannot change roles,
the pipeline or another member's row, the last owner cannot leave, AI usage
cannot be logged in someone else's name, and visitors who are not signed in
reach nothing.

## Not built yet
Invitations by email (today a colleague signs up, then an admin adds them by
email), billing, document storage and photos, portal feeds (athome.lu,
immotop.lu), calendar sync, email sending from the app (drafts are copied),
streaming replies in the copilot.
