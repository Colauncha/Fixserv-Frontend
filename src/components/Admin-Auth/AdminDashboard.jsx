import React, { useEffect, useState } from "react";
import exportImg from "../../assets/Admin Images/export.png";
import annouce from "../../assets/Admin Images/annouce.png";
import people from "../../assets/Admin Images/people.png";
import { getAuthToken } from "../../utils/auth";

const AdminDashboard = () => {

const [dashboardData, setDashboardData] = useState({
  totalUsers: 0,
  activeArtisans: 0,
  totalClients: 0,
  totalAdmins: 0,
  newSignups: 0,
  gmv: 0,
  transactionsToday: 0,
  openDisputes: 0,

  transactionVolume: [],
});

const [loading, setLoading] = useState(true);

const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

const [announcementData, setAnnouncementData] = useState({
  title: "",
  message: "",
  targetType: "ALL",
  userId: "",
});

const [announcementLoading, setAnnouncementLoading] = useState(false);

const [showUsersModal, setShowUsersModal] = useState(false);

const [selectedView, setSelectedView] = useState("");

const [usersList, setUsersList] = useState([]);

const [usersLoading, setUsersLoading] = useState(false);

const [selectedUser, setSelectedUser] = useState(null);

useEffect(() => {
  fetchDashboardData();
}, []);

useEffect(() => {

  const handleEscKey = (e) => {

    if (e.key === "Escape") {
      setShowUsersModal(false);
      setShowAnnouncementModal(false);
    }
  };

  window.addEventListener("keydown", handleEscKey);

  return () => {
    window.removeEventListener("keydown", handleEscKey);
  };

}, []);

const getBarHeight = (value) => {
  const maxHeight = 180;

  const maxValue = Math.max(
    ...dashboardData.transactionVolume.map(
      item => item.total
    ),
    1
  );

  return (value / maxValue) * maxHeight;
};


const fetchDashboardData = async () => {
  try {
    setLoading(true);
    const token = getAuthToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // USERS
    const usersRes = await fetch(
      "https://user-api.fixserv.co/api/admin/dashboard/users?period=month&page=1&limit=20",
      { headers }
    );

    // ORDERS STATS
    const ordersRes = await fetch(
      "https://order-api.fixserv.co/api/orders/dashboard/stats?period=today",
      { headers }
    );

    // DISPUTES
    const disputesRes = await fetch(
      "https://order-api.fixserv.co/api/orders/dashboard/disputes",
      { headers }
    );

    const usersData = await usersRes.json();
    const ordersData = await ordersRes.json();
    const disputesData = await disputesRes.json();

    console.log("USERS:", usersData);
    console.log("ORDERS:", ordersData);
    console.log("DISPUTES:", disputesData);

setDashboardData({
  totalUsers:
    usersData?.data?.totalUsers?.total || 0,

  activeArtisans:
    usersData?.data?.totalUsers?.artisans || 0,

  totalClients:
    usersData?.data?.totalUsers?.clients || 0,

  totalAdmins:
    usersData?.data?.totalUsers?.admins || 0,

  newSignups:
    usersData?.data?.newSignups?.total || 0,

  gmv:
    ordersData?.data?.gmv?.thisPeriod?.total || 0,

  transactionsToday:
    ordersData?.data?.transactions?.total || 0,

  openDisputes:
    disputesData?.data?.open || 0,

  transactionVolume:
    ordersData?.data?.revenueBreakdown?.weekly || [],
});

  } catch (error) {
    console.log("DASHBOARD ERROR:", error);
  } finally {
    setLoading(false);
  }
};

const handleCreateAnnouncement = async () => {
  try {
    setLoading(true);

    const token = getAuthToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // VALIDATION
    if (!announcementData.title || !announcementData.message) {
      alert("Title and message are required");
      return;
    }

    if (
      announcementData.targetType === "SINGLE" &&
      !announcementData.userId
    ) {
      alert("User ID is required");
      return;
    }

    let payload = {};

    // SINGLE USER
    if (announcementData.targetType === "SINGLE") {
    //   payload = {
    //     title: announcementData.title,
    //     message: announcementData.message,
    //     userId: announcementData.userId,
    //     type: "SYSTEM_ALERT",
    //     data: {},
    //   };
    // } 
    payload = {
  title: announcementData.title,
  message: announcementData.message,
  userId: announcementData.userId,
  type: "SYSTEM_ALERT",
  data: {
    senderId: "ADMIN",
    senderName: "Admin",
  },
};
} else {
      // ALL / CLIENT / ARTISAN
      payload = {
        targetRole: announcementData.targetType,
        type: "SYSTEM_ALERT",
        title: announcementData.title,
        message: announcementData.message,
      };
    }

    console.log("PAYLOAD:", payload);

const response = await fetch(
  "/api/notifications/create",
  {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  }
);

    const data = await response.json();

    console.log("FULL USER RESPONSE =>", data);

    console.log("RESPONSE:", data);

    if (response.ok && data.success) {
      alert("Announcement sent successfully");

      setShowAnnouncementModal(false);

      setAnnouncementData({
        title: "",
        message: "",
        targetType: "ALL",
        userId: "",
      });
    } else {
      alert(data.message || "Failed to send announcement");
    }

  } catch (error) {
    console.log("ANNOUNCEMENT ERROR:", error);
    alert("Something went wrong");
  } finally {
    setAnnouncementLoading(false);
  }
};

const handleOpenCard = async (type) => {
  try {
    setSelectedView(type);
    setShowUsersModal(true);
    setUsersLoading(true);

    const token = getAuthToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let endpoint = "";

switch (type) {

  case "USERS":

    endpoint =
      "/api/user/admin/dashboard/users?period=month&page=1&limit=20";

    break;

  case "ARTISANS":

    endpoint =
      "/api/user/admin/dashboard/users?period=month&page=1&limit=20";

    break;

    case "CLIENTS":
  endpoint =
    "/api/user/admin/dashboard/users?period=month&page=1&limit=20";
  break;

  case "SIGNUPS":

    endpoint =
      "/api/user/admin/dashboard/users?period=month&page=1&limit=20";

    break;

  default:

    endpoint =
      "/api/user/admin/dashboard/users?period=month&page=1&limit=20";
}

const response = await fetch(endpoint, {
  headers,
});

const data = await response.json();

console.log(
  "FULL USER RESPONSE =>",
  JSON.stringify(data, null, 2)
);

console.log(data);

const artisans = (
  data?.data?.activeArtisans?.artisans || []
).map((user) => ({
  ...user,
  role: "ARTISAN",
}));

// MOCK CLIENTS FROM COUNTS TEMPORARILY
// because backend is not returning actual clients array

const clientCount =
  data?.data?.totalUsers?.clients || 0;

const clients = Array.from(
  { length: clientCount },
  (_, index) => ({
    id: `client-${index + 1}`,
    fullName: `Client User ${index + 1}`,
    email: `client${index + 1}@fixserv.co`,
    role: "CLIENT",
    createdAt: new Date().toISOString(),
  })
);

const adminsCount =
  data?.data?.totalUsers?.admins || 0;

const admins = Array.from(
  { length: adminsCount },
  (_, index) => ({
    id: `admin-${index + 1}`,
    fullName: `Admin User ${index + 1}`,
    email: `admin${index + 1}@fixserv.co`,
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  })
);

const allUsers = [
  ...artisans,
  ...clients,
  ...admins,
];

if (type === "USERS") {
  setUsersList(allUsers);

} else if (type === "ARTISANS") {
  setUsersList(artisans);

} else if (type === "CLIENTS") {
  setUsersList(clients);

} else if (type === "SIGNUPS") {
  setUsersList(allUsers);

} else {
  setUsersList([]);
}

  } catch (error) {
    console.log(error);
  } finally {
    setUsersLoading(false);
  }
};

return (
  <>
    {showAnnouncementModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white w-full max-w-md rounded-2xl p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              Create Announcement
            </h2>

            <button
              onClick={() => setShowAnnouncementModal(false)}
              className="text-gray-500 text-xl cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* TITLE */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">
              Title
            </label>

            <input
              type="text"
              value={announcementData.title}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  title: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
            />
          </div>

          {/* MESSAGE */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">
              Message
            </label>

            <textarea
              rows={4}
              value={announcementData.message}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  message: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none resize-none"
            />
          </div>

          {/* TARGET */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">
              Target
            </label>

            <select
              value={announcementData.targetType}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  targetType: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
            >
              <option value="ALL">
                All Users
              </option>

              <option value="CLIENT">
                All Clients
              </option>

              <option value="ARTISAN">
                All Artisans
              </option>

              <option value="SINGLE">
                Single User
              </option>
            </select>
          </div>

          {/* USER ID */}
          {announcementData.targetType === "SINGLE" && (
            <div className="mb-6">
              <label className="text-sm text-gray-600 block mb-2">
                User ID
              </label>

              <input
                type="text"
                value={announcementData.userId}
                onChange={(e) =>
                  setAnnouncementData({
                    ...announcementData,
                    userId: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          )}

         <button
  onClick={handleCreateAnnouncement}
  disabled={announcementLoading}
  className="w-full bg-[#3E83C4] text-white py-3 rounded-lg cursor-pointer hover:opacity-90 disabled:opacity-50"
>
  {announcementLoading ? "Sending..." : "Send Announcement"}
</button>

        </div>
      </div>
    )}

    {showUsersModal && (
<div
  onClick={() => setShowUsersModal(false)}
  className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
>

<div
  onClick={(e) => e.stopPropagation()}
  className="bg-white w-full max-w-6xl rounded-2xl overflow-hidden"
>

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">

        <div>
          <h2 className="text-lg font-semibold text-black">
            {selectedView.replace("_", " ")}
          </h2>

          <p className="text-sm text-gray-500">
            Manage and view users
          </p>
        </div>

        <button
          onClick={() => setShowUsersModal(false)}
          className="text-2xl text-gray-500 cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div className="p-6">

        {usersLoading ? (
          <div className="py-20 text-center text-gray-500">
            Loading...
          </div>
        ) : usersList.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No users found
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                  <th className="py-3">User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {usersList.map((user, i) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100"
                  >

                    <td className="py-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                          {user.fullName?.slice(0, 2).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-black">
                            {user.fullName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {user.id}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                        {
  user.role ||
  user.userType ||
  user.accountType ||
  "CLIENT"
}
                      </span>
                    </td>

                    <td>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>

                    <td className="text-sm text-gray-500">
                      {user.createdAt
  ? new Date(user.createdAt).toLocaleDateString()
  : "N/A"}
                    </td>

                    <td>
                      <button
  onClick={() => setSelectedUser(user)}
  className="text-sm text-[#3E83C4] cursor-pointer"
>
  View
</button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>

  </div>
)}

{selectedUser && (
  <div
    onClick={() => setSelectedUser(null)}
    className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-6"
  >

    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-full max-w-md rounded-2xl p-6"
    >

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold">
          User Details
        </h2>

        <button
          onClick={() => setSelectedUser(null)}
          className="text-2xl text-gray-500"
        >
          ×
        </button>

      </div>

      <div className="space-y-4">

        <div>
          <p className="text-xs text-gray-500">
            Full Name
          </p>

          <p className="text-sm font-medium">
            {selectedUser.fullName || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Email
          </p>

          <p className="text-sm font-medium">
            {selectedUser.email || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Role
          </p>

          <p className="text-sm font-medium">
            {
              selectedUser.role ||
              selectedUser.userType ||
              "CLIENT"
            }
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            User ID
          </p>

          <p className="text-sm font-medium break-all">
            {selectedUser.id || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Joined
          </p>

          <p className="text-sm font-medium">
            {selectedUser.createdAt
              ? new Date(
                  selectedUser.createdAt
                ).toLocaleString()
              : "N/A"}
          </p>
        </div>

      </div>

    </div>

  </div>
)}

    <div className="w-full">

      <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex justify-between items-start mb-8">

            <div>
              <h1 className="text-2xl font-semibold text-black">
                Dashboard
              </h1>
              <p className="text-sm text-[#6B6B6B] mt-1">
                Overview of marketplace performance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 border border-gray-300 text-sm px-4 py-2 rounded-md cursor-pointer hover:bg-gray-50">
                <img src={exportImg} className="w-4 h-4" />
                Export CSV
              </button>

              <button
  onClick={() => setShowAnnouncementModal(true)}
  className="flex items-center gap-2 bg-[#3E83C4] text-white text-sm px-4 py-2 rounded-md cursor-pointer hover:opacity-90"
>
                <img src={annouce} className="w-4 h-4" />
                Create Announcement
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

            {[
  {
    type: "USERS",
    title: "Total Users",
    value: dashboardData.totalUsers,
    note: "+12% from last month",
  },

  {
    type: "ARTISANS",
    title: "All Artisans",
    value: dashboardData.activeArtisans,
    note: "View artisans",
  },

  {
    type: "CLIENTS",
    title: "All Clients",
    value: dashboardData.totalClients,
    note: "View clients",
  },

  {
    type: "SIGNUPS",
    title: "New Signups (7d)",
    value: dashboardData.newSignups,
    note: "+24% from prev week",
  },

  {
    type: "TRANSACTIONS",
    title: "Transactions Today",
    value: dashboardData.transactionsToday,
    note: "-3% from yesterday",
    danger: true,
  },

  {
    type: "DISPUTES",
    title: "Open Disputes",
    value: dashboardData.openDisputes,
    note: "2 new today",
  },
].map((card, i) => (
              <div
  key={i}
  onClick={() => handleOpenCard(card.type)}
  className="border border-gray-200 rounded-xl p-4 bg-white cursor-pointer hover:border-[#3E83C4] hover:shadow-md transition"
>

                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-[#6B6B6B]">{card.title}</p>
                  <img src={people} className="w-6 h-6" />
                </div>

                <p className="text-lg font-semibold text-black mb-1">
                  {card.value}
                </p>

                <p className={`text-xs ${card.danger ? "text-red-500" : "text-[#3E83C4]"}`}>
                  {card.note}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

            <section className="w-full py-10">
  <div className="max-w-7xl mx-auto px-6">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

<div className="bg-white border border-gray-200 rounded-xl p-6">
  <h3 className="text-sm font-medium text-black mb-4">
    Revenue Trend (30 days)
  </h3>

  <div className="flex h-[220px]">

    {/* Y Axis */}
    <div className="flex flex-col justify-between text-xs text-gray-400 pr-4">
      <span>6000</span>
      <span>4500</span>
      <span>3000</span>
      <span>1500</span>
      <span>0</span>
    </div>

    {/* Chart Area */}
    <div className="flex-1 flex flex-col justify-between">
      {/* Empty graph space */}
      <div className="flex-1 border-l border-b border-gray-200"></div>

      {/* X Axis */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Day 1</span>
        <span>Day 7</span>
        <span>Day 14</span>
        <span>Day 21</span>
        <span>Day 30</span>
      </div>
    </div>

  </div>
</div>

<div className="bg-white border border-gray-200 rounded-xl p-6">
  <h3 className="text-sm font-medium text-black mb-4">
    Transaction Volume (7 days)
  </h3>

  <div className="flex h-[220px]">

    {/* Y Axis */}
    <div className="flex flex-col justify-between text-xs text-gray-400 pr-4">
      <span>120</span>
      <span>90</span>
      <span>60</span>
      <span>30</span>
      <span>0</span>
    </div>

    {/* Chart Area */}
    <div className="flex-1 flex flex-col justify-between">

      {/* Bars */}
      <div className="flex-1 flex items-end justify-between gap-5 border-l border-b border-gray-200 px-2">

        {dashboardData.transactionVolume.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center flex-1"
          >

            <div className="relative h-[180px] w-8 flex items-end">

              <div className="absolute bottom-0 w-full h-full bg-gray-200 rounded-md"></div>

              <div
                className="relative w-full bg-[#3E83C4] rounded-md"
                style={{
                  height: `${getBarHeight(item.total)}px`,
                }}
              ></div>

            </div>

          </div>
        ))}

      </div>

      {/* X Axis */}
      <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">

        {dashboardData.transactionVolume.map((item, i) => (
          <span key={i}>
            {item.day}
          </span>
        ))}

      </div>

    </div>
  </div>
</div>

    {/* </div>
  </div>
</div> */}




    </div>

  </div>
</section>

<section className="w-full py-10">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT: Top 10 Artisans */}
      <div className="lg:col-span-2 bg-white border border-gray-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">
            Top 10 Artisans by Sales
          </h3>
        </div>

        {/* Rows */}
        {[
          { name: "Sarah Moses", role: "Pottery", amount: "₦12,450", rating: "4.9" },
          { name: "Marcus Ike", role: "Woodwork", amount: "₦10,230", rating: "4.8" },
          { name: "Amara Okafor", role: "Textiles", amount: "₦9,870", rating: "4.7" },
          { name: "Elena Udoh", role: "Jewelry", amount: "₦8,650", rating: "4.6" },
          { name: "Biliki Kareem", role: "Ceramics", amount: "₦7,920", rating: "3.9" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-6 py-4 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                {i + 1}
              </span>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.role}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {item.amount}
              </p>
              <p className="text-xs text-gray-400">
                ★ {item.rating}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Recent Activity */}
      <div className="bg-white border border-gray-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">
            Recent Activity
          </h3>
        </div>

        {/* Rows */}
        {[
          { name: "John Doe", action: "Purchased handmade vase", time: "2 min ago", amount: "₦85,000" },
          { name: "Jane Smith", action: "Left 5-star review", time: "5 min ago" },
          { name: "Mike Johnson", action: "New artisan signup", time: "12 min ago" },
          { name: "Emily Brown", action: "Dispute opened", time: "18 min ago", amount: "₦60,000" },
          { name: "David James", action: "Purchased custom furniture", time: "25 min ago", amount: "₦60,000" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex justify-between px-6 py-4 border-b border-gray-200 last:border-b-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                {item.action}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {item.time}
              </p>
            </div>

            {item.amount && (
              <p className="text-sm font-medium text-gray-900">
                {item.amount}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  </div>
</section>





    </div>
  </>
);

};

export default AdminDashboard;
