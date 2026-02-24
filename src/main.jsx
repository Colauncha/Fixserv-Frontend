import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("🔥 GOOGLE CLIENT ID:", clientId);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);

