// export const getAuthUser = () => {
//   try {
//     return JSON.parse(localStorage.getItem("fixserv_user"));
//   } catch {
//     return null;
//   }
// };

// export const getAuthRole = () => {
//   return localStorage.getItem("fixserv_role");
// };

// export const getAuthToken = () => {
//   return localStorage.getItem("fixserv_token");
// };

// export const logout = () => {
//   localStorage.removeItem("fixserv_user");
//   localStorage.removeItem("fixserv_token");
//   localStorage.removeItem("fixserv_role");
//   window.location.href = "/log-in";
// };


export const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem("fixserv_user"));
  } catch {
    return null;
  }
};

export const getAuthRole = () => {
  return localStorage.getItem("fixserv_role");
};

export const getAuthToken = () => {
  return localStorage.getItem("fixserv_token");
};

export const logout = () => {
  localStorage.removeItem("fixserv_user");
  localStorage.removeItem("fixserv_token");
  localStorage.removeItem("fixserv_role");
  window.location.href = "/log-in";
};
