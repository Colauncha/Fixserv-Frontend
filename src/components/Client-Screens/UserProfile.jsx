import React, { useState, useEffect } from "react";
import locationBlack from "../../assets/client images/client-home/location black.png";
import edit from "../../assets/client images/client-home/edit.png";
import walletIcon from "../../assets/client images/client-home/walletpay.png";
import PraiseImg from "../../assets/client images/client-home/PraiseAzobu.jpg";
import coin from "../../assets/client images/client-home/Fixcoin.png";
import email from "../../assets/client images/client-home/mail.png";
import locationBlue from "../../assets/client images/client-home/location blue.png";
import phone from "../../assets/client images/client-home/phone.png";
import item from "../../assets/client images/client-home/items.png";
import logOut from "../../assets/client images/client-home/logout.png";
import fund from "../../assets/client images/client-home/fund.png";
import secure from "../../assets/client images/client-home/secure.png";
import shieldBlue from "../../assets/client images/client-home/shield blue.png";
import success from "../../assets/client images/client-home/success.png";
import icon from "../../assets/client images/client-home/icon.png";
import current from "../../assets/client images/client-home/current.png";
import bank from "../../assets/client images/client-home/bank.png";
import card from "../../assets/client images/client-home/card.png";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft } from "lucide-react";

import {
  getReferralInfo,
  getFixpointsBalance,
  initiateWithdrawal,
  topUpWallet,
  getWalletBalance,
  getWithdrawalBanks,
  verifyTopUp,
  getLockedBalanceBreakdown,
} from "../../api/wallet.api";

import { deleteOrder } from "../../api/order.api";
import { getArtisanById } from "../../api/artisan.api";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token, logout, login } = useAuth();

  const profileUser =
    user?.data?.user ||
    user?.user ||
    user?.client ||
    user?.data?.client ||
    user ||
    {};

  const userId = profileUser?.id || profileUser?._id;

  const walletIdentifier =
    profileUser?.walletId ||
    profileUser?.wallet?._id ||
    profileUser?.wallet?.id ||
    profileUser?.id ||
    profileUser?._id ||
    userId ||
    null;

  const address = profileUser?.deliveryAddress || {};

  const servicePreferences = Array.isArray(profileUser?.servicePreferences)
    ? profileUser.servicePreferences
    : [];

  const addressText =
    address?.street || address?.city || address?.state
      ? [address?.street, address?.city, address?.state].filter(Boolean).join(", ")
      : "—";

  const [loading, setLoading] = useState(false);

  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");

  const [fundAmount, setFundAmount] = useState("");
  const [fundReference, setFundReference] = useState(null);

  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    accountNumber: "",
    bankCode: "",
    pin: "",
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileUploading, setProfileUploading] = useState(false);

  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const [deletingRequestId, setDeletingRequestId] = useState(null);

  const [showFundModal, setShowFundModal] = useState(false);
  const [fundStep, setFundStep] = useState("form");

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState("form");

  const [wallet, setWallet] = useState({
    balance: 0,
    lockedBalance: 0,
    available: 0,
    totalLocked: 0,
    manuallyLocked: 0,
    orderEscrow: 0,
  });

  const [fixpoints, setFixpoints] = useState(0);

  const [referral, setReferral] = useState({
    totalReferrals: 0,
    totalRewards: 0,
  });

