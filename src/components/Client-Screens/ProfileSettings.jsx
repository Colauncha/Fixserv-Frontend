import React, { useState, useEffect } from "react";
import PraiseImg from "../../assets/client images/client-home/PraiseAzobu.jpg";
import camera from "../../assets/client images/client-home/capture.png";
import profile from "../../assets/client images/client-home/person.png";
import home from "../../assets/client images/client-home/home.png";
import wallet from "../../assets/client images/client-home/walletpay.png";
import passwordIcon from "../../assets/client images/client-home/password.png";
import bell from "../../assets/client images/client-home/bell.png";
import card from "../../assets/client images/client-home/blurCard.png";
import success from "../../assets/client images/client-home/success.png";
import fund from "../../assets/client images/client-home/fundlock.png";
import lock from "../../assets/client images/client-home/lock.png";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getWalletBalance, getWithdrawalBanks } from "../../api/wallet.api";

const ProfileSettings = () => {
  const [profileImage, setProfileImage] = useState(PraiseImg);
  const [uploading, setUploading] = useState(false);
  const { user, token, login } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || user?._id;

  const walletIdentifier =
    user?.walletId ||
    user?.wallet?._id ||
    user?.wallet?.id ||
    user?.id ||
    user?._id ||
    null;

  const [walletData, setWalletData] = useState({
    balance: 0,
    lockedBalance: 0,
  });

  const [walletLoading, setWalletLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [savingBank, setSavingBank] = useState(false);

  const [bankForm, setBankForm] = useState({
    accountName: user?.withdrawalBankDetails?.accountName || "",
    bankCode: user?.withdrawalBankDetails?.bankCode || "",
    bankName: user?.withdrawalBankDetails?.bankName || "",
    accountNumber: user?.withdrawalBankDetails?.accountNumber || "",
  });

  const [lockAmount, setLockAmount] = useState("");
  const [lockPassword, setLockPassword] = useState("");
  const [unlockAmount, setUnlockAmount] = useState("");
  const [unlockPassword, setUnlockPassword] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    street: "",
    postalCode: "",
  });

  const handleProfileUpload = async (file) => {
    if (!file) return;
    if (file.size > 1024 * 1024) return alert("Image must not be more than 1MB");
    if (!userId) return alert("User not found");

    const uploadData = new FormData();
    uploadData.append("profilePicture", file);

    try {
      setUploading(true);

      const res = await fetch(
        `https://dev-user-api.fixserv.co/api/upload/${userId}/profile-picture`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      const imageUrl =
        data?.imageUrl ||
        data?.data?.imageUrl ||
        data?.data?.user?.profilePicture ||
        data?.user?.profilePicture ||
        data?.profilePicture;

      if (imageUrl) {
        setProfileImage(imageUrl);
        login(token, { ...user, profilePicture: imageUrl });
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!userId) return alert("User not found");

    try {
      const payload = {
        fullName: formData.fullName?.trim(),
        phoneNumber: formData.phone?.trim(),
        deliveryAddress: {
          country: formData.country?.trim(),
          state: formData.state?.trim(),
          city: formData.city?.trim(),
          street: formData.street?.trim(),
          postalCode: formData.postalCode?.trim(),
        },
        servicePreferences: user?.servicePreferences || [],
      };

      console.log("PATCH payload:", payload);

      const res = await fetch(`https://dev-user-api.fixserv.co/api/admin/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      console.log("PATCH response:", res.status, data);

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Update failed");
      }

      const updatedUser = data?.data?.user || data?.user || data?.data || data;

      login(token, {
        ...user,
        ...updatedUser,
        deliveryAddress: updatedUser?.deliveryAddress ?? user?.deliveryAddress,
        phoneNumber: updatedUser?.phoneNumber ?? user?.phoneNumber,
      });

      alert("Profile updated successfully!");
      navigate("/client/profile");
    } catch (err) {
      console.error("Profile update error:", err);
      alert(err.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        country: user.deliveryAddress?.country || "",
        state: user.deliveryAddress?.state || "",
        city: user.deliveryAddress?.city || "",
        street: user.deliveryAddress?.street || "",
        postalCode: user.deliveryAddress?.postalCode || "",
      });

      if (user.profilePicture) {
        setProfileImage(user.profilePicture);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!walletIdentifier || !token) return;

    const fetchWallet = async () => {
      try {
        setWalletLoading(true);

        const res = await getWalletBalance(walletIdentifier);
        const payload = res?.data;

        if (payload?.success) {
          setWalletData({
            balance: Number(payload?.data?.balance || 0),
            lockedBalance: Number(payload?.data?.lockedBalance || 0),
          });
        }
      } catch (err) {
        console.error("Wallet fetch error:", err?.response?.data || err?.message);
      } finally {
        setWalletLoading(false);
      }
    };

    fetchWallet();
  }, [walletIdentifier, token]);

  useEffect(() => {
    if (!token) return;

    const fetchBanks = async () => {
      try {
        const res = await getWithdrawalBanks();
        const data = res?.data;
        const rawList = data?.data || data || [];
        const list = Array.isArray(rawList) ? rawList : [];

        const uniqueBanks = Array.from(
          new Map(
            list
              .filter((b) => b?.code && b?.name)
              .map((b) => [String(b.code), b])
          ).values()
        );

        setBanks(uniqueBanks);
      } catch (err) {
        console.error("Failed to fetch banks", err?.response?.data || err?.message);
        setBanks([]);
      }
    };

    fetchBanks();
  }, [token]);

  useEffect(() => {
    if (!user) return;

    const savedBank = user?.withdrawalBankDetails || {};

    setBankForm({
      accountName: savedBank?.accountName || "",
      bankCode: savedBank?.bankCode || "",
      bankName: savedBank?.bankName || "",
      accountNumber: savedBank?.accountNumber || "",
    });
  }, [user]);

  const handleBankFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "bankCode") {
      const selected = banks.find((b) => String(b.code) === String(value));

      setBankForm((prev) => ({
        ...prev,
        bankCode: value,
        bankName: selected?.name || "",
      }));
      return;
    }

    setBankForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveBankDetails = async () => {
    if (!bankForm.accountName.trim()) return alert("Enter account name");
    if (!bankForm.bankCode) return alert("Select a bank");
    if (!bankForm.accountNumber.trim()) return alert("Enter account number");
    if (!/^\d{10}$/.test(bankForm.accountNumber.trim())) {
      return alert("Account number must be 10 digits");
    }

    try {
      setSavingBank(true);

      const nextUser = {
        ...user,
        withdrawalBankDetails: {
          accountName: bankForm.accountName.trim(),
          bankCode: bankForm.bankCode,
          bankName: bankForm.bankName,
          accountNumber: bankForm.accountNumber.trim(),
        },
      };

      login(token, nextUser);
      alert("Withdrawal bank details updated successfully!");
    } catch (err) {
      console.error("Save bank details error:", err);
      alert("Failed to update bank details");
    } finally {
      setSavingBank(false);
    }
  };

  const handleLockFunds = () => {
    if (!lockAmount || Number(lockAmount) <= 0) {
      return alert("Enter a valid amount to lock");
    }

    if (Number(lockAmount) > Number(walletData.balance || 0)) {
      return alert("Amount cannot be more than available balance");
    }

    if (!lockPassword.trim()) {
      return alert("Enter your password");
    }

    alert(
      "Lock funds endpoint is not wired yet. Current backend shared so far only returns lockedBalance; no lock mutation endpoint has been provided yet."
    );
  };

  const handleUnlockFunds = () => {
    if (!unlockAmount || Number(unlockAmount) <= 0) {
      return alert("Enter a valid amount to unlock");
    }

    if (Number(unlockAmount) > Number(walletData.lockedBalance || 0)) {
      return alert("Amount cannot be more than locked balance");
    }

    if (!unlockPassword.trim()) {
      return alert("Enter your password");
    }

    alert(
      "Unlock funds endpoint is not wired yet. Current backend shared so far only returns lockedBalance; no unlock mutation endpoint has been provided yet."
    );
  };

  const notifications = [
    {
      title: "News",
      desc: "News about products and feature updates",
    },
    {
      title: "Updates",
      desc: "Feature updates",
    },
    {
      title: "User Research",
      desc: "Get involved in our beta testing program or participate in paid product user research",
    },
    {
      title: "Reminders",
      desc: "These are notifications to remind you of updates and repair progress",
    },
  ];

  const min = 0;
  const max = 10000;

  const [notificationEnabled, setNotificationEnabled] = useState(
    notifications.map(() => false)
  );

  const [lowBalanceEnabled, setLowBalanceEnabled] = useState(false);
  const [value, setValue] = useState(10000);

  const percentage = ((value - min) / (max - min)) * 100;

  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const toggleItem = (index) => {
    setNotificationEnabled((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  return (
    <div className="w-full">
      <section className="w-full py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/client/profile");
              }
            }}
            className="text-sm text-[#3E83C4] mb-10 flex items-center gap-1 hover:underline cursor-pointer"
          >
            ← Back
          </button>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative w-[200px] h-[200px]">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-2xl"
              />

              <label className="absolute bottom-0 right-0 p-2 cursor-pointer">
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl text-white text-sm">
                    Uploading...
                  </div>
                )}

                <img src={camera} alt="Upload" className="w-12 h-12" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
  const file = e.target.files[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  setProfileImage(previewUrl);
  handleProfileUpload(file);

  setTimeout(() => URL.revokeObjectURL(previewUrl), 5000);
}}
                />
              </label>
            </div>

            <h2 className="text-lg font-semibold">Profile Picture</h2>

            <p className="text-sm text-[#656565]">
              This will be displayed on your profile
            </p>

            <p className="text-xs text-[#3E83C4]">
              Image must not be more than 1 mb
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="flex items-center gap-2 mb-6">
            <img src={profile} alt="profile icon" className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-black">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#535353] mb-1">Name</label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-[#535353] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                onChange={handleChange}
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* <div>
              <label className="block text-sm text-[#535353] mb-1">
                Service Preference
              </label>
              <input
                type="text"
                placeholder="Enter New Service Preference"
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-[#D3E4F4] text-[#3E83C4] text-xs px-3 py-1 rounded-full">
                  General ✕
                </span>
                <span className="bg-[#D3E4F4] text-[#3E83C4] text-xs px-3 py-1 rounded-full">
                  Phone Repair ✕
                </span>
                <span className="bg-[#D3E4F4] text-[#3E83C4] text-xs px-3 py-1 rounded-full">
                  Tablet Repair ✕
                </span>
              </div>
            </div> */}

            <div>
              <label className="block text-xs text-[#535353] mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="text"
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleProfileUpdate}
              className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md hover:bg-[#356bb3] cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>
      </section>

      <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <hr className="border-[#C1DAF3] mt-2 mb-8" />
          <div className="flex items-center gap-2 mb-6">
            <img src={home} alt="profile icon" className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-black">Home Address</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-[#535353] mb-1">
                Country
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#535353] mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#535353] mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ikeja"
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#535353] mb-1">
                Street
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#535353] mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleProfileUpdate}
              className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md hover:bg-[#356bb3] cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>
      </section>

      <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="flex items-center gap-2 mb-6">
            <img src={wallet} alt="wallet" className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-black">Wallet</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-[#C1DAF3] rounded-xl p-4 bg-[#F6FBFF]">
              <p className="text-sm text-[#535353] mb-2">Available Balance</p>
              <h3 className="text-2xl font-semibold text-black">
                {walletLoading
                  ? "Loading..."
                  : `₦${Number(walletData.balance || 0).toLocaleString()}`}
              </h3>
            </div>

            <div className="border border-[#C1DAF3] rounded-xl p-4 bg-[#F6FBFF]">
              <p className="text-sm text-[#535353] mb-2">Locked Balance</p>
              <h3 className="text-2xl font-semibold text-black">
                {walletLoading
                  ? "Loading..."
                  : `₦${Number(walletData.lockedBalance || 0).toLocaleString()}`}
              </h3>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-medium text-[#535353] mb-1">
              Set Locked Balance
            </p>
            <p className="text-sm text-gray-500 mb-3">
              Set aside funds in your wallet for safekeeping. You'll need your
              password to unlock and use them.
            </p>

            <div className="relative">
              <input
                type="text"
                value={`₦${Number(walletData.lockedBalance || 0).toLocaleString()}`}
                readOnly
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none bg-gray-50"
              />
              <img
                src={lock}
                alt="lock"
                className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>

            <div className="flex gap-4 mt-4 justify-center">
              <button
                onClick={() => {
                  setUnlockAmount("");
                  setUnlockPassword("");
                  setShowUnlockModal(true);
                }}
                className="border border-[#3E83C4] text-[#3E83C4] text-sm px-6 py-3 rounded-md hover:bg-[#3E83C4] hover:text-white cursor-pointer"
              >
                Unlock Funds
              </button>

              <button
                onClick={() => {
                  setLockAmount("");
                  setLockPassword("");
                  setShowLockModal(true);
                }}
                className="bg-[#3E83C4] text-white text-sm px-6 py-3 rounded-md flex items-center gap-1 hover:bg-[#356bb3] cursor-pointer"
              >
                Lock Funds +
              </button>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium text-[#535353] mb-4">
              Bank Account Details (for Withdrawals)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#535353] mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={bankForm.accountName}
                  onChange={handleBankFormChange}
                  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
                  placeholder="Enter account name"
                />
              </div>

              <div>
                <label className="block text-sm text-[#535353] mb-1">
                  Bank Name
                </label>
                <select
                  name="bankCode"
                  value={bankForm.bankCode}
                  onChange={handleBankFormChange}
                  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
                >
                  <option value="">Select Bank</option>
                  {banks.map((b) => (
                    <option key={`${b.code}-${b.name}`} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#535353] mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankForm.accountNumber}
                  onChange={(e) =>
                    setBankForm((prev) => ({
                      ...prev,
                      accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
                  placeholder="0123456789"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveBankDetails}
                disabled={savingBank}
                className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md hover:bg-[#356bb3] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {savingBank ? "Saving..." : "Update Bank Details"}
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                onClick={() => setLowBalanceEnabled((prev) => !prev)}
                className={`w-8 h-4 rounded-full relative cursor-pointer transition ${
                  lowBalanceEnabled ? "bg-[#3E83C4]" : "bg-[#535353]"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-0 shadow transition ${
                    lowBalanceEnabled ? "right-0" : "left-0"
                  }`}
                />
              </div>

              <p className="text-sm text-[#535353]">
                Low balance alert ₦{value.toLocaleString()}
              </p>
            </div>

            <p className="text-sm text-[#535353] mb-2">
              Notify if balance is under
            </p>

            <div className="relative">
              <div className="w-full h-1 bg-[#9BAAB9] rounded relative">
                <div
                  className="h-1 bg-[#3E83C4] rounded"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="absolute top-[-6px] left-0 w-full h-4 opacity-0 cursor-pointer"
                disabled={!lowBalanceEnabled}
              />

              <div
                className="w-3 h-3 bg-[#3E83C4] rounded-full absolute -top-1 transform -translate-x-1/2 pointer-events-none"
                style={{ left: `${percentage}%` }}
              />

              <div className="flex justify-between text-sm text-[#535353] mt-2">
                <span>₦{value.toLocaleString()}</span>
                <span>₦{max.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {(showLockModal || showUnlockModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-xl shadow-lg p-8 relative">
            <button
              onClick={() => {
                setShowLockModal(false);
                setShowUnlockModal(false);
              }}
              className="absolute top-4 right-4 text-[#535353] hover:text-gray-600"
            >
              ✕
            </button>

            <button
              onClick={() => {
                setShowLockModal(false);
                setShowUnlockModal(false);
              }}
              className="text-sm text-[#3E83C4] mb-4 flex items-center gap-1 cursor-pointer"
            >
              ← Back
            </button>

            {showLockModal && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <img src={fund} className="w-9 h-9" />
                  <div className="flex flex-col">
                    <span className="text-lg text-black font-medium">
                      Lock Funds
                    </span>
                    <span className="text-xs font-light text-[#535353]">
                      Your locked balance is safely stored and can only be
                      accessed using your account password
                    </span>
                  </div>
                </div>

                <label className="text-sm text-[#535353]">Enter Amount</label>
                <input
                  value={lockAmount}
                  onChange={(e) => setLockAmount(e.target.value.replace(/[^\d]/g, ""))}
                  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2"
                  placeholder="₦ 0"
                />

                <div className="flex gap-12 mt-3 mb-8">
                  {["1000", "2500", "5000", "10000"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setLockAmount(v)}
                      className="px-3 py-1 text-sm rounded-md bg-[#EEF6FF] text-[#535353] cursor-pointer"
                    >
                      ₦{Number(v).toLocaleString()}
                    </button>
                  ))}
                </div>

                <label className="text-sm text-[#535353] mt-4">Password</label>
                <input
                  type="password"
                  value={lockPassword}
                  onChange={(e) => setLockPassword(e.target.value)}
                  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2 mb-5"
                  placeholder="Enter Password"
                />

                <button
                  onClick={handleLockFunds}
                  className="w-full bg-[#3E83C4] text-white text-sm py-2 rounded-md mb-2 cursor-pointer"
                >
                  Lock
                </button>
              </>
            )}

            {showUnlockModal && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <img src={fund} className="w-9 h-9" />
                  <div className="flex flex-col">
                    <span className="text-lg text-black font-medium">
                      Unlock Funds
                    </span>
                    <span className="text-xs font-light text-[#535353]">
                      Your locked funds are safely stored. Unlocking them will
                      make the amount available for payments and withdrawals.
                    </span>
                  </div>
                </div>

                <label className="text-sm text-[#535353]">Enter Amount</label>
                <input
                  value={unlockAmount}
                  onChange={(e) =>
                    setUnlockAmount(e.target.value.replace(/[^\d]/g, ""))
                  }
                  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2"
                  placeholder="₦ 0"
                />

                <div className="flex gap-12 mt-3 mb-8">
                  {["1000", "2500", "5000", "10000"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setUnlockAmount(v)}
                      className="px-3 py-1 text-sm rounded-md bg-[#EEF6FF] text-[#535353] cursor-pointer"
                    >
                      ₦{Number(v).toLocaleString()}
                    </button>
                  ))}
                </div>

                <label className="text-sm text-[#535353] mt-4">Password</label>
                <input
                  type="password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2 mb-5"
                  placeholder="Enter Password"
                />

                <button
                  onClick={handleUnlockFunds}
                  className="w-full bg-[#3E83C4] text-white text-sm py-2 rounded-md mb-2 cursor-pointer"
                >
                  Unlock
                </button>
              </>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setShowLockModal(false);
                  setShowUnlockModal(false);
                }}
                className="text-xs text-[#535353] underline hover:text-gray-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[620px] rounded-xl shadow-lg p-8 relative">
            <button
              onClick={() => setShowAddCard(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </button>

            <button
              onClick={() => setShowAddCard(false)}
              className="text-sm text-[#3E83C4] mb-8 flex items-center gap-1 cursor-pointer"
            >
              ← Back
            </button>

            <h2 className="text-center text-black text-xl font-semibold mb-10">
              Add New Card Modal
            </h2>

            <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-12">
              <div>
                <label className="text-sm text-[#535353] block mb-2">
                  Card Number*
                </label>
                <input
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-[#535353] block mb-2">
                  Card Name*
                </label>
                <input
                  placeholder="Name"
                  className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
                />
              </div>

              <div className="max-w-[160px]">
                <label className="text-sm text-[#535353] block mb-2">
                  Expiry Date
                </label>
                <input
                  placeholder="MM / YY"
                  className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
                />
              </div>

              <div className="max-w-[200px]">
                <label className="text-sm text-[#535353] block mb-2">CVV</label>

                <div className="relative">
                  <input
                    placeholder="123"
                    inputMode="numeric"
                    maxLength={4}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                    className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
                  />
                  <img
                    src={card}
                    className="w-5 absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowAddCard(false);
                  setShowAddSuccess(true);

                  setTimeout(() => {
                    setShowAddSuccess(false);
                  }, 2000);
                }}
                className="bg-[#3E83C4] hover:bg-[#356bb3] text-white text-sm px-24 py-3 rounded-md transition cursor-pointer"
              >
                Save Card
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 text-center">
            <img src={success} className="w-16 mx-auto mb-4" />

            <h3 className="text-xl text-black font-medium mb-2">
              Payment Method Saved
            </h3>

            <p className="text-sm text-[#535353]">
              Your card has been added successfully and is now available for
              payments.
            </p>
          </div>
        </div>
      )}

      <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <hr className="border-[#C1DAF3] mt-2 mb-8" />
          <div className="flex items-center gap-2 mb-6">
            <img src={passwordIcon} alt="profile icon" className="w-5 h-5" />
            <h2 className="text-sm font-semibold text-[#000000]">Password</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#535353] mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter Current Password"
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#535353] mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter New Password"
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#535353] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Enter New Password"
                className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md hover:bg-[#356bb3] cursor-pointer">
              Update
            </button>
          </div>
        </div>
      </section>

      <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="flex items-start gap-2 mb-6">
            <img src={bell} alt="bell" className="w-5 h-5 mt-1" />
            <div>
              <h2 className="text-sm font-semibold text-black">
                Email Notifications
              </h2>
              <p className="text-xs text-[#535353] max-w-lg">
                Get emails to find out what is going on in Fixserv when you are
                not online. You can turn these off whenever you want to.
              </p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {notifications.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  onClick={() => toggleItem(index)}
                  className={`w-9 h-5 rounded-full relative mt-1 flex-shrink-0 cursor-pointer transition ${
                    notificationEnabled[index] ? "bg-[#3E83C4]" : "bg-[#535353]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition ${
                      notificationEnabled[index] ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </div>

                <div>
                  <p className="text-sm text-black">{item.title}</p>
                  <p className="text-xs text-[#535353] max-w-md">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mb-10">
            <button className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md hover:bg-[#356bb3] cursor-pointer">
              Update
            </button>
          </div>

          <hr className="border-[#C1DAF3] mt-2 mb-8" />

          <div className="mb-10">
            <h3 className="text-sm font-semibold text-black mb-1">
              Delete your account
            </h3>
            <p className="text-sm text-[#535353] max-w-lg mb-4">
              When you delete your account, you lose access to Fixserv account
              services, and we permanently delete your personal data.
            </p>

            <div className="flex items-center gap-2 mb-6">
              <input type="checkbox" className="w-4 h-4" />
              <label className="text-sm text-[#535353]">
                Confirm that I want to delete my account
              </label>
            </div>

            <div className="flex justify-end">
              <button className="bg-red-600 text-white text-sm px-6 py-2 rounded-md cursor-pointer">
                Delete
              </button>
            </div>
          </div>

          <hr className="border-[#C1DAF3] mt-2 mb-8" />

          <div className="flex justify-center">
            <button className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md hover:bg-[#356bb3] cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;