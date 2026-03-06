

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // SEARCH
      "/api/search": {
        target: "https://dev-search-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },

      // WALLET
      "/api/wallet": {
        target: "https://dev-wallet-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },

      // ORDER API
      "/api/orders": {
        target: "https://dev-order-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },

      // ORDER SERVICE
      "/api/order-service": {
        target: "https://dev-order-service.fixserv.co",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/order-service/, ""),
      },

      // USER CATEGORY
      "/api/category": {
        target: "https://dev-user-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },

      
  "/api/service": {
    target: "https://dev-service-api.fixserv.co",
    changeOrigin: true,
    secure: false,
  },

      //  SERVICE API (IMPORTANT: keep above "/api")
      "/service-api": {
        target: "https://dev-service-api.fixserv.co",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/service-api/, ""),
      },

      // KEEP THIS LAST (catch-all for user api)
      "/api": {
        target: "https://dev-user-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});