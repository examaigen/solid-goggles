// Gate: require auth + beta_access for internal pages.
// On landing.html: if logged-in *and* beta_access => redirect to index.html.
import { supabase } from '../supabaseClient.js';

const page = location.pathname.split('/').pop() || 'index.html';

(async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (page === 'landing.html') {
    if (!user) return; // public landing for guests
    const { data: p } = await supabase.from('profiles').select('beta_access').eq('id', user.id).single();
    if (p?.beta_access) location.replace('index.html');
    return;
  }

  // Internal pages (everything else)
  if (!user) { location.replace('landing.html'); return; }
  const { data: p, error } = await supabase.from('profiles').select('beta_access').eq('id', user.id).single();
  if (error || !p?.beta_access) location.replace('landing.html');
})();
