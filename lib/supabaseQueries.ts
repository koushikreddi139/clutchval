import { supabase } from './supabaseClient';

// Profiles
export async function fetchProfileById(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: object) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) throw error;
  return data;
}

// Tournaments
export async function fetchAllTournaments() {
  const { data, error } = await supabase.from('tournaments').select('*');
  if (error) throw error;
  return data;
}

export async function fetchTournamentById(tournamentId: string) {
  const { data, error } = await supabase.from('tournaments').select('*').eq('id', tournamentId).single();
  if (error) throw error;
  return data;
}

// Registrations
export async function registerForTournament(userId: string, tournamentId: string) {
  const { data, error } = await supabase.from('registrations').insert({
    user_id: userId,
    tournament_id: tournamentId,
  });
  if (error) throw error;
  return data;
}

export async function fetchUserRegistrations(userId: string) {
  const { data, error } = await supabase.from('registrations').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
}

// Friends
export async function fetchFriends(userId: string) {
  const { data, error } = await supabase.from('friends').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function addFriend(userId: string, friendId: string) {
  const { data, error } = await supabase.from('friends').insert({
    user_id: userId,
    friend_id: friendId,
  });
  if (error) throw error;
  return data;
}

// Messages / Inbox
export async function fetchMessages(userId: string) {
  const { data, error } = await supabase.from('messages').select('*').eq('recipient_id', userId);
  if (error) throw error;
  return data;
}

export async function sendMessage(senderId: string, recipientId: string, content: string) {
  const { data, error } = await supabase.from('messages').insert({
    sender_id: senderId,
    recipient_id: recipientId,
    content,
  });
  if (error) throw error;
  return data;
}

// Authentication helpers (if needed)
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Generic CRUD functions (optional)
// Fetch all records from a table with optional filters, pagination, and sorting
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
  let query = supabase.from(table).select("*");
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

export async function fetchById(table: string, id: string | number) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function insertRecord(table: string, record: object) {
  const { data, error } = await supabase.from(table).insert(record);
  if (error) throw error;
  return data;
}

export async function updateRecord(table: string, id: string | number, updates: object) {
  const { data, error } = await supabase.from(table).update(updates).eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteRecord(table: string, id: string | number) {
  const { data, error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

/**
 * Generic query for any table with optional filters, sorting, and pagination.
 * @param options
 *  - table: string (required)
 *  - filter: Record<string, any> (optional)
 *  - orderBy: string (optional)
 *  - ascending: boolean (optional, default true)
 *  - limit: number (optional)
 *  - offset: number (optional)
 */
export async function queryTable({
  table,
  filter = {},
  orderBy,
  ascending = true,
  limit,
  offset,
}: {
  table: string;
  filter?: Record<string, any>;
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  offset?: number;
}) {
  let query = supabase.from(table).select("*");

  Object.entries(filter).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  if (orderBy) query = query.order(orderBy, { ascending });
  if (limit !== undefined) query = query.limit(limit);
  if (offset !== undefined) query = query.range(offset, offset + (limit ? limit - 1 : 99));

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
