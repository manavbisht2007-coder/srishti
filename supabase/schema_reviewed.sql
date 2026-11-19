-- ============================================================================
-- SRISHTI AND MANAV ❤️ — REVIEWED & HARDENED PRODUCTION SUPABASE SCHEMA
-- ============================================================================
-- Safe to run on a fresh Supabase project (PostgreSQL 15+ with auth & storage).
--
-- Security model:
--   1. Strictly invite-only 2-member shared sanctuary spaces (enforced by
--      row-level locks in RPCs + a BEFORE INSERT database trigger).
--   2. Zero client exposure of invite code hashes (stored in private
--      public.space_invites with RLS enabled and no client policies).
--   3. All SECURITY DEFINER functions use SET search_path = '', explicit
--      schema qualification, auth.uid() checks, and REVOKE/GRANT hardening.
--   4. Strict author ownership (author_id = auth.uid()) on UPDATE & DELETE
--      across all content tables, plus immutable-column triggers.
--   5. Private letters, drafts, scheduled time-locked letters, and private
--      journal entries enforced strictly in RLS.
--   6. Private Supabase Storage bucket ('sanctuary-media', public = false)
--      with path-scoped read/write rules supporting both shared and private
--      author-only attachments:
--        Shared media:  <space_id>/shared/<author_uid>/<filename>
--        Private media: <space_id>/private/<author_uid>/<filename>
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Extensions
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto with schema extensions;

-- ----------------------------------------------------------------------------
-- 1. Core Tables (Spaces, Private Invites, Profiles, Space Members)
-- ----------------------------------------------------------------------------
create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Srishti and Manav ❤️'
    check (char_length(trim(name)) between 1 and 120),
  subtitle text not null default 'Shishi- My kuchu puchuu'
    check (char_length(subtitle) <= 160),
  anniversary_date date not null default date '2025-12-01',
  main_quote text not null default 'From a long-distance spark to right here in my arms'
    check (char_length(main_quote) <= 300),
  hero_message text not null default 'Every mile between us only taught our hearts how to reach closer.'
    check (char_length(hero_message) <= 500),
  hero_image_path text check (hero_image_path is null or char_length(hero_image_path) <= 500),
  hero_photo_label text not null default 'Srishti & Manav'
    check (char_length(hero_photo_label) <= 120),
  hero_photo_sub text not null default 'Forever & Always'
    check (char_length(hero_photo_sub) <= 120),
  main_letter_title text not null default 'A Letter For When You Need a Smile'
    check (char_length(main_letter_title) <= 160),
  main_letter_content text not null default ''
    check (char_length(main_letter_content) <= 10000),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

