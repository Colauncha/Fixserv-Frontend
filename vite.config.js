// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       "/api/search": {
//   target: "https://dev-search-api.fixserv.co",
//   changeOrigin: true,
//   secure: false,
// },

//       "/api/wallet": {
//   target: "https://dev-wallet-api.fixserv.co",
//   changeOrigin: true,
//   secure: false,
// },

//       "/api/withdrawal": {
//         target: "https://dev-wallet-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },

//       "/api/orders": {
//   target: "https://dev-order-api.fixserv.co",
//   changeOrigin: true,
//   secure: false,
// },

//       "/api/upload": {
//         target: "https://dev-order-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },

//       // "/api/order-service": {
//       //   target: "https://dev-order-service.fixserv.co",
//       //   changeOrigin: true,
//       //   secure: false,
//       //   rewrite: (path) => path.replace(/^\/api\/order-service/, ""),
//       // },

//       "/api/order-service": {
//   target: "https://dev-order-api.fixserv.co",
//   changeOrigin: true,
//   secure: false,
//   rewrite: (path) => path.replace(/^\/api\/order-service/, "/api/order-service"),
// },

//       "/api/category": {
//         target: "https://dev-user-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },

//       "/api/service": {
//   target: "https://dev-service-api.fixserv.co",
//   changeOrigin: true,
//   secure: false,
// },

//       "/api": {
//   target: "https://dev-user-api.fixserv.co",
//   changeOrigin: true,
//   secure: false,
// },

//       "/api/notifications": {
//   target: "https://dev-notifications-api.fixserv.co",
//   changeOrigin: true,
//   secure: false,
// },
//     },
//   },
// });


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       "/api/search": {
//         target: "https://dev-search-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },

//       "/api/wallet": {
//         target: "https://dev-wallet-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },

//       "/api/withdrawal": {
//         target: "https://dev-wallet-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },

//       "/api/orders": {
//       target: "https://dev-order-api.fixserv.co/api/orders",
//       changeOrigin: true,
//       secure: true,
//       rewrite: (path) => path.replace(/^\/api\/orders/, ""),
//     },

//       // "/api/upload": {
//       //   target: "https://dev-order-api.fixserv.co",
//       //   changeOrigin: true,
//       //   secure: false,
//       // },

//       "/api/order-service": {
//         target: "https://dev-order-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) =>
//           path.replace(/^\/api\/order-service/, "/api/order-service"),
//       },

//       "/api/category": {
//         target: "https://dev-user-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },

//       "/api/service": {
//         target: "https://dev-service-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },

//       "/api/notifications": {
//         target: "https://dev-notifications-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },

//       "/api/certificate": {
//   target: "https://dev-user-api.fixserv.co",
//   changeOrigin: true,
//   secure: true,
// },

// "/api/upload": {
//   target: "https://dev-user-api.fixserv.co/api/upload",
//   changeOrigin: true,
//   secure: true,
//   rewrite: (path) => path.replace(/^\/api\/upload/, ""),
// },

//       "/api": {
//         target: "https://dev-user-api.fixserv.co",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
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

      "/api/wallet": {
        target: "https://dev-wallet-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },

      "/api/withdrawal": {
        target: "https://dev-wallet-api.fixserv.co",
        changeOrigin: true,
        secure: false,
      },

      "/api/orders": {
        target: "https://dev-order-api.fixserv.co/api/orders",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/orders/, ""),
      },

      "/api/order-service": {
        target: "https://dev-order-api.fixserv.co",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/api\/order-service/, "/api/order-service"),
      },

      "/api/upload": {
        target: "https://dev-user-api.fixserv.co/api/upload",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/upload/, ""),
      },

      "/api/certificate": {
        target: "https://dev-user-api.fixserv.co",
        changeOrigin: true,
        secure: true,
      },

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

      "/api/notifications": {
        target: "https://dev-notifications-api.fixserv.co",
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