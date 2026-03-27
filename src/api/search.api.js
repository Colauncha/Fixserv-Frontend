import axios from "axios";

const SEARCH_API = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

SEARCH_API.interceptors.request.use((config) => {
  console.log(
    "SEARCH AXIOS REQUEST =>",
    config.method?.toUpperCase(),
    config.url,
    config.params || config.data
  );
  return config;
});

SEARCH_API.interceptors.response.use(
  (response) => {
    console.log("SEARCH AXIOS RESPONSE =>", {
      status: response?.status,
      url: response?.config?.url,
      data: response?.data,
    });
    return response;
  },
  (error) => {
    console.warn("SEARCH AXIOS ERROR FULL =>", {
      status: error?.response?.status,
      url: error?.config?.url,
      data: error?.response?.data,
      errors: error?.response?.data?.errors,
    });

    const first = error?.response?.data?.errors?.[0];
    if (first) console.warn("SEARCH FIRST ERROR =>", first);

    return Promise.reject(error);
  }
);

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
  try {
    const res = await fetch(
      `https://dev-user-api.fixserv.co/api/admin/getAll?role=ARTISAN&page=${page}`
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch artisans");
    }

    return data;
  } catch (error) {
    console.error("Get all artisans error:", error);
    throw error;
  }
};