-- Invite hashes live in a locked table with NO client SELECT/INSERT/UPDATE/DELETE policies.
create table if not exists public.space_invites (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  invite_code_hash text not null,
  invited_email text check (invited_email is null or char_length(trim(invited_email)) between 3 and 320),
  created_by uuid not null references auth.users(id) on delete cascade,
  max_uses integer not null default 1 check (max_uses = 1),
  uses integer not null default 0 check (uses >= 0 and uses <= max_uses),
  expires_at timestamptz not null default (pg_catalog.now() + interval '7 days'),
  created_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_space_invites_space_id on public.space_invites(space_id);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique check (char_length(trim(email)) between 3 and 320),
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  nickname text default '' check (char_length(nickname) <= 80),
  bio text default '' check (char_length(bio) <= 400),
  avatar_path text check (avatar_path is null or char_length(avatar_path) <= 500),
  birthday date,
  preferred_theme text not null default 'romantic'
    check (preferred_theme in ('romantic', 'aquatic')),
  sound_enabled boolean not null default false,
  default_visibility text not null default 'shared'
    check (default_visibility in ('shared', 'private')),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create table if not exists public.space_members (
  space_id uuid not null references public.spaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'partner' check (role in ('owner', 'partner')),
  joined_at timestamptz not null default pg_catalog.now(),
  primary key (space_id, user_id)
);

create index if not exists idx_space_members_user_id on public.space_members(user_id);

-- ----------------------------------------------------------------------------
-- 2. Content Tables
-- ----------------------------------------------------------------------------
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  caption text not null default '' check (char_length(caption) <= 2000),
  memory_date date not null default (pg_catalog.now() at time zone 'UTC')::date,
  location text default '' check (char_length(location) <= 160),
  category text not null
    check (category in ('Firsts', 'Adventures', 'Special Days', 'Random Moments', 'Favorite Photos')),
  image_path text not null check (char_length(trim(image_path)) between 1 and 500),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_memories_space_date on public.memories(space_id, memory_date desc);

-- Separate reactions & notes tables so partner interactions never weaken strict
-- author-only UPDATE RLS on public.memories.
create table if not exists public.memory_likes (
  memory_id uuid not null references public.memories(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default pg_catalog.now(),
  primary key (memory_id, user_id)
);

create index if not exists idx_memory_likes_space_id on public.memory_likes(space_id);

create table if not exists public.memory_notes (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  note_text text not null check (char_length(trim(note_text)) between 1 and 1000),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_memory_notes_memory_id on public.memory_notes(memory_id, created_at asc);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  chapter text not null check (char_length(trim(chapter)) between 1 and 80),
  milestone_date date not null,
  title text not null check (char_length(trim(title)) between 1 and 160),
  description text not null check (char_length(trim(description)) between 1 and 4000),
  location text default '' check (char_length(location) <= 160),
  photo_path text check (photo_path is null or char_length(photo_path) <= 500),
  icon text not null default 'favorite' check (char_length(icon) <= 60),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_milestones_space_date on public.milestones(space_id, milestone_date asc);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  prompt text not null default '' check (char_length(prompt) <= 240),
  content text not null check (char_length(trim(content)) between 1 and 20000),
  letter_date date not null default (pg_catalog.now() at time zone 'UTC')::date,
  unlock_date date,
  status text not null default 'sent' check (status in ('draft', 'sent')),
  visibility text not null default 'shared' check (visibility in ('private', 'shared')),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_letters_space_visibility on public.letters(space_id, status, visibility, unlock_date);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default (pg_catalog.now() at time zone 'UTC')::date,
  title text not null check (char_length(trim(title)) between 1 and 160),
  content text not null check (char_length(trim(content)) between 1 and 20000),
  mood text not null default 'In Love'
    check (mood in ('In Love', 'Grateful', 'Peaceful', 'Playful', 'Nostalgic', 'Missing You')),
  photo_path text check (photo_path is null or char_length(photo_path) <= 500),
  visibility text not null default 'shared' check (visibility in ('private', 'shared')),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_journal_space_date on public.journal_entries(space_id, entry_date desc);

create table if not exists public.bucket_list (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  description text default '' check (char_length(description) <= 2000),
  category text not null default 'Adventure'
    check (category in ('Travel', 'Food', 'Cozy', 'Adventure', 'Milestone')),
  target_date date,
  completed boolean not null default false,
  completed_at date,
  completion_photo_path text check (completion_photo_path is null or char_length(completion_photo_path) <= 500),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_bucket_list_space on public.bucket_list(space_id, completed);

create table if not exists public.special_dates (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  event_date date not null,
  event_type text not null
    check (event_type in ('Anniversary', 'Birthday', 'First Meeting', 'Milestone', 'Custom Event')),
  description text default '' check (char_length(description) <= 1000),
  recurring_yearly boolean not null default true,
  reminder_days integer check (reminder_days is null or reminder_days in (0, 1, 7, 14, 30)),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_special_dates_space on public.special_dates(space_id, event_date);

create table if not exists public.little_things (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  category text not null
    check (category in ('Songs', 'Places', 'Food', 'Activities', 'Shared Interests')),
  title text not null check (char_length(trim(title)) between 1 and 160),
  note text default '' check (char_length(note) <= 1000),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create index if not exists idx_little_things_space on public.little_things(space_id);

-- ----------------------------------------------------------------------------
-- 3. Hardened SECURITY DEFINER Helpers & Trigger Functions
-- ----------------------------------------------------------------------------

-- Membership check (hardened against search_path hijacking and anon callers)
create or replace function public.is_space_member(target_space_id uuid)
returns boolean
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null or target_space_id is null then
    return false;
  end if;

  return exists (
    select 1
    from public.space_members sm
    where sm.space_id = target_space_id
      and sm.user_id = v_uid
  );
end;
$$;

-- Owner check (used for invite rotation & space deletion)
create or replace function public.is_space_owner(target_space_id uuid)
returns boolean
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null or target_space_id is null then
    return false;
  end if;

  return exists (
    select 1
    from public.space_members sm
    where sm.space_id = target_space_id
      and sm.user_id = v_uid
      and sm.role = 'owner'
  );
end;
$$;

-- Enforce maximum 2 members per space even under concurrent inserts or direct writes
create or replace function public.enforce_max_two_space_members()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  -- Serialize concurrent joins on the parent space row
  perform 1
  from public.spaces s
  where s.id = new.space_id
  for update;

  if not found then
    raise exception 'Target space does not exist.';
  end if;

  select count(*)
  into v_count
  from public.space_members sm
  where sm.space_id = new.space_id;

  if v_count >= 2 then
    raise exception 'This shared sanctuary already has the maximum of 2 authorized members.';
  end if;

  return new;
end;
$$;

-- Updated-at maintenance trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

-- Prevent clients from reassigning ownership or space_id via UPDATE
create or replace function public.prevent_content_ownership_tampering()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'Immutable column "id" cannot be modified.';
  end if;
  if new.space_id is distinct from old.space_id then
    raise exception 'Immutable column "space_id" cannot be modified.';
  end if;
  if new.author_id is distinct from old.author_id then
    raise exception 'Immutable column "author_id" cannot be modified.';
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'Immutable column "created_at" cannot be modified.';
  end if;
  return new;
end;
$$;

create or replace function public.prevent_space_immutable_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'Immutable column "id" cannot be modified.';
  end if;
  if new.created_by is distinct from old.created_by then
    raise exception 'Immutable column "created_by" cannot be modified.';
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'Immutable column "created_at" cannot be modified.';
  end if;
  return new;
end;
$$;

create or replace function public.prevent_profile_immutable_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'Immutable column "id" cannot be modified.';
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'Immutable column "created_at" cannot be modified.';
  end if;
  return new;
end;
$$;

-- Safe Storage Path Authorization Helpers
-- Required path convention inside bucket 'sanctuary-media':
--   <space_uuid>/shared/<author_uid>/<filename>   -> readable by both space members
--   <space_uuid>/private/<author_uid>/<filename>  -> readable ONLY by <author_uid>
create or replace function public.can_read_storage_object(object_name text)
returns boolean
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_parts text[];
  v_uuid_re constant text := '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
  v_space_id uuid;
  v_scope text;
  v_author_id uuid;
begin
  if v_uid is null or object_name is null or position('..' in object_name) > 0 then
    return false;
  end if;

  v_parts := storage.foldername(object_name);
  if array_length(v_parts, 1) is distinct from 3 then
    return false;
  end if;

  if not (v_parts[1] ~ v_uuid_re) or not (v_parts[3] ~ v_uuid_re) then
    return false;
  end if;

  v_space_id := v_parts[1]::uuid;
  v_scope := v_parts[2];
  v_author_id := v_parts[3]::uuid;

  if not public.is_space_member(v_space_id) then
    return false;
  end if;

  if v_scope = 'shared' then
    return true;
  elsif v_scope = 'private' then
    return v_author_id = v_uid;
  end if;

  return false;
end;
$$;

create or replace function public.can_write_storage_object(object_name text)
returns boolean
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_parts text[];
  v_uuid_re constant text := '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
  v_space_id uuid;
begin
  if v_uid is null or object_name is null or position('..' in object_name) > 0 then
    return false;
  end if;

  v_parts := storage.foldername(object_name);
  if array_length(v_parts, 1) is distinct from 3 then
    return false;
  end if;

  if not (v_parts[1] ~ v_uuid_re) or not (v_parts[3] ~ v_uuid_re) then
    return false;
  end if;

  if v_parts[2] not in ('shared', 'private') then
    return false;
  end if;

  -- Authors can only write/overwrite/delete under their own user folder
  if v_parts[3]::uuid <> v_uid then
    return false;
  end if;

  v_space_id := v_parts[1]::uuid;
  return public.is_space_member(v_space_id);
end;
$$;

-- ----------------------------------------------------------------------------
-- 4. Secure Space Creation & Invitation RPCs
-- ----------------------------------------------------------------------------

-- Atomically creates a sanctuary space, adds creator as owner, and stores a
-- single-use bcrypt-hashed invitation for the second member.
create or replace function public.create_sanctuary_space(
  p_invite_code text,
  p_invited_email text default null,
  p_name text default 'Srishti and Manav ❤️',
  p_subtitle text default 'Shishi- My kuchu puchuu',
  p_anniversary_date date default date '2025-12-01',
  p_main_quote text default 'From a long-distance spark to right here in my arms',
  p_hero_message text default 'Every mile between us only taught our hearts how to reach closer.'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_clean_code text := trim(coalesce(p_invite_code, ''));
  v_clean_email text := nullif(lower(trim(coalesce(p_invited_email, ''))), '');
  v_space_id uuid;
begin
  if v_uid is null then
    raise exception 'Authentication required.';
  end if;

  if char_length(v_clean_code) < 8 then
    raise exception 'Invite code must be at least 8 characters long.';
  end if;

  if exists (
    select 1 from public.space_members sm where sm.user_id = v_uid
  ) then
    raise exception 'You already belong to a sanctuary space.';
  end if;

  insert into public.spaces (
    name,
    subtitle,
    anniversary_date,
    main_quote,
    hero_message,
    created_by
  )
  values (
    coalesce(nullif(trim(p_name), ''), 'Srishti and Manav ❤️'),
    coalesce(p_subtitle, 'Shishi- My kuchu puchuu'),
    coalesce(p_anniversary_date, date '2025-12-01'),
    coalesce(p_main_quote, 'From a long-distance spark to right here in my arms'),
    coalesce(p_hero_message, 'Every mile between us only taught our hearts how to reach closer.'),
    v_uid
  )
  returning id into v_space_id;

  insert into public.space_members (space_id, user_id, role)
  values (v_space_id, v_uid, 'owner');

  insert into public.space_invites (
    space_id,
    invite_code_hash,
    invited_email,
    created_by,
    max_uses,
    uses,
    expires_at
  )
  values (
    v_space_id,
    extensions.crypt(v_clean_code, extensions.gen_salt('bf', 10)),
    v_clean_email,
    v_uid,
    1,
    0,
    pg_catalog.now() + interval '7 days'
  );

  return v_space_id;
end;
$$;

-- Allows the space owner to replace an expired/lost invite (only if < 2 members).
create or replace function public.rotate_sanctuary_invite(
  p_space_id uuid,
  p_new_invite_code text,
  p_invited_email text default null,
  p_expires_in_days integer default 7
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_clean_code text := trim(coalesce(p_new_invite_code, ''));
  v_clean_email text := nullif(lower(trim(coalesce(p_invited_email, ''))), '');
  v_member_count integer;
  v_invite_id uuid;
begin
  if v_uid is null then
    raise exception 'Authentication required.';
  end if;

  if not public.is_space_owner(p_space_id) then
    raise exception 'Only the sanctuary space owner can manage invitations.';
  end if;

  if char_length(v_clean_code) < 8 then
    raise exception 'Invite code must be at least 8 characters long.';
  end if;

  if p_expires_in_days < 1 or p_expires_in_days > 30 then
    raise exception 'Invite expiration must be between 1 and 30 days.';
  end if;

  perform 1 from public.spaces s where s.id = p_space_id for update;

  select count(*) into v_member_count
  from public.space_members sm
  where sm.space_id = p_space_id;

  if v_member_count >= 2 then
    raise exception 'Cannot create an invite: this space already has 2 members.';
  end if;

  delete from public.space_invites
  where space_id = p_space_id;

  insert into public.space_invites (
    space_id,
    invite_code_hash,
    invited_email,
    created_by,
    max_uses,
    uses,
    expires_at
  )
  values (
    p_space_id,
    extensions.crypt(v_clean_code, extensions.gen_salt('bf', 10)),
    v_clean_email,
    v_uid,
    1,
    0,
    pg_catalog.now() + pg_catalog.make_interval(days => p_expires_in_days)
  )
  returning id into v_invite_id;

  return v_invite_id;
end;
$$;

-- Allows the second invited partner to join a space safely with row locking,
-- single-use bcrypt verification, optional email binding, and 2-member cap.
create or replace function public.join_sanctuary_space(
  p_space_id uuid,
  p_invite_code text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_clean_code text := trim(coalesce(p_invite_code, ''));
  v_user_email text;
  v_email_confirmed timestamptz;
  v_member_count integer;
  v_invite record;
begin
  if v_uid is null then
    raise exception 'Authentication required.';
  end if;

  if p_space_id is null or v_clean_code = '' then
    raise exception 'Space ID and invite code are required.';
  end if;

  if exists (
    select 1 from public.space_members sm where sm.user_id = v_uid
  ) then
    raise exception 'Your account already belongs to a sanctuary space.';
  end if;

  select lower(u.email), u.email_confirmed_at
  into v_user_email, v_email_confirmed
  from auth.users u
  where u.id = v_uid;

  if v_email_confirmed is null then
    raise exception 'Please verify your email address before joining a sanctuary space.';
  end if;

  -- Lock parent space to prevent concurrent join races
  perform 1 from public.spaces s where s.id = p_space_id for update;
  if not found then
    raise exception 'Invalid space or invitation code.';
  end if;

  select count(*) into v_member_count
  from public.space_members sm
  where sm.space_id = p_space_id;

  if v_member_count >= 2 then
    raise exception 'This shared sanctuary is already full (2/2 members).';
  end if;

  select *
  into v_invite
  from public.space_invites si
  where si.space_id = p_space_id
    and si.uses < si.max_uses
    and si.expires_at > pg_catalog.now()
  order by si.created_at desc
  limit 1
  for update;

  if not found then
    raise exception 'Invalid or expired invitation code.';
  end if;

  if v_invite.invited_email is not null and v_invite.invited_email <> v_user_email then
    raise exception 'This invitation is restricted to a different invited email address.';
  end if;

  if extensions.crypt(v_clean_code, v_invite.invite_code_hash) <> v_invite.invite_code_hash then
    raise exception 'Invalid or expired invitation code.';
  end if;

  update public.space_invites
  set uses = uses + 1
  where id = v_invite.id;

  insert into public.space_members (space_id, user_id, role)
  values (p_space_id, v_uid, 'partner');

  return p_space_id;
end;
$$;

-- Restrict function execution strictly to authenticated users
revoke all on function public.is_space_member(uuid) from public, anon;
grant execute on function public.is_space_member(uuid) to authenticated;

revoke all on function public.is_space_owner(uuid) from public, anon;
grant execute on function public.is_space_owner(uuid) to authenticated;

revoke all on function public.enforce_max_two_space_members() from public, anon, authenticated;

revoke all on function public.can_read_storage_object(text) from public, anon;
grant execute on function public.can_read_storage_object(text) to authenticated;

revoke all on function public.can_write_storage_object(text) from public, anon;
grant execute on function public.can_write_storage_object(text) to authenticated;

revoke all on function public.create_sanctuary_space(text, text, text, text, date, text, text) from public, anon;
grant execute on function public.create_sanctuary_space(text, text, text, text, date, text, text) to authenticated;

revoke all on function public.rotate_sanctuary_invite(uuid, text, text, integer) from public, anon;
grant execute on function public.rotate_sanctuary_invite(uuid, text, text, integer) to authenticated;

revoke all on function public.join_sanctuary_space(uuid, text) from public, anon;
grant execute on function public.join_sanctuary_space(uuid, text) to authenticated;

-- ----------------------------------------------------------------------------
-- 5. Triggers
-- ----------------------------------------------------------------------------
drop trigger if exists trg_enforce_max_two_space_members on public.space_members;
create trigger trg_enforce_max_two_space_members
  before insert on public.space_members
  for each row execute function public.enforce_max_two_space_members();

drop trigger if exists trg_spaces_updated_at on public.spaces;
create trigger trg_spaces_updated_at
  before update on public.spaces
  for each row execute function public.set_updated_at();

drop trigger if exists trg_spaces_immutable on public.spaces;
create trigger trg_spaces_immutable
  before update on public.spaces
  for each row execute function public.prevent_space_immutable_fields();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_immutable on public.profiles;
create trigger trg_profiles_immutable
  before update on public.profiles
  for each row execute function public.prevent_profile_immutable_fields();

-- Content table updated_at + immutable ownership triggers
do $$
declare
  t text;
begin
  foreach t in array array[
    'memories', 'memory_notes', 'milestones', 'letters',
    'journal_entries', 'bucket_list', 'special_dates', 'little_things'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', t, t);
    execute format(
      'create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );

    execute format('drop trigger if exists trg_%I_immutable on public.%I', t, t);
    execute format(
      'create trigger trg_%I_immutable before update on public.%I for each row execute function public.prevent_content_ownership_tampering()',
      t, t
    );
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- 6. Enable Row Level Security & Revoke Anonymous Privileges
-- ----------------------------------------------------------------------------
revoke all on all tables in schema public from anon;

alter table public.spaces enable row level security;
alter table public.space_invites enable row level security;
alter table public.profiles enable row level security;
alter table public.space_members enable row level security;
alter table public.memories enable row level security;
alter table public.memory_likes enable row level security;
alter table public.memory_notes enable row level security;
alter table public.milestones enable row level security;
alter table public.letters enable row level security;
alter table public.journal_entries enable row level security;
alter table public.bucket_list enable row level security;
alter table public.special_dates enable row level security;
alter table public.little_things enable row level security;

-- ----------------------------------------------------------------------------
-- 7. RLS Policies
-- ----------------------------------------------------------------------------

-- SPACES: Members can read/update shared sanctuary settings; only owner can delete;
-- creation happens exclusively via create_sanctuary_space().
drop policy if exists "Members view own space" on public.spaces;
create policy "Members view own space" on public.spaces
  for select to authenticated
  using (public.is_space_member(id));

drop policy if exists "Members update own space" on public.spaces;
create policy "Members update own space" on public.spaces
  for update to authenticated
  using (public.is_space_member(id))
  with check (public.is_space_member(id));

drop policy if exists "Owner deletes own space" on public.spaces;
create policy "Owner deletes own space" on public.spaces
  for delete to authenticated
  using (public.is_space_owner(id));

-- SPACE INVITES: RLS enabled with ZERO policies so clients can never list,
-- read, insert, update, or delete invite hashes directly.

-- SPACE MEMBERS: Members can view their 2-person roster; joins happen strictly
-- through create_sanctuary_space() / join_sanctuary_space(). Partner can leave;
-- owner can remove partner.
drop policy if exists "Members view space membership" on public.space_members;
create policy "Members view space membership" on public.space_members
  for select to authenticated
  using (public.is_space_member(space_id));

drop policy if exists "Partner leaves or owner removes partner" on public.space_members;
create policy "Partner leaves or owner removes partner" on public.space_members
  for delete to authenticated
  using (
    (user_id = auth.uid() and role = 'partner')
    or (public.is_space_owner(space_id) and user_id <> auth.uid())
  );

-- PROFILES: Own profile full CRUD + read-only access to partner's profile
drop policy if exists "Members view space profiles" on public.profiles;
create policy "Members view space profiles" on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or exists (
      select 1
      from public.space_members m1
      join public.space_members m2 on m1.space_id = m2.space_id
      where m1.user_id = auth.uid()
        and m2.user_id = profiles.id
    )
  );

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "Users delete own profile" on public.profiles;
create policy "Users delete own profile" on public.profiles
  for delete to authenticated
  using (id = auth.uid());

-- MEMORIES: Both space members read & insert; ONLY author updates & deletes
drop policy if exists "Members read memories" on public.memories;
create policy "Members read memories" on public.memories
  for select to authenticated
  using (public.is_space_member(space_id));

drop policy if exists "Members insert own memories" on public.memories;
create policy "Members insert own memories" on public.memories
  for insert to authenticated
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors update own memories" on public.memories;
create policy "Authors update own memories" on public.memories
  for update to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid())
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors delete own memories" on public.memories;
create policy "Authors delete own memories" on public.memories
  for delete to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid());

-- MEMORY LIKES: Space members can toggle their own like on a space memory
drop policy if exists "Members read memory likes" on public.memory_likes;
create policy "Members read memory likes" on public.memory_likes
  for select to authenticated
  using (public.is_space_member(space_id));

drop policy if exists "Members insert own memory like" on public.memory_likes;
create policy "Members insert own memory like" on public.memory_likes
  for insert to authenticated
  with check (
    public.is_space_member(space_id)
    and user_id = auth.uid()
    and exists (
      select 1 from public.memories m
      where m.id = memory_id and m.space_id = memory_likes.space_id
    )
  );

drop policy if exists "Users delete own memory like" on public.memory_likes;
create policy "Users delete own memory like" on public.memory_likes
  for delete to authenticated
  using (public.is_space_member(space_id) and user_id = auth.uid());

-- MEMORY NOTES: Both members read & add; ONLY author updates & deletes
drop policy if exists "Members read memory notes" on public.memory_notes;
create policy "Members read memory notes" on public.memory_notes
  for select to authenticated
  using (public.is_space_member(space_id));

drop policy if exists "Members insert own memory notes" on public.memory_notes;
create policy "Members insert own memory notes" on public.memory_notes
  for insert to authenticated
  with check (
    public.is_space_member(space_id)
    and author_id = auth.uid()
    and exists (
      select 1 from public.memories m
      where m.id = memory_id and m.space_id = memory_notes.space_id
    )
  );

drop policy if exists "Authors update own memory notes" on public.memory_notes;
create policy "Authors update own memory notes" on public.memory_notes
  for update to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid())
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors delete own memory notes" on public.memory_notes;
create policy "Authors delete own memory notes" on public.memory_notes
  for delete to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid());

-- MILESTONES: Both members read & add; ONLY author updates & deletes
drop policy if exists "Members read milestones" on public.milestones;
create policy "Members read milestones" on public.milestones
  for select to authenticated
  using (public.is_space_member(space_id));

drop policy if exists "Members insert own milestones" on public.milestones;
create policy "Members insert own milestones" on public.milestones
  for insert to authenticated
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors update own milestones" on public.milestones;
create policy "Authors update own milestones" on public.milestones
  for update to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid())
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors delete own milestones" on public.milestones;
create policy "Authors delete own milestones" on public.milestones
  for delete to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid());

-- BUCKET LIST: Both members read & add; ONLY author updates & deletes
drop policy if exists "Members read bucket list" on public.bucket_list;
create policy "Members read bucket list" on public.bucket_list
  for select to authenticated
  using (public.is_space_member(space_id));

drop policy if exists "Members insert own bucket items" on public.bucket_list;
create policy "Members insert own bucket items" on public.bucket_list
  for insert to authenticated
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors update own bucket items" on public.bucket_list;
create policy "Authors update own bucket items" on public.bucket_list
  for update to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid())
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors delete own bucket items" on public.bucket_list;
create policy "Authors delete own bucket items" on public.bucket_list
  for delete to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid());

-- SPECIAL DATES: Both members read & add; ONLY author updates & deletes
drop policy if exists "Members read special dates" on public.special_dates;
create policy "Members read special dates" on public.special_dates
  for select to authenticated
  using (public.is_space_member(space_id));

drop policy if exists "Members insert own special dates" on public.special_dates;
create policy "Members insert own special dates" on public.special_dates
  for insert to authenticated
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors update own special dates" on public.special_dates;
create policy "Authors update own special dates" on public.special_dates
  for update to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid())
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors delete own special dates" on public.special_dates;
create policy "Authors delete own special dates" on public.special_dates
  for delete to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid());

