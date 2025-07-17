const STATE_KEY = 'authState';
const ID_KEY = 'identity';

export const setToken = (state) => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
};

export const getToken = () => {
  return JSON.parse(localStorage.getItem(STATE_KEY));
};

export const removeToken = () => {
  localStorage.removeItem(STATE_KEY);
};

export const setIdentity = (data) => {
  sessionStorage.setItem(ID_KEY, JSON.stringify(data));
};

export const getIdentity = () => {
  return JSON.parse(sessionStorage.getItem(ID_KEY));
};

export const removeIdentity = () => {
  sessionStorage.removeItem(ID_KEY);
};
