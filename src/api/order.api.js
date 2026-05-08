import { createApiClient } from "./createApiClient";

const ORDER_API_BASE_URL = import.meta.env.DEV
  ? "/api/orders"
  : import.meta.env.VITE_ORDER_API_BASE_URL ||
    "https://order-api.fixserv.co/api/orders";

const ORDER_SERVICE_API_BASE_URL = import.meta.env.DEV
  ? "/api/order-service"
  : import.meta.env.VITE_ORDER_SERVICE_API_BASE_URL ||
    "https://order-api.fixserv.co/api/order-service";

const ORDER_API = createApiClient({
  baseURL: ORDER_API_BASE_URL,
  requestLabel: "ORDER AXIOS REQUEST =>",
  responseLabel: "ORDER AXIOS RESPONSE =>",
  errorLabel: "ORDER AXIOS ERROR =>",
});

const ORDER_SERVICE_API = createApiClient({
  baseURL: ORDER_SERVICE_API_BASE_URL,
  requestLabel: "ORDER SERVICE AXIOS REQUEST =>",
  responseLabel: "ORDER SERVICE AXIOS RESPONSE =>",
  errorLabel: "ORDER SERVICE AXIOS ERROR =>",
});

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

  const res = await ORDER_API.patch(`/${orderId}/start-work`);
  return res?.data;
};

export const completeWorkOnOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  const res = await ORDER_API.patch(`/${orderId}/complete-work`);
  return res?.data;
};

export const acceptOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  const res = await ORDER_API.post(`/${orderId}/accept`);
  return res?.data;
};

export const rejectOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  const res = await ORDER_API.post(`/${orderId}/reject`);
  return res?.data;
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

export const cancelOrderByClient = async (orderId, payload = {}) => {
  if (!orderId) throw new Error("orderId is required");

  const res = await ORDER_API.patch(`/${orderId}/cancel`, payload);
  return res?.data;
};

export { ORDER_API, ORDER_SERVICE_API };