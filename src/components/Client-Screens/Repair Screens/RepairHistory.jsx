
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import tag from "../../../assets/client images/client-home/referal part/tag.png";

const ENDPOINT = "https://dev-order-api.fixserv.co/api/orders/client-history";
const ARTISAN_ENDPOINT = "https://dev-user-api.fixserv.co/api/admin/user";

const formatNaira = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return value ?? "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatAddress = (address) => {
  if (!address) return "—";

  const full = [
    address.street,
    address.city,
    address.state,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return full || "—";
};

const normalizePaymentStatus = (escrowStatus) => {
  const value = String(escrowStatus || "").toUpperCase().trim();

  if (value === "PAID") return "Paid";
  if (value === "NOT_PAID" || value === "UNPAID") return "Unpaid";
  if (value.includes("CANCEL")) return "Cancelled";
  return "Pending";
};

const normalizeProgress = (status) => {
  const value = String(status || "").toUpperCase();

  if (value === "PENDING_ARTISAN_RESPONSE") return "Pending Artisan Response";
  if (value === "ACCEPTED") return "Accepted";
  if (value === "IN_PROGRESS") return "In Progress";
  if (value === "COMPLETED") return "Completed";
  if (value === "CANCELLED") return "Cancelled";

  return value.replace(/_/g, " ") || "Not Started";
};

const getArtisanPayload = (payload) => {
  return payload?.data || payload?.user || payload || {};
};

const normalizeArtisan = (artisan) => {
  return {
    id: artisan?.id || artisan?._id || "—",
    fullName: artisan?.fullName || artisan?.name || "Unknown Technician",
    profilePicture: artisan?.profilePicture || artisan?.avatar || "",
    category:
      artisan?.businessName ||
      artisan?.categories?.[0] ||
      artisan?.category ||
      "Repair Technician",
    rating: artisan?.rating ?? 0,
    reviewsCount:
      artisan?.reviewsCount ??
      artisan?.totalReviews ??
      artisan?.reviewCount ??
      0,
    experience:
      artisan?.experience ||
      artisan?.yearsOfExperience ||
      artisan?.experienceLevel ||
      "—",
    location: artisan?.location || "—",
    skills: Array.isArray(artisan?.skillSet)
      ? artisan.skillSet
      : Array.isArray(artisan?.skills)
      ? artisan.skills
      : [],
  };
};

const normalizeRow = (item, artisanMap) => {
  const uploadedProduct = Array.isArray(item?.uploadedProducts)
    ? item.uploadedProducts[0]
    : null;

  const artisan = artisanMap[item?.artisanId] || null;

  return {
    id: item?.id || "—",
    device: item?.serviceRequired || item?.deviceType || "—",
    tech: artisan?.fullName || "Unknown Technician",
    status: normalizePaymentStatus(item?.escrowStatus),
    cost: formatNaira(item?.price || 0),
    progress: normalizeProgress(item?.status),

    priceRaw: Number(item?.price || 0),
    deviceType: item?.deviceType || "—",
    deviceBrand: item?.deviceBrand || "—",
    deviceModel: item?.deviceModel || "—",
    serviceRequired: item?.serviceRequired || "—",
    issueDescription: uploadedProduct?.description || "—",
    objectName: uploadedProduct?.objectName || "—",
    uploadedImage: uploadedProduct?.imageUrl || "",
    uploadedAt: uploadedProduct?.uploadedAt || "",
    location: formatAddress(item?.clientAddress),
    clientAddress: item?.clientAddress || {},
    createdAt: item?.createdAt || "",
    escrowStatus: item?.escrowStatus || "—",
    orderStatus: item?.status || "—",
    artisanId: item?.artisanId || "—",
    serviceId: item?.serviceId || "—",
    paymentReference: item?.paymentReference || "—",
    artisanResponseDeadline: item?.artisanResponseDeadline || "—",

    artisanName: artisan?.fullName || "Unknown Technician",
    artisanImage: artisan?.profilePicture || "",
    artisanCategory: artisan?.category || "Repair Technician",
    artisanRating: artisan?.rating ?? "—",
    artisanReviews: artisan?.reviewsCount ?? "—",
    artisanExperience: artisan?.experience || "—",
    artisanLocation: artisan?.location || "—",
    artisanSkills: artisan?.skills || [],

    raw: item,
  };
};

