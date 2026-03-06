import { useEffect, useState } from "react";
import { getAuthToken } from "../../utils/auth";


const tabs = [
  { label: "Job Requests", status: "REQUESTED" },
  { label: "Ongoing Jobs", status: "ONGOING" },
  { label: "Completed Jobs", status: "COMPLETED" },
  { label: "Pending Jobs", status: "PENDING" },
];

const JobsBoard = () => {
  const [activeTab, setActiveTab] = useState("Job Requests");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeStatus =
  tabs.find(tab => tab.label === activeTab)?.status;

const filteredJobs = jobs.filter(job => job.status === activeStatus);

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await fetch(
        "https://user-management-h4hg.onrender.com/api/artisan/jobs",
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);


  return (
    <div className="mt-10 border border-blue-200 rounded-xl p-6 bg-white">

      {/* Tabs */}
      <div className="flex gap-8 text-sm mb-6 border-b pb-2">
  {tabs.map(tab => (
    <button
      key={tab.label}
      onClick={() => setActiveTab(tab.label)}
      className={`pb-2 transition ${
        activeTab === tab.label
          ? "text-[#3E83C4] border-b-2 border-[#3E83C4]"
          : "text-gray-500 hover:text-black"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>


      {/* Job Cards */}
      {loading ? (
  <p className="text-sm text-gray-500">Loading jobs...</p>
) : filteredJobs.length === 0 ? (
  <p className="text-sm text-gray-500">No jobs found</p>
) : (
  <div className="space-y-6">
    {filteredJobs.map(job => (
      <div key={job.id} className="border border-blue-200 rounded-xl p-5">

        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3E83C4] text-white flex items-center justify-center font-semibold">
              {job.clientName?.charAt(0)}
            </div>
            <p className="font-semibold">{job.clientName}</p>
            <span className="text-sm text-gray-400">
              {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>

          <span className={`text-sm font-medium ${
            job.status === "AVAILABLE" ? "text-green-500" :
            job.status === "COMPLETED" ? "text-blue-500" :
            job.status === "PENDING" ? "text-yellow-500" :
            "text-gray-500"
          }`}>
            {job.status}
          </span>
        </div>

        {/* Body */}
        <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">
          <div className="space-y-3">
            <p>
              <span className="font-medium">Repair Type :</span>{" "}
              {job.service}
            </p>
            <p>
              <span className="font-medium">Location :</span>{" "}
              {job.location}
            </p>
          </div>

          <div className="space-y-3">
            <p>
              <span className="font-medium">Duration :</span>{" "}
              {job.duration}
            </p>
            <p>
              <span className="font-medium">Price :</span>{" "}
              NGN {job.price}
            </p>
          </div>
        </div>

      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default JobsBoard;
