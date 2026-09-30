-- Puls schema. Run against a development/test Supabase project.
begin;
create table public.business_areas (
  id uuid primary key default gen_random_uuid(), external_id text unique,
  name text not null check (length(trim(name)) > 0), active boolean not null default true
);
create table public.management_areas (
  id uuid primary key default gen_random_uuid(), external_id text unique,
  name text not null check (length(trim(name)) > 0), active boolean not null default true,
  business_area_id uuid references public.business_areas(id), unique(id, business_area_id)
);
create table public.properties (
  id uuid primary key default gen_random_uuid(), external_id text unique,
  property_number text not null unique, name text not null check (length(trim(name)) > 0),
  estate_external_id text, business_area_id uuid not null references public.business_areas(id),
  management_area_id uuid not null, active boolean not null default true,
  foreign key (management_area_id, business_area_id) references public.management_areas(id, business_area_id)
);
create table public.people (
  id uuid primary key default gen_random_uuid(), name text not null check (length(trim(name)) > 0),
  type text not null check (type in ('internal', 'external')), active boolean not null default true
);
create table public.project_statuses (
  id uuid primary key default gen_random_uuid(), name text not null unique check (length(trim(name)) > 0),
  active boolean not null default true, sort_order integer not null default 0
);
create table public.project_types (like public.project_statuses including all);
create table public.project_levels (like public.project_statuses including all);
create table public.projects (
  id uuid primary key default gen_random_uuid(), external_id text unique,
  project_number text not null check (length(trim(project_number)) > 0),
  name text not null check (length(trim(name)) > 0), property_id uuid not null references public.properties(id),
  status_id uuid not null references public.project_statuses(id), project_type_id uuid not null references public.project_types(id),
  comment text not null default '', archived boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index projects_number_unique on public.projects(lower(project_number));
create table public.project_people (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  person_id uuid not null references public.people(id), role text not null check (role in ('project_manager','consultant','other')),
  unique(project_id, person_id)
);
create table public.allocations (
  id uuid primary key default gen_random_uuid(), project_person_id uuid not null references public.project_people(id) on delete cascade,
  start_date date not null, end_date date not null, percentage numeric not null check (percentage >= 0 and percentage <= 200),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (end_date >= start_date)
);
create table public.project_level_links (
  project_id uuid not null references public.projects(id) on delete cascade,
  level_id uuid not null references public.project_levels(id), primary key(project_id, level_id)
);
create index allocations_period on public.allocations(start_date,end_date);
create index allocations_person on public.allocations(project_person_id);
create index project_people_person on public.project_people(person_id);
create function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = clock_timestamp(); return new; end; $$;
create trigger projects_updated before update on public.projects for each row execute function public.touch_updated_at();
create trigger allocations_updated before update on public.allocations for each row execute function public.touch_updated_at();

-- Authorization boundary: no anonymous access in the base schema. The separate
-- development-access.sql explicitly enables unauthenticated fictional test data.
do $$ declare t text; begin
  foreach t in array array['business_areas','management_areas','properties','people','project_statuses','project_types','project_levels','projects','project_people','allocations','project_level_links'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- Invoker permissions + RLS apply to every write. Entire edit is atomic.
create function public.save_project(payload jsonb) returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  p jsonb := payload->'project'; v_project_id uuid := (p->>'id')::uuid;
  previous timestamptz; item jsonb;
begin
  select updated_at into previous from public.projects where id = v_project_id for update;
  if found and previous <> (p->>'updated_at')::timestamptz then
    raise exception 'Projektet har ändrats av någon annan. Ladda om och försök igen.';
  end if;
  if jsonb_array_length(payload->'people') = 0 or jsonb_array_length(payload->'allocations') = 0 then
    raise exception 'Minst en resurs och en planeringsperiod krävs.';
  end if;
  if not exists(select 1 from jsonb_array_elements(payload->'people') r join public.people pe on pe.id = (r->>'person_id')::uuid where r->>'role' = 'project_manager' and pe.type = 'internal') then
    raise exception 'En intern projektledare krävs.';
  end if;
  if exists(select 1 from jsonb_array_elements(payload->'people') r join public.people pe on pe.id = (r->>'person_id')::uuid where r->>'role' = 'project_manager' and pe.type <> 'internal') then
    raise exception 'Projektledare måste vara interna resurser.';
  end if;
  insert into public.projects(id,external_id,project_number,name,property_id,status_id,project_type_id,comment,archived)
    values(v_project_id,p->>'external_id',trim(p->>'project_number'),trim(p->>'name'),(p->>'property_id')::uuid,(p->>'status_id')::uuid,(p->>'project_type_id')::uuid,coalesce(p->>'comment',''),coalesce((p->>'archived')::boolean,false))
    on conflict(id) do update set project_number=excluded.project_number,name=excluded.name,property_id=excluded.property_id,status_id=excluded.status_id,project_type_id=excluded.project_type_id,comment=excluded.comment,archived=excluded.archived;
  -- Stable assignment IDs, remove only allocations/assignments absent in the draft.
  delete from public.allocations a using public.project_people pp where a.project_person_id=pp.id and pp.project_id=v_project_id and not exists(select 1 from jsonb_array_elements(payload->'allocations') v where (v->>'id')::uuid=a.id);
  delete from public.project_people pp where pp.project_id=v_project_id and not exists(select 1 from jsonb_array_elements(payload->'people') v where (v->>'id')::uuid=pp.id);
  for item in select * from jsonb_array_elements(payload->'people') loop
    if (item->>'project_id')::uuid is distinct from v_project_id then raise exception 'Ogiltig projektrelation.'; end if;
    if exists(select 1 from public.project_people where id=(item->>'id')::uuid and project_people.project_id<>v_project_id) then raise exception 'Resursen tillhör ett annat projekt.'; end if;
    insert into public.project_people(id,project_id,person_id,role) values((item->>'id')::uuid,v_project_id,(item->>'person_id')::uuid,item->>'role')
      on conflict(id) do update set person_id=excluded.person_id,role=excluded.role;
  end loop;
  for item in select * from jsonb_array_elements(payload->'allocations') loop
    if not exists(select 1 from public.project_people pp where pp.id=(item->>'project_person_id')::uuid and pp.project_id=v_project_id) then raise exception 'Perioden saknar giltig resurs.'; end if;
    if exists(select 1 from public.allocations a join public.project_people pp on pp.id=a.project_person_id where a.id=(item->>'id')::uuid and pp.project_id<>v_project_id) then raise exception 'Perioden tillhör ett annat projekt.'; end if;
    insert into public.allocations(id,project_person_id,start_date,end_date,percentage) values((item->>'id')::uuid,(item->>'project_person_id')::uuid,(item->>'start_date')::date,(item->>'end_date')::date,(item->>'percentage')::numeric)
      on conflict(id) do update set project_person_id=excluded.project_person_id,start_date=excluded.start_date,end_date=excluded.end_date,percentage=excluded.percentage;
  end loop;
  delete from public.project_level_links l where l.project_id=v_project_id;
  insert into public.project_level_links(project_id,level_id) select v_project_id, value::uuid from jsonb_array_elements_text(payload->'levelIds');
  return v_project_id;
end; $$;
revoke all on function public.save_project(jsonb) from public, anon, authenticated;
commit;

