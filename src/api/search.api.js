import axios from "axios";

const SEARCH_API = axios.create({
  baseURL: "", // ✅ relative so Vite proxy handles it
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
  (response) => response,
  (error) => {
    console.log("SEARCH AXIOS ERROR FULL =>", {
      status: error?.response?.status,
      url: error?.config?.url,
      data: error?.response?.data,
      errors: error?.response?.data?.errors,
    });

    // 👇 shows the exact message if it's validation
    const first = error?.response?.data?.errors?.[0];
    if (first) console.log("SEARCH FIRST ERROR =>", first);

    return Promise.reject(error);
  }
);

export const searchServicesAndArtisans = async (params) => {
  const queryParams = {
    keyword: (params?.keyword || "").trim(),
  };

  // ✅ Only include isAvailableNow if explicitly provided
  if (typeof params?.isAvailableNow !== "undefined") {
    queryParams.isAvailableNow = params.isAvailableNow;
  }

  const res = await SEARCH_API.get("/api/search", {
    params: queryParams,
  });

  return res.data;
};
