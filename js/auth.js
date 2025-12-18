import { supabase } from "./supabase.js";

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("loginError");

form.onsubmit = async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    errorEl.textContent = error.message;
    return;
  }

  // Redirect to dashboard on success
  window.location.href = "dashboard.html";
};

