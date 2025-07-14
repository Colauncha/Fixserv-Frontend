import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)

  const sessionStore = (data) => {
    sessionStorage.setItem('userData', JSON.stringify(data));
  }

  useEffect(() => {
    const storedUser = sessionStorage.getItem('userData')
    if (userData === null && storedUser) {
        setUserData(JSON.parse(storedUser))
    }
  }, [userData])

  return (
    <AuthContext.Provider
      value={{ userData, setUserData, sessionStore }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
