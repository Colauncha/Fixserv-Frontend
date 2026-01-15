
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/navbar logo/Navbar logo.png";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-[#3E83C4] font-semibold"
      : "text-black hover:text-[#3E83C4] transition";

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
          <img src={logo} alt="Fixserv Logo" className="h-12 w-auto" />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-20">
          <li><NavLink to="/" className={linkClass}>HOME</NavLink></li>
          <li><NavLink to="/about" className={linkClass}>ABOUT</NavLink></li>
          <li><NavLink to="/contactUs" className={linkClass}>CONTACT US</NavLink></li>
        </ul>

        {/* Desktop CTA */}
        <button
          onClick={() => navigate("/sign-up", { replace: true })}
          className="hidden md:block border-2 border-[#3E83C4] text-[#3E83C4] px-6 py-2 rounded-xl font-medium hover:bg-[#3E83C4] hover:text-white transition cursor-pointer"
        >
          Get Started
        </button>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#3E83C4]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t transition-all duration-300 overflow-hidden ${
          open ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-6 py-6">
          <li onClick={() => setOpen(false)}>
            <NavLink to="/" className={linkClass}>HOME</NavLink>
          </li>
          <li onClick={() => setOpen(false)}>
            <NavLink to="/about" className={linkClass}>ABOUT</NavLink>
          </li>
          <li onClick={() => setOpen(false)}>
            <NavLink to="/contactUs" className={linkClass}>CONTACT US</NavLink>
          </li>

          <button
            onClick={() => {
              navigate("/sign-up", { replace: true });
              setOpen(false);
            }}
            className="border-2 border-[#3E83C4] text-[#3E83C4] px-8 py-2 rounded-xl font-medium hover:bg-[#3E83C4] hover:text-white transition cursor-pointer"
          >
            Get Started
          </button>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
