import { createApiClient } from "./createApiClient";

const SEARCH_API = createApiClient({
  baseURL: import.meta.env.DEV
    ? "/"
    : import.meta.env.VITE_SEARCH_API_BASE_URL ||
      "https://dev-search-api.fixserv.co",
  requestLabel: "SEARCH AXIOS REQUEST =>",
  responseLabel: "SEARCH AXIOS RESPONSE =>",
  errorLabel: "SEARCH AXIOS ERROR =>",
});

const USER_API = createApiClient({
  baseURL: import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_USER_API_BASE_URL ||
      import.meta.env.VITE_GENERAL_API_BASE_URL ||
      "https://dev-user-api.fixserv.co/api",
  requestLabel: "USER AXIOS REQUEST =>",
  responseLabel: "USER AXIOS RESPONSE =>",
  errorLabel: "USER AXIOS ERROR =>",
});

export const searchServicesAndArtisans = async (params = {}) => {
  const keyword = (params?.keyword || "").trim();

  if (!keyword || keyword.length < 2) {
    return {
      success: true,
      data: {
        artisans: {
          data: [],
        },
      },
    };
  }

  const queryParams = {
    keyword,
  };

  if (typeof params?.isAvailableNow !== "undefined") {
    queryParams.isAvailableNow = params.isAvailableNow;
  }

  const res = await SEARCH_API.get("/api/search", {
    params: queryParams,
  });

  return res.data;
};

export const getAllArtisans = async (page = 1) => {
  const res = await USER_API.get("/admin/getAll", {
    params: {
      role: "ARTISAN",
      page,
    },
  });

  return res.data;
};

export { SEARCH_API, USER_API };