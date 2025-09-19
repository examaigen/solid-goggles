// login.js
import { supabase } from "./supabaseClient.js";

// Redirect if already signed in
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) location.href = "index.html";
})();

const form     = document.getElementById("login-form");
const emailIn  = document.getElementById("login-email");
const passIn   = document.getElementById("login-password");
const errorEl  = document.getElementById("login-error");
const loginBtn = document.getElementById("login-btn");

form.addEventListener("submit", async e => {
  e.preventDefault();
  // custom validation (we disabled native bubble with `novalidate`)
  if (!emailIn.value || !passIn.value) {
    errorEl.textContent = "Įveskite el. paštą ir slaptažodį.";
    return;
  }
  errorEl.textContent = "";
  if (loginBtn) { loginBtn.disabled = true; loginBtn.textContent = "Jungiamasi…"; }
  const { error } = await supabase.auth.signInWithPassword({
    email:    emailIn.value.trim(),
    password: passIn.value.trim(),
  });
  if (error) {
    const msg = (m => {
      const s = (m||"").toLowerCase();
      if (s.includes("invalid login credentials")) return "Neteisingas el. paštas arba slaptažodis.";
      if (s.includes("email not confirmed"))      return "Patvirtinkite el. paštą ir bandykite dar kartą.";
      if (s.includes("rate limit"))               return "Per daug bandymų. Pabandykite vėliau.";
      return m || "Prisijungti nepavyko.";
    })(error.message);
    errorEl.textContent = msg;
    if (loginBtn) { loginBtn.disabled = false; loginBtn.textContent = "Prisijungti"; }
  } else {
    // success → go to app
    location.href = "index.html";
  }
});
