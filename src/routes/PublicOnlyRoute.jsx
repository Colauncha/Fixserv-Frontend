import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated || !user?.role) {
    return <Outlet />;
  }

  if (user.role === "CLIENT") return <Navigate to="/client" replace />;
  if (user.role === "ARTISAN") return <Navigate to="/artisan" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />;

  return <Outlet />;
};

export default PublicOnlyRoute;
