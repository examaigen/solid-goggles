// supabaseClient.js — browser ESM (no bundler needed)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";

// ⬇️ Put your real project values here
const SUPABASE_URL = 'https://fyheusyatkdbausgtrxi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5aGV1c3lhdGtkYmF1c2d0cnhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODgwNTUsImV4cCI6MjA2NjM2NDA1NX0.0S6Xh-5w185d28tsQDRR39yrSPPRgUAz1qrkdU6ZO_o';
const API_BASE = "https://api.mokslaigo.lt";

// Safety: warn if placeholders are left
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[supabase] Missing/placeholder URL or anon key in supabaseClient.js');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // we’re not using the OAuth hash flow here
  },
});

// Convenience helpers (optional)
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) console.warn('[supabase] getSession error:', error);
  return session || null;
}

export async function requireSession(redirectTo = 'login.html') {
  const session = await getSession();
  if (!session) {
    location.replace(redirectTo);
    return null;
  }
  return session;
}
