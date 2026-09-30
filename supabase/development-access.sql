-- TEST ENVIRONMENT ONLY. Enables public read/write of fictional test records.
-- Do not run on a project containing real personal or business data.
-- Replace these policies with authenticated role policies before real use.
begin;
do $$ declare t text; begin
  foreach t in array array['business_areas','management_areas','properties'] loop
    execute format('grant select on public.%I to anon', t);
    execute format('create policy test_read on public.%I for select to anon using (true)', t);
  end loop;
  foreach t in array array['people','project_statuses','project_types','project_levels','projects','project_people','allocations','project_level_links'] loop
    execute format('grant select, insert, update, delete on public.%I to anon', t);
    execute format('create policy test_access on public.%I for all to anon using (true) with check (true)', t);
  end loop;
end $$;
grant execute on function public.save_project(jsonb) to anon;
commit;
