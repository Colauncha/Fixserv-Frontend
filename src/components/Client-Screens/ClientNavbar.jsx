import React, { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/navbar logo/Navbar logo.png";
import not from "../../assets/client images/Alarm.png"; // notification icon
import profile from "../../assets/client images/Profile.png"; // default profile
import { Menu, X } from "lucide-react";
import ClientNotificationDropdown from "../Client-Screens/ClientNotificationDropdown";
import {
  getNotifications,
  isOrderNotificationSeen,
} from "../../api/notification.api";
import { useAuth } from "../../context/AuthContext";

const ClientNavbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationRef = useRef(null);

  // ✅ SIMPLE: get profile image from context
  const profileImage = user?.profilePicture || not;

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
    const token = localStorage.getItem("fixserv_token");

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

  const toggleNotifications = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowNotifications((prev) => !prev);
  };

  const linkClass = ({ isActive }) =>
    `relative transition ${
      isActive
        ? "text-[#3E83C4] font-semibold after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-[#3E83C4]"
        : "text-black hover:text-[#3E83C4]"
    }`;

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    const interval = setInterval(loadUnreadCount, 15000);
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

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <nav className="flex items-center justify-between px-6 md:px-14 py-4">
        
        {/* LOGO */}
        <div onClick={() => navigate("/client")} className="cursor-pointer">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        {/* NAV LINKS */}
        <ul className="hidden md:flex gap-20">
          <li><NavLink to="/client" end className={linkClass}>HOME</NavLink></li>
          <li><NavLink to="/client/request-repair" className={linkClass}>CREATE REQUEST</NavLink></li>
          <li><NavLink to="/client/repair" className={linkClass}>HISTORY</NavLink></li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-6">

          {/* NOTIFICATIONS */}
          <button onClick={toggleNotifications} className="relative">
            <img src={profile} alt="Notifications" className="h-8 w-8" />

            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                {notificationCount}
              </span>
            )}
          </button>

          {/* PROFILE IMAGE */}
          <button onClick={() => navigate("/client/profile")}>
            <img
              src={profileImage}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => (e.target.src = not)}
            />
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* NOTIFICATION DROPDOWN */}
      <div ref={notificationRef} className="absolute right-6 top-[72px]">
        <ClientNotificationDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onChanged={loadUnreadCount}
        />
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden ${open ? "block" : "hidden"} bg-white`}>
        <ul className="flex flex-col items-center gap-6 py-6">

          <li><NavLink to="/client" onClick={() => setOpen(false)}>HOME</NavLink></li>
          <li><NavLink to="/client/request-repair" onClick={() => setOpen(false)}>CREATE REQUEST</NavLink></li>
          <li><NavLink to="/client/repair" onClick={() => setOpen(false)}>HISTORY</NavLink></li>

          <div className="flex gap-8">

            {/* NOTIFICATIONS */}
            <button onClick={toggleNotifications}>
              <img src={profile} alt="Notifications" className="h-8 w-8" />
            </button>

            {/* PROFILE (DYNAMIC) */}
            <button onClick={() => navigate("/client/profile")}>
              <img
                src={profileImage}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => (e.target.src = not)}
              />
            </button>

          </div>
        </ul>
      </div>
    </header>
  );
};

export default ClientNavbar;