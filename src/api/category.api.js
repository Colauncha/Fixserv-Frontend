// import axios from "axios";
// import { getAuthToken } from "../utils/auth";

// const CATEGORY_API = axios.create({
//   baseURL: "https://dev-user-api.fixserv.co/api",
//   timeout: 30000,
// });

// CATEGORY_API.interceptors.request.use((config) => {
//   const token = getAuthToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;

//   console.log(
//     "CATEGORY AXIOS REQUEST =>",
//     config.method?.toUpperCase(),
//     config.baseURL + config.url,
//     config.params || ""
//   );

//   return config;
// });

// CATEGORY_API.interceptors.response.use(
//   (res) => {
//     console.log("CATEGORY AXIOS RESPONSE =>", res.status, res.config.url, res.data);
//     return res;
//   },
//   (err) => {
//     console.log(
//       "CATEGORY AXIOS ERROR =>",
//       err?.response?.status,
//       err?.config?.url,
//       err?.response?.data || err?.message
//     );
//     return Promise.reject(err);
//   }
// );

// // GET /category/artisans/category/:category?location=&page=&limit=
// export const getArtisansByCategory = ({ category, location, page = 1, limit = 10 } = {}) => {
//   return CATEGORY_API.get(`/category/artisans/category/${encodeURIComponent(category)}`, {
//     params: {
//       ...(location ? { location } : {}),
//       ...(page ? { page } : {}),
//       ...(limit ? { limit } : {}),
//     },
//   }).then((r) => r.data);
// };


import axios from "axios";
import { getAuthToken } from "../utils/auth";

const CATEGORY_API = axios.create({
  baseURL: "https://dev-user-api.fixserv.co/api",
  timeout: 30000,
});

CATEGORY_API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  console.log(
    "CATEGORY AXIOS REQUEST =>",
    config.method?.toUpperCase(),
    (config.baseURL || "") + (config.url || ""),
    config.params || ""
  );

  return config;
});

CATEGORY_API.interceptors.response.use(
  (res) => {
    console.log(
      "CATEGORY AXIOS RESPONSE =>",
      res.status,
      res.config.url,
      res.data
    );
    return res;
  },
  (err) => {
    console.log(
      "CATEGORY AXIOS ERROR =>",
      err?.response?.status,
      err?.config?.url,
      err?.response?.data || err?.message
    );
    return Promise.reject(err);
  }
);

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