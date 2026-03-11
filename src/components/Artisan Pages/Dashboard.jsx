import React, { useEffect, useMemo, useState } from "react";
import total from "../../assets/Artisan Images/total.png";
import totaljobs from "../../assets/Artisan Images/totaljobs.png";
import ongoing from "../../assets/Artisan Images/ongoing.png";
import completed from "../../assets/Artisan Images/completed.png";
import uncompleted from "../../assets/Artisan Images/uncompleted.png";
import scalearrow from "../../assets/Artisan Images/scalearrows.png";

import WelcomeBonus from "../Client-Screens/WelcomeBonus";
import ReferEarn from "../Client-Screens/ReferEarn";

import coinIcon from "../../assets/Artisan Images/Fixcoin.png";

import { useAuth } from "../../context/AuthContext";
import { getWalletBalance } from "../../api/wallet.api";
import { getArtisanHistory } from "../../api/order.api";
import { useNavigate } from "react-router-dom";
import ArtisanHeader from "../Artisan Pages/ArtisanHeader";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Job Requests");
  const [orders, setOrders] = useState([]);
  const [walletInfo, setWalletInfo] = useState({ balance: 0, lockedBalance: 0 });
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const [showReferEarn, setShowReferEarn] = useState(false);
  const [fixpoints, setFixpoints] = useState(0);
  const [jobsLoading, setJobsLoading] = useState(false);

  const [historyMeta, setHistoryMeta] = useState({
    artisanId: null,
    totalOrders: 0,
    status: "all",
  });

  if (!user) return null;

  const normalizeStatus = (rawStatus) => {
    const s = String(rawStatus || "").trim().toUpperCase();

    if (["COMPLETED", "DONE", "SUCCESSFUL", "RESOLVED"].includes(s)) {
      return "COMPLETED";
    }

    if (["IN_PROGRESS", "ONGOING", "ACTIVE", "PROCESSING"].includes(s)) {
      return "ONGOING";
    }

    if (["PENDING", "PENDING_ARTISAN_RESPONSE", "REQUESTED"].includes(s)) {
      return "PENDING";
    }

    if (["ACCEPTED", "ASSIGNED"].includes(s)) {
      return "ONGOING";
    }

    if (["CANCELLED", "UNCOMPLETED", "REJECTED", "FAILED"].includes(s)) {
      return "UNCOMPLETED";
    }

    return "PENDING";
  };

  useEffect(() => {
    const run = async () => {
      try {
        setJobsLoading(true);

        const userId = user?.id || user?._id;
        const walletIdentifier =
          user?.wallet?.id ||
          user?.wallet?._id ||
          user?.walletId ||
          userId;

        if (walletIdentifier) {
          const w = await getWalletBalance(walletIdentifier);
          const walletPayload = w?.data;

          if (walletPayload?.success) {
            setWalletInfo({
              balance: Number(walletPayload?.data?.balance || 0),
              lockedBalance: Number(walletPayload?.data?.lockedBalance || 0),
            });
          } else {
            setWalletInfo({ balance: 0, lockedBalance: 0 });
          }
        }

        if (userId) {
          const token = localStorage.getItem("fixserv_token");

          const res = await fetch(
            `https://dev-wallet-api.fixserv.co/api/wallet/fixpoints/balance/${userId}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );

          const fixData = await res.json();

          if (fixData?.success) {
            setFixpoints(Number(fixData?.data?.points || 0));
          } else {
            setFixpoints(0);
          }
        }

        const history = await getArtisanHistory();

        setHistoryMeta({
          artisanId: history?.artisanId || null,
          totalOrders: Number(history?.totalOrders || 0),
          status: history?.status || "all",
        });

        const ordersData = history?.orders || history?.data?.orders || [];

        const normalizedHistory = ordersData.map((order) => ({
          ...order,
          normalizedStatus: normalizeStatus(order?.status),
        }));

        setOrders(normalizedHistory);
      } catch (e) {
        console.log("DASHBOARD FETCH ERROR =>", e?.response?.data || e?.message || e);
        setOrders([]);
      } finally {
        setJobsLoading(false);
      }
    };

    run();
  }, [user?.id, user?._id, user?.wallet?.id, user?.wallet?._id, user?.walletId]);

  useEffect(() => {
    const shouldShow = localStorage.getItem("showWelcomeBonus");
    if (shouldShow === "true") {
      setShowWelcomeBonus(true);
      localStorage.removeItem("showWelcomeBonus");
    }
  }, []);

  const stats = useMemo(() => {
    const completedCount = orders.filter(
      (o) => o?.normalizedStatus === "COMPLETED"
    ).length;
    const ongoingCount = orders.filter(
      (o) => o?.normalizedStatus === "ONGOING"
    ).length;
    const uncompletedCount = orders.filter(
      (o) => o?.normalizedStatus === "UNCOMPLETED"
    ).length;

    return {
      totalJobs: historyMeta?.totalOrders || orders.length,
      ongoingJobs: ongoingCount,
      completedJobs: completedCount,
      uncompletedJobs: uncompletedCount,
    };
  }, [orders, historyMeta]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "Completed Jobs") {
      return orders.filter((o) => o?.normalizedStatus === "COMPLETED");
    }

    if (activeTab === "Ongoing Jobs") {
      return orders.filter((o) => o?.normalizedStatus === "ONGOING");
    }

    if (activeTab === "Job Requests") {
      return orders.filter((o) => o?.status === "PENDING_ARTISAN_RESPONSE");
    }

    if (activeTab === "Pending Jobs") {
      return orders.filter((o) => o?.status === "PENDING");
    }

    return orders;
  }, [orders, activeTab]);

  const formatDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return String(val);
    return d.toLocaleString();
  };

  const displayClientName = (order) => {
    return (
      order?.clientName ||
      order?.client?.fullName ||
      order?.client?.name ||
      "Client"
    );
  };

  const displayService = (order) => {
    return (
      order?.serviceName ||
      order?.service?.name ||
      order?.service ||
      order?.deviceType ||
      "Service"
    );
  };

  const displayLocation = (order) => {
    return (
      order?.location ||
      order?.address ||
      order?.serviceAddress ||
      order?.clientAddress ||
      "—"
    );
  };

  const displayPrice = (order) => {
    const p = order?.price ?? order?.amount ?? order?.totalAmount ?? 0;
    return Number(p || 0);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <ArtisanHeader title="Dashboard" />

      {/* SUMMARY CARDS */}
      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          <div className="bg-[#7FAEFA] text-white rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-center mb-3">
              <p className="text-base sm:text-lg lg:text-xl opacity-90">
                Total Amount
              </p>
              <img src={total} alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold break-words">
              NGN {walletInfo.balance || 0}
            </h2>

            <p className="text-sm opacity-90 mt-1">
              Locked: NGN {walletInfo.lockedBalance || 0}
            </p>

            <div className="flex items-center gap-1 mt-3 text-sm">
              <img src={scalearrow} alt="" className="w-4" />
              <span>+15% this week</span>
            </div>
          </div>

          <div className="bg-[#faf0e0] text-black rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-center mb-3">
              <p className="text-base sm:text-lg lg:text-xl opacity-90">
                FixPoints
              </p>
              <img src={coinIcon} alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold">{fixpoints}</h2>

            <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
              <span>Earn points by completing jobs & referrals</span>
            </div>
          </div>

          <div className="bg-[#BFD4EA] text-black rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-center mb-3">
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">
                Total Jobs
              </p>
              <img src={totaljobs} alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold">
              {stats.totalJobs}
            </h2>

            <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
              <img src={scalearrow} alt="" className="w-4" />
              <span>+12% this week</span>
            </div>
          </div>

          <div className="bg-[#D9A600] text-white rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-center mb-3">
              <p className="text-base sm:text-lg lg:text-xl opacity-90">
                Ongoing Jobs
              </p>
              <img src={ongoing} alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold">
              {stats.ongoingJobs}
            </h2>

            <div className="flex items-center gap-1 mt-3 text-sm">
              <img src={scalearrow} alt="" className="w-4" />
              <span>+30% this week</span>
            </div>
          </div>

          <div className="bg-[#2E8B2E] text-white rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-center mb-3">
              <p className="text-base sm:text-lg lg:text-xl opacity-90">
                Completed Jobs
              </p>
              <img src={completed} alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold">
              {stats.completedJobs}
            </h2>

            <div className="flex items-center gap-1 mt-3 text-sm">
              <img src={scalearrow} alt="" className="w-4" />
              <span>+70% this week</span>
            </div>
          </div>

          <div className="bg-[#E10600] text-white rounded-xl p-5 flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-center mb-3">
              <p className="text-base sm:text-lg lg:text-xl opacity-90">
                Uncompleted Jobs
              </p>
              <img src={uncompleted} alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold">
              {stats.uncompletedJobs}
            </h2>

            <div className="flex items-center gap-1 mt-3 text-sm">
              <img src={scalearrow} alt="" className="w-4" />
              <span>-20% this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* JOBS SECTION */}
      <div className="mt-8 mb-10 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div className="flex gap-3 sm:gap-5 lg:gap-8 text-sm sm:text-base lg:text-lg overflow-x-auto pb-2">
            {["Job Requests", "Completed Jobs", "Ongoing Jobs", "Pending Jobs"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer pb-2 whitespace-nowrap transition ${
                    activeTab === tab
                      ? "text-[#3E83C4] border-b-2 border-[#3E83C4]"
                      : "text-gray-500 hover:text-[#3E83C4]"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => navigate("/artisan/jobs")}
            className="w-full sm:w-fit flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg border border-[#3E83C4] px-4 py-2 rounded-md text-[#3E83C4] hover:bg-gray-50 cursor-pointer"
          >
            More
            <span className="text-lg">›</span>
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6 p-3 sm:p-5 lg:p-6 border border-blue-200 rounded-xl">
          {jobsLoading && (
            <div className="text-sm text-gray-500">Loading jobs...</div>
          )}

          {!jobsLoading &&
            filteredOrders.map((order) => (
              <div
                key={order?.id || order?._id || order?.orderId}
                onClick={() => {
                  if (order?.normalizedStatus === "PENDING") {
                    navigate(`/artisan/accept-request/${order?.id || order?._id}`);
                  }
                }}
                className={`border rounded-xl p-4 sm:p-5 cursor-pointer transition ${
                  order?.status === "PENDING_ARTISAN_RESPONSE"
                    ? "border-red-300 bg-red-50 hover:bg-red-100"
                    : "border-blue-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pb-3 border-b">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#3E83C4] text-white flex items-center justify-center font-semibold shrink-0">
                      {displayClientName(order)?.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold break-words">
                        {displayClientName(order)}
                      </p>
                      <span className="text-xs sm:text-sm text-gray-400 break-words">
                        {formatDate(order?.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {order?.status === "PENDING_ARTISAN_RESPONSE" && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}

                    <span className="text-gray-500 text-xs sm:text-sm break-words">
                      {order?.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 text-sm">
                  <div className="space-y-2">
                    <p className="break-words">
                      <b>Repair Type:</b> {displayService(order)}
                    </p>
                    <p className="break-words">
                      <b>Location:</b> {displayLocation(order)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="break-words">
                      <b>Duration:</b> {order?.duration || "—"}
                    </p>
                    <p className="break-words">
                      <b>Price:</b> NGN {displayPrice(order)}
                    </p>
                  </div>
                </div>

                {order?.normalizedStatus === "PENDING" && (
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/artisan/accept-request/${order?.id || order?._id}`);
                      }}
                      className="w-full sm:w-auto text-[#3E83C4] border border-[#3E83C4] px-4 py-2 rounded-md hover:bg-blue-50"
                    >
                      View Request
                    </button>
                  </div>
                )}
              </div>
            ))}

          {!jobsLoading && filteredOrders.length === 0 && (
            <div className="text-sm text-gray-500">
              No jobs found yet for this artisan.
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showWelcomeBonus && (
        <WelcomeBonus
          onClose={() => {
            setShowWelcomeBonus(false);
            if (user?.isNewUser) setShowReferEarn(true);
          }}
        />
      )}

      {showReferEarn && <ReferEarn onClose={() => setShowReferEarn(false)} />}
    </div>
  );
};

export default Dashboard;