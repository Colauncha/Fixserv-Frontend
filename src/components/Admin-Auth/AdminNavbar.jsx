
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import { NavLink, useNavigate } from "react-router-dom";
// import logo from "../../assets/navbar logo/Navbar logo.png";
// // import profile from "../../assets/client images/alarm.png";
// // import not from "../../assets/client images/profile.png";
// // import { Menu, X } from "lucide-react";

// const AdminNavbar = () => {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

// //   const linkClass = ({ isActive }) =>
// //     isActive
// //       ? "text-[#3E83C4] font-semibold"
// //       : "text-black hover:text-[#3E83C4] transition";

//   return (
//     <header className="fixed top-0 left-0 w-full bg-white shadow-[0_4px_12px_rgba(62,131,196,0.15)] z-50">
//       <nav className="flex items-center justify-between px-6 md:px-14 py-4">

//         {/* Logo */}
//         <div
//           className="flex items-center gap-2 cursor-pointer"
//           onClick={() => {
//             navigate("/");
//             setOpen(false);
//           }}
//         >
//           <img src={logo} alt="Fixserv Logo" className="h-10 w-auto" />
//         </div>

//         {/* Desktop Nav */}
//         {/* <ul className="hidden md:flex items-center gap-20">
//           <li><NavLink to="/" className={linkClass}>HOME</NavLink></li>
//           <li><NavLink to="/request-repair" className={linkClass}>CREATE REQUEST</NavLink></li>
//           <li><NavLink to="/repair" className={linkClass}>HISTORY</NavLink></li>
//         </ul> */}

//         {/* Desktop Icons */}
//         {/* <div className="hidden md:flex items-center gap-4">
//           <button onClick={() => navigate("/notifications")} className="cursor-pointer">
//             <img src={not} alt="notification" className="h-6 w-6" />
//           </button>
//           <button onClick={() => navigate("/profile")} className="cursor-pointer">
//             <img src={profile} alt="profile" className="h-6 w-6" />
//           </button>
//         </div> */}

//         {/* Mobile Hamburger */}
//         {/* <button
//           className="md:hidden text-[#3E83C4]"
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <X size={28} /> : <Menu size={28} />}
//         </button> */}
//       </nav>

//       {/* Mobile Menu */}
//       {/* <div
//         className={`md:hidden bg-white border-t transition-all duration-300 overflow-hidden ${
//           open ? "max-h-[400px]" : "max-h-0"
//         }`}
//       >
//         <ul className="flex flex-col items-center gap-6 py-6">
//           <li onClick={() => setOpen(false)}>
//             <NavLink to="/" className={linkClass}>HOME</NavLink>
//           </li>
//           <li onClick={() => setOpen(false)}>
//             <NavLink to="/request-repair" className={linkClass}>CREATE REQUEST</NavLink>
//           </li>
//           <li onClick={() => setOpen(false)}>
//             <NavLink to="/repair" className={linkClass}>HISTORY</NavLink>
//           </li>

//           <div className="flex gap-6 mt-2">
//             <button onClick={() => { navigate("/notifications"); setOpen(false); }}>
//               <img src={not} alt="notification" className="h-6 w-6" />
//             </button>
//             <button onClick={() => { navigate("/profile"); setOpen(false); }}>
//               <img src={profile} alt="profile" className="h-6 w-6" />
//             </button>
//           </div>
//         </ul>
//       </div> */}
//     </header>
//   );
// };

// export default AdminNavbar;


import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import logo from "../../assets/navbar logo/Navbar logo.png";
import { useAuth } from "../../context/AuthContext";


const AdminNavbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  // Logout Function
  const handleLogout = () => {
    logout(); 
    navigate("/admin-login");
    setOpen(false);
  };

  const location = useLocation();

const linkClass = (path) => `
  group relative w-full text-left px-4 py-3 rounded-xl text-sm font-medium
  transition-all duration-300 cursor-pointer
  ${
    isActive(path)
  ? "bg-[#3E83C4]/10 text-[#3E83C4] font-semibold border-l-4 border-[#3E83C4] shadow-sm"
  : "text-gray-700 hover:bg-[#3E83C4]/10 hover:text-[#3E83C4] hover:translate-x-1"
  }
`;

const isActive = (path) =>
  path === "/admin"
    ? location.pathname === "/admin"
    : location.pathname.startsWith(path);

    const menuItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Verify Artisans", path: "/admin/verify-artisan" },
  { label: "Manage Users", path: "/admin/manage-user" },
  { label: "Transactions", path: "/admin/monitor-transaction" },
  { label: "Disputes", path: "/admin/disputes" },
];

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-[0_4px_12px_rgba(62,131,196,0.15)] z-50">
        <nav className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => go("/admin")}
          >
            <img src={logo} alt="Fixserv Logo" className="h-10 w-auto" />
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="text-[#3E83C4] cursor-pointer"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </header>

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-24 px-6 flex flex-col h-full">
          {/* Menu Links */}
          <div className="space-y-3">
  {menuItems.map(({ label, path }) => (
    <button
      key={path}
      onClick={() => go(path)}
      className={linkClass(path)}
    >
      {label}

      <span
        className={`absolute left-4 right-4 bottom-2 h-[2px]
        bg-[#3E83C4] rounded-full origin-left transition-all duration-300
        ${
          isActive(path)
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </button>
  ))}
</div>

          {/* Logout Button */}
          <div className="mt-auto pb-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-md transition-all duration-200 cursor-pointer"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        />
      )}
    </>
  );
};

export default AdminNavbar;