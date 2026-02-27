// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//   proxy: {
//     // ✅ SEARCH MUST COME FIRST so /api/search goes to search-api, not user-api
//     "/api/search": {
//       target: "https://dev-search-api.fixserv.co",
//       changeOrigin: true,
//       secure: false,
//     },

//     // ✅ optional fallback if backend is mounted without /api
//     "/search": {
//       target: "https://dev-search-api.fixserv.co",
//       changeOrigin: true,
//       secure: false,
//     },

//     // ✅ everything else under /api goes to user-api
//     "/api": {
//       target: "https://dev-user-api.fixserv.co",
//       changeOrigin: true,
//       secure: false,
//     },
//   },
// },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/search": {
        target: "https://dev-search-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },

      "/api/category": {
        target: "https://dev-user-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },

      "/api": {
        target: "https://dev-user-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});