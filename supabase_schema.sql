-- ============================================================
-- Deev – Client Leads Table
-- Run this SQL in your Supabase project: SQL Editor → New query
-- ============================================================

create table if not exists public.client_leads (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text not null,
  project_type     text,                        -- 'webapp' | 'ai-agent' | 'website' | 'ecommerce'
  scale            text,                        -- 'mvp' | 'growth' | 'enterprise'
  capabilities     text[],                      -- selected features array
  estimated_min    integer,                     -- budget range min (€)
  estimated_max    integer,                     -- budget range max (€)
  timeline_weeks   text,                        -- e.g. '6-8'
  status           text not null default 'new', -- 'new' | 'contacted' | 'qualified' | 'closed'
  notes            text,
  created_at       timestamptz not null default now()
);

-- Index for quick lookups by email & status
create index if not exists client_leads_email_idx  on public.client_leads (email);
create index if not exists client_leads_status_idx on public.client_leads (status);
create index if not exists client_leads_created_idx on public.client_leads (created_at desc);

-- Enable Row Level Security
alter table public.client_leads enable row level security;

-- Allow anonymous INSERT (form submissions from the website)
create policy "Allow public insert"
  on public.client_leads
  for insert
  to anon
  with check (true);

-- Only authenticated users (you) can read / update / delete
create policy "Allow authenticated read"
  on public.client_leads
  for select
  to authenticated
  using (true);

create policy "Allow authenticated update"
  on public.client_leads
  for update
  to authenticated
  using (true);

create policy "Allow authenticated delete"
  on public.client_leads
  for delete
  to authenticated
  using (true);
