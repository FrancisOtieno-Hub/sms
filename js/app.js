// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/pwa/service-worker.js");
}

// Session guard (optional enhancement later)
import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm")
  .then(({ createClient }) => {
    const supabase = createClient(
      "https://oxpxtwynpsqedthmspxh.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cHh0d3lucHNxZWR0aG1zcHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMTM2OTgsImV4cCI6MjA4MTU4OTY5OH0.SjT9jThD0PyPLz_LZo4A8qp-NHvlE0238_-6qxBjHKk"
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "dashboard.html";
      }
    });
  });
