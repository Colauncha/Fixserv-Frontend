import { createApiClient } from "./createApiClient";

const WALLET_BASE_URL =
  import.meta.env.VITE_WALLET_API_BASE_URL ||
  "https://wallet-api.fixserv.co/api/wallet";

const WALLET_GENERAL_BASE_URL =
  import.meta.env.VITE_WALLET_GENERAL_API_BASE_URL ||
  "https://wallet-api.fixserv.co/api";

const WALLET_API = createApiClient({
  baseURL: WALLET_BASE_URL,
  requestLabel: "WALLET AXIOS REQUEST =>",
  responseLabel: "WALLET AXIOS RESPONSE =>",
  errorLabel: "WALLET AXIOS ERROR =>",
});

const GENERAL_API = createApiClient({
  baseURL: WALLET_GENERAL_BASE_URL,
  requestLabel: "GENERAL AXIOS REQUEST =>",
  responseLabel: "GENERAL AXIOS RESPONSE =>",
  errorLabel: "GENERAL AXIOS ERROR =>",
});

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

export const getWithdrawalHistory = (userId, page = 1, limit = 10) =>
  WALLET_API.get(`/withdrawal/history/${userId}`, {
    params: { page, limit },
  });

export const resolveAccount = ({ accountNumber, bankCode }) =>
  WALLET_API.post("/withdrawal/resolve-account", {
    accountNumber,
    bankCode,
  });

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

export { WALLET_API, GENERAL_API };