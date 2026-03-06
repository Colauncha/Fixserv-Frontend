import React, { useEffect, useMemo, useState } from "react";
import not from "../../assets/Artisan Images/not.png";
import profile from "../../assets/Artisan Images/profileImg.jpg";
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
import { getClientHistory } from "../../api/order.api";

const Dashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("Job Requests");

  // orders from client-history
  const [orders, setOrders] = useState([]);

  // wallet endpoint response
  const [walletInfo, setWalletInfo] = useState({ balance: 0, lockedBalance: 0 });

  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const [showReferEarn, setShowReferEarn] = useState(false);

  if (!user) return null;

  /* =====================
     FETCH WALLET + ORDERS
  ====================== */
  useEffect(() => {
    const run = async () => {
      try {
        // 1) Wallet
        const walletId = user?.wallet?.id || user?.wallet?._id || user?.walletId;
        if (walletId) {
          const w = await getWalletBalance(walletId);
          setWalletInfo({
            balance: Number(w?.balance || 0),
            lockedBalance: Number(w?.lockedBalance || 0),
          });
        } else {
          // no walletId yet; keep zeros
          setWalletInfo({ balance: 0, lockedBalance: 0 });
        }

        // 2) Client order history
        const history = await getClientOrderHistory();
        setOrders(history);
      } catch (e) {
        console.log("DASHBOARD FETCH ERROR =>", e?.message || e);
      }
    };

    run();
  }, [user?.wallet?.id, user?.wallet?._id, user?.walletId]);

  /* =====================
     SHOW WELCOME & REFER MODALS
  ====================== */
  useEffect(() => {
    const shouldShow = localStorage.getItem("showWelcomeBonus");
    if (shouldShow === "true") {
      setShowWelcomeBonus(true);
      localStorage.removeItem("showWelcomeBonus");
    }
  }, []);

  /* =====================
     STATUS RULES 
  ====================== */
  const stats = useMemo(() => {
    const completedCount = orders.filter((o) => o?.status === "COMPLETED").length;
    const ongoingCount = orders.filter((o) => o?.status === "IN_PROGRESS").length;
    const uncompletedCount = orders.filter((o) => o?.status !== "COMPLETED").length;

 
    const totalCount = orders.length;


    return {
      totalJobs: totalCount,
      ongoingJobs: ongoingCount,
      completedJobs: completedCount,
      uncompletedJobs: uncompletedCount,
    };
  }, [orders]);

  /* =====================
     TAB FILTERING
  ====================== */
  const filteredOrders = useMemo(() => {
    if (activeTab === "Completed Jobs") {
      return orders.filter((o) => o?.status === "COMPLETED");
    }
    if (activeTab === "Ongoing Jobs") {
      return orders.filter((o) => o?.status === "IN_PROGRESS");
    }
    if (activeTab === "Pending Jobs") {

      const pendingStatuses = new Set(["Pending_artisan_response", "ACCEPTED"]);
      return orders.filter((o) => pendingStatuses.has(o?.status));
    }

    return orders;
  }, [orders, activeTab]);

  /* =====================
     DISPLAY HELPERS (safe)
  ====================== */
  const formatDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return String(val);
    return d.toLocaleString();
  };

  const displayClientName = (order) => {
    // handle multiple shapes
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
    <div className="w-full pr-4">
      {/* HEADER */}
      <div className="flex justify-between p-4 items-center">
        <div>
          <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome {user.fullName}</p>
        </div>

        <div className="flex items-center gap-4">
          <img src={not} className="w-11 h-9 cursor-pointer" />
          <img
            src={user.profileImage || profile}
            className="w-9 h-9 rounded-full cursor-pointer"
          />
        </div>
      </div>

      <div className="border-t border-blue-100"></div>

      {/* FIXPOINTS / WALLET SUMMARY */}
      <div className="pl-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Amount */}
          <div className="bg-[#7FAEFA] text-white rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm opacity-90">Total Amount</p>
              <img src={total} className="w-8" />
            </div>

            <h2 className="text-2xl font-semibold">
              NGN {walletInfo.balance || 0}
            </h2>

            {/* Optional: show locked balance */}
            <p className="text-xs opacity-90 mt-1">
              Locked: NGN {walletInfo.lockedBalance || 0}
            </p>

            <div className="flex items-center gap-1 mt-3 text-xs">
              <img src={scalearrow} className="w-4" />
              <span>+15% this week</span>
            </div>
          </div>

          {/* Fixpoints Card */}
          <div className="bg-[#faf0e0] text-black rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm opacity-90">FixPoints</p>
              <img src={coinIcon} className="w-8" />
            </div>
            <h2 className="text-2xl font-semibold">
              {user.wallet?.fixpoints || 0}
            </h2>
            <div className="flex items-center gap-1 mt-3 text-xs text-gray-600">
              <span>Earn points by completing jobs & referrals</span>
            </div>
          </div>

          {/* Total Jobs */}
          <div className="bg-[#BFD4EA] text-black rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-600">Total Jobs</p>
              <img src={totaljobs} className="w-8" />
            </div>
            <h2 className="text-2xl font-semibold">{stats.totalJobs}</h2>
            <div className="flex items-center gap-1 mt-3 text-xs text-gray-600">
              <img src={scalearrow} className="w-4" />
              <span>+12% this week</span>
            </div>
          </div>

          {/* Ongoing Jobs */}
          <div className="bg-[#D9A600] text-white rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm opacity-90">Ongoing Jobs</p>
              <img src={ongoing} className="w-8" />
            </div>
            <h2 className="text-2xl font-semibold">{stats.ongoingJobs}</h2>
            <div className="flex items-center gap-1 mt-3 text-xs">
              <img src={scalearrow} className="w-4" />
              <span>+30% this week</span>
            </div>
          </div>

          {/* Completed Jobs */}
          <div className="bg-[#2E8B2E] text-white rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm opacity-90">Completed Jobs</p>
              <img src={completed} className="w-8" />
            </div>
            <h2 className="text-2xl font-semibold">{stats.completedJobs}</h2>
            <div className="flex items-center gap-1 mt-3 text-xs">
              <img src={scalearrow} className="w-4" />
              <span>+70% this week</span>
            </div>
          </div>

          {/* Uncompleted Jobs */}
          <div className="bg-[#E10600] text-white rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm opacity-90">Uncompleted Jobs</p>
              <img src={uncompleted} className="w-8" />
            </div>
            <h2 className="text-2xl font-semibold">{stats.uncompletedJobs}</h2>
            <div className="flex items-center gap-1 mt-3 text-xs">
              <img src={scalearrow} className="w-4" />
              <span>-20% this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* JOBS SECTION */}
      <div className="mt-10 mb-10 p-6 bg-white">
        {/* Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-8 text-sm">
            {["Job Requests", "Completed Jobs", "Ongoing Jobs", "Pending Jobs"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 transition ${
                    activeTab === tab
                      ? "text-[#3E83C4] border-b-2 border-[#3E83C4]"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          <button className="flex items-center gap-2 text-sm border px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50">
            More
            <span className="text-lg">›</span>
          </button>
        </div>

        <div className="space-y-6 p-6 border border-blue-200 rounded-xl">
          {filteredOrders.map((order) => (
            <div key={order?.id || order?._id || order?.orderId} className="border border-blue-200 rounded-xl p-5">
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3E83C4] text-white flex items-center justify-center font-semibold">
                    {displayClientName(order)?.charAt(0)}
                  </div>
                  <p className="font-semibold">{displayClientName(order)}</p>
                  <span className="text-sm text-gray-400">
                    {formatDate(order?.createdAt)}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">{order?.status}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">
                <div>
                  <p>
                    <b>Repair Type:</b> {displayService(order)}
                  </p>
                  <p>
                    <b>Location:</b> {displayLocation(order)}
                  </p>
                </div>
                <div>
                  <p>
                    <b>Duration:</b> {order?.duration || "—"}
                  </p>
                  <p>
                    <b>Price:</b> NGN {displayPrice(order)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-sm text-gray-500">
              No orders found for this tab.
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