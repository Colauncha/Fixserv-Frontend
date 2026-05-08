import { createApiClient } from "./createApiClient";

const SEARCH_API = createApiClient({
  baseURL:
    import.meta.env.VITE_SEARCH_API_BASE_URL ||
    "https://search-api.fixserv.co/api",
});

const USER_API = createApiClient({
  baseURL: import.meta.env.VITE_USER_API_BASE_URL
    ? import.meta.env.VITE_USER_API_BASE_URL
    : "https://user-api.fixserv.co/api",
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
    // isAvailableNow: true,
  };

  // allow override if explicitly passed
  if (typeof params?.isAvailableNow !== "undefined") {
    queryParams.isAvailableNow = params.isAvailableNow;
  }

  const res = await SEARCH_API.get("/search", {
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