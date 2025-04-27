# Supabase Queries for Clutch Vault Project

This document contains comprehensive Supabase query examples covering the main entities in the project, including search functionality.

---

## 1. Profiles

### Fetch Profile by ID
```typescript
export async function fetchProfileById(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}
```

### Search Profiles by Username (with partial matching)
```typescript
export async function searchProfiles(searchQuery: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .ilike('username', `%${searchQuery}%`);
  if (error) throw error;
  return data;
}
```

### Update Profile
```typescript
export async function updateProfile(userId: string, updates: object) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
  return data;
}
```

---

## 2. Tournaments

### Fetch All Tournaments
```typescript
export async function fetchAllTournaments() {
  const { data, error } = await supabase.from('tournaments').select('*');
  if (error) throw error;
  return data;
}
```

### Fetch Tournament by ID
```typescript
export async function fetchTournamentById(tournamentId: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single();
  if (error) throw error;
  return data;
}
```

### Search Tournaments by Name (with partial matching)
```typescript
export async function searchTournaments(searchQuery: string) {
  let query = supabase.from('tournaments').select('*');
  if (searchQuery.trim() !== '') {
    query = query.ilike('name', `%${searchQuery}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

---

## 3. Registrations

### Register for Tournament
```typescript
export async function registerForTournament(userId: string, tournamentId: string) {
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      user_id: userId,
      tournament_id: tournamentId,
    });
  if (error) throw error;
  return data;
}
```

### Fetch User Registrations
```typescript
export async function fetchUserRegistrations(userId: string) {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}
```

---

## 4. Friends

### Fetch Friends of a User
```typescript
export async function fetchFriends(userId: string) {
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}
```

### Add Friend (Send Friend Request)
```typescript
export async function addFriend(userId: string, friendId: string) {
  const { data, error } = await supabase
    .from('friends')
    .insert({
      user_id: userId,
      friend_id: friendId,
      status: 'pending', // assuming status column for request state
    });
  if (error) throw error;
  return data;
}
```

---

## 5. Messages / Inbox

### Fetch Messages for a User
```typescript
export async function fetchMessages(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('recipient_id', userId);
  if (error) throw error;
  return data;
}
```

### Send a Message
```typescript
export async function sendMessage(senderId: string, recipientId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
    });
  if (error) throw error;
  return data;
}
```

---

## 6. Generic Queries with Search Support

### Generic Fetch with Filters, Pagination, and Sorting
```typescript
export async function fetchAll({
  table,
  filter = {},
  limit,
  offset,
  orderBy,
  ascending = true,
}: {
  table: string;
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}) {
  let query = supabase.from(table).select('*');
  Object.entries(filter).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  if (orderBy) query = query.order(orderBy, { ascending });
  if (limit) query = query.limit(limit);
  if (offset) query = query.range(offset, offset + (limit ? limit - 1 : 99));
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

### Generic Search Query for Any Table and Column
```typescript
export async function searchTable({
  table,
  searchColumn,
  searchQuery,
  limit,
  offset,
}: {
  table: string;
  searchColumn: string;
  searchQuery: string;
  limit?: number;
  offset?: number;
}) {
  if (!table || !searchColumn) throw new Error("Table and searchColumn are required");
  let query = supabase.from(table).select('*');
  if (searchQuery && searchQuery.trim() !== '' && searchColumn) {
    query = query.ilike(searchColumn, `%${searchQuery}%`);
  }
  if (limit !== undefined) query = query.limit(limit);
  if (offset !== undefined) query = query.range(offset, offset + (limit ? limit - 1 : 99));
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

---

## Supabase Database Schema Migration Script for Clutch Vault

```sql
create extension if not exists "pgcrypto";

-- Profiles table
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tournaments table
create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  start_date date,
  end_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Registrations table
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  tournament_id uuid references tournaments(id) on delete cascade,
  registered_at timestamptz default now()
);

-- Friends table
create table if not exists friends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  friend_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- Messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id) on delete set null,
  recipient_id uuid references profiles(id) on delete set null,
  content text not null,
  sent_at timestamptz default now()
);
```

---

## Usage Notes

- Use the `ilike` operator for case-insensitive partial matching in search queries.
- Integrate these queries with your React components by passing user input as the `searchQuery` parameter.
- Extend or customize queries as needed for your application logic.

This document provides a full set of Supabase queries tailored to your project schema and search requirements.
