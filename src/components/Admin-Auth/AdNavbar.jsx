

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/navbar logo/Navbar logo.png";
// import profile from "../../assets/client images/alarm.png";
// import not from "../../assets/client images/profile.png";
// import { Menu, X } from "lucide-react";

const AdNavbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

//   const linkClass = ({ isActive }) =>
//     isActive
//       ? "text-[#3E83C4] font-semibold"
//       : "text-black hover:text-[#3E83C4] transition";

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-[0_4px_12px_rgba(62,131,196,0.15)] z-50">
      <nav className="flex items-center justify-between px-6 md:px-14 py-4">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            navigate("/");
            setOpen(false);
          }}
        >
          <img src={logo} alt="Fixserv Logo" className="h-10 w-auto" />
        </div>

        {/* Desktop Nav */}
        {/* <ul className="hidden md:flex items-center gap-20">
          <li><NavLink to="/" className={linkClass}>HOME</NavLink></li>
          <li><NavLink to="/request-repair" className={linkClass}>CREATE REQUEST</NavLink></li>
          <li><NavLink to="/repair" className={linkClass}>HISTORY</NavLink></li>
        </ul> */}

        {/* Desktop Icons */}
        {/* <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate("/notifications")} className="cursor-pointer">
            <img src={not} alt="notification" className="h-6 w-6" />
          </button>
          <button onClick={() => navigate("/profile")} className="cursor-pointer">
            <img src={profile} alt="profile" className="h-6 w-6" />
          </button>
        </div> */}

        {/* Mobile Hamburger */}
        {/* <button
          className="md:hidden text-[#3E83C4]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button> */}
      </nav>

      {/* Mobile Menu */}
      {/* <div
        className={`md:hidden bg-white border-t transition-all duration-300 overflow-hidden ${
          open ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-6 py-6">
          <li onClick={() => setOpen(false)}>
            <NavLink to="/" className={linkClass}>HOME</NavLink>
          </li>
          <li onClick={() => setOpen(false)}>
            <NavLink to="/request-repair" className={linkClass}>CREATE REQUEST</NavLink>
          </li>
          <li onClick={() => setOpen(false)}>
            <NavLink to="/repair" className={linkClass}>HISTORY</NavLink>
          </li>

          <div className="flex gap-6 mt-2">
            <button onClick={() => { navigate("/notifications"); setOpen(false); }}>
              <img src={not} alt="notification" className="h-6 w-6" />
            </button>
            <button onClick={() => { navigate("/profile"); setOpen(false); }}>
              <img src={profile} alt="profile" className="h-6 w-6" />
            </button>
          </div>
        </ul>
      </div> */}
    </header>
  );
};

export default AdNavbar;
 