const RepairHistory = () => {
  const navigate = useNavigate();

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
        const orders = Array.isArray(payload?.orders) ? payload.orders : [];

        const uniqueArtisanIds = [
          ...new Set(orders.map((item) => item?.artisanId).filter(Boolean)),
        ];

        const artisanResults = await Promise.all(
          uniqueArtisanIds.map(async (artisanId) => {
            try {
              const artisanRes = await axios.get(
                `${ARTISAN_ENDPOINT}/${artisanId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const artisanPayload = getArtisanPayload(artisanRes?.data);
              return [artisanId, normalizeArtisan(artisanPayload)];
            } catch (err) {
              console.error(
                `Failed to fetch artisan ${artisanId}`,
                err?.response?.data || err?.message
              );
              return [
                artisanId,
                {
                  id: artisanId,
                  fullName: "Unknown Technician",
                  profilePicture: "",
                  category: "Repair Technician",
                  rating: "—",
                  reviewsCount: "—",
                  experience: "—",
                  location: "—",
                  skills: [],
                },
              ];
            }
          })
        );

        const artisanMap = Object.fromEntries(artisanResults);
        const normalized = orders.map((item) => normalizeRow(item, artisanMap));

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
        : `${row.id} ${row.device} ${row.tech} ${row.progress} ${row.status} ${row.deviceBrand} ${row.deviceModel}`
            .toLowerCase()
            .includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [data, status, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  return (
    <div className="max-w-7xl mx-auto bg-white px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 mt-4">
      <h2 className="text-lg sm:text-xl font-semibold">Request History</h2>
      <p className="text-sm text-gray-500 mb-6">
        View all your repair requests and their current status
      </p>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6 w-full">
  <div className="flex flex-1 items-center bg-white border border-gray-200 rounded-xl overflow-hidden min-w-0 shadow-sm">
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setPage(1);
      }}
      placeholder="Search past request"
      className="px-4 py-3 text-sm w-full outline-none min-w-0 bg-transparent"
    />

    <button
      type="button"
      onClick={() => setPage(1)}
      className="h-full bg-[#3E83C4] text-white px-4 sm:px-5 py-3 text-sm font-medium cursor-pointer shrink-0 whitespace-nowrap hover:bg-[#2f6fa8] transition"
    >
      Search
    </button>
  </div>

  <div className="relative w-full sm:w-auto">
    <button
      type="button"
      onClick={() => setOpen(open === "status" ? null : "status")}
      className="flex items-center justify-between gap-2 border border-gray-200 bg-white px-4 py-3 rounded-xl text-sm w-full sm:min-w-[140px] shadow-sm hover:bg-gray-50 transition"
    >
      <span className="flex items-center gap-2">
        <img src={tag} className="w-4" alt="" />
        {status}
      </span>
      <span>▾</span>
    </button>

    {open === "status" && (
      <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 bg-white shadow-lg rounded-xl w-full sm:w-36 z-10 border border-gray-100 overflow-hidden">
        {["All", "Paid", "Unpaid", "Cancelled"].map((s) => (
          <div
            key={s}
            onClick={() => {
              setStatus(s);
              setOpen(null);
              setPage(1);
            }}
            className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm"
          >
            {s}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

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

      {/* Desktop / Tablet Table */}
      <div className="rounded-xl overflow-hidden hidden md:block">
        <div className="grid grid-cols-6 bg-blue-50 px-5 py-3 text-sm text-gray-600 gap-4">
          <span>Booking ID</span>
          <span>Device</span>
          <span>Technician</span>
          <span>Payment Status</span>
          <span>Cost</span>
          <span>Progress</span>
        </div>

        {!loading && view.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No history found.</div>
        ) : (
          view.map((row, i) => (
            <div
              key={`${row.id}-${i}`}
              onClick={() =>
                navigate("/client/view", {
                  state: { repair: row },
                })
              }
              className="grid grid-cols-6 gap-4 px-5 py-4 text-sm border-b border-blue-100 last:border-0 cursor-pointer hover:bg-blue-50 transition"
            >
              <span className="break-words">{row.id}</span>
              <span className="break-words">{row.device}</span>
              <span className="break-words">{row.tech}</span>

              <span
                className={`px-3 py-1 rounded-full text-xs w-fit ${
                  row.status === "Paid"
                    ? "bg-green-100 text-green-600"
                    : row.status === "Unpaid"
                    ? "bg-yellow-100 text-yellow-600"
                    : row.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {row.status}
              </span>

              <span className="font-semibold break-words">{row.cost}</span>
              <span className="text-gray-500 break-words">{row.progress}</span>
            </div>
          ))
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {!loading && view.length === 0 ? (
          <div className="p-6 text-sm text-gray-500 border rounded-xl">
            No history found.
          </div>
        ) : (
          view.map((row, i) => (
            <div
              key={`${row.id}-${i}`}
              onClick={() =>
                navigate("/client/view", {
                  state: { repair: row },
                })
              }
              className="border border-blue-100 rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Booking ID</p>
                  <p className="text-sm font-semibold break-words">{row.id}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs w-fit shrink-0 ${
                    row.status === "Paid"
                      ? "bg-green-100 text-green-600"
                      : row.status === "Unpaid"
                      ? "bg-yellow-100 text-yellow-600"
                      : row.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {row.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Device</p>
                  <p className="break-words">{row.device}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Technician</p>
                  <p className="break-words">{row.tech}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Cost</p>
                  <p className="font-semibold break-words">{row.cost}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Progress</p>
                  <p className="text-gray-500 break-words">{row.progress}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
  <div className="flex gap-2 flex-wrap">
    {[...Array(pages)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setPage(i + 1)}
        className={`w-8 h-8 rounded-md text-sm cursor-pointer transition ${
          page === i + 1
            ? "bg-[#3E83C4] text-white"
            : "border border-gray-200 bg-white hover:bg-gray-100"
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>

  <button
    type="button"
    onClick={() => page < pages && setPage(page + 1)}
    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-[#3E83C4] hover:text-white transition cursor-pointer shrink-0"
  >
    Next →
  </button>
</div>
    </div>
  );
};

export default RepairHistory;