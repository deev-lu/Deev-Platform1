# DEEV Business Hub

The CRM with AI agents for SMEs. Presented publicly as **Business Hub** at
`/business-hub` (EN/FR/DE); the app itself runs at `/hub`. Built from scratch
in this repository (13 Nov 2026); it shares no code with the MBM CRM.

General on purpose (the owner's decision, 13 Nov 2026): a real-estate-only
edition is planned later, together with a partner, as its own system. Keep
this one free of industry-specific fields.

## What it is

| Part | Where | What |
|---|---|---|
| Public page | `src/app/components/BusinessHubPage.tsx`, copy in `pages.hubPage` | Part of the website: prerendered, in the sitemap, linked from the footer |
| App | `hub.html` → `src/hub/` | Its own Vite entry and bundle (the website never loads it). Vercel rewrites `/hub/*` to `hub.html` |
| Database | `supabase/migrations/20261113000000_business_hub.sql` | Supabase (Postgres + Auth), one project, many companies |
| AI agents | `api/hub/agent.ts` + `api/_hub/` | One Vercel function, Claude via the Anthropic SDK |

### In the app
- Sign up, sign in, password reset (Supabase Auth); step two names the company
  (`create_workspace()`), which also writes a starting pipeline in EN/FR/DE:
  New, Contacted, Proposal, Negotiation, Won, Lost.
- **Overview** (open deals, open pipeline value, won this month, tasks due, AI
  calls left), **Pipeline** board (drag, or a "Move to" menu on every card for
  keyboard and screen readers), **Deal** page (value excl. VAT, expected close,
  what the customer needs, notes), **Contacts** (lead, customer, partner,
  supplier; company and job title; dated marketing consent, JSON export and
  delete for GDPR requests), **Products & services** (the catalogue: price per
  item, hour, day, month, year or project, or "on request"), **Tasks**,
  **Timeline** on every deal and contact, **Settings** (rename the company,
  team and roles: owner, admin, member).
- Interface in English, French and German; light and dark (the website's
  `theme` key); Klar Access loads as on the website.
- **Demo** (`/hub/demo`, or the button on the sign-in page): the whole app in
  memory with invented sample data (a small services company), announced on
  every screen; a reload ends it. The AI agents do not run in the demo.

### The AI agents (`api/_hub/agents.ts`)
| Agent | Does | Writes to the CRM |
|---|---|---|
| `deal_brief` | Scores a deal 0-100, summary, missing info, next step, follow-up email in the contact's language | score, summary and date on the deal; one "AI" line on its timeline |
| `proposal` | A proposal from the deal's needs: Claude picks catalogue items by id and writes the text; `priceLines()` adds names, prices and totals from the catalogue only (unknown ids dropped, no price → "to be priced") | nothing (copied by the user) |
| `email` | An email for a stated purpose | nothing |
| `copilot` | Chat over the CRM with tools (`api/_hub/tools.ts`): search contacts, list/get deals, search the catalogue, list tasks; create a task, add a note when asked | tasks and notes, reported back in the reply |

- Every call runs **as the signed-in user**: the function passes the person's
  Supabase token to every query, so Row Level Security limits the agents to
  that one company. There is no service-role key anywhere.
- Order of checks: signed in → member of the workspace → calls left today →
  run → count it (`ai_runs`, tokens only, no prompt text). Daily limit per
  company: `workspaces.ai_daily_limit` (150 by default).
- Model: `claude-opus-5-5` (override with `HUB_MODEL`), adaptive thinking,
  effort medium (low for emails), structured JSON output checked against a
  schema for the three task agents, the SDK's tool runner (max 8 steps) for the
  copilot. Server-side refusal fallback is on (`fallbacks: "default"`).
- Prompts forbid inventing facts: missing data is called missing, emails leave
  `[placeholders]`, proposals state no prices in the text. The UI labels every
  result as a draft to check.

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
4. **Privacy policy.** The Hub processes account data and companies' customer
   data, and sends CRM excerpts to Anthropic (Claude) when an agent runs. The
   website's privacy policy does not cover this yet; it needs a section (and a
   data processing agreement for customers) written or checked by whoever owns
   the legal texts. Not written here on purpose.
5. **Pricing.** None exists. The app and the page say "early access, nothing
   charged without your agreement". Billing (Stripe) comes when plans are set.

Until step 3, `/hub` shows "sign-in is not connected yet" and offers the demo;
`/api/hub/agent` answers 503.

## Tests
```bash
npm test                      # includes api/__tests__/hub.test.ts
scripts/test-hub-db.sh        # migration + 27 RLS checks on a local Postgres 15+
npm run build && npm run test:a11y
```
`supabase/tests/supabase_stub.sql` fakes just enough of Supabase (roles,
`auth.users`, `auth.uid()`) to run the migration on plain Postgres; never apply
it to Supabase. The RLS checks cover: companies isolated both ways (contacts,
deals, catalogue), no writes into a foreign company, no cross-company
references, members cannot change roles, the pipeline or another member's row, the last owner cannot leave, AI usage
cannot be logged in someone else's name, and visitors who are not signed in
reach nothing.

## Not built yet
Invitations by email (today a colleague signs up, then an admin adds them by
email), billing, PDF proposals and invoices, document storage, calendar and
mailbox sync, email sending from the app (drafts are copied), CSV import,
streaming replies in the copilot. The real-estate edition (listings, matching,
portal feeds) is a separate, later system with a partner.
