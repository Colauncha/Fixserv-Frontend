
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
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/navbar logo/Navbar logo.png";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

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

          {/* Always-visible Hamburger */}
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
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-26 px-6 space-y-6">

          <button onClick={() => go("/admin")} className="block cursor-pointer text-black text-sm hover:text-[#3E83C4]">
            Dashboard
          </button>

          <button onClick={() => go("/admin/verify-artisan")} className="block cursor-pointer text-black text-sm hover:text-[#3E83C4]">
            Verify Artisans
          </button>

          <button onClick={() => go("/admin/manage-user")} className="block cursor-pointer text-black text-sm hover:text-[#3E83C4]">
            Manage Users
          </button>

          <button onClick={() => go("/admin/monitor-transaction")} className="block cursor-pointer text-black text-sm hover:text-[#3E83C4]">
            Transactions
          </button>

          <button onClick={() => go("/admin/disputes")} className="block cursor-pointer text-black text-sm hover:text-[#3E83C4]">
            Disputes
          </button>

        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 z-30"
        />
      )}
    </>
  );
};

export default AdminNavbar;
