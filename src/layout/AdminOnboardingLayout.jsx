import { Outlet } from "react-router-dom";
import AdNavbar from "../components/Admin-Auth/AdNavbar";


const AdminOnboardingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdNavbar />

      <main className="flex-grow pt-16 bg-[#F6F6F6]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminOnboardingLayout;
