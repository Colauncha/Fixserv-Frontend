import axios from "axios";

const WALLET_API = axios.create({
  baseURL: "https://dev-wallet-api.fixserv.co/api/wallet",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Attach token automatically
WALLET_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("fixserv_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  console.log(
    "WALLET AXIOS REQUEST =>",
    config.method?.toUpperCase(),
    config.baseURL + config.url,
    config.data || ""
  );
  return config;
});

WALLET_API.interceptors.response.use(
  (response) => {
    console.log(
      "WALLET AXIOS RESPONSE =>",
      response.status,
      response.config.url,
      response.data
    );
    return response;
  },
  (error) => {
    console.log(
      "WALLET AXIOS ERROR =>",
      error?.response?.status,
      error?.config?.url,
      error?.response?.data || error?.message
    );
    return Promise.reject(error);
  }
);

/* ================= WALLET ENDPOINTS ================= */

export const initiateWithdrawal = (payload) =>
  WALLET_API.post("/withdrawal/initiate", payload);

export const topUpWallet = (payload) =>
  WALLET_API.post("/top-up", payload);

export const getWalletBalance = (walletId) =>
  WALLET_API.get(`/get-balance/${walletId}`);

export const getWithdrawalBanks = () =>
  WALLET_API.get("/withdrawal/banks");

export const verifyTopUp = (referenceId) =>
  WALLET_API.get(`/top-up/verify/${referenceId}`);

export const getWithdrawalHistory = (userId, page = 1, limit = 10) =>
  WALLET_API.get(`/withdrawal/history/${userId}?page=${page}&limit=${limit}`);

export const resolveAccount = ({ accountNumber, bankCode }) =>
  WALLET_API.post("/withdrawal/resolve-account", {
    accountNumber,
    bankCode,
  });

  