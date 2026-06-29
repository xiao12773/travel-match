import { supabase } from '../lib/supabase';

const ROOM_TTL_DAYS = 7;
const ID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

function genRoomId(len = 7) {
  let id = '';
  for (let i = 0; i < len; i++) id += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  return id;
}

export function roleKey(roomId) {
  return `tm_room_${roomId}_role`;
}

export async function createRoom(answersA) {
  const id = genRoomId();
  const expiresAt = new Date(Date.now() + ROOM_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase.from('rooms').insert({
    id,
    user_a_answers: answersA,
    user_a_completed_at: new Date().toISOString(),
    expires_at: expiresAt,
  });
  if (error) throw error;
  try {
    localStorage.setItem(roleKey(id), 'a');
  } catch {
    // ignore
  }
  return id;
}

export async function getRoom(roomId) {
  const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function submitAnswersB(roomId, answersB) {
  const { error } = await supabase
    .from('rooms')
    .update({ user_b_answers: answersB, user_b_completed_at: new Date().toISOString() })
    .eq('id', roomId)
    .is('user_b_answers', null);
  if (error) throw error;
  try {
    localStorage.setItem(roleKey(roomId), 'b');
  } catch {
    // ignore
  }
}

export function isExpired(room) {
  return Boolean(room?.expires_at && new Date(room.expires_at) < new Date());
}
