// import { createContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthDataProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null)

//   const sessionStore = (data) => {
//     sessionStorage.setItem('userData', JSON.stringify(data));
//   }

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem('userData')
//     if (userData === null && storedUser) {
//         setUserData(JSON.parse(storedUser))
//     }
//   }, [userData])

//   return (
//     <AuthContext.Provider
//       value={{ userData, setUserData, sessionStore }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useReducer, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../Auth/tokenStorage';

export const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  token: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, token: action.payload };
    case 'LOGOUT':
      return { isAuthenticated: false, token: null };
    default:
      return state;
  }
};

const loadAuthState = () => {
  try {
    const stored = getToken();
    return stored || initialState;
  } catch {
    return initialState;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState, loadAuthState);

  useEffect(() => {
    setToken(state);
  }, [state]);

  const login = (token) => {
    dispatch({ type: 'LOGIN', payload: token });
  };

  const logout = () => {
    removeToken();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
