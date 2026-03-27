import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getArtisanHistory,
  acceptOrder,
  rejectOrder,
  startWorkOnOrder,
  completeWorkOnOrder,
  deleteOrder,
} from "../../api/order.api";
import ArtisanHeader from "../Artisan Pages/ArtisanHeader";

import profileImage from "../../assets/client images/client-home/profile.png";

import { useRef } from "react";

import { markOrderNotificationsSeen } from "../../api/notification.api";

const tabs = [
  { label: "Job Requests", status: "REQUESTED" },
  { label: "Ongoing Jobs", status: "ONGOING" },
  { label: "Completed Jobs", status: "COMPLETED" },
  { label: "Pending Jobs", status: "PENDING" },
  { label: "Other Jobs", status: "OTHER" },
];

const normalizeStatus = (status) => {
  const value = String(status || "").toUpperCase();

  if (["REQUESTED", "NEW", "PENDING_ARTISAN_RESPONSE"].includes(value)) {
    return "REQUESTED";
  }

if (["IN_PROGRESS", "STARTED", "ONGOING"].includes(value)) {
  return "ONGOING";
}

if (["ACCEPTED"].includes(value)) {
  return "PENDING";
}

if (
  [
    "DONE",
    "COMPLETED",
    "FINISHED",
    "COMPLETE",
    "WORK_COMPLETED",
    "COMPLETED_WORK",
  ].includes(value)
) {
  return "COMPLETED";
}

  if (["PENDING", "WAITING"].includes(value)) {
    return "PENDING";
  }

  if (["REJECTED", "DECLINED", "CANCELLED", "EXPIRED"].includes(value)) {
    return "OTHER";
  }

  return "OTHER";
};

// const getRawStatus = (status) => String(status || "").toUpperCase();

// const canDeleteOrder = (status) => {
//   const raw = getRawStatus(status);

//   return [
//     "REJECTED",
//     "CANCELLED",
//     "COMPLETED",
//     "DONE",
//     "FINISHED",
//     "COMPLETE",
//     "WORK_COMPLETED",
//     "COMPLETED_WORK",
//   ].includes(raw);
// };

const extractJobDetails = (job) => {
  const product = job?.uploadedProducts?.[0] || {};

  const description = product.description || "N/A";

  const rawName = product.objectName || "";
  const cleaned = rawName.replace("Damaged Device - ", "").trim();

  const parts = cleaned.split(" ").filter(Boolean);

  return {
    description,
    deviceType: parts[0] || "N/A",
    deviceBrand: parts[1] || "N/A",
    deviceModel: parts.slice(2).join(" ") || "N/A",
  };
};


const getRawStatus = (status) => String(status || "").toUpperCase();

const canDeleteOrder = (status) => {
  const raw = getRawStatus(status);
  return ["REJECTED", "CANCELLED", "COMPLETED"].includes(raw);
};

