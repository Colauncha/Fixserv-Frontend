import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token = sessionStorage.getItem("token");

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "https://notifications-service-9dn1.onrender.com/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        "https://notifications-service-9dn1.onrender.com/api/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="relative">
      <div 
        onClick={toggleDropdown} 
        className="cursor-pointer relative"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadCount}
          </span>
        )}
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="py-2 px-4 border-b bg-gray-100 font-semibold text-gray-700">
            Notifications
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((note) => (
                <div
                  key={note._id}
                  className="flex items-start px-4 py-3 hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm mr-3">
                    {note.sender?.charAt(0) || "N"}
                  </div>
                  <div className="flex-1 text-sm text-gray-700">
                    <p className="font-medium">{note.sender || "Notification"}</p>
                    <p className="text-xs text-gray-500">{note.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-gray-500">No notifications found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
