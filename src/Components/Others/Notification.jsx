import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import useAuth from "../../Auth/useAuth";

const tabs = ['All', 'Unread'];

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('All');

  const {state} = useAuth()

  const token = state.token



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

  // const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="">
        <div className="max-w-full h-[100dvh] bg-white drop-shadow-xl overflow-hidden">
          <div className="flex items-center justify-between py-5 px-4 bg-gray-100 font-semibold text-gray-700">
            <span>Notification Center</span>
            <span className="font-light text-sm">Mark all as read</span>
          </div>
          {/* Tabs */}
          <div className="flex px-10 space-x-6 items-center gap-4 bg-gray-100 ">
            {tabs.map(tab => ( 
              <span 
                key={tab}
                className={`pb-2 text-sm ${
                  activeTab === tab
                  ? "border-b-2 border-black font-medium"
                  : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
                >
                  {tab}
              </span>
            ))}
          </div>

          <div className="max-h-72 space-y-4 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((note) => (
                <div
                  key={note._id}
                  // className="flex items-start px-4 py-3 hover:bg-gray-50 transition"
                  className="bg-blue-50 p-4 rounded-md flex items-start gap-4"
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

          {/* See all activity button */}
          <div className="mt-6 flex justify-center">
            <button className="px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-100">
              See all activity
            </button>
          </div>  

        </div>
    </div>
  );
};

export default Notification;
