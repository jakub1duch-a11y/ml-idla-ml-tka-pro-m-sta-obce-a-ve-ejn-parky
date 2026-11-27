-- Applied to MLZIDLA design database. Review migration history before replay.
create table public.mlzidla_design_registry (
  slug text primary key,
  category text not null check (category in ('brand','motion','reference','integration')),
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.mlzidla_design_registry enable row level security;
revoke all on public.mlzidla_design_registry from anon, authenticated;
grant select on public.mlzidla_design_registry to anon, authenticated;
grant select, insert, update, delete on public.mlzidla_design_registry to service_role;
create policy "Read approved public design metadata" on public.mlzidla_design_registry for select to anon, authenticated using (published);
create table public.mlzidla_integration_events (
  id bigint generated always as identity primary key,
  source text not null,
  event_key text not null,
  event_type text not null,
  status text not null check (status in ('pending','verified','failed')),
  created_at timestamptz not null default now(),
  unique(source,event_key)
);
alter table public.mlzidla_integration_events enable row level security;
revoke all on public.mlzidla_integration_events from anon, authenticated;
grant select, insert, update, delete on public.mlzidla_integration_events to service_role;
grant usage, select on sequence public.mlzidla_integration_events_id_seq to service_role;
