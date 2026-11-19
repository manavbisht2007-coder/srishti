-- ============================================================================
-- SRISHTI AND MANAV ❤️ — PRODUCTION SUPABASE SCHEMA & RLS POLICIES
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor when connecting Supabase Cloud.
-- Also create a PRIVATE storage bucket named 'sanctuary-media' (Public = OFF).
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Shared Spaces (Invite-only couples space)
create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Srishti and Manav ❤️',
  subtitle text not null default 'Shishi- My kuchu puchuu',
  anniversary_date date not null default '2025-12-01',
  main_quote text not null default 'From a long-distance spark to right here in my arms',
  hero_message text not null default 'Every mile and every quiet midnight call brought us right here.',
  hero_image_path text,
  invite_code_hash text not null,
  created_at timestamptz not null default now()
);

-- 2. Profiles (Linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  nickname text,
  bio text,
  avatar_path text,
  birthday date,
  preferred_theme text not null default 'romantic' check (preferred_theme in ('romantic', 'aquatic')),
  sound_enabled boolean not null default false,
  default_visibility text not null default 'shared' check (default_visibility in ('shared', 'private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Space Members (Strict 2-person membership table)
create table if not exists public.space_members (
  space_id uuid not null references public.spaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'partner' check (role in ('owner', 'partner')),
  joined_at timestamptz not null default now(),
  primary key (space_id, user_id)
);

-- Helper function: verify current user belongs to a space
create or replace function public.is_space_member(target_space_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.space_members
    where space_id = target_space_id and user_id = auth.uid()
  );
$$;

-- 4. Memories Gallery
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  caption text not null,
  memory_date date not null,
  location text,
  category text not null check (category in ('Firsts', 'Adventures', 'Special Days', 'Random Moments', 'Favorite Photos')),
  image_path text not null,
  likes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Our Story Milestones
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  chapter text not null,
  milestone_date date not null,
  title text not null,
  description text not null,
  location text,
  photo_path text,
  icon text not null default 'favorite',
  created_at timestamptz not null default now()
);

-- 6. Private & Shared Letters
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  prompt text not null,
  content text not null,
  letter_date date not null default current_date,
  unlock_date date,
  status text not null default 'sent' check (status in ('draft', 'sent')),
  visibility text not null default 'shared' check (visibility in ('private', 'shared')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Shared & Private Journal
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  title text not null,
  content text not null,
  mood text not null default 'In Love',
  photo_path text,
  visibility text not null default 'shared' check (visibility in ('private', 'shared')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Bucket List
create table if not exists public.bucket_list (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'Adventure',
  target_date date,
  completed boolean not null default false,
  completed_at date,
  completion_photo_path text,
  created_at timestamptz not null default now()
);

-- 9. Special Dates Calendar
create table if not exists public.special_dates (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  event_date date not null,
  event_type text not null check (event_type in ('Anniversary', 'Birthday', 'First Meeting', 'Milestone', 'Custom Event')),
  description text,
  recurring_yearly boolean not null default true,
  reminder_days integer,
  created_at timestamptz not null default now()
);

-- 10. Little Things We Love
create table if not exists public.little_things (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('Songs', 'Places', 'Food', 'Activities', 'Shared Interests')),
  title text not null,
  note text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
alter table public.spaces enable row level security;
alter table public.profiles enable row level security;
alter table public.space_members enable row level security;
alter table public.memories enable row level security;
alter table public.milestones enable row level security;
alter table public.letters enable row level security;
alter table public.journal_entries enable row level security;
alter table public.bucket_list enable row level security;
alter table public.special_dates enable row level security;
alter table public.little_things enable row level security;

-- Profiles: users can view space partners, edit only own profile
create policy "Members view space profiles" on public.profiles
  for select using (
    id = auth.uid() or exists (
      select 1 from public.space_members m1
      join public.space_members m2 on m1.space_id = m2.space_id
      where m1.user_id = auth.uid() and m2.user_id = profiles.id
    )
  );
create policy "Users update own profile" on public.profiles
  for update using (id = auth.uid());

-- Spaces & Membership
create policy "Members view own space" on public.spaces
  for select using (public.is_space_member(id));
create policy "Members update own space" on public.spaces
  for update using (public.is_space_member(id));
create policy "Members view space membership" on public.space_members
  for select using (public.is_space_member(space_id));

-- Shared Tables (Memories, Milestones, Bucket List, Special Dates, Little Things)
create policy "Members access memories" on public.memories
  for all using (public.is_space_member(space_id)) with check (public.is_space_member(space_id) and author_id = auth.uid());

create policy "Members access milestones" on public.milestones
  for all using (public.is_space_member(space_id)) with check (public.is_space_member(space_id) and author_id = auth.uid());

create policy "Members access bucket list" on public.bucket_list
  for all using (public.is_space_member(space_id)) with check (public.is_space_member(space_id) and author_id = auth.uid());

create policy "Members access special dates" on public.special_dates
  for all using (public.is_space_member(space_id)) with check (public.is_space_member(space_id) and author_id = auth.uid());

create policy "Members access little things" on public.little_things
  for all using (public.is_space_member(space_id)) with check (public.is_space_member(space_id) and author_id = auth.uid());

-- STRICT PRIVACY: Letters (Private visible ONLY to author; Drafts visible ONLY to author; Scheduled unlock respected)
create policy "Letters read privacy" on public.letters
  for select using (
    public.is_space_member(space_id) and (
      author_id = auth.uid()
      or (
        visibility = 'shared'
        and status = 'sent'
        and (unlock_date is null or unlock_date <= current_date)
      )
    )
  );
create policy "Letters insert own" on public.letters
  for insert with check (public.is_space_member(space_id) and author_id = auth.uid());
create policy "Letters update own" on public.letters
  for update using (author_id = auth.uid());
create policy "Letters delete own" on public.letters
  for delete using (author_id = auth.uid());

-- STRICT PRIVACY: Journal Entries (Private visible ONLY to author)
create policy "Journal read privacy" on public.journal_entries
  for select using (
    public.is_space_member(space_id) and (
      author_id = auth.uid() or visibility = 'shared'
    )
  );
create policy "Journal insert own" on public.journal_entries
  for insert with check (public.is_space_member(space_id) and author_id = auth.uid());
create policy "Journal update own" on public.journal_entries
  for update using (author_id = auth.uid());
create policy "Journal delete own" on public.journal_entries
  for delete using (author_id = auth.uid());

-- PRIVATE STORAGE BUCKET POLICIES ('sanctuary-media')
-- Create bucket 'sanctuary-media' with public = false, file_size_limit = 5242880, allowed_mime_types = ['image/jpeg','image/png','image/webp','image/gif']
create policy "Space members read private media" on storage.objects
  for select using (
    bucket_id = 'sanctuary-media'
    and public.is_space_member((storage.foldername(name))[1]::uuid)
  );
create policy "Space members upload private media" on storage.objects
  for insert with check (
    bucket_id = 'sanctuary-media'
    and public.is_space_member((storage.foldername(name))[1]::uuid)
  );
create policy "Authors delete own media" on storage.objects
  for delete using (
    bucket_id = 'sanctuary-media'
    and owner = auth.uid()
  );
