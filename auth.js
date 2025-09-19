// auth.js
// Centralized Supabase authentication logic for Exam Prep App

import { supabase } from './supabaseClient.js'
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";
// DOM element references for auth views
const authView    = document.getElementById("auth-view");
const loginForm   = document.getElementById("login-form");
const emailInput  = document.getElementById("email-input");
const passInput   = document.getElementById("password-input");
const loginError  = document.getElementById("login-error");
const signOutBtn  = document.getElementById("signout-btn");
const subjectView = document.getElementById("subject-view");

/**
 * Updates UI based on auth state.
 * Hides all main views, then shows either the login form or the subject view.
 */
export function handleAuthChange(session) {
  // Hide all main app views
  window.appHideAll();

  if (session) {
    // User is signed in
    authView.classList.add("hidden");
    signOutBtn.classList.remove("hidden");
    subjectView.classList.remove("hidden");
  } else {
    // User is signed out
    authView.classList.remove("hidden");
    signOutBtn.classList.add("hidden");
  }
}

// On page load: check existing session
(async () => {
  const {
    data: { session }
  } = await supabase.auth.getSession();
  handleAuthChange(session);
})();

// Subscribe to future auth state changes
supabase.auth.onAuthStateChange((_, session) => {
  handleAuthChange(session);
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const { error } = await supabase.auth.signInWithPassword({
    email:    emailInput.value,
    password: passInput.value,
  });

  if (error) {
    loginError.textContent = error.message;
  }
});

// Handle user sign-out
signOutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
});
