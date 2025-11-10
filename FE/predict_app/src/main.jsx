import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
if (!root) {
  const msg = document.createElement("div");
  msg.style.padding = "24px";
  msg.style.fontFamily = "sans-serif";
  msg.innerHTML = `
    <h2>Missing <code>&lt;div id="root"&gt;&lt;/div&gt;</code></h2>
    <p>Please ensure <strong>FE/predict_app/index.html</strong> exists and contains <code>&lt;div id="root"&gt;&lt;/div&gt;</code>.</p>
  `;
  document.body.appendChild(msg);
} else {
  createRoot(root).render(<App />);
}
