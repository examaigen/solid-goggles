// Reusable navbar component: <app-nav></app-nav>
// Tailwind styles work because we render into light DOM (no shadow root).
import { supabase } from "../supabaseClient.js";
import { APP_NAME } from "../config/env.js";
import { t } from "../config/i18n-lt.js";

// Keep hrefs centralized; labels come from i18n (t.nav.*)
const LINKS = [
  { id: "nav-home",    key: "home",    href: "index.html",   match: ["index.html", "/", ""] },
  { id: "nav-practice",key: "practice",href: "practice.html",match: ["practice.html", "/practice"] },
  { id: "nav-exam",    key: "exam",    href: "exam.html",    match: ["exam.html", "/exam"] },
  { id: "nav-special", key: "special",  href: "special.html", match: ["special.html", "/special"] }, /* label shows via t.nav.player or swap to a 'special' key if you add it */
  { id: "nav-faq",     key: "faq",     href: "faq.html",     match: ["faq.html", "/faq"] },
];

class AppNav extends HTMLElement {
  connectedCallback() {
    this.render();
    this.highlightActive();
    this.wireAuth();
  }

  render() {
    // Helper to read i18n safely
    const label = (k) => (t?.nav?.[k] ?? k);
    this.innerHTML = `
      <nav class="bg-white border-b" role="navigation" aria-label="Pagrindinis meniu">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <a href="./index.html" class="font-semibold text-gray-800 text-xl" data-brand>${APP_NAME}</a>
            <div class="flex items-center gap-5">
              ${LINKS.map(l => `
                <a id="${l.id}" href="./${l.href}" class="text-gray-700 hover:text-blue-700">
                  ${label(l.key)}
                </a>
              `).join("")}
              <span id="nav-auth" class="flex items-center gap-3">
                <a href="./login.html" class="text-blue-600 hover:underline" data-i18n="nav.login">${t.nav.login}</a>
                <a href="./register.html" class="text-blue-600 hover:underline" data-i18n="nav.register">${t.nav.register}</a>
              </span>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  highlightActive() {
    const token = this.currentPathToken();
    LINKS.forEach(link => {
      const el = this.querySelector(`#${link.id}`);
      if (!el) return;
      const isActive = link.match.includes(token);
      el.classList.toggle("text-blue-700", isActive);
      el.classList.toggle("font-semibold", isActive);
      el.classList.toggle("border-b-2", isActive);
      el.classList.toggle("border-blue-700", isActive);
      el.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  currentPathToken() {
    // strip query/hash; then get last segment or default to index.html
    const clean = location.pathname.replace(/[?#].*$/, "");
    const last = clean.split("/").pop();
    return last && last !== "" ? last : "index.html";
  }

  async wireAuth() {
    const navAuth = this.querySelector("#nav-auth");
    if (!navAuth) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Logged in → show Profile + Logout
        navAuth.innerHTML = `
          <a href="./profile.html" class="text-gray-700 hover:text-blue-700" data-i18n="nav.profile">${t.nav.profile}</a>
          <button id="logoutBtn" class="text-red-600 hover:underline" data-i18n="nav.logout">${t.nav.logout}</button>
        `;
        this.querySelector("#logoutBtn")?.addEventListener("click", async () => {
          try {
            await supabase.auth.signOut();
          } finally {
            location.href = "./index.html";
          }
          });
      } else {
        // Logged out → show Login + Register (already rendered)
        navAuth.innerHTML = `
          <a href="./login.html" class="text-blue-600 hover:underline" data-i18n="nav.login">${t.nav.login}</a>
          <a href="./register.html" class="text-blue-600 hover:underline" data-i18n="nav.register">${t.nav.register}</a>
        `;
      }
    } catch (e) {
      console.warn("Navbar auth wiring error:", e);
      // fallback to logged-out state
      navAuth.innerHTML = `
        <a href="./login.html" class="text-blue-600 hover:underline" data-i18n="nav.login">${t.nav.login}</a>
        <a href="./register.html" class="text-blue-600 hover:underline" data-i18n="nav.register">${t.nav.register}</a>
      `;
    }
  }
}

customElements.define('app-nav', AppNav);
