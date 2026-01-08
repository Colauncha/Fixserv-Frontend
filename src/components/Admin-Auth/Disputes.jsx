import React from "react";
import exportImg from "../../assets/Admin Images/export.png";
import newImg from "../../assets/Admin Images/new.png";
import escalated from "../../assets/Admin Images/escalated.png";
import eye from "../../assets/Admin Images/preview.png";

const Disputes = () => {
  return (
    <div className="w-full bg-white">
      <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-black">
                Resolve Disputes
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and resolve customer disputes
              </p>
            </div>

            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm">
              <img src={exportImg} className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "New", value: 3 },
              { label: "In Review", value: 5 },
              { label: "Escalated", value: 2 },
              { label: "Resolved (7d)", value: 18 },
            ].map((item, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-500">{item.label}</p>
                <h2 className="text-xl font-semibold text-black mt-1">
                  {item.value}
                </h2>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <input
              placeholder="Search by transaction ID, client, or artisan..."
              className="border border-blue-300 focus:border-blue-500 outline-none px-4 py-2 text-sm w-[380px] rounded-lg"
            />

            <select className="border border-gray-300 px-4 py-2 text-sm rounded-md bg-white">
              <option>All Statuses</option>
            </select>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">

            {/* Header Row */}
            <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 text-xs text-gray-500 font-medium border-b">
              <div className="col-span-1">Dispute ID</div>
              <div className="col-span-1">Transaction ID</div>
              <div className="col-span-1">Client</div>
              <div className="col-span-1">Artisan</div>
              <div className="col-span-3">Issue</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">SLA</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            {[
              { issue: "Item not as described", priority: "High", status: "New" },
              { issue: "Damaged during shipping", priority: "Medium", status: "In Review" },
              { issue: "Late delivery", priority: "Low", status: "New" },
              { issue: "Item not as described", priority: "High", status: "Resolved" },
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-12 px-5 py-4 border-b text-sm items-center"
              >
                <div className="col-span-1">DSP-001</div>
                <div className="col-span-1">TXN-001234</div>
                <div className="col-span-1">John Pee</div>
                <div className="col-span-1">Sarah Moses</div>

                <div className="col-span-3">{row.issue}</div>

                <div className="col-span-1">
                  <span className={`px-2 py-1 text-xs rounded-md ${
                    row.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : row.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {row.priority}
                  </span>
                </div>

                <div className="col-span-1">
                  {row.status === "New" && (
                    <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md flex items-center gap-1 w-fit">
                      <img src={newImg} className="w-3 h-3" />
                      New
                    </span>
                  )}

                  {row.status === "In Review" && (
                    <span className="px-2 py-1 text-xs border border-gray-300 rounded-md">
                      In Review
                    </span>
                  )}

                  {row.status === "Resolved" && (
                    <span className="px-2 py-1 text-xs bg-gray-200 rounded-md">
                      Resolved
                    </span>
                  )}
                </div>

                <div className="col-span-1 text-xs text-gray-500">
                  22h remaining
                </div>

                <div className="col-span-2 flex justify-end gap-3">
                  <button className="flex items-center gap-1 text-xs border border-gray-300 px-2 py-1 rounded-md">
                    <img src={eye} className="w-3 h-3" />
                    Review
                  </button>

                  {row.status !== "Resolved" && (
                    <button className="flex items-center gap-1 text-xs text-red-600 border border-gray-300 px-2 py-1 rounded-md">
                      <img src={escalated} className="w-3 h-3" />
                      Escalate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Disputes;
