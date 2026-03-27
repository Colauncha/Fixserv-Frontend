import axios from "axios";

const ORDER_API = axios.create({
  baseURL: "/api/orders",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

const ORDER_SERVICE_API = axios.create({
  baseURL: "/api/order-service",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

const attachAuth = (config) => {
  const token = localStorage.getItem("fixserv_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

ORDER_API.interceptors.request.use((config) => {
  const next = attachAuth(config);

  console.log(
    "ORDER AXIOS REQUEST =>",
    next.method?.toUpperCase(),
    `${next.baseURL || ""}${next.url || ""}`,
    next.params || next.data || ""
  );

  return next;
});

ORDER_SERVICE_API.interceptors.request.use((config) => {
  const next = attachAuth(config);

  console.log(
    "ORDER SERVICE AXIOS REQUEST =>",
    next.method?.toUpperCase(),
    `${next.baseURL || ""}${next.url || ""}`,
    next.params || next.data || ""
  );

  return next;
});

const handleResponse = (response) => {
  console.log(
    "ORDER AXIOS RESPONSE =>",
    response.status,
    response.config.url,
    response.data
  );
  return response;
};

const handleError = (error) => {
  console.log(
    "ORDER AXIOS ERROR =>",
    error?.response?.status,
    error?.config?.url,
    error?.response?.data || error?.message
  );
  return Promise.reject(error);
};

ORDER_API.interceptors.response.use(handleResponse, handleError);
ORDER_SERVICE_API.interceptors.response.use(handleResponse, handleError);

function normalizeOrderResponse(data) {
  const payload = data?.data || data?.order || data;
  const id = payload?.id || payload?._id || payload?.orderId;
  return id ? { ...payload, id } : payload;
}

function extractArray(payload, keys = []) {
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return null;
}



export const createDraftOrder = async (payload) => {
  const res = await ORDER_API.post("/draft", payload);
  return normalizeOrderResponse(res?.data);
};

export const getClientHistory = async () => {
  const res = await ORDER_API.get("/client-history");
  const data = res?.data;

  const orders =
    extractArray(data?.data, ["orders", "history"]) ||
    extractArray(data, ["orders", "history"]) ||
    (Array.isArray(data?.data) ? data.data : []) ||
    (Array.isArray(data) ? data : []);

  return Array.isArray(orders) ? orders : [];
};

export const getArtisanHistory = async () => {
  const res = await ORDER_API.get("/artisan-history");
  const data = res?.data;

  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data?.orders)) return data.data.orders;
  if (Array.isArray(data?.history)) return data.history;
  if (Array.isArray(data?.data?.history)) return data.data.history;
  if (Array.isArray(data)) return data;

  return [];
};

export const getOrderById = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  const res = await ORDER_API.get(`/${orderId}/getOrder`);
  return normalizeOrderResponse(res?.data);
};

export const createOrder = async (payload) => {
  const res = await ORDER_API.post("/create", payload);
  return normalizeOrderResponse(res?.data);
};

export const startWorkOnOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  await ORDER_API.patch(`/${orderId}/start-work`);
};

export const completeWorkOnOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  await ORDER_API.patch(`/${orderId}/complete-work`);
};

export const acceptOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  await ORDER_API.post(`/${orderId}/accept`);
};

export const rejectOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  await ORDER_API.post(`/${orderId}/reject`);
};

export const releasePaymentToArtisan = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  const res = await ORDER_API.post(`/${orderId}/release-payment`, {});
  return res?.data;
};

export const deleteOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  const res = await ORDER_API.delete(`/${orderId}`);
  return res?.data;
};

export const cancelOrderByClient = async (orderId, payload) => {
  if (!orderId) throw new Error("orderId is required");

  const res = await ORDER_API.patch(`/${orderId}/cancel`, payload);
  return res?.data;
};
