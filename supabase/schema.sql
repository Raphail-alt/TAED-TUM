-- TAED-TUM: Supabase schema (accounts only; events live in MongoDB per the README).
-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- Safe to re-run.
--
-- Passwords are handled by Supabase Auth (auth.users), so these tables do not
-- store password hashes.

-- 1. Account tables ---------------------------------------------------------

create table if not exists public.students (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  email      text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.mentors (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  email      text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id            uuid primary key references auth.users (id) on delete cascade,
  name          text not null,
  contact_email text not null unique,
  created_at    timestamptz not null default now()
);

-- Admins are added by hand (see the bottom of this file). Nobody can make
-- themselves an admin from the website.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2. Helper functions -------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Returns 'admin', 'student', 'mentor', 'company' or null for the signed-in user.
create or replace function public.my_role()
returns text
language sql
security definer
stable
set search_path = ''
as $$
  select case
    when exists (select 1 from public.admins    where user_id = auth.uid()) then 'admin'
    when exists (select 1 from public.students  where id      = auth.uid()) then 'student'
    when exists (select 1 from public.mentors   where id      = auth.uid()) then 'mentor'
    when exists (select 1 from public.companies where id      = auth.uid()) then 'company'
    else null
  end;
$$;

revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.my_role()  from public, anon;
grant  execute on function public.is_admin() to authenticated;
grant  execute on function public.my_role()  to authenticated;

-- 3. Create the right profile row when someone signs up ---------------------
-- The signup form sends { role, name } as user metadata. Only student, mentor
-- and company are accepted here; anything else (including 'admin') creates no row.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
  display_name   text := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    split_part(new.email, '@', 1)
  );
begin
  if requested_role = 'student' then
    insert into public.students (id, name, email) values (new.id, display_name, new.email);
  elsif requested_role = 'mentor' then
    insert into public.mentors (id, name, email) values (new.id, display_name, new.email);
  elsif requested_role = 'company' then
    insert into public.companies (id, name, contact_email) values (new.id, display_name, new.email);
  end if;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Row level security -----------------------------------------------------
-- Everyone can read their own row; admins can read all rows. Nobody can write
-- from the browser (the signup trigger above does the inserts).

alter table public.students  enable row level security;
alter table public.mentors   enable row level security;
alter table public.companies enable row level security;
alter table public.admins    enable row level security;

drop policy if exists "students: read own or admin"  on public.students;
drop policy if exists "mentors: read own or admin"   on public.mentors;
drop policy if exists "companies: read own or admin" on public.companies;
drop policy if exists "admins: read own"             on public.admins;

create policy "students: read own or admin"  on public.students
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "mentors: read own or admin"   on public.mentors
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "companies: read own or admin" on public.companies
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "admins: read own"             on public.admins
  for select to authenticated using (user_id = auth.uid());

-- 5. Realtime: lets the Admin Dashboard update the moment someone signs up --

do $$
begin
  begin alter publication supabase_realtime add table public.students;  exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.mentors;   exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.companies; exception when duplicate_object then null; end;
end $$;

-- 6. Make yourself an admin -------------------------------------------------
-- a) Sign up on the website (or Authentication > Users > Add user) with the email you want as admin.
-- b) Then run this, with your email:
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com'
--   on conflict do nothing;
