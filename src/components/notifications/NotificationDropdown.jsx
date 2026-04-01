import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  markAllNotificationsAsRead,
  deleteNotification,
  isOrderNotificationSeen,
} from "../../api/notification.api";

import {
  acceptOrder,
  rejectOrder,
  startWorkOnOrder,
  completeWorkOnOrder,
  getOrderById,
} from "../../api/order.api";

const NotificationDropdown = ({ isOpen, onClose, onChanged, userRole }) => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const normalizeNotificationList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.notifications)) return payload.notifications;
    if (Array.isArray(payload?.data?.notifications))
      return payload.data.notifications;
    return [];
  };

  const getOrderId = (item) => {
    return (
      item?.data?.orderId ||
      item?.data?.requestId ||
      item?.data?.jobId ||
      item?.orderId ||
      item?.data?.id ||
      null
    );
  };

  const isHandledNotification = (item) => {
    const orderId = getOrderId(item);
    return orderId ? isOrderNotificationSeen(orderId) : false;
  };

  const loadNotifications = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const response = await getNotifications();
      const list = normalizeNotificationList(response);

      setNotifications(list);
    } catch (error) {
      console.warn("Failed to load notifications:", error?.message);
      setNotifications([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    loadNotifications(true);
  }, [isOpen, loadNotifications]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      loadNotifications(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, loadNotifications]);

  useEffect(() => {
    if (!isOpen) return;
    if (notifications.length === 0) return;

    const hasUnread = notifications.some((item) => !item?.readAt);
    if (!hasUnread) return;

    const markAllRead = async () => {
      try {
        setMarkingAll(true);
        await markAllNotificationsAsRead();

        setNotifications((prev) =>
          prev.map((item) =>
            item?.readAt ? item : { ...item, readAt: new Date().toISOString() }
          )
        );

        onChanged?.();
      } catch (error) {
        console.warn("Failed to mark all notifications as read:", error?.message);
      } finally {
        setMarkingAll(false);
      }
    };

    markAllRead();
  }, [isOpen, notifications, onChanged]);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      onChanged?.();
    } catch (error) {
      console.warn("Failed to delete notification:", error?.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleNotificationClick = (item) => {
    const orderId = getOrderId(item);
    const type = String(item?.type || "").toUpperCase();
    const status = String(item?.data?.status || item?.status || "").toUpperCase();
    const title = String(item?.title || "").toUpperCase();
    const message = String(item?.message || "").toUpperCase();


    if (userRole === "ARTISAN") {
  const paymentReleasedNotification =
    title.includes("PAYMENT RELEASED") ||
    message.includes("PAYMENT RELEASED") ||
    message.includes("RELEASED TO YOUR WALLET") ||
    message.includes("RELEASED TO WALLET") ||
    message.includes("HAS BEEN RELEASED TO YOUR WALLET") ||
    type.includes("PAYMENT");

  if (paymentReleasedNotification) {
    navigate("/artisan/wallet");
    onClose?.();
    return;
  }

  if (
    orderId &&
    (type.includes("ORDER") ||
      type.includes("REQUEST") ||
      status ||
      title.includes("REQUEST") ||
      message.includes("REQUEST") ||
      title.includes("JOB") ||
      message.includes("JOB"))
  ) {
    navigate("/artisan/jobs");
    onClose?.();
    return;
  }

  navigate("/artisan/dashboard");
  onClose?.();
  return;
}

    // if (userRole === "ARTISAN") {
    //   if (
    //     orderId &&
    //     (type.includes("ORDER") ||
    //       type.includes("REQUEST") ||
    //       status ||
    //       title.includes("REQUEST") ||
    //       message.includes("REQUEST") ||
    //       title.includes("JOB") ||
    //       message.includes("JOB"))
    //   ) {
    //     navigate("/artisan/jobs");
    //     onClose?.();
    //     return;
    //   }

    //   navigate("/artisan");
    //   onClose?.();
    //   return;
    // }

    if (userRole === "CLIENT") {
      if (orderId) {
        navigate(`/client/track-repair/${orderId}`, {
          state: { orderId },
        });
        onClose?.();
        return;
      }

      if (
        type.includes("ORDER") ||
        type.includes("REQUEST") ||
        title.includes("REQUEST") ||
        message.includes("REQUEST")
      ) {
        navigate("/client/repair");
        onClose?.();
        return;
      }

      navigate("/client");
      onClose?.();
    }
  };

  const handleAccept = async (item) => {
    const orderId = getOrderId(item);
    if (!orderId) return;

    try {
      setActioningId(item.id);

      const latestOrder = await getOrderById(orderId);
      const latestStatus = String(latestOrder?.status || "").toUpperCase();

      if (
        latestStatus &&
        latestStatus !== "PENDING" &&
        latestStatus !== "REQUESTED" &&
        latestStatus !== "PENDING_ARTISAN_RESPONSE"
      ) {
        await loadNotifications(false);
        onChanged?.();
        return;
      }

      await acceptOrder(orderId);
      await loadNotifications(false);
      onChanged?.();
    } catch (error) {
      console.warn("Failed to accept order:", error?.message);
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (item) => {
    const orderId = getOrderId(item);
    if (!orderId) return;

    try {
      setActioningId(item.id);

      const latestOrder = await getOrderById(orderId);
      const latestStatus = String(latestOrder?.status || "").toUpperCase();

      if (
        latestStatus &&
        latestStatus !== "PENDING" &&
        latestStatus !== "REQUESTED" &&
        latestStatus !== "PENDING_ARTISAN_RESPONSE"
      ) {
        await loadNotifications(false);
        onChanged?.();
        return;
      }

      await rejectOrder(orderId);
      await loadNotifications(false);
      onChanged?.();
    } catch (error) {
      console.warn("Failed to reject order:", error?.message);
    } finally {
      setActioningId(null);
    }
  };

  const handleStartWork = async (item) => {
    const orderId = getOrderId(item);
    if (!orderId) return;

    try {
      setActioningId(item.id);
      await startWorkOnOrder(orderId);
      await loadNotifications(false);
      onChanged?.();
    } catch (error) {
      console.warn("Failed to start work:", error?.message);
    } finally {
      setActioningId(null);
    }
  };

  const handleCompleteWork = async (item) => {
    const orderId = getOrderId(item);
    if (!orderId) return;

    try {
      setActioningId(item.id);
      await completeWorkOnOrder(orderId);
      await loadNotifications(false);
      onChanged?.();
    } catch (error) {
      console.warn("Failed to complete work:", error?.message);
    } finally {
      setActioningId(null);
    }
  };

  const renderActions = (item) => {
    if (userRole !== "ARTISAN") return null;

    const orderId = getOrderId(item);
    if (!orderId) return null;

    const status = String(item?.data?.status || item?.status || "").toUpperCase();

    if (
      !status ||
      status === "PENDING" ||
      status === "REQUESTED" ||
      status === "PENDING_ARTISAN_RESPONSE"
    ) {
      return (
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAccept(item);
            }}
            disabled={actioningId === item.id}
            className="px-3 py-1 rounded bg-green-600 text-white text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actioningId === item.id ? "Please wait..." : "Accept"}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReject(item);
            }}
            disabled={actioningId === item.id}
            className="px-3 py-1 rounded bg-red-600 text-white text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actioningId === item.id ? "Please wait..." : "Decline"}
          </button>
        </div>
      );
    }

    if (status === "ACCEPTED") {
      return (
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStartWork(item);
            }}
            disabled={actioningId === item.id}
            className="px-3 py-1 rounded bg-blue-600 text-white text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actioningId === item.id ? "Please wait..." : "Start Work"}
          </button>
        </div>
      );
    }

    if (status === "ONGOING" || status === "IN_PROGRESS") {
      return (
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCompleteWork(item);
            }}
            disabled={actioningId === item.id}
            className="px-3 py-1 rounded bg-purple-600 text-white text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actioningId === item.id ? "Please wait..." : "Complete Work"}
          </button>
        </div>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  const visibleNotifications = notifications.filter(
    (item) => !isHandledNotification(item)
  );

  return (
    <div
      className="
        w-[90vw] max-w-sm md:w-80
        bg-white shadow-lg rounded-lg border
        z-50 overflow-hidden
      "
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b font-semibold text-gray-700 flex items-center justify-between">
        <span>Notifications</span>
        {markingAll && (
          <span className="text-xs text-gray-400">Marking all as read...</span>
        )}
      </div>

      <ul className="max-h-80 overflow-y-auto">
        {loading ? (
          <li className="p-4 text-sm text-gray-500">Loading notifications...</li>
        ) : visibleNotifications.length === 0 ? (
          <li className="p-4 text-sm text-gray-500">No notifications</li>
        ) : (
          visibleNotifications.map((item) => {
            const isRead = Boolean(item?.readAt);

            return (
              <li
                key={item.id}
                className={`p-4 border-b last:border-b-0 hover:bg-gray-50 ${
                  !isRead ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleNotificationClick(item)}
                    className="flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <p className="font-semibold text-sm text-gray-800">
                      {item.title || "Notification"}
                    </p>

                    <p className="text-sm text-gray-600 mt-1 break-words">
                      {item.message || "No message"}
                    </p>

                    <p className="text-[11px] text-gray-400 mt-2">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : ""}
                    </p>

                    {renderActions(item)}
                  </button>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      disabled={deletingId === item.id || actioningId === item.id}
                      className="text-[#3E83C4] text-xs shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Seen notification"
                      title="Seen notification"
                    >
                      {deletingId === item.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <div className="p-3 border-t text-center">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-[#3E83C4] hover:underline cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;