import axios from "axios";
import { normalizeApiError } from "../utils/apiErrorHandler";

export const createApiClient = ({
  baseURL,
  contentType = "application/json",
  timeout = 30000,
  requestLabel = "AXIOS REQUEST =>",
  responseLabel = "AXIOS RESPONSE =>",
  errorLabel = "AXIOS ERROR =>",
  requireAuth = false,
}) => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": contentType,
      Accept: "application/json",
    },
    timeout,
  });

  client.interceptors.request.use(
    (config) => {
      const token =
        localStorage.getItem("fixserv_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (requireAuth && !token) {
        return Promise.reject(new Error("No auth token found"));
      }

      console.log(
        requestLabel,
        config.method?.toUpperCase(),
        `${config.baseURL || ""}${config.url || ""}`,
        {
          params: config.params || null,
          data: config.data || null,
          hasToken: !!token,
        }
      );

      return config;
    },
    (error) => Promise.reject(normalizeApiError(error))
  );

  client.interceptors.response.use(
    (response) => {
      console.log(
        responseLabel,
        response.status,
        response.config?.url,
        response.data
      );
      return response;
    },
    (error) => {
      console.log(
        errorLabel,
        error?.response?.status || "NO_STATUS",
        error?.config?.url || "NO_URL",
        error?.response?.data || error?.message
      );

      return Promise.reject(normalizeApiError(error));
    }
  );

  return client;
};