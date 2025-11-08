import React from "react";
import { createRoot } from "react-dom/client";
// The Auth component currently lives at `src/Auth/Auth.jsx`.
// Import from that path to match the file location.
import Auth from "./(auth)";

// Entry that mounts the Auth UI (UI-only, no auth logic).

const root = document.getElementById("root");
if (!root) {
  // Helpful runtime message if index.html is missing or doesn't contain #root
  const msg = document.createElement("div");
  msg.style.padding = "24px";
  msg.style.fontFamily = "sans-serif";
  msg.innerHTML = `
    <h2>Missing <code>&lt;div id="root"&gt;&lt;/div&gt;</code></h2>
    <p>Please ensure <strong>FE/predict_app/index.html</strong> exists and contains <code>&lt;div id="root"&gt;&lt;/div&gt;</code>.</p>
  `;
  document.body.appendChild(msg);
} else {
  createRoot(root).render(<Auth />);
}
