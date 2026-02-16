// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔄 Load auth from storage on refresh
// useEffect(() => {
//   const storedToken = localStorage.getItem("fixserv_token");
//   const storedUser = localStorage.getItem("fixserv_user");

//   if (storedToken && storedUser) {
//     setToken(storedToken);
//     setUser(JSON.parse(storedUser));
//   }

//   setLoading(false);
// }, []);

// const login = (token, userData) => {
//   localStorage.setItem("fixserv_token", token);
//   localStorage.setItem("fixserv_user", JSON.stringify(userData));
//   localStorage.setItem("fixserv_role", userData.role);

//   setToken(token);
//   setUser(userData);
// };

// const logout = () => {
//   localStorage.removeItem("fixserv_token");
//   localStorage.removeItem("fixserv_user");
//   localStorage.removeItem("fixserv_role");

//   setToken(null);
//   setUser(null);
// };


//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         isAuthenticated: !!token,
//         loading,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }
//   return ctx;
// };


import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // const navigate = useNavigate(); // 👈 ADD THIS

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("fixserv_token");
    const storedUser = localStorage.getItem("fixserv_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("fixserv_token", token);
    localStorage.setItem("fixserv_user", JSON.stringify(userData));
    localStorage.setItem("fixserv_role", userData.role);

    setToken(token);
    setUser(userData);
  };

const logout = () => {
  localStorage.removeItem("fixserv_token");
  localStorage.removeItem("fixserv_user");
  localStorage.removeItem("fixserv_role");

  setToken(null);
  setUser(null);
};


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
