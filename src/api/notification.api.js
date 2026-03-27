import axios from "axios";

const NOTIFICATION_API = axios.create({
  baseURL: "https://dev-notifications-api.fixserv.co/api/notifications",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

NOTIFICATION_API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("fixserv_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  if (!token) {
    return Promise.reject(new Error("No auth token found for notifications"));
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

NOTIFICATION_API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const getNotifications = async () => {
  const response = await NOTIFICATION_API.get("");
  return response.data;
};

export const getUnreadNotificationCount = async () => {
  const response = await NOTIFICATION_API.get("/unread-count");
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await NOTIFICATION_API.patch("/mark-all-read");
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  if (!notificationId) throw new Error("notificationId is required");

  const response = await NOTIFICATION_API.delete(`/${notificationId}`);
  return response.data;
};

const SEEN_ORDER_IDS_KEY = "fixserv_seen_order_notification_ids";

const readStoredArray = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredArray = (key, values) => {
  const normalized = Array.from(
    new Set(values.map((v) => String(v).trim()).filter(Boolean))
  );
  localStorage.setItem(key, JSON.stringify(normalized));
};

export const getSeenOrderNotificationIds = () => {
  return readStoredArray(SEEN_ORDER_IDS_KEY);
};

export const markOrderNotificationsSeen = (orderIds = []) => {
  const existing = readStoredArray(SEEN_ORDER_IDS_KEY);
  writeStoredArray(SEEN_ORDER_IDS_KEY, [...existing, ...orderIds]);
  window.dispatchEvent(new Event("fixserv-notifications-updated"));
};

export const isOrderNotificationSeen = (orderId) => {
  if (!orderId) return false;
  return readStoredArray(SEEN_ORDER_IDS_KEY).includes(String(orderId));
};