-- LITTLE THINGS WE LOVE: Both members read & add; ONLY author updates & deletes
drop policy if exists "Members read little things" on public.little_things;
create policy "Members read little things" on public.little_things
  for select to authenticated
  using (public.is_space_member(space_id));

drop policy if exists "Members insert own little things" on public.little_things;
create policy "Members insert own little things" on public.little_things
  for insert to authenticated
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors update own little things" on public.little_things;
create policy "Authors update own little things" on public.little_things
  for update to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid())
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Authors delete own little things" on public.little_things;
create policy "Authors delete own little things" on public.little_things
  for delete to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid());

-- LETTERS: Strict privacy (private & drafts ONLY to author; scheduled shared
-- letters hidden from partner until unlock_date <= current UTC date)
drop policy if exists "Letters read privacy" on public.letters;
create policy "Letters read privacy" on public.letters
  for select to authenticated
  using (
    public.is_space_member(space_id)
    and (
      author_id = auth.uid()
      or (
        visibility = 'shared'
        and status = 'sent'
        and (
          unlock_date is null
          or unlock_date <= (pg_catalog.now() at time zone 'UTC')::date
        )
      )
    )
  );

drop policy if exists "Letters insert own" on public.letters;
create policy "Letters insert own" on public.letters
  for insert to authenticated
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Letters update own" on public.letters;
create policy "Letters update own" on public.letters
  for update to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid())
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Letters delete own" on public.letters;
create policy "Letters delete own" on public.letters
  for delete to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid());

