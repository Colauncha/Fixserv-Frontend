import React, { useEffect } from "react";

const ClientNotificationDropdown = ({
  isOpen,
  notifications,
  setNotifications,
  onClose,
}) => {
  // Auto mark as read when opened
  useEffect(() => {
    if (!isOpen) return;

    setNotifications((prev) =>
      prev.map((n) => (n.read ? n : { ...n, read: true }))
    );
  }, [isOpen, setNotifications]);

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        w-[90vw] max-w-sm md:w-72
        bg-white shadow-lg rounded-lg border
        z-50
        overflow-hidden
      "
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b font-semibold text-gray-700">
        Notifications
      </div>

      <ul className="max-h-60 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="p-4 text-sm text-gray-500">No notifications</li>
        ) : (
          notifications.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center p-4 text-sm hover:bg-gray-100"
            >
              <span>{item.text}</span>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-red-500 text-xs ml-2"
              >
                Delete
              </button>
            </li>
          ))
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

export default ClientNotificationDropdown;