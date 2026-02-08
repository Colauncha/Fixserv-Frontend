import axios from "axios";

const API_URL = "https://user-management-h4hg.onrender.com/api";

export const registerArtisan = (payload) => {
  return axios.post(`${API_URL}/users/register`, payload);
};
