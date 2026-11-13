-- ============================================================
-- DEEV Business Hub: the CRM with AI agents for SMEs
--
-- One Supabase project, many companies. Every row of business data belongs to
-- a workspace (a company), and Row Level Security lets a signed-in user reach
-- only the workspaces they are a member of. The browser talks to the database
-- directly with the user's own session; the AI functions in api/hub use the
-- same session, so the agents can never see more than the user can.
--
-- Cross-references (a deal's contact, a task's deal ...) are composite
-- foreign keys on (id, workspace_id): a row can only point at rows of its own
-- company, whatever a client sends.
--
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL
-- editor of a fresh project. Written for Postgres 15+ (Supabase runs 17).
-- ============================================================

-- ── Workspaces and members ──────────────────────────────────

create table public.workspaces (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(btrim(name)) between 1 and 120),
  -- What the company is on. Early access while there is no billing; the
  -- values exist so a paid plan can be added without a migration of meaning.
  plan           text not null default 'early_access'
                 check (plan in ('early_access', 'active', 'paused')),
  -- AI calls per day for the whole company (api/hub counts them in ai_runs).
  ai_daily_limit integer not null default 150 check (ai_daily_limit between 0 and 100000),
  locale         text not null default 'en' check (locale in ('en', 'fr', 'de')),
  created_by     uuid not null references auth.users (id) on delete restrict,
  created_at     timestamptz not null default now()
);

create table public.members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  role         text not null default 'member' check (role in ('owner', 'admin', 'member')),
  full_name    text check (char_length(full_name) <= 120),
  email        text,
  created_at   timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index members_user_idx on public.members (user_id);

-- Membership checks. SECURITY DEFINER so a policy on `members` can ask about
-- `members` without recursing into its own policy.
create function public.is_member(ws uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.members m where m.workspace_id = ws and m.user_id = auth.uid());
$$;

create function public.is_admin(ws uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.members m
    where m.workspace_id = ws and m.user_id = auth.uid() and m.role in ('owner', 'admin')
  );
$$;

-- ── CRM data ────────────────────────────────────────────────

create table public.pipeline_stages (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name         text not null check (char_length(btrim(name)) between 1 and 60),
  position     integer not null default 0,
  kind         text not null default 'open' check (kind in ('open', 'won', 'lost')),
  created_at   timestamptz not null default now(),
  unique (id, workspace_id)
);
create index pipeline_stages_ws_idx on public.pipeline_stages (workspace_id, position);

