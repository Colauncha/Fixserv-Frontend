import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/navbar logo/Navbar logo.png";
import not from "../../assets/client images/Alarm.png";
import profile from "../../assets/client images/Profile.png";
import { Menu, X } from "lucide-react";
import ClientNotificationDropdown from "../Client-Screens/ClientNotificationDropdown";

const ClientNavbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);


  const [notifications, setNotifications] = useState([
    { id: 1, text: "Repair accepted", read: false },
    { id: 2, text: "Technician on the way", read: false },
  ]);

  const notificationCount = notifications.filter(n => !n.read).length;

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
    <header className="fixed top-0 left-0 w-full bg-white shadow-[0_4px_12px_rgba(62,131,196,0.15)] z-50">
      <nav className="flex items-center justify-between px-6 md:px-14 py-4">

       
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/client")}
        >
          <img src={logo} alt="Fixserv Logo" className="h-12 w-auto" />
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-20">
          <li><NavLink to="/client" end className={linkClass}>HOME</NavLink></li>
          <li><NavLink to="/client/request-repair" className={linkClass}>CREATE REQUEST</NavLink></li>
          <li><NavLink to="/client/repair" className={linkClass}>HISTORY</NavLink></li>
        </ul>


                {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6 relative h-6">

          {/* Notification Bell */}
          {/* <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={toggleNotifications}
            className="relative flex items-center justify-center h-6 w-6 cursor-pointer"
            aria-expanded={showNotifications}
            aria-label="Notifications"
            type="button"
          > */}
          <button
  type="button"
  onMouseDown={(e) => e.stopPropagation()}
  onClick={toggleNotifications}
  className="relative flex items-center justify-center h-6 w-6 cursor-pointer"
  aria-expanded={showNotifications}
  aria-label="Notifications"
>
            <img
              src={profile}
              alt="Notifications"
              className="h-6 w-6 block object-contain"
            />

            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/client/profile")}
            className="flex items-center justify-center h-6 w-6 cursor-pointer"
            aria-label="Profile"
            type="button"
          >
            <img
              src={not}
              alt="Profile"
              className="h-6 w-6 block object-contain"
            />
          </button>

        </div>
        

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#3E83C4]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
      {/* Notifications Dropdown (shared for Desktop + Mobile) */}
      <div ref={notificationRef} className="absolute top-[72px] right-6 md:right-14 z-50">
        <ClientNotificationDropdown
          isOpen={showNotifications}
          notifications={notifications}
          setNotifications={setNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>

{/* Mobile Menu */}
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

    {/* 🔥 ADD THIS RIGHT HERE */}
    {/* Icons Row */}
    <div className="flex items-center justify-center gap-8 mt-4 w-full">

      {/* Notification */}
           <div className="relative flex items-center">
        {/* <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            toggleNotifications(e);
            setOpen(false);
          }}
          className="relative cursor-pointer flex items-center justify-center"
          aria-label="Notifications"
          type="button"
        > */}
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
          <img src={profile} alt="Notifications" className="h-6 w-6" />

          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {notificationCount}
            </span>
          )}
        </button>
      </div>

      {/* Profile */}
      <button
        onClick={() => {
          navigate("/client/profile");
          setOpen(false);
        }}
        className="cursor-pointer flex items-center justify-center"
        aria-label="Profile"
      >
        <img src={not} alt="Profile" className="h-6 w-6" />
      </button>

    </div>

  </ul>
</div>
    </header>
  );
};

export default ClientNavbar;