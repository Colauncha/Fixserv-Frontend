import axios from "axios";

const API = axios.create({
  baseURL: "https://dev-user-api.fixserv.co/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("fixserv_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "AXIOS REQUEST =>",
    config.method?.toUpperCase(),
    config.baseURL + config.url,
    config.data
  );

  return config;
});

API.interceptors.response.use(
  (response) => {
    console.log(
      "AXIOS RESPONSE =>",
      response.status,
      response.config?.url,
      response.data
    );
    return response;
  },
  (error) => {
    console.log(
      "AXIOS ERROR =>",
      error?.response?.status || "NO_STATUS",
      error?.config?.url || "NO_URL",
      error?.response?.data || error?.message
    );

    return Promise.reject(error);
  }
);

// AUTH
export const registerUser = (payload) =>
  API.post("/users/register", payload);

export const loginUser = (payload, config) =>
  API.post("/admin/login", payload, config);

export const resendVerification = (payload) =>
  API.post("/users/resend-verification", payload);

// GOOGLE AUTH
export const googleLogin = (payload) =>
  API.post("/admin/google-login", payload);

export const googleUserLogin = (payload) =>
  API.post("/users/google-login", payload);

export default API;