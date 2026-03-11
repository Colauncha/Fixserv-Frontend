
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardByRole = {
  CLIENT: "/client",
  ARTISAN: "/artisan",
  ADMIN: "/admin",
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

if (!isAuthenticated) {
  if (location.pathname.startsWith("/artisan")) {
    return <Navigate to="/artisan-login" replace />;
  }

  if (location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Navigate to="/log-in" replace />;
}

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to={dashboardByRole[user?.role] || "/"} replace />;
  }


  if (
    user.role === "ADMIN" &&
    user.isOnboarded === false &&
    !location.pathname.startsWith("/admin/onboarding")
  ) {
    return <Navigate to="/admin/onboarding" replace />;
  }

  if (
    user.role === "ADMIN" &&
    user.isOnboarded === true &&
    location.pathname.startsWith("/admin/onboarding")
  ) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

