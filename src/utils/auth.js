export const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem("fixserv_user"));
  } catch {
    return null;
  }
};


export const getAuthToken = () => {
  const t = localStorage.getItem("fixserv_token");
  return t?.replace(/^"|"$/g, "") || null;
};

export const getAuthRole = () => {
  const r = localStorage.getItem("fixserv_role");
  return r?.replace(/^"|"$/g, "") || null;
};

export const logout = () => {
  localStorage.removeItem("fixserv_user");
  localStorage.removeItem("fixserv_token");
  localStorage.removeItem("fixserv_role");
  window.location.href = "/log-in";
};