create table public.contacts (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references public.workspaces (id) on delete cascade,
  first_name        text not null check (char_length(btrim(first_name)) between 1 and 80),
  last_name         text check (char_length(last_name) <= 80),
  company           text check (char_length(company) <= 120),
  job_title         text check (char_length(job_title) <= 80),
  email             text check (char_length(email) <= 254),
  phone             text check (char_length(phone) <= 40),
  -- Preferred language for messages to this person.
  language          text check (language in ('en', 'fr', 'de', 'lb', 'pt', 'it', 'nl')),
  kind              text not null default 'lead'
                    check (kind in ('lead', 'customer', 'partner', 'supplier', 'other')),
  source            text check (char_length(source) <= 80),
  notes             text check (char_length(notes) <= 5000),
  -- GDPR: whether this person agreed to marketing messages, and when.
  marketing_consent boolean not null default false,
  consent_at        timestamptz,
  owner_id          uuid references auth.users (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (id, workspace_id)
);
create index contacts_ws_idx on public.contacts (workspace_id, created_at desc);
create index contacts_email_idx on public.contacts (workspace_id, lower(email));

-- What the company sells: the proposal writer prices only from here.
create table public.catalog_items (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name         text not null check (char_length(btrim(name)) between 1 and 160),
  description  text check (char_length(description) <= 2000),
  unit_price   numeric(14, 2) check (unit_price >= 0),
  unit         text not null default 'item'
               check (unit in ('item', 'hour', 'day', 'month', 'year', 'project')),
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (id, workspace_id)
);
create index catalog_items_ws_idx on public.catalog_items (workspace_id, active, name);

create table public.deals (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references public.workspaces (id) on delete cascade,
  title            text not null check (char_length(btrim(title)) between 1 and 160),
  contact_id       uuid not null,
  stage_id         uuid,
  -- Expected value in EUR, excluding VAT.
  value            numeric(14, 2) check (value >= 0),
  expected_close   date,
  -- What the customer needs, in their words: the proposal writer starts here.
  needs            text check (char_length(needs) <= 5000),
  source           text check (char_length(source) <= 80),
  notes            text check (char_length(notes) <= 5000),
  -- Written by the deal brief agent (api/hub), shown with its date; a person
  -- can overwrite either.
  score            smallint check (score between 0 and 100),
  ai_summary       text check (char_length(ai_summary) <= 4000),
  ai_updated_at    timestamptz,
  assigned_to      uuid references auth.users (id) on delete set null,
  last_activity_at timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (id, workspace_id),
  foreign key (contact_id, workspace_id)
    references public.contacts (id, workspace_id) on delete cascade,
  foreign key (stage_id, workspace_id)
    references public.pipeline_stages (id, workspace_id) on delete set null (stage_id)
);
create index deals_ws_stage_idx on public.deals (workspace_id, stage_id, last_activity_at desc);
create index deals_contact_idx on public.deals (contact_id);

create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  title        text not null check (char_length(btrim(title)) between 1 and 200),
  due_at       timestamptz,
  done         boolean not null default false,
  done_at      timestamptz,
  deal_id      uuid,
  contact_id   uuid,
  assigned_to  uuid references auth.users (id) on delete set null,
  created_by   uuid references auth.users (id) on delete set null default auth.uid(),
  created_at   timestamptz not null default now(),
  foreign key (deal_id, workspace_id)
    references public.deals (id, workspace_id) on delete cascade,
  foreign key (contact_id, workspace_id)
    references public.contacts (id, workspace_id) on delete cascade
);
create index tasks_ws_due_idx on public.tasks (workspace_id, done, due_at);

-- The timeline: notes, calls, emails, meetings, and what an AI agent did.
create table public.activities (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  kind         text not null default 'note'
               check (kind in ('note', 'call', 'email', 'meeting', 'ai', 'stage')),
  body         text not null check (char_length(body) between 1 and 10000),
  deal_id      uuid,
  contact_id   uuid,
  created_by   uuid references auth.users (id) on delete set null default auth.uid(),
  created_at   timestamptz not null default now(),
  foreign key (deal_id, workspace_id)
    references public.deals (id, workspace_id) on delete cascade,
  foreign key (contact_id, workspace_id)
    references public.contacts (id, workspace_id) on delete cascade
);
create index activities_deal_idx on public.activities (deal_id, created_at desc);
create index activities_contact_idx on public.activities (contact_id, created_at desc);
create index activities_ws_idx on public.activities (workspace_id, created_at desc);

-- One row per call to Claude, for the daily limit and for the company to see
-- what the agents cost it. No prompt or reply text is kept here.
create table public.ai_runs (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade default auth.uid(),
  agent         text not null check (agent in ('copilot', 'deal_brief', 'proposal', 'email')),
  model         text,
  input_tokens  integer not null default 0,
  output_tokens integer not null default 0,
  ok            boolean not null default true,
  created_at    timestamptz not null default now()
);
create index ai_runs_ws_day_idx on public.ai_runs (workspace_id, created_at desc);

-- ── Housekeeping triggers ───────────────────────────────────

create function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger contacts_touch before update on public.contacts
  for each row execute function public.touch_updated_at();
create trigger catalog_items_touch before update on public.catalog_items
  for each row execute function public.touch_updated_at();
create trigger deals_touch before update on public.deals
  for each row execute function public.touch_updated_at();

-- A new activity on a deal moves it up the "recently active" order.
create function public.bump_deal_activity()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.deal_id is not null then
    update public.deals set last_activity_at = new.created_at where id = new.deal_id;
  end if;
  return new;
