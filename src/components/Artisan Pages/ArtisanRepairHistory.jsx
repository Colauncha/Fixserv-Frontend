import { useEffect, useMemo, useState } from "react";
import { getArtisanHistory } from "../../api/order.api";
import ArtisanHeader from "./ArtisanHeader";

const normalizeStatus = (status) => {
  const s = String(status || "").toUpperCase();

  if (["DONE", "COMPLETED", "FINISHED"].includes(s)) return "COMPLETED";
  if (["IN_PROGRESS", "STARTED", "ACCEPTED"].includes(s)) return "ONGOING";
  if (["REQUESTED", "NEW"].includes(s)) return "REQUESTED";
  if (["PENDING", "WAITING"].includes(s)) return "PENDING";

  return s;
};

const statusStyle = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-blue-100 text-blue-600";
    case "ONGOING":
      return "bg-green-100 text-green-600";
    case "REQUESTED":
      return "bg-purple-100 text-purple-600";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatPrice = (price) => {
  if (!price && price !== 0) return "N/A";
  return `₦${Number(price).toLocaleString()}`;
};

const ArtisanRepairHistory = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (page === 1) setLoading(true);

        const data = await getArtisanHistory(page);
        const jobsData = data?.orders || data?.data?.orders || [];

        setJobs((prev) => (page === 1 ? jobsData : [...prev, ...jobsData]));
        setHasNextPage(Boolean(data?.hasNextPage || data?.data?.hasNextPage));
      } catch (error) {
        console.log("History error", error);
        if (page === 1) setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page]);

  const completedJobs = useMemo(() => {
    return jobs.filter((j) => normalizeStatus(j?.status) === "COMPLETED");
  }, [jobs]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <ArtisanHeader title="Repair History" />

      <div className="mt-4">
        <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Repairs
            </h2>

            <button
              disabled={!hasNextPage}
              onClick={() => hasNextPage && setPage((p) => p + 1)}
              className={`text-sm font-medium transition text-left sm:text-right ${
                hasNextPage
                  ? "text-blue-500 hover:text-blue-600 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              View All →
            </button>
          </div>

          <div className="relative border-l border-gray-200 ml-2 sm:ml-4 space-y-6 sm:space-y-8">
            {loading && page === 1 && (
              <p className="text-sm text-gray-500 pl-6">Loading history...</p>
            )}

            {!loading && completedJobs.length === 0 && (
              <p className="text-sm text-gray-500 pl-6">
                No repair history available yet.
              </p>
            )}

            {completedJobs.map((job, index) => {
              const clientName =
                job?.clientName ||
                job?.client?.fullName ||
                job?.customerName ||
                "Client";

              const repairType =
                job?.service ||
                job?.deviceType ||
                job?.repairType ||
                "Repair";

              const location =
                job?.location ||
                job?.address ||
                job?.clientAddress ||
                "N/A";

              const duration = job?.duration || "N/A";
              const price = job?.price ?? job?.amount ?? job?.budget;
              const status = normalizeStatus(job?.status);

              const date = job?.createdAt
                ? new Date(job.createdAt).toLocaleDateString()
                : "";

              return (
                <div key={job?._id || job?.id || index} className="relative pl-6 sm:pl-8">
                  <span className="absolute -left-[7px] sm:-left-[10px] top-2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#3E83C4] rounded-full"></span>

                  <div className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex gap-3 sm:gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#3E83C4] text-white flex items-center justify-center font-semibold shrink-0">
                          {clientName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 break-words">
                            {clientName}
                          </p>

                          <p className="text-xs text-gray-400">{date}</p>

                          <p className="text-sm text-gray-600 mt-2 break-words">
                            <span className="font-medium">Repair Type:</span>{" "}
                            {repairType}
                          </p>

                          <p className="text-sm text-gray-600 break-words">
                            <span className="font-medium">Location:</span>{" "}
                            {location}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 items-start lg:items-end text-left lg:text-right">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                        <p className="text-sm text-gray-600 break-words">
                          Duration: {duration}
                        </p>

                        <p className="text-sm font-semibold text-gray-800 break-words">
                          {formatPrice(price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && page > 1 && (
              <p className="text-sm text-gray-500 pl-6">Loading more...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanRepairHistory;