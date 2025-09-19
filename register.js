// register.js
import { supabase } from "./supabaseClient.js";
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";
const form          = document.getElementById("register-form");
const emailInput    = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const confirmInput  = document.getElementById("confirm-password-input");
const errorEl       = document.getElementById("register-error");
const submitBtn     = form.querySelector("button[type='submit']");

(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) location.href = "index.html";
})();


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";
  submitBtn.disabled = true;
  
  const email    = emailInput.value.trim();
  const password = passwordInput.value;
  const confirm  = confirmInput.value;

  // Client-side validation
  if (!email || !password) {
    errorEl.textContent = "El. paštas ir slaptažodis privalomi.";
    submitBtn.disabled = false;
    return;
  }
  if (password !== confirm) {
    errorEl.textContent = "Slaptažodžiai nesutampa.";
    submitBtn.disabled = false;
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = "Slaptažodis turi būti bent 6 simbolių.";
    submitBtn.disabled = false;
    return;
  }

  try {
    // 1️⃣ Register with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;
    
    const user = data.user;
    console.log("User created:", user);

    // 2️⃣ Insert into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, email: user.email }]);
    if (profileError) throw new Error("Profilio kūrimo klaida: " + profileError.message);

    // 3️⃣ On success, navigate to login
    window.location.replace("landing.html");

  } catch (err) {
    console.error("Register error:", err);
    errorEl.textContent = err.message || "Įvyko nežinoma klaida.";
    submitBtn.disabled = false;
  }
});
