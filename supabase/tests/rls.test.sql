-- Row Level Security tests for the Business Hub schema.
-- Run on a scratch database: supabase_stub.sql, the migration, then this file
-- (scripts/test-hub-db.sh does all three). Any failed check raises and stops.

create function pg_temp.expect_error(stmt text, label text) returns void language plpgsql as $$
begin
  execute stmt;
  raise exception 'FAIL (no error): %', label;
exception when others then
  if sqlerrm like 'FAIL (no error)%' then raise; end if;
  raise notice 'ok  %  (%)', label, sqlerrm;
end $$;
create function pg_temp.expect(cond boolean, label text) returns void language plpgsql as $$
begin
  if not coalesce(cond, false) then raise exception 'FAIL: %', label; end if;
  raise notice 'ok  %', label;
end $$;
grant execute on all functions in schema pg_temp to authenticated, anon;

insert into auth.users values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'anna@agency-a.lu'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'ben@agency-b.lu'),
  ('cccccccc-0000-0000-0000-000000000003', 'chloe@agency-a.lu');

-- Anna creates agency A, Ben agency B.
set role authenticated;
set request.jwt.claim.sub = 'aaaaaaaa-0000-0000-0000-000000000001';
select set_config('hub.wa', public.create_workspace('Agence A', 'fr', 'Anna')::text, false);
select pg_temp.expect((select count(*) from pipeline_stages where workspace_id = current_setting('hub.wa')::uuid) = 6, 'six starting stages');
select pg_temp.expect((select name from pipeline_stages where workspace_id = current_setting('hub.wa')::uuid and position = 1) = 'Nouveau', 'stages in French');
insert into contacts (workspace_id, first_name, email) values (current_setting('hub.wa')::uuid, 'Marie', 'marie@example.lu');
select set_config('hub.ca', (select id from contacts where first_name = 'Marie')::text, false);

set request.jwt.claim.sub = 'bbbbbbbb-0000-0000-0000-000000000002';
select set_config('hub.wb', public.create_workspace('Agency B')::text, false);
insert into contacts (workspace_id, first_name) values (current_setting('hub.wb')::uuid, 'Bob');
select set_config('hub.cb', (select id from contacts where first_name = 'Bob')::text, false);

-- Isolation
select pg_temp.expect((select count(*) from workspaces) = 1, 'Ben sees only his workspace');
select pg_temp.expect((select count(*) from contacts) = 1, 'Ben sees only his contacts');
select pg_temp.expect(not exists (select 1 from contacts where id = current_setting('hub.ca')::uuid), 'Ben cannot read Anna''s contact');
select pg_temp.expect_error(format('insert into contacts (workspace_id, first_name) values (%L, %L)', current_setting('hub.wa'), 'Intruder'), 'Ben cannot write into agency A');
update contacts set first_name = 'Hacked' where id = current_setting('hub.ca')::uuid;
select pg_temp.expect(true, 'update of a foreign row touches nothing (checked below)');
select pg_temp.expect_error(format('select public.add_member(%L, %L)', current_setting('hub.wa'), 'ben@agency-b.lu'), 'Ben cannot add himself to agency A');
select pg_temp.expect(public.ai_calls_left(current_setting('hub.wa')::uuid) = 0, 'no AI budget visible for a foreign agency');

-- Cross-agency references are refused even inside one's own agency.
set request.jwt.claim.sub = 'aaaaaaaa-0000-0000-0000-000000000001';
select pg_temp.expect((select first_name from contacts where id = current_setting('hub.ca')::uuid) = 'Marie', 'Anna''s contact untouched by Ben');
select pg_temp.expect_error(format('insert into leads (workspace_id, contact_id) values (%L, %L)', current_setting('hub.wa'), current_setting('hub.cb')), 'lead cannot point at another agency''s contact');
insert into leads (workspace_id, contact_id, stage_id, budget_max, locations)
  select current_setting('hub.wa')::uuid, current_setting('hub.ca')::uuid, id, 650000, '{Strassen,Bertrange}'
  from pipeline_stages where workspace_id = current_setting('hub.wa')::uuid and position = 1;
select pg_temp.expect((select count(*) from leads) = 1, 'Anna creates a lead');
insert into activities (workspace_id, lead_id, kind, body)
  select workspace_id, id, 'call', 'First call' from leads limit 1;
select pg_temp.expect((select count(*) from activities) = 1, 'activity recorded');

-- Members and roles
select public.add_member(current_setting('hub.wa')::uuid, 'CHLOE@agency-a.lu');
select pg_temp.expect((select role from members where user_id = 'cccccccc-0000-0000-0000-000000000003') = 'agent', 'Chloe added as agent');
select pg_temp.expect_error('delete from members where user_id = ''aaaaaaaa-0000-0000-0000-000000000001''', 'the last owner cannot leave');

set request.jwt.claim.sub = 'cccccccc-0000-0000-0000-000000000003';
select pg_temp.expect((select count(*) from leads) = 1, 'Chloe (agent) sees the agency''s leads');
select pg_temp.expect_error('update members set role = ''admin'' where user_id = ''cccccccc-0000-0000-0000-000000000003''', 'an agent cannot promote herself');
select pg_temp.expect_error(format('update members set workspace_id = %L where user_id = %L', current_setting('hub.wb'), 'cccccccc-0000-0000-0000-000000000003'), 'a membership cannot be moved');
select pg_temp.expect_error(format('insert into pipeline_stages (workspace_id, name) values (%L, %L)', current_setting('hub.wa'), 'Mine'), 'an agent cannot change the pipeline');
update members set full_name = 'Chloé' where user_id = 'cccccccc-0000-0000-0000-000000000003';
select pg_temp.expect((select full_name from members where user_id = 'cccccccc-0000-0000-0000-000000000003') = 'Chloé', 'a member edits her own name');
insert into ai_runs (workspace_id, agent, input_tokens, output_tokens) values (current_setting('hub.wa')::uuid, 'copilot', 1200, 300);
select pg_temp.expect(public.ai_calls_left(current_setting('hub.wa')::uuid) = 149, 'daily AI budget counts down');
select pg_temp.expect_error(format('insert into ai_runs (workspace_id, user_id, agent) values (%L, %L, %L)', current_setting('hub.wa'), 'aaaaaaaa-0000-0000-0000-000000000001', 'copilot'), 'nobody records AI calls in a colleague''s name');

-- Visitors who are not signed in
reset request.jwt.claim.sub;
set role anon;
select pg_temp.expect_error('select count(*) from contacts', 'anon has no access to contacts');
select pg_temp.expect_error('select public.create_workspace(''X'')', 'anon cannot create a workspace');

reset role;
select 'ALL RLS CHECKS PASSED';
