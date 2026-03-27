// Start testing from hewre 
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import tag from "../../../assets/client images/client-home/referal part/tag.png";
import { getArtisanById } from "../../../api/artisan.api";

const ENDPOINT = "https://dev-order-api.fixserv.co/api/orders/client-history";

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

const normalizePaymentStatus = (item) => {
  const orderStatus = String(
    item?.status ||
      item?.orderStatus ||
      item?.repairStatus ||
      ""
  ).toUpperCase().trim();

  const escrowStatus = String(
    item?.escrowStatus ||
      item?.escrow?.status ||
      item?.payment?.escrowStatus ||
      ""
  ).toUpperCase().trim();

  const paymentStatus = String(
    item?.paymentStatus ||
      item?.payment?.status ||
      item?.releasePaymentStatus ||
      ""
  ).toUpperCase().trim();

  const releaseFlag =
    item?.paymentReleased === true ||
    item?.isPaymentReleased === true ||
    item?.released === true ||
    item?.isReleased === true ||
    item?.payment?.released === true ||
    item?.payment?.isReleased === true;

  const isDone = [
    "WORK_COMPLETED",
    "READY_FOR_PICKUP",
    "COMPLETED",
    "DONE",
  ].includes(orderStatus);

  const isCancelledOrRejected = [
    "CANCELLED",
    "REJECTED",
  ].includes(orderStatus);

  const isNotCompletedYet = [
    "PENDING_ARTISAN_RESPONSE",
    "PENDING",
    "REQUESTED",
    "NEW",
    "ACCEPTED",
    "DEVICE_DROPPED_OFF",
    "IN_PROGRESS",
    "ONGOING",
    "AVAILABLE",
  ].includes(orderStatus);

  const isReleased = releaseFlag || [
    "PAID",
    "SUCCESS",
    "SUCCESSFUL",
    "RELEASED",
    "COMPLETED",
    "DONE",
    "PAID_OUT",
    "SETTLED",
  ].includes(escrowStatus) || [
    "PAID",
    "SUCCESS",
    "SUCCESSFUL",
    "RELEASED",
    "COMPLETED",
    "DONE",
    "PAID_OUT",
    "SETTLED",
  ].includes(paymentStatus);

  if (isCancelledOrRejected) return "Unpaid";
  if (isNotCompletedYet) return "Unpaid";
  if (isDone && isReleased) return "Successful";
  if (isDone && !isReleased) return "Pending";

  return "Unpaid";
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
  const raw = getArtisanPayload(artisan);

  return {
    id: raw?.id || raw?._id || "—",
    fullName: raw?.fullName || raw?.name || "Unknown Technician",
    profilePicture: raw?.profilePicture || raw?.avatar || "",
    category:
      raw?.category ||
      raw?.categories?.[0] ||
      raw?.businessName ||
      "Repair Technician",
    rating: raw?.rating ?? 0,
    reviewsCount:
      raw?.reviewsCount ??
      raw?.totalReviews ??
      raw?.reviewCount ??
      0,
    experience:
      raw?.experience ||
      raw?.yearsOfExperience ||
      raw?.experienceLevel ||
      "—",
    location:
      raw?.location ||
      raw?.address ||
      raw?.city ||
      "—",
    skills: Array.isArray(raw?.skillSet)
      ? raw.skillSet
      : Array.isArray(raw?.skills)
      ? raw.skills
      : [],
  };
};

const pickValue = (...values) => {
  for (const value of values) {
    if (value == null) continue;

    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }

    const text = String(value ?? "").trim();

    if (
      text &&
      text !== "—" &&
      text.toLowerCase() !== "n/a" &&
      text.toLowerCase() !== "null" &&
      text.toLowerCase() !== "undefined" &&
      !/^-+$/.test(text)
    ) {
      return value;
    }
  }

  return "";
};

const pickArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value) && value.length > 0) return value;
  }
  return [];
};

