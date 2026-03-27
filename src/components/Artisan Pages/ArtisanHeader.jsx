import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import not from "../../assets/Artisan Images/not.png";
import profile from "../../assets/Artisan Images/profileImg.jpg";
import ArtisanNotification from "../Artisan Pages/ArtisanNotification";
import {
  getNotifications,
  isOrderNotificationSeen,
} from "../../api/notification.api";

const ArtisanHeader = ({ title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationRef = useRef(null);

  const getOrderIdFromNotification = (item) => {
    return (
      item?.data?.orderId ||
      item?.data?.requestId ||
      item?.data?.jobId ||
      item?.orderId ||
      item?.data?.id ||
      null
    );
  };

  const loadUnreadCount = useCallback(async () => {
    const token =
      localStorage.getItem("fixserv_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (!token) {
      setNotificationCount(0);
      return;
    }

    try {
      const response = await getNotifications();
      const list = Array.isArray(response?.data) ? response.data : [];

      const count = list.filter((item) => {
        const orderId = getOrderIdFromNotification(item);
        const handled = orderId ? isOrderNotificationSeen(orderId) : false;

        return !handled && !item?.readAt;
      }).length;

      setNotificationCount(count);
    } catch (error) {
      console.error("Failed to load unread notification count:", error);
      setNotificationCount(0);
    }
  }, []);

  const toggleNotifications = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    const token =
      localStorage.getItem("fixserv_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (!token) return;

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 15000);

    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleNotificationRefresh = () => {
      loadUnreadCount();
    };

    window.addEventListener(
      "fixserv-notifications-updated",
      handleNotificationRefresh
    );

    return () => {
      window.removeEventListener(
        "fixserv-notifications-updated",
        handleNotificationRefresh
      );
    };
  }, [loadUnreadCount]);

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-black break-words">
            {title}
          </h1>
          <p className="text-sm text-gray-600 mt-1 break-words">
            Welcome {user?.fullName || "User"}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-auto">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={toggleNotifications}
            className="relative flex items-center justify-center w-10 h-10 cursor-pointer shrink-0"
            aria-expanded={showNotifications}
            aria-label="Notifications"
          >
            <img
              src={not}
              alt="Notifications"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
            />

            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-1 rounded-full leading-none min-w-[18px] text-center">
                {notificationCount}
              </span>
            )}
          </button>

          <img
            onClick={() => navigate("/artisan/profile")}
            src={user?.profileImage || user?.profilePicture || profile}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover cursor-pointer shrink-0"
            alt="profile"
          />
        </div>
      </div>

      <div
        ref={notificationRef}
        className="absolute top-full right-0 mt-2 z-50 w-[90vw] max-w-sm"
      >
        <ArtisanNotification
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onChanged={loadUnreadCount}
        />
      </div>

      <div className="border-t border-blue-100"></div>
    </div>
  );
};

export default ArtisanHeader;