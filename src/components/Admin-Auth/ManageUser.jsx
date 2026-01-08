import React, { useState } from "react";
import importImg from "../../assets/Admin Images/import.png";
import exportImg from "../../assets/Admin Images/export.png";
import eye from "../../assets/Admin Images/preview.png";
import suspend from "../../assets/Admin Images/suspend.png";

const ManageUser = () => {
  const [tab, setTab] = useState("clients");

  const data = [
    {
      name: "Sarah Moses",
      email: "sarahm@gmail.com",
      status: "Active",
      lastActive: "2 hours ago",
      spend: "₦340,000",
      joined: "Jan 2025",
    },
    {
      name: "Sarah Moses",
      email: "sarahm@gmail.com",
      status: "Active",
      lastActive: "2 hours ago",
      spend: "₦340,000",
      joined: "Jan 2025",
    },
    {
      name: "Sarah Moses",
      email: "sarahm@gmail.com",
      status: "Suspended",
      lastActive: "2 hours ago",
      spend: "₦340,000",
      joined: "Jan 2025",
    },
  ];

  return (
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
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
            <img src={importImg} className="w-4" />
            Import CSV
          </button>

          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
            <img src={exportImg} className="w-4" />
            Export CSV
          </button>
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
              {["Name","Email","Status","Last Active","Lifetime Spend","Joined","Actions"].map(h => (
                <th key={h} className="px-6 py-4 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.email}</td>

                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 text-xs rounded border ${
                    item.status === "Active"
                      ? "border-green-300 text-green-600"
                      : "border-red-300 text-red-600"
                  }`}>
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4">{item.lastActive}</td>
                <td className="px-6 py-4">{item.spend}</td>
                <td className="px-6 py-4">{item.joined}</td>

                <td className="px-6 py-4 flex gap-3">
                  <button className="flex items-center gap-1 border border-gray-200 px-2 py-1 rounded text-xs text-gray-600">
                    <img src={eye} className="w-4" />
                    View
                  </button>

                  <button className="flex items-center gap-1 border border-red-200 px-2 py-1 rounded text-xs text-red-500">
                    <img src={suspend} className="w-4" />
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </section>
</div>





  );
};

export default ManageUser;
