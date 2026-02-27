import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import tag from "../../../assets/client images/client-home/referal part/tag.png";
import calendar from "../../../assets/client images/client-home/referal part/calender.png";
import filterIcon from "../../../assets/client images/client-home/referal part/filter.png";

const ENDPOINT = "https://dev-order-api.fixserv.co/api/orders/client-history";

// --- helpers ---
const formatNaira = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return value ?? "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(num);
};

const normalizeRow = (item, index) => {
  // Try to handle common backend shapes safely
  const id =
    item?.bookingId ||
    item?.booking_id ||
    item?.orderId ||
    item?.order_id ||
    item?.id ||
    `#FX-${index + 1}`;

  const device =
    item?.device ||
    item?.deviceName ||
    item?.device_name ||
    item?.service?.device ||
    item?.service?.deviceName ||
    item?.serviceName ||
    item?.service_name ||
    "—";

  const tech =
    item?.technicianName ||
    item?.technician_name ||
    item?.technician?.name ||
    item?.artisanName ||
    item?.artisan_name ||
    "—";

  const statusRaw =
    item?.paymentStatus ||
    item?.payment_status ||
    item?.payment?.status ||
    item?.status ||
    "Pending";

  const status =
    String(statusRaw).toLowerCase().includes("paid")
      ? "Paid"
      : String(statusRaw).toLowerCase().includes("cancel")
      ? "Cancelled"
      : "Pending";

  const costRaw =
    item?.cost ||
    item?.amount ||
    item?.price ||
    item?.totalAmount ||
    item?.total_amount ||
    item?.payment?.amount ||
    0;

  const progressRaw =
    item?.progress ||
    item?.jobStatus ||
    item?.job_status ||
    item?.repairStatus ||
    item?.repair_status ||
    item?.stage ||
    "Not Started";

  const progress =
    typeof progressRaw === "string" ? progressRaw : String(progressRaw ?? "—");

  return {
    id: String(id),
    device,
    tech,
    status,
    cost: formatNaira(costRaw),
    progress,
  };
};

const RepairHistory = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");
  const [open, setOpen] = useState(null);

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const perPage = 8;

  useEffect(() => {
    let alive = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

//         const token =
//   localStorage.getItem("token") ||
//   localStorage.getItem("accessToken") ||
//   localStorage.getItem("authToken");

//   if (!token) {
//   setError("Unauthorized: No token found. Please login again.");
//   setLoading(false);
//   return;
// }

// const res = await axios.get(ENDPOINT, {
//   headers: token ? { Authorization: `Bearer ${token}` } : {},
// });

const token = localStorage.getItem("fixserv_token");

if (!token) {
  setError("Unauthorized: Please login again.");
  setLoading(false);
  return;
}

const res = await axios.get(ENDPOINT, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

        
        const payload = res?.data;
        const list =
          Array.isArray(payload) ? payload :
          Array.isArray(payload?.data) ? payload.data :
          Array.isArray(payload?.orders) ? payload.orders :
          Array.isArray(payload?.history) ? payload.history :
          [];

        const normalized = list.map(normalizeRow);

        if (!alive) return;
        setData(normalized);
        setPage(1);
      } catch (e) {
        if (!alive) return;

        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load history";
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data.filter((row) => {
      const matchesStatus = status === "All" ? true : row.status === status;
      const matchesQuery = !q
        ? true
        : `${row.id} ${row.device} ${row.tech} ${row.progress} ${row.status}`
            .toLowerCase()
            .includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [data, status, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  // keep page valid when filters reduce results
  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

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
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search Past Request"
            className="px-4 py-2 text-sm w-full outline-none"
          />
          <button
            type="button"
            onClick={() => setPage(1)}
            className="bg-blue-600 text-white px-8"
          >
            Search
          </button>
        </div>

        {/* STATUS FILTER */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(open === "status" ? null : "status")}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm"
          >
            <img src={tag} className="w-4" alt="" />
            {status}
            <span>▾</span>
          </button>

          {open === "status" && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg w-32 z-10">
              {["All", "Paid", "Pending", "Cancelled"].map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setOpen(null);
                    setPage(1);
                  }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATE (placeholder for later) */}
        <button
          type="button"
          className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm"
        >
          <img src={calendar} className="w-4" alt="" />
          Date ▾
        </button>

        {/* MORE (placeholder for later) */}
        <button
          type="button"
          className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm"
        >
          <img src={filterIcon} className="w-4" alt="" />
          More Filters ▾
        </button>
      </div>

      {/* STATES */}
      {loading && (
        <div className="p-4 text-sm text-gray-600 border rounded-lg mb-4">
          Loading history...
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg mb-4">
          {error}
        </div>
      )}

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

        {!loading && view.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No history found.
          </div>
        ) : (
          view.map((row, i) => (
            <div
              key={`${row.id}-${i}`}
              className="grid grid-cols-6 px-5 py-4 text-sm border-b border-blue-100 last:border-0"
            >
              <span>{row.id}</span>
              <span>{row.device}</span>
              <span>{row.tech}</span>

              <span
                className={`px-3 py-1 rounded-full text-xs w-fit ${
                  row.status === "Paid"
                    ? "bg-green-100 text-green-600"
                    : row.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {row.status}
              </span>

              <span className="font-semibold">{row.cost}</span>
              <span className="text-gray-500">{row.progress}</span>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="relative mt-6">
        <div className="flex justify-center gap-3">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              type="button"
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
            type="button"
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