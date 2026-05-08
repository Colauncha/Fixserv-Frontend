import { createApiClient } from "./createApiClient";

const NOTIFICATION_API = createApiClient({
  baseURL:
    import.meta.env.VITE_NOTIFICATION_API_BASE_URL ||
    "https://notifications-api.fixserv.co/api/notifications",
});

const isNotificationServiceUnavailable = (error) => {
  const message = String(
    error?.backendMessage || error?.message || ""
  ).toLowerCase();

  return (
    message.includes("not found") ||
    message.includes("enotfound") ||
    message.includes("network") ||
    message.includes("unable to connect") ||
    message.includes("requested resource was not found")
  );
};

export const getNotifications = async () => {
  try {
    const response = await NOTIFICATION_API.get("/");
    return response?.data || [];
  } catch (error) {
    console.warn("Notifications unavailable:", error?.message);
    if (isNotificationServiceUnavailable(error)) return [];
    throw error;
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await NOTIFICATION_API.get("/unread-count");
    return response?.data || { count: 0, unreadCount: 0 };
  } catch (error) {
    console.warn("Unread notification count unavailable:", error?.message);
    if (isNotificationServiceUnavailable(error)) {
      return { count: 0, unreadCount: 0 };
    }
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await NOTIFICATION_API.patch("/mark-all-read");
    return response?.data || { success: true };
  } catch (error) {
    console.warn("Mark-all-read unavailable:", error?.message);
    if (isNotificationServiceUnavailable(error)) {
      return { success: false, message: "Notification service unavailable" };
    }
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  if (!notificationId) throw new Error("notificationId is required");

  try {
    const response = await NOTIFICATION_API.delete(`/${notificationId}`);
    return response?.data || { success: true };
  } catch (error) {
    console.warn("Delete notification unavailable:", error?.message);
    if (isNotificationServiceUnavailable(error)) {
      return { success: false, message: "Notification service unavailable" };
    }
    throw error;
  }
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