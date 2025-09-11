// login.js
import { supabase } from "./supabaseClient.js";

// Redirect if already signed in
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) location.href = "index.html";
})();

const form      = document.getElementById("login-form");
const emailIn   = document.getElementById("email-input");
const passIn    = document.getElementById("password-input");
const errorEl   = document.getElementById("login-error");

form.addEventListener("submit", async e => {
  e.preventDefault();
  errorEl.textContent = "";
  const { error } = await supabase.auth.signInWithPassword({
    email:    emailIn.value,
    password: passIn.value,
  });
  if (error) {
    errorEl.textContent = error.message;
  } else {
    // success → go to app
    location.href = "index.html";
  }
});
