import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