const getStatusColor = (status) => {
  switch (normalizeStatus(status)) {
    case "REQUESTED":
      return "text-purple-500";
    case "ONGOING":
      return "text-green-500";
    case "COMPLETED":
      return "text-blue-500";
    case "PENDING":
      return "text-yellow-500";
    case "OTHER":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const formatLocation = (loc) => {
  if (!loc) return "N/A";

  if (typeof loc === "string") return loc;

  if (Array.isArray(loc)) {
    return loc.filter(Boolean).join(", ");
  }

  if (typeof loc === "object") {
    return (
      [loc.street, loc.city, loc.state, loc.postalCode, loc.country]
        .filter(Boolean)
        .join(", ") || "N/A"
    );
  }

  return "N/A";
};

const formatPrice = (value) => {
  const num = Number(value);
  if (value == null || Number.isNaN(num)) return "N/A";
  return `NGN ${num.toLocaleString("en-NG")}`;
};

const JobsBoard = () => {
  const [activeTab, setActiveTab] = useState("Job Requests");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const [hiddenJobIds, setHiddenJobIds] = useState([]);
  const jobsSectionRef = useRef(null);

  const [showAllJobs, setShowAllJobs] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

const fetchJobs = useCallback(async () => {
  try {
    setLoading(true);
    const data = await getArtisanHistory();

    setJobs(data);
  } catch (err) {
    console.error("Failed to fetch jobs", err);
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const activeStatus = tabs.find((tab) => tab.label === activeTab)?.status;

const filteredJobs = useMemo(() => {
  let result = jobs.filter((job) => {
    const id = String(job?.id || job?._id || job?.orderId || "");
    if (hiddenJobIds.includes(id)) return false;

    if (!showAllJobs) {
      return normalizeStatus(job?.status) === activeStatus;
    }

    return true;
  });

  //  SEARCH (only in total mode)

if (searchTerm.trim()) {
  const term = searchTerm.toLowerCase();

  result = result.filter((job) => {
    const clientName =
      job?.client?.fullName ||
      job?.client?.name ||
      job?.clientDetails?.fullName ||
      job?.clientDetails?.name ||
      job?.customer?.fullName ||
      job?.customer?.name ||
      job?.clientName ||
      job?.customerName ||
      "";

const details = extractJobDetails(job);

return (
  clientName.toLowerCase().includes(term) ||
  details.deviceType.toLowerCase().includes(term) ||
  details.deviceBrand.toLowerCase().includes(term) ||
  details.deviceModel.toLowerCase().includes(term) ||
  details.description.toLowerCase().includes(term)
);
  });
}

  //  SORT (recent → oldest ONLY in total mode)
  if (showAllJobs) {
    result.sort((a, b) => {
      return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
    });
  }

  return result;
}, [jobs, activeStatus, hiddenJobIds, showAllJobs, searchTerm]);

const paginatedJobs = useMemo(() => {
  if (!showAllJobs) return filteredJobs;

  const startIndex = (currentPage - 1) * itemsPerPage;
  return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
}, [filteredJobs, currentPage, itemsPerPage, showAllJobs]);

const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);


const handleCardClick = (tabLabel) => {
  if (tabLabel === "TOTAL") {
    setShowAllJobs(true);
  } else {
    setShowAllJobs(false);
    setActiveTab(tabLabel);
  }

  setTimeout(() => {
    jobsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};


const stats = useMemo(() => {
  const visibleJobs = jobs.filter((job) => {
    const id = String(job?.id || job?._id || job?.orderId || "");
    return !hiddenJobIds.includes(id);
  });

  const result = {
    totalJobs: visibleJobs.length,
    completedJobs: 0,
    ongoingJobs: 0,
    pendingJobs: 0,
    requestedJobs: 0,
    otherJobs: 0,
  };

  visibleJobs.forEach((job) => {
    const status = normalizeStatus(job?.status);

    if (status === "COMPLETED") result.completedJobs++;
    if (status === "ONGOING") result.ongoingJobs++;
    if (status === "PENDING") result.pendingJobs++;
    if (status === "REQUESTED") result.requestedJobs++;
    if (status === "OTHER") result.otherJobs++;
  });

  return result;
}, [jobs, hiddenJobIds]);

  const handleAccept = async (orderId) => {
    try {
      setActioningId(orderId);
      await acceptOrder(orderId);
      await fetchJobs();
    } catch (error) {
      console.error("Failed to accept order", error);
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (orderId) => {
    try {
      setActioningId(orderId);
      await rejectOrder(orderId);
      await fetchJobs();
    } catch (error) {
      console.error("Failed to reject order", error);
    } finally {
      setActioningId(null);
    }
  };

  const handleStart = async (orderId) => {
    try {
      setActioningId(orderId);
      await startWorkOnOrder(orderId);
      await fetchJobs();
    } catch (error) {
      console.error("Failed to start work", error);
    } finally {
      setActioningId(null);
    }
  };

const handleComplete = async (orderId) => {
  try {
    setActioningId(orderId);

    await completeWorkOnOrder(orderId);

    setJobs((prev) =>
      prev.map((job) => {
        const id = job?.id || job?._id || job?.orderId;
        if (String(id) !== String(orderId)) return job;

        return {
          ...job,
          status: "COMPLETED",
        };
      })
    );

    await fetchJobs();
  } catch (error) {
    console.error("Failed to complete work", error);
  } finally {
    setActioningId(null);
  }
};

const handleDelete = async (orderId, jobStatus) => {
  if (!orderId) return;

  const rawStatus = getRawStatus(jobStatus);

  if (!canDeleteOrder(jobStatus)) {
    alert("Only REJECTED, CANCELLED, or COMPLETED jobs can be deleted");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this job?"
  );
  if (!confirmed) return;

  try {
    setActioningId(orderId);

    await deleteOrder(orderId);
    await fetchJobs();

    alert("Job deleted successfully");
  } catch (error) {
    console.error(
      "DELETE ORDER ERROR =>",
      error?.response?.status,
      error?.response?.data || error?.message
    );

    const backendErrors = error?.response?.data?.errors;
    const firstError =
      Array.isArray(backendErrors) && backendErrors.length > 0
        ? backendErrors[0]?.message || backendErrors[0]
        : null;

    alert(
      firstError ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete job"
    );
  } finally {
    setActioningId(null);
  }
};

const renderActions = (job) => {
  const orderId = job?.id || job?._id || job?.orderId;
  if (!orderId) return null;

  const status = normalizeStatus(job?.status);
  const rawStatus = String(job?.status || "").toUpperCase();
  const isBusy = actioningId === orderId;

  if (status === "REQUESTED") {
    return (
      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="button"
          onClick={() => handleAccept(orderId)}
          disabled={isBusy}
          className="px-4 py-2 rounded-md bg-green-600 text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBusy ? "Please wait..." : "Accept"}
        </button>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="button"
          onClick={() => handleStart(orderId)}
          disabled={isBusy}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBusy ? "Please wait..." : "Start"}
        </button>
      </div>
    );
  }

  if (status === "ONGOING") {
    return (
      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="button"
          onClick={() => handleComplete(orderId)}
          disabled={isBusy}
          className="px-4 py-2 rounded-md bg-[#3E83C4] text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBusy ? "Please wait..." : "Completed"}
        </button>
      </div>
    );
  }

  if (status === "COMPLETED") {
    if (canDeleteOrder(rawStatus)) {
      return (
        <div className="flex flex-wrap gap-3 mt-5">
          <button
            type="button"
            onClick={() => handleDelete(orderId, rawStatus)}
            disabled={isBusy}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm cursor-pointer hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy ? "Deleting..." : "Delete"}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="button"
          disabled
          className="px-4 py-2 rounded-md bg-gray-400 text-white text-sm cursor-not-allowed"
          title={`Cannot delete order with status: ${rawStatus}`}
        >
          Job completed! Waiting for payment.
        </button>
      </div>
    );
  }

  if (status === "OTHER" && canDeleteOrder(rawStatus)) {
    return (
      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="button"
          onClick={() => handleDelete(orderId, rawStatus)}
          disabled={isBusy}
          className="px-4 py-2 rounded-md bg-red-600 text-white text-sm cursor-pointer hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBusy ? "Deleting..." : "Delete"}
        </button>
      </div>
    );
  }

  return null;
};
useEffect(() => {
  setCurrentPage(1);
}, [showAllJobs, searchTerm]);


  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <ArtisanHeader title="Jobs" />

      <div className="mt-6 border border-blue-200 rounded-xl p-4 sm:p-5 lg:p-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <div
  onClick={() => handleCardClick("TOTAL")}
  className={`rounded-xl p-4 space-y-4 bg-[#007bff] text-white min-h-[130px] 
    cursor-pointer transform transition duration-300 hover:scale-101 hover:shadow-xl
    ${showAllJobs ? "ring-2 ring-white" : ""}`}
>


            <p className="text-base sm:text-lg font-bold">Total Jobs</p>
            <p className="text-2xl font-bold">{stats.totalJobs}</p>
          </div>

          <div
  onClick={() => handleCardClick("Completed Jobs")}
  className={`rounded-xl p-4 space-y-4 bg-[#2E8B2E] text-white min-h-[130px] 
  cursor-pointer transform transition duration-300 hover:scale-101 hover:shadow-xl
  ${!showAllJobs && activeTab === "Completed Jobs" ? "ring-2 ring-white" : ""}`}

>

            <p className="text-base sm:text-lg font-bold">Completed Jobs</p>
            <p className="text-2xl font-bold">{stats.completedJobs}</p>
          </div>

          <div
  onClick={() => handleCardClick("Ongoing Jobs")}
             className={`rounded-xl p-4 space-y-4 bg-[#D9A600] text-white min-h-[130px] 
  cursor-pointer transform transition duration-300 hover:scale-101 hover:shadow-xl
  ${!showAllJobs && activeTab === "Ongoing Jobs" ? "ring-2 ring-white" : ""}`}

>

            <p className="text-base sm:text-lg font-bold">Ongoing Jobs</p>
            <p className="text-2xl font-bold">{stats.ongoingJobs}</p>
          </div>

<div
  onClick={() => handleCardClick("Pending Jobs")}
             className={`rounded-xl p-4 space-y-4 bg-[#343e92] text-white min-h-[130px] 
  cursor-pointer transform transition duration-300 hover:scale-101 hover:shadow-xl
  ${!showAllJobs && activeTab === "Pending Jobs" ? "ring-2 ring-white" : ""}`}

>

            <p className="text-base sm:text-lg font-bold">Pending Jobs</p>
            <p className="text-2xl font-bold">{stats.pendingJobs}</p>
          </div>

<div
  onClick={() => handleCardClick("Other Jobs")}
             className={`rounded-xl p-4 space-y-4 bg-[#8B0000] text-white min-h-[130px] 
  cursor-pointer transform transition duration-300 hover:scale-101 hover:shadow-xl
  ${!showAllJobs && activeTab === "Other Jobs" ? "ring-2 ring-white" : ""}`}
>

            <p className="text-base sm:text-lg font-bold">Other Jobs</p>
            <p className="text-2xl font-bold">{stats.otherJobs}</p>
          </div>
        </div>
      </div>

<div
  ref={jobsSectionRef}
  className="mt-5 border border-blue-200 rounded-xl p-4 sm:p-5 lg:p-6 bg-white"
>

{!showAllJobs && (
  <div className="flex gap-4 sm:gap-6 lg:gap-10 text-sm sm:text-base lg:text-lg mb-6 border-b pb-2 overflow-x-auto">
    {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`pb-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.label
                  ? "text-[#3E83C4] border-b-2 border-[#3E83C4]"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab.label}
              {tab.status === "REQUESTED" && stats.requestedJobs > 0 && (
                <span className="ml-2 text-xs">({stats.requestedJobs})</span>
              )}
              {tab.status === "ONGOING" && stats.ongoingJobs > 0 && (
                <span className="ml-2 text-xs">({stats.ongoingJobs})</span>
              )}
              {tab.status === "COMPLETED" && stats.completedJobs > 0 && (
                <span className="ml-2 text-xs">({stats.completedJobs})</span>
              )}
              {tab.status === "PENDING" && stats.pendingJobs > 0 && (
                <span className="ml-2 text-xs">({stats.pendingJobs})</span>
              )}
              {tab.status === "OTHER" && stats.otherJobs > 0 && (
                <span className="ml-2 text-xs">({stats.otherJobs})</span>
              )}
            </button>
          ))}
        </div>
)}
{showAllJobs && (
  <div className="mb-4 flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center">
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <input
        type="text"
        placeholder="Search by client or service..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 border rounded-md text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#3E83C4]"
      />

      <p className="text-sm text-gray-600 self-center">
        Showing {filteredJobs.length} jobs
      </p>
    </div>

    <button
      onClick={() => setShowAllJobs(false)}
      className="text-sm text-[#3E83C4] hover:underline cursor-pointer"
    >
      Back to filtered view
    </button>
  </div>
  
)}


        {loading ? (
          <p className="text-base sm:text-lg text-gray-500">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-base sm:text-lg text-gray-500">
            No jobs found yet for this artisan.
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {(showAllJobs ? paginatedJobs : filteredJobs).map((job, index) => {
  const orderId = job?.id || job?._id || job?.orderId || index;

  const details = extractJobDetails(job); // ✅ ADD THIS LINE

  const clientName =
  job?.client?.fullName ||
  job?.client?.name ||
  job?.clientDetails?.fullName ||
  job?.clientDetails?.name ||
  job?.customer?.fullName ||
  job?.customer?.name ||
  job?.clientName ||
  job?.customerName ||
  "Client";

const clientImage =
  job?.client?.profilePicture ||
  job?.client?.profileImage ||
  job?.client?.avatar ||
  job?.clientDetails?.profilePicture ||
  job?.clientDetails?.profileImage ||
  job?.customer?.profilePicture ||
  job?.customer?.profileImage ||
  job?.customer?.avatar ||
  job?.clientImage ||
  job?.customerImage ||
  "";

              
              const rawLocation =
                job?.location ||
                job?.address ||
                job?.clientAddress;

             

              const rawPrice = job?.price ?? job?.amount ?? job?.budget;
              const status = normalizeStatus(job?.status);

              return (
                
                <div
                  key={orderId}
                  className="border border-blue-200 rounded-xl p-4 sm:p-5"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pb-3 border-b">
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      

                      <img
  src={clientImage || profileImage}
  alt={clientName}
  className="w-10 h-10 rounded-full object-cover shrink-0"
  onError={(e) => {
    e.currentTarget.src = profileImage;
  }}
/>

                      <div className="min-w-0">
                        <p className="font-semibold break-words">{clientName}</p>
                        <span className="text-xs sm:text-sm text-gray-400 break-words">
                          {job?.createdAt
                            ? new Date(job.createdAt).toLocaleDateString()
                            : "No date"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-sm font-medium break-words ${getStatusColor(
                        status
                      )}`}
                    >
                      {status === "OTHER"
                        ? String(job?.status || "OTHER").toUpperCase()
                        : status || "UNKNOWN"}
                    </span>
                  </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 text-sm">
  <div className="space-y-3">
    <p className="break-words">
  <span className="font-medium">Device Type :</span>{" "}
  {details.deviceType}
</p>

<p className="break-words">
  <span className="font-medium">Device Brand :</span>{" "}
  {details.deviceBrand}
</p>

<p className="break-words">
  <span className="font-medium">Device Model :</span>{" "}
  {details.deviceModel}

</p>

    <p className="break-words">
      <span className="font-medium">Booking ID :</span>{" "}
      {job?.id || job?._id || job?.orderId || "N/A"}
    </p>
  </div>

  <div className="space-y-3">
    <p className="break-words">
      <span className="font-medium">Issue Description :</span>{" "}
      {details.description}
    </p>

    <p className="break-words">
      <span className="font-medium">Location :</span>{" "}
      {formatLocation(rawLocation)}
    </p>

    <p className="break-words">
      <span className="font-medium">Price :</span>{" "}
      {formatPrice(rawPrice)}
    </p>
  </div>
</div>

                  {renderActions(job)}
                </div>
              );
            })}
            </div>
)}

{/* ✅ ADD IT HERE — RIGHT AFTER JOB LIST */}
{showAllJobs && totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50"
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 border rounded cursor-pointer ${
          currentPage === i + 1
            ? "bg-[#3E83C4] text-white"
            : "bg-white"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() =>
        setCurrentPage((p) => Math.min(p + 1, totalPages))
      }
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default JobsBoard;