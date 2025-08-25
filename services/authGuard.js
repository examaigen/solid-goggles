// services/authGuard.js
import { supabase } from '../supabaseClient.js';

export async function ensureSessionOrRedirect() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    window.location.replace('login.html');
    throw new Error('No session');
  }
  return session;
}
