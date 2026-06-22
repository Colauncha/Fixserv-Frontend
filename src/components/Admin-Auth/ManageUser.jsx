import React, { useEffect, useState } from "react";
import importImg from "../../assets/Admin Images/import.png";
import exportImg from "../../assets/Admin Images/export.png";
import eye from "../../assets/Admin Images/preview.png";
import suspend from "../../assets/Admin Images/suspend.png";
import { getAuthToken } from "../../utils/auth";

const ManageUser = () => {
  const [tab, setTab] = useState("clients");

const [users, setUsers] = useState([]);

const [loading, setLoading] = useState(false);

const [search, setSearch] = useState("");

const [page, setPage] = useState(1);

const [pagination, setPagination] = useState({
  total: 0,
  totalPages: 1,
});

const [selectedUser, setSelectedUser] = useState(null);

const [showViewModal, setShowViewModal] = useState(false);

const [suspendingUserId, setSuspendingUserId] = useState(null);

const limit = 10;
useEffect(() => {
  fetchUsers();
}, [tab, page, search]);

const fetchUsers = async () => {
  try {
    setLoading(true);

const token = getAuthToken();

console.log("TOKEN:", token);

if (!token) {
  console.log("No token found");
  return;
}

    const role =
      tab === "clients"
        ? "CLIENT"
        : "ARTISAN";

    let endpoint =
      `/api/user/admin/dashboard/manage-users?page=${page}&limit=${limit}&role=${role}`;

    if (search.trim()) {
      endpoint += `&search=${search}`;
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("MANAGE USERS:", data);

    if (data.success) {
      setUsers(data?.data?.users || []);

      setPagination({
        total: data?.data?.total || 0,
        totalPages:
          data?.data?.pagination?.totalPages || 1,
      });
    }

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const handleViewUser = (user) => {
  setSelectedUser(user);
  setShowViewModal(true);
};

const handleSuspendUser = async (userId) => {
  try {
    const reason = window.prompt(
      "Enter suspension reason:"
    );

    if (!reason?.trim()) {
      alert("Suspension reason is required");
      return;
    }

    setSuspendingUserId(userId);

    const token = getAuthToken();

    const response = await fetch(
  `/api/user/admin/users/${userId}/suspend`,
      {
        method: "PATCH",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          reason,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "SUSPEND RESPONSE:",
      data
    );

    if (response.ok && data.success) {

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                suspended: true,
              }
            : user
        )
      );

      if (selectedUser?.id === userId) {
  setSelectedUser((prev) => ({
    ...prev,
    suspended: true,
  }));
}``

      alert(
        "User suspended successfully"
      );

    } else {

      alert(
        data.message ||
        "Failed to suspend user"
      );

    }

  } catch (error) {

    console.log(
      "SUSPEND ERROR:",
      error
    );

    alert(
      "Something went wrong"
    );

  } finally {

    setSuspendingUserId(null);

  }
};

const handleUnsuspendUser = async (userId) => {
  const confirmUnsuspend =
  window.confirm(
    "Restore this user's account access?"
  );

if (!confirmUnsuspend) return;
  try {
    setSuspendingUserId(userId);

    const token = getAuthToken();

    console.log(
      "UNSUSPEND URL:",
      `/api/user/admin/users/${userId}/unsuspend`
    );

    const response = await fetch(
      `/api/user/admin/users/${userId}/unsuspend`,
      {
        method: "PATCH",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let data = {};

try {
  data = await response.json();
} catch {
  data = {};
}

    console.log(
      "UNSUSPEND RESPONSE:",
      data
    );

    if (response.ok) {

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                suspended: false,
              }
            : user
        )
      );
      if (selectedUser?.id === userId) {
  setSelectedUser((prev) => ({
    ...prev,
    suspended: false,
  }));
}

      alert(
        data.message ||
        "User unsuspended successfully"
      );

    } else {

      alert(
        data.message ||
        "Failed to unsuspend user"
      );

    }

  } catch (error) {

    console.log(
      "UNSUSPEND ERROR:",
      error
    );

    alert(
      "Something went wrong"
    );

  } finally {

    setSuspendingUserId(null);

  }
};

    const closeModal = () => {
  setShowViewModal(false);
  setSelectedUser(null);
};

  return (
    <>

{showViewModal && selectedUser && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">

    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">

        <div>
          <h2 className="text-lg font-semibold text-black">
            User Details
          </h2>

          <p className="text-sm text-gray-500">
            View complete user information
          </p>
        </div>

        <button
          onClick={closeModal}
          className="text-2xl text-gray-500 cursor-pointer"
        >
          ×
        </button>

      </div>

      {/* BODY */}
      <div className="p-6 space-y-5">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xl">
            {selectedUser.fullName?.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black">
              {selectedUser.fullName}
            </h3>

            <p className="text-sm text-gray-500">
              {selectedUser.email}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">
              Role
            </p>

            <p className="text-sm font-medium text-black">
              {selectedUser.role}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">
              Phone Number
            </p>

            <p className="text-sm font-medium text-black">
              {selectedUser.phoneNumber || "N/A"}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">
              Orders
            </p>

            <p className="text-sm font-medium text-black">
              {selectedUser.orderCount}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">
              Completed Orders
            </p>

            <p className="text-sm font-medium text-black">
              {selectedUser.completedOrders}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">
              Lifetime Spend
            </p>

            <p className="text-sm font-medium text-black">
              ₦{selectedUser.lifetimeSpend?.toLocaleString()}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">
              Email Status
            </p>

            <p className="text-sm font-medium text-black">
              {selectedUser.isEmailVerified
                ? "Verified"
                : "Unverified"}
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>
)}

<div className="w-full">
  <section className="w-full py-12">
    <div className="max-w-7xl mx-auto px-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-black">Manage Users</h2>
          <p className="text-sm text-gray-500 mt-1">
            View and manage clients and artisans
          </p>
        </div>

        <div className="flex gap-3">
          {/* <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
            <img src={importImg} className="w-4" />
            Import CSV
          </button>

          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
            <img src={exportImg} className="w-4" />
            Export CSV
          </button> */}
        </div>
      </div>

      {/* Tabs + Filters */}
      {/* Tabs */}
<div className="flex gap-2 mb-4">
  <span
    onClick={() => setTab("clients")}
    className={`px-3 py-1 text-xs rounded-md cursor-pointer ${
      tab === "clients"
        ? "bg-blue-100 text-blue-600"
        : "border border-gray-200 text-gray-500"
    }`}
  >
    Clients
  </span>

  <span
    onClick={() => setTab("artisans")}
    className={`px-3 py-1 text-xs rounded-md cursor-pointer ${
      tab === "artisans"
        ? "bg-blue-100 text-blue-600"
        : "border border-gray-200 text-gray-500"
    }`}
  >
    Artisans
  </span>
</div>

{/* Filters Row (UNDER tabs) */}
<div className="flex space-x-4 items-center mb-6">
 <input
  placeholder="Search users..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}
  className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-[340px]"
/>

  <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-[140px]">
    <option>All Status</option>
  </select>
</div>


      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              {["Name","Email","Status","Last Active","Lifetime Spend","Orders","Actions"].map(h => (
                <th key={h} className="px-6 py-4 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
  <tr>
    <td
      colSpan="7"
      className="text-center py-10 text-gray-500"
    >
      Loading users...
    </td>
  </tr>
) : users.length === 0 ? (
  <tr>
    <td
      colSpan="7"
      className="text-center py-10 text-gray-500"
    >
      No users found
    </td>
  </tr>
) : (
  users.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="px-6 py-4">{item.fullName}</td>
                <td className="px-6 py-4">{item.email}</td>

                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 text-xs rounded border ${
                    item.suspended
? "border-red-300 text-red-600"
: item.isEmailVerified
? "border-green-300 text-green-600"
: "border-yellow-300 text-yellow-600"
                  }`}>
                   {item.suspended
  ? "Suspended"
  : item.isEmailVerified
  ? "Active"
  : "Unverified"}
                  </span>
                </td>

                <td className="px-6 py-4">{item.lastActiveAt
  ? new Date(
      item.lastActiveAt
    ).toLocaleString()
  : "Never"}</td>
                <td className="px-6 py-4">₦{item.lifetimeSpend?.toLocaleString()}</td>
                <td className="px-6 py-4">{item.orderCount}</td>

                <td className="px-6 py-4 flex gap-3">
                  <button 
                    className="flex items-center gap-1 border border-gray-200 px-2 py-1 rounded text-xs text-gray-600"
                    onClick={() => handleViewUser(item)}
                  >
                    <img src={eye} className="w-4" />
                    View
                  </button>

                  <button
  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
    item.suspended
      ? "border border-green-200 text-green-600 hover:bg-green-50"
      : "border border-red-200 text-red-500 hover:bg-red-50"
  }`}
  onClick={() =>
    item.suspended
      ? handleUnsuspendUser(item.id)
      : handleSuspendUser(item.id)
  }
  disabled={
    suspendingUserId === item.id
  }
>
                    <img src={suspend} className="w-4" />
                    {suspendingUserId === item.id
  ? item.suspended
    ? "Unsuspending..."
    : "Suspending..."
  : item.suspended
  ? "Unsuspend"
  : "Suspend"}
                  </button>
                </td>
              </tr>
           ))
)}
          </tbody>
        </table>
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">

  <div>
    <p className="text-sm text-gray-500">
      Showing page{" "}
      <span className="font-medium text-black">
        {page}
      </span>{" "}
      of{" "}
      <span className="font-medium text-black">
        {pagination.totalPages}
      </span>
    </p>
  </div>

  <div className="flex items-center gap-2">

    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Previous
    </button>

    {[...Array(pagination.totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setPage(i + 1)}
        className={`w-10 h-10 rounded-lg text-sm transition ${
          page === i + 1
            ? "bg-[#3E83C4] text-white"
            : "border border-gray-300 hover:bg-gray-100"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={page === pagination.totalPages}
      onClick={() => setPage(page + 1)}
      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Next
    </button>

  </div>

</div>
      </div>

    </div>
  </section>
</div>

</>



  );
};

export default ManageUser;
