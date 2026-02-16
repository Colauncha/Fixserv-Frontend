// // src/routes/ProtectedRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { getAuthToken, getAuthRole } from "../utils/auth";

// const loginRouteByRole = {
//   CLIENT: "/log-in",
//   ARTISAN: "/artisan-login",
//   ADMIN: "/admin-login",
// };

// const ProtectedRoute = ({ allowedRoles }) => {
//   const token = getAuthToken();
//   const role = getAuthRole();

//   // 🔒 Not logged in
//   if (!token) {
//     return <Navigate to="/log-in" replace />;
//   }

//   // 🔒 Role not allowed
//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return (
//       <Navigate
//         to={loginRouteByRole[role] || "/"}
//         replace
//       />
//     );
//   }

//   // ✅ Allowed
//   return <Outlet />;
// };

// export default ProtectedRoute;



// src/routes/ProtectedRoute.jsx
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

  if (loading) return null; // or spinner

  if (!isAuthenticated) {
    return <Navigate to="/log-in" replace />;
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to={dashboardByRole[user?.role] || "/"} replace />;
  }

  // ADMIN onboarding gate
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

