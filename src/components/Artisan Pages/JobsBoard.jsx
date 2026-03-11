import { useEffect, useMemo, useState } from "react";
import { getArtisanHistory } from "../../api/order.api";
import ArtisanHeader from "../Artisan Pages/ArtisanHeader";

const tabs = [
  { label: "Job Requests", status: "REQUESTED" },
  { label: "Ongoing Jobs", status: "ONGOING" },
  { label: "Completed Jobs", status: "COMPLETED" },
  { label: "Pending Jobs", status: "PENDING" },
];

const normalizeStatus = (status) => {
  const value = String(status || "").toUpperCase();

  if (["REQUESTED", "NEW"].includes(value)) return "REQUESTED";

  if (["ACCEPTED", "IN_PROGRESS", "STARTED"].includes(value)) {
    return "ONGOING";
  }

  if (["DONE", "COMPLETED", "FINISHED"].includes(value)) {
    return "COMPLETED";
  }

  if (["PENDING", "WAITING"].includes(value)) {
    return "PENDING";
  }

  return value;
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
    default:
      return "text-gray-500";
  }
};

const JobsBoard = () => {
  const [activeTab, setActiveTab] = useState("Job Requests");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const data = await getArtisanHistory();
        const jobsData = data?.orders || data?.data?.orders || data;

        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const activeStatus = tabs.find((tab) => tab.label === activeTab)?.status;

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => normalizeStatus(job?.status) === activeStatus);
  }, [jobs, activeStatus]);

  const stats = useMemo(() => {
    const result = {
      totalJobs: jobs.length,
      completedJobs: 0,
      ongoingJobs: 0,
      pendingJobs: 0,
      requestedJobs: 0,
    };

    jobs.forEach((job) => {
      const status = normalizeStatus(job?.status);

      if (status === "COMPLETED") result.completedJobs++;
      if (status === "ONGOING") result.ongoingJobs++;
      if (status === "PENDING") result.pendingJobs++;
      if (status === "REQUESTED") result.requestedJobs++;
    });

    return result;
  }, [jobs]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <ArtisanHeader title="Jobs" />

      <div className="mt-6 border border-blue-200 rounded-xl p-4 sm:p-5 lg:p-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-xl p-4 space-y-4 bg-[#007bff] text-white min-h-[130px]">
            <p className="text-base sm:text-lg font-bold">Total Jobs</p>
            <p className="text-2xl font-bold">{stats.totalJobs}</p>
          </div>

          <div className="rounded-xl p-4 space-y-4 bg-[#2E8B2E] text-white min-h-[130px]">
            <p className="text-base sm:text-lg font-bold">Completed Jobs</p>
            <p className="text-2xl font-bold">{stats.completedJobs}</p>
          </div>

          <div className="rounded-xl p-4 space-y-4 bg-[#D9A600] text-white min-h-[130px]">
            <p className="text-base sm:text-lg font-bold">Ongoing Jobs</p>
            <p className="text-2xl font-bold">{stats.ongoingJobs}</p>
          </div>

          <div className="rounded-xl p-4 space-y-4 bg-[#343e92] text-white min-h-[130px]">
            <p className="text-base sm:text-lg font-bold">Pending Jobs</p>
            <p className="text-2xl font-bold">{stats.pendingJobs}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 border border-blue-200 rounded-xl p-4 sm:p-5 lg:p-6 bg-white">
        <div className="flex gap-4 sm:gap-6 lg:gap-10 text-sm sm:text-base lg:text-lg mb-6 border-b pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`pb-2 transition whitespace-nowrap ${
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
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-base sm:text-lg text-gray-500">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-base sm:text-lg text-gray-500">
            No jobs found yet for this artisan.
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredJobs.map((job, index) => {
              const orderId = job?.id || job?._id || job?.orderId || index;
              const clientName =
                job?.clientName ||
                job?.client?.fullName ||
                job?.customerName ||
                "Client";

              const repairType =
                job?.service ||
                job?.serviceRequired ||
                job?.repairType ||
                job?.deviceType ||
                "N/A";

              const location =
                job?.location ||
                job?.address ||
                job?.clientAddress ||
                "N/A";

              const duration = job?.duration || "N/A";
              const rawPrice = job?.price ?? job?.amount ?? job?.budget;
              const status = normalizeStatus(job?.status);

              return (
                <div
                  key={orderId}
                  className="border border-blue-200 rounded-xl p-4 sm:p-5"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pb-3 border-b">
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#3E83C4] text-white flex items-center justify-center font-semibold shrink-0">
                        {clientName?.charAt(0)?.toUpperCase() || "C"}
                      </div>

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
                      {status || "UNKNOWN"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 text-sm">
                    <div className="space-y-3">
                      <p className="break-words">
                        <span className="font-medium">Repair Type :</span>{" "}
                        {repairType}
                      </p>
                      <p className="break-words">
                        <span className="font-medium">Location :</span>{" "}
                        {location}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="break-words">
                        <span className="font-medium">Duration :</span>{" "}
                        {duration}
                      </p>
                      <p className="break-words">
                        <span className="font-medium">Price :</span>{" "}
                        {rawPrice != null ? `NGN ${rawPrice}` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsBoard;