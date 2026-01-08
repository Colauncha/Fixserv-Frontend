import React from "react";
import exportImg from "../../assets/Admin Images/export.png";
import eye from "../../assets/Admin Images/preview.png";
import recycle from "../../assets/Admin Images/recycle.png";

const MonitorTransaction = () => {
  return (
    <div className="w-full bg-white">
      <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-black">
                Monitor Transactions
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track and manage all marketplace transactions
              </p>
            </div>

            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm">
              <img src={exportImg} className="w-4" />
              Export
            </button>
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

            <input
              type="date"
              className="border border-gray-300 px-4 py-2 text-sm rounded-md"
            />
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">

            {/* Header Row */}
            <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 text-xs text-gray-500 font-medium border-b">
              <div className="col-span-2">Transaction ID</div>
              <div className="col-span-1">Client</div>
              <div className="col-span-1">Artisan</div>
              <div className="col-span-3">Item</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1">Fee</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Rows */}
            {[
              { status: "Complete" },
              { status: "Complete" },
              { status: "Pending" },
              { status: "Failed" },
              { status: "Refunded" },
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-12 px-5 py-4 border-b text-sm items-center"
              >
                <div className="col-span-2">TXN-001234</div>
                <div className="col-span-1">John Pee</div>
                <div className="col-span-1">Sarah Moses</div>
                <div className="col-span-3">Handmade Ceramic Vase</div>
                <div className="col-span-1">₦85,000</div>
                <div className="col-span-1">₦2,000</div>

                <div className="col-span-1">
                  {row.status === "Complete" && (
                    <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md">
                      Complete
                    </span>
                  )}
                  {row.status === "Pending" && (
                    <span className="px-2 py-1 text-xs border border-gray-300 rounded-md">
                      Pending
                    </span>
                  )}
                  {row.status === "Failed" && (
                    <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-md">
                      Failed
                    </span>
                  )}
                  {row.status === "Refunded" && (
                    <span className="px-2 py-1 text-xs border border-gray-300 rounded-md">
                      Refunded
                    </span>
                  )}
                </div>

                <div className="col-span-1 text-xs text-gray-500">
                  2025-01-15 14:30
                </div>

                <div className="col-span-1 flex justify-end gap-3">
                  <button className="flex items-center gap-1 text-xs border border-gray-300 px-2 py-1 rounded-md">
                    <img src={eye} className="w-3 h-3" />
                    Details
                  </button>

                  {row.status === "Complete" && (
                    <button className="flex items-center gap-1 text-xs text-red-600 border border-gray-300 px-2 py-1 rounded-md">
                      <img src={recycle} className="w-3 h-3" />
                      Refund
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

export default MonitorTransaction;
