// faq.js – navigacija, sesija ir tabų valdymas
import { supabase } from './supabaseClient.js';
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";
// ---- NAV ----
function wireNav() {
  const go = (id, href) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => window.location.replace(href));
  };
  go('nav-home', 'index.html');
  go('nav-faq', 'faq.html');
  go('nav-profile', 'profile.html');
}

async function initAuthAwareUI() {
  const { data: { session }, error } = await supabase.auth.getSession();
  const signOutBtn = document.getElementById('signout-btn');

  // Jei norite, kad DUK būtų prieinamas tik prisijungus, atkomentuokite:
  // if (!session) return window.location.replace('login.html');

  if (!error && session && signOutBtn) {
    signOutBtn.classList.remove('hidden');
    signOutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.replace('login.html');
    });
  }
}

// ---- TABS ----
const TABS = ['egzaminai', 'paskyra', 'statistika', 'technika', 'privatumas'];

function setActiveTab(name, pushHash = true) {
  if (!TABS.includes(name)) name = 'egzaminai';

  // Buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isActive = btn.dataset.tab === name;
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Panels
  TABS.forEach(t => {
    const panel = document.getElementById(`tab-${t}`);
    if (panel) panel.classList.toggle('hidden', t !== name);
  });

  // URL hash (deep link)
  if (pushHash) {
    try { history.replaceState(null, '', `#${name}`); } catch (_) {}
  }
}

function wireTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  // Initial from hash (e.g., faq.html#statistika)
  const fromHash = (location.hash || '').replace('#', '');
  setActiveTab(fromHash || 'egzaminai', false);

  // React to manual hash edits
  window.addEventListener('hashchange', () => {
    const h = (location.hash || '').replace('#', '');
    setActiveTab(h || 'egzaminai', false);
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', async () => {
  wireNav();
  wireTabs();
  await initAuthAwareUI();
});
