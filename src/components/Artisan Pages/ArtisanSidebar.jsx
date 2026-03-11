import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";

import logo from "../../assets/Artisan Images/fixserv.png";
import dashboard from "../../assets/Artisan Images/dashboard.png";
import job from "../../assets/Artisan Images/jobs.png";
import noti from "../../assets/Artisan Images/notification.png";
import wallet from "../../assets/Artisan Images/wallet.png";
import accept from "../../assets/Artisan Images/accept.png";
import profile from "../../assets/Artisan Images/profile.png";
import veri from "../../assets/Artisan Images/verification.png";
import adebayoImg from "../../assets/Artisan Images/adebayo.png";
import log from "../../assets/Artisan Images/log.png";

import { useAuth } from "../../context/AuthContext";

const ArtisanSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

const navClass = ({ isActive }) =>
  `group flex items-center justify-between gap-3 px-4 py-2.5 text-sm rounded-xl mx-2 transition-all duration-200 ${
    isActive
      ? "bg-[#C9DDF2] text-[#2563EB] border-r-4 border-[#2563EB]"
      : "text-gray-600 hover:bg-[#F4F8FD] hover:text-[#2563EB]"
  }`;

  const handleLogout = () => {
    logout();
    navigate("/artisan-login");
    setIsOpen(false);
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { to: "/artisan", label: "Dashboard", icon: dashboard, end: true },
    { to: "/artisan/jobs", label: "Jobs", icon: job },
    { to: "/artisan/repair-history", label: "Repair History", icon: noti },
    {
      to: "/artisan/accept-request",
      label: "Accept Job / Decline Job",
      icon: accept,
    },
    { to: "/artisan/wallet", label: "Wallet", icon: wallet },
    { to: "/artisan/profile", label: "Profile", icon: profile },
    { to: "/artisan/verification", label: "Verification", icon: veri },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 h-16 flex items-center justify-between px-4">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={26} />
        </button>

        <img src={logo} alt="Fixserv logo" className="h-9 object-contain" />

        <div className="w-10" />
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-56 bg-white border-r border-blue-100
          flex flex-col justify-between transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="overflow-y-auto flex-1 py-2">
          {/* Mobile Header inside drawer */}
          <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-blue-100 mb-3">
            <img src={logo} alt="Fixserv logo" className="h-9 object-contain" />
            <button
              onClick={handleCloseSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:flex justify-center py-6">
            <img src={logo} alt="Fixserv logo" className="h-10 cursor-pointer" />
          </div>

          <p className="px-4 text-xs font-semibold tracking-wide uppercase text-gray-400 mb-3 mt-2">
            Main Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navClass}
                onClick={handleCloseSidebar}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.icon}
                        alt=""
                        className={`w-4 h-4 object-contain shrink-0 ${
                          isActive ? "opacity-100" : "opacity-80"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <ChevronRight
  size={16}
  className={`shrink-0 transition-all duration-200 ${
    isActive
      ? "opacity-100 translate-x-0 text-[#2563EB]"
      : "opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0"
  }`}
/>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="my-5 mx-3 border-t border-blue-100"></div>
        </div>

        {/* User Card */}
        <div className="px-3 py-4 border-t border-blue-100 bg-[#FCFDFE]">
          <div className="bg-gradient-to-r from-[#3E83C4] to-[#2F6FA8] text-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
            <img
              src={user?.profileImage || user?.profilePicture || adebayoImg}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border border-white/30"
            />

            <div className="text-sm min-w-0">
              <p className="font-semibold truncate">{user?.fullName || "User"}</p>
              <p className="text-white/80 text-xs">Active Artisan</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 mt-3 px-2 py-2 rounded-lg cursor-pointer hover:text-[#3E83C4] hover:bg-blue-50 transition w-full"
          >
            <img src={log} alt="" className="w-4 h-4 object-contain" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default ArtisanSidebar;