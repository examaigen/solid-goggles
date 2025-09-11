// components/navbar.js
// Reusable navbar component: <app-nav></app-nav>
// Tailwind styles work because we render into light DOM (no shadow root).
import { supabase } from '../supabaseClient.js';

const LINKS = [
  { id: 'nav-home',     label: 'Pagrindinis', href: 'index.html',   match: ['index.html', '/', ''] },
  { id: 'nav-practice', label: 'Praktika',           href: 'practice.html',match: ['practice.html', '/practice'] },
  { id: 'nav-exam',     label: 'Egzaminas',          href: 'exam.html',    match: ['exam.html', '/exam'] },
  { id: 'nav-special',  label: 'Mokymosi įrankiai',  href: 'special.html', match: ['special.html', '/special'] },
  { id: 'nav-faq',      label: 'DUK',                href: 'faq.html',     match: ['faq.html', '/faq'] },
  { id: 'nav-profile',  label: 'Profilis',           href: 'profile.html', match: ['profile.html', '/profile'] },
];

class AppNav extends HTMLElement {
  connectedCallback() {
    this.render();
    this.highlightActive();
    this.wireAuth();
  }

  render() {
    this.innerHTML = `
      <nav class="bg-white shadow p-4 flex justify-between items-center">
        <a href="index.html" class="text-2xl font-bold">Exam Prep</a>
        <div class="space-x-6 flex items-center">
          ${LINKS.map(l => `<a id="${l.id}" href="${l.href}" class="hover:text-blue-600">${l.label}</a>`).join('')}
          <button id="signout-btn" class="hover:text-blue-600 hidden">Atsijungti</button>
        </div>
      </nav>
    `;
  }

  highlightActive() {
    const token = this.currentPathToken();
    for (const link of LINKS) {
      const el = this.querySelector(`#${link.id}`);
      if (!el) continue;
      const isActive = link.match.includes(token);
      el.classList.toggle('text-blue-600', isActive);
      el.classList.toggle('font-semibold', isActive);
      el.classList.toggle('border-b-2', isActive);
      el.classList.toggle('border-blue-600', isActive);
    }
  }

  currentPathToken() {
    // strip query/hash; then get last segment or default to index.html
    const clean = location.pathname.replace(/[?#].*$/, '');
    const last = clean.split('/').pop();
    return last && last !== '' ? last : 'index.html';
  }

  async wireAuth() {
    const btn = this.querySelector('#signout-btn');
    const profileLink = this.querySelector('#nav-profile');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        btn.classList.remove('hidden');
        btn.addEventListener('click', async () => {
          try {
            await supabase.auth.signOut();
          } finally {
            location.href = 'login.html';
          }
        });
      } else {
        btn.classList.add('hidden');
        // If logged out, point Profile to login (optional)
        if (profileLink) profileLink.href = 'login.html';
      }
    } catch (e) {
      console.warn('Navbar auth wiring error:', e);
      btn?.classList.add('hidden');
    }
  }
}

customElements.define('app-nav', AppNav);
