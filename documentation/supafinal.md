-- Enable extension for UUID generation
create extension if not exists "pgcrypto";

-- =========================
-- 📦 TABLE CREATION
-- =========================

-- Profiles Table
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  full_name text,
  avatar_url text, -- stores the URL to the user's profile picture
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- To support profile picture upload and update, no schema change is needed since avatar_url already exists.
-- Make sure your Supabase Storage bucket (e.g., 'avatars') is set up and public URLs are accessible.

-- Tournaments Table
create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  start_date date,
  end_date date,
  entry_fee numeric,
  prize_pool numeric,
  created_at timestamptz default now()
);

-- Registrations Table
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  tournament_id uuid references tournaments(id) on delete cascade,
  registered_at timestamptz default now()
);

-- Friends Table
create table if not exists friends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  friend_id uuid references profiles(id) on delete cascade,
  status text check (status in ('pending', 'accepted')) not null,
  created_at timestamptz default now()
);

-- Messages Table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id) on delete set null,
  recipient_id uuid references profiles(id) on delete set null,
  content text not null,
  sent_at timestamptz default now()
);

-- Notifications Table
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =========================
-- 🔐 ENABLE RLS
-- =========================

alter table profiles enable row level security;
alter table tournaments enable row level security;
alter table registrations enable row level security;
alter table friends enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;

-- =========================
-- 🛡️ CREATE SECURITY POLICIES
-- =========================

-- Profiles Policies
create policy "Users can view their own profile"
on profiles
for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on profiles
for update
using (auth.uid() = id);

-- Tournaments Policies
create policy "Public can view tournaments"
on tournaments
for select
using (true);

-- Registrations Policies
create policy "Users can register for tournaments"
on registrations
for insert
with check (auth.uid() = user_id);

create policy "Users can view their registrations"
on registrations
for select
using (auth.uid() = user_id);

-- Friends Policies
create policy "Users can send friend requests"
on friends
for insert
with check (auth.uid() = user_id);

create policy "Users can view their friends"
on friends
for select
using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can accept friend requests"
on friends
for update
using (auth.uid() = friend_id);

-- Messages Policies
create policy "Users can view their received messages"
on messages
for select
using (auth.uid() = recipient_id);

create policy "Users can send messages"
on messages
for insert
with check (auth.uid() = sender_id);

-- Notifications Policies
create policy "Users can view their notifications"
on notifications
for select
using (auth.uid() = user_id);

create policy "Users can create notifications"
on notifications
for insert
with check (auth.uid() = user_id);
