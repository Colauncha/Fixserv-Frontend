// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // adjust path if needed

// const PublicOnlyRoute = () => {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
// };

// export default PublicOnlyRoute;


// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const PublicOnlyRoute = () => {
//   const { isAuthenticated, user } = useAuth();

//   if (!isAuthenticated) {
//     return <Outlet />;
//   }

//   // redirect logged-in users away from auth pages
//   return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
// };

// export default PublicOnlyRoute;




// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const PublicOnlyRoute = () => {
//   const { isAuthenticated, user } = useAuth();

//   // Not logged in → allow access to auth pages
//   if (!isAuthenticated || !user?.role) {
//     return <Outlet />;
//   }

//   // Normalize role safely
//   const rolePath = user.role.toUpperCase();

//   if (rolePath === "CLIENT") {
//     return <Navigate to="/client" replace />;
//   }

//   if (rolePath === "ARTISAN") {
//     return <Navigate to="/artisan" replace />;
//   }

//   if (rolePath === "ADMIN") {
//     return <Navigate to="/admin" replace />;
//   }

//   return <Outlet />;
// };

// export default PublicOnlyRoute;


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