-- JOURNAL ENTRIES: Strict privacy (private ONLY to author)
drop policy if exists "Journal read privacy" on public.journal_entries;
create policy "Journal read privacy" on public.journal_entries
  for select to authenticated
  using (
    public.is_space_member(space_id)
    and (
      author_id = auth.uid()
      or visibility = 'shared'
    )
  );

drop policy if exists "Journal insert own" on public.journal_entries;
create policy "Journal insert own" on public.journal_entries
  for insert to authenticated
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Journal update own" on public.journal_entries;
create policy "Journal update own" on public.journal_entries
  for update to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid())
  with check (public.is_space_member(space_id) and author_id = auth.uid());

drop policy if exists "Journal delete own" on public.journal_entries;
create policy "Journal delete own" on public.journal_entries
  for delete to authenticated
  using (public.is_space_member(space_id) and author_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 8. Private Supabase Storage Bucket & Policies ('sanctuary-media')
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sanctuary-media',
  'sanctuary-media',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

drop policy if exists "Space members read scoped private media" on storage.objects;
create policy "Space members read scoped private media" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'sanctuary-media'
    and public.can_read_storage_object(name)
  );

drop policy if exists "Authors upload scoped private media" on storage.objects;
create policy "Authors upload scoped private media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'sanctuary-media'
    and public.can_write_storage_object(name)
    and coalesce(owner, auth.uid()) = auth.uid()
  );

drop policy if exists "Authors update own scoped private media" on storage.objects;
create policy "Authors update own scoped private media" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'sanctuary-media'
    and public.can_write_storage_object(name)
    and coalesce(owner, auth.uid()) = auth.uid()
  )
  with check (
    bucket_id = 'sanctuary-media'
    and public.can_write_storage_object(name)
    and coalesce(owner, auth.uid()) = auth.uid()
  );

drop policy if exists "Authors delete own scoped private media" on storage.objects;
create policy "Authors delete own scoped private media" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'sanctuary-media'
    and public.can_write_storage_object(name)
    and coalesce(owner, auth.uid()) = auth.uid()
  );