const sortedUploads = [...uploadedProducts].sort((a, b) => {
  const ta = new Date(a?.uploadedAt || a?.createdAt || 0).getTime();
  const tb = new Date(b?.uploadedAt || b?.createdAt || 0).getTime();
  return tb - ta;
});


  const fetchReferral = async () => {
    try {
      if (!userId || !token) return;

      const res = await getReferralInfo(userId);
      const payload = res?.data;

      console.log("GET REFERRAL PAYLOAD =>", payload);

      console.log("SORTED UPLOADS =>", sortedUploads);

      if (payload?.success) {
        setReferral({
          totalReferrals: Number(payload?.data?.totalReferrals ?? 0),
          totalRewards: Number(payload?.data?.totalRewards ?? 0),
        });
      } else {
        console.log("GET REFERRAL NOT SUCCESS =>", payload);
      }
    } catch (err) {
      console.error("Referral fetch error:", err?.response?.data || err?.message);
    }
  };


  const canDeleteRequestStatus = (status) => {
    const raw = String(status || "").toUpperCase();
    return ["REJECTED", "CANCELLED", "COMPLETED"].includes(raw);
  };

  const handleDeleteRequestFromUpload = async (product) => {
    const orderId = product?.orderId || product?.requestId || product?.bookingId;
    const rawStatus = String(
      product?.orderStatus || product?.status || product?.requestStatus || ""
    ).toUpperCase();

    if (!orderId) {
      alert("No linked request found for this uploaded item");
      return;
    }

    if (!canDeleteRequestStatus(rawStatus)) {
      alert(
        `Cannot delete request with status: ${rawStatus || "UNKNOWN"}. Only REJECTED, CANCELLED, or COMPLETED requests can be deleted`
      );
      return;
    }

    const ok = window.confirm("Delete this request?");
    if (!ok) return;

    try {
      setDeletingRequestId(orderId);

      await deleteOrder(orderId);

      alert("Request deleted successfully");
    } catch (error) {
      console.error(
        "DELETE REQUEST ERROR =>",
        error?.response?.data || error?.message
      );

      const backendErrors = error?.response?.data?.errors;
      const firstError =
        Array.isArray(backendErrors) && backendErrors.length > 0
          ? backendErrors[0]?.message || backendErrors[0]
          : null;

      alert(
        firstError ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete request"
      );
    } finally {
      setDeletingRequestId(null);
    }
  };

  useEffect(() => {
    const fallbackUploads =
      profileUser?.uploadedProducts ||
      profileUser?.data?.uploadedProducts ||
      user?.uploadedProducts ||
      [];

    if (Array.isArray(fallbackUploads) && fallbackUploads.length > 0) {
      setUploadedProducts(fallbackUploads);
    }
  }, [profileUser?.uploadedProducts, profileUser?.data?.uploadedProducts, user?.uploadedProducts]);



  const handleDeleteUpload = async (product) => {
    const pid = product?._id || product?.id;
    if (!userId || !pid) return;

    const ok = window.confirm("Delete this uploaded item?");
    if (!ok) return;

    setDeletingId(pid);

    try {
      const res = await fetch(
        `https://dev-user-api.fixserv.co/api/upload/${userId}/upload-products/${pid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || `Delete failed with status ${res.status}`
        );
      }

      setUploadedProducts((prev) =>
        prev.filter((x) => String(x?._id || x?.id) !== String(pid))
      );
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert(err?.message || "Failed to delete uploaded item");
    } finally {
      setDeletingId(null);
    }
  };

  const fetchWallet = async () => {
    try {
      if ((!walletIdentifier && !userId) || !token) return;

      const [balanceRes, breakdownRes] = await Promise.allSettled([
        walletIdentifier ? getWalletBalance(walletIdentifier) : Promise.resolve(null),
        userId ? getLockedBalanceBreakdown(userId) : Promise.resolve(null),
      ]);

      let balance = 0;
      let lockedBalance = 0;

      if (
        balanceRes.status === "fulfilled" &&
        balanceRes.value?.data?.success
      ) {
        const payload = balanceRes.value.data;

        console.log("GET WALLET BALANCE PAYLOAD =>", payload);

        balance = Number(payload?.data?.balance ?? 0);
        lockedBalance = Number(payload?.data?.lockedBalance ?? 0);
      }

      let available = balance;
      let totalLocked = lockedBalance;
      let manuallyLocked = 0;
      let orderEscrow = 0;

      if (
        breakdownRes.status === "fulfilled" &&
        breakdownRes.value?.data?.success
      ) {
        const payload = breakdownRes.value.data;
        const data = payload?.data || {};

        console.log("GET LOCKED BREAKDOWN PAYLOAD =>", payload);

        available = Number(data?.available ?? 0);
        totalLocked = Number(data?.totalLocked ?? 0);
        manuallyLocked = Number(data?.manuallyLocked ?? 0);
        orderEscrow = Number(data?.orderEscrow ?? 0);
      }

      setWallet({
        balance,
        lockedBalance,
        available,
        totalLocked,
        manuallyLocked,
        orderEscrow,
      });
    } catch (err) {
      console.error(
        "Wallet fetch error:",
        err?.response?.data || err?.message
      );
    }
  };

  const fetchFixpoints = async () => {
    try {
      if (!userId || !token) return;

      const res = await getFixpointsBalance(userId);
      const payload = res?.data;

      console.log("GET FIXPOINTS PAYLOAD =>", payload);

      if (payload?.success) {
        setFixpoints(Number(payload?.data?.points ?? 0));
      } else {
        console.log("GET FIXPOINTS NOT SUCCESS =>", payload);
      }
    } catch (err) {
      console.error("Fixpoints fetch error:", err?.response?.data || err?.message);
    }
  };

  useEffect(() => {
    if (!token || !userId || !walletIdentifier) return;

    fetchWallet();
    fetchFixpoints();
    fetchReferral();
  }, [walletIdentifier, userId, token]);

  useEffect(() => {
    if (!showWithdrawModal) return;
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
  }, [showWithdrawModal, token]);

  const handleWithdraw = async () => {
    try {
      if (!userId) {
        alert("User not found");
        return;
      }

      const cleanAmount = Number(String(withdrawData.amount).replace(/[^\d.]/g, ""));
      const cleanAccountNumber = String(withdrawData.accountNumber || "").replace(/\D/g, "");
      const cleanPin = String(withdrawData.pin || "").trim();

      if (!withdrawData.bankCode) {
        alert("Please select a bank");
        return;
      }

      if (!cleanAccountNumber) {
        alert("Please enter account number");
        return;
      }

      if (cleanAccountNumber.length < 10) {
        alert("Enter a valid account number");
        return;
      }

      if (!cleanAmount || cleanAmount <= 0) {
        alert("Enter a valid withdrawal amount");
        return;
      }

      if (cleanAmount > Number(wallet?.available || 0)) {
        alert("Insufficient balance");
        return;
      }

      if (!cleanPin) {
        alert("Enter your transaction PIN");
        return;
      }

      setLoading(true);

      const res = await initiateWithdrawal({
        userId,
        amount: cleanAmount,
        accountNumber: cleanAccountNumber,
        bankCode: withdrawData.bankCode,
        pin: cleanPin,
      });

      const payload = res?.data;

      if (!payload?.success) {
        throw new Error(payload?.message || "Withdrawal failed");
      }

      setWithdrawData({
        amount: "",
        accountNumber: "",
        bankCode: "",
        pin: "",
      });
      setSelectedBank("");
      setWithdrawStep("success");
      await fetchWallet();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFundWallet = async () => {
    try {
      if (!user?.email) {
        alert("No email found for this account");
        return;
      }

      const cleanAmount = Number(String(fundAmount).replace(/[^\d.]/g, ""));
      if (!cleanAmount || cleanAmount <= 0) {
        alert("Enter a valid amount");
        return;
      }

      setLoading(true);

      const res = await topUpWallet({
        email: user.email,
        amount: cleanAmount,
      });

      const payload = res?.data;

      if (!payload?.success) {
        throw new Error(payload?.message || "Funding failed");
      }

      const paymentUrl = payload?.data?.paymentUrl || {};
      const authorizationUrl =
        paymentUrl?.authorization_url ||
        paymentUrl?.authorizationUrl ||
        "";
      const reference =
        paymentUrl?.reference ||
        payload?.data?.reference ||
        payload?.reference ||
        "";

      if (!reference) {
        throw new Error("No transaction reference returned");
      }

      setFundReference(reference);
      setFundAmount(String(cleanAmount));
      setFundStep("processing");

      if (!authorizationUrl) {
        throw new Error("No payment link returned");
      }


      window.location.href = authorizationUrl;
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Funding failed");
      setFundStep("form");
    } finally {
      setLoading(false);
    }
  };

  const verifyFundWallet = async () => {
    try {
      if (!fundReference) {
        alert("No transaction reference to verify");
        return;
      }

      setLoading(true);

      const res = await verifyTopUp(fundReference);
      const payload = res?.data;

      if (!payload?.success) {
        throw new Error(payload?.message || "Verification failed");
      }

      setFundStep("success");
      await fetchWallet();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpload = async (file) => {
    if (!file) return;
    if (!userId) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setProfileUploading(true);

      const res = await fetch(
        `https://dev-user-api.fixserv.co/api/upload/${userId}/profile-picture`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Profile upload failed");

      const imageUrl =
        data?.imageUrl ||
        data?.data?.imageUrl ||
        data?.user?.profilePicture ||
        data?.data?.user?.profilePicture ||
        data?.profilePicture;

      if (!imageUrl) throw new Error("Upload succeeded but no image URL returned");

      setProfilePreview(imageUrl);
      login(token, { ...user, profilePicture: imageUrl });
    } catch (err) {
      alert(err?.message || "Failed to upload profile picture");
    } finally {
      setProfileUploading(false);
    }
  };

  useEffect(() => {
    if (fundStep === "success") {
      const timer = setTimeout(() => {
        setFundAmount("");
        setFundReference(null);
        setShowFundModal(false);
        setFundStep("form");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [fundStep]);

  useEffect(() => {
    if (withdrawStep === "success") {
      const timer = setTimeout(() => {
        setWithdrawData({
          amount: "",
          accountNumber: "",
          bankCode: "",
          pin: "",
        });
        setSelectedBank("");
        setShowWithdrawModal(false);
        setWithdrawStep("form");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [withdrawStep]);

  const formatUploadedTime = (dateString) => {
    if (!dateString) return "";

    const t = new Date(dateString).getTime();
    if (Number.isNaN(t)) return "";

    const diffMs = Date.now() - t;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 30) return "Uploaded just now";
    if (diffSec < 60) return `Uploaded ${diffSec}s ago`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Uploaded ${diffMin} min${diffMin > 1 ? "s" : ""} ago`;

    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `Uploaded ${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;

    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `Uploaded ${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

    return `Uploaded ${new Date(t).toLocaleDateString()}`;
  };

  const [bookingHistory, setBookingHistory] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const ORDER_HISTORY_ENDPOINT =
    "https://dev-order-api.fixserv.co/api/orders/client-history";

  const formatNaira = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return value ?? "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // const normalizePaymentStatus = (escrowStatus) => {
  //   const value = String(escrowStatus || "").toUpperCase().trim();

  //   if (value === "PAID") return "Paid";
  //   if (value === "NOT_PAID" || value === "UNPAID") return "Unpaid";
  //   if (value.includes("CANCEL")) return "Cancelled";
  //   return "Pending";
  // };

  const normalizePaymentStatus = (item) => {
    const orderStatus = String(
      item?.status ||
      item?.orderStatus ||
      item?.repairStatus ||
      ""
    ).toUpperCase().trim();

    const escrowStatus = String(
      item?.escrowStatus ||
      item?.escrow?.status ||
      item?.payment?.escrowStatus ||
      ""
    ).toUpperCase().trim();

    const paymentStatus = String(
      item?.paymentStatus ||
      item?.payment?.status ||
      item?.releasePaymentStatus ||
      ""
    ).toUpperCase().trim();

    const releaseFlag =
      item?.paymentReleased === true ||
      item?.isPaymentReleased === true ||
      item?.released === true ||
      item?.isReleased === true ||
      item?.payment?.released === true ||
      item?.payment?.isReleased === true;

    const isDone = [
      "WORK_COMPLETED",
      "READY_FOR_PICKUP",
      "COMPLETED",
      "DONE",
    ].includes(orderStatus);

    const isCancelledOrRejected = [
      "CANCELLED",
      "REJECTED",
    ].includes(orderStatus);

    const isNotCompletedYet = [
      "PENDING_ARTISAN_RESPONSE",
      "PENDING",
      "REQUESTED",
      "NEW",
      "ACCEPTED",
      "DEVICE_DROPPED_OFF",
      "IN_PROGRESS",
      "ONGOING",
      "AVAILABLE",
    ].includes(orderStatus);

    const isReleased =
      releaseFlag ||
      [
        "PAID",
        "SUCCESS",
        "SUCCESSFUL",
        "RELEASED",
        "COMPLETED",
        "DONE",
        "PAID_OUT",
        "SETTLED",
      ].includes(escrowStatus) ||
      [
        "PAID",
        "SUCCESS",
        "SUCCESSFUL",
        "RELEASED",
        "COMPLETED",
        "DONE",
        "PAID_OUT",
        "SETTLED",
      ].includes(paymentStatus);

    if (isCancelledOrRejected) return "Unpaid";
    if (isNotCompletedYet) return "Unpaid";
    if (isDone && isReleased) return "Successful";
    if (isDone && !isReleased) return "Pending";

    return "Unpaid";
  };

  const normalizeProgress = (status) => {
    const value = String(status || "").toUpperCase().trim();

    if (["PENDING_ARTISAN_RESPONSE", "PENDING", "REQUESTED", "NEW"].includes(value)) {
      return "Pending Artisan Response";
    }
    if (["ACCEPTED", "DEVICE_DROPPED_OFF"].includes(value)) {
      return "Accepted";
    }
    if (["IN_PROGRESS", "ONGOING", "AVAILABLE"].includes(value)) {
      return "In Progress";
    }
    if (["WORK_COMPLETED", "READY_FOR_PICKUP"].includes(value)) {
      return "Work Completed";
    }
    if (["COMPLETED", "DONE"].includes(value)) {
      return "Completed";
    }
    if (["CANCELLED", "REJECTED"].includes(value)) {
      return "Cancelled";
    }

    return value.replace(/_/g, " ") || "Not Started";
  };

  const getArtisanPayload = (payload) => {
    return payload?.data || payload?.user || payload || {};
  };

  const normalizeArtisan = (artisan) => {
    const raw = getArtisanPayload(artisan);

    return {
      id: raw?.id || raw?._id || "—",
      fullName: raw?.fullName || raw?.name || "Unknown Technician",
      profilePicture: raw?.profilePicture || raw?.avatar || "",
      category:
        raw?.businessName ||
        raw?.categories?.[0] ||
        raw?.category ||
        "Repair Technician",
      rating: raw?.rating ?? 0,
      reviewsCount:
        raw?.reviewsCount ??
        raw?.totalReviews ??
        raw?.reviewCount ??
        0,
      experience:
        raw?.experience ||
        raw?.yearsOfExperience ||
        raw?.experienceLevel ||
        "—",
      location:
        raw?.location ||
        raw?.address ||
        raw?.city ||
        "—",
      skills: Array.isArray(raw?.skillSet)
        ? raw.skillSet
        : Array.isArray(raw?.skills)
          ? raw.skills
          : [],
    };
  };

  const getUploadedProduct = (item) => {
    if (Array.isArray(item?.uploadedProducts) && item.uploadedProducts.length > 0) {
      return item.uploadedProducts[0];
    }

    if (item?.uploadedProduct && typeof item.uploadedProduct === "object") {
      return item.uploadedProduct;
    }

    return null;
  };

  const pickDevice = (item, uploadedProduct) => {
    return (
      item?.serviceRequired ||
      item?.service?.title ||
      item?.serviceTitle ||
      uploadedProduct?.objectName ||
      [item?.deviceType, item?.deviceBrand, item?.deviceModel]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      item?.deviceType ||
      item?.deviceBrand ||
      item?.deviceModel ||
      "—"
    );
  };

  const pickTechName = (item, artisan) => {
    return (
      artisan?.fullName ||
      artisan?.name ||
      artisan?.businessName ||
      item?.artisan?.fullName ||
      item?.artisan?.name ||
      item?.assignedArtisan?.fullName ||
      item?.assignedArtisan?.name ||
      item?.artisanDetails?.fullName ||
      item?.artisanDetails?.name ||
      item?.technician?.fullName ||
      item?.technician?.name ||
      item?.artisanName ||
      item?.technicianName ||
      item?.assignedArtisanName ||
      "Unknown Technician"
    );
  };

  const normalizeBookingRow = (item) => {
    const artisan = item?.artisan || {};
    const uploadedProduct = getUploadedProduct(item);

    return {
      id: item?.id || "—",
      device: pickDevice(item, uploadedProduct),
      tech: pickTechName(item, artisan),
      status: normalizePaymentStatus(item),
      cost: formatNaira(item?.price || 0),
      progress: normalizeProgress(item?.status),
      createdAt: item?.createdAt || "",
    };
  };

  useEffect(() => {
    let alive = true;

    const fetchBookingHistory = async () => {
      try {
        setBookingLoading(true);
        setBookingError("");

        const t = localStorage.getItem("fixserv_token");
        if (!t) {
          setBookingError("Unauthorized: Please login again.");
          return;
        }

        const res = await fetch(ORDER_HISTORY_ENDPOINT, {
          headers: { Authorization: `Bearer ${t}` },
        });

        const payload = await res.json();

        if (!res.ok) {
          const msg = payload?.message || payload?.error || "Failed to load booking history";
          throw new Error(msg);
        }

        const orders = Array.isArray(payload?.orders) ? payload.orders : [];

        const badArtisanIds = JSON.parse(
          sessionStorage.getItem("fixserv_bad_artisan_ids") || "[]"
        );
        const badArtisanIdSet = new Set(badArtisanIds);

        const hasEmbeddedArtisanName = (item) => {
          return Boolean(
            item?.artisan?.fullName ||
            item?.artisan?.name ||
            item?.assignedArtisan?.fullName ||
            item?.assignedArtisan?.name ||
            item?.artisanDetails?.fullName ||
            item?.artisanDetails?.name ||
            item?.technician?.fullName ||
            item?.technician?.name ||
            item?.artisanName ||
            item?.technicianName ||
            item?.assignedArtisanName
          );
        };

        const uniqueArtisanIds = [
  ...new Set(
    orders
      .filter((item) => !hasEmbeddedArtisanName(item))
      .map((item) => item?.artisanId)
      .filter((id) => id && !badArtisanIdSet.has(id))
  ),
];

        const artisanResults = await Promise.all(
          uniqueArtisanIds.map(async (id) => {
            const response = await getArtisanById(id);

            if (!response) {
              badArtisanIdSet.add(id);
              sessionStorage.setItem(
  "fixserv_bad_artisan_ids",
  JSON.stringify([...badArtisanIdSet])
);
              return [id, null];
            }

            return [id, normalizeArtisan(response)];
          })
        );

        const artisanMap = Object.fromEntries(artisanResults);

const normalized = orders.map((item) =>
  normalizeBookingRow({
    ...item,
    artisan: artisanMap[item.artisanId] ?? item?.artisan ?? null,
  })
);

        const sorted = normalized.sort((a, b) => {
          const ta = new Date(a.createdAt).getTime();
          const tb = new Date(b.createdAt).getTime();

          if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
          if (Number.isNaN(ta)) return 1;
          if (Number.isNaN(tb)) return -1;

          return tb - ta;
        });

        if (!alive) return;
        setBookingHistory(sorted);
      } catch (e) {
        if (!alive) return;
        setBookingError(e?.message || "Failed to load booking history");
      } finally {
        if (alive) setBookingLoading(false);
      }
    };

    fetchBookingHistory();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    console.log("USER PROFILE DEBUG =>", {
      rawUser: user,
      profileUser,
      servicePreferences: profileUser?.servicePreferences,

      userId,
      walletIdentifier,
      hasToken: !!token,
    });

    console.log("BOOKING HISTORY SAMPLE =>", bookingHistory[0]);
  }, [user, profileUser, userId, walletIdentifier, token, bookingHistory]);

  return (
    <div className="w-full">
      <section className="w-full py-8 sm:py-10 lg:py-14 mt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#3e83c4] mb-6 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* PROFILE INFO — FULL WIDTH */}
          <div className="w-full rounded-2xl bg-white p-5 sm:p-6 mb-8 shadow-sm">
          {/* <div className="w-full rounded-2xl bg-white p-5 sm:p-6 mb-8 shadow-sm border border-gray-100"> */}
            <div className="flex flex-col lg:flex-row gap-10 items-start w-full">

              {/* PROFILE IMAGE */}
              <div className="relative w-full sm:w-[260px] h-[260px] shrink-0 group">
                <img
                  src={profilePreview || profileUser?.profilePicture || PraiseImg}
                  alt="profile"
                  className="w-full h-full rounded-2xl object-cover"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-medium rounded-2xl">
                  Change Photo
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const previewUrl = URL.createObjectURL(file);
                    setProfilePreview(previewUrl);
                    handleProfileUpload(file);
                    setTimeout(() => URL.revokeObjectURL(previewUrl), 5000);
                  }}
                />

                {profileUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm rounded-2xl">
                    Uploading...
                  </div>
                )}
              </div>

              {/* PROFILE INFO */}
              {/* <div className="space-y-4 w-full min-w-0"> */}
                <div className="space-y-4 w-full min-w-0 flex flex-col justify-end h-[260px]">

                {/* NAME */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight">
                  {profileUser?.fullName || "—"}
                </h2>

                {/* ADDRESS */}
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <img
                    src={locationBlack}
                    alt=""
                    className="w-4 h-4 mt-0.5 shrink-0 opacity-70"
                  />
                  <span className="break-words">
                    {[
                      profileUser?.deliveryAddress?.street,
                      profileUser?.deliveryAddress?.city,
                      profileUser?.deliveryAddress?.state,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No address added"}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">

                  <button
                    onClick={() => navigate("/client/settings")}
                    className="flex items-center justify-center gap-2 bg-[#3E83C4] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md hover:bg-[#3572ad] transition w-full sm:w-auto cursor-pointer"
                  >
                    Edit Profile
                    <img src={edit} alt="" className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate("/client/referral")}
                    className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition w-full sm:w-auto cursor-pointer"
                  >
                    Refer & Earn
                  </button>

                </div>
              </div>
            </div>
          </div>

          {/* CONTACT INFO + WALLET */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* CONTACT INFO */}
            <div className="border border-[#3E83C4] rounded-xl p-5 sm:p-6 bg-[#F6FBFF]">
              <h3 className="font-semibold text-black text-lg sm:text-xl mb-4">
                Contact Info
              </h3>

              <div className="bg-white rounded-lg shadow-lg p-4 space-y-4 text-gray-600">
                <div className="flex items-start gap-2">
                  <img src={email} alt="" className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-sm break-words">
                    {profileUser?.email || "—"}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <img
                    src={locationBlue}
                    alt=""
                    className="w-4 h-4 mt-0.5 shrink-0"
                  />
                  <span className="text-sm break-words">{addressText}</span>
                </div>

                <div className="flex items-start gap-2">
                  <img src={phone} alt="" className="w-5 h-5 mt-0.5 shrink-0" />
                  <span className="text-sm break-words">
                    {profileUser?.phoneNumber || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* WALLET */}
            <div className="bg-[#F6FBFF] border border-[#3e83c4] rounded-xl p-5 w-full">
              <div className="flex items-center gap-2 mb-4">
                <img src={walletIcon} alt="" className="w-6 h-6" />
                <h3 className="font-semibold text-lg text-black">Wallet</h3>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 space-y-3 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#535353]">Available Balance</span>
                    <span className="font-medium text-black text-right break-words">
                      ₦{Number(wallet?.available ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#535353]">Locked Balance</span>
                    <span className="font-medium text-black text-right break-words">
                      ₦{Number(wallet?.totalLocked ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#535353]">Manual Lock</span>
                    <span className="font-medium text-black text-right break-words">
                      ₦{Number(wallet?.manuallyLocked ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#535353]">Order Escrow</span>
                    <span className="font-medium text-black text-right break-words">
                      ₦{Number(wallet?.orderEscrow ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#535353] flex items-center gap-1">
                    <img src={coin} alt="" className="w-4 h-4" />
                    Fixpoints
                  </span>

                  <div className="text-right">
                    <p className="font-medium text-black">
                      {Number(fixpoints ?? 0).toLocaleString()} pts
                    </p>
                    <p className="text-xs text-[#535353]">
                      ₦{(fixpoints * 2).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setWithdrawData({
                        amount: "",
                        accountNumber: "",
                        bankCode: "",
                        pin: "",
                      });
                      setSelectedBank("");
                      setWithdrawStep("form");
                      setShowWithdrawModal(true);
                    }}
                    className="flex-1 border border-[#43A047] text-[#43A047] py-2.5 rounded-md text-sm font-medium hover:bg-[#43A047] hover:text-white transition cursor-pointer"
                  >
                    Withdraw
                  </button>

                  <button
                    onClick={() => {
                      setFundAmount("");
                      setFundReference(null);
                      setFundStep("form");
                      setShowFundModal(true);
                    }}
                    className="flex-1 bg-[#43A047] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#418f45] transition cursor-pointer"
                  >
                    Fund
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ITEMS UPLOADED / REQUESTS — FULL WIDTH */}
          <div className="border border-[#5F8EBA] rounded-xl p-4 sm:p-6 bg-white mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <img src={item} alt="item" className="w-9 h-8" />
                <h3 className="font-semibold text-base sm:text-lg text-black">
                  Items Uploaded
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/client/request-repair")}
                  className="border border-[#3E83C4] text-[#3E83C4] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#3E83C4] hover:text-white transition cursor-pointer"
                >
                  + Upload Item
                </button>

                 <button
                    onClick={() => navigate("/client/repair")}
                    className="bg-[#3E83C4] text-white px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-[#2f6ea8] transition"
                  >
                  View All Request
                </button>
              </div>
            </div>

{/* Desktop table */}
<div className="overflow-x-auto hidden md:block">
  <div className="max-h-[400px] overflow-y-auto">
    <table className="w-full text-sm lg:text-base border-separate border-spacing-0">
      <thead>
        <tr className="text-[#656565] text-left">
          <th className="py-3 px-4 font-medium bg-[#ECF0F5] sticky top-0 z-20">
            Booking ID
          </th>
          <th className="py-3 px-4 font-medium bg-[#ECF0F5] sticky top-0 z-20">
            Device
          </th>
          <th className="py-3 px-4 font-medium bg-[#ECF0F5] sticky top-0 z-20">
            Technician
          </th>
          <th className="py-3 px-4 font-medium bg-[#ECF0F5] sticky top-0 z-20">
            Payment Status
          </th>
          <th className="py-3 px-4 font-medium bg-[#ECF0F5] sticky top-0 z-20">
            Cost
          </th>
          <th className="py-3 px-4 font-medium bg-[#ECF0F5] sticky top-0 z-20">
            Progress
          </th>
        </tr>
      </thead>

      <tbody className="text-[#535353] text-sm lg:text-base">
        {bookingLoading ? (
          <tr>
            <td className="py-5 px-4 text-sm text-gray-500" colSpan={6}>
              Loading requests...
            </td>
          </tr>
        ) : bookingError ? (
          <tr>
            <td className="py-5 px-4 text-sm text-red-600" colSpan={6}>
              {bookingError}
            </td>
          </tr>
        ) : bookingHistory.length === 0 ? (
          <tr>
            <td className="py-5 px-4 text-sm text-gray-500" colSpan={6}>
              No request found.
            </td>
          </tr>
        ) : (
          bookingHistory.slice(0, 10).map((row, i) => {
            const color =
              row.status === "Successful"
                ? "bg-[#C9E8CA] text-[#43A047]"
                : row.status === "Pending"
                ? "bg-[#FFF0D9] text-[#F99F10]"
                : "bg-red-100 text-red-600";

            return (
              <tr key={`${row.id}-${i}`}>
                <td className="py-4 px-4 break-words">{row.id}</td>
                <td className="py-4 px-4 break-words">{row.device}</td>
                <td className="py-4 px-4 break-words">{row.tech}</td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 w-fit ${color}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {row.status}
                  </span>
                </td>

                <td className="py-4 px-4 font-semibold break-words">
                  {row.cost}
                </td>

                <td className="py-4 px-4 break-words">
                  {row.progress}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>

{/* Mobile cards */}
<div className="md:hidden space-y-4 max-h-[400px] overflow-y-auto pr-1">
  {bookingLoading ? (
    <p className="text-sm text-gray-500">Loading requests...</p>
  ) : bookingError ? (
    <p className="text-sm text-red-600">{bookingError}</p>
  ) : bookingHistory.length === 0 ? (
    <p className="text-sm text-gray-500">No request found.</p>
  ) : (
    bookingHistory.slice(0, 10).map((row, i) => {
      const color =
        row.status === "Successful"
          ? "bg-[#C9E8CA] text-[#43A047]"
          : row.status === "Pending"
          ? "bg-[#FFF0D9] text-[#F99F10]"
          : "bg-red-100 text-red-600";

      return (
        <div
          key={`${row.id}-${i}`}
          className="border border-[#D9E7F5] rounded-xl p-4 bg-[#FAFCFF] space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-[#656565]">Booking ID</p>
              <p className="font-medium text-black break-words">
                {row.id}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 w-fit shrink-0 ${color}`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {row.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-[#656565]">Device</p>
            <p className="text-sm text-black break-words">
              {row.device}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#656565]">Technician</p>
            <p className="text-sm text-black break-words">
              {row.tech}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-[#656565]">Cost</p>
              <p className="text-sm font-semibold text-black break-words">
                {row.cost}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#656565]">Progress</p>
              <p className="text-sm text-black break-words">
                {row.progress}
              </p>
            </div>
          </div>
        </div>
      );
    })
  )}
</div>

          {showFundModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
          )}

          {showFundModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
              <div className="bg-white w-full max-w-[380px] rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] overflow-y-auto">
                {fundStep === "form" && (
                  <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={fund} alt="fund" className="w-8 h-8 shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-black">
                            Fund Wallet
                          </h3>
                          <p className="text-xs text-[#535353] mt-0.5">
                            Add money to your wallet securely
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowFundModal(false)}
                        className="text-[#535353] hover:text-gray-600 transition cursor-pointer shrink-0"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#535353]">
                      <span className="flex items-center gap-2 text-[#3E83C4]">
                        <span className="w-2 h-2 bg-[#3E83C4] rounded-full"></span>
                        Amount
                      </span>
                      <span>Verify</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-[#535353]">Enter Amount</label>
                      <input
                        type="number"
                        min="1"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        placeholder="₦ 0"
                        className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3E83C4]"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {["₦1,000", "₦2,500", "₦5,000", "₦10,000"].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setFundAmount(amt.replace(/[₦,]/g, ""))}
                          className="bg-[#EEF6FF] text-[#3E83C4] py-2 rounded-md hover:bg-[#E2EFFF] transition"
                        >
                          {amt}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 bg-[#EEF7FF] border border-[#CFE3F8] p-3 rounded-md text-xs text-gray-600">
                      <img src={secure} alt="secure" className="w-8 h-8 shrink-0" />
                      <p>
                        <span className="font-medium text-black">Secure Payment</span>
                        <br />
                        Your payment will be processed securely through our payment
                        gateway.
                      </p>
                    </div>

                    <button
                      onClick={handleFundWallet}
                      disabled={loading || !fundAmount}
                      className={`w-full py-2.5 rounded-md text-sm font-medium transition ${loading || !fundAmount
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#3E83C4] hover:bg-[#2D75B8] text-white cursor-pointer"
                        }`}
                    >
                      {loading ? "Processing..." : "Continue"}
                    </button>

                    <button
                      onClick={() => {
                        setShowFundModal(false);
                        setFundStep("form");
                        setFundAmount("");
                        setFundReference(null);
                      }}
                      className="w-full text-sm text-[#3E83C4] hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {fundStep === "processing" && (
                  <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <button
                        onClick={() => setFundStep("form")}
                        className="text-sm text-[#3E83C4] flex items-center gap-1"
                      >
                        ← Back
                      </button>

                      <button
                        onClick={() => setShowFundModal(false)}
                        className="text-[#535353] hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={shieldBlue}
                        className="w-10 h-10 shrink-0"
                        alt=""
                      />
                      <div>
                        <h3 className="font-semibold text-base text-black">
                          Payment Verification
                        </h3>
                        <p className="text-xs text-[#535353] leading-relaxed mt-0.5">
                          If you completed payment in the Paystack page, you can verify
                          here (fallback).
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#EEF7FF] rounded-md p-4 text-sm flex justify-between gap-4">
                      <span className="text-[#535353]">Transaction Amount</span>
                      <span className="font-semibold text-black text-right">
                        ₦{Number(fundAmount || 0).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={verifyFundWallet}
                      disabled={loading}
                      className={`w-full py-2.5 rounded-md text-sm font-medium transition ${loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#3E83C4] hover:bg-[#2D75B8] text-white"
                        }`}
                    >
                      {loading ? "Verifying..." : "Complete Payment"}
                    </button>

                    <button
                      onClick={() => setShowFundModal(false)}
                      className="w-full text-sm text-[#3E83C4] hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {fundStep === "success" && (
                  <div className="p-8 text-center space-y-4">
                    <img src={success} className="w-14 mx-auto" alt="" />
                    <h3 className="font-semibold text-black">Payment Successful</h3>
                    <p className="text-sm text-[#535353]">
                      Your wallet has been successfully funded.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {showWithdrawModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
          )}

          {showWithdrawModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
              <div className="bg-white w-full max-w-[380px] rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] overflow-y-auto">
                {withdrawStep === "form" && (
                  <div className="p-6 space-y-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={icon} className="w-8 shrink-0" alt="" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-black">
                            Withdraw Funds
                          </h3>
                          <p className="text-xs text-[#535353] leading-tight">
                            Withdraw money securely
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowWithdrawModal(false)}
                        className="text-[#535353] hover:text-black transition cursor-pointer shrink-0"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#535353]">
                      <div className="flex items-center gap-2 text-[#3E83C4]">
                        <span className="w-2 h-2 bg-[#3E83C4] rounded-full" />
                        <span>Account Details</span>
                      </div>
                      <span>Withdraw</span>
                    </div>

                    <div className="flex items-center justify-between bg-[#EEF7FF] border border-[#CFE3F8] rounded-lg px-4 py-3 text-sm gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={current} className="w-8 shrink-0" alt="" />
                        <span className="text-[#535353]">Current Balance</span>
                      </div>
                      <span className="font-semibold text-black text-right">
                        ₦{Number(wallet.available || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-[#535353] flex items-center gap-2 mb-1">
                          <img src={bank} className="w-8" alt="" />
                          Bank
                        </label>

                        <select
                          value={selectedBank}
                          onChange={(e) => {
                            setSelectedBank(e.target.value);
                            setWithdrawData({
                              ...withdrawData,
                              bankCode: e.target.value,
                            });
                          }}
                          className="w-full border border-[#87AACB] rounded-md px-3 py-2 text-sm outline-none cursor-pointer"
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
                        <label className="text-sm text-[#535353] flex items-center gap-2 mb-1">
                          <img src={card} className="w-8" alt="" />
                          Account Number
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          value={withdrawData.accountNumber}
                          onChange={(e) =>
                            setWithdrawData({
                              ...withdrawData,
                              accountNumber: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          placeholder="Enter Account Number"
                          className="w-full border border-[#87AACB] rounded-md px-3 py-2 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!withdrawData.bankCode)
                          return alert("Please select a bank");
                        if (!withdrawData.accountNumber)
                          return alert("Please enter account number");
                        setWithdrawStep("amount");
                      }}
                      className="w-full bg-[#3E83C4] hover:bg-[#2D75B8] text-white py-2.5 rounded-md text-sm font-medium transition cursor-pointer"
                    >
                      Verify & Continue
                    </button>

                    <button
                      onClick={() => setShowWithdrawModal(false)}
                      className="w-full text-sm text-[#3E83C4] hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {withdrawStep === "amount" && (
                  <div className="px-6 pt-5 pb-7">
                    <div className="flex items-center justify-between mb-6 gap-4">
                      <button
                        onClick={() => setWithdrawStep("form")}
                        className="flex items-center gap-1 text-sm text-[#3E83C4] hover:underline cursor-pointer"
                      >
                        ← Back
                      </button>

                      <button
                        onClick={() => setShowWithdrawModal(false)}
                        className="text-[#535353] hover:text-black transition cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <img src={icon} className="w-8 h-8 shrink-0" alt="" />
                      <div>
                        <h3 className="text-sm font-semibold text-black leading-tight">
                          Enter Amount
                        </h3>
                        <p className="text-xs text-[#535353] leading-tight">
                          Withdraw money securely
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm text-[#535353] mb-1">
                        Enter Amount
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={withdrawData.amount}
                        onChange={(e) =>
                          setWithdrawData({
                            ...withdrawData,
                            amount: e.target.value,
                          })
                        }
                        placeholder="₦ 0"
                        className="w-full border border-[#87AACB] rounded-md px-3 py-2 text-sm outline-none"
                      />

                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={withdrawData.pin}
                        onChange={(e) =>
                          setWithdrawData({
                            ...withdrawData,
                            pin: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        placeholder="Enter Transaction PIN"
                        className="w-full border border-[#87AACB] rounded-md px-3 py-2 text-sm outline-none mt-3"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10 text-xs">
                      {["₦1,000", "₦2,500", "₦5,000", "₦10,000"].map((amt) => (
                        <button
                          key={amt}
                          onClick={() =>
                            setWithdrawData({
                              ...withdrawData,
                              amount: amt.replace(/[₦,]/g, ""),
                            })
                          }
                          className="bg-[#EEF6FF] text-[#3E83C4] py-2 rounded-md hover:bg-[#E2EFFF] transition cursor-pointer"
                        >
                          {amt}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-center mb-3">
                      <button
                        onClick={handleWithdraw}
                        disabled={loading}
                        className={`w-full sm:w-56 py-2.5 rounded-md text-sm font-medium transition ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#3E83C4] hover:bg-[#2D75B8] text-white"
                          }`}
                      >
                        {loading ? "Processing..." : "Withdraw"}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={() => setShowWithdrawModal(false)}
                        className="text-sm text-[#3E83C4] hover:underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {withdrawStep === "success" && (
                  <div className="p-8 text-center space-y-4">
                    <img src={success} className="w-14 mx-auto" alt="" />
                    <h3 className="font-semibold text-black">Withdraw Successful</h3>
                    <p className="text-sm text-[#535353]">
                      Your funds have been successfully transferred to your bank
                      account.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-10 flex">
               <button
                 onClick={logout}
                 className="flex items-center gap-2 bg-[#ED3528] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition cursor-pointer"
               >
                 <img src={logOut} alt="logout" className="w-4 h-4" />
                 Log Out
               </button>
             </div>
        </div>
        
      </section>

      {/* <section className="w-full py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="border border-[#5F8EBA] rounded-xl p-4 sm:p-6 bg-white">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <img src={item} alt="item" className="w-9 h-8" />
                <h3 className="font-semibold text-base sm:text-lg text-black">
                  Booking History
                </h3>
              </div>

              <button
                onClick={() => navigate("/client/repair")}
                className="text-[#3E83C4] text-sm sm:text-base lg:text-lg hover:underline cursor-pointer text-left sm:text-right"
              >
                View All History
              </button>
            </div>

            
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-sm lg:text-base">
                <thead>
                  <tr className="bg-[#ECF0F5] text-[#656565] text-left rounded-lg">
                    <th className="py-3 px-4 font-medium">Booking ID</th>
                    <th className="py-3 px-4 font-medium">Device</th>
                    <th className="py-3 px-4 font-medium">Technician</th>
                    <th className="py-3 px-4 font-medium">Payment Status</th>
                    <th className="py-3 px-4 font-medium">Cost</th>
                    <th className="py-3 px-4 font-medium">Progress</th>
                  </tr>
                </thead>

                <tbody className="text-[#535353] text-sm lg:text-base">
                  {bookingLoading ? (
                    <tr>
                      <td className="py-5 px-4 text-sm text-gray-500" colSpan={6}>
                        Loading booking history...
                      </td>
                    </tr>
                  ) : bookingError ? (
                    <tr>
                      <td className="py-5 px-4 text-sm text-red-600" colSpan={6}>
                        {bookingError}
                      </td>
                    </tr>
                  ) : bookingHistory.length === 0 ? (
                    <tr>
                      <td className="py-5 px-4 text-sm text-gray-500" colSpan={6}>
                        No booking history found.
                      </td>
                    </tr>
                  ) : (
                    bookingHistory.slice(0, 5).map((row, i) => {
                      const color =
                        row.status === "Successful"
                          ? "bg-[#C9E8CA] text-[#43A047]"
                          : row.status === "Pending"
                            ? "bg-[#FFF0D9] text-[#F99F10]"
                            : "bg-red-100 text-red-600";

                      return (
                        <tr key={`${row.id}-${i}`}>
                          <td className="py-4 px-4 break-words">{row.id}</td>
                          <td className="py-4 px-4 break-words">{row.device}</td>
                          <td className="py-4 px-4 break-words">{row.tech}</td>

                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 w-fit ${color}`}
                            >
                              <span className="w-2 h-2 rounded-full bg-current" />
                              {row.status}
                            </span>
                          </td>

                          <td className="py-4 px-4 font-semibold break-words">
                            {row.cost}
                          </td>
                          <td className="py-4 px-4 break-words">{row.progress}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
         

           
            <div className="md:hidden space-y-4">
              {bookingLoading ? (
                <p className="text-sm text-gray-500">Loading booking history...</p>
              ) : bookingError ? (
                <p className="text-sm text-red-600">{bookingError}</p>
              ) : bookingHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No booking history found.</p>
              ) : (
                bookingHistory.slice(0, 5).map((row, i) => {
                  const color =
                    row.status === "Successful"
                      ? "bg-[#C9E8CA] text-[#43A047]"
                      : row.status === "Pending"
                        ? "bg-[#FFF0D9] text-[#F99F10]"
                        : "bg-red-100 text-red-600";

                  return (
                    <div
                      key={`${row.id}-${i}`}
                      className="border border-[#D9E7F5] rounded-xl p-4 bg-[#FAFCFF] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs text-[#656565]">Booking ID</p>
                          <p className="font-medium text-black break-words">{row.id}</p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 w-fit shrink-0 ${color}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current" />
                          {row.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-[#656565]">Device</p>
                        <p className="text-sm text-black break-words">{row.device}</p>
                      </div>

                      <div>
                        <p className="text-xs text-[#656565]">Technician</p>
                        <p className="text-sm text-black break-words">{row.tech}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-[#656565]">Cost</p>
                          <p className="text-sm font-semibold text-black break-words">
                            {row.cost}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[#656565]">Progress</p>
                          <p className="text-sm text-black break-words">
                            {row.progress}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
                          
        </div>
        
      </section> */}
    </div>
  );
};

export default UserProfile;