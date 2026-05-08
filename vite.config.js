import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
server: {
  proxy: {
    "/api/user": {
      target: "https://user-api.fixserv.co",
      changeOrigin: true,
      secure: false,
    },

    "/api/service": {
      target: "https://service-api.fixserv.co",
      changeOrigin: true,
      secure: false,
    },

    "/api/orders": {
      target: "https://order-api.fixserv.co",
      changeOrigin: true,
      secure: false,
    },

    "/api/wallet": {
      target: "https://wallet-api.fixserv.co",
      changeOrigin: true,
      secure: false,
    },
  },
}

});