import axios from "axios";

const WALLET_BASE_URL =
  import.meta.env.VITE_WALLET_API_BASE_URL || "https://dev-wallet-api.fixserv.co/api/wallet";

const GENERAL_BASE_URL =
  import.meta.env.VITE_GENERAL_API_BASE_URL || "https://dev-wallet-api.fixserv.co/api";

const WALLET_API = axios.create({
  baseURL: WALLET_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

WALLET_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("fixserv_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "WALLET AXIOS REQUEST =>",
    config.method?.toUpperCase(),
    (config.baseURL || "") + (config.url || ""),
    {
      params: config.params || null,
      data: config.data || null,
      hasToken: !!token,
    }
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

const GENERAL_API = axios.create({
  baseURL: GENERAL_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

GENERAL_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("fixserv_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "GENERAL AXIOS REQUEST =>",
    config.method?.toUpperCase(),
    (config.baseURL || "") + (config.url || ""),
    {
      params: config.params || null,
      data: config.data || null,
      hasToken: !!token,
    }
  );

  return config;
});

GENERAL_API.interceptors.response.use(
  (response) => {
    console.log(
      "GENERAL AXIOS RESPONSE =>",
      response.status,
      response.config.url,
      response.data
    );
    return response;
  },
  (error) => {
    console.log(
      "GENERAL AXIOS ERROR =>",
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

export const topUpWallet = ({ email, amount }) =>
  WALLET_API.post("/top-up", {
    email,
    amount: Number(amount),
  });

export const verifyTopUp = (referenceId) =>
  WALLET_API.get(`/top-up/verify/${referenceId}`);

export const getWalletBalance = (walletId) =>
  WALLET_API.get(`/get-balance/${walletId}`);

export const getWithdrawalBanks = () =>
  WALLET_API.get("/withdrawal/banks");

export const getReferralInfo = (userId) =>
  WALLET_API.get(`/referral/info/${userId}`);

export const getWithdrawalHistory = (walletId, page = 1, limit = 10) =>
  WALLET_API.get(`/withdrawal/history/${walletId}`, {
    params: { page, limit },
  });

export const resolveAccount = ({ accountNumber, bankCode }) =>
  WALLET_API.post("/withdrawal/resolve-account", { accountNumber, bankCode });

export const getFixpointsBalance = (userId) =>
  GENERAL_API.get(`/wallet/fixpoints/balance/${userId}`);

export const lockFunds = ({ userId, amount, password }) =>
  WALLET_API.post("/lock", {
    userId,
    amount: Number(amount),
    password: String(password || "").trim(),
  });

export const unlockFunds = ({ userId, amount, password }) =>
  WALLET_API.post("/unlock", {
    userId,
    amount: Number(amount),
    password: String(password || "").trim(),
  });

export const getLockedBalanceBreakdown = (userId) =>
  WALLET_API.get(`/locked-breakdown/${userId}`);