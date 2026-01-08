import React, { useState } from "react";
import tag from "../../../assets/client images/client-home/referal part/tag.png";
import calendar from "../../../assets/client images/client-home/referal part/calender.png";
import filterIcon from "../../../assets/client images/client-home/referal part/filter.png";

const rawData = [
  ...Array.from({ length: 18 }, (_, i) => ({
    id: "#FX1230",
    device: "iPhone 12",
    tech: "John Adewale",
    status: ["Paid", "Pending", "Cancelled"][i % 3],
    cost: "₦45,000",
    progress: ["Received", "Not Started"][i % 2],
  })),
];

const RepairHistory = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");
  const [open, setOpen] = useState(null);

  const perPage = 8;

  const filtered = rawData.filter(row =>
    status === "All" ? true : row.status === status
  );

  const pages = Math.ceil(filtered.length / perPage);
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 py-14 mt-4">

      <h2 className="text-xl font-semibold">Request History</h2>
      <p className="text-sm text-gray-500 mb-6">
        View all your repair requests and their current status
      </p>

      {/* FILTER BAR */}
      <div className="flex items-center gap-4 mb-6 w-full">

        <div className="flex flex-1 border rounded-lg overflow-hidden">
          <input
            placeholder="Search Past Request"
            className="px-4 py-2 text-sm w-full outline-none"
          />
          <button className="bg-blue-600 text-white px-8">Search</button>
        </div>

        {/* STATUS FILTER */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === "status" ? null : "status")}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm"
          >
            <img src={tag} className="w-4" />
            {status}
            <span>▾</span>
          </button>

          {open === "status" && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg w-32 z-10">
              {["All", "Paid", "Pending", "Cancelled"].map(s => (
                <div
                  key={s}
                  onClick={() => { setStatus(s); setOpen(null); setPage(1); }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATE */}
        <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm">
          <img src={calendar} className="w-4" />
          Date ▾
        </button>

        {/* MORE */}
        <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm">
          <img src={filterIcon} className="w-4" />
          More Filters ▾
        </button>

      </div>

      {/* TABLE */}
      <div className="rounded-xl overflow-hidden">

        <div className="grid grid-cols-6 bg-blue-50 px-5 py-3 text-sm text-gray-600">
          <span>Booking ID</span>
          <span>Device</span>
          <span>Technician</span>
          <span>Payment Status</span>
          <span>Cost</span>
          <span>Progress</span>
        </div>

        {view.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-6 px-5 py-4 text-sm border-b border-blue-100 last:border-0"
          >
            <span>{row.id}</span>
            <span>{row.device}</span>
            <span>{row.tech}</span>

            <span className={`px-3 py-1 rounded-full text-xs w-fit ${
              row.status === "Paid"
                ? "bg-green-100 text-green-600"
                : row.status === "Pending"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}>
              {row.status}
            </span>

            <span className="font-semibold">{row.cost}</span>
            <span className="text-gray-500">{row.progress}</span>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="relative mt-6">

        <div className="flex justify-center gap-3">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-md text-sm ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="absolute right-0 top-0">
          <button
            onClick={() => page < pages && setPage(page + 1)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
};

export default RepairHistory;
