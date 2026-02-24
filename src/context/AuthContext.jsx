import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const normalizeUser = (u) => {
  if (!u) return null;

  // if the API returns nested user shapes sometimes, you can unwrap here too
  const user = u?.data?.user ?? u?.user ?? u;

  const id = user?.id || user?._id;

  return {
    ...user,
    id, // ✅ always available
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("fixserv_token");
    const storedUser = localStorage.getItem("fixserv_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(normalizeUser(JSON.parse(storedUser)));
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    const normalized = normalizeUser(userData);

    localStorage.setItem("fixserv_token", token);
    localStorage.setItem("fixserv_user", JSON.stringify(normalized));
    localStorage.setItem("fixserv_role", normalized?.role || "");

    setToken(token);
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem("fixserv_token");
    localStorage.removeItem("fixserv_user");
    localStorage.removeItem("fixserv_role");

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};