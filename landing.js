import { supabase } from './supabaseClient.js';

const helloMsg     = document.getElementById('hello-msg');
const navLogin     = document.getElementById('nav-login');
const navContinue  = document.getElementById('nav-continue');
const navLogout    = document.getElementById('nav-logout');
const inviteHint   = document.getElementById('invite-guest-hint');
const inviteForm   = document.getElementById('invite-form');
const inviteCodeIn = document.getElementById('invite-code');
const inviteBtn    = document.getElementById('invite-btn');
const inviteMsg    = document.getElementById('invite-msg');

const waitForm   = document.getElementById('waitlist-form');
const waitEmail  = document.getElementById('waitlist-email');
const waitBtn    = document.getElementById('waitlist-btn');
const waitMsg    = document.getElementById('waitlist-msg');

async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return { user, profile };
}

function toast(el, text, type='info') {
  el.textContent = text;
  el.className = 'mt-2 text-sm ' + (
    type === 'ok' ? 'text-green-700' :
    type === 'warn' ? 'text-amber-700' :
    type === 'err' ? 'text-red-700' : 'text-gray-600'
  );
}

(async () => {
  // If logged in & has beta access → go straight to app
  const { user, profile } = await getProfile();

  if (user) {
    helloMsg.classList.remove('hidden');
    helloMsg.textContent = `Sveiki, ${user.email}.`;
    navLogin?.classList.add('hidden');
    navLogout?.classList.remove('hidden');
    navLogout?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      location.reload();
    });
  }

  if (user && profile?.beta_access) {
    navContinue?.classList.remove('hidden');
    location.replace('index.html'); // still auto-redirect
    return;
  }

  // If logged in but no access → enable invite form
  if (user && !profile?.beta_access) {
    inviteHint.classList.add('hidden');
    inviteForm.classList.remove('hidden');
  }

  // Invite redeem
  inviteForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    inviteMsg.textContent = '';
    const code = (inviteCodeIn.value || '').trim();
    if (!code) return toast(inviteMsg, 'Įveskite kodą.', 'warn');

    inviteBtn.disabled = true;
    inviteBtn.textContent = 'Aktyvuojama…';
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast(inviteMsg, 'Prisijunkite ir bandykite dar kartą.', 'warn');
      } else {
       const { data, error } = await supabase.rpc('redeem_invite', { p_code: code });
        if (error) throw error;
        if (!data?.ok) {
          toast(inviteMsg, 'Kodas neteisingas arba nebegaliojantis.', 'err');
        } else {
          toast(inviteMsg, 'Kodas sėkmingai aktyvuotas! Peradresuojama…', 'ok');
          setTimeout(() => location.replace('index.html'), 900);
        }
      }
    } catch (err) {
      console.error(err);
      toast(inviteMsg, 'Nepavyko aktyvuoti kodo.', 'err');
    } finally {
      inviteBtn.disabled = false;
      inviteBtn.textContent = 'Aktyvuoti';
    }
  });

  // Waitlist
  waitForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    waitMsg.textContent = '';

    const email = (waitEmail.value || '').trim();
    if (!email) return toast(waitMsg, 'Įveskite el. paštą.', 'warn');

    waitBtn.disabled = true;
    waitBtn.textContent = 'Siunčiama…';
    try {
      const { error } = await supabase.from('beta_waitlist').insert({ email, source: 'landing' });
      if (error?.message?.includes('duplicate key')) {
        toast(waitMsg, 'Jau esate laukiančiųjų sąraše. Ačiū!', 'ok');
      } else if (error) {
        throw error;
      } else {
        toast(waitMsg, 'Viskas! Pranešime el. paštu, kai pakviesime.', 'ok');
        waitForm.reset();
      }
    } catch (err) {
      console.error(err);
      toast(waitMsg, 'Nepavyko pateikti. Pabandykite vėliau.', 'err');
    } finally {
      waitBtn.disabled = false;
      waitBtn.textContent = 'Gauti kvietimą';
    }
  });
})();
