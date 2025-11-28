// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // PERBAIKAN 1: Ubah ke 'auto' agar Service Worker otomatis jalan
      registerType: "autoUpdate",
      injectRegister: "auto", 

      includeAssets: [
        "favicon.ico",
        "favicon.svg",
        "apple-touch-icon.png"
      ],

      manifest: {
        name: "ExploreNusa",
        short_name: "ExploreNusa",
        description: "PWA aplikasi destinasi wisata Indonesia",
        theme_color: "#0d9488",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",

        icons: [
          {
            // PERBAIKAN 2: Hapus tanda '/' di depan agar path lebih aman
            src: "pwa-192.png",   
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512.png",   
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512.png",    
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          }
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
        // Opsional: Abaikan error jika user offline saat validasi
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});