end $$;
create trigger activities_bump after insert on public.activities
  for each row execute function public.bump_deal_activity();

create function public.stamp_task_done()
returns trigger language plpgsql as $$
begin
  if new.done and not coalesce(old.done, false) then new.done_at := now(); end if;
  if not new.done then new.done_at := null; end if;
  return new;
end $$;
create trigger tasks_done before insert or update on public.tasks
  for each row execute function public.stamp_task_done();

-- ── Row Level Security ──────────────────────────────────────

alter table public.workspaces      enable row level security;
alter table public.members         enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.contacts        enable row level security;
alter table public.catalog_items   enable row level security;
alter table public.deals           enable row level security;
alter table public.tasks           enable row level security;
alter table public.activities      enable row level security;
alter table public.ai_runs         enable row level security;

-- Workspaces: members read; owners and admins rename. Created only through
-- create_workspace(), which also makes the creator its owner.
create policy "members read their workspace" on public.workspaces
  for select to authenticated using (public.is_member(id));
create policy "admins update their workspace" on public.workspaces
  for update to authenticated using (public.is_admin(id)) with check (public.is_admin(id));

-- Members: colleagues see each other; admins manage roles and removals. Adding
-- someone goes through add_member(). Nobody can remove the last owner (trigger).
create policy "members read colleagues" on public.members
  for select to authenticated using (public.is_member(workspace_id));
create policy "admins update members" on public.members
  for update to authenticated using (public.is_admin(workspace_id)) with check (public.is_admin(workspace_id));
create policy "admins remove members, anyone leaves" on public.members
  for delete to authenticated using (public.is_admin(workspace_id) or user_id = auth.uid());
-- A member edits their own display name (role changes stay with admins: the
-- column check in the trigger below).
create policy "members edit themselves" on public.members
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create function public.guard_members()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and (new.workspace_id <> old.workspace_id or new.user_id <> old.user_id) then
    raise exception 'A membership cannot be moved' using errcode = '42501';
  end if;
  if tg_op = 'UPDATE' and new.role is distinct from old.role then
    if not public.is_admin(old.workspace_id) then
      raise exception 'Only an owner or admin can change roles' using errcode = '42501';
    end if;
    if new.role = 'owner' and not exists (
      select 1 from public.members where workspace_id = old.workspace_id and user_id = auth.uid() and role = 'owner'
    ) then
      raise exception 'Only an owner can make someone an owner' using errcode = '42501';
    end if;
  end if;
  if (tg_op = 'DELETE' and old.role = 'owner') or (tg_op = 'UPDATE' and old.role = 'owner' and new.role <> 'owner') then
    if not exists (
      select 1 from public.members
      where workspace_id = old.workspace_id and role = 'owner' and user_id <> old.user_id
    ) then
      raise exception 'A workspace needs at least one owner' using errcode = '23514';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;
create trigger members_guard before update or delete on public.members
  for each row execute function public.guard_members();

-- Stages: everyone reads, admins shape the pipeline.
create policy "members read stages" on public.pipeline_stages
  for select to authenticated using (public.is_member(workspace_id));
create policy "admins insert stages" on public.pipeline_stages
  for insert to authenticated with check (public.is_admin(workspace_id));
create policy "admins update stages" on public.pipeline_stages
  for update to authenticated using (public.is_admin(workspace_id)) with check (public.is_admin(workspace_id));
create policy "admins delete stages" on public.pipeline_stages
  for delete to authenticated using (public.is_admin(workspace_id));

