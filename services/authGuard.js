// services/authGuard.js
import { supabase } from '../supabaseClient.js';
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "../config/env.js";
export async function ensureSessionOrRedirect() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    window.location.replace('login.html');
    throw new Error('No session');
  }
  return session;
}
