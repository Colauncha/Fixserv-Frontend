import React, { useEffect, useState } from "react";
import total from "../../assets/Artisan Images/total.png";
import totaljobs from "../../assets/Artisan Images/totaljobs.png";
import ongoing from "../../assets/Artisan Images/ongoing.png";
import completed from "../../assets/Artisan Images/completed.png";
import uncompleted from "../../assets/Artisan Images/uncompleted.png";
import scalearrow from "../../assets/Artisan Images/scalearrows.png";

import WelcomeBonus from "../Client-Screens/WelcomeBonus";

import coinIcon from "../../assets/Artisan Images/Fixcoin.png";

import ReferEarn from "../Client-Screens/ReferEarn";
import { useAuth } from "../../context/AuthContext";
import { getWalletBalance } from "../../api/wallet.api";
import { getArtisanHistory } from "../../api/order.api";
import { useNavigate } from "react-router-dom";
import ArtisanHeader from "../Artisan Pages/ArtisanHeader";

import locationBlack from "../../assets/client images/client-home/location black.png";

import star from "../../assets/Artisan Images/star.png";
import badge from "../../assets/Artisan Images/badge.png";

const normalizeStatus = (status) => {
  const value = String(status || "").toUpperCase();

  if (["REQUESTED", "NEW", "PENDING_ARTISAN_RESPONSE"].includes(value)) {
    return "REQUESTED";
  }

  if (["IN_PROGRESS", "STARTED", "ONGOING"].includes(value)) {
    return "ONGOING";
  }

  if (["ACCEPTED", "PENDING", "WAITING"].includes(value)) {
    return "PENDING";
  }

  if (
    [
      "DONE",
      "COMPLETED",
      "FINISHED",
      "COMPLETE",
      "WORK_COMPLETED",
      "COMPLETED_WORK",
    ].includes(value)
  ) {
    return "COMPLETED";
  }

  if (["REJECTED", "DECLINED", "CANCELLED", "EXPIRED"].includes(value)) {
    return "OTHER";
  }

  return "OTHER";
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [walletInfo, setWalletInfo] = useState({
    balance: 0,
    lockedBalance: 0,
  });

  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    ongoingJobs: 0,
    pendingJobs: 0,
    requestedJobs: 0,
    otherJobs: 0,
  });

  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const [fixpoints, setFixpoints] = useState(0);
  const [showReferEarn, setShowReferEarn] = useState(false);

  useEffect(() => {
  if (!user) return;

  const run = async () => {
    try {
      const userId = user?.id || user?._id;

      const walletIdentifier =
        user?.wallet?.id ||
        user?.wallet?._id ||
        user?.walletId ||
        userId;

      if (walletIdentifier) {
        const w = await getWalletBalance(walletIdentifier);
        const payload = w?.data;

        if (payload?.success) {
          setWalletInfo({
            balance: Number(payload?.data?.balance || 0),
            lockedBalance: Number(payload?.data?.lockedBalance || 0),
          });
        }
      }

      if (userId) {
        const token = localStorage.getItem("fixserv_token");

        const res = await fetch(
          `https://wallet-api.fixserv.co/api/wallet/fixpoints/balance/${userId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const data = await res.json();

        if (data?.success) {
          setFixpoints(Number(data?.data?.points || 0));
        }
      }

      const historyResponse = await getArtisanHistory();
      const jobs = Array.isArray(historyResponse)
        ? historyResponse
        : Array.isArray(historyResponse?.orders)
        ? historyResponse.orders
        : [];

      const stats = {
        totalJobs: jobs.length,
        completedJobs: 0,
        ongoingJobs: 0,
        pendingJobs: 0,
        requestedJobs: 0,
        otherJobs: 0,
      };

      jobs.forEach((job) => {
        const normalized = normalizeStatus(job?.status);

        if (normalized === "COMPLETED") stats.completedJobs += 1;
        if (normalized === "ONGOING") stats.ongoingJobs += 1;
        if (normalized === "PENDING") stats.pendingJobs += 1;
        if (normalized === "REQUESTED") stats.requestedJobs += 1;
        if (normalized === "OTHER") stats.otherJobs += 1;
      });

      setJobStats(stats);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
    }
  };

  run();
}, [user]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <ArtisanHeader title="Dashboard" />

       <div className="mt-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">

    {/* Total Amount */}
    <div className="bg-[#7FAEFA] text-white rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-base sm:text-lg lg:text-xl opacity-90">
          Total Amount
        </p>
        <img src={total} alt="total" className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold break-words">
        NGN {(walletInfo.balance || 0).toLocaleString("en-NG")}
      </h2>

      <p className="text-sm opacity-90 mt-1">
        Locked: NGN {(walletInfo.lockedBalance || 0).toLocaleString("en-NG")}
      </p>

      <div className="flex items-center gap-1 mt-3 text-sm">
        {/* <img src={scalearrow} alt="" className="w-4" /> */}
        {/* <span>+15% this week</span> */}
      </div>
    </div>

    {/* FixPoints */}
    <div className="bg-[#faf0e0] text-black rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-base sm:text-lg lg:text-xl opacity-90">
          FixPoints
        </p>
        <img src={coinIcon} alt="fixpoints" className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold">
        {fixpoints}
      </h2>

      <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
        <span>Earn points by completing jobs & referrals</span>
      </div>
    </div>

    {/* Total Jobs */}
    <div className="bg-[#BFD4EA] text-black rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">
          Total Jobs
        </p>
        <img src={totaljobs} alt="" className="w-5 h-5 sm:w-10.5 sm:h-9" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold">
        {jobStats.totalJobs}
      </h2>

      <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
        {/* <img src={scalearrow} alt="" className="w-4" /> */}
        {/* <span>+12% this week</span> */}
      </div>
    </div>

    {/* Ongoing Jobs */}
    <div className="bg-[#D9A600] text-white rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-base sm:text-lg lg:text-xl opacity-90">
          Ongoing Jobs
        </p>
        <img src={ongoing} alt="" className="w-5 h-5 sm:w-10.5 sm:h-9" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold">
        {jobStats.ongoingJobs}
      </h2>

      <div className="flex items-center gap-1 mt-3 text-sm">
        {/* <img src={scalearrow} alt="" className="w-4" /> */}
        {/* <span>+30% this week</span> */}
      </div>
    </div>

    {/* Completed Jobs */}
    <div className="bg-[#2E8B2E] text-white rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-base sm:text-lg lg:text-xl opacity-90">
          Completed Jobs
        </p>
        <img src={completed} alt="" className="w-5 h-5 sm:w-10.5 sm:h-9" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold">
        {jobStats.completedJobs}
      </h2>

      <div className="flex items-center gap-1 mt-3 text-sm">
        {/* <img src={scalearrow} alt="" className="w-4" /> */}
        {/* <span>+70% this week</span> */}
      </div>
    </div>

    {/* Other Jobs */}
    <div className="bg-[#E10600] text-white rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-base sm:text-lg lg:text-xl opacity-90">
          Other Jobs
        </p>
        <img src={uncompleted} alt="" className="w-5 h-5 sm:w-10.5 sm:h-9" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold">
        {jobStats.otherJobs}
      </h2>

      <div className="flex items-center gap-1 mt-3 text-sm">
        {/* <img src={scalearrow} alt="" className="w-4" /> */}
        {/* <span>-20% this week</span> */}
      </div>
    </div>

  </div>
</div>

      <div className="mt-10 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-blue-100 shadow-sm">
                {user?.profileImage || user?.profilePicture ? (
                  <img
                    src={user.profileImage || user.profilePicture}
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-2xl font-bold">
                    {user?.fullName?.charAt(0) || "A"}
                  </div>
                )}
              </div>

              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-2 mt-1">
                <img src={star} className="w-4" alt="star" />

                <span className="text-sm text-gray-600">
                  {user?.rating || 0} ({user?.reviewsCount || 0})
                </span>

                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full ml-2">
                  <img src={badge} className="w-3" alt="badge" />
                  Verified
                </div>
              </div>

              {user?.isVerified && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  ✔ Verified Artisan
                </p>
              )}

              <p className="text-sm text-gray-500 mt-1">
                {user?.businessName || "No business name"}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <img src={locationBlack} className="w-4 h-4" alt="location" />
                <span>{user?.location || "No location"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/artisan/profile")}
              className="px-8 py-4 rounded-lg bg-[#3E83C4] text-white text-sm font-medium hover:bg-[#106abe] transition cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="my-6 border-t border-gray-100"></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm font-medium text-gray-700 truncate">
              {user?.email || user?.emailAddress || "—"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400">Phone</p>
            <p className="text-sm font-medium text-gray-700">
              {user?.phone || user?.phoneNumber || "—"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400">Member Since</p>
            <p className="text-sm font-medium text-gray-700">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {showWelcomeBonus && (
        <WelcomeBonus
          onClose={() => {
            setShowWelcomeBonus(false);
            if (user?.isNewUser) setShowReferEarn(true);
          }}
        />
      )}

      {showReferEarn && (
        <ReferEarn
          onClose={() => setShowReferEarn(false)}
          referralCode={user?.referralCode || user?.refCode || ""}
        />
      )}
    </div>
  );
};

export default Dashboard;