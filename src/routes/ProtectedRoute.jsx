import { Navigate, Outlet } from "react-router-dom";

const loginRouteByRole = {
  CLIENT: "/log-in",
  ARTISAN: "/artisan-login",
  ADMIN: "/admin-login",
};

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("fixserv_token");
  const role = localStorage.getItem("fixserv_role");

  if (!token) {
    return <Navigate to="/log-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={loginRouteByRole[role] || "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
