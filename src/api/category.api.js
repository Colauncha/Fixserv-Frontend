import { getAuthToken } from "../utils/auth";
import { createApiClient } from "./createApiClient";

const CATEGORY_API = createApiClient({
  baseURL: import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_USER_API_BASE_URL ||
      import.meta.env.VITE_GENERAL_API_BASE_URL ||
      "https://dev-user-api.fixserv.co/api",
  requestLabel: "CATEGORY AXIOS REQUEST =>",
  responseLabel: "CATEGORY AXIOS RESPONSE =>",
  errorLabel: "CATEGORY AXIOS ERROR =>",
});

CATEGORY_API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "CATEGORY AXIOS REQUEST =>",
    config.method?.toUpperCase(),
    `${config.baseURL || ""}${config.url || ""}`,
    config.params || ""
  );

  return config;
});

export const getAllCategories = () => {
  return CATEGORY_API.get("/category/categories").then((r) => r.data);
};

export const getArtisansByCategory = ({
  category,
  location,
  page = 1,
  limit = 10,
} = {}) => {
  return CATEGORY_API.get(
    `/category/artisans/category/${encodeURIComponent(category)}`,
    {
      params: {
        ...(location ? { location } : {}),
        ...(page ? { page } : {}),
        ...(limit ? { limit } : {}),
      },
    }
  ).then((r) => r.data);
};