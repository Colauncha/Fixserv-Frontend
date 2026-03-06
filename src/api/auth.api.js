import axios from "axios";

const API = axios.create({
  baseURL: "https://dev-user-api.fixserv.co/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ✅ put interceptor HERE
API.interceptors.request.use((config) => {
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
    console.log("AXIOS RESPONSE =>", response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.log(
      "AXIOS ERROR =>",
      error?.response?.status,
      error?.config?.url,
      error?.response?.data || error?.message
    );
    return Promise.reject(error);
  }
);

export const registerUser = (payload) => API.post("/users/register", payload);

export const loginUser = (payload, config) =>
  API.post("/admin/login", payload, config);

export const resendVerification = (payload) =>
  API.post("/users/resend-verification", payload);

export const adminLogin = (payload) => API.post("/admin/login", payload);

export const googleLogin = (payload) => API.post("/admin/google-login", payload);

export const googleUserLogin = (payload) => API.post("/users/google-login", payload);