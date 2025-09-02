-- Types
create type role_t as enum ('user','agent','admin');
create type property_status as enum ('draft','review','published','archived');
create type property_type as enum ('apartment','house','studio','townhouse','other');
create type media_type as enum ('hero','area');

-- Profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role role_t not null default 'user',
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Properties
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references profiles(id) on delete cascade,
  status property_status not null default 'draft',
  title text not null,
  price integer,
  weekly_rent integer,
  is_rental boolean default false,
  suburb text not null,
  address text,
  lat double precision,
  lng double precision,
  bedrooms integer,
  bathrooms integer,
  parking integer,
  property_type property_type not null,
  hero_media_id uuid,
  thumbnail_url text,
  hero_chapters jsonb,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Property Media
create table if not exists property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  media_type media_type not null,
  area_name text,
  url text not null,
  thumbnail_url text,
  duration_seconds integer,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Favorites
create table if not exists favorites (
  user_id uuid references profiles(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, property_id)
);

-- Messaging
create table if not exists threads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  agent_id uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table properties enable row level security;
alter table property_media enable row level security;
alter table favorites enable row level security;
alter table threads enable row level security;
alter table messages enable row level security;

-- Profiles policies
create policy if not exists "profiles self read" on profiles
for select using (auth.uid() = id or (current_setting('request.jwt.claims',true)::jsonb->>'role')='admin');
create policy if not exists "profiles self update" on profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

-- Properties policies
create policy if not exists "public read published" on properties
for select using (status = 'published');
create policy if not exists "agent own write" on properties
for all using (agent_id = auth.uid() or (current_setting('request.jwt.claims',true)::jsonb->>'role')='admin')
with check (agent_id = auth.uid() or (current_setting('request.jwt.claims',true)::jsonb->>'role')='admin');

-- Media policies
create policy if not exists "media read published" on property_media
for select using (exists(select 1 from properties p where p.id=property_id and p.status='published'));
create policy if not exists "media agent manage" on property_media
for all using (exists(select 1 from properties p where p.id=property_id and (p.agent_id=auth.uid() or (current_setting('request.jwt.claims',true)::jsonb->>'role')='admin')))
with check (exists(select 1 from properties p where p.id=property_id and (p.agent_id=auth.uid() or (current_setting('request.jwt.claims',true)::jsonb->>'role')='admin')));

-- Favorites policies
create policy if not exists "favorites owner all" on favorites
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Threads/Messages policies
create policy if not exists "threads participants" on threads
for select using (auth.uid() in (user_id, agent_id));
create policy if not exists "messages participants" on messages
for all using (exists(select 1 from threads t where t.id=thread_id and auth.uid() in (t.user_id, t.agent_id)));