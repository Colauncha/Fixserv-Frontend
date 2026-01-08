import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/Admin-Auth/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />

      <main className="flex-grow pt-16 bg-[#FFFFFF]">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
