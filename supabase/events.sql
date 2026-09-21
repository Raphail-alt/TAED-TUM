-- TAED-TUM: events table. Run after schema.sql (it needs public.is_admin()).
-- Dashboard > SQL Editor > New query > paste > Run. Safe to re-run.
--
-- Everyone (including signed-out visitors) can read events.
-- Only admins can add, edit or remove them.

create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(title) between 1 and 100),
  description   text not null check (char_length(description) <= 400),
  date          timestamp not null,
  category      text not null,
  venue         text not null default '',
  external_link text not null check (external_link ~* '^https?://'),
  image         text not null default '' check (image = '' or image ~* '^https?://'),
  featured      boolean not null default false,
  added_by      uuid references auth.users (id) on delete set null default auth.uid(),
  created_at    timestamptz not null default now()
);

create index if not exists events_date_idx on public.events (date);

-- Only one event can be the featured "main event": featuring one un-features the rest.
create or replace function public.keep_single_featured_event()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.featured then
    update public.events set featured = false where featured and id <> new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists events_single_featured on public.events;
create trigger events_single_featured
  before insert or update of featured on public.events
  for each row execute function public.keep_single_featured_event();

alter table public.events enable row level security;

drop policy if exists "events: public read"  on public.events;
drop policy if exists "events: admin insert" on public.events;
drop policy if exists "events: admin update" on public.events;
drop policy if exists "events: admin delete" on public.events;

create policy "events: public read"  on public.events
  for select to anon, authenticated using (true);
create policy "events: admin insert" on public.events
  for insert to authenticated with check (public.is_admin());
create policy "events: admin update" on public.events
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "events: admin delete" on public.events
  for delete to authenticated using (public.is_admin());

do $$
begin
  begin alter publication supabase_realtime add table public.events; exception when duplicate_object then null; end;
end $$;

-- Placeholder events so the landing page is not empty. Edit or delete them from the admin dashboard.
insert into public.events (title, description, date, category, venue, external_link, image, featured)
select v.* from (values
  ('The TUM Tech & Engineering Symposium', 'Kick off the week with keynotes from engineers and founders shaping East Africa''s tech scene, panel debates on AI, blockchain and cloud, and the official launch of everything that follows.', '2026-11-09 09:00'::timestamp, 'Symposium', 'TUM Main Auditorium', 'https://example.com/register', 'https://picsum.photos/seed/taed-symposium/900/560', true),
  ('AI & Machine Learning Workshop', 'Hands-on session: train and deploy your first model, then learn how teams ship AI products in the real world.', '2026-11-09 14:00', 'Workshop', 'Computer Lab 2', 'https://example.com/register', 'https://picsum.photos/seed/taed-ai/900/560', false),
  ('Blockchain & Web3 Workshop', 'From wallets to smart contracts. Build and deploy a simple dApp with the Web3 Clubs-TUM team.', '2026-11-10 09:00', 'Workshop', 'Innovation Hub', 'https://example.com/register', 'https://picsum.photos/seed/taed-web3/900/560', false),
  ('Inter-University Exchange Program', 'Students from universities across East Africa join TUM for shared projects, campus tours and lasting connections.', '2026-11-10 10:00', 'Exchange', 'TUM Campus', 'https://example.com/register', 'https://picsum.photos/seed/taed-exchange/900/560', false),
  ('Cloud & Data Engineering Workshop', 'Spin up cloud infrastructure, build a data pipeline and see how modern companies scale.', '2026-11-10 14:00', 'Workshop', 'Computer Lab 1', 'https://example.com/register', 'https://picsum.photos/seed/taed-cloud/900/560', false),
  ('Night of Code', 'An overnight coding marathon with music, snacks and mentors on hand. Bring a laptop and an idea.', '2026-11-10 20:00', 'Hackathon', 'Innovation Hub', 'https://example.com/register', 'https://picsum.photos/seed/taed-night/900/560', false),
  ('Engineering Roundtable', 'Practicing engineers from civil, electrical, mechanical and software fields discuss careers, failure and building in Africa.', '2026-11-11 10:00', 'Roundtable', 'Engineering Block, Hall A', 'https://example.com/register', 'https://picsum.photos/seed/taed-roundtable/900/560', false),
  ('Tech Storytelling Evening', 'Founders, students and mentors share the messy, honest stories behind what they built.', '2026-11-11 17:00', 'Storytelling', 'TUM Amphitheatre', 'https://example.com/register', 'https://picsum.photos/seed/taed-story/900/560', false),
  ('Innovation Challenge Finals', 'Student teams pitch their solutions to a panel of judges and companies. Winners take home prizes and mentorship.', '2026-11-12 13:00', 'Challenge', 'TUM Main Auditorium', 'https://example.com/register', 'https://picsum.photos/seed/taed-challenge/900/560', false),
  ('Diani Day: The Mega Closing Gathering', 'We take the whole community to the beach. Music, food, awards and one unforgettable finale.', '2026-11-12 16:00', 'Diani Day', 'Diani Beach', 'https://example.com/register', 'https://picsum.photos/seed/taed-diani/900/560', false)
) as v(title, description, date, category, venue, external_link, image, featured)
where not exists (select 1 from public.events);