const pickDevice = (item, uploadedProduct, serviceObj) => {
  return (
    pickValue(
      item?.serviceRequired,
      item?.serviceTitle,
      item?.service?.title,
      item?.service?.name,
      serviceObj?.title,
      serviceObj?.name,
      uploadedProduct?.objectName,
      [
        pickValue(
          item?.deviceType,
          uploadedProduct?.deviceType,
          uploadedProduct?.device?.type,
          uploadedProduct?.category
        ),
        pickValue(
          item?.deviceBrand,
          uploadedProduct?.deviceBrand,
          uploadedProduct?.brand,
          uploadedProduct?.device?.brand
        ),
        pickValue(
          item?.deviceModel,
          uploadedProduct?.deviceModel,
          uploadedProduct?.model,
          uploadedProduct?.device?.model
        ),
      ]
        .filter(Boolean)
        .join(" ")
        .trim()
    ) || "—"
  );
};

const normalizeRow = (item) => {
  const artisan = item?.artisan || {};

  const uploadedProduct = Array.isArray(item?.uploadedProducts)
    ? item.uploadedProducts[0]
    : item?.uploadedProduct || null;

  return {
    id: item?.id || item?._id || item?.orderId || "—",

    device:
      item?.serviceRequired ||
      item?.service?.title ||
      uploadedProduct?.objectName ||
      [item?.deviceType, item?.deviceBrand, item?.deviceModel]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      item?.deviceType ||
      item?.deviceBrand ||
      item?.deviceModel ||
      "—",

    tech:
      artisan?.fullName ||
      artisan?.name ||
      artisan?.businessName ||
      item?.artisanName ||
      item?.technicianName ||
      item?.assignedArtisanName ||
      "Unknown Technician",

    status: normalizePaymentStatus(item),
    cost: formatNaira(item?.price || 0),
    progress: normalizeProgress(item?.status),

    priceRaw: Number(item?.price || 0),

    deviceType: item?.deviceType || "—",
    deviceBrand: item?.deviceBrand || "—",
    deviceModel: item?.deviceModel || "—",
    serviceRequired:
      item?.serviceRequired ||
      item?.service?.title ||
      uploadedProduct?.objectName ||
      "—",

    issueDescription:
      item?.issueDescription ||
      uploadedProduct?.description ||
      "—",

    objectName:
      uploadedProduct?.objectName ||
      "—",

    uploadedImage:
      uploadedProduct?.imageUrl ||
      uploadedProduct?.url ||
      "",

    uploadedAt:
      uploadedProduct?.uploadedAt ||
      uploadedProduct?.createdAt ||
      "",

    location: formatAddress(item?.clientAddress),
    clientAddress: item?.clientAddress || {},
    createdAt: item?.createdAt || "",
    escrowStatus: item?.escrowStatus || "—",
    orderStatus: item?.status || "—",
    artisanId: item?.artisanId || artisan?.id || artisan?._id || "—",
    serviceId: item?.serviceId || "—",

    paymentReference:
      item?.paymentReference && String(item.paymentReference).trim()
        ? item.paymentReference
        : "—",

    artisanResponseDeadline: item?.artisanResponseDeadline || "—",

    artisanName:
      artisan?.fullName ||
      artisan?.name ||
      artisan?.businessName ||
      item?.artisanName ||
      item?.technicianName ||
      item?.assignedArtisanName ||
      "Unknown Technician",

    artisanImage:
      artisan?.profilePicture ||
      artisan?.avatar ||
      "",

    artisanCategory:
      artisan?.category ||
      artisan?.businessName ||
      "Repair Technician",

    artisanRating:
      artisan?.rating ?? "—",

    artisanReviews:
      artisan?.reviewsCount ?? "—",

    artisanExperience:
      artisan?.experience || "—",

    artisanLocation:
      artisan?.location || "—",

    artisanSkills:
      Array.isArray(artisan?.skills)
        ? artisan.skills
        : Array.isArray(artisan?.skillSet)
        ? artisan.skillSet
        : [],

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

    const badArtisanIds =
  JSON.parse(sessionStorage.getItem("fixserv_bad_artisan_ids") || "[]");

const badArtisanIdSet = new Set(badArtisanIds);

const hasEmbeddedArtisanName = (item) => {
  return Boolean(
    item?.artisan?.fullName ||
      item?.artisan?.name ||
      item?.assignedArtisan?.fullName ||
      item?.assignedArtisan?.name ||
      item?.artisanDetails?.fullName ||
      item?.artisanDetails?.name ||
      item?.technician?.fullName ||
      item?.technician?.name ||
      item?.artisanName ||
      item?.technicianName ||
      item?.assignedArtisanName
  );
};

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

        // console.log("CLIENT HISTORY ORDERS =>", orders);

const uniqueArtisanIds = [
  ...new Set(
    orders
      .filter((item) => !hasEmbeddedArtisanName(item)) // only fetch if name is missing
      .map((item) => item?.artisanId)
      .filter((id) => id && !badArtisanIdSet.has(id)) // skip known bad ids
  ),
];

const artisanResults = await Promise.all(
  uniqueArtisanIds.map(async (id) => {
    const response = await getArtisanById(id);

    if (!response) {
      badArtisanIdSet.add(id);
      sessionStorage.setItem(
        "fixserv_bad_artisan_ids",
        JSON.stringify([...badArtisanIdSet])
      );
      return [id, null];
    }

    return [id, normalizeArtisan(response)];
  })
);

        const artisanMap = Object.fromEntries(artisanResults);

        const normalized = orders.map((item) =>
          normalizeRow({
            ...item,
            artisan: artisanMap[item.artisanId] ?? item?.artisan ?? null,
          })
        );

        const sorted = normalized.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        if (!alive) return;
        setData(sorted);
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

    return data
      .filter((row) => {
        const matchesStatus = status === "All" ? true : row.status === status;
        const matchesQuery = !q
          ? true
          : `${row.id} ${row.device} ${row.tech} ${row.progress} ${row.status} ${row.deviceBrand} ${row.deviceModel}`
              .toLowerCase()
              .includes(q);

        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
              {["All", "Successful", "Pending", "Unpaid"].map((s) => (
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

      <div className="rounded-xl overflow-hidden hidden md:block">
        <div className="overflow-x-auto hidden md:block">
  <table className="w-full text-sm lg:text-base">
    <thead>
      <tr className="bg-[#ECF0F5] text-[#656565] text-left rounded-lg">
        <th className="py-3 px-4 font-medium">Booking ID</th>
        <th className="py-3 px-4 font-medium">Device</th>
        <th className="py-3 px-4 font-medium">Technician</th>
        <th className="py-3 px-4 font-medium">Payment Status</th>
        <th className="py-3 px-4 font-medium">Cost</th>
        <th className="py-3 px-4 font-medium">Progress</th>
      </tr>
    </thead>

    <tbody className="text-[#535353] text-sm lg:text-base">
      {loading ? (
        <tr>
          <td className="py-5 px-4 text-sm text-gray-500" colSpan={6}>
            Loading history...
          </td>
        </tr>
      ) : error ? (
        <tr>
          <td className="py-5 px-4 text-sm text-red-600" colSpan={6}>
            {error}
          </td>
        </tr>
      ) : view.length === 0 ? (
        <tr>
          <td className="py-5 px-4 text-sm text-gray-500" colSpan={6}>
            No history found.
          </td>
        </tr>
      ) : (
        view.map((row, i) => {
          const color =
  row.status === "Successful"
    ? "bg-[#C9E8CA] text-[#43A047]"
    : row.status === "Pending"
    ? "bg-[#FFF0D9] text-[#F99F10]"
    : "bg-red-100 text-red-600";

          return (
            <tr
              key={`${row.id}-${i}`}
              onClick={() =>
                navigate("/client/view", {
                  state: { repair: row },
                })
              }
              className="cursor-pointer hover:bg-blue-50 transition border-b border-blue-100"
            >
              <td className="py-4 px-4 break-words">{row.id}</td>
              <td className="py-4 px-4 break-words">{row.device}</td>
              <td className="py-4 px-4 break-words">{row.tech}</td>

              <td className="py-4 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 w-fit ${color}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {row.status}
                </span>
              </td>

              <td className="py-4 px-4 font-semibold break-words">
                {row.cost}
              </td>
              <td className="py-4 px-4 break-words">{row.progress}</td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>
      </div>

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
  row.status === "Successful"
    ? "bg-green-100 text-green-600"
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