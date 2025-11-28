// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import PWABadge from "./PWABadge.jsx"; // ← tambahkan ini

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* Badge PWA untuk info offline & update */}
    <PWABadge />
  </React.StrictMode>
);
