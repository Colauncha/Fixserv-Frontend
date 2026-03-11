import React, { useState, useEffect } from "react";
import mainBg from "../../../assets/client images/client-home/referal part/referalbg.png";
import overlayOne from "../../../assets/client images/client-home/referal part/referalbgoverlayone.png";
import overlayTwo from "../../../assets/client images/client-home/referal part/referalbgoverlaytwo.png";
import copy from "../../../assets/client images/client-home/referal part/copy.png";
import pana from "../../../assets/client images/client-home/referal part/pana.png";

import fixCoin from "../../../assets/client images/client-home/referal part/Fixcoin.png";
import users from "../../../assets/client images/client-home/referal part/ReferredUsers.png";
import point from "../../../assets/client images/client-home/referal part/MyFixpoints.png";
import board from "../../../assets/client images/client-home/referal part/LeaderBoard.png";
import task from "../../../assets/client images/client-home/referal part/Task.png";

import ReferredUsersPanel from "./ReferredUsersPanel";
import MyFixpointsPanel from "./MyFixpointsPanel";
import LeaderBoard from "./LeaderBoard";
import Task from "./Task";

import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ReferalPage = () => {
  const navigate = useNavigate();

  const { user, token } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState("users");
  const [fixpoints, setFixpoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [referralInfo, setReferralInfo] = useState(null);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("Newest");
  const itemsPerPage = 5;

  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);

  const referralCode = referralInfo?.myReferralCode || "—";

  const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

  const referralLink =
    referralCode && referralCode !== "—"
      ? `${APP_URL}/signup?ref=${encodeURIComponent(referralCode)}`
      : "";

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = async () => {
    if (!referralLink) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Fixserv Referral",
          text: `Use my Fixserv referral code: ${referralCode}`,
          url: referralLink,
        });
      } else {
        await handleCopy(referralLink);
      }
    } catch (e) {
      await handleCopy(referralLink);
    }
  };

  const referralRewards = Array.isArray(referralInfo?.referralRewards)
    ? referralInfo.referralRewards
    : [];

  const allUsers = referralRewards.map((item) => {
    const name =
      item?.fullName ||
      item?.name ||
      item?.referredUser?.fullName ||
      item?.referredUser?.name ||
      item?.user?.fullName ||
      item?.user?.name ||
      "—";

    const email =
      item?.email ||
      item?.referredUser?.email ||
      item?.user?.email ||
      "—";

    const rawDate =
      item?.joinedAt ||
      item?.createdAt ||
      item?.referredAt ||
      item?.date ||
      item?.rewardedAt ||
      null;

    const date = rawDate
      ? new Date(rawDate).toLocaleDateString("en-GB")
      : "—";

    const statusRaw =
      item?.status ||
      item?.rewardStatus ||
      item?.paymentStatus ||
      item?.state ||
      "";

    const s = String(statusRaw).toLowerCase();

    const status =
      s.includes("success") ||
      s.includes("approved") ||
      s.includes("paid") ||
      s.includes("credit") ||
      s.includes("completed")
        ? "Successful"
        : "Pending";

    return [name, email, date, status];
  });

  const parseRowDate = (val) => {
    if (!val || val === "—") return 0;

    const t = new Date(val).getTime();
    if (!Number.isNaN(t)) return t;

    const m = String(val).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
      const [, dd, mm, yyyy] = m;
      return new Date(`${yyyy}-${mm}-${dd}`).getTime();
    }

    return 0;
  };

  const handleSendInvite = async () => {
    if (!inviteEmail) {
      alert("Please enter an email address");
      return;
    }

    try {
      setSending(true);

      const res = await fetch(
        `https://dev-wallet-api.fixserv.co/api/wallet/referral/send-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: inviteEmail,
            referralCode: referralCode,
            userId: userId,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Referral code sent successfully!");
        setInviteEmail("");
      } else {
        alert(data.message || "Failed to send email");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const sortedUsers = [...allUsers].sort((a, b) => {
    const dateA = parseRowDate(a[2]);
    const dateB = parseRowDate(b[2]);
    return sortOption === "Newest" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / itemsPerPage));

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageClick = (num) => {
    setPage(num);
  };

  const toggleSort = () => {
    setSortOption(sortOption === "Newest" ? "Oldest" : "Newest");
  };

  useEffect(() => {
    const fetchFixpoints = async () => {
      try {
        if (!userId || !token) return;

        const res = await fetch(
          `https://dev-wallet-api.fixserv.co/api/wallet/fixpoints/balance/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("REFERRAL API RAW =>", data);

        console.log("FIXPOINTS RAW =>", data);

        if (data?.success) {
          setFixpoints(data?.data?.points || 0);
        }
      } catch (error) {
        console.log("Fixpoints fetch error:", error);
      }
    };

    fetchFixpoints();
  }, [userId, token]);

  useEffect(() => {
    const fetchReferralInfo = async () => {
      if (!userId || !token) return;

      try {
        setLoading(true);

        const res = await fetch(
          `https://dev-wallet-api.fixserv.co/api/wallet/referral/info/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        console.log("referralRewards sample =>", data?.data?.referralRewards?.[0]);
        console.log("REFERRAL RAW =>", data);
        console.log("referralRewards sample =>", data?.data?.referralRewards?.[0]);
        console.log("referralRewards length =>", data?.data?.referralRewards?.length);

        if (data?.success) {
          setReferralInfo(data.data);
        } else {
          setReferralInfo(null);
        }
      } catch (err) {
        console.log("Referral fetch error:", err);
        setReferralInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralInfo();
  }, [userId, token]);

  return (
    <div className="w-full bg-white">
      {/* HERO */}
      <section className="relative w-full min-h-[280px] sm:h-[300px] bg-[#254B71] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/client/profile");
              }
            }}
            className="absolute top-8 sm:top-12 lg:top-16 left-4 sm:left-6 text-white text-sm flex items-center gap-1 cursor-pointer"
          >
            ← Back
          </button>
        </div>

        <img src={mainBg} className="absolute inset-0 w-full h-full object-cover" alt="" />
        <img src={overlayOne} className="absolute inset-0 w-full h-full object-cover" alt="" />
        <img src={overlayTwo} className="absolute inset-0 w-full h-full object-cover" alt="" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4 pt-16 sm:pt-12 pb-10 sm:pb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">
            Referrals
          </h1>
          <p className="text-sm text-blue-100 max-w-lg">
            Share your referral code to your friends and watch your fixpoint grow
          </p>
        </div>
      </section>

      {/* FLOATING CARD ZONE */}
      <section className="relative -mt-8 sm:-mt-10 lg:-mt-12 pb-10 sm:pb-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-[#EFF7FF] rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl">
            <div className="bg-white rounded-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
              {/* Left Content */}
              <div className="w-full lg:w-[65%]">
                <div className="flex flex-col sm:flex-row items-stretch bg-gray-100 rounded-lg overflow-hidden min-h-[64px]">
                  <span className="flex-1 px-4 sm:px-5 py-4 sm:py-0 sm:flex sm:items-center text-base sm:text-lg text-gray-700 break-all">
                    {referralCode}
                  </span>

                  <button
                    onClick={() => handleCopy(referralCode)}
                    disabled={!referralInfo?.myReferralCode}
                    className="flex items-center justify-center gap-2 bg-[#3E83C4] text-white px-4 sm:px-6 py-4 sm:py-0 text-sm sm:text-base cursor-pointer disabled:opacity-60 whitespace-nowrap"
                  >
                    <img src={copy} className="w-4 h-4" alt="" />
                    {copied ? "Copied!" : "Copy Code"}
                  </button>

                  <button
                    onClick={handleShare}
                    disabled={!referralLink}
                    className="flex items-center justify-center gap-2 bg-black text-white px-4 sm:px-6 py-4 sm:py-0 text-sm sm:text-base cursor-pointer disabled:opacity-60 whitespace-nowrap"
                  >
                    Share
                  </button>
                </div>

                <div className="flex items-center my-6 sm:my-8">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="px-4 text-xs text-gray-400">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <p className="text-sm text-gray-700 mb-2">Invite your friends</p>

                <div className="flex flex-col sm:flex-row bg-gray-100 rounded-lg overflow-hidden min-h-[64px]">
                  <input
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-4 sm:px-5 py-4 sm:py-0 text-base sm:text-lg bg-transparent outline-none min-w-0"
                  />

                  <button
                    onClick={handleSendInvite}
                    disabled={sending}
                    className="bg-[#3E83C4] text-white px-6 sm:px-10 py-4 sm:py-0 text-sm sm:text-base cursor-pointer disabled:opacity-60 whitespace-nowrap"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>

              {/* Right Illustration */}
              <div className="w-full lg:w-[35%] flex justify-center">
                <img src={pana} className="w-[180px] sm:w-[220px] lg:w-[260px] max-w-full" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto bg-white px-4 sm:px-6 py-4 sm:py-6 rounded-md">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* LEFT PANEL */}
          <div className="w-full xl:w-[380px] space-y-6 shrink-0">
            {/* Referral Summary Container */}
            <div className="border border-blue-300 rounded-2xl p-4 sm:p-6 bg-blue-50 max-w-4xl">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Referral Summary
              </h3>

              <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 py-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-gray-600">
                      <img src={fixCoin} alt="coin" className="w-5 h-5" />
                      Total Fixpoints
                    </span>
                    <span className="font-semibold text-gray-900 text-right">
                      {fixpoints} pts
                    </span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600">Equivalent values</span>
                    <span className="font-semibold text-gray-900 text-right">
                      ₦{(fixpoints * 2).toLocaleString()}.00
                    </span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600">Referrals Completed</span>
                    <span className="font-semibold text-gray-900 text-right">
                      {referralInfo?.totalReferrals ?? 0}
                    </span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600">Referral Points Earned</span>
                    <span className="font-semibold text-gray-900 text-right">
                      {referralInfo?.totalPointsFromReferrals ?? 0} pts
                    </span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600">Referral Value</span>
                    <span className="font-semibold text-gray-900 text-right">
                      ₦
                      {Number(
                        (referralInfo?.totalPointsFromReferrals ?? 0) * 2
                      ).toLocaleString()}
                    </span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-600">Next Reward Unlocks at</span>
                    <span className="font-semibold text-gray-900 text-right">
                      1000 pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: "users",
                  icon: users,
                  title: "Referred Users",
                  desc: "See all the users you have referred",
                },
                {
                  id: "points",
                  icon: point,
                  title: "My Fixpoints",
                  desc: "Track your earnings, bonuses and redemption",
                },
                {
                  id: "board",
                  icon: board,
                  title: "Leader Board",
                  desc: "View the top referrers",
                },
                {
                  id: "tasks",
                  icon: task,
                  title: "Task & Bonuses",
                  desc: "Earn more fixpoints",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer transition relative ${
                    activeTab === item.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  {activeTab === item.id && (
                    <div className="absolute left-0 top-2 bottom-2 w-2 bg-[#3E83C4] rounded-full"></div>
                  )}

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === item.id ? "bg-blue-100" : "bg-blue-50"
                    }`}
                  >
                    <img src={item.icon} className="w-5 h-5" alt="" />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        activeTab === item.id ? "text-gray-900" : "text-gray-800"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === "users" && (
              <ReferredUsersPanel
                sortOption={sortOption}
                toggleSort={toggleSort}
                paginatedUsers={paginatedUsers}
                totalPages={totalPages}
                page={page}
                handlePageClick={handlePageClick}
                handleNext={handleNext}
              />
            )}

            {activeTab === "points" && <MyFixpointsPanel fixpoints={fixpoints} />}
            {activeTab === "board" && <LeaderBoard />}
            {activeTab === "tasks" && <Task referralCode={referralCode} />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReferalPage;