import axios from "axios";

const BASE_URL = "https://wallet-service-seaj.onrender.com/api/wallet";

export const getWithdrawalHistory = async (userId, page = 1, limit = 10) => {
  const res = await axios.get(
    `${BASE_URL}/withdrawal/history/${userId}?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const resolveAccount = async ({ accountNumber, bankCode }) => {
  const res = await axios.post(
    `${BASE_URL}/withdrawal/resolve-account`,
    { accountNumber, bankCode }
  );
  return res.data;
};

export const initiateWithdrawal = async (payload) => {
  const res = await axios.post(
    `${BASE_URL}/withdrawal/initiate`,
    payload
  );
  return res.data;
};
