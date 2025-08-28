import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';
import { getIdentity } from './tokenStorage';

const AdminProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  const identity = getIdentity();
  console.log("ProtectedRoute state:", state);

  if (!state.isAuthenticated || identity.role !== "ADMIN") {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
