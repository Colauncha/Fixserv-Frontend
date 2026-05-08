import { createApiClient } from "./createApiClient";

const API = createApiClient({
  baseURL:
    import.meta.env.VITE_USER_API_BASE_URL ||
    import.meta.env.VITE_GENERAL_API_BASE_URL ||
    "https://user-api.fixserv.co/api",
  requestLabel: "AXIOS REQUEST =>",
  responseLabel: "AXIOS RESPONSE =>",
  errorLabel: "AXIOS ERROR =>",
});

// AUTH
export const registerUser = (payload, config = {}) =>
  API.post("/users/register", payload, config);

export const loginUser = (payload, config = {}) =>
  API.post("/admin/login", payload, config);

export const forgotPassword = (payload, config = {}) =>
  API.post("/admin/forgot-password", payload, config);

export const resendVerification = (payload, config = {}) =>
  API.post("/users/resend-verification", payload, config);

// GOOGLE AUTH
export const googleLogin = (payload, config = {}) =>
  API.post("/admin/google-login", payload, config);

export const googleUserLogin = (payload, config = {}) =>
  API.post("/users/google-login", payload, config);

export default API;