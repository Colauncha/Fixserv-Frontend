import React, { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/navbar logo/Navbar logo.png";
import not from "../../assets/client images/Alarm.png";
import profile from "../../assets/client images/Profile.png";
import { Menu, X } from "lucide-react";
import ClientNotificationDropdown from "../Client-Screens/ClientNotificationDropdown";
import {
  getNotifications,
  isOrderNotificationSeen,
} from "../../api/notification.api";

const ClientNavbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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

  const normalizeNotificationList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.notifications)) return payload.notifications;
    if (Array.isArray(payload?.data?.notifications))
      return payload.data.notifications;
    return [];
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
      const list = normalizeNotificationList(response);

      const count = list.filter((item) => {
        const orderId = getOrderIdFromNotification(item);
        const handled = orderId ? isOrderNotificationSeen(orderId) : false;

        return !handled && !item?.readAt;
      }).length;

      setNotificationCount(count);
    } catch (error) {
      console.warn("Failed to load unread notification count:", error?.message);
      setNotificationCount(0);
    }
  }, []);

  const linkClass = ({ isActive }) =>
    `relative transition ${
      isActive
        ? "text-[#3E83C4] font-semibold after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-[#3E83C4]"
        : "text-black hover:text-[#3E83C4]"
    }`;

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
    <header className="fixed top-0 left-0 w-full bg-white shadow-[0_4px_12px_rgba(62,131,196,0.15)] z-50">
      <nav className="flex items-center justify-between px-6 md:px-14 py-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/client")}
        >
          <img src={logo} alt="Fixserv Logo" className="h-12 w-auto" />
        </div>

        <ul className="hidden md:flex items-center gap-20">
          <li>
            <NavLink to="/client" end className={linkClass}>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/client/request-repair" className={linkClass}>
              CREATE REQUEST
            </NavLink>
          </li>
          <li>
            <NavLink to="/client/repair" className={linkClass}>
              HISTORY
            </NavLink>
          </li>
        </ul>

        <div className="hidden md:flex items-center gap-6 relative h-6">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={toggleNotifications}
            className="relative flex items-center justify-center cursor-pointer"
            aria-expanded={showNotifications}
            aria-label="Notifications"
          >
            <img
              src={profile}
              alt="Notifications"
              className="h-8 w-8 object-contain"
            />

            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {notificationCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/client/profile")}
            className="flex items-center justify-center cursor-pointer"
            aria-label="Profile"
            type="button"
          >
            <img
              src={not}
              alt="Profile"
              className="h-8 w-8 object-contain"
            />
          </button>
        </div>

        <button
          className="md:hidden cursor-pointer text-[#3E83C4]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <div
        ref={notificationRef}
        className="absolute top-[72px] right-6 md:right-14 z-50"
      >
        <ClientNotificationDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onChanged={loadUnreadCount}
        />
      </div>

      <div
        className={`md:hidden bg-white border-t transition-all duration-300 overflow-hidden ${
          open ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-6 py-6">
          <li onClick={() => setOpen(false)}>
            <NavLink to="/client" end className={linkClass}>
              HOME
            </NavLink>
          </li>

          <li onClick={() => setOpen(false)}>
            <NavLink to="/client/request-repair" className={linkClass}>
              CREATE REQUEST
            </NavLink>
          </li>

          <li onClick={() => setOpen(false)}>
            <NavLink to="/client/repair" className={linkClass}>
              HISTORY
            </NavLink>
          </li>

          <div className="flex items-center justify-center gap-8 mt-4 w-full">
            <div className="relative flex items-center">
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  toggleNotifications(e);
                  setOpen(false);
                }}
                className="relative cursor-pointer flex items-center justify-center"
                aria-label="Notifications"
              >
                <img src={profile} alt="Notifications" className="h-8 w-8" />

                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                navigate("/client/profile");
                setOpen(false);
              }}
              className="cursor-pointer flex items-center justify-center"
              aria-label="Profile"
            >
              <img src={not} alt="Profile" className="h-8 w-8" />
            </button>
          </div>
        </ul>
      </div>
    </header>
  );
};

export default ClientNavbar;