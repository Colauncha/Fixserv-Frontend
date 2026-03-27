import React, { useEffect, useMemo, useState } from "react";
import withdrawerIcon from "../../assets/Artisan Images/withdrawal icon.png";
import pendingIcon from "../../assets/Artisan Images/pending icon.png";
import failedIcon from "../../assets/Artisan Images/failed icon.png";
import { useNavigate } from "react-router-dom";
import {
  getWalletBalance,
  getWithdrawalHistory,
  getWithdrawalBanks,
  resolveAccount,
  initiateWithdrawal,
} from "../../api/wallet.api";
import { useAuth } from "../../context/AuthContext";
import ArtisanHeader from "./ArtisanHeader";

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return `NGN ${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const Wallet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const walletId = user?.id || user?._id;

  const [screen, setScreen] = useState("home");

  const [walletBalance, setWalletBalance] = useState(0);
  const [lockedBalance, setLockedBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [withdrawals, setWithdrawals] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit] = useState(10);
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [historyLoading, setHistoryLoading] = useState(false);

  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [pin, setPin] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  const [showBankDropdown, setShowBankDropdown] = useState(false);
const [bankSearch, setBankSearch] = useState("");

  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);

  const [lastWithdrawalResult, setLastWithdrawalResult] = useState(null);
  const [submittedWithdrawal, setSubmittedWithdrawal] = useState(null);
  const [withdrawalError, setWithdrawalError] = useState("");

  const fee = 50;
  const withdrawalAmount = Number(amount || 0);
  const totalDebit = withdrawalAmount;
  const netAmount = Math.max(withdrawalAmount - fee, 0);
  const availableForWithdrawal = Math.max(Number(walletBalance || 0), 0);

  const hasSufficientBalance =
    withdrawalAmount > 0 && totalDebit <= availableForWithdrawal;

  const canWithdraw =
    withdrawalAmount > 0 &&
    accountNumber.length === 10 &&
    !!bankCode &&
    !!accountName &&
    pin?.length >= 4 &&
    hasSufficientBalance &&
    !withdrawing;

  const fetchBalance = async () => {
    if (!walletId) return;

    try {
      setBalanceLoading(true);
      const res = await getWalletBalance(walletId);

      setWalletBalance(Number(res?.data?.data?.balance || 0));
      setLockedBalance(Number(res?.data?.data?.lockedBalance || 0));
    } catch (err) {
      console.error("Failed to fetch wallet balance:", err);
      setWalletBalance(0);
      setLockedBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchWithdrawals = async (pageToUse = historyPage) => {
    if (!walletId) return;

    try {
      setHistoryLoading(true);

      const res = await getWithdrawalHistory(walletId, pageToUse, historyLimit);

      setWithdrawals(res?.data?.data?.withdrawals || []);
      setHistoryPagination(
        res?.data?.data?.pagination || {
          page: pageToUse,
          limit: historyLimit,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (err) {
      console.error("Failed to fetch withdrawal history:", err);
      setWithdrawals([]);
      setHistoryPagination({
        page: 1,
        limit: historyLimit,
        total: 0,
        totalPages: 1,
      });
    } finally {
      setHistoryLoading(false);
    }
  };

const fetchBanks = async () => {
  try {
    setBanksLoading(true);
    const res = await getWithdrawalBanks();

    const rawBanks = Array.isArray(res?.data?.data) ? res.data.data : [];

    const normalizedBanks = rawBanks.map((bank, index) => ({
      id: bank?.bank_id || bank?.id || bank?._id || `bank-${index}`,
      code:
        bank?.bank_code ||
        bank?.code ||
        bank?.bankCode ||
        bank?.value ||
        "",
      name:
        bank?.bank_name ||
        bank?.name ||
        bank?.bankName ||
        bank?.label ||
        bank?.title ||
        `Bank ${index + 1}`,
    }));

    setBanks(normalizedBanks);
  } catch (err) {
    console.error("Failed to fetch banks:", err);
    setBanks([]);
  } finally {
    setBanksLoading(false);
  }
};

  useEffect(() => {
    if (!walletId) return;
    fetchBalance();
  }, [walletId]);

  useEffect(() => {
    if (!walletId) return;
    fetchWithdrawals(historyPage);
  }, [walletId, historyPage]);

  useEffect(() => {
    fetchBanks();
  }, []);

  const activityFeed = useMemo(() => {
    return withdrawals.map((item) => {
      const status = String(item?.status || "").toUpperCase();

      return {
        id: item?._id || item?.id || item?.reference,
        icon:
          status === "SUCCESS"
            ? withdrawerIcon
            : status === "PENDING"
            ? pendingIcon
            : failedIcon,
        title:
          status === "SUCCESS"
            ? "Withdrawal successful"
            : status === "PENDING"
            ? "Withdrawal pending"
            : "Withdrawal failed",
        amount:
          status === "SUCCESS" || status === "PENDING"
            ? `- ${formatMoney(item?.amount)}`
            : formatMoney(item?.amount),
        message: `${item?.accountName || "Bank account"} • ${
          item?.bankCode || "—"
        } • Ref: ${item?.reference || "—"}`,
        date: formatDate(item?.createdAt),
        color:
          status === "SUCCESS"
            ? "text-red-500"
            : status === "PENDING"
            ? "text-yellow-500"
            : "text-red-600",
      };
    });
  }, [withdrawals]);

const filteredBanks = useMemo(() => {
  const keyword = bankSearch.trim().toLowerCase();

  if (!keyword) return banks;

  return banks.filter((bank) =>
    String(bank?.name || "")
      .toLowerCase()
      .includes(keyword)
  );
}, [banks, bankSearch]);

  const handleResolveAccount = async () => {
    if (accountNumber.length !== 10 || !bankCode) return;

    try {
      const res = await resolveAccount({ accountNumber, bankCode });
setAccountName(
  res?.data?.data?.accountName ||
    res?.data?.accountName ||
    res?.accountName ||
    ""
);
    } catch (err) {
      setAccountName("");
      console.error("Account resolution failed:", err);
    }
  };

  const resetWithdrawalForm = () => {
    setAmount("");
    setAccountNumber("");
    setBankCode("");
    setPin("");
    setAccountName("");
  };

  const handleWithdraw = async () => {
    if (withdrawing) return;

    setWithdrawalError("");

    setLastWithdrawalResult(null);
setSubmittedWithdrawal(null);

    if (!walletId) {
      setWithdrawalError("User ID not found.");
      setScreen("failed");
      return;
    }

    if (withdrawalAmount <= 0) {
      setWithdrawalError("Enter a valid withdrawal amount.");
      return;
    }

    if (!hasSufficientBalance) {
      setWithdrawalError("Insufficient wallet balance.");
      return;
    }

    if (accountNumber.length !== 10) {
      setWithdrawalError("Enter a valid 10-digit account number.");
      return;
    }

    if (!bankCode) {
      setWithdrawalError("Select a bank.");
      return;
    }

    if (!accountName) {
      setWithdrawalError("Account name could not be resolved.");
      return;
    }

    if (!pin || pin.length < 4) {
      setWithdrawalError("Enter your transaction PIN.");
      return;
    }

    try {
      setWithdrawing(true);

      const withdrawalPayload = {
        userId: walletId,
        amount: withdrawalAmount,
        accountNumber,
        bankCode,
        pin,
      };

      setSubmittedWithdrawal({
        amount: withdrawalAmount,
        accountNumber,
        bankCode,
        accountName,
        date: new Date().toISOString(),
      });

      const res = await initiateWithdrawal(withdrawalPayload);
const result =
  res?.data?.data?.withdrawal ||
  res?.data?.data ||
  res?.data ||
  {};

      setLastWithdrawalResult(result);

      await fetchBalance();
      await fetchWithdrawals(1);
      setHistoryPage(1);

      resetWithdrawalForm();
      setScreen("success");
    } catch (err) {
      console.error("Withdrawal failed:", err);

      setWithdrawalError(
  err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.response?.data?.data?.message ||
    "We could not process your withdrawal. Please try again."
);

      setScreen("failed");
    } finally {
      setWithdrawing(false);
    }
  };

  useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      handleResolveAccount();
    }
  }, [accountNumber, bankCode]);
  
  useEffect(() => {
  if (bankCode) {
    setShowBankDropdown(false);
  }
}, [bankCode]);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest(".bank-dropdown-wrapper")) {
      setShowBankDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-[#f7f7f7]">
      {screen === "home" && (
        <>
          <ArtisanHeader title="My Wallet" />

          <div className="mt-6 border-t border-blue-100 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-5 sm:p-6 rounded-xl">
                  <p className="text-sm text-gray-500 mb-2">Available Balance</p>
                  <h2 className="text-2xl font-bold break-words">
                    {balanceLoading ? "Loading..." : formatMoney(walletBalance)}
                  </h2>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl">
                  <p className="text-sm text-gray-500 mb-2">Locked Balance</p>
                  <h2 className="text-2xl font-bold break-words">
                    {balanceLoading ? "Loading..." : formatMoney(lockedBalance)}
                  </h2>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl text-center">
                  <p className="text-sm text-gray-500">Daily Earnings Streak</p>
                  <div className="relative inline-block my-2">
                    <span className="text-4xl sm:text-5xl font-bold text-blue-600">
                      7
                    </span>
                    <span className="absolute bottom-1 left-full ml-1 text-sm text-gray-400">
                      days!
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Keep up the good work!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setWithdrawalError("");
                    setScreen("withdraw");
                  }}
                  className="w-full bg-[#3E83C4] cursor-pointer text-white py-3 rounded-lg text-sm"
                >
                  Withdraw Funds
                </button>
              </div>

              <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold mb-4">Activity Feed & Milestones</h3>
                <div className="border-t border-blue-200 mb-4"></div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                  <input
                    placeholder="Search activities..."
                    className="border border-blue-200 rounded-md px-3 py-2 text-sm w-full"
                  />
                  <p className="border border-blue-200 rounded-md w-full px-4 py-2 text-sm">
                    Recent Withdrawals
                  </p>
                </div>

                <div className="space-y-4">
                  {historyLoading ? (
                    <p className="text-sm text-gray-500">Loading activities...</p>
                  ) : activityFeed.length ? (
                    activityFeed.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 border border-blue-200 p-4 rounded-lg"
                      >
                        <img src={item.icon} alt="" className="w-8 h-8 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm break-words">
                            <span className="font-semibold">{item.title}</span>{" "}
                            <span className={item.color}>{item.amount}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1 break-words">
                            {item.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No wallet activities yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {screen === "withdraw" && (
        <div className="w-full">
          <button
            onClick={() => setScreen("home")}
            className="text-[#3E83C4] cursor-pointer mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold mb-6">Withdraw Funds</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-5 sm:p-6 rounded-xl">
                <p className="text-sm text-gray-500">Available Balance</p>
                <h2 className="text-2xl font-bold break-words">
                  {balanceLoading ? "Loading..." : formatMoney(walletBalance)}
                </h2>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl">
                <p className="text-sm text-gray-500">Locked Balance</p>
                <h2 className="text-2xl font-bold break-words">
                  {balanceLoading ? "Loading..." : formatMoney(lockedBalance)}
                </h2>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-xl space-y-4">
                <h3 className="font-semibold">Make a withdrawal</h3>

                {withdrawalError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                    {withdrawalError}
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 mb-1">Amount to withdraw</p>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-blue-200 px-4 py-3 rounded-lg text-sm"
                  />
                  {withdrawalAmount > 0 && !hasSufficientBalance && (
                    <p className="text-red-500 text-sm mt-2">
                      Insufficient balance for this withdrawal.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <input
  placeholder="Account Number"
  value={accountNumber}
  onChange={(e) => {
    setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
    setAccountName("");
  }}
                    onBlur={handleResolveAccount}
                    className="w-full border border-blue-200 px-4 py-2 rounded-lg text-sm"
                  />

{/* <div className="relative"> */}
<div className="relative bank-dropdown-wrapper">
  <button
    type="button"
    onClick={() => setShowBankDropdown((prev) => !prev)}
    className="w-full border border-blue-200 px-4 py-3 rounded-lg text-sm bg-white text-left flex items-center justify-between"
  >
    <span className={bankCode ? "text-black" : "text-gray-400"}>
      {bankCode
        ? banks.find((bank) => bank.code === bankCode)?.name || "Selected Bank"
        : banksLoading
        ? "Loading banks..."
        : "Select Bank"}
    </span>
    <span className="text-black">▼</span>
  </button>

  {showBankDropdown && (
    <div className="absolute left-0 right-0 z-[9999] mt-2 bg-white border border-blue-200 rounded-lg shadow-lg overflow-hidden">
      <div className="p-2 border-b border-gray-100 bg-white">
        <input
          type="text"
          placeholder="Search bank..."
          value={bankSearch}
          onChange={(e) => setBankSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-black bg-white outline-none"
        />
      </div>

      <div className="max-h-60 overflow-y-auto bg-white">
        {banksLoading ? (
          <p className="px-4 py-3 text-sm text-black">Loading banks...</p>
        ) : filteredBanks.length ? (
          filteredBanks.map((bank) => (
            <button
              type="button"
              key={bank.id}
              onClick={() => {
                setBankCode(bank.code);
                setAccountName("");
                setShowBankDropdown(false);
                setBankSearch("");
              }}
              className="block w-full text-left px-4 py-3 text-sm text-black bg-white hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
            >
              {bank.name}
            </button>
          ))
        ) : (
          <p className="px-4 py-3 text-sm text-black">No bank found</p>
        )}
      </div>
    </div>
  )}

  <p className="text-xs text-gray-500 mt-1">
    {banksLoading ? "Loading..." : `${banks.length} banks loaded`}
  </p>
</div>

                  <input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full border border-blue-200 px-4 py-2 rounded-lg text-sm"
                  />

                  {accountName && (
                    <p className="text-green-600 text-sm break-words">
                      Account Name: {accountName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl space-y-4">
              <div className="bg-white p-5 sm:p-6 rounded-xl space-y-4">
                <h3 className="font-semibold">Transaction Summary</h3>
                <div className="border-t border-blue-200"></div>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between gap-4">
                    <span>Withdrawal Amount</span>
                    <span className="text-right">
                      {formatMoney(withdrawalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Transaction Fee</span>
                    <span className="text-right">{formatMoney(fee)}</span>
                  </div>
                </div>

                <div className="border-t border-blue-200 pt-4 flex justify-between gap-4 text-sm">
                  <span>You will receive</span>
                  <span className="text-[#3E83C4] font-semibold text-right">
                    {formatMoney(netAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={!canWithdraw}
                className={`w-full mt-4 py-3 rounded-lg text-white ${
                  canWithdraw ? "bg-[#3E83C4]" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {withdrawing ? "Processing..." : "Withdraw Now"}
              </button>
            </div>
          </div>

          <div className="mt-10 bg-white rounded-xl border border-blue-50 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-blue-200 text-lg sm:text-xl font-medium">
              Recent Withdrawals
            </div>

            {historyLoading && (
              <p className="p-4 sm:p-6 text-sm text-gray-500">
                Loading withdrawals...
              </p>
            )}

            {!historyLoading && !withdrawals.length && (
              <p className="p-4 sm:p-6 text-sm text-gray-400">No withdrawals yet</p>
            )}

            {!historyLoading &&
              withdrawals.map((item) => (
                <div
                  key={item._id || item.id || item.reference}
                  className="px-4 sm:px-6 py-4 text-sm border-t border-blue-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start md:items-center">
                    <span className="text-gray-600 break-words">
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="break-words">{formatMoney(item.amount)}</span>
                    <span className="break-words">
                      {item.accountName || item.accountNumber || "—"}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs w-fit ${
                        item.status === "SUCCESS"
                          ? "bg-green-100 text-green-600"
                          : item.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-4 sm:px-6 py-4 border-t border-blue-200 text-sm">
              <p>
                Page {historyPagination.page} of {historyPagination.totalPages || 1}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                  disabled={historyPagination.page <= 1}
                  className={`px-3 py-1 border border-blue-200 rounded ${
                    historyPagination.page <= 1
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setHistoryPage((p) =>
                      Math.min(historyPagination.totalPages || 1, p + 1)
                    )
                  }
                  disabled={
                    historyPagination.page >= (historyPagination.totalPages || 1)
                  }
                  className={`px-3 py-1 border border-blue-200 rounded ${
                    historyPagination.page >= (historyPagination.totalPages || 1)
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "success" && (
        <div className="w-full">
          <button
            onClick={() => setScreen("withdraw")}
            className="text-[#3E83C4] mb-6 flex items-center gap-2 cursor-pointer"
          >
            ← Back
          </button>

          <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 sm:p-8 lg:p-10 text-center">
            <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
              <span className="text-white text-4xl">✓</span>
            </div>

            <h2 className="text-2xl font-semibold mb-2">Withdrawal Successful</h2>
            <p className="text-gray-500 mb-8">
              Your withdrawal request has been processed.
            </p>

            <div className="text-sm text-left max-w-md mx-auto space-y-3 mb-8">
              <div className="flex justify-between gap-4">
                <span>Amount Withdrawn</span>
                <span className="text-right">
                  {formatMoney(
                    lastWithdrawalResult?.amount || submittedWithdrawal?.amount || 0
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Destination Account</span>
                <span className="text-right break-words">
                  {lastWithdrawalResult?.accountName ||
                    submittedWithdrawal?.accountName ||
                    "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Transaction ID</span>
                <span className="text-right break-words">
                  {lastWithdrawalResult?.withdrawalId ||
                    lastWithdrawalResult?.reference ||
                    lastWithdrawalResult?.id ||
                    "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Date & Time</span>
                <span className="text-right">
                  {formatDateTime(
                    lastWithdrawalResult?.createdAt ||
                      submittedWithdrawal?.date ||
                      new Date()
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setScreen("withdraw")}
                className="bg-[#3E83C4] cursor-pointer text-white px-8 py-3 rounded-lg"
              >
                Return to Wallet
              </button>

              <button
                onClick={() => navigate("/artisan")}
                className="border border-blue-200 text-[#3E83C4] cursor-pointer px-8 py-3 rounded-lg"
              >
                Go to Dashboard
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-8">
              If you have any questions, please{" "}
              <span className="text-[#3E83C4]">contact support</span>
            </p>
          </div>
        </div>
      )}

      {screen === "failed" && (
        <div className="w-full flex justify-center">
          <div className="bg-white rounded-xl p-6 sm:p-8 lg:p-10 w-full max-w-lg text-center space-y-6 border">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl">
                ✕
              </div>
            </div>

            <h2 className="text-xl font-semibold">Withdrawal Unsuccessful</h2>

            <p className="text-gray-500 text-sm">
              {withdrawalError || (
                <>
                  We couldn't process your withdrawal of{" "}
                  <b>
                    {formatMoney(
                      submittedWithdrawal?.amount || withdrawalAmount || 0
                    )}
                  </b>
                  . Please check your bank details or try again.
                </>
              )}
            </p>

            <div className="bg-gray-50 rounded-lg p-4 text-left text-sm space-y-2">
              <p className="font-medium">What can you do</p>
              <ul className="list-disc list-inside text-gray-500 space-y-1">
                <li>Retry the withdrawal in a few moments</li>
                <li>Verify your bank account information is correct</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setScreen("withdraw")}
                className="flex-1 bg-[#3E83C4] text-white py-3 rounded-lg"
              >
                Try again
              </button>

              <button className="flex-1 border border-blue-200 py-3 rounded-lg text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;