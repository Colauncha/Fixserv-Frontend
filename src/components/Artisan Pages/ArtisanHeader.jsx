import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import not from "../../assets/Artisan Images/not.png";
import profile from "../../assets/Artisan Images/profileImg.jpg";
import ArtisanNotification from "../Artisan Pages/ArtisanNotification";

const ArtisanHeader = ({ title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Repair accepted", read: false },
    { id: 2, text: "Technician on the way", read: false },
  ]);

  const notificationCount = notifications.filter((n) => !n.read).length;

  const toggleNotifications = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowNotifications((prev) => !prev);
  };

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
          notifications={notifications}
          setNotifications={setNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>

      <div className="border-t border-blue-100"></div>
    </div>
  );
};

export default ArtisanHeader;