-- The CRM tables: every member of the company works with all of them.
do $$
declare t text;
begin
  foreach t in array array['contacts', 'catalog_items', 'deals', 'tasks', 'activities'] loop
    execute format(
      'create policy "members work with %1$s" on public.%1$I for all to authenticated
         using (public.is_member(workspace_id)) with check (public.is_member(workspace_id))', t);
  end loop;
end $$;

-- AI runs: members read the company's usage and record their own calls.
create policy "members read ai usage" on public.ai_runs
  for select to authenticated using (public.is_member(workspace_id));
create policy "members record their ai calls" on public.ai_runs
  for insert to authenticated with check (public.is_member(workspace_id) and user_id = auth.uid());

-- ── Functions the app calls ─────────────────────────────────

-- Sign-up step two: the new company, its owner, and a starting pipeline in the
-- chosen language.
create function public.create_workspace(ws_name text, ws_locale text default 'en', owner_name text default null)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  ws uuid;
  names text[];
  lang text := case when ws_locale in ('en', 'fr', 'de') then ws_locale else 'en' end;
begin
  if uid is null then
    raise exception 'Sign in first' using errcode = '42501';
  end if;
  -- One person, a handful of companies: enough for someone who runs two,
  -- low enough that a script cannot fill the database.
  if (select count(*) from public.members where user_id = uid) >= 5 then
    raise exception 'Workspace limit reached' using errcode = '54000';
  end if;

  insert into public.workspaces (name, locale, created_by)
  values (btrim(ws_name), lang, uid)
  returning id into ws;

  insert into public.members (workspace_id, user_id, role, full_name, email)
  select ws, uid, 'owner', nullif(btrim(owner_name), ''), u.email from auth.users u where u.id = uid;

  names := case lang
    when 'fr' then array['Nouveau', 'Contacté', 'Proposition', 'Négociation', 'Gagné', 'Perdu']
    when 'de' then array['Neu', 'Kontaktiert', 'Angebot', 'Verhandlung', 'Gewonnen', 'Verloren']
    else array['New', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost']
  end;
  insert into public.pipeline_stages (workspace_id, name, position, kind)
  select ws, names[i], i,
         case i when 5 then 'won' when 6 then 'lost' else 'open' end
  from generate_series(1, 6) as i;

  return ws;
end $$;

-- Add a colleague who already has a Hub account, by email.
create function public.add_member(ws uuid, member_email text, member_role text default 'member')
returns void
language plpgsql security definer set search_path = public
as $$
declare
  target uuid;
  target_email text;
begin
  if not public.is_admin(ws) then
    raise exception 'Only an owner or admin can add members' using errcode = '42501';
  end if;
  if member_role not in ('admin', 'member') then
    raise exception 'Role must be admin or member' using errcode = '22023';
  end if;
  select id, email into target, target_email from auth.users where lower(email) = lower(btrim(member_email)) limit 1;
  if target is null then
    raise exception 'No Hub account with that email yet' using errcode = 'P0002';
  end if;
  insert into public.members (workspace_id, user_id, role, email)
  values (ws, target, member_role, target_email)
  on conflict (workspace_id, user_id) do nothing;
end $$;

-- How many AI calls the company has left today (UTC day).
create function public.ai_calls_left(ws uuid)
returns integer
language sql stable security definer set search_path = public
as $$
  select case when not public.is_member(ws) then 0 else greatest(
    0,
    (select ai_daily_limit from public.workspaces where id = ws)
    - (select count(*)::int from public.ai_runs
       where workspace_id = ws and created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc')
  ) end;
$$;

revoke all on function public.create_workspace(text, text, text) from public, anon;
revoke all on function public.add_member(uuid, text, text) from public, anon;
revoke all on function public.ai_calls_left(uuid) from public, anon;
revoke all on function public.is_member(uuid) from public, anon;
revoke all on function public.is_admin(uuid) from public, anon;
grant execute on function public.create_workspace(text, text, text) to authenticated;
grant execute on function public.add_member(uuid, text, text) to authenticated;
grant execute on function public.ai_calls_left(uuid) to authenticated;
grant execute on function public.is_member(uuid) to authenticated;
grant execute on function public.is_admin(uuid) to authenticated;

-- Supabase grants table privileges to anon and authenticated by default; the
-- Hub has nothing for visitors who are not signed in.
revoke all on all tables in schema public